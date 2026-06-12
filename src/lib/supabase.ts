import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  }
);

/**
 * Parse auth-related params from the URL.
 * Supabase uses either hash fragments (#access_token=...) or query params (?code=...&type=...)
 * depending on the flow type (implicit vs PKCE).
 */
export function getAuthParamsFromUrl(): {
  accessToken: string | null;
  refreshToken: string | null;
  type: string | null;
  error: string | null;
  errorDescription: string | null;
  errorCode: string | null;
} {
  const hash = window.location.hash.substring(1); // remove leading #
  const hashParams = new URLSearchParams(hash);
  const queryParams = new URLSearchParams(window.location.search);

  // Check both hash and query params
  const accessToken = hashParams.get("access_token") || queryParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token") || queryParams.get("refresh_token");
  const type = hashParams.get("type") || queryParams.get("type");
  const error = hashParams.get("error") || queryParams.get("error");
  const errorDescription = hashParams.get("error_description") || queryParams.get("error_description");
  const errorCode = hashParams.get("error_code") || queryParams.get("error_code");

  return { accessToken, refreshToken, type, error, errorDescription, errorCode };
}

/** Clean auth tokens from URL after processing */
export function cleanAuthUrl() {
  const url = new URL(window.location.href);
  // Remove hash entirely
  if (url.hash) {
    url.hash = "";
  }
  // Remove auth-related query params
  ["code", "type", "access_token", "refresh_token", "error", "error_description", "error_code"].forEach(p => url.searchParams.delete(p));
  // Replace URL without triggering navigation
  window.history.replaceState(null, "", url.toString());
}
