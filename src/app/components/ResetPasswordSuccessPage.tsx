import { CheckCircle2 } from "lucide-react";
import { Layout, S } from "./AuthPages";

interface Props { onNavigate: (p: string) => void }

export function ResetPasswordSuccessPage({ onNavigate }: Props) {
  return (
    <Layout title="Password Berhasil Diperbarui" subtitle="Kata sandi akun Anda telah berhasil diperbarui" onNavigate={onNavigate}>
      <div style={{ textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <CheckCircle2 style={{ width: 32, height: 32, color: "#16A34A" }} />
        </div>

        {/* Success message */}
        <div style={{ padding: "1.125rem 1.25rem", borderRadius: 12, background: "#F0FDF4", border: "1px solid #BBF7D0", marginBottom: "1.75rem" }}>
          <p style={{ fontSize: "0.875rem", color: "#166534", lineHeight: 1.7, fontWeight: 500 }}>
            Kata sandi akun Anda telah berhasil diperbarui.
          </p>
        </div>

        {/* Instruction */}
        <p style={{ fontSize: "0.82rem", color: S.muted, lineHeight: 1.7, marginBottom: "1.75rem" }}>
          Silakan login menggunakan kata sandi baru Anda.
        </p>

        {/* Login button */}
        <button
          onClick={() => onNavigate("login")}
          style={{
            width: "100%",
            padding: "0.875rem",
            borderRadius: 10,
            background: S.dark,
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#2C2927")}
          onMouseLeave={e => (e.currentTarget.style.background = S.dark)}
        >
          Masuk Sekarang
        </button>
      </div>
    </Layout>
  );
}
