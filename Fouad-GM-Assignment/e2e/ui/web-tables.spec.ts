/**
 * TC01 — Web Tables Tests
 * =======================
 * Scenario A: Add new record and validate it appears in the table.
 * Scenario B: Edit the row where first name is "Alden", update department
 *             to "Gerimedica BV", and validate the update.
 */

import { test, expect } from '../../src/fixtures/ui.fixture';
import { newRecord, editData, editTargetFirstName } from '../../test-data/ui/web-tables.data';

test.describe('TC01 — Web Tables', () => {
  /**
   * TC01 Scenario A: Add new record
   * Steps:
   *   1. Click Add button
   *   2. Fill the registration form with test data
   *   3. Submit the form
   *   4. Assert the new record appears in the table
   */
  test('TC01-A: Should add a new record and validate it appears in the table', async ({
    webTablesPage,
  }) => {
    // Step 1-3: Add the new record
    await webTablesPage.addRecord(newRecord);

    // Step 4: Validate the new record exists in the table
    await webTablesPage.assertRecordExists(newRecord.firstName);

    // Deep validation: check all field values
    await webTablesPage.assertRecordData(newRecord);
  });

  /**
   * TC01 Scenario B: Edit existing record
   * Steps:
   *   1. Find the row where firstName is "Alden"
   *   2. Click edit on that row
   *   3. Update the department to "Gerimedica BV"
   *   4. Submit the changes
   *   5. Validate the department is updated
   */
  test('TC01-B: Should edit Alden row and update department to Gerimedica BV', async ({
    webTablesPage,
    page,
  }) => {
    // Step 1-4: Edit the Alden row's department
    await webTablesPage.editRecord(editTargetFirstName, editData);

    // Step 5: Validate the update — search for the row and check department
    await webTablesPage.search(editTargetFirstName);

    // Assert the department cell has been updated
    const row = page.locator('.rt-tr-group', { hasText: editTargetFirstName }).first();
    const departmentCell = row.locator('.rt-td').nth(5);
    await expect(departmentCell).toHaveText(editData.department!);
  });
});
