/**
 * Timefold API Configuration
 * 
 * This module provides access to Timefold API configuration from environment variables.
 * All environment variables must be prefixed with VITE_ to be accessible in Vite.
 */

/**
 * Timefold API configuration object
 */
export const timefoldConfig = {
  /**
   * Timefold API authentication token
   * Required for authenticating API requests
   */
  apiToken: import.meta.env.VITE_TIMEFOLD_API_TOKEN || "",

  /**
   * Timefold API base URL
   * Default: https://api.timefold.ai
   */
  baseUrl:
    import.meta.env.VITE_TIMEFOLD_BASE_URL || "https://api.timefold.ai",

  /**
   * Full Stack React (FSR) configuration
   * Used for Timefold FSR integration settings
   */
  fsrConfig: import.meta.env.VITE_TIMEFOLD_FSR_CONFIG || "default",
} as const;

/**
 * Validates that required Timefold configuration is present
 * @returns true if configuration is valid, false otherwise
 */
export function validateTimefoldConfig(): boolean {
  if (!timefoldConfig.apiToken) {
    console.warn(
      "⚠️ Timefold API token is not configured. Set VITE_TIMEFOLD_API_TOKEN in your .env file.",
    );
    return false;
  }

  if (!timefoldConfig.baseUrl) {
    console.warn(
      "⚠️ Timefold base URL is not configured. Set VITE_TIMEFOLD_BASE_URL in your .env file.",
    );
    return false;
  }

  return true;
}

/**
 * Gets the full API endpoint URL for a given path
 * @param path - API endpoint path (e.g., "/api/v1/solve")
 * @returns Full URL to the API endpoint
 */
export function getTimefoldApiUrl(path: string): string {
  const baseUrl = timefoldConfig.baseUrl.replace(/\/$/, ""); // Remove trailing slash
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
}

/**
 * Gets headers for Timefold API requests
 * @returns Headers object with authentication
 */
export function getTimefoldHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${timefoldConfig.apiToken}`,
  };
}
