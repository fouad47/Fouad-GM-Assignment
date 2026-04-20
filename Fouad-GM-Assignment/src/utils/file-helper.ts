/**
 * File Helper Utility
 * ===================
 * Provides utilities for file operations needed in tests,
 * such as creating temporary upload files.
 */

import fs from 'fs';
import path from 'path';
import { createLogger } from './logger';

const logger = createLogger('FileHelper');

/**
 * Get the absolute path to a file in the test-data directory
 */
export function getTestDataPath(relativePath: string): string {
  const fullPath = path.resolve(process.cwd(), 'test-data', relativePath);
  logger.debug(`Resolved test data path: ${fullPath}`);
  return fullPath;
}

/**
 * Create a temporary file with given content for upload tests.
 * Returns the absolute path to the created file.
 */
export function createTempFile(
  fileName: string,
  content: string = 'Sample file content for testing'
): string {
  const tempDir = path.resolve(process.cwd(), 'test-data', 'temp');

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const filePath = path.join(tempDir, fileName);
  fs.writeFileSync(filePath, content, 'utf-8');
  logger.info(`Created temp file: ${filePath}`);
  return filePath;
}

/**
 * Clean up temporary files after test execution
 */
export function cleanTempFiles(): void {
  const tempDir = path.resolve(process.cwd(), 'test-data', 'temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    logger.info('Cleaned up temp files');
  }
}

/**
 * Ensure the upload sample file exists in test-data
 */
export function ensureUploadFile(): string {
  const uploadDir = path.resolve(process.cwd(), 'test-data', 'ui');
  const filePath = path.join(uploadDir, 'upload-sample.txt');

  if (!fs.existsSync(filePath)) {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(filePath, 'This is a sample file for upload testing.', 'utf-8');
    logger.info(`Created upload sample file: ${filePath}`);
  }

  return filePath;
}
