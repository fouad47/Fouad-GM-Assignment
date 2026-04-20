/**
 * Progress Bar Page Object
 * ========================
 * Encapsulates interactions with the Progress Bar widget at /progress-bar.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProgressBarPage extends BasePage {
  private readonly startStopButton: Locator;
  private readonly progressBar: Locator;
  private readonly resetButton: Locator;

  constructor(page: Page) {
    super(page, 'ProgressBarPage');

    this.startStopButton = page.locator('#startStopButton');
    this.progressBar = page.locator('.progress-bar');
    this.resetButton = page.locator('#resetButton');
  }

  /** Navigate to the Progress Bar page */
  async goto(): Promise<void> {
    await this.navigateTo('/progress-bar');
    await this.removeAdsAndFooter();
  }

  /** Click Start button to begin progress */
  async clickStart(): Promise<void> {
    this.logger.step('Clicking Start button');
    await this.startStopButton.click();
  }

  /** Click Stop button to pause progress */
  async clickStop(): Promise<void> {
    this.logger.step('Clicking Stop button');
    await this.startStopButton.click();
  }

  /** Click Reset button */
  async clickReset(): Promise<void> {
    this.logger.step('Clicking Reset button');
    await this.resetButton.click();
  }

  /**
   * Get the current progress bar percentage.
   */
  async getProgress(): Promise<number> {
    const text = await this.progressBar.textContent();
    const value = parseInt(text?.replace('%', '') || '0', 10);
    this.logger.debug(`Current progress: ${value}%`);
    return value;
  }

  /**
   * Wait until the progress bar reaches the target percentage.
   * Uses polling to check the value.
   */
  async waitForProgress(targetPercent: number, timeoutMs: number = 30000): Promise<void> {
    this.logger.step(`Waiting for progress to reach ${targetPercent}%`);

    await expect(async () => {
      const currentProgress = await this.getProgress();
      expect(currentProgress).toBeGreaterThanOrEqual(targetPercent);
    }).toPass({
      timeout: timeoutMs,
      intervals: [500], // Check every 500ms
    });

    this.logger.info(`Progress reached ${targetPercent}%`);
  }

  /**
   * Start and wait until progress reaches 100%.
   */
  async startAndWaitForCompletion(): Promise<void> {
    this.logger.step('Starting progress bar and waiting for completion');
    await this.clickStart();
    await this.waitForProgress(100);
    this.logger.info('Progress bar completed at 100%');
  }

  /**
   * Assert that the progress bar shows a specific value.
   */
  async assertProgress(expectedPercent: number): Promise<void> {
    const actual = await this.getProgress();
    expect(actual).toBe(expectedPercent);
    this.logger.info(`Progress bar assertion passed: ${actual}%`);
  }

  /**
   * Assert the aria-valuenow attribute matches expected.
   */
  async assertAriaValue(expectedPercent: number): Promise<void> {
    await expect(this.progressBar).toHaveAttribute(
      'aria-valuenow',
      String(expectedPercent)
    );
  }
}
