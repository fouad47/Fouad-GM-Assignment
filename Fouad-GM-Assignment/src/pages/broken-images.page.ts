/**
 * Broken Images Page Object
 * =========================
 * Encapsulates interactions with the Broken Links - Images page at /broken.
 * Validates image loading status by checking HTTP response codes.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class BrokenImagesPage extends BasePage {
  private readonly images: Locator;

  constructor(page: Page) {
    super(page, 'BrokenImagesPage');
    // Select all images in the main content area
    this.images = page.locator('.col-md-6 img');
  }

  /** Navigate to the broken images page */
  async goto(): Promise<void> {
    await this.navigateTo('/broken');
    await this.removeAdsAndFooter();
  }

  /**
   * Get all image elements on the page.
   */
  async getImageCount(): Promise<number> {
    const count = await this.images.count();
    this.logger.info(`Found ${count} images on the page`);
    return count;
  }

  /**
   * Get the src attribute of an image by index.
   */
  async getImageSrc(index: number): Promise<string> {
    const src = await this.images.nth(index).getAttribute('src');
    return src || '';
  }

  /**
   * Check if an image is broken by fetching its source URL.
   * Returns the HTTP status code.
   */
  async getImageStatus(index: number): Promise<number> {
    const src = await this.getImageSrc(index);
    this.logger.step(`Checking image status for: ${src}`);

    if (!src) {
      this.logger.warn(`Image at index ${index} has no src attribute`);
      return 0;
    }

    // Resolve relative URLs against the page URL
    const fullUrl = new URL(src, this.page.url()).href;

    try {
      const response = await this.page.request.get(fullUrl);
      const status = response.status();
      this.logger.info(`Image ${index} (${fullUrl}): HTTP ${status}`);
      return status;
    } catch (error) {
      this.logger.error(`Failed to fetch image ${index}: ${error}`);
      return 0;
    }
  }

  /**
   * Check all images and return their status details.
   */
  async getAllImageStatuses(): Promise<{ index: number; src: string; status: number; broken: boolean }[]> {
    this.logger.step('Checking all image statuses');
    const results: { index: number; src: string; status: number; broken: boolean }[] = [];
    const count = await this.getImageCount();

    for (let i = 0; i < count; i++) {
      const src = await this.getImageSrc(i);
      const status = await this.getImageStatus(i);
      const isRendered = await this.isImageRendered(i);
      
      results.push({
        index: i,
        src,
        status,
        broken: status !== 200 || !isRendered,
      });
    }

    const brokenCount = results.filter((r) => r.broken).length;
    this.logger.info(`Image check complete: ${brokenCount}/${count} broken`);
    return results;
  }

  /**
   * Check if an image is naturally loaded (rendered) in the browser.
   * Uses naturalWidth check — broken images have naturalWidth of 0.
   */
  async isImageRendered(index: number): Promise<boolean> {
    const img = this.images.nth(index);
    const naturalWidth = await img.evaluate(
      (el: HTMLImageElement) => el.naturalWidth
    );
    return naturalWidth > 0;
  }
}
