/**
 * UI Test Fixtures
 * ================
 * Extends Playwright's base test with custom fixtures for UI tests.
 * Provides pre-configured page objects ready to use in tests.
 */

import { test as base } from '@playwright/test';
import { WebTablesPage } from '../pages/web-tables.page';
import { BrokenImagesPage } from '../pages/broken-images.page';
import { PracticeFormPage } from '../pages/practice-form.page';
import { ProgressBarPage } from '../pages/progress-bar.page';
import { ToolTipsPage } from '../pages/tool-tips.page';
import { DroppablePage } from '../pages/droppable.page';

/** Type definition for all UI page fixtures */
type UIFixtures = {
  webTablesPage: WebTablesPage;
  brokenImagesPage: BrokenImagesPage;
  practiceFormPage: PracticeFormPage;
  progressBarPage: ProgressBarPage;
  toolTipsPage: ToolTipsPage;
  droppablePage: DroppablePage;
};

/**
 * Extended test object with automatic page object instantiation.
 * Each fixture navigates to its page and removes ads automatically.
 */
export const test = base.extend<UIFixtures>({
  /**
   * Web Tables page fixture — navigates to /webtables before each test.
   */
  webTablesPage: async ({ page }, use) => {
    const webTablesPage = new WebTablesPage(page);
    await webTablesPage.goto();
    await use(webTablesPage);
  },

  /**
   * Broken Images page fixture — navigates to /broken before each test.
   */
  brokenImagesPage: async ({ page }, use) => {
    const brokenImagesPage = new BrokenImagesPage(page);
    await brokenImagesPage.goto();
    await use(brokenImagesPage);
  },

  /**
   * Practice Form page fixture — navigates to /automation-practice-form.
   */
  practiceFormPage: async ({ page }, use) => {
    const practiceFormPage = new PracticeFormPage(page);
    await practiceFormPage.goto();
    await use(practiceFormPage);
  },

  /**
   * Progress Bar page fixture — navigates to /progress-bar.
   */
  progressBarPage: async ({ page }, use) => {
    const progressBarPage = new ProgressBarPage(page);
    await progressBarPage.goto();
    await use(progressBarPage);
  },

  /**
   * Tool Tips page fixture — navigates to /tool-tips.
   */
  toolTipsPage: async ({ page }, use) => {
    const toolTipsPage = new ToolTipsPage(page);
    await toolTipsPage.goto();
    await use(toolTipsPage);
  },

  /**
   * Droppable page fixture — navigates to /droppable.
   */
  droppablePage: async ({ page }, use) => {
    const droppablePage = new DroppablePage(page);
    await droppablePage.goto();
    await use(droppablePage);
  },
});

/** Re-export expect for convenience */
export { expect } from '@playwright/test';
