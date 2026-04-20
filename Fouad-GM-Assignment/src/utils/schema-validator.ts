/**
 * Schema Validator Utility
 * ========================
 * Uses AJV for JSON schema validation of API responses.
 * Ensures API responses conform to expected contracts.
 */

import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import { createLogger } from './logger';

const logger = createLogger('SchemaValidator');

// Singleton AJV instance with all errors enabled
const ajv = new Ajv({ allErrors: true });

/**
 * Validate data against a JSON schema.
 * Returns { valid: boolean; errors: string[] }
 */
export function validateSchema<T>(
  data: unknown,
  schema: Record<string, unknown>
): { valid: boolean; errors: string[] } {
  const validate: ValidateFunction = ajv.compile(schema);
  const valid = validate(data);

  if (!valid && validate.errors) {
    const errors = validate.errors.map(
      (err) => `${err.instancePath || '/'} ${err.message}`
    );
    logger.error('Schema validation failed', errors);
    return { valid: false, errors };
  }

  logger.info('Schema validation passed');
  return { valid: true, errors: [] };
}

/**
 * Pre-defined schemas for DemoQA API responses
 */
export const ApiSchemas = {
  /** Schema for user creation response */
  createUser: {
    type: 'object',
    properties: {
      userID: { type: 'string' },
      username: { type: 'string' },
      books: { type: 'array' },
    },
    required: ['userID', 'username', 'books'],
    additionalProperties: false,
  },

  /** Schema for token generation response */
  generateToken: {
    type: 'object',
    properties: {
      token: { type: 'string' },
      expires: { type: 'string' },
      status: { type: 'string' },
      result: { type: 'string' },
    },
    required: ['token', 'expires', 'status', 'result'],
    additionalProperties: false,
  },

  /** Schema for book object */
  book: {
    type: 'object',
    properties: {
      isbn: { type: 'string' },
      title: { type: 'string' },
      subTitle: { type: 'string' },
      author: { type: 'string' },
      publish_date: { type: 'string' },
      publisher: { type: 'string' },
      pages: { type: 'integer' },
      description: { type: 'string' },
      website: { type: 'string' },
    },
    required: ['isbn', 'title', 'author'],
  },

  /** Schema for books list response */
  booksList: {
    type: 'object',
    properties: {
      books: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            isbn: { type: 'string' },
            title: { type: 'string' },
            subTitle: { type: 'string' },
            author: { type: 'string' },
            publish_date: { type: 'string' },
            publisher: { type: 'string' },
            pages: { type: 'integer' },
            description: { type: 'string' },
            website: { type: 'string' },
          },
          required: ['isbn', 'title'],
        },
      },
    },
    required: ['books'],
  },
};
