/**
 * API Test Fixtures
 * =================
 * Extends Playwright's base test with custom fixtures for API tests.
 * Provides authenticated API context with token management.
 */

import { test as base, APIRequestContext } from '@playwright/test';
import { ENV } from '../config/env.config';
import { generateToken, apiPost } from '../utils/api-helper';
import { createLogger } from '../utils/logger';

const logger = createLogger('APIFixture');

/** Type definition for API test fixtures */
type APIFixtures = {
  /** Authenticated API request context with Bearer token */
  authenticatedRequest: {
    request: APIRequestContext;
    token: string;
    userId: string;
    userName: string;
  };
  /** Unauthenticated API request context for negative tests */
  unauthenticatedRequest: APIRequestContext;
};

/**
 * Extended test object with API-specific fixtures.
 * Handles user creation, token generation, and cleanup.
 */
export const test = base.extend<APIFixtures>({
  /**
   * Authenticated request fixture.
   * Creates a user, generates a token, and provides both for use in tests.
   * Cleans up the user after the test.
   */
  authenticatedRequest: async ({ request }, use) => {
    // Generate a unique username for test isolation
    const userName = `testuser_${Date.now()}`;
    const password = ENV.API_PASSWORD;

    logger.step(`Creating test user: ${userName}`);

    // Create the user
    const createResponse = await apiPost<{ userID: string; username: string; books: unknown[] }>(
      request,
      '/Account/v1/User',
      { userName, password }
    );

    if (createResponse.status !== 201) {
      throw new Error(
        `User creation failed: ${createResponse.status} — ${JSON.stringify(createResponse.body)}`
      );
    }

    const userId = createResponse.body.userID;
    logger.info(`User created: ${userName} (${userId})`);

    // Generate auth token
    const token = await generateToken(request, userName, password);

    // Provide the authenticated context to the test
    await use({ request, token, userId, userName });

    // Cleanup: Delete the test user after the test
    logger.step(`Cleaning up test user: ${userName}`);
    try {
      await request.delete(`/Account/v1/User/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      logger.info(`User deleted: ${userName}`);
    } catch (error) {
      logger.warn(`Failed to cleanup user ${userName}: ${error}`);
    }
  },

  /**
   * Unauthenticated request fixture — just provides the raw request context.
   */
  unauthenticatedRequest: async ({ request }, use) => {
    await use(request);
  },
});

/** Re-export expect for convenience */
export { expect } from '@playwright/test';
