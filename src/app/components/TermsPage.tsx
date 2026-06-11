import { ArrowLeft, FileText } from "lucide-react";
import { S } from "./AuthPages";

interface Props { onNavigate: (p: string) => void }

const SECTIONS = [
  {
    title: "1. Penggunaan Aplikasi",
    content: [
      "SmartTitle AI adalah platform berbasis kecerdasan buatan yang dirancang untuk membantu mahasiswa dan peneliti dalam menemukan judul skripsi atau penelitian yang relevan.",
      "Dengan menggunakan aplikasi ini, Anda menyetujui untuk mematuhi seluruh syarat dan ketentuan yang berlaku.",
      "Aplikasi ini disediakan \"sebagaimana adanya\" dan tidak menjamin bahwa hasil yang dihasilkan akan langsung dapat digunakan tanpa revisi atau penyesuaian lebih lanjut.",
    ],
  },
  {
    title: "2. Akun Pengguna",
    content: [
      "Untuk menggunakan fitur lengkap SmartTitle AI, Anda diwajibkan membuat akun dengan menyediakan informasi yang benar dan terkini.",
      "Anda bertanggung jawab atas keamanan akun Anda, termasuk menjaga kerahasiaan kata sandi dan tidak membagikannya kepada pihak lain.",
      "Segala aktivitas yang terjadi di bawah akun Anda menjadi tanggung jawab Anda. Jika Anda mendeteksi penggunaan yang tidak sah, segera hubungi kami.",
    ],
  },
  {
    title: "3. Penggunaan AI",
    content: [
      "SmartTitle AI menggunakan teknologi Gemini AI dari Google untuk menghasilkan rekomendasi judul penelitian.",
      "Hasil yang dihasilkan oleh AI bersifat sebagai saran atau referensi awal dan tidak menggantikan proses berpikir kritis serta konsultasi dengan dosen pembimbing.",
      "Kami tidak bertanggung jawab atas keakuratan, kelengkapan, atau kesesuaian judul yang dihasilkan dengan standar akademik institusi Anda.",
      "Pengguna disarankan untuk meninjau, memodifikasi, dan memvalidasi setiap rekomendasi sebelum menggunakannya secara resmi.",
    ],
  },
  {
    title: "4. Batasan Tanggung Jawab",
    content: [
      "SmartTitle AI tidak bertanggung jawab atas kerugian langsung maupun tidak langsung yang timbul dari penggunaan atau ketidakmampuan menggunakan aplikasi ini.",
      "Kami tidak menjamin bahwa aplikasi akan selalu tersedia, bebas dari kesalahan, atau aman dari ancaman pihak ketiga.",
      "Kami tidak bertanggung jawab atas keputusan akademik yang dibuat berdasarkan rekomendasi judul dari platform ini.",
    ],
  },
  {
    title: "5. Penyimpanan Data",
    content: [
      "Data pengguna dan hasil generasi judul disimpan secara aman menggunakan layanan Supabase yang berlokasi di pusat data yang terlindungi.",
      "Anda dapat mengakses, mengunduh, atau menghapus data Anda kapan saja melalui halaman profil.",
      "Kami menyimpan data Anda selama akun Anda aktif. Jika akun dihapus, data terkait akan dihapus dalam waktu 30 hari kerja.",
    ],
  },
  {
    title: "6. Larangan Penyalahgunaan",
    content: [
      "Pengguna dilarang menggunakan SmartTitle AI untuk tujuan yang melanggar hukum, tidak etis, atau merugikan pihak lain.",
      "Pengguna dilarang melakukan tindakan yang dapat merusak, melumpuhkan, atau mengganggu fungsionalitas aplikasi.",
      "Pengguna dilarang menggunakan bot, skrip otomatis, atau cara lain untuk mengakses aplikasi secara massal tanpa izin.",
      "Pelanggaran terhadap larangan ini dapat mengakibatkan penangguhan atau penghapusan akun tanpa pemberitahuan terlebih dahulu.",
    ],
  },
  {
    title: "7. Perubahan Ketentuan",
    content: [
      "Kami berhak mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan terlebih dahulu.",
      "Perubahan akan berlaku segera setelah dipublikasikan di aplikasi. Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan Anda.",
      "Kami mendorong Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan terbaru.",
    ],
  },
];

export function TermsPage({ onNavigate }: Props) {
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
            <FileText style={{ width: 24, height: 24, color: S.gold }} />
          </div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "1rem" }}>
            Syarat &<br />Ketentuan
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#A8A29E", lineHeight: 1.75 }}>
            Harap baca dengan seksama sebelum menggunakan SmartTitle AI. Dengan menggunakan aplikasi ini, Anda menyetujui seluruh ketentuan yang tercantum.
          </p>
        </div>

        <p style={{ fontSize: "0.72rem", color: "#78716C" }}>Terakhir diperbarui: Juni 2026</p>
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
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: S.dark, marginBottom: "0.375rem" }}>Syarat & Ketentuan</h1>
            <p style={{ fontSize: "0.78rem", color: "#A8A29E" }}>Terakhir diperbarui: Juni 2026</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {SECTIONS.map((s, i) => (
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
