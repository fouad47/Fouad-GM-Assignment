/**
 * API Helper Utility
 * ==================
 * Provides reusable methods for API interactions using Playwright APIRequestContext.
 * Handles authentication, token management, and common request patterns.
 */

import { APIRequestContext } from '@playwright/test';
import { createLogger } from './logger';

const logger = createLogger('APIHelper');

/** Response wrapper with typed body */
export interface ApiResponse<T = unknown> {
  status: number;
  statusText: string;
  body: T;
  headers: Record<string, string>;
}

/**
 * Execute a GET request and return structured response
 */
export async function apiGet<T = unknown>(
  request: APIRequestContext,
  endpoint: string,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  logger.info(`GET ${endpoint}`);
  const response = await request.get(endpoint, {
    headers: options?.headers,
  });
  const body = await response.json().catch(() => null);
  logger.debug(`Response: ${response.status()}`, body);
  return {
    status: response.status(),
    statusText: response.statusText(),
    body: body as T,
    headers: response.headers(),
  };
}

/**
 * Execute a POST request and return structured response
 */
export async function apiPost<T = unknown>(
  request: APIRequestContext,
  endpoint: string,
  data: unknown,
  options?: { headers?: Record<string, string> }
): Promise<ApiResponse<T>> {
  logger.info(`POST ${endpoint}`);
  const response = await request.post(endpoint, {
    data,
    headers: options?.headers,
  });
  const body = await response.json().catch(() => null);
  logger.debug(`Response: ${response.status()}`, body);
  return {
    status: response.status(),
    statusText: response.statusText(),
    body: body as T,
    headers: response.headers(),
  };
}

/**
 * Execute a DELETE request and return structured response
 */
export async function apiDelete<T = unknown>(
  request: APIRequestContext,
  endpoint: string,
  options?: { headers?: Record<string, string>; data?: unknown }
): Promise<ApiResponse<T>> {
  logger.info(`DELETE ${endpoint}`);
  const response = await request.delete(endpoint, {
    headers: options?.headers,
    data: options?.data,
  });
  // Some DELETE endpoints return 204 No Content
  const body = await response.json().catch(() => null);
  logger.debug(`Response: ${response.status()}`, body);
  return {
    status: response.status(),
    statusText: response.statusText(),
    body: body as T,
    headers: response.headers(),
  };
}

/**
 * Generate an auth token for the DemoQA API.
 * Returns the token string to use in subsequent requests.
 */
export async function generateToken(
  request: APIRequestContext,
  userName: string,
  password: string
): Promise<string> {
  logger.step('Generating auth token');
  const response = await apiPost<{ token: string; expires: string; status: string; result: string }>(
    request,
    '/Account/v1/GenerateToken',
    { userName, password }
  );

  if (response.status !== 200 || !response.body?.token) {
    throw new Error(`Token generation failed: ${response.status} — ${JSON.stringify(response.body)}`);
  }

  logger.info('Token generated successfully');
  return response.body.token;
}

/**
 * Create authorization header object with Bearer token
 */
export function authHeader(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}
