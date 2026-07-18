import { HttpErrorResponse } from '@angular/common/http';

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

function extractApiErrorCode(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  const payload = error.error as ApiErrorPayload | undefined;
  const code = payload?.error?.code;
  return typeof code === 'string' && code.length > 0 ? code : null;
}

export function mapApiErrorToMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse && error.status === 0) {
    return 'The API is currently unreachable. Please try again in a moment.';
  }

  const code = extractApiErrorCode(error);

  if (!code) {
    return fallback;
  }

  switch (code) {
    case 'CONFLICT':
      return 'This profile is already in your favorites.';
    case 'RATE_LIMITED':
      return 'GitHub rate limit reached. Try again in a few minutes.';
    case 'UPSTREAM_FAILURE':
      return 'GitHub is temporarily unavailable. Please retry shortly.';
    case 'DATABASE_FAILURE':
      return 'Database is temporarily unavailable. Please try again shortly.';
    case 'BAD_REQUEST':
      return 'Some request details were invalid. Please review your input.';
    default:
      return fallback;
  }
}
