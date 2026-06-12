import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { supabase, isSupabaseConfigured, getAuthParamsFromUrl, cleanAuthUrl } from "../../lib/supabase";
import { toast } from "sonner";
import { S } from "./AuthPages";

interface Props { onNavigate: (p: string) => void }

export function AuthCallbackPage({ onNavigate }: Props) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus("error");
      setMessage("Konfigurasi Supabase tidak ditemukan.");
      return;
    }

    async function processCallback() {
      console.log("[AuthCallback] Processing email verification...");
      console.log("[AuthCallback] Current URL:", window.location.href);
      
      const params = getAuthParamsFromUrl();
      console.log("[AuthCallback] URL params:", params);

      // Check for errors in URL first
      if (params.error) {
        console.error("[AuthCallback] Error from URL:", params.error, params.errorDescription);
        setStatus("error");
        
        // Check for specific error types
        const isExpired = params.error === "otp_expired" || params.error === "access_denied";
        if (isExpired) {
          setMessage("Link verifikasi tidak valid atau sudah kedaluwarsa. Silakan daftar ulang atau minta link verifikasi baru.");
        } else {
          setMessage(params.errorDescription || "Terjadi kesalahan saat verifikasi email.");
        }
        // Don't clean URL yet - let Supabase process it
        return;
      }

      // Check if this is an email verification callback
      if (params.type !== "signup" && params.type !== "email_change") {
        console.error("[AuthCallback] Invalid type:", params.type);
        setStatus("error");
        setMessage("Link verifikasi tidak valid. Silakan daftar ulang atau minta link verifikasi baru.");
        return;
      }

      try {
        console.log("[AuthCallback] Getting session (Supabase will process PKCE token)...");
        
        // Get the current session (Supabase PKCE exchanges the code automatically)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AuthCallback] Session error:", sessionError);
          setStatus("error");
          setMessage("Gagal memverifikasi email. Silakan coba lagi.");
          return;
        }

        if (!session) {
          console.error("[AuthCallback] No session found - token may be expired");
          setStatus("error");
          setMessage("Link verifikasi tidak valid atau sudah kedaluwarsa. Silakan daftar ulang atau minta link verifikasi baru.");
          return;
        }

        console.log("[AuthCallback] Session found, checking email confirmation...");
        console.log("[AuthCallback] Email confirmed at:", session.user.email_confirmed_at);

        // Verify the email is confirmed
        if (!session.user.email_confirmed_at) {
          console.error("[AuthCallback] Email not confirmed");
          setStatus("error");
          setMessage("Email belum terverifikasi. Silakan cek inbox Anda.");
          return;
        }

        console.log("[AuthCallback] Email verified successfully! Signing out...");
        
        // Email verified successfully — sign out immediately.
        // We don't want the user to be logged in after email verification.
        await supabase.auth.signOut();
        
        console.log("[AuthCallback] Signed out. Cleaning URL...");
        
        // Now clean URL after Supabase has processed everything
        cleanAuthUrl();

        setStatus("success");
        setMessage("Akun Anda berhasil diverifikasi. Silakan login.");

        // Navigate to login after short delay
        setTimeout(() => {
          toast.success("Akun Anda berhasil diverifikasi. Silakan login.");
          onNavigate("login");
        }, 1500);

      } catch (err) {
        console.error("[AuthCallback] Exception:", err);
        setStatus("error");
        setMessage("Terjadi kesalahan. Silakan coba lagi.");
      }
    }

    processCallback();
  }, [onNavigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter',sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width: "42%", background: "#1C1917", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/logo.png" alt="SmartTitle AI" style={{ width: 32, height: 32, borderRadius: 9, objectFit: "contain" }} />
          <span style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>SmartTitle <span style={{ color: S.gold }}>AI</span></span>
        </div>

        <div>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, color: S.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1rem" }}>Powered by Gemini AI</p>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
            Temukan Judul<br />Penelitian Terbaik
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#A8A29E", lineHeight: 1.75 }}>
            Platform berbasis AI untuk mahasiswa, dosen, dan peneliti yang ingin menemukan judul skripsi tepat sasaran.
          </p>
        </div>

        <div style={{ padding: "1.125rem 1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.82rem", color: "#D6CFC6", fontStyle: "italic", lineHeight: 1.7, marginBottom: "0.875rem" }}>
            "SmartTitle AI membantu saya menemukan judul skripsi yang tepat dalam hitungan menit."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff" }}>RP</div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>Reza Pratama</p>
              <p style={{ fontSize: "0.68rem", color: "#A8A29E" }}>Mahasiswa Teknik Informatika</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "2rem 1.5rem", background: "#FAFAF8" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <img src="/logo.png" alt="SmartTitle AI" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "contain" }} />
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: S.dark }}>SmartTitle <span style={{ color: S.gold }}>AI</span></span>
          </div>

          <button onClick={() => onNavigate("landing")} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer", color: "#A8A29E", fontSize: "0.8rem", marginBottom: "1.75rem", padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
            onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Kembali
          </button>

          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: S.dark, marginBottom: "0.375rem" }}>Verifikasi Email</h1>
          <p style={{ fontSize: "0.875rem", color: S.muted, marginBottom: "1.75rem" }}>Memproses verifikasi akun Anda...</p>

          <div style={{ textAlign: "center" }}>
            {status === "loading" && (
              <>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F5F2EC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <div style={{ width: 24, height: 24, border: "3px solid #E3DDD4", borderTopColor: S.gold, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                </div>
                <p style={{ fontSize: "0.875rem", color: S.muted, lineHeight: 1.7 }}>
                  Sedang memverifikasi email Anda...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <CheckCircle2 style={{ width: 26, height: 26, color: "#16A34A" }} />
                </div>
                <p style={{ fontSize: "0.875rem", color: S.muted, lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  {message}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#A8A29E", lineHeight: 1.6 }}>
                  Mengalihkan ke halaman login...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                  <XCircle style={{ width: 26, height: 26, color: "#DC2626" }} />
                </div>
                <p style={{ fontSize: "0.875rem", color: S.muted, lineHeight: 1.7, marginBottom: "0.75rem" }}>
                  {message}
                </p>
                <button onClick={() => onNavigate("login")}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: S.dark, color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#2C2927")}
                  onMouseLeave={e => (e.currentTarget.style.background = S.dark)}>
                  Kembali ke Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
