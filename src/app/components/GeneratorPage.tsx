import { useState } from "react";
import { Sparkles, Copy, BookmarkPlus, RefreshCw, ChevronDown, CheckCircle2, AlertCircle, BookmarkCheck, Download, FileText } from "lucide-react";
import { generateTitles } from "../services/gemini";
import { useUser } from "../UserContext";
import { toast } from "sonner";

const FIELDS = [
  "Teknik Informatika","Sistem Informasi","Pendidikan","Ekonomi & Bisnis",
  "Kesehatan & Kedokteran","Hukum","Psikologi","Komunikasi",
  "Teknik Sipil","Teknik Elektro","Manajemen","Akuntansi","Pertanian","Keguruan",
];

const JENIS_KARYA = ["Skripsi", "Tesis", "Disertasi", "Jurnal", "Makalah", "Proposal"];
const TINGKAT_PENDIDIKAN = ["S1", "S2", "S3"];

export function GeneratorPage() {
  const { addHistoryItem, toggleSave, history } = useUser();
  const [field, setField] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [jenisKarya, setJenisKarya] = useState("Skripsi");
  const [tingkatPendidikan, setTingkatPendidikan] = useState("S1");
  const [count, setCount] = useState("5");
  const [fieldOpen, setFieldOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const currentItem = historyId ? history.find(h => h.id === historyId) : null;
  const results = currentItem?.results ?? [];
  const generated = !!currentItem;

  const S = {
    border: "#E3DDD4", bg: "#F5F2EC", white: "#FFFFFF",
    dark: "#1C1917", muted: "#78716C", gold: "#C4933F",
  };

  const inputStyle = (focus: boolean) => ({
    width: "100%", padding: "0.65rem 0.875rem", borderRadius: 10,
    border: `1px solid ${focus ? S.gold : S.border}`,
    background: focus ? S.white : S.bg, fontSize: "0.875rem", color: S.dark,
    outline: "none", boxSizing: "border-box" as const,
    boxShadow: focus ? "0 0 0 3px rgba(196,147,63,0.12)" : "none", transition: "all 0.15s",
  });

  const handleGenerate = async () => {
    if (!field || !topic) return;
    setLoading(true);
    try {
      const requestedCount = parseInt(count);
      const titles = await generateTitles(field, topic, keywords, requestedCount, jenisKarya, tingkatPendidikan);
      
      // Validate the number of titles generated
      if (titles.length < requestedCount) {
        // Still less after retries - show warning
        console.warn(`[Generator] After all retries, AI generated ${titles.length} titles, but ${requestedCount} were requested`);
        
        toast.warning(
          `AI hanya menghasilkan ${titles.length} dari ${requestedCount} judul yang diminta. Silakan generate ulang jika tidak puas.`,
          { duration: 5000 }
        );
      } else if (titles.length === requestedCount) {
        // Perfect match
        toast.success(`${titles.length} judul berhasil dibuat!`);
      } else {
        // More than requested (shouldn't happen after validation in gemini.ts)
        toast.success(`${titles.length} judul berhasil dibuat (diminta ${requestedCount}).`);
      }
      
      const id = await addHistoryItem({
        field, topic, keywords, jenisKarya, tingkatPendidikan,
        results: titles.map(t => ({ text: t, saved: false })),
      });
      setHistoryId(id);
    } catch {
      toast.error("Gagal generate judul. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (idx: number) => {
    if (!historyId) return;
    navigator.clipboard.writeText(results[idx].text).catch(() => {});
    setCopied(idx);
    toast.success("Disalin ke clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSave = (idx: number) => {
    if (!historyId) return;
    toggleSave(historyId, idx);
    toast.success(results[idx].saved ? "Simpanan dihapus" : "Judul disimpan!");
  };

  const handleCopyAll = () => {
    const all = results.map((r, i) => `${i + 1}. ${r.text}`).join("\n");
    navigator.clipboard.writeText(all).catch(() => {});
    toast.success("Semua judul disalin!");
  };

  const buildContent = () => {
    const date = currentItem
      ? new Date(currentItem.createdAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })
      : new Date().toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" });
    return {
      header: "SmartTitle AI — Hasil Generate Judul",
      meta: [
        `Bidang: ${currentItem?.field || field}`,
        `Topik: ${currentItem?.topic || topic}`,
        `Jenis Karya: ${currentItem?.jenisKarya || jenisKarya}`,
        `Tanggal Generate: ${date}`,
      ],
      titles: results.map((r, i) => `${i + 1}. ${r.text}`),
    };
  };

  const handleExportTxt = () => {
    const c = buildContent();
    const lines = [
      c.header,
      "=".repeat(c.header.length),
      "",
      ...c.meta,
      "",
      "Judul yang Dihasilkan:",
      "-".repeat(22),
      ...c.titles,
      "",
      "Dibuat dengan SmartTitle AI",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smarttitle-${(currentItem?.topic || topic).toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File TXT berhasil diunduh!");
  };

  const handleExportPdf = () => {
    const c = buildContent();
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SmartTitle AI — Hasil Generate</title>
<style>
  body { font-family: 'Segoe UI', 'Inter', sans-serif; max-width: 700px; margin: 2rem auto; color: #1C1917; line-height: 1.7; }
  h1 { font-size: 1.3rem; margin-bottom: 0.25rem; }
  .divider { border-bottom: 2px solid #E3DDD4; margin: 0.75rem 0 1rem; }
  .meta { margin-bottom: 1rem; }
  .meta p { margin: 0.2rem 0; font-size: 0.9rem; color: #57534E; }
  .meta strong { color: #1C1917; }
  h2 { font-size: 1rem; margin: 1.25rem 0 0.5rem; color: #C4933F; }
  ol { padding-left: 1.25rem; }
  ol li { margin-bottom: 0.5rem; font-size: 0.9rem; }
  .footer { margin-top: 2rem; font-size: 0.75rem; color: #A8A29E; border-top: 1px solid #E3DDD4; padding-top: 0.75rem; }
  @media print { body { margin: 1.5rem; } }
</style></head><body>
  <h1>SmartTitle AI — Hasil Generate Judul</h1>
  <div class="divider"></div>
  <div class="meta">
    ${c.meta.map(m => `<p>${m.replace(": ", ": <strong>")}</strong></p>`).join("\n    ")}
  </div>
  <h2>Judul yang Dihasilkan</h2>
  <ol>${c.titles.map(t => `<li>${t.replace(/^\d+\.\s*/, "")}</li>`).join("")}</ol>
  <div class="footer">Dibuat dengan SmartTitle AI</div>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) { toast.error("Pop-up diblokir. Izinkan pop-up untuk mengunduh PDF."); return; }
    w.document.write(html);
    w.document.close();
    w.onload = () => { w.print(); };
    toast.success("Gunakan \"Save as PDF\" pada dialog cetak.");
  };

  const [focusField, setFocusField] = useState<string | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: S.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Generator</p>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: S.dark }}>Generator Judul Skripsi</h1>
        <p style={{ fontSize: "0.82rem", color: S.muted, marginTop: "0.25rem" }}>
          Isi form di bawah — AI akan menghasilkan rekomendasi judul terbaik untuk Anda.
        </p>
      </div>

      {/* Form */}
      <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${S.border}`, background: S.bg }}>
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: S.dark }}>Parameter Generate</p>
        </div>
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="sm:grid-cols-2 grid-cols-1">
            {/* Field dropdown */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>
                Bidang Penelitian <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <button onClick={() => setFieldOpen(!fieldOpen)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem 0.875rem", borderRadius: 10, border: `1px solid ${fieldOpen ? S.gold : S.border}`, background: field ? S.white : S.bg, fontSize: "0.875rem", color: field ? S.dark : "#A8A29E", cursor: "pointer", textAlign: "left", boxShadow: fieldOpen ? "0 0 0 3px rgba(196,147,63,0.12)" : "none", transition: "all 0.15s" }}>
                  {field || "Pilih bidang..."}
                  <ChevronDown style={{ width: 14, height: 14, color: "#A8A29E", transform: fieldOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {fieldOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: S.white, border: `1px solid ${S.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, maxHeight: 220, overflowY: "auto" }}>
                    {FIELDS.map(f => (
                      <button key={f} onClick={() => { setField(f); setFieldOpen(false); }}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0.875rem", border: "none", background: field === f ? "#FDF5E8" : "transparent", color: field === f ? S.gold : S.dark, fontSize: "0.85rem", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={e => { if (field !== f) e.currentTarget.style.background = S.bg; }}
                        onMouseLeave={e => { if (field !== f) e.currentTarget.style.background = "transparent"; }}>
                        {f}
                        {field === f && <CheckCircle2 style={{ width: 13, height: 13, color: S.gold }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Count */}
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>Jumlah Judul</label>
              <select value={count} onChange={e => setCount(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 10, border: `1px solid ${S.border}`, background: S.bg, fontSize: "0.875rem", color: S.dark, outline: "none", cursor: "pointer", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = S.gold; e.target.style.boxShadow = "0 0 0 3px rgba(196,147,63,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }}>
                {[3,5,8].map(n => <option key={n} value={n}>{n} judul</option>)}
              </select>
            </div>
          </div>

          {/* Jenis Karya & Tingkat Pendidikan */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>Jenis Karya</label>
              <select value={jenisKarya} onChange={e => setJenisKarya(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 10, border: `1px solid ${S.border}`, background: S.bg, fontSize: "0.875rem", color: S.dark, outline: "none", cursor: "pointer", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = S.gold; e.target.style.boxShadow = "0 0 0 3px rgba(196,147,63,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }}>
                {JENIS_KARYA.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>Tingkat Pendidikan</label>
              <select value={tingkatPendidikan} onChange={e => setTingkatPendidikan(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.875rem", borderRadius: 10, border: `1px solid ${S.border}`, background: S.bg, fontSize: "0.875rem", color: S.dark, outline: "none", cursor: "pointer", boxSizing: "border-box" }}
                onFocus={e => { e.target.style.borderColor = S.gold; e.target.style.boxShadow = "0 0 0 3px rgba(196,147,63,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = S.border; e.target.style.boxShadow = "none"; }}>
                {TINGKAT_PENDIDIKAN.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>
              Topik Penelitian <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder="Contoh: Machine Learning, Blockchain, E-Commerce..."
              onFocus={() => setFocusField("topic")} onBlur={() => setFocusField(null)}
              style={inputStyle(focusField === "topic")} />
          </div>

          {/* Keywords */}
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>
              Kata Kunci <span style={{ fontSize: "0.72rem", color: S.muted, fontWeight: 400 }}>(opsional, pisahkan dengan koma)</span>
            </label>
            <textarea value={keywords} onChange={e => setKeywords(e.target.value)} rows={2}
              placeholder="Contoh: klasifikasi, prediksi, analisis sentimen, optimasi..."
              onFocus={() => setFocusField("kw")} onBlur={() => setFocusField(null)}
              style={{ ...inputStyle(focusField === "kw"), resize: "vertical" as const, minHeight: 68 }} />
          </div>

          {!field && topic && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.875rem", borderRadius: 9, background: "#FEF9EC", border: "1px solid #FDE68A" }}>
              <AlertCircle style={{ width: 14, height: 14, color: "#D97706", flexShrink: 0 }} />
              <span style={{ fontSize: "0.78rem", color: "#92400E" }}>Pilih bidang penelitian terlebih dahulu</span>
            </div>
          )}

          <button onClick={handleGenerate} disabled={!field || !topic || loading}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 10, background: field && topic ? S.dark : "#C4B9AA", color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "none", cursor: field && topic && !loading ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "all 0.15s" }}
            onMouseEnter={e => { if (field && topic && !loading) { e.currentTarget.style.background = "#2C2927"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { e.currentTarget.style.background = field && topic ? S.dark : "#C4B9AA"; e.currentTarget.style.transform = "none"; }}>
            {loading
              ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} /> AI sedang membuat judul...</>
              : <><Sparkles style={{ width: 15, height: 15 }} /> Generate Judul Sekarang</>}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
          {Array.from({ length: parseInt(count) }).map((_, i) => (
            <div key={i} style={{ padding: "1rem 1.25rem", borderRadius: 14, background: S.white, border: `1px solid ${S.border}`, display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#EDE8DF", flexShrink: 0, animation: "pulse 1.5s ease-in-out infinite" }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, background: "#EDE8DF", borderRadius: 6, marginBottom: 8, width: "100%", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div style={{ height: 12, background: "#EDE8DF", borderRadius: 6, width: "75%", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {generated && !loading && results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckCircle2 style={{ width: 17, height: 17, color: "#16A34A" }} />
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: S.dark }}>{results.length} Judul Dihasilkan</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleCopyAll}
                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, color: S.muted, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}>
                <Copy style={{ width: 12, height: 12 }} /> Salin Semua
              </button>
              <button onClick={handleExportTxt}
                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, color: S.muted, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}>
                <FileText style={{ width: 12, height: 12 }} /> TXT
              </button>
              <button onClick={handleExportPdf}
                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, color: S.muted, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}>
                <Download style={{ width: 12, height: 12 }} /> PDF
              </button>
              <button onClick={handleGenerate}
                style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.45rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: S.white, color: S.muted, fontSize: "0.78rem", cursor: "pointer", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
                onMouseLeave={e => (e.currentTarget.style.color = S.muted)}>
                <RefreshCw style={{ width: 12, height: 12 }} /> Generate Ulang
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {results.map((r, i) => (
              <div key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "1rem 1.125rem", borderRadius: 14, background: r.saved ? "#FDFAF3" : S.white, border: `1px solid ${r.saved ? "#E8D5B0" : S.border}`, transition: "all 0.2s" }}
                onMouseEnter={e => { if (!r.saved) e.currentTarget.style.borderColor = "#D4C9BC"; }}
                onMouseLeave={e => { if (!r.saved) e.currentTarget.style.borderColor = S.border; }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: r.saved ? "#F5ECD9" : "#EDE8DF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, color: r.saved ? S.gold : "#78716C" }}>{i + 1}</span>
                </div>
                <p style={{ flex: 1, fontSize: "0.875rem", color: S.dark, lineHeight: 1.6, fontWeight: 500 }}>{r.text}</p>
                <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                  <button onClick={() => handleCopy(i)}
                    style={{ padding: "0.375rem", borderRadius: 7, border: `1px solid ${copied === i ? "#16A34A" : S.border}`, background: copied === i ? "#DCFCE7" : S.white, color: copied === i ? "#16A34A" : "#A8A29E", cursor: "pointer", display: "flex", transition: "all 0.15s" }}
                    title="Salin">
                    {copied === i ? <CheckCircle2 style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                  </button>
                  <button onClick={() => handleSave(i)}
                    style={{ padding: "0.375rem", borderRadius: 7, border: `1px solid ${r.saved ? "#E8D5B0" : S.border}`, background: r.saved ? "#FDF5E8" : S.white, color: r.saved ? S.gold : "#A8A29E", cursor: "pointer", display: "flex", transition: "all 0.15s" }}
                    title={r.saved ? "Hapus simpanan" : "Simpan"}>
                    {r.saved ? <BookmarkCheck style={{ width: 13, height: 13 }} /> : <BookmarkPlus style={{ width: 13, height: 13 }} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!generated && !loading && (
        <div style={{ textAlign: "center", padding: "3rem 1.5rem", background: S.white, borderRadius: 16, border: `1px dashed ${S.border}` }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "#F5ECD9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
            <Sparkles style={{ width: 22, height: 22, color: S.gold }} />
          </div>
          <p style={{ fontSize: "0.875rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>Siap Generate Judul?</p>
          <p style={{ fontSize: "0.8rem", color: "#A8A29E" }}>Isi form di atas dan klik Generate.</p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}
