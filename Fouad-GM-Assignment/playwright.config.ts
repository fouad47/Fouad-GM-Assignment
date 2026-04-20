/**
 * Playwright Configuration
 * ========================
 * Central configuration for all UI and API test projects.
 * Supports environment-based overrides via .env file.
 */

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Fallback defaults when .env is missing
const BASE_URL = process.env.BASE_URL || 'https://demoqa.com';
const HEADLESS = process.env.HEADLESS !== 'false';
const DEFAULT_TIMEOUT = Number(process.env.DEFAULT_TIMEOUT) || 30000;
const EXPECT_TIMEOUT = Number(process.env.EXPECT_TIMEOUT) || 10000;
const RETRY_COUNT = Number(process.env.RETRY_COUNT) || 1;
const WORKERS = process.env.CI ? 2 : Number(process.env.WORKERS) || 4;

export default defineConfig({
  /* Test directory — covers both e2e/ui and e2e/api */
  testDir: './e2e',

  /* Run tests in parallel for speed */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry failed tests */
  retries: RETRY_COUNT,

  /* Number of parallel workers */
  workers: WORKERS,

  /* Global timeout per test */
  timeout: DEFAULT_TIMEOUT,

  /* Assertion timeout */
  expect: {
    timeout: EXPECT_TIMEOUT,
  },

  /* Reporter configuration */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL for UI navigation */
    baseURL: BASE_URL,

    /* Collect trace on first retry */
    trace: 'on-first-retry',

    /* Screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on first retry */
    video: 'on-first-retry',

    /* Action timeout */
    actionTimeout: 15000,

    /* Navigation timeout */
    navigationTimeout: 30000,
  },

  /* Output directory for test artifacts */
  outputDir: 'test-results',

  /* Project definitions — separate UI (multi-browser) and API */
  projects: [
    {
      name: 'ui-chromium',
      testDir: './e2e/ui',
      use: {
        ...devices['Desktop Chrome'],
        headless: HEADLESS,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'ui-firefox',
      testDir: './e2e/ui',
      use: {
        ...devices['Desktop Firefox'],
        headless: HEADLESS,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'api',
      testDir: './e2e/api',
      use: {
        /* API tests don't need a browser — use baseURL for requests */
        baseURL: process.env.API_BASE_URL || BASE_URL,
      },
    },
  ],
});
