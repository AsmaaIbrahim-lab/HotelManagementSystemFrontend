export interface ApiValidationError {
  type?: string;
  title?: string;
  status?: number;
  errors?: Record<string, string[]>;
  message?: string;
  detail?: string;
}

export function getApiErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred.';
  }
  const apiError = error as ApiValidationError;
  if (apiError.message) {
    return apiError.message;
  }
  if (apiError.detail) {
    return apiError.detail;
  }
  if (apiError.title) {
    return apiError.title;
  }
  if (apiError.errors) {
    const messages = Object.values(apiError.errors).flat();
    if (messages.length) {
      return messages.join(' ');
    }
  }
  return 'An unexpected error occurred.';
}
