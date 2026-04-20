/**
 * Base Page
 * =========
 * Abstract base page class providing common methods for all page objects.
 * All specific page objects extend this class.
 */

import { Page, Locator, expect } from '@playwright/test';
import { NavigationComponent } from '../components/navigation.component';
import { createLogger } from '../utils/logger';

export abstract class BasePage {
  protected readonly navigation: NavigationComponent;
  protected readonly logger;

  constructor(protected page: Page, loggerContext: string) {
    this.navigation = new NavigationComponent(page);
    this.logger = createLogger(loggerContext);
  }

  /**
   * Navigate to this page's URL path.
   * Each page object defines its own path.
   */
  abstract goto(): Promise<void>;

  /**
   * Navigate to a specific URL path
   */
  protected async navigateTo(path: string): Promise<void> {
    this.logger.step(`Navigating to: ${path}`);
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Remove footer and ads that can interfere with interactions.
   * DemoQA has sticky ads and footers that overlay elements.
   */
  async removeAdsAndFooter(): Promise<void> {
    await this.page.evaluate(() => {
      // Remove fixed footer
      const footer = document.querySelector('footer');
      if (footer) footer.remove();

      // Remove ad frames and fixed banners
      const ads = document.querySelectorAll(
        '#fixedban, .ad, iframe[id*="google_ads"], #adplus-anchor, div[id*="ad-"], div[class*="ad-"], ins.adsbygoogle'
      );
      ads.forEach((ad: Element) => ad.remove());

      // Remove right-side ad column if present
      const rightSide = document.querySelector('.right-panel');
      if (rightSide) rightSide.remove();
      
      // Remove fixed overlay banners
      const banners = document.querySelectorAll('div[id*="google_ads_iframe"]');
      banners.forEach((b: Element) => b.remove());
    });
  }

  /**
   * Helper to select an option from a React-Select dropdown (common in DemoQA).
   */
  async selectReactOption(container: Locator, optionText: string): Promise<void> {
    this.logger.step(`Selecting React option: ${optionText}`);
    await container.click();
    // Wait for the menu to appear
    const option = this.page.locator('div[id*="react-select-"][id*="-option"]', { hasText: optionText });
    await option.scrollIntoViewIfNeeded();
    await option.click();
    this.logger.info(`Option selected: ${optionText}`);
  }

  /**
   * Scroll an element into view to avoid footer/ad overlaps
   */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `reports/screenshots/${name}.png`,
      fullPage: true,
    });
    this.logger.info(`Screenshot saved: ${name}`);
  }
}
