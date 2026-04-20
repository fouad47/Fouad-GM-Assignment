/**
 * TC03 — Practice Form Submission
 * ================================
 * Submits the Practice Form with full data including file upload.
 * Validates all submitted values appear in the submission modal.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';
import { fullFormData, expectedModalValues } from '../../test-data/ui/practice-form.data';
import { getTestDataPath } from '../../src/utils/file-helper';
import path from 'path';

test.describe('TC03 — Practice Form', () => {
  /**
   * TC03: Submit Practice Form with full data
   * Steps:
   *   1. Navigate to the Practice Form
   *   2. Fill all form fields (name, email, gender, mobile, DOB, subjects,
   *      hobbies, file upload, address, state, city)
   *   3. Submit the form
   *   4. Validate the submission modal appears
   *   5. Validate each submitted value in the modal table
   */
  test('TC03: Should submit practice form with full data and validate submission modal', async ({
    practiceFormPage,
  }) => {
    // Prepare form data with the upload file path
    const uploadFilePath = path.resolve(process.cwd(), 'test-data', 'ui', 'upload-sample.txt');

    const formData = {
      ...fullFormData,
      picture: uploadFilePath,
    };

    // Step 2-3: Fill and submit the form
    await practiceFormPage.fillAndSubmit(formData);

    // Step 4-5: Validate the submission modal
    await practiceFormPage.assertSubmissionModal(expectedModalValues);
  });

  /**
   * Additional: Validate file name appears in the modal
   */
  test('TC03: Should show uploaded file name in submission modal', async ({
    practiceFormPage,
  }) => {
    const uploadFilePath = path.resolve(process.cwd(), 'test-data', 'ui', 'upload-sample.txt');

    const formData = {
      ...fullFormData,
      picture: uploadFilePath,
    };

    await practiceFormPage.fillAndSubmit(formData);

    // Check that the Picture row in the modal shows the file name
    await practiceFormPage.modal.waitForModal();
    const pictureValue = await practiceFormPage.modal.getTableValue('Picture');
    expect(pictureValue).toContain('upload-sample.txt');
  });
});
