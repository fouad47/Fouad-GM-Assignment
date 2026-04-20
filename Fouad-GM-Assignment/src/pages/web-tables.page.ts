/**
 * Web Tables Page Object
 * ======================
 * Encapsulates interactions with the Web Tables page at /webtables.
 * Supports adding, editing, and searching records in the table.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

/** Data structure for a Web Table record */
export interface WebTableRecord {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  salary: string;
  department: string;
}

export class WebTablesPage extends BasePage {
  // Locators
  private readonly addButton: Locator;
  private readonly searchBox: Locator;
  private readonly tableRows: Locator;

  // Registration form locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly ageInput: Locator;
  private readonly salaryInput: Locator;
  private readonly departmentInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, 'WebTablesPage');

    // Main page elements
    this.addButton = page.locator('#addNewRecordButton');
    this.searchBox = page.locator('#searchBox');
    this.tableRows = page.locator('.rt-tr-group');

    // Registration form fields
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.ageInput = page.locator('#age');
    this.salaryInput = page.locator('#salary');
    this.departmentInput = page.locator('#department');
    this.submitButton = page.locator('#submit');
  }

  /** Navigate to the Web Tables page */
  async goto(): Promise<void> {
    await this.navigateTo('/webtables');
    await this.removeAdsAndFooter();
  }

  /** Click the Add button to open the registration form */
  async clickAdd(): Promise<void> {
    this.logger.step('Clicking Add button');
    await this.addButton.click();
  }

  /**
   * Fill the registration form with provided data and submit.
   */
  async fillAndSubmitForm(record: WebTableRecord): Promise<void> {
    this.logger.step(`Filling form with: ${record.firstName} ${record.lastName}`);

    await this.firstNameInput.fill(record.firstName);
    await this.lastNameInput.fill(record.lastName);
    await this.emailInput.fill(record.email);
    await this.ageInput.fill(record.age);
    await this.salaryInput.fill(record.salary);
    await this.departmentInput.fill(record.department);

    this.logger.step('Submitting form');
    await this.submitButton.click();
    // Wait for the modal to close and table to refresh
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Add a new record to the table (click Add + fill + submit).
   */
  async addRecord(record: WebTableRecord): Promise<void> {
    await this.clickAdd();
    await this.fillAndSubmitForm(record);
    this.logger.info(`Record added: ${record.firstName} ${record.lastName}`);
  }

  /**
   * Search the table using the search box.
   */
  async search(text: string): Promise<void> {
    this.logger.step(`Searching for: ${text}`);
    // Clear the search box explicitly first
    await this.searchBox.click();
    await this.page.keyboard.press('Control+A');
    await this.page.keyboard.press('Backspace');
    await this.searchBox.fill(text);
    // Wait for the search to filter (there's a small lag in DemoQA's filtering)
    await this.page.waitForTimeout(500);
  }

  /**
   * Get all visible (non-empty) row data from the table.
   * Returns an array of text content arrays.
   */
  async getVisibleRows(): Promise<string[][]> {
    const rows: string[][] = [];
    const rowCount = await this.tableRows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = this.tableRows.nth(i);
      const cells = row.locator('.rt-td');
      const firstCellText = await cells.nth(0).textContent();

      // Skip empty rows (they have whitespace-only cells or just no text)
      if (firstCellText && firstCellText.trim() !== '' && firstCellText.trim() !== '\u00a0') {
        const rowData: string[] = [];
        const cellCount = await cells.count();
        for (let j = 0; j < cellCount - 1; j++) {
          // Exclude last cell (actions column)
          const cellText = await cells.nth(j).textContent();
          rowData.push(cellText?.trim() || '');
        }
        rows.push(rowData);
      }
    }

    this.logger.debug(`Found ${rows.length} visible rows`);
    return rows;
  }

  /**
   * Verify that a record exists in the table by first name.
   */
  async assertRecordExists(firstName: string): Promise<void> {
    this.logger.step(`Asserting record exists: ${firstName}`);
    // Brief wait for table refresh
    await this.page.waitForTimeout(500);
    const cell = this.page.locator(`.rt-td:has-text("${firstName}")`).first();
    await cell.waitFor({ state: 'visible', timeout: 5000 });
    await expect(cell).toBeVisible();
    this.logger.info(`Record found: ${firstName}`);
  }

  /**
   * Verify a full record exists with all expected values.
   */
  async assertRecordData(record: WebTableRecord): Promise<void> {
    this.logger.step(`Asserting full record data for: ${record.firstName}`);
    // Search to isolate the row
    await this.search(record.firstName);

    const row = this.tableRows.first();
    const cells = row.locator('.rt-td');

    await expect(cells.nth(0)).toHaveText(record.firstName);
    await expect(cells.nth(1)).toHaveText(record.lastName);
    await expect(cells.nth(2)).toHaveText(record.age);
    await expect(cells.nth(3)).toHaveText(record.email);
    await expect(cells.nth(4)).toHaveText(record.salary);
    await expect(cells.nth(5)).toHaveText(record.department);

    this.logger.info('Record data verified successfully');
    // Clear search
    await this.searchBox.clear();
  }

  /**
   * Click the edit button for a row containing the given text.
   */
  async clickEditForRow(containingText: string): Promise<void> {
    this.logger.step(`Clicking edit for row containing: ${containingText}`);
    const row = this.page.locator('.rt-tr-group', { hasText: containingText }).first();
    await row.locator('[title="Edit"]').click();
    this.logger.info(`Edit clicked for row: ${containingText}`);
  }

  /**
   * Edit an existing record — clears fields and fills with new data.
   */
  async editRecord(searchText: string, newData: Partial<WebTableRecord>): Promise<void> {
    this.logger.step(`Editing record: ${searchText}`);

    await this.clickEditForRow(searchText);

    // Clear and fill only provided fields
    if (newData.firstName !== undefined) {
      await this.firstNameInput.clear();
      await this.firstNameInput.fill(newData.firstName);
    }
    if (newData.lastName !== undefined) {
      await this.lastNameInput.clear();
      await this.lastNameInput.fill(newData.lastName);
    }
    if (newData.email !== undefined) {
      await this.emailInput.clear();
      await this.emailInput.fill(newData.email);
    }
    if (newData.age !== undefined) {
      await this.ageInput.clear();
      await this.ageInput.fill(newData.age);
    }
    if (newData.salary !== undefined) {
      await this.salaryInput.clear();
      await this.salaryInput.fill(newData.salary);
    }
    if (newData.department !== undefined) {
      await this.departmentInput.clear();
      await this.departmentInput.fill(newData.department);
    }

    await this.submitButton.click();
    // Wait for the modal to close and table to refresh
    await this.page.waitForLoadState('networkidle');
    this.logger.info(`Record updated for: ${searchText}`);
  }

  /**
   * Delete a record by the text it contains.
   */
  async deleteRecord(containingText: string): Promise<void> {
    this.logger.step(`Deleting record: ${containingText}`);
    const row = this.page.locator('.rt-tr-group', { hasText: containingText }).first();
    await row.locator('[title="Delete"]').click();
    this.logger.info(`Record deleted: ${containingText}`);
  }
}
