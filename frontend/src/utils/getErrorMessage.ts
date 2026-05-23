import { isAxiosError } from 'axios';

// The backend always returns { error: string } for failures
export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    return err.response?.data?.error ?? 'Request failed. Please try again.';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred.';
}
