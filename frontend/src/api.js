/**
 * API base URL for backend requests.
 * In production we always use the relative /api path so Vercel's rewrite proxies
 * to the backend—avoids mixed-content blocking (HTTPS page calling HTTP API).
 */
function getApiBaseUrl() {
  const env = import.meta.env.VITE_API_BASE_URL;
  if (import.meta.env.PROD) {
    if (!env || typeof env !== "string" || env.startsWith("http://") || env.startsWith("https://")) {
      return "/api";
    }
    return env;
  }
  return env || "http://localhost:3000";
}

export const API_BASE_URL = getApiBaseUrl();
