import { ArrowLeft, ShieldCheck, Mail } from "lucide-react";
import { S } from "./AuthPages";
import type { LegalSection } from "./TermsPage";

interface Props { onNavigate: (p: string) => void }

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    title: "1. Data yang Dikumpulkan",
    content: [
      "Kami mengumpulkan data yang Anda berikan secara langsung saat mendaftar, seperti nama lengkap, alamat email, dan kata sandi (yang disimpan dalam bentuk terenkripsi).",
      "Kami mengumpulkan data penggunaan aplikasi, termasuk judul yang dihasilkan, kata kunci yang digunakan, dan riwayat aktivitas generasi.",
      "Kami tidak mengumpulkan data dari pihak ketiga dan tidak melacak aktivitas browsing Anda di luar aplikasi SmartTitle AI.",
    ],
  },
  {
    title: "2. Penggunaan Data",
    content: [
      "Data yang dikumpulkan digunakan untuk menyediakan dan meningkatkan layanan SmartTitle AI, termasuk menghasilkan rekomendasi judul yang relevan.",
      "Kami menggunakan data penggunaan untuk menganalisis tren dan meningkatkan kualitas algoritma rekomendasi kami.",
      "Kami tidak akan menjual, menyewakan, atau membagikan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.",
      "Data dapat digunakan dalam bentuk anonim atau teragregasi untuk keperluan analisis dan penelitian tanpa mengidentifikasi individu.",
    ],
  },
  {
    title: "3. Penyimpanan Data di Supabase",
    content: [
      "Seluruh data pengguna disimpan secara aman di platform Supabase yang menggunakan standar keamanan industri.",
      "Supabase menerapkan enkripsi data saat transit (TLS) dan saat penyimpanan (encryption at rest) untuk melindungi informasi Anda.",
      "Data disimpan di pusat data yang memiliki sertifikasi keamanan dan redundansi tinggi untuk memastikan ketersediaan layanan.",
      "Pencadangan data dilakukan secara berkala untuk mencegah kehilangan data yang tidak diinginkan.",
    ],
  },
  {
    title: "4. Penggunaan Gemini AI",
    content: [
      "SmartTitle AI menggunakan Gemini AI dari Google untuk memproses permintaan generasi judul Anda.",
      "Saat Anda menggunakan fitur generator, kata kunci dan topik yang Anda masukkan dikirim ke API Gemini AI untuk diproses.",
      "Google memproses data ini sesuai dengan kebijakan privasi dan keamanan AI mereka. Data tidak digunakan oleh Google untuk melatih model mereka.",
      "Hasil generasi judul yang dikembalikan oleh Gemini AI disimpan di akun Anda di Supabase dan tidak dibagikan secara publik.",
    ],
  },
  {
    title: "5. Keamanan Data",
    content: [
      "Kami menerapkan langkah-langkah keamanan teknis dan organisasional yang wajar untuk melindungi data Anda dari akses tidak sah, pengubahan, pengungkapan, atau penghancuran.",
      "Kata sandi Anda disimpan menggunakan algoritma hashing yang aman dan tidak dapat dibaca bahkan oleh tim kami.",
      "Kami secara berkala meninjau dan memperbarui praktik keamanan kami untuk mengikuti standar industri terkini.",
      "Meskipun demikian, tidak ada metode transmisi atau penyimpanan data yang 100% aman, dan kami tidak dapat menjamin keamanan absolut.",
    ],
  },
  {
    title: "6. Hak Pengguna",
    content: [
      "Anda berhak mengakses dan mengunduh seluruh data pribadi yang kami simpan tentang Anda melalui halaman profil.",
      "Anda berhak meminta perbaikan data yang tidak akurat atau tidak lengkap.",
      "Anda berhak meminta penghapusan data pribadi Anda, dengan catatan bahwa beberapa data mungkin perlu disimpan untuk memenuhi kewajiban hukum.",
      "Anda berhak menarik persetujuan penggunaan data Anda kapan saja dengan menghubungi kami melalui email yang tersedia di bawah.",
    ],
  },
  {
    title: "7. Kontak",
    content: [
      "Jika Anda memiliki pertanyaan, keluhan, atau permintaan terkait privasi data Anda, silakan hubungi kami melalui:",
      "Email: privacy@smarttitle.ai",
      "Kami akan berusaha merespons permintaan Anda dalam waktu 14 hari kerja.",
      "Untuk pertanyaan terkait layanan Gemini AI, Anda juga dapat merujuk ke Kebijakan Privasi Google.",
    ],
  },
];

export function PrivacyPage({ onNavigate }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter',sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width: "42%", background: "#1C1917", flexDirection: "column", justifyContent: "space-between", padding: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img src="/logo.png" alt="SmartTitle AI" style={{ width: 32, height: 32, borderRadius: 9, objectFit: "contain" }} />
          <span style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>SmartTitle <span style={{ color: S.gold }}>AI</span></span>
        </div>

        <div>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
            <ShieldCheck style={{ width: 24, height: 24, color: S.gold }} />
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
            Kebijakan<br />Privasi
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#A8A29E", lineHeight: 1.75 }}>
            Komitmen kami untuk melindungi privasi dan data pribadi Anda saat menggunakan SmartTitle AI.
          </p>
        </div>

        <div style={{ padding: "1.125rem 1.25rem", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Mail style={{ width: 14, height: 14, color: S.gold }} />
            <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#fff" }}>Pertanyaan Privasi?</p>
          </div>
          <p style={{ fontSize: "0.72rem", color: "#A8A29E", lineHeight: 1.6 }}>Hubungi kami di privacy@smarttitle.ai</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FAFAF8", overflow: "auto", maxHeight: "100vh" }}>
        <div style={{ padding: "2rem 1.5rem", width: "100%", maxWidth: 640, margin: "0 auto", boxSizing: "border-box" }}>
          {/* Mobile header */}
          <div className="flex lg:hidden" style={{ alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <img src="/logo.png" alt="SmartTitle AI" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "contain" }} />
            <span style={{ fontWeight: 700, fontSize: "0.95rem", color: S.dark }}>SmartTitle <span style={{ color: S.gold }}>AI</span></span>
          </div>

          <button onClick={() => onNavigate("register")} style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "none", border: "none", cursor: "pointer", color: "#A8A29E", fontSize: "0.8rem", marginBottom: "1.75rem", padding: 0 }}
            onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
            onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
            <ArrowLeft style={{ width: 14, height: 14 }} /> Kembali ke Pendaftaran
          </button>

          <div className="lg:hidden" style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: S.dark, marginBottom: "0.375rem" }}>Kebijakan Privasi</h1>
            <p style={{ fontSize: "0.78rem", color: "#A8A29E" }}>Terakhir diperbarui: Juni 2026</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {PRIVACY_SECTIONS.map((s, i) => (
              <div key={i}>
                <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: S.dark, marginBottom: "0.75rem" }}>{s.title}</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {s.content.map((p, j) => (
                    <p key={j} style={{ fontSize: "0.825rem", color: S.muted, lineHeight: 1.75, paddingLeft: "0.75rem", borderLeft: `2px solid ${S.border}` }}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: `1px solid ${S.border}` }}>
            <button onClick={() => onNavigate("register")}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", borderRadius: 10, background: S.dark, color: "#fff", fontSize: "0.85rem", fontWeight: 600, border: "none", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#2C2927")}
              onMouseLeave={e => (e.currentTarget.style.background = S.dark)}>
              <ArrowLeft style={{ width: 14, height: 14 }} /> Kembali ke Pendaftaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
