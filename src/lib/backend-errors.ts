export class BackendUnavailableError extends Error {
  constructor(message = "Unable to connect to backend services.") {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function isBackendUnavailable(error: unknown): boolean {
  if (error instanceof BackendUnavailableError) return true;
  if (error instanceof Error && error.name === "BackendUnavailableError") return true;
  if (error instanceof ApiError && error.status >= 500) return true;
  if (error instanceof TypeError) return true;
  return false;
}
