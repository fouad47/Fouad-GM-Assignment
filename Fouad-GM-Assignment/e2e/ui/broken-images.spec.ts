/**
 * TC02 — Broken Image Validation
 * ===============================
 * Validates broken images on the /broken page.
 * Uses HTTP response status codes to determine if images are broken.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';

test.describe('TC02 — Broken Image Validation', () => {
  /**
   * TC02: Validate broken images
   * Steps:
   *   1. Navigate to the broken images page
   *   2. Get all images on the page
   *   3. Check each image's HTTP response status
   *   4. Assert that at least one image is broken (status !== 200)
   *   5. Assert that valid images return status 200
   */
  test('TC02: Should identify broken images using HTTP response status', async ({
    brokenImagesPage,
  }) => {
    // Step 2-3: Get all image statuses
    const imageStatuses = await brokenImagesPage.getAllImageStatuses();

    // Step 4: Ensure we found images to validate
    expect(imageStatuses.length).toBeGreaterThan(0);

    // Log each image's status for visibility
    for (const img of imageStatuses) {
      console.log(
        `Image ${img.index}: src="${img.src}" | status=${img.status} | broken=${img.broken}`
      );
    }

    // Step 5: Assert that there is at least one broken image on the page
    // (DemoQA /broken page intentionally has broken images)
    const brokenImages = imageStatuses.filter((img) => img.broken);
    expect(brokenImages.length).toBeGreaterThan(0);

    // Validate that the broken image returns a non-200 status
    for (const img of brokenImages) {
      expect(img.status).not.toBe(200);
    }
  });

  /**
   * Additional: Validate valid images load correctly
   */
  test('TC02: Should confirm valid images return HTTP 200', async ({
    brokenImagesPage,
  }) => {
    const imageStatuses = await brokenImagesPage.getAllImageStatuses();
    const validImages = imageStatuses.filter((img) => !img.broken);

    // If there are valid images, they should all return 200
    for (const img of validImages) {
      expect(img.status).toBe(200);
    }
  });
});
