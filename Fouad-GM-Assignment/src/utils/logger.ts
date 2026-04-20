/**
 * Logger Utility
 * ==============
 * Provides structured, timestamped logging for test execution.
 * Uses color-coded console output for readability.
 */

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'STEP';

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  /** Format timestamp for log messages */
  private timestamp(): string {
    return new Date().toISOString();
  }

  /** Format and print a log message */
  private log(level: LogLevel, message: string, data?: unknown): void {
    const prefix = `[${this.timestamp()}] [${level}] [${this.context}]`;
    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  /** Log an informational message */
  info(message: string, data?: unknown): void {
    this.log('INFO', message, data);
  }

  /** Log a warning */
  warn(message: string, data?: unknown): void {
    this.log('WARN', message, data);
  }

  /** Log an error */
  error(message: string, data?: unknown): void {
    this.log('ERROR', message, data);
  }

  /** Log a debug message */
  debug(message: string, data?: unknown): void {
    this.log('DEBUG', message, data);
  }

  /** Log a test step — use this to annotate test flow */
  step(message: string): void {
    this.log('STEP', `▶ ${message}`);
  }

  /** Create a child logger with additional context */
  child(subContext: string): Logger {
    return new Logger(`${this.context} > ${subContext}`);
  }
}

/** Factory function for quick logger creation */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
