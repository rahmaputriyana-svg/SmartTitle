import { useState } from "react";
import { Sparkles, Eye, EyeOff, ArrowLeft, Mail, Lock, User, CheckCircle2, ShieldCheck } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";

interface Props { onNavigate: (p: string) => void }

export const S = {
  bg: "#F5F2EC",
  dark: "#1C1917",
  gold: "#C4933F",
  muted: "#78716C",
  border: "#E3DDD4",
  inputBg: "#F5F2EC",
};

export function Field({
  label, type = "text", placeholder, icon: Icon, value, onChange, right,
}: {
  label: string; type?: string; placeholder: string;
  icon?: any; value: string; onChange: (v: string) => void; right?: React.ReactNode;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && <Icon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: focus ? S.gold : "#A8A29E" }} />}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: "100%", padding: `0.65rem ${right ? "2.75rem" : "0.875rem"} 0.65rem ${Icon ? "2.375rem" : "0.875rem"}`,
            borderRadius: 10, border: `1px solid ${focus ? S.gold : S.border}`,
            background: focus ? "#fff" : S.inputBg, fontSize: "0.875rem", color: S.dark,
            outline: "none", boxSizing: "border-box",
            boxShadow: focus ? `0 0 0 3px rgba(196,147,63,0.12)` : "none", transition: "all 0.15s",
          }}
        />
        {right && <div style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)" }}>{right}</div>}
      </div>
    </div>
  );
}

export function Layout({ children, title, subtitle, onNavigate }: { children: React.ReactNode; title: string; subtitle: string; onNavigate: (p: string) => void }) {
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem", marginTop: "2rem" }}>
            {[["50K+","Judul Dibuat"],["12K+","Pengguna"],["4.9★","Rating"]].map(([v, l], i) => (
              <div key={i} style={{ textAlign: "center", padding: "0.875rem 0.5rem", borderRadius: 10, background: "rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>{v}</p>
                <p style={{ fontSize: "0.68rem", color: "#A8A29E", marginTop: "0.125rem" }}>{l}</p>
              </div>
            ))}
          </div>
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

          <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: S.dark, marginBottom: "0.375rem" }}>{title}</h1>
          <p style={{ fontSize: "0.875rem", color: S.muted, marginBottom: "1.75rem" }}>{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  );
}

