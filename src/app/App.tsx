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
    // Detect page from URL pathname on initial load
    const pathname = window.location.pathname;
    
    // Check for auth errors first
    if (hasAuthError()) return "login";
    
    // Map pathname to page
    const pathToPage: Record<string, Page> = {
      "/": "landing",
      "/login": "login",
      "/register": "register",
      "/verify-email": "verify-email",
      "/forgot-password": "forgot-password",
      "/reset-password": "reset-password",
      "/reset-password-success": "reset-password-success",
      "/auth-callback": "auth-callback",
      "/dashboard": "dashboard",
      "/generator": "generator",
      "/history": "history",
      "/profile": "profile",
      "/terms": "terms",
      "/privacy": "privacy",
    };
    
    // Check if pathname matches a known page
    if (pathToPage[pathname]) {
      return pathToPage[pathname];
    }
    
    // Fallback: check for hash/query params (for auth callbacks)
    if (isAuthCallbackUrl()) return "auth-callback";
    if (isRecoveryUrl()) return "reset-password";
    
    return "landing";
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { user, authLoading, passwordRecovery, clearPasswordRecovery, authError, clearAuthError } = useUser();

  const go = (p: string) => {
    const nextPage = p as Page;
    console.log("[GO]");
    console.log("old page =", page);
    console.log("new page =", p);
    console.log("[Navigation] Current user:", user?.email || "null");
    console.log("[Navigation] Current pathname:", window.location.pathname);
    setPage(nextPage);
    window.scrollTo({ top: 0 });

    // Update browser URL to match the current page
    const pathMap: Record<Page, string> = {
      landing: "/",
      login: "/login",
      register: "/register",
      "verify-email": "/verify-email",
      "forgot-password": "/forgot-password",
      "reset-password": "/reset-password",
      "reset-password-success": "/reset-password-success",
      "auth-callback": "/auth-callback",
      dashboard: "/dashboard",
      generator: "/generator",
      history: "/history",
      profile: "/profile",
      terms: "/terms",
      privacy: "/privacy",
    };

    const targetPath = pathMap[nextPage] || "/";
    console.log("[Navigation] Updating URL to:", targetPath);
    window.history.pushState({}, "", targetPath);
  };

  // Handle PASSWORD_RECOVERY event from Supabase (e.g. in-app hash change)
  useEffect(() => {
    if (passwordRecovery) {
      setPage("reset-password");
      clearPasswordRecovery();
    }
  }, [passwordRecovery, clearPasswordRecovery]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      const pathToPage: Record<string, Page> = {
        "/": "landing",
        "/login": "login",
        "/register": "register",
        "/verify-email": "verify-email",
        "/forgot-password": "forgot-password",
        "/reset-password": "reset-password",
        "/reset-password-success": "reset-password-success",
        "/auth-callback": "auth-callback",
        "/dashboard": "dashboard",
        "/generator": "generator",
        "/history": "history",
        "/profile": "profile",
        "/terms": "terms",
        "/privacy": "privacy",
      };

      if (pathToPage[pathname]) {
        console.log("[PopState] Browser navigation to:", pathname);
        setPage(pathToPage[pathname]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    console.log("[APP]");
    console.log("page =", page);
    console.log("pathname =", window.location.pathname);
    console.log("user =", user?.email);
    console.log("authLoading =", authLoading);
    console.log("loginSuccess =", loginSuccess);

    if (authLoading) {
      console.log("RedirectGuard: return because authLoading");
      return;
    }

    console.log("[RedirectGuard] page:", page, "| user:", user?.email || "null", "| authLoading:", authLoading);

    // Never redirect away from reset-password or reset-password-success
    // (they need the session to call updateUser for password reset).
    // Never redirect away from auth-callback (email verification).
    if (page === "reset-password" || page === "reset-password-success" || page === "auth-callback") {
      console.log("RedirectGuard: return because on auth page (reset-password/auth-callback)");
      return; // Stay on page
    }

    // Don't redirect during active password recovery flow
    if (passwordRecovery) {
      console.log("RedirectGuard: return because passwordRecovery");
      return;
    }

    // CRITICAL: Handle successful login - force navigation to dashboard
    if (loginSuccess && user) {
      console.log("RedirectGuard: loginSuccess && user detected, forcing dashboard");
      setLoginSuccess(false);  // Reset flag
      setPage("dashboard");
      window.history.pushState({}, "", "/dashboard");
      return;
    }

    // CRITICAL: If login just succeeded but user is still loading, wait
    if (loginSuccess && page === "dashboard") {
      console.log("[RedirectGuard] Waiting for login session...");
      // Reset flag if user eventually loads
      if (user) {
        setLoginSuccess(false);
      }
      return;
    }

    // CRITICAL: When email verification happens, Supabase broadcasts SIGNED_IN to ALL tabs
    // Only the /auth-callback tab should process the verification.
    // Other tabs (landing, login, register) must NOT auto-redirect when they detect a user FROM EMAIL VERIFICATION.
    // However, if user is on LoginPage and manually logs in, they SHOULD go to dashboard.
    if (user && window.location.pathname !== "/auth-callback") {
      const isOnAuthOrPublicPage = AUTH.includes(page) || PUBLIC.includes(page) || page === "landing";
      
      // If user is on landing/auth pages and a user session appears (from email verification in another tab),
      // DON'T redirect them. They should stay on their current page.
      // EXCEPTION: If user just logged in from LoginPage (page === "login" and they navigated to dashboard),
      // allow the navigation to proceed.
      if (isOnAuthOrPublicPage && page !== "login" && !loginSuccess) {
        console.log("RedirectGuard: ignored (email verification on non-callback tab)");
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
        console.log("RedirectGuard: redirect dashboard -> login (preventing auto-dashboard after email verification)");
        setPage("login");
        return;
      }
    }

    // Simple guard: if no user and trying to access dashboard, redirect to login
    // BUT: Don't redirect if loginSuccess is true (still loading session)
    if (!user && DASH.includes(page) && !loginSuccess) {
      console.log("RedirectGuard: redirect", page, "-> login (no user)");
      setPage("login");
      return;
    }

    console.log("RedirectGuard: ignored (no action needed)");
  }, [user, authLoading, page, passwordRecovery, loginSuccess]);

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

  console.log("[RENDER] Rendering page:", page);
  console.log("[RENDER] URL pathname:", window.location.pathname);
  console.log("[RENDER] user:", user?.email || "null");

  if (page === "landing") return <LandingPage onNavigate={go} />;
  if (page === "login") return (
    <LoginPage
      onNavigate={go}
      onLoginSuccess={() => {
        console.log("[App] Login success callback triggered");
        setLoginSuccess(true);
        go("dashboard");
      }}
    />
  );
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
