import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useUser } from "../UserContext";
import { Layout, Field, S } from "./AuthPages";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

interface Props { onNavigate: (p: string) => void }

export function ResetPasswordPage({ onNavigate }: Props) {
  const { clearPasswordRecovery } = useUser();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  // Log recovery session info on mount
  useEffect(() => {
    console.log("[ResetPassword] ========== PAGE OPENED ==========");
    console.log("[ResetPassword] Full URL:", window.location.href);
    console.log("[ResetPassword] URL hash:", window.location.hash);
    console.log("[ResetPassword] URL pathname:", window.location.pathname);

    // Check if session exists from recovery token
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("[ResetPassword] getSession() error:", error);
      console.log("[ResetPassword] getSession() session:", session);
      
      if (session) {
        console.log("[ResetPassword] ✓ Session EXISTS");
        console.log("[ResetPassword] Session user:", session.user.email);
        console.log("[ResetPassword] Session recovery_sent_at:", session.user.recovery_sent_at);
        setHasRecoverySession(true);
      } else {
        console.error("[ResetPassword] ✗ NO SESSION FOUND");
        console.error("[ResetPassword] Recovery token may be invalid or expired");
        setHasRecoverySession(false);
      }
    });
  }, []);

  const passwordsMatch = newPass === confirmPass;
  const minLengthMet = newPass.length >= 8;
  const valid = minLengthMet && passwordsMatch && newPass.length > 0;

  // Show invalid session banner if no recovery session
  const showInvalidSessionBanner = hasRecoverySession === false;

  const handleSubmit = async () => {
    console.log("[ResetPassword] ========== handleSubmit CALLED ==========");

    if (!newPass || !confirmPass) {
      console.log("[ResetPassword] Validation failed: empty password");
      toast.error("Isi kata sandi baru dan konfirmasi kata sandi.");
      return;
    }

    if (newPass.length < 8) {
      console.log("[ResetPassword] Validation failed: password too short");
      toast.error("Kata sandi minimal 8 karakter.");
      return;
    }

    if (newPass !== confirmPass) {
      console.log("[ResetPassword] Validation failed: passwords don't match");
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    console.log("[ResetPassword] ✓ Validation passed");

    setLoading(true);

    try {
      console.log("[ResetPassword] ========== START PASSWORD UPDATE ==========");
      console.log("[ResetPassword] 1. Full URL:", window.location.href);
      console.log("[ResetPassword] 2. URL hash:", window.location.hash);
      console.log("[ResetPassword] 3. URL pathname:", window.location.pathname);

      // Check session before update
      console.log("[ResetPassword] 4. Calling getSession()...");
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      console.log("[ResetPassword] 5. getSession() result:");
      console.log("   - sessionError:", sessionError);
      console.log("   - session:", sessionData?.session);
      console.log("   - has session:", !!sessionData?.session);

      if (sessionData?.session) {
        console.log("[ResetPassword] 6. Session details:");
        console.log("   - User ID:", sessionData.session.user.id);
        console.log("   - User email:", sessionData.session.user.email);
        console.log("   - Recovery sent at:", sessionData.session.user.recovery_sent_at);
      } else {
        console.error("[ResetPassword] ✗ NO RECOVERY SESSION");
        console.error("[ResetPassword] Session is missing or invalid");
        console.error("[ResetPassword] This means the recovery token is expired or invalid");
        toast.error("Session reset password tidak valid. Silakan minta link reset baru.");
        setLoading(false);
        return;
      }

      // Call updateUser
      console.log("[ResetPassword] 7. Calling supabase.auth.updateUser()...");
      console.log("[ResetPassword] 8. New password length:", newPass.length);

      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: newPass,
      });

      console.log("[ResetPassword] 9. updateUser() result:");
      console.log("   - updateError:", updateError);
      console.log("   - updateData:", updateData);

      if (updateError) {
        console.error("[ResetPassword] ========== UPDATE ERROR ==========");
        console.error("[ResetPassword] Error status:", updateError.status);
        console.error("[ResetPassword] Error code:", updateError.code);
        console.error("[ResetPassword] Error message:", updateError.message);
        console.error("[ResetPassword] Error name:", updateError.name);
        console.error("[ResetPassword] Full error object:", JSON.stringify(updateError, null, 2));
        toast.error(`Error: ${updateError.message}`);
        return;
      }

      console.log("[ResetPassword] ========== PASSWORD UPDATE SUCCESS ==========");
      console.log("[ResetPassword] ✓ Password updated successfully");
      console.log("[ResetPassword] Updated user:", updateData?.user?.email);

      toast.success("Password berhasil diperbarui. Silakan login.");

      // Clear recovery flag
      console.log("[ResetPassword] 10. Clearing password recovery flag");
      clearPasswordRecovery();

      // Set loading false BEFORE signOut
      console.log("[ResetPassword] 11. Setting loading to false");
      setLoading(false);

      // Delayed signOut and navigation
      console.log("[ResetPassword] 12. Scheduling signOut and navigation in 500ms");
      setTimeout(() => {
        console.log("[ResetPassword] 13. Calling supabase.auth.signOut()");
        supabase.auth.signOut().catch((err) => {
          console.error("[ResetPassword] signOut error (non-fatal):", err);
        });
        console.log("[ResetPassword] 14. Navigating to login");
        onNavigate("login");
      }, 500);

    } catch (err: any) {
      console.error("[ResetPassword] ========== CATCH ERROR ==========");
      console.error("[ResetPassword] Error type:", typeof err);
      console.error("[ResetPassword] Error constructor:", err?.constructor?.name);
      console.error("[ResetPassword] Error object:", err);
      console.error("[ResetPassword] Error message:", err?.message || err);
      console.error("[ResetPassword] Error stack:", err?.stack);
      console.error("[ResetPassword] Error toJSON:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan tidak terduga"}`);
    } finally {
      console.log("[ResetPassword] ========== FINALLY BLOCK ==========");
      console.log("[ResetPassword] Setting loading to false in finally");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && valid) handleSubmit();
  };

  return (
    <Layout title="Buat Kata Sandi Baru" subtitle="Masukkan kata sandi baru untuk akun Anda" onNavigate={onNavigate}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onKeyDown={handleKeyDown}>
        {/* Info banner - show different message based on session validity */}
        {showInvalidSessionBanner ? (
          <div style={{ padding: "0.875rem 1rem", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <ShieldCheck style={{ width: 16, height: 16, color: "#DC2626", flexShrink: 0 }} />
            <p style={{ fontSize: "0.8rem", color: "#991B1B", lineHeight: 1.6 }}>
              Session reset password tidak valid. Silakan minta link reset baru.
            </p>
          </div>
        ) : (
          <div style={{ padding: "0.875rem 1rem", borderRadius: 10, background: "#EDF5F1", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <ShieldCheck style={{ width: 16, height: 16, color: "#16A34A", flexShrink: 0 }} />
            <p style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.6 }}>
              Link verifikasi valid. Silakan masukkan kata sandi baru.
            </p>
          </div>
        )}

        {/* New Password */}
        <Field label="Kata Sandi Baru" type={showNew ? "text" : "password"} placeholder="Min. 8 karakter" icon={Lock} value={newPass} onChange={setNewPass}
          right={<button type="button" onClick={() => setShowNew(!showNew)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", display: "flex" }}>
            {showNew ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
          </button>} />

        {newPass.length > 0 && newPass.length < 8 && (
          <p style={{ fontSize: "0.72rem", color: "#D97706", marginTop: "-0.25rem" }}>Kata sandi minimal 8 karakter</p>
        )}

        {/* Confirm Password */}
        <Field label="Konfirmasi Kata Sandi" type={showConf ? "text" : "password"} placeholder="Ulangi kata sandi baru" icon={Lock} value={confirmPass} onChange={setConfirmPass}
          right={<button type="button" onClick={() => setShowConf(!showConf)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", display: "flex" }}>
            {showConf ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
          </button>} />

        {confirmPass.length > 0 && !passwordsMatch && (
          <p style={{ fontSize: "0.72rem", color: "#DC2626", marginTop: "-0.25rem" }}>Kata sandi tidak cocok</p>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={!valid || loading}
          style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: valid ? S.dark : "#C4B9AA", color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: valid && !loading ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            Menyimpan...
          </span> : "Simpan Kata Sandi Baru"}
        </button>

        {/* Back to login */}
        <p style={{ textAlign: "center", fontSize: "0.82rem", color: S.muted }}>
          <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: S.gold, fontWeight: 600, fontSize: "0.82rem", padding: 0 }}>
            ← Kembali ke Login
          </button>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}
