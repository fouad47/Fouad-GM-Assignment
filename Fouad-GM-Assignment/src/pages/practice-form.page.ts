/**
 * Practice Form Page Object
 * =========================
 * Encapsulates interactions with the Automation Practice Form at /automation-practice-form.
 * Handles all form fields including file upload and date picker.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ModalComponent } from '../components/modal.component';

/** Full form data structure */
export interface PracticeFormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  dateOfBirth?: string;
  subjects?: string[];
  hobbies?: string[];
  picture?: string; // File path for upload
  currentAddress?: string;
  state?: string;
  city?: string;
}

export class PracticeFormPage extends BasePage {
  // Form field locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly mobileInput: Locator;
  private readonly dateOfBirthInput: Locator;
  private readonly subjectInput: Locator;
  private readonly currentAddressInput: Locator;
  private readonly submitButton: Locator;
  private readonly uploadInput: Locator;

  // Modal component for submission result
  public readonly modal: ModalComponent;

  constructor(page: Page) {
    super(page, 'PracticeFormPage');

    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.subjectInput = page.locator('#subjectsInput');
    this.currentAddressInput = page.locator('#currentAddress');
    this.submitButton = page.locator('#submit');
    this.uploadInput = page.locator('#uploadPicture');

    this.modal = new ModalComponent(page);
  }

  /** Navigate to the Practice Form page */
  async goto(): Promise<void> {
    await this.navigateTo('/automation-practice-form');
    await this.removeAdsAndFooter();
  }

  /** Select gender radio button */
  private async selectGender(gender: string): Promise<void> {
    this.logger.step(`Selecting gender: ${gender}`);
    // Use label click since the actual radio input is hidden
    await this.page.locator(`label:has-text("${gender}")`).click();
  }

  /** Set date of birth using keyboard input */
  private async setDateOfBirth(date: string): Promise<void> {
    this.logger.step(`Setting date of birth: ${date}`);
    await this.dateOfBirthInput.click();
    // Select all and replace with keyboard
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.type(date);
    await this.page.keyboard.press('Enter');
  }

  /** Add subjects using autocomplete */
  private async addSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      this.logger.step(`Adding subject: ${subject}`);
      await this.subjectInput.fill(subject);
      // Wait for autocomplete dropdown and select first option
      await this.page.locator('.subjects-auto-complete__option').first().click();
    }
  }

  /** Select hobbies checkboxes */
  private async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      this.logger.step(`Selecting hobby: ${hobby}`);
      await this.page.locator(`label:has-text("${hobby}")`).click();
    }
  }

  /** Upload a file */
  private async uploadFile(filePath: string): Promise<void> {
    this.logger.step(`Uploading file: ${filePath}`);
    await this.uploadInput.setInputFiles(filePath);
  }

  /** Select state from dropdown */
  private async selectState(state: string): Promise<void> {
    this.logger.step(`Selecting state: ${state}`);
    await this.page.locator('#state').click();
    await this.page.locator(`#react-select-3-option-0`).click(); // Select first available state
    // More precise: find the option by text
    await this.page.locator('#state').click();
    await this.page.locator(`div[id*="react-select-3-option"]`, { hasText: state }).click();
  }

  /** Select city from dropdown */
  private async selectCity(city: string): Promise<void> {
    this.logger.step(`Selecting city: ${city}`);
    await this.page.locator('#city').click();
    await this.page.locator(`div[id*="react-select-4-option"]`, { hasText: city }).click();
  }

  /**
   * Fill the entire form with provided data and submit.
   */
  async fillAndSubmit(data: PracticeFormData): Promise<void> {
    this.logger.step('Filling practice form');

    // Required fields
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.selectGender(data.gender);
    await this.mobileInput.fill(data.mobile);

    // Optional fields
    if (data.dateOfBirth) {
      await this.setDateOfBirth(data.dateOfBirth);
    }

    if (data.subjects && data.subjects.length > 0) {
      await this.addSubjects(data.subjects);
    }

    if (data.hobbies && data.hobbies.length > 0) {
      await this.selectHobbies(data.hobbies);
    }

    if (data.picture) {
      await this.uploadFile(data.picture);
    }

    if (data.currentAddress) {
      await this.currentAddressInput.fill(data.currentAddress);
    }

    if (data.state) {
      await this.scrollIntoView(this.page.locator('#state'));
      await this.selectState(data.state);
    }

    if (data.city) {
      await this.selectCity(data.city);
    }

    // Submit the form
    this.logger.step('Submitting form');
    await this.scrollIntoView(this.submitButton);
    await this.submitButton.click();

    this.logger.info('Form submitted successfully');
  }

  /**
   * Validate the submission modal contains expected values.
   */
  async assertSubmissionModal(expectedData: Partial<Record<string, string>>): Promise<void> {
    this.logger.step('Validating submission modal');
    await this.modal.waitForModal();

    const title = await this.modal.getTitle();
    expect(title).toContain('Thanks for submitting the form');

    // Validate each expected field in the modal table
    for (const [label, expectedValue] of Object.entries(expectedData)) {
      if (expectedValue) {
        const actualValue = await this.modal.getTableValue(label);
        this.logger.debug(`Checking "${label}": expected="${expectedValue}", actual="${actualValue}"`);
        expect(actualValue).toContain(expectedValue);
      }
    }

    this.logger.info('Submission modal validated successfully');
  }
}
