import { useState, useEffect } from "react";
import { UserProvider, useUser } from "./UserContext";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./components/LandingPage";
import { LoginPage, RegisterPage, ForgotPasswordPage } from "./components/AuthPages";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardHome } from "./components/DashboardHome";
import { GeneratorPage } from "./components/GeneratorPage";
import { HistoryPage } from "./components/HistoryPage";
import { ProfilePage } from "./components/ProfilePage";
import { TermsPage } from "./components/TermsPage";
import { PrivacyPage } from "./components/PrivacyPage";

export type Page = "landing" | "login" | "register" | "forgot-password" | "reset-password" | "dashboard" | "generator" | "history" | "profile" | "terms" | "privacy";

const DASH: Page[] = ["dashboard", "generator", "history", "profile"];
const AUTH: Page[] = ["login", "register", "forgot-password"];
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
  if (window.location.hash.includes("type=recovery")) return true;
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "recovery") return true;
  return false;
}

function AppInner() {
  const [page, setPage] = useState<Page>(() => {
    // Detect password recovery URL on initial load (pathname, hash, or query params)
    if (isRecoveryUrl()) return "reset-password";
    return "landing";
  });
  const { user, authLoading, passwordRecovery, clearPasswordRecovery } = useUser();

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

    // Never redirect away from reset-password while user has a valid session
    // (they need the session to call updateUser for password reset).
    // If no session, send them to login (invalid/expired recovery link).
    if (page === "reset-password") {
      if (!user && !passwordRecovery) setPage("login");
      return;
    }

    // Don't redirect during active password recovery flow
    if (passwordRecovery) return;

    if (user && (AUTH.includes(page) || page === "landing" || PUBLIC.includes(page))) {
      setPage("dashboard");
    } else if (!user && DASH.includes(page)) {
      setPage("login");
    }
  }, [user, authLoading, page, passwordRecovery]);

  if (authLoading) return <LoadingScreen />;

  if (page === "landing") return <LandingPage onNavigate={go} />;
  if (page === "login") return <LoginPage onNavigate={go} />;
  if (page === "register") return <RegisterPage onNavigate={go} />;
  if (page === "forgot-password") return <ForgotPasswordPage onNavigate={go} />;
  if (page === "reset-password") return <ResetPasswordPage onNavigate={go} />;
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
