/**
 * TC04 — Progress Bar
 * ====================
 * Starts the progress bar, waits until it reaches 100%, and asserts completion.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';

test.describe('TC04 — Progress Bar', () => {
  /**
   * TC04: Progress bar reaches 100%
   * Steps:
   *   1. Navigate to the progress bar page
   *   2. Click the Start button
   *   3. Wait until the progress bar reaches 100%
   *   4. Assert the progress bar displays 100%
   *   5. Assert the aria-valuenow attribute is 100
   */
  test('TC04: Should start progress bar and wait until it reaches 100 percent', async ({
    progressBarPage,
  }) => {
    // Step 2-3: Start the progress bar and wait for completion
    await progressBarPage.startAndWaitForCompletion();

    // Step 4: Assert progress bar shows 100%
    await progressBarPage.assertProgress(100);

    // Step 5: Assert the aria-valuenow attribute for accessibility
    await progressBarPage.assertAriaValue(100);
  });

  /**
   * Additional: Validate reset functionality
   */
  test('TC04: Should reset progress bar after completion', async ({
    progressBarPage,
    page,
  }) => {
    // Start and reach 100%
    await progressBarPage.startAndWaitForCompletion();
    await progressBarPage.assertProgress(100);

    // Click reset
    await progressBarPage.clickReset();

    // Wait a moment for the reset to take effect
    await page.waitForTimeout(500);

    // Assert progress is back to 0
    await progressBarPage.assertProgress(0);
  });
});
