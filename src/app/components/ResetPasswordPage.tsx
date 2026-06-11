import { useState } from "react";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useUser } from "../UserContext";
import { Layout, Field, S } from "./AuthPages";
import { toast } from "sonner";

interface Props { onNavigate: (p: string) => void }

export function ResetPasswordPage({ onNavigate }: Props) {
  const { updatePassword, signOut } = useUser();
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordsMatch = newPass === confirmPass;
  const minLengthMet = newPass.length >= 8;
  const valid = minLengthMet && passwordsMatch && newPass.length > 0;

  const submit = async () => {
    if (!newPass) { toast.error("Kata sandi tidak boleh kosong."); return; }
    if (!minLengthMet) { toast.error("Kata sandi minimal 8 karakter."); return; }
    if (!passwordsMatch) { toast.error("Konfirmasi kata sandi tidak cocok."); return; }
    if (!valid) return;

    setLoading(true);
    const { error } = await updatePassword(newPass);
    if (error) {
      setLoading(false);
      toast.error(error);
    } else {
      // Sign out after successful password update so user must log in with new password
      await signOut();
      setLoading(false);
      setSuccess(true);
      toast.success("Kata sandi berhasil diperbarui!");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && valid) submit();
  };

  // Success state
  if (success) {
    return (
      <Layout title="Kata Sandi Diperbarui" subtitle="Kata sandi Anda telah berhasil diubah" onNavigate={onNavigate}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <ShieldCheck style={{ width: 26, height: 26, color: "#16A34A" }} />
          </div>
          <p style={{ fontSize: "0.875rem", color: S.muted, lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Anda dapat login dengan kata sandi baru Anda.
          </p>
          <button onClick={() => onNavigate("login")}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: S.dark, color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.background = "#2C2927")}
            onMouseLeave={e => (e.currentTarget.style.background = S.dark)}>
            Masuk dengan Kata Sandi Baru
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Buat Kata Sandi Baru" subtitle="Masukkan kata sandi baru untuk akun Anda" onNavigate={onNavigate}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onKeyDown={handleKeyDown}>
        {/* Info banner */}
        <div style={{ padding: "0.875rem 1rem", borderRadius: 10, background: "#EDF5F1", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <ShieldCheck style={{ width: 16, height: 16, color: "#16A34A", flexShrink: 0 }} />
          <p style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.6 }}>
            Link verifikasi valid. Silakan masukkan kata sandi baru.
          </p>
        </div>

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
        <button onClick={submit} disabled={!valid || loading}
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
