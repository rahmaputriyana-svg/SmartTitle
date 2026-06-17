/**
 * SmartTitle AI Application Configuration
 * 
 * Centralized configuration for URLs and domain management.
 * Automatically adapts to the current environment (localhost, Vercel, custom domain).
 * 
 * Environment Variables:
 * - VITE_APP_URL: Optional override for the app URL (e.g., https://smarttitleai.web.id)
 *   If not set, defaults to window.location.origin (current domain)
 */

// Declare Vite env variables
interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// App URL: Use env variable if available, otherwise use current window origin
export const APP_URL = (import.meta as any).env?.VITE_APP_URL || window.location.origin;

// Authentication callback URL (email verification)
export const AUTH_CALLBACK_URL = `${APP_URL}/auth-callback`;

// Password reset URL (forgot password flow)
export const RESET_PASSWORD_URL = `${APP_URL}/reset-password`;

// Password reset success URL
export const RESET_PASSWORD_SUCCESS_URL = `${APP_URL}/reset-password-success`;

// Landing page URL
export const LANDING_URL = APP_URL;

// Login page URL
export const LOGIN_URL = `${APP_URL}/login`;

// Dashboard URL
export const DASHBOARD_URL = `${APP_URL}/dashboard`;

/**
 * Get the current environment name for debugging
 */
export function getEnvironment(): string {
  if (APP_URL.includes('localhost')) return 'development';
  if (APP_URL.includes('vercel.app')) return 'preview';
  return 'production';
}

/**
 * Log configuration for debugging
 */
export function logConfig(): void {
  console.log('[Config] Environment:', getEnvironment());
  console.log('[Config] APP_URL:', APP_URL);
  console.log('[Config] AUTH_CALLBACK_URL:', AUTH_CALLBACK_URL);
  console.log('[Config] RESET_PASSWORD_URL:', RESET_PASSWORD_URL);
}
