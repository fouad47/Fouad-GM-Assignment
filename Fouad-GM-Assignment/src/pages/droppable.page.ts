/**
 * Droppable Page Object
 * =====================
 * Encapsulates drag and drop interactions on the Droppable page at /droppable.
 */

import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DroppablePage extends BasePage {
  private readonly draggable: Locator;
  private readonly droppable: Locator;

  constructor(page: Page) {
    super(page, 'DroppablePage');

    // Simple tab is the default — use the #simpleDropContainer for clear targeting
    this.draggable = page.locator('#draggable');
    this.droppable = page.locator('#simpleDropContainer #droppable');
  }

  /** Navigate to the Droppable page */
  async goto(): Promise<void> {
    await this.navigateTo('/droppable');
    await this.removeAdsAndFooter();
  }

  /**
   * Perform drag and drop from the draggable element to the drop target.
   * Uses manual mouse movements for better reliability on flaky sites.
   */
  async dragToTarget(): Promise<void> {
    this.logger.step('Performing manual drag and drop');
    
    // Get bounding boxes
    const dragBox = await this.draggable.boundingBox();
    const dropBox = await this.droppable.boundingBox();

    if (!dragBox || !dropBox) {
      this.logger.error('Could not find bounding boxes for drag/drop');
      // Fallback to standard dragTo if boxes are missing
      await this.draggable.dragTo(this.droppable);
      return;
    }

    // Manual drag sequence with better timing
    await this.page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
    await this.page.mouse.down();
    await this.page.waitForTimeout(200); // Small wait to ensure drag starts
    await this.page.mouse.move(dropBox.x + dropBox.width / 2, dropBox.y + dropBox.height / 2, { steps: 20 });
    await this.page.waitForTimeout(200); // Ensure target registers move
    await this.page.mouse.up();
    
    this.logger.info('Manual drag and drop sequence completed');
  }

  /**
   * Get the text content of the drop target.
   */
  async getDropTargetText(): Promise<string> {
    const text = await this.droppable.textContent();
    this.logger.debug(`Drop target text: "${text}"`);
    return text?.trim() || '';
  }

  /**
   * Assert that the drop was successful by checking the target text.
   * After a successful drop, the text changes to "Dropped!".
   */
  async assertDropSuccess(): Promise<void> {
    this.logger.step('Asserting drop success');
    const text = await this.getDropTargetText();
    // DemoQA uses capitalised "Dropped!"
    expect(text).toBe('Dropped!');
    this.logger.info('Drop success assertion passed');
  }

  /**
   * Assert the drop target has the expected CSS class after drop.
   */
  async assertDropTargetHighlighted(): Promise<void> {
    // After drop, the target gets a colored background
    const bgColor = await this.droppable.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );
    this.logger.debug(`Drop target background: ${bgColor}`);
    // The target should have a non-default background
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
  }

  /**
   * Get the text of the draggable element.
   */
  async getDraggableText(): Promise<string> {
    const text = await this.draggable.textContent();
    return text?.trim() || '';
  }
}
