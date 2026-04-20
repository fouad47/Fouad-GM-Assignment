/**
 * Web Tables Test Data
 * ====================
 * Contains test data for Web Tables page tests.
 * Data-driven approach for adding and editing records.
 */

import { WebTableRecord } from '../../src/pages/web-tables.page';

/** New record to be added (TC01 Scenario A) */
export const newRecord: WebTableRecord = {
  firstName: 'Fouad',
  lastName: 'Automation',
  email: 'fouad.automation@gerimedica.com',
  age: '30',
  salary: '75000',
  department: 'QA Engineering',
};

/** Updated data for editing Alden's row (TC01 Scenario B) */
export const editData: Partial<WebTableRecord> = {
  department: 'Gerimedica BV',
};

/** The name to search for when editing (TC01 Scenario B) */
export const editTargetFirstName = 'Alden';

/** Multiple records for data-driven testing */
export const multipleRecords: WebTableRecord[] = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@test.com',
    age: '25',
    salary: '50000',
    department: 'Engineering',
  },
  {
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@test.com',
    age: '35',
    salary: '60000',
    department: 'Marketing',
  },
];
