/**
 * API Tests — Books (Add & Delete)
 * =================================
 * Tests for the BookStore API endpoints:
 *   - POST /BookStore/v1/Books (add books to user collection)
 *   - DELETE /BookStore/v1/Book (delete a book from user collection)
 * Covers happy and negative flows for each endpoint.
 */

import { test, expect } from '../../src/fixtures/api.fixture';
import { apiPost, apiDelete, authHeader } from '../../src/utils/api-helper';
import {
  API_ENDPOINTS,
  BOOK_ISBNS,
  INVALID_ISBN,
  addBooksPayload,
  deleteBookPayload,
  ERROR_MESSAGES,
} from '../../test-data/api/api-test.data';
import { createLogger } from '../../src/utils/logger';

const logger = createLogger('BooksAPI');

test.describe('API — Add Books', () => {
  /**
   * Happy Flow: Add a book to user's collection.
   * Validates:
   *   - Status code is 201
   *   - Response contains the added book's ISBN
   */
  test('Should add a book to user collection successfully (201)', async ({
    authenticatedRequest,
  }) => {
    const { request, token, userId } = authenticatedRequest;
    const isbn = BOOK_ISBNS.learningJavaScript;

    logger.step(`Adding book ${isbn} to user ${userId}`);

    const payload = addBooksPayload(userId, [isbn]);
    const response = await apiPost(request, API_ENDPOINTS.books, payload, {
      headers: authHeader(token),
    });

    // Assert successful addition
    expect(response.status).toBe(201);

    // Assert the response body contains the book
    const body = response.body as { books: { isbn: string }[] };
    expect(body.books).toBeDefined();
    expect(body.books.length).toBe(1);
    expect(body.books[0].isbn).toBe(isbn);

    logger.info(`Book ${isbn} added successfully`);
  });

  /**
   * Negative Flow: Add book with invalid ISBN.
   * Validates:
   *   - Status code is 400
   *   - Error message indicates ISBN not found
   */
  test('Should fail to add book with invalid ISBN (400)', async ({
    authenticatedRequest,
  }) => {
    const { request, token, userId } = authenticatedRequest;

    logger.step('Attempting to add book with invalid ISBN');

    const payload = addBooksPayload(userId, [INVALID_ISBN]);
    const response = await apiPost(request, API_ENDPOINTS.books, payload, {
      headers: authHeader(token),
    });

    // Assert invalid ISBN is rejected
    expect(response.status).toBe(400);
    const body = response.body as { code: string; message: string };
    expect(body.message).toBe(ERROR_MESSAGES.isbnNotFound);

    logger.info('Invalid ISBN correctly rejected');
  });

  /**
   * Negative Flow: Add book without authentication.
   * Validates:
   *   - Status code is 401
   *   - Error message indicates unauthorized
   */
  test('Should fail to add book without auth token (401)', async ({
    unauthenticatedRequest,
  }) => {
    logger.step('Attempting to add book without authentication');

    const payload = addBooksPayload('fake-user-id', [BOOK_ISBNS.learningJavaScript]);
    const response = await apiPost(unauthenticatedRequest, API_ENDPOINTS.books, payload);

    // Assert unauthorized request is rejected
    expect(response.status).toBe(401);
    const body = response.body as { code: string; message: string };
    expect(body.message).toBe(ERROR_MESSAGES.unauthorized);

    logger.info('Unauthorized request correctly rejected');
  });
});

test.describe('API — Delete Book', () => {
  /**
   * Happy Flow: Delete a book from user's collection.
   * Steps:
   *   1. Add a book first
   *   2. Delete the book
   *   3. Validate deletion succeeds
   */
  test('Should delete a book from user collection successfully (204)', async ({
    authenticatedRequest,
  }) => {
    const { request, token, userId } = authenticatedRequest;
    const isbn = BOOK_ISBNS.designingWebAPIs;

    // Step 1: Add a book first
    logger.step(`Adding book ${isbn} for deletion test`);
    const addPayload = addBooksPayload(userId, [isbn]);
    const addResponse = await apiPost(request, API_ENDPOINTS.books, addPayload, {
      headers: authHeader(token),
    });
    expect(addResponse.status).toBe(201);

    // Step 2: Delete the book
    logger.step(`Deleting book ${isbn}`);
    const deletePayload = deleteBookPayload(userId, isbn);
    const deleteResponse = await apiDelete(request, API_ENDPOINTS.book, {
      headers: authHeader(token),
      data: deletePayload,
    });

    // Step 3: Assert successful deletion (204 No Content)
    expect(deleteResponse.status).toBe(204);

    logger.info(`Book ${isbn} deleted successfully`);
  });

  /**
   * Negative Flow: Delete a book that doesn't exist in the user's collection.
   * Validates:
   *   - Status code is 400
   *   - Error message indicates ISBN not found
   */
  test('Should fail to delete non-existent book (400)', async ({
    authenticatedRequest,
  }) => {
    const { request, token, userId } = authenticatedRequest;

    logger.step('Attempting to delete non-existent book');

    const deletePayload = deleteBookPayload(userId, INVALID_ISBN);
    const deleteResponse = await apiDelete(request, API_ENDPOINTS.book, {
      headers: authHeader(token),
      data: deletePayload,
    });

    // Assert non-existent book deletion fails
    expect(deleteResponse.status).toBe(400);
    const body = deleteResponse.body as { code: string; message: string };
    expect(body.message).toBe(ERROR_MESSAGES.isbnNotFoundInUserCollection);

    logger.info('Non-existent book deletion correctly rejected');
  });
});
