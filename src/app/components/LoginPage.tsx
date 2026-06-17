import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";
import { Field, Layout, S } from "./AuthPages";

interface Props {
  onNavigate: (p: string) => void;
  onLoginSuccess?: () => void;
}

export function LoginPage({ onNavigate, onLoginSuccess }: Props) {
  const { signIn } = useUser();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [rem, setRem] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pass) { toast.error("Isi email dan kata sandi terlebih dahulu."); return; }
    setLoading(true);
    const { error } = await signIn(email, pass);
    if (error) {
      toast.error(error.includes("Invalid") ? "Email atau kata sandi salah." : error);
      setLoading(false);
    } else {
      toast.success("Login berhasil!");
      // Use onLoginSuccess callback to ensure consistent navigation
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Fallback to direct navigation if callback not provided
        onNavigate("dashboard");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <Layout title="Selamat Datang" subtitle="Masuk ke akun SmartTitle AI Anda" onNavigate={onNavigate}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Email" type="email" placeholder="email@universitas.ac.id" icon={Mail} value={email} onChange={setEmail} autoComplete="off" />
        <Field label="Kata Sandi" type={show ? "text" : "password"} placeholder="Kata sandi Anda" icon={Lock} value={pass} onChange={v => setPass(v)} autoComplete="off"
          right={<button onClick={() => setShow(!show)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", display: "flex" }}>
            {show ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
          </button>} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", cursor: "pointer", fontSize: "0.82rem", color: S.muted }}>
            <input type="checkbox" checked={rem} onChange={e => setRem(e.target.checked)} style={{ accentColor: S.gold, width: 14, height: 14 }} />
            Ingat Saya
          </label>
          <button onClick={() => onNavigate("forgot-password")} style={{ background: "none", border: "none", cursor: "pointer", color: S.gold, fontSize: "0.82rem", fontWeight: 600, padding: 0 }}>Lupa Sandi?</button>
        </div>

        <button onClick={submit} disabled={loading} onKeyDown={handleKeyDown}
          style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: S.dark, color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.15s" }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#2C2927"; }}
          onMouseLeave={e => (e.currentTarget.style.background = S.dark)}>
          {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
            Memproses...
          </span> : "Masuk"}
        </button>

        <p style={{ textAlign: "center", fontSize: "0.82rem", color: S.muted }}>
          Belum punya akun?{" "}
          <button onClick={() => onNavigate("register")} style={{ background: "none", border: "none", cursor: "pointer", color: S.gold, fontWeight: 600, fontSize: "0.82rem", padding: 0 }}>Daftar Sekarang</button>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}
