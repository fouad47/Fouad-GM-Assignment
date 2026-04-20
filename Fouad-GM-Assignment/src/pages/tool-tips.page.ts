/**
 * Tool Tips Page Object
 * =====================
 * Encapsulates interactions with the Tool Tips page at /tool-tips.
 * Validates tooltip text on hover over various elements.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ToolTipsPage extends BasePage {
  private readonly hoverButton: Locator;
  private readonly hoverTextField: Locator;

  constructor(page: Page) {
    super(page, 'ToolTipsPage');

    this.hoverButton = page.locator('#toolTipButton');
    this.hoverTextField = page.locator('#toolTipTextField');
  }

  /** Navigate to the Tool Tips page */
  async goto(): Promise<void> {
    await this.navigateTo('/tool-tips');
    await this.removeAdsAndFooter();
  }

  /**
   * Hover over the button and wait for tooltip to appear.
   * Returns the tooltip text.
   */
  async hoverButtonAndGetTooltip(): Promise<string> {
    this.logger.step('Hovering over button to trigger tooltip');
    await this.hoverButton.hover();

    // Wait for tooltip to become visible
    const tooltip = this.page.locator('.tooltip-inner');
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });

    const text = await tooltip.textContent();
    this.logger.info(`Button tooltip text: "${text}"`);
    return text || '';
  }

  /**
   * Hover over the text field and wait for tooltip to appear.
   * Returns the tooltip text.
   */
  async hoverTextFieldAndGetTooltip(): Promise<string> {
    this.logger.step('Hovering over text field to trigger tooltip');
    await this.hoverTextField.hover();

    const tooltip = this.page.locator('.tooltip-inner');
    await tooltip.waitFor({ state: 'visible', timeout: 5000 });

    const text = await tooltip.textContent();
    this.logger.info(`Text field tooltip text: "${text}"`);
    return text || '';
  }

  /**
   * Assert the button tooltip matches expected text.
   */
  async assertButtonTooltip(expectedText: string): Promise<void> {
    const tooltipText = await this.hoverButtonAndGetTooltip();
    expect(tooltipText).toBe(expectedText);
    this.logger.info('Button tooltip assertion passed');
  }

  /**
   * Assert the text field tooltip matches expected text.
   */
  async assertTextFieldTooltip(expectedText: string): Promise<void> {
    const tooltipText = await this.hoverTextFieldAndGetTooltip();
    expect(tooltipText).toBe(expectedText);
    this.logger.info('Text field tooltip assertion passed');
  }

  /**
   * Check if a tooltip is currently visible.
   */
  async isTooltipVisible(): Promise<boolean> {
    const tooltip = this.page.locator('.tooltip-inner');
    return await tooltip.isVisible();
  }
}
