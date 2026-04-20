/**
 * TC06 — Drag and Drop
 * =====================
 * Drags an element to a target area and validates the drop success text.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';

test.describe('TC06 — Drag and Drop', () => {
  /**
   * TC06: Drag element to target and validate success
   * Steps:
   *   1. Navigate to the droppable page
   *   2. Verify initial state — drag source says "Drag me"
   *   3. Perform drag and drop to the target area
   *   4. Assert the drop target text changes to "Dropped!"
   *   5. Assert the drop target has visual feedback (highlight)
   */
  test('TC06: Should drag element to target and validate drop success text', async ({
    droppablePage,
  }) => {
    // Step 2: Verify initial state
    const initialText = await droppablePage.getDropTargetText();
    expect(initialText).toBe('Drop Here');

    // Step 3: Perform drag and drop
    await droppablePage.dragToTarget();

    // Step 4: Assert success text
    await droppablePage.assertDropSuccess();

    // Step 5: Assert visual feedback
    await droppablePage.assertDropTargetHighlighted();
  });

  /**
   * Additional: Validate drag source text
   */
  test('TC06: Should display correct drag source text', async ({
    droppablePage,
  }) => {
    const dragText = await droppablePage.getDraggableText();
    expect(dragText).toMatch(/drag me/i);
  });
});
