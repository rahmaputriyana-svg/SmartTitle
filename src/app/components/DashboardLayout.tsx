import { useState } from "react";
import { Sparkles, LayoutDashboard, Clock, User, LogOut, Menu, X, Bell, Search } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";

interface Props { children: React.ReactNode; activePage: string; onNavigate: (p: string) => void }

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "generator", label: "Generator Judul", icon: Sparkles },
  { id: "history", label: "Riwayat", icon: Clock },
  { id: "profile", label: "Profil", icon: User },
];

const SIDEBAR_W = 288; // w-72 = 18rem = 288px

export function DashboardLayout({ children, activePage, onNavigate }: Props) {
  const { profile, stats, signOut } = useUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notif, setNotif] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast.success("Berhasil logout");
    onNavigate("landing");
  };

  const initials = profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: "#F5F2EC", minHeight: "100dvh" }}>

      {/* Overlay mobile — dark backdrop behind sidebar drawer */}
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
          className="lg:hidden" />
      )}

      {/* Sidebar — always fixed; visible on desktop, drawer on mobile */}
      <aside
        className={`transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50, width: SIDEBAR_W,
          background: "#0F172A", display: "flex", flexDirection: "column",
        }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.125rem 1.25rem", borderBottom: "1px solid #1E293B" }}>
          <button
            onClick={() => { onNavigate("dashboard"); setIsSidebarOpen(false); }}
            aria-label="Kembali ke Dashboard"
            style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "none", border: "none", cursor: "pointer", padding: 0,
              transition: "opacity 0.15s, transform 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}>
            <img src="/logo.png" alt="SmartTitle AI" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "contain" }} />
            <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.9rem" }}>
              SmartTitle <span style={{ color: "#C4933F" }}>AI</span>
            </span>
          </button>
          {/* Close button — only visible on mobile */}
          <button type="button" onClick={() => setIsSidebarOpen(false)} className="flex lg:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: "0.375rem" }}>
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0.75rem 0.625rem", overflowY: "auto" }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#475569", letterSpacing: "0.09em", textTransform: "uppercase", padding: "0 0.625rem", marginBottom: "0.375rem" }}>Menu</p>
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = activePage === id;
            return (
              <button key={id} onClick={() => { onNavigate(id); setIsSidebarOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "0.625rem",
                  padding: "0.575rem 0.75rem", borderRadius: 9, border: "none", cursor: "pointer",
                  background: active ? "rgba(196,147,63,0.15)" : "transparent",
                  color: active ? "#C4933F" : "#94A3B8",
                  fontSize: "0.84rem", fontWeight: active ? 600 : 400,
                  textAlign: "left", marginBottom: "1px", transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#CBD5E1"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94A3B8"; } }}>
                <Icon style={{ width: 15, height: 15, flexShrink: 0 }} />
                {label}
                {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#C4933F", marginLeft: "auto", flexShrink: 0 }} />}
              </button>
            );
          })}

          <div style={{ height: 1, background: "#1E293B", margin: "0.75rem 0.5rem" }} />

          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.575rem 0.75rem", borderRadius: 9, border: "none", cursor: "pointer", background: "transparent", color: "#64748B", fontSize: "0.84rem", textAlign: "left", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#FCA5A5"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#64748B"; e.currentTarget.style.background = "transparent"; }}>
            <LogOut style={{ width: 15, height: 15 }} />
            Logout
          </button>
        </nav>

        {/* Profile mini */}
        <div style={{ borderTop: "1px solid #1E293B", padding: "1rem 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {profile.photo
              ? <img src={profile.photo} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              : <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#C4933F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials}</div>
            }
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#E2E8F0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</p>
              <p style={{ fontSize: "0.68rem", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.prodi}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main wrapper — offset by sidebar width on desktop */}
      <div className="lg:ml-72" style={{ display: "flex", flexDirection: "column", minHeight: "100dvh" }}>

        {/* Topbar */}
        <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E3DDD4", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", height: "3.5rem", flexShrink: 0, position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Hamburger button — only visible on mobile/tablet */}
            <button onClick={() => setIsSidebarOpen(true)} className="flex lg:hidden"
              style={{ padding: "0.375rem", borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", color: "#78716C" }}>
              <Menu style={{ width: 20, height: 20 }} />
            </button>
            <div className="hidden sm:flex" style={{ alignItems: "center", gap: "0.5rem", padding: "0.375rem 0.75rem", borderRadius: 9, border: "1px solid #E3DDD4", background: "#F5F2EC" }}>
              <Search style={{ width: 14, height: 14, color: "#A8A29E" }} />
              <input placeholder="Cari judul, topik..." style={{ background: "transparent", border: "none", outline: "none", fontSize: "0.82rem", color: "#1C1917", width: 180 }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            {/* Notif */}
            <div style={{ position: "relative" }}>
              <button onClick={() => setNotif(!notif)}
                style={{ position: "relative", padding: "0.375rem", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", display: "flex" }}>
                <Bell style={{ width: 18, height: 18, color: "#78716C" }} />
                <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#C4933F", border: "2px solid #fff" }} />
              </button>
              {notif && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 280, background: "#fff", borderRadius: 12, border: "1px solid #E3DDD4", boxShadow: "0 8px 28px rgba(0,0,0,0.1)", zIndex: 50 }}>
                  <div style={{ padding: "0.875rem 1rem", borderBottom: "1px solid #E3DDD4" }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1C1917" }}>Notifikasi</p>
                  </div>
                  {[
                    { t: "Generate berhasil", d: "Baru saja" },
                    { t: `${stats.totalTitles} judul telah dibuat bulan ini`, d: "Hari ini" },
                    { t: "Fitur baru tersedia", d: "2 hari lalu" },
                  ].map((n, i) => (
                    <div key={i} style={{ padding: "0.75rem 1rem", borderBottom: i < 2 ? "1px solid #F5F2EC" : "none", cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#F5F2EC")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <p style={{ fontSize: "0.78rem", color: "#1C1917", marginBottom: "0.125rem" }}>{n.t}</p>
                      <p style={{ fontSize: "0.7rem", color: "#A8A29E" }}>{n.d}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <button onClick={() => onNavigate("profile")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.25rem 0.5rem 0.25rem 0.25rem", borderRadius: 9, border: "1px solid #E3DDD4", background: "transparent", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F5F2EC")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {profile.photo
                ? <img src={profile.photo} alt="avatar" style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
                : <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#C4933F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff" }}>{initials}</div>
              }
              <p className="hidden sm:block" style={{ fontSize: "0.78rem", fontWeight: 500, color: "#1C1917", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.name.split(" ")[0]}
              </p>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-4 lg:px-8 lg:py-6" style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
