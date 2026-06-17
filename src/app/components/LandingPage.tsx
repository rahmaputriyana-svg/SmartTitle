import { useState, useEffect, useCallback } from "react";
import { Sparkles, BookOpen, Clock, Copy, LayoutDashboard, Search, ArrowRight, CheckCircle2, Menu, X, GraduationCap, Info, Shield, Heart } from "lucide-react";

interface Props { onNavigate: (p: string) => void }

const NAV_ITEMS = [
  { label: "Beranda", target: "beranda" },
  { label: "Fitur", target: "fitur" },
  { label: "Cara Kerja", target: "cara-kerja" },
  { label: "Tentang", target: "tentang" },
] as const;

const F = [
  { icon: Sparkles, title: "Generator Judul Skripsi", desc: "Rekomendasi judul akademis berkualitas dalam hitungan detik menggunakan AI." },
  { icon: Search, title: "Berbasis Topik & Kata Kunci", desc: "Judul relevan sesuai bidang studi, topik, dan kata kunci spesifik Anda." },
  { icon: Clock, title: "Riwayat Tersimpan Otomatis", desc: "Semua hasil tersimpan dan dapat diakses kembali kapan saja." },
  { icon: Copy, title: "Salin Satu Klik", desc: "Salin judul pilihan langsung ke clipboard dan gunakan di dokumen." },
  { icon: LayoutDashboard, title: "Dashboard Personal", desc: "Pantau statistik dan kelola semua judul dari satu tempat." },
  { icon: GraduationCap, title: "Standar Akademik", desc: "Setiap judul mengikuti kaidah penulisan ilmiah yang berlaku." },
];

const STEPS = [
  { n: "01", t: "Pilih Bidang", d: "Pilih bidang ilmu sesuai jurusan Anda." },
  { n: "02", t: "Masukkan Topik", d: "Tentukan topik spesifik yang ingin diteliti." },
  { n: "03", t: "Kata Kunci", d: "Tambahkan kata kunci untuk hasil lebih tepat." },
  { n: "04", t: "Dapatkan Judul", d: "AI menghasilkan rekomendasi judul terbaik." },
];

