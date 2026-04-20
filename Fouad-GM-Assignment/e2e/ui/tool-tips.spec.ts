/**
 * TC05 — Tooltip Validation
 * ==========================
 * Hovers over elements and validates tooltip text content.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';

test.describe('TC05 — Tooltip', () => {
  /**
   * TC05: Hover over button and validate tooltip text
   * Steps:
   *   1. Navigate to the tooltip page
   *   2. Hover over the "Hover me to see" button
   *   3. Wait for the tooltip to appear
   *   4. Assert the tooltip text matches expected value
   */
  test('TC05: Should hover over button and validate tooltip text', async ({
    toolTipsPage,
  }) => {
    // Step 2-4: Hover and validate button tooltip
    await toolTipsPage.assertButtonTooltip('You hovered over the Button');
  });

  /**
   * Additional: Hover over text field and validate its tooltip
   */
  test('TC05: Should hover over text field and validate tooltip text', async ({
    toolTipsPage,
  }) => {
    // Hover over the text field and validate its tooltip
    await toolTipsPage.assertTextFieldTooltip('You hovered over the text field');
  });

  /**
   * Additional: Validate tooltip disappears after moving mouse away
   */
  test('TC05: Should hide tooltip when mouse moves away', async ({
    toolTipsPage,
    page,
  }) => {
    // First hover to show tooltip
    await toolTipsPage.hoverButtonAndGetTooltip();

    // Move mouse away to body
    await page.mouse.move(0, 0);
    await page.waitForTimeout(500);

    // Tooltip should no longer be visible
    const isVisible = await toolTipsPage.isTooltipVisible();
    expect(isVisible).toBe(false);
  });
});
