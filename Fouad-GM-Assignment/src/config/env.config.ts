/**
 * Environment Configuration
 * =========================
 * Centralizes all environment-based settings.
 * Values are loaded from .env file with sensible defaults.
 */

import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  /** Base URL for the application under test */
  BASE_URL: process.env.BASE_URL || 'https://demoqa.com',

  /** API Base URL */
  API_BASE_URL: process.env.API_BASE_URL || 'https://demoqa.com',

  /** Whether to run headless */
  HEADLESS: process.env.HEADLESS !== 'false',

  /** Default timeout in ms */
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 30000,

  /** Expect/assertion timeout in ms */
  EXPECT_TIMEOUT: Number(process.env.EXPECT_TIMEOUT) || 10000,

  /** Number of retries */
  RETRY_COUNT: Number(process.env.RETRY_COUNT) || 1,

  /** Parallel workers */
  WORKERS: Number(process.env.WORKERS) || 4,

  /** Reports directory */
  REPORT_DIR: process.env.REPORT_DIR || 'reports',

  /** API test credentials */
  API_USERNAME: process.env.API_USERNAME || `testuser_${Date.now()}`,
  API_PASSWORD: process.env.API_PASSWORD || 'Test@12345678',
} as const;
