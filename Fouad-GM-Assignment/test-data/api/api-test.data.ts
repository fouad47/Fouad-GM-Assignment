/**
 * API Test Data
 * =============
 * Contains test data for API tests including endpoints, payloads, and expected values.
 */

/** DemoQA API endpoint paths */
export const API_ENDPOINTS = {
  createUser: '/Account/v1/User',
  generateToken: '/Account/v1/GenerateToken',
  authorized: '/Account/v1/Authorized',
  getUser: (userId: string) => `/Account/v1/User/${userId}`,
  deleteUser: (userId: string) => `/Account/v1/User/${userId}`,
  books: '/BookStore/v1/Books',
  book: '/BookStore/v1/Book',
} as const;

/** Valid user credentials for creating an account */
export const validUserPayload = () => ({
  userName: `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  password: 'Test@12345678',
});

/** Invalid user credentials — weak password */
export const weakPasswordPayload = () => ({
  userName: `testuser_${Date.now()}`,
  password: 'weak',
});

/** Known book ISBNs from the DemoQA bookstore */
export const BOOK_ISBNS = {
  learningJavaScript: '9781449325862',
  designingWebAPIs: '9781449337711',
  speakingJavaScript: '9781449365035',
  programmingJavaScript: '9781593277574',
  eloquentJavaScript: '9781593275846',
  understandingECMAScript: '9781491950296',
} as const;

/** Payload for adding books to a user's collection */
export const addBooksPayload = (userId: string, isbns: string[]) => ({
  userId,
  collectionOfIsbns: isbns.map((isbn) => ({ isbn })),
});

/** Payload for deleting a single book */
export const deleteBookPayload = (userId: string, isbn: string) => ({
  isbn,
  userId,
});

/** Invalid ISBN for negative tests */
export const INVALID_ISBN = '0000000000000';

/** Expected error messages */
export const ERROR_MESSAGES = {
  userExists: 'User exists!',
  weakPassword:
    "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
  isbnNotFound: 'ISBN supplied is not available in Books Collection!',
  isbnNotFoundInUserCollection: "ISBN supplied is not available in User's Collection!",
  unauthorized: 'User not authorized!',
} as const;
