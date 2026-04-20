/**
 * Practice Form Test Data
 * =======================
 * Contains test data for Practice Form page tests.
 */

import { PracticeFormData } from '../../src/pages/practice-form.page';

/** Full form data for submission test (TC03) */
export const fullFormData: PracticeFormData = {
  firstName: 'Fouad',
  lastName: 'Gerimedica',
  email: 'fouad@gerimedica.com',
  gender: 'Male',
  mobile: '1234567890',
  dateOfBirth: '15 May 1995',
  subjects: ['Maths', 'Computer Science'],
  hobbies: ['Sports', 'Reading'],
  // picture will be set dynamically using the upload-sample.txt file
  currentAddress: '123 Test Street, Amsterdam, Netherlands',
  state: 'NCR',
  city: 'Delhi',
};

/** Expected values in the submission modal */
export const expectedModalValues: Record<string, string> = {
  'Student Name': 'Fouad Gerimedica',
  'Student Email': 'fouad@gerimedica.com',
  'Gender': 'Male',
  'Mobile': '1234567890',
  'Subjects': 'Maths, Computer Science',
  'Hobbies': 'Sports, Reading',
  'Address': '123 Test Street, Amsterdam, Netherlands',
  'State and City': 'NCR Delhi',
};
