import { useState } from "react";
import { Clock, Search, Copy, Trash2, BookmarkCheck, Eye, X, Filter, Star, Loader2 } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";

const S = { border: "#E3DDD4", bg: "#F5F2EC", white: "#FFFFFF", dark: "#1C1917", muted: "#78716C", gold: "#C4933F" };

function Modal({ item, onClose, onToggleSave }: {
  item: { id: string; field: string; topic: string; keywords: string; jenisKarya: string; createdAt: string; results: { text: string; saved: boolean }[] };
  onClose: () => void;
  onToggleSave: (idx: number) => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div style={{ background: S.white, borderRadius: 18, maxWidth: 560, width: "100%", maxHeight: "85vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: `1px solid ${S.border}` }}>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: S.dark }}>{item.field} · {item.topic} · {item.jenisKarya}</p>
            <p style={{ fontSize: "0.72rem", color: "#A8A29E" }}>{new Date(item.createdAt).toLocaleString("id-ID")}</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: 7, display: "flex" }}
            onMouseEnter={e => (e.currentTarget.style.background = S.bg)}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <X style={{ width: 16, height: 16, color: S.muted }} />
          </button>
        </div>
        <div style={{ overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {item.results.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.75rem", borderRadius: 10, background: r.saved ? "#FDFAF3" : S.bg, border: `1px solid ${r.saved ? "#E8D5B0" : S.border}` }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 800, color: r.saved ? S.gold : "#A8A29E", width: 20, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
              <p style={{ flex: 1, fontSize: "0.82rem", color: S.dark, lineHeight: 1.6 }}>{r.text}</p>
              <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                <button onClick={() => { navigator.clipboard.writeText(r.text).catch(() => {}); toast.success("Disalin!"); }}
                  style={{ padding: "0.3rem", borderRadius: 6, border: `1px solid ${S.border}`, background: S.white, cursor: "pointer", display: "flex" }}>
                  <Copy style={{ width: 12, height: 12, color: "#A8A29E" }} />
                </button>
                <button onClick={() => onToggleSave(i)}
                  style={{ padding: "0.3rem", borderRadius: 6, border: `1px solid ${r.saved ? "#E8D5B0" : S.border}`, background: r.saved ? "#FDF5E8" : S.white, cursor: "pointer", display: "flex" }}>
                  <BookmarkCheck style={{ width: 12, height: 12, color: r.saved ? S.gold : "#A8A29E" }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HistoryPage() {
  const { history, deleteHistoryItem, toggleSave, stats, favorites, historyLoading } = useUser();
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("Semua");
  const [filterSaved, setFilterSaved] = useState("Semua");
  const [preview, setPreview] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"history" | "favorites">("history");

  const fields = ["Semua", ...Array.from(new Set(history.map(h => h.field)))];

  const filtered = history.filter(item => {
    const q = search.toLowerCase();
    const matchQ = !q || item.field.toLowerCase().includes(q) || item.topic.toLowerCase().includes(q)
      || item.keywords.toLowerCase().includes(q)
      || item.results.some(r => r.text.toLowerCase().includes(q));
    const matchF = filterField === "Semua" || item.field === filterField;
    const matchS = filterSaved === "Semua"
      || (filterSaved === "Ada Simpanan" && item.results.some(r => r.saved))
      || (filterSaved === "Belum Disimpan" && !item.results.some(r => r.saved));
    return matchQ && matchF && matchS;
  });

  const filteredFavorites = favorites.filter(f => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.judul.toLowerCase().includes(q) || f.bidang.toLowerCase().includes(q) || f.topik.toLowerCase().includes(q);
  });

  const previewItem = preview ? history.find(h => h.id === preview) : null;

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    toast.success("Riwayat dihapus");
    if (preview === id) setPreview(null);
  };

  const tabBtn = (id: "history" | "favorites", label: string, count: number) => (
    <button key={id} onClick={() => setActiveTab(id)}
      style={{
        display: "flex", alignItems: "center", gap: "0.375rem",
        padding: "0.5rem 1rem", borderRadius: 8, border: "none", cursor: "pointer",
        background: activeTab === id ? S.white : "transparent",
        color: activeTab === id ? S.dark : S.muted,
        fontSize: "0.82rem", fontWeight: activeTab === id ? 600 : 400,
        boxShadow: activeTab === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        transition: "all 0.15s",
      }}>
      {label}
      <span style={{ padding: "0.05rem 0.4rem", borderRadius: 99, background: activeTab === id ? "#F5ECD9" : "#EDE8DF", color: activeTab === id ? S.gold : "#A8A29E", fontSize: "0.68rem", fontWeight: 700 }}>
        {count}
      </span>
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: S.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Riwayat</p>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: S.dark }}>Riwayat Generate</h1>
        <p style={{ fontSize: "0.82rem", color: S.muted, marginTop: "0.25rem" }}>Semua sesi generate tersimpan di sini.</p>
      </div>

      {/* Stats summary */}
      <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
        {[
          { label: "Total Sesi", val: stats.totalSessions },
          { label: "Total Judul", val: stats.totalTitles },
          { label: "Tersimpan", val: stats.totalSaved },
        ].map((s, i) => (
          <div key={i} style={{ flex: "1 1 120px", background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: "0.875rem 1.125rem" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 800, color: S.dark }}>{s.val}</p>
            <p style={{ fontSize: "0.72rem", color: S.muted }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", background: S.bg, borderRadius: 10, padding: "0.25rem", width: "fit-content" }}>
        {tabBtn("history", "Riwayat", history.length)}
        {tabBtn("favorites", "Favorit", favorites.length)}
      </div>

      {/* Search + Filter (history tab) */}
      {activeTab === "history" && (
        <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#A8A29E" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari judul, bidang, topik, kata kunci..."
              style={{ width: "100%", padding: "0.6rem 0.875rem 0.6rem 2.25rem", borderRadius: 10, border: `1px solid ${S.border}`, background: S.white, fontSize: "0.875rem", color: S.dark, outline: "none", boxSizing: "border-box" }}
              onFocus={e => { e.target.style.borderColor = S.gold; e.target.style.boxShadow = "0 0 0 3px rgba(196,147,63,0.1)"; }}
              onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }} />
          </div>
          <div style={{ position: "relative" }}>
            <button onClick={() => setFilterOpen(!filterOpen)}
              style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.6rem 0.875rem", borderRadius: 10, border: `1px solid ${filterOpen ? S.gold : S.border}`, background: S.white, color: S.muted, fontSize: "0.82rem", cursor: "pointer" }}>
              <Filter style={{ width: 13, height: 13 }} /> Filter
            </button>
            {filterOpen && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: S.white, border: `1px solid ${S.border}`, borderRadius: 12, padding: "1rem", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 40, minWidth: 240 }}>
                <div style={{ marginBottom: "0.875rem" }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>Bidang</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {fields.map(f => (
                      <button key={f} onClick={() => setFilterField(f)}
                        style={{ padding: "0.25rem 0.625rem", borderRadius: 99, border: `1px solid ${filterField === f ? S.gold : S.border}`, background: filterField === f ? "#FDF5E8" : "transparent", color: filterField === f ? S.gold : S.muted, fontSize: "0.72rem", fontWeight: filterField === f ? 600 : 400, cursor: "pointer" }}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "#A8A29E", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.5rem" }}>Status</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                    {["Semua","Ada Simpanan","Belum Disimpan"].map(s => (
                      <button key={s} onClick={() => setFilterSaved(s)}
                        style={{ padding: "0.25rem 0.625rem", borderRadius: 99, border: `1px solid ${filterSaved === s ? S.gold : S.border}`, background: filterSaved === s ? "#FDF5E8" : "transparent", color: filterSaved === s ? S.gold : S.muted, fontSize: "0.72rem", fontWeight: filterSaved === s ? 600 : 400, cursor: "pointer" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search (favorites tab) */}
      {activeTab === "favorites" && (
        <div style={{ position: "relative" }}>
          <Search style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: "#A8A29E" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari judul favorit, bidang, topik..."
            style={{ width: "100%", padding: "0.6rem 0.875rem 0.6rem 2.25rem", borderRadius: 10, border: `1px solid ${S.border}`, background: S.white, fontSize: "0.875rem", color: S.dark, outline: "none", boxSizing: "border-box" }}
            onFocus={e => { e.target.style.borderColor = S.gold; e.target.style.boxShadow = "0 0 0 3px rgba(196,147,63,0.1)"; }}
            onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }} />
        </div>
      )}

      {/* Loading */}
      {historyLoading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "2rem", color: S.muted }}>
          <Loader2 style={{ width: 18, height: 18, animation: "spin 0.8s linear infinite" }} />
          <span style={{ fontSize: "0.82rem" }}>Memuat data...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* History list */}
      {activeTab === "history" && !historyLoading && (
        filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", background: S.white, borderRadius: 16, border: `1px dashed ${S.border}` }}>
            <Clock style={{ width: 28, height: 28, color: "#C4B9AA", margin: "0 auto 0.875rem" }} />
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: S.dark, marginBottom: "0.25rem" }}>
              {search || filterField !== "Semua" ? "Tidak ada hasil" : "Belum ada riwayat"}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#A8A29E" }}>
              {search ? `Tidak ada yang cocok dengan "${search}"` : "Mulai generate judul untuk melihat riwayat."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {filtered.map(item => {
              const saved = item.results.filter(r => r.saved).length;
              const date = new Date(item.createdAt);
              return (
                <div key={item.id}
                  style={{ background: S.white, borderRadius: 14, border: `1px solid ${S.border}`, overflow: "hidden", transition: "all 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#D4C9BC")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = S.border)}>
                  <div style={{ padding: "0.875rem 1.125rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                          <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#F5ECD9", color: "#92672A", fontSize: "0.67rem", fontWeight: 700 }}>{item.field}</span>
                          <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: S.bg, color: S.muted, fontSize: "0.67rem", fontWeight: 600 }}>{item.topic}</span>
                          {item.jenisKarya && <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#EEF2FF", color: "#4338CA", fontSize: "0.67rem", fontWeight: 600 }}>{item.jenisKarya}</span>}
                          {saved > 0 && <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#DCFCE7", color: "#166534", fontSize: "0.67rem", fontWeight: 600 }}>{saved} disimpan</span>}
                          <span style={{ fontSize: "0.67rem", color: "#C4B9AA", marginLeft: "auto" }}>
                            {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} · {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                          {item.results.slice(0, 2).map((r, i) => (
                            <p key={i} style={{ fontSize: "0.8rem", color: S.dark, lineHeight: 1.55, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as any }}>
                              <span style={{ color: "#A8A29E", fontWeight: 600, marginRight: "0.375rem" }}>{i + 1}.</span>{r.text}
                            </p>
                          ))}
                          {item.results.length > 2 && (
                            <p style={{ fontSize: "0.72rem", color: "#A8A29E" }}>+{item.results.length - 2} judul lainnya</p>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                        <button onClick={() => setPreview(item.id)}
                          style={{ padding: "0.425rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, cursor: "pointer", display: "flex" }}
                          title="Lihat semua"
                          onMouseEnter={e => (e.currentTarget.style.background = S.bg)}
                          onMouseLeave={e => (e.currentTarget.style.background = S.white)}>
                          <Eye style={{ width: 13, height: 13, color: S.muted }} />
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          style={{ padding: "0.425rem", borderRadius: 8, border: "1px solid transparent", background: S.white, cursor: "pointer", display: "flex" }}
                          title="Hapus"
                          onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FECACA"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = S.white; e.currentTarget.style.borderColor = "transparent"; }}>
                          <Trash2 style={{ width: 13, height: 13, color: "#A8A29E" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Favorites list */}
      {activeTab === "favorites" && !historyLoading && (
        filteredFavorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3.5rem 1.5rem", background: S.white, borderRadius: 16, border: `1px dashed ${S.border}` }}>
            <Star style={{ width: 28, height: 28, color: "#C4B9AA", margin: "0 auto 0.875rem" }} />
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: S.dark, marginBottom: "0.25rem" }}>
              {search ? "Tidak ada favorit yang cocok" : "Belum ada judul favorit"}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#A8A29E" }}>
              Simpan judul dari Generator atau klik ikon bookmark di Riwayat.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {filteredFavorites.map((fav, i) => (
              <div key={fav.id}
                style={{ background: S.white, borderRadius: 14, border: "1px solid #E8D5B0", padding: "0.875rem 1.125rem", transition: "all 0.15s", background: "#FDFAF3" } as any}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#D4B896")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#E8D5B0")}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                      <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: "#F5ECD9", color: "#92672A", fontSize: "0.67rem", fontWeight: 700 }}>{fav.bidang}</span>
                      <span style={{ padding: "0.15rem 0.5rem", borderRadius: 99, background: S.bg, color: S.muted, fontSize: "0.67rem", fontWeight: 600 }}>{fav.topik}</span>
                      <span style={{ fontSize: "0.67rem", color: "#C4B9AA", marginLeft: "auto" }}>
                        {new Date(fav.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F5ECD9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: 800, color: S.gold }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: S.dark, lineHeight: 1.6, fontWeight: 500 }}>{fav.judul}</p>
                    </div>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(fav.judul).catch(() => {}); toast.success("Judul disalin!"); }}
                    style={{ padding: "0.425rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, cursor: "pointer", display: "flex", flexShrink: 0 }}
                    title="Salin judul"
                    onMouseEnter={e => (e.currentTarget.style.background = S.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = S.white)}>
                    <Copy style={{ width: 13, height: 13, color: S.muted }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {previewItem && (
        <Modal item={previewItem} onClose={() => setPreview(null)} onToggleSave={idx => { toggleSave(previewItem.id, idx); }} />
      )}
    </div>
  );
}
