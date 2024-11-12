// src/utils/errorHandler.ts

export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred.';
  }
  