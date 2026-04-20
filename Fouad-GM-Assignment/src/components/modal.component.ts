/**
 * Modal Component
 * ===============
 * Reusable component for handling modal dialogs on DemoQA.
 * Used by Practice Form and other pages that display modals.
 */

import { Page, Locator, expect } from '@playwright/test';
import { createLogger } from '../utils/logger';

const logger = createLogger('Modal');

export class ModalComponent {
  private readonly modalContainer: Locator;
  private readonly closeButton: Locator;

  constructor(private page: Page) {
    this.modalContainer = page.locator('.modal-content');
    this.closeButton = page.locator('#closeLargeModal');
  }

  /**
   * Wait for the modal to become visible
   */
  async waitForModal(): Promise<void> {
    logger.step('Waiting for modal to appear');
    await this.modalContainer.waitFor({ state: 'visible', timeout: 10000 });
    logger.info('Modal is visible');
  }

  /**
   * Get the modal title text
   */
  async getTitle(): Promise<string> {
    const title = await this.page.locator('.modal-title').textContent();
    logger.info(`Modal title: ${title}`);
    return title || '';
  }

  /**
   * Get the modal body text content
   */
  async getBodyText(): Promise<string> {
    const body = await this.page.locator('.modal-body').textContent();
    return body || '';
  }

  /**
   * Get a specific value from the modal table by label
   * Used for Practice Form submission modal
   */
  async getTableValue(label: string): Promise<string> {
    const row = this.page.locator('.table-responsive tr', { hasText: label });
    const value = await row.locator('td:nth-child(2)').textContent();
    logger.debug(`Modal value for "${label}": ${value}`);
    return value?.trim() || '';
  }

  /**
   * Close the modal
   */
  async close(): Promise<void> {
    logger.step('Closing modal');
    await this.closeButton.click();
    await this.modalContainer.waitFor({ state: 'hidden' }).catch(() => {
      // Modal might close via backdrop click - that's fine
    });
    logger.info('Modal closed');
  }

  /**
   * Assert modal is visible
   */
  async assertVisible(): Promise<void> {
    await expect(this.modalContainer).toBeVisible();
  }
}
