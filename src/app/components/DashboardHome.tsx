import { Sparkles, FileText, Clock, TrendingUp, ArrowRight, Copy, LayoutDashboard } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";

interface Props { onNavigate: (p: string) => void }

export function DashboardHome({ onNavigate }: Props) {
  const { profile, stats, history, toggleSave } = useUser();
  const firstName = profile.name.split(" ")[0];

  const recent = history.slice(0, 4);

  const cards = [
    { label: "Total Generate", value: stats.totalSessions, icon: TrendingUp, color: "#1C1917", accent: "#F5F2EC" },
    { label: "Total Judul", value: stats.totalTitles, icon: Sparkles, color: "#C4933F", accent: "#FDF5E8" },
    { label: "Total Favorit", value: stats.totalFavorites, icon: FileText, color: "#3D6B5A", accent: "#EDF5F1" },
    { label: "Bidang Penelitian", value: stats.totalFields, icon: LayoutDashboard, color: "#5A4B8A", accent: "#F0EDF9" },
  ];

  const copyTitle = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    toast.success("Judul disalin!");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Welcome */}
      <div style={{ background: "#1C1917", borderRadius: 16, padding: "1.5rem 1.75rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: "0.72rem", color: "#C4933F", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "0.375rem" }}>Dashboard</p>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
            Halo, {firstName}!
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#A8A29E" }}>
            {stats.totalSessions === 0
              ? "Mulai generate judul pertama Anda hari ini."
              : `Kamu sudah ${stats.totalSessions} sesi generate dan membuat ${stats.totalTitles} judul.`}
          </p>
        </div>
        <button onClick={() => onNavigate("generator")}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: 10, background: "#C4933F", color: "#fff", fontSize: "0.85rem", fontWeight: 600, border: "none", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#B8874A"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#C4933F"; e.currentTarget.style.transform = "none"; }}>
          <Sparkles style={{ width: 15, height: 15 }} />
          Generate Judul
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.875rem" }}>
        {cards.map(({ label, value, icon: Icon, color, accent }, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E3DDD4", padding: "1.125rem 1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon style={{ width: 16, height: 16, color }} />
              </div>
            </div>
            <p style={{ fontSize: "1.875rem", fontWeight: 800, color: "#1C1917", lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: "0.78rem", color: "#78716C", marginTop: "0.25rem" }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.875rem" }} className="lg:grid-cols-2" >
        {/* Recent history */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E3DDD4", overflow: "hidden", gridColumn: "span 1" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #E3DDD4" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1C1917" }}>Aktivitas Terbaru</p>
            <button onClick={() => onNavigate("history")} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "#C4933F", fontSize: "0.78rem", fontWeight: 600, padding: 0 }}>
              Lihat Semua <ArrowRight style={{ width: 12, height: 12 }} />
            </button>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
              <Clock style={{ width: 28, height: 28, color: "#C4B9AA", margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "0.82rem", color: "#A8A29E" }}>Belum ada aktivitas. Mulai generate judul!</p>
              <button onClick={() => onNavigate("generator")}
                style={{ marginTop: "1rem", padding: "0.5rem 1.25rem", borderRadius: 8, background: "#1C1917", color: "#fff", fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                Generate Sekarang
              </button>
            </div>
          ) : (
            <div>
              {recent.map((item, i) => (
                <div key={item.id} style={{ padding: "0.875rem 1.25rem", borderBottom: i < recent.length - 1 ? "1px solid #F5F2EC" : "none" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.375rem" }}>
                    <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#F5ECD9", color: "#92672A", fontSize: "0.67rem", fontWeight: 600 }}>{item.field}</span>
                    <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#EDE8DF", color: "#78716C", fontSize: "0.67rem", fontWeight: 600 }}>{item.topic}</span>
                    <span style={{ marginLeft: "auto", fontSize: "0.67rem", color: "#A8A29E" }}>
                      {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#1C1917", lineHeight: 1.5 }}>
                    {item.results[0]?.text ?? "—"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.68rem", color: "#A8A29E" }}>{item.results.length} judul · {item.results.filter(r => r.saved).length} disimpan</span>
                    <button onClick={() => copyTitle(item.results[0]?.text ?? "")}
                      style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "#A8A29E", fontSize: "0.68rem", padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#C4933F")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
                      <Copy style={{ width: 11, height: 11 }} /> Salin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E3DDD4", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #E3DDD4" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1C1917" }}>Aksi Cepat</p>
          </div>
          <div style={{ padding: "0.75rem" }}>
            {[
              { label: "Generate Judul Baru", desc: "Buat rekomendasi judul dengan AI", page: "generator", icon: Sparkles, color: "#C4933F" },
              { label: "Lihat Semua Riwayat", desc: "Akses semua judul yang pernah dibuat", page: "history", icon: Clock, color: "#3D6B5A" },
              { label: "Perbarui Profil", desc: "Kelola informasi akun Anda", page: "profile", icon: FileText, color: "#5A4B8A" },
            ].map((a, i) => (
              <button key={i} onClick={() => onNavigate(a.page)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", borderRadius: 10, border: "1px solid transparent", background: "transparent", cursor: "pointer", textAlign: "left", marginBottom: "0.375px", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F5F2EC"; e.currentTarget.style.borderColor = "#E3DDD4"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#F5F2EC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon style={{ width: 15, height: 15, color: a.color }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1C1917" }}>{a.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#78716C" }}>{a.desc}</p>
                </div>
                <ArrowRight style={{ width: 13, height: 13, color: "#C4B9AA", marginLeft: "auto", flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