export function LandingPage({ onNavigate }: Props) {
  const [mob, setMob] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMob(false);
    }
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(n => n.target);
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter',sans-serif", background: "#F5F2EC" }}>

      {/* NAV */}
      <nav style={{ background: "#FFFFFF", borderBottom: "1px solid #E3DDD4", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "3.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <img src="/logo.png" alt="SmartTitle AI" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "contain" }} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1C1917" }}>
                SmartTitle<span style={{ color: "#C4933F" }}> AI</span>
              </span>
            </div>

            <div className="hidden md:flex" style={{ gap: "0.25rem" }}>
              {NAV_ITEMS.map(({ label, target }) => {
                const isActive = activeSection === target;
                return (
                  <a key={target} href={`#${target}`} onClick={e => { e.preventDefault(); scrollToSection(target); }}
                    style={{ padding: "0.375rem 0.875rem", borderRadius: 8, fontSize: "0.85rem", color: isActive ? "#1C1917" : "#78716C", fontWeight: isActive ? 600 : 400, textDecoration: "none", background: isActive ? "#F5ECD9" : "transparent", transition: "all 0.15s" }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = "#1C1917"; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = "#78716C"; }}>
                    {label}
                  </a>
                );
              })}
            </div>

            <div className="hidden md:flex" style={{ gap: "0.5rem", alignItems: "center" }}>
              <button onClick={() => onNavigate("login")}
                style={{ padding: "0.425rem 1rem", borderRadius: 8, fontSize: "0.85rem", color: "#1C1917", background: "transparent", border: "1px solid #E3DDD4", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#F5F2EC")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Masuk
              </button>
              <button onClick={() => onNavigate("register")}
                style={{ padding: "0.425rem 1.125rem", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, color: "#FFFFFF", background: "#1C1917", border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2C2927")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1C1917")}>
                Daftar Gratis
              </button>
            </div>

            <button className="md:hidden" onClick={() => setMob(!mob)}
              style={{ padding: "0.375rem", borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: "#78716C" }}>
              {mob ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
            </button>
          </div>

          {mob && (
            <div style={{ borderTop: "1px solid #E3DDD4", padding: "0.75rem 0 1rem" }}>
              {NAV_ITEMS.map(({ label, target }) => {
                const isActive = activeSection === target;
                return (
                  <a key={target} href={`#${target}`} onClick={e => { e.preventDefault(); scrollToSection(target); }}
                    style={{ display: "block", padding: "0.5rem 0.75rem", borderRadius: 8, fontSize: "0.875rem", color: isActive ? "#1C1917" : "#78716C", fontWeight: isActive ? 600 : 400, textDecoration: "none", background: isActive ? "#F5ECD9" : "transparent" }}>
                    {label}
                  </a>
                );
              })}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #E3DDD4" }}>
                <button onClick={() => onNavigate("login")} style={{ flex: 1, padding: "0.5rem", borderRadius: 8, border: "1px solid #E3DDD4", background: "transparent", fontSize: "0.875rem", color: "#1C1917", cursor: "pointer" }}>Masuk</button>
                <button onClick={() => onNavigate("register")} style={{ flex: 1, padding: "0.5rem", borderRadius: 8, border: "none", background: "#1C1917", fontSize: "0.875rem", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Daftar</button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="beranda" className="responsive-section" style={{ padding: "clamp(3rem,8vw,5rem) 1.25rem", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 0.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.3rem 0.875rem", borderRadius: 99, background: "#F5ECD9", border: "1px solid #E8D5B0", color: "#A0742A", fontSize: "clamp(0.6875rem,2vw,0.75rem)", fontWeight: 600, marginBottom: "clamp(1.25rem,4vw,1.75rem)" }}>
            <Sparkles style={{ width: 11, height: 11 }} />
            Didukung Gemini AI
          </div>

          <h1 style={{ fontSize: "clamp(1.75rem,6vw,3.25rem)", fontWeight: 700, color: "#1C1917", lineHeight: 1.15, marginBottom: "clamp(1rem,3vw,1.25rem)" }}>
            Temukan Judul Skripsi<br />
            <span style={{ color: "#C4933F" }}>Lebih Cepat dengan AI</span>
          </h1>

          <p style={{ fontSize: "clamp(0.9375rem,2.5vw,1.05rem)", color: "#78716C", lineHeight: 1.75, marginBottom: "clamp(1.75rem,5vw,2.25rem)", maxWidth: 480, margin: "0 auto clamp(1.75rem,5vw,2.25rem)" }}>
            Masukkan bidang, topik, dan kata kunci. SmartTitle AI memberikan rekomendasi judul penelitian yang relevan dan berkualitas akademik.
          </p>

          <button onClick={() => onNavigate("register")}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "clamp(0.625rem,2vw,0.75rem) clamp(1.25rem,4vw,1.75rem)", borderRadius: 10, background: "#1C1917", color: "#fff", fontSize: "clamp(0.875rem,2.5vw,0.95rem)", fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(28,25,23,0.18)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2C2927"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#1C1917"; e.currentTarget.style.transform = "none"; }}>
            Mulai Sekarang
            <ArrowRight style={{ width: 16, height: 16 }} />
          </button>

          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "clamp(0.75rem,3vw,1.25rem)", marginTop: "clamp(1.5rem,4vw,2rem)" }}>
            {["50.000+ judul dibuat","12.000+ mahasiswa aktif","Gratis untuk memulai"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "clamp(0.6875rem,2vw,0.8rem)", color: "#78716C" }}>
                <CheckCircle2 style={{ width: 14, height: 14, color: "#5A8A5A" }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="responsive-section" style={{ background: "#FFFFFF", padding: "clamp(3rem,8vw,4.5rem) 1.25rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3rem)" }}>
            <p style={{ fontSize: "clamp(0.6875rem,2vw,0.75rem)", fontWeight: 700, color: "#C4933F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Fitur</p>
            <h2 style={{ fontSize: "clamp(1.375rem,4vw,1.625rem)", fontWeight: 700, color: "#1C1917" }}>Semua yang Anda Butuhkan</h2>
          </div>
          <div className="responsive-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1rem" }}>
            {F.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} style={{ padding: "clamp(1.125rem,3vw,1.375rem) clamp(1.25rem,3vw,1.5rem)", borderRadius: 14, border: "1px solid #E3DDD4", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(28,25,23,0.07)"; e.currentTarget.style.borderColor = "#D4C9BC"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#E3DDD4"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "#F5ECD9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.875rem" }}>
                  <Icon style={{ width: 16, height: 16, color: "#C4933F" }} />
                </div>
                <p style={{ fontSize: "clamp(0.8125rem,2vw,0.9rem)", fontWeight: 600, color: "#1C1917", marginBottom: "0.375rem" }}>{title}</p>
                <p style={{ fontSize: "clamp(0.75rem,2vw,0.8rem)", color: "#78716C", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="responsive-section" style={{ background: "#F5F2EC", padding: "clamp(3rem,8vw,4.5rem) 1.25rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3rem)" }}>
            <p style={{ fontSize: "clamp(0.6875rem,2vw,0.75rem)", fontWeight: 700, color: "#C4933F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Cara Kerja</p>
            <h2 style={{ fontSize: "clamp(1.375rem,4vw,1.625rem)", fontWeight: 700, color: "#1C1917" }}>Empat Langkah Sederhana</h2>
          </div>
          <div className="responsive-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1rem" }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background: "#FFFFFF", padding: "clamp(1.25rem,3vw,1.5rem)", borderRadius: 14, border: "1px solid #E3DDD4", textAlign: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1C1917", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                  <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#C4933F" }}>{s.n}</span>
                </div>
                <p style={{ fontSize: "clamp(0.8125rem,2vw,0.875rem)", fontWeight: 600, color: "#1C1917", marginBottom: "0.375rem" }}>{s.t}</p>
                <p style={{ fontSize: "clamp(0.75rem,2vw,0.78rem)", color: "#78716C", lineHeight: 1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="responsive-section" style={{ background: "#FFFFFF", padding: "clamp(3rem,8vw,4.5rem) 1.25rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,5vw,3rem)" }}>
            <p style={{ fontSize: "clamp(0.6875rem,2vw,0.75rem)", fontWeight: 700, color: "#C4933F", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Tentang</p>
            <h2 style={{ fontSize: "clamp(1.375rem,4vw,1.625rem)", fontWeight: 700, color: "#1C1917" }}>Tentang SmartTitle AI</h2>
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "clamp(0.875rem,2.5vw,0.95rem)", color: "#78716C", lineHeight: 1.8, marginBottom: "clamp(1.5rem,4vw,2rem)" }}>
              SmartTitle AI adalah platform berbasis kecerdasan buatan yang dirancang khusus untuk membantu mahasiswa Indonesia menemukan judul skripsi yang relevan, berkualitas, dan sesuai standar akademik. Kami percaya bahwa proses penentuan topik penelitian tidak harus menjadi hambatan dalam perjalanan akademik Anda.
            </p>
            <div className="responsive-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "1rem" }}>
              {[
                { icon: Info, title: "Transparan", desc: "Proses rekomendasi yang jelas dan dapat dipertanggungjawabkan." },
                { icon: Shield, title: "Aman", desc: "Data Anda terlindungi dengan standar keamanan tinggi." },
                { icon: Heart, title: "Gratis", desc: "Dapat digunakan tanpa biaya oleh seluruh mahasiswa." },
              ].map(({ icon: Icon, title, desc }, i) => (
                <div key={i} style={{ padding: "clamp(1.25rem,3vw,1.5rem)", borderRadius: 14, border: "1px solid #E3DDD4", textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "#F5ECD9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
                    <Icon style={{ width: 16, height: 16, color: "#C4933F" }} />
                  </div>
                  <p style={{ fontSize: "clamp(0.8125rem,2vw,0.9rem)", fontWeight: 600, color: "#1C1917", marginBottom: "0.375rem" }}>{title}</p>
                  <p style={{ fontSize: "clamp(0.75rem,2vw,0.8rem)", color: "#78716C", lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="responsive-section" style={{ background: "#FFFFFF", padding: "clamp(3rem,8vw,4rem) 1.25rem" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "#1C1917", borderRadius: 18, padding: "clamp(2rem,6vw,2.75rem) clamp(1.5rem,4vw,2rem)" }}>
            <h2 style={{ fontSize: "clamp(1.25rem,4vw,1.5rem)", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.875rem" }}>Mulai Riset Anda Sekarang</h2>
            <p style={{ fontSize: "clamp(0.8125rem,2.5vw,0.9rem)", color: "#A8A29E", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Bergabung dengan ribuan mahasiswa yang sudah menggunakan SmartTitle AI.
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: "0.625rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => onNavigate("register")}
                style={{ padding: "clamp(0.5rem,2vw,0.625rem) clamp(1rem,3vw,1.5rem)", borderRadius: 9, background: "#C4933F", color: "#fff", fontSize: "clamp(0.8125rem,2vw,0.875rem)", fontWeight: 600, border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#B8874A")}
                onMouseLeave={e => (e.currentTarget.style.background = "#C4933F")}>
                Daftar Gratis
              </button>
              <button onClick={() => onNavigate("login")}
                style={{ padding: "clamp(0.5rem,2vw,0.625rem) clamp(1rem,3vw,1.5rem)", borderRadius: 9, background: "transparent", color: "#A8A29E", fontSize: "clamp(0.8125rem,2vw,0.875rem)", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
                Sudah punya akun?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #E3DDD4", padding: "1.75rem 1.25rem", background: "#F5F2EC" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src="/logo.png" alt="SmartTitle AI" style={{ width: 24, height: 24, borderRadius: 6, objectFit: "contain" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1C1917" }}>SmartTitle AI</span>
          </div>
          <p style={{ fontSize: "0.78rem", color: "#A8A29E" }}>© 2026 SmartTitle AI. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {["Privasi","Syarat","Kontak"].map(i => (
              <a key={i} href="#" style={{ fontSize: "0.78rem", color: "#A8A29E", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1C1917")}
                onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>{i}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
