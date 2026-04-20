/**
 * API Tests — Create User
 * ========================
 * Tests for the POST /Account/v1/User endpoint.
 * Covers happy flow (successful creation) and negative flows.
 */

import { test, expect } from '../../src/fixtures/api.fixture';
import { apiPost } from '../../src/utils/api-helper';
import { validateSchema, ApiSchemas } from '../../src/utils/schema-validator';
import {
  API_ENDPOINTS,
  validUserPayload,
  weakPasswordPayload,
  ERROR_MESSAGES,
} from '../../test-data/api/api-test.data';
import { createLogger } from '../../src/utils/logger';

const logger = createLogger('CreateUserAPI');

test.describe('API — Create User', () => {
  /**
   * Happy Flow: Create a new user successfully.
   * Validates:
   *   - Status code is 201
   *   - Response body contains userID and username
   *   - Response body matches expected schema
   */
  test('Should create a new user successfully (201)', async ({ request }) => {
    const payload = validUserPayload();
    logger.step(`Creating user: ${payload.userName}`);

    const response = await apiPost(request, API_ENDPOINTS.createUser, payload);

    // Assert status code
    expect(response.status).toBe(201);

    // Assert response body structure
    const body = response.body as { userID: string; username: string; books: unknown[] };
    expect(body.userID).toBeTruthy();
    expect(body.username).toBe(payload.userName);
    expect(body.books).toEqual([]);

    // Schema validation
    const schemaResult = validateSchema(body, ApiSchemas.createUser);
    expect(schemaResult.valid).toBe(true);

    logger.info(`User created successfully: ${body.userID}`);

    // Cleanup: delete the created user
    const tokenResponse = await apiPost<{ token: string }>(
      request,
      API_ENDPOINTS.generateToken,
      payload
    );
    if (tokenResponse.body?.token) {
      await request.delete(API_ENDPOINTS.getUser(body.userID), {
        headers: {
          Authorization: `Bearer ${tokenResponse.body.token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  });

  /**
   * Negative Flow 1: Create user with duplicate username.
   * Validates:
   *   - Status code is 406
   *   - Error message indicates user already exists
   */
  test('Should fail to create duplicate user (406)', async ({ request }) => {
    const payload = validUserPayload();
    logger.step('Creating first user for duplicate test');

    // Create user first time
    const firstResponse = await apiPost(request, API_ENDPOINTS.createUser, payload);
    expect(firstResponse.status).toBe(201);

    logger.step('Attempting to create duplicate user');

    // Attempt to create the same user again
    const duplicateResponse = await apiPost(request, API_ENDPOINTS.createUser, payload);

    // Assert duplicate creation fails
    expect(duplicateResponse.status).toBe(406);
    const body = duplicateResponse.body as { code: string; message: string };
    expect(body.message).toBe(ERROR_MESSAGES.userExists);

    logger.info('Duplicate user creation correctly rejected');

    // Cleanup
    const tokenResponse = await apiPost<{ token: string }>(
      request,
      API_ENDPOINTS.generateToken,
      payload
    );
    if (tokenResponse.body?.token) {
      const userId = (firstResponse.body as { userID: string }).userID;
      await request.delete(API_ENDPOINTS.getUser(userId), {
        headers: {
          Authorization: `Bearer ${tokenResponse.body.token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  });

  /**
   * Negative Flow 2: Create user with weak password.
   * Validates:
   *   - Status code is 400
   *   - Error message describes password requirements
   */
  test('Should fail to create user with weak password (400)', async ({ request }) => {
    const payload = weakPasswordPayload();
    logger.step('Attempting to create user with weak password');

    const response = await apiPost(request, API_ENDPOINTS.createUser, payload);

    // Assert weak password is rejected
    expect(response.status).toBe(400);
    const body = response.body as { code: string; message: string };
    expect(body.message).toContain('Passwords must have at least one');

    logger.info('Weak password correctly rejected');
  });
});