export function LoginPage({ onNavigate }: Props) {
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
      // App.tsx will auto-redirect to dashboard via useEffect
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  return (
    <Layout title="Selamat Datang" subtitle="Masuk ke akun SmartTitle AI Anda" onNavigate={onNavigate}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Email" type="email" placeholder="email@universitas.ac.id" icon={Mail} value={email} onChange={setEmail} />
        <Field label="Kata Sandi" type={show ? "text" : "password"} placeholder="Kata sandi Anda" icon={Lock} value={pass} onChange={v => setPass(v)}
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

export function RegisterPage({ onNavigate }: Props) {
  const { signUp } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = pass.length === 0 ? 0 : pass.length < 6 ? 1 : pass.length < 10 ? 2 : pass.length < 14 ? 3 : 4;
  const strengthColor = ["","#DC2626","#D97706","#EAB308","#16A34A"][strength];
  const strengthLabel = ["","Lemah","Cukup","Kuat","Sangat Kuat"][strength];

  const submit = async () => {
    if (!name || !email || !pass) { toast.error("Semua field wajib diisi."); return; }
    if (pass.length < 8) { toast.error("Kata sandi minimal 8 karakter."); return; }
    if (pass !== confirm) { toast.error("Konfirmasi kata sandi tidak cocok."); return; }
    if (!agree) { toast.error("Setujui syarat & ketentuan terlebih dahulu."); return; }

    setLoading(true);
    const { error } = await signUp(email, pass, name);
    if (error) {
      toast.error(error.includes("already registered") ? "Email sudah terdaftar." : error);
      setLoading(false);
    } else {
      toast.success("Akun berhasil dibuat! Silakan login.");
      onNavigate("login");
    }
  };

  return (
    <Layout title="Buat Akun Baru" subtitle="Daftar gratis dan mulai generate judul skripsi" onNavigate={onNavigate}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <Field label="Nama Lengkap" placeholder="Nama lengkap Anda" icon={User} value={name} onChange={setName} />
        <Field label="Email" type="email" placeholder="email@universitas.ac.id" icon={Mail} value={email} onChange={setEmail} />
        <div>
          <Field label="Kata Sandi" type={showP ? "text" : "password"} placeholder="Min. 8 karakter" icon={Lock} value={pass} onChange={setPass}
            right={<button onClick={() => setShowP(!showP)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", display: "flex" }}>
              {showP ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
            </button>} />
          {pass.length > 0 && (
            <div style={{ marginTop: "0.375rem" }}>
              <div style={{ display: "flex", gap: "3px" }}>
                {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 3, background: i <= strength ? strengthColor : "#E3DDD4", transition: "background 0.2s" }} />)}
              </div>
              <p style={{ fontSize: "0.7rem", color: strengthColor, marginTop: "0.25rem" }}>{strengthLabel}</p>
            </div>
          )}
        </div>
        <Field label="Konfirmasi Kata Sandi" type={showC ? "text" : "password"} placeholder="Ulangi kata sandi" icon={Lock} value={confirm} onChange={setConfirm}
          right={<div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {confirm.length > 0 && (confirm === pass
              ? <CheckCircle2 style={{ width: 14, height: 14, color: "#16A34A" }} />
              : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #DC2626" }} />)}
            <button onClick={() => setShowC(!showC)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8A29E", display: "flex" }}>
              {showC ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
            </button>
          </div>} />

        <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", cursor: "pointer" }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ accentColor: S.gold, marginTop: 2 }} />
          <span style={{ fontSize: "0.78rem", color: S.muted, lineHeight: 1.6 }}>
            Saya setuju dengan <a href="#" onClick={e => { e.preventDefault(); onNavigate("terms"); }} style={{ color: S.gold, cursor: "pointer" }}>Syarat & Ketentuan</a> dan <a href="#" onClick={e => { e.preventDefault(); onNavigate("privacy"); }} style={{ color: S.gold, cursor: "pointer" }}>Kebijakan Privasi</a>
          </span>
        </label>

        <button onClick={submit} disabled={!agree || loading}
          style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: agree ? S.dark : "#C4B9AA", color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: agree && !loading ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
          {loading ? "Mendaftarkan..." : "Buat Akun"}
        </button>
        <p style={{ textAlign: "center", fontSize: "0.82rem", color: S.muted }}>
          Sudah punya akun?{" "}
          <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: S.gold, fontWeight: 600, fontSize: "0.82rem", padding: 0 }}>Masuk</button>
        </p>
      </div>
    </Layout>
  );
}

export function ForgotPasswordPage({ onNavigate }: Props) {
  const { resetPassword } = useUser();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      setSent(true);
    }
  };

  return (
    <Layout title={sent ? "Email Terkirim!" : "Lupa Kata Sandi"} subtitle={sent ? `Link reset dikirim ke ${email}` : "Masukkan email terdaftar untuk reset kata sandi"} onNavigate={onNavigate}>
      {sent ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <CheckCircle2 style={{ width: 26, height: 26, color: "#16A34A" }} />
          </div>
          <p style={{ fontSize: "0.875rem", color: S.muted, lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Cek inbox atau folder spam. Link reset kedaluwarsa dalam <strong>30 menit</strong>.
          </p>
          <button onClick={() => onNavigate("login")}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: S.dark, color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: "pointer" }}>
            Kembali ke Login
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ padding: "0.875rem 1rem", borderRadius: 10, background: "#F5ECD9", border: "1px solid #E8D5B0" }}>
            <p style={{ fontSize: "0.8rem", color: "#92672A", lineHeight: 1.6 }}>
              Kami akan mengirim link reset ke email yang terdaftar di SmartTitle AI.
            </p>
          </div>
          <Field label="Email Terdaftar" type="email" placeholder="email@universitas.ac.id" icon={Mail} value={email} onChange={setEmail} />
          <button onClick={submit} disabled={!email || loading}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: email ? S.dark : "#C4B9AA", color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: email && !loading ? "pointer" : "not-allowed" }}>
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
          <p style={{ textAlign: "center", fontSize: "0.82rem", color: S.muted }}>
            <button onClick={() => onNavigate("login")} style={{ background: "none", border: "none", cursor: "pointer", color: S.gold, fontWeight: 600, fontSize: "0.82rem", padding: 0 }}>← Kembali ke Login</button>
          </p>
        </div>
      )}
    </Layout>
  );
}

