import { useState, useEffect } from "react";
import { UserProvider, useUser } from "./UserContext";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage, ForgotPasswordPage, VerifyEmailPage } from "./components/AuthPages";
import { AuthCallbackPage } from "./components/AuthCallbackPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { ResetPasswordSuccessPage } from "./components/ResetPasswordSuccessPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { GeneratorPage } from "./components/GeneratorPage";
import { HistoryPage } from "./components/HistoryPage";
import { ProfilePage } from "./components/ProfilePage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";
import { getAuthParamsFromUrl } from "../lib/supabase";

export type Page = "landing" | "login" | "register" | "verify-email" | "forgot-password" | "reset-password" | "reset-password-success" | "auth-callback" | "dashboard" | "generator" | "history" | "profile" | "terms" | "privacy";

const DASH: Page[] = ["dashboard", "generator", "history", "profile"];
const AUTH: Page[] = ["login", "register", "verify-email", "forgot-password"];
const PUBLIC: Page[] = ["terms", "privacy"];

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F2EC", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #E3DDD4", borderTopColor: "#C4933F", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }} />
        <p style={{ fontSize: "0.875rem", color: "#78716C" }}>Memuat SmartTitle AI...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function isRecoveryUrl(): boolean {
  if (window.location.pathname === "/reset-password") return true;
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  if (hashParams.get("type") === "recovery") return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "recovery") return true;
  return false;
}

function isAuthCallbackUrl(): boolean {
  if (window.location.pathname === "/auth-callback") return true;
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  if (hashParams.get("type") === "signup") return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "signup") return true;
  return false;
}

function hasAuthError(): boolean {
  const p = getAuthParamsFromUrl();
  return !!p.error;
}

function AppInner() {
  const [page, setPage] = useState<Page>(() => {
    // Detect auth callback URLs on initial load
    if (hasAuthError()) return "login"; // Show login page with error message
    if (isAuthCallbackUrl()) return "auth-callback";
    if (isRecoveryUrl()) return "reset-password";
    return "landing";
  });
  const { user, authLoading, passwordRecovery, clearPasswordRecovery, authError, clearAuthError } = useUser();

  const go = (p: string) => {
    setPage(p as Page);
    window.scrollTo({ top: 0 });
  };

  // Handle PASSWORD_RECOVERY event from Supabase (e.g. in-app hash change)
  useEffect(() => {
    if (passwordRecovery) {
      setPage("reset-password");
      clearPasswordRecovery();
    }
  }, [passwordRecovery, clearPasswordRecovery]);

  // Redirect based on auth state
  useEffect(() => {
    if (authLoading) return;

    // Never redirect away from reset-password or reset-password-success
    // (they need the session to call updateUser for password reset).
    // Never redirect away from auth-callback (email verification).
    if (page === "reset-password" || page === "reset-password-success" || page === "auth-callback") {
      return; // Stay on page
    }

    // Don't redirect during active password recovery flow
    if (passwordRecovery) return;

    // CRITICAL: When email verification happens, Supabase broadcasts SIGNED_IN to ALL tabs
    // Only the /auth-callback tab should process the verification.
    // Other tabs (landing, login, register) must NOT auto-redirect when they detect a user.
    // This prevents other tabs from navigating away when Gmail opens the verification link.
    if (user && window.location.pathname !== "/auth-callback") {
      const isOnAuthOrPublicPage = AUTH.includes(page) || PUBLIC.includes(page) || page === "landing";
      
      // If user is on landing/auth pages and a user session appears (from email verification in another tab),
      // DON'T redirect them. They should stay on their current page.
      if (isOnAuthOrPublicPage) {
        console.log("[App] Ignoring user session on non-dashboard tab:", window.location.pathname);
        console.log("[App] Keeping tab on current page, not redirecting to dashboard");
        return;
      }
    }

    // CRITICAL: After email verification, user is signed out immediately by AuthCallbackPage.
    // Even if there's a brief moment with a session, don't auto-navigate to dashboard.
    // User MUST manually login via LoginPage to access dashboard.
    if (page === "dashboard" && user) {
      // Check if this is from email verification (just verified, not manual login)
      // If user just arrived at dashboard without going through LoginPage, redirect to login
      const cameFromAuthCallback = document.referrer.includes("auth-callback");
      if (cameFromAuthCallback) {
        console.log("[App] Preventing auto-dashboard after email verification");
        setPage("login");
        return;
      }
    }

    // Simple guard: if no user and trying to access dashboard, redirect to login
    if (!user && DASH.includes(page)) {
      setPage("login");
    }
  }, [user, authLoading, page, passwordRecovery]);

  // Show toast for auth errors from URL
  useEffect(() => {
    if (authError) {
      console.log("[Auth] Showing auth error:", authError.code, authError.message);
      const isExpired = authError.code === "otp_expired" || authError.code === "access_denied";
      if (isExpired) {
        toast.error("Link verifikasi sudah kedaluwarsa atau tidak valid. Silakan minta link baru.");
      } else {
        toast.error(authError.message || "Terjadi kesalahan autentikasi.");
      }
      clearAuthError();
    }
  }, [authError, clearAuthError]);

  if (authLoading) return <LoadingScreen />;

  if (page === "landing") return <LandingPage onNavigate={go} />;
  if (page === "login") return <LoginPage onNavigate={go} />;
  if (page === "register") return <RegisterPage onNavigate={go} />;
  if (page === "verify-email") return <VerifyEmailPage onNavigate={go} />;
  if (page === "forgot-password") return <ForgotPasswordPage onNavigate={go} />;
  if (page === "reset-password") return <ResetPasswordPage onNavigate={go} />;
  if (page === "reset-password-success") return <ResetPasswordSuccessPage onNavigate={go} />;
  if (page === "auth-callback") return <AuthCallbackPage onNavigate={go} />;
  if (page === "terms") return <TermsPage onNavigate={go} />;
  if (page === "privacy") return <PrivacyPage onNavigate={go} />;

  if (DASH.includes(page)) {
    return (
      <DashboardLayout activePage={page} onNavigate={go}>
        {page === "dashboard" && <DashboardHome onNavigate={go} />}
        {page === "generator" && <GeneratorPage />}
        {page === "history" && <HistoryPage />}
        {page === "profile" && <ProfilePage onNavigate={go} />}
      </DashboardLayout>
    );
  }

  return <LandingPage onNavigate={go} />;
}

export default function App() {
  return (
    <UserProvider>
      <AppInner />
      <Toaster position="top-right" richColors />
    </UserProvider>
  );
}
