/**
 * Navigation Component
 * ====================
 * Handles left-side menu navigation on DemoQA.
 * Used across multiple page objects to navigate to specific sections.
 */

import { Page } from '@playwright/test';
import { createLogger } from '../utils/logger';

const logger = createLogger('Navigation');

export class NavigationComponent {
  constructor(private page: Page) {}

  /**
   * Navigate to a specific menu item by its visible text.
   * Handles the accordion-style left menu on DemoQA.
   */
  async navigateToMenuItem(category: string, item: string): Promise<void> {
    logger.step(`Navigating to ${category} > ${item}`);

    // Expand the category group if not already expanded
    const categoryHeader = this.page.locator('.element-group', { hasText: category });
    const listWrapper = categoryHeader.locator('.element-list.collapse');
    const isExpanded = await listWrapper.evaluate((el) =>
      el.classList.contains('show')
    ).catch(() => false);

    if (!isExpanded) {
      await categoryHeader.locator('.header-text').click();
      await this.page.waitForTimeout(300); // Wait for accordion animation
    }

    // Click the specific menu item
    await categoryHeader.locator(`li:has-text("${item}")`).click();
    logger.info(`Navigated to ${item}`);
  }

  /**
   * Navigate directly to a page via URL path
   */
  async navigateToPath(path: string): Promise<void> {
    logger.step(`Navigating to path: ${path}`);
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
    logger.info(`Page loaded: ${path}`);
  }
}
