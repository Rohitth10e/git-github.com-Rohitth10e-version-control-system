/**
 * API base URL for backend requests.
 * - Honors VITE_API_BASE_URL when provided (useful for hosted backends).
 * - Falls back to /api in production for proxy-based deployments.
 * - Defaults to the local backend /api path in development.
 */
function getApiBaseUrl() {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (env && typeof env === "string") {
    return env;
  }
  if (import.meta.env.PROD) {
    return "/api";
  }
  return "http://localhost:3000/api";
}

export const API_BASE_URL = getApiBaseUrl();
