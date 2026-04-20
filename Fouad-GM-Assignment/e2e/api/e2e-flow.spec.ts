/**
 * API Tests — End-to-End Happy Flow
 * ===================================
 * Full integration test covering the complete API workflow:
 *   1. Create a user
 *   2. Generate auth token
 *   3. Add books to the collection
 *   4. Verify books were added
 *   5. Delete a book
 *   6. Verify book was deleted
 *   7. Delete the user (cleanup)
 */

import { test, expect } from '@playwright/test';
import { apiPost, apiGet, apiDelete, generateToken, authHeader } from '../../src/utils/api-helper';
import { validateSchema, ApiSchemas } from '../../src/utils/schema-validator';
import {
  API_ENDPOINTS,
  validUserPayload,
  BOOK_ISBNS,
  addBooksPayload,
  deleteBookPayload,
} from '../../test-data/api/api-test.data';
import { createLogger } from '../../src/utils/logger';

const logger = createLogger('E2E-Flow');

test.describe('API — End-to-End Happy Flow', () => {
  /**
   * Complete happy path flow through Account and BookStore APIs.
   * This test validates the full lifecycle of a user's interaction
   * with the DemoQA BookStore API.
   */
  test('Should complete full API workflow: create user → add books → delete book → cleanup', async ({
    request,
  }) => {
    const userPayload = validUserPayload();
    let userId: string;
    let token: string;

    // ── Step 1: Create a new user ──────────────────────────
    logger.step('Step 1: Creating user');
    const createUserResponse = await apiPost<{
      userID: string;
      username: string;
      books: unknown[];
    }>(request, API_ENDPOINTS.createUser, userPayload);

    expect(createUserResponse.status).toBe(201);
    userId = createUserResponse.body.userID;
    expect(userId).toBeTruthy();
    expect(createUserResponse.body.username).toBe(userPayload.userName);

    // Validate schema
    const userSchemaResult = validateSchema(createUserResponse.body, ApiSchemas.createUser);
    expect(userSchemaResult.valid).toBe(true);

    logger.info(`User created: ${userId}`);

    // ── Step 2: Generate auth token ────────────────────────
    logger.step('Step 2: Generating token');
    token = await generateToken(request, userPayload.userName, userPayload.password);
    expect(token).toBeTruthy();
    expect(token.length).toBeGreaterThan(0);

    logger.info('Token generated successfully');

    // ── Step 3: Add books to collection ────────────────────
    logger.step('Step 3: Adding books');
    const booksToAdd = [BOOK_ISBNS.learningJavaScript, BOOK_ISBNS.designingWebAPIs];
    const addBooksResponse = await apiPost<{ books: { isbn: string }[] }>(
      request,
      API_ENDPOINTS.books,
      addBooksPayload(userId, booksToAdd),
      { headers: authHeader(token) }
    );

    expect(addBooksResponse.status).toBe(201);
    expect(addBooksResponse.body.books).toHaveLength(2);
    expect(addBooksResponse.body.books[0].isbn).toBe(booksToAdd[0]);
    expect(addBooksResponse.body.books[1].isbn).toBe(booksToAdd[1]);

    logger.info(`${booksToAdd.length} books added successfully`);

    // ── Step 4: Verify books are in user profile ───────────
    logger.step('Step 4: Verifying books in user profile');
    const userProfileResponse = await apiGet<{
      userId: string;
      username: string;
      books: { isbn: string; title: string }[];
    }>(request, API_ENDPOINTS.getUser(userId), {
      headers: authHeader(token),
    });

    expect(userProfileResponse.status).toBe(200);
    expect(userProfileResponse.body.books).toHaveLength(2);

    // Verify the added books are present
    const bookIsbns = userProfileResponse.body.books.map((b) => b.isbn);
    expect(bookIsbns).toContain(BOOK_ISBNS.learningJavaScript);
    expect(bookIsbns).toContain(BOOK_ISBNS.designingWebAPIs);

    logger.info('Books verified in user profile');

    // ── Step 5: Delete one book ────────────────────────────
    logger.step('Step 5: Deleting one book');
    const deletePayload = deleteBookPayload(userId, BOOK_ISBNS.learningJavaScript);
    const deleteBookResponse = await apiDelete(request, API_ENDPOINTS.book, {
      headers: authHeader(token),
      data: deletePayload,
    });

    expect(deleteBookResponse.status).toBe(204);

    logger.info('Book deleted successfully');

    // ── Step 6: Verify book was removed ────────────────────
    logger.step('Step 6: Verifying book deletion');
    const updatedProfileResponse = await apiGet<{
      userId: string;
      username: string;
      books: { isbn: string; title: string }[];
    }>(request, API_ENDPOINTS.getUser(userId), {
      headers: authHeader(token),
    });

    expect(updatedProfileResponse.status).toBe(200);
    expect(updatedProfileResponse.body.books).toHaveLength(1);

    // Verify the deleted book is gone
    const remainingIsbns = updatedProfileResponse.body.books.map((b) => b.isbn);
    expect(remainingIsbns).not.toContain(BOOK_ISBNS.learningJavaScript);
    expect(remainingIsbns).toContain(BOOK_ISBNS.designingWebAPIs);

    logger.info('Book deletion verified');

    // ── Step 7: Cleanup — Delete user ──────────────────────
    logger.step('Step 7: Cleaning up — deleting user');
    const deleteUserResponse = await request.delete(API_ENDPOINTS.deleteUser(userId), {
      headers: authHeader(token),
    });

    expect(deleteUserResponse.status()).toBe(204);

    logger.info('User cleaned up successfully. Full E2E flow completed! ✅');
  });
});
