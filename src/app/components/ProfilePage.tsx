import { useState, useRef, useEffect, useCallback } from "react";
import { User, Mail, BookOpen, GraduationCap, Edit3, Save, X, Camera, Shield, Bell, Trash2, Eye, EyeOff, CheckCircle2, ChevronRight } from "lucide-react";
import { useUser } from "../UserContext";
import { toast } from "sonner";

interface Props { onNavigate: (p: string) => void }

const S = { border: "#E3DDD4", bg: "#F5F2EC", white: "#FFFFFF", dark: "#1C1917", muted: "#78716C", gold: "#C4933F", inputBg: "#F5F2EC" };

// ── Photo Crop Modal ──────────────────────────────────────────────
function CropModal({ src, onSave, onClose }: { src: string; onSave: (url: string) => void; onClose: () => void }) {
  const SIZE = 220;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef(new window.Image());
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [last, setLast] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    img.onload = () => {
      const z = SIZE / Math.min(img.naturalWidth, img.naturalHeight);
      setZoom(z);
      setPos({ x: (SIZE - img.naturalWidth * z) / 2, y: (SIZE - img.naturalHeight * z) / 2 });
      setReady(true);
    };
    img.src = src;
  }, [src]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(imgRef.current, pos.x, pos.y, imgRef.current.naturalWidth * zoom, imgRef.current.naturalHeight * zoom);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2 - 1.5, 0, Math.PI * 2);
    ctx.strokeStyle = S.gold;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }, [pos, zoom, ready]);

  useEffect(() => { draw(); }, [draw]);

  const getXY = (e: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in e) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
    setLast(getXY(e));
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const cur = getXY(e);
    setPos(p => ({ x: p.x + cur.x - last.x, y: p.y + cur.y - last.y }));
    setLast(cur);
  };
  const onUp = () => setDragging(false);

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div style={{ background: S.white, borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 340, display: "flex", flexDirection: "column", gap: "1.125rem" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: S.dark }}>Sesuaikan Foto</p>
          <button onClick={onClose} style={{ padding: "0.25rem", borderRadius: 7, border: "none", background: "none", cursor: "pointer", display: "flex" }}>
            <X style={{ width: 15, height: 15, color: S.muted }} />
          </button>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#A8A29E" }}>Drag untuk menggeser · Slider untuk zoom</p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <canvas ref={canvasRef} width={SIZE} height={SIZE}
            style={{ cursor: dragging ? "grabbing" : "grab", borderRadius: "50%", touchAction: "none" }}
            onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} />
        </div>
        <div>
          <label style={{ fontSize: "0.75rem", fontWeight: 600, color: S.muted, display: "block", marginBottom: "0.375rem" }}>Zoom</label>
          <input type="range" min="0.2" max="5" step="0.01" value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            style={{ width: "100%", accentColor: S.gold }} />
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.875rem", cursor: "pointer" }}>Batal</button>
          <button onClick={save} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: "none", background: S.dark, color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>Simpan Foto</button>
        </div>
      </div>
    </div>
  );
}

// ── Password Input (extracted to avoid re-render focus loss) ─────
function PasswordInput({ label, value, onChange, show, setShow }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show?: boolean;
  setShow?: (v: boolean) => void;
}) {
  const [f, setF] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: S.dark, marginBottom: "0.3rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          style={{ width: "100%", padding: "0.6rem 2.375rem 0.6rem 0.875rem", borderRadius: 9, border: `1px solid ${f ? S.gold : S.border}`, background: f ? S.white : S.inputBg, fontSize: "0.875rem", color: S.dark, outline: "none", boxSizing: "border-box", boxShadow: f ? "0 0 0 3px rgba(196,147,63,0.1)" : "none" }} />
        {setShow !== undefined && (
          <button onClick={() => setShow(!show)} type="button"
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", color: "#A8A29E" }}>
            {show ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Change Password Modal ────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { changePassword } = useUser();
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = cur.length >= 1 && next.length >= 8 && next === conf;

  const submit = async () => {
    if (!valid) return;
    setLoading(true);
    const { error } = await changePassword(cur, next);
    setLoading(false);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Kata sandi berhasil diubah!");
      onClose();
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div style={{ background: S.white, borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: "1rem" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: S.dark }}>Ubah Kata Sandi</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "0.25rem" }}>
            <X style={{ width: 15, height: 15, color: S.muted }} />
          </button>
        </div>
        <PasswordInput label="Kata Sandi Saat Ini" value={cur} onChange={setCur} show={showCur} setShow={setShowCur} />
        <PasswordInput label="Kata Sandi Baru (min. 8 karakter)" value={next} onChange={setNext} show={showNext} setShow={setShowNext} />
        <PasswordInput label="Konfirmasi Kata Sandi Baru" value={conf} onChange={setConf} />
        {conf.length > 0 && next !== conf && (
          <p style={{ fontSize: "0.72rem", color: "#DC2626" }}>Kata sandi tidak cocok</p>
        )}
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.875rem", cursor: "pointer" }}>Batal</button>
          <button onClick={submit} disabled={!valid || loading}
            style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: "none", background: valid ? S.dark : "#C4B9AA", color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: valid && !loading ? "pointer" : "not-allowed" }}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Notifications Modal ──────────────────────────────────────────
function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState({ generate: true, save: true, tips: false, update: true });

  const save = () => { toast.success("Pengaturan notifikasi disimpan!"); onClose(); };

  const labels: Record<keyof typeof settings, string> = {
    generate: "Notifikasi saat generate selesai",
    save: "Notifikasi saat judul disimpan",
    tips: "Tips dan rekomendasi penelitian",
    update: "Pembaruan fitur terbaru",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div style={{ background: S.white, borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: "1.125rem" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: S.dark }}>Pengaturan Notifikasi</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "0.25rem" }}>
            <X style={{ width: 15, height: 15, color: S.muted }} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {(Object.keys(settings) as (keyof typeof settings)[]).map(key => (
            <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: 10, border: `1px solid ${S.border}` }}>
              <span style={{ fontSize: "0.82rem", color: S.dark }}>{labels[key]}</span>
              <button onClick={() => setSettings(p => ({ ...p, [key]: !p[key] }))}
                style={{ width: 40, height: 22, borderRadius: 99, border: "none", background: settings[key] ? S.gold : "#D4C9BC", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: settings[key] ? 21 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.875rem", cursor: "pointer" }}>Batal</button>
          <button onClick={save} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: "none", background: S.dark, color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Account Modal ─────────────────────────────────────────
function DeleteAccountModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => Promise<void> }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const valid = input === "HAPUS";

  const confirm = async () => {
    if (!valid) return;
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 55, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div style={{ background: S.white, borderRadius: 20, padding: "1.5rem", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: "1.125rem" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#DC2626" }}>Hapus Akun</p>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: "0.25rem" }}>
            <X style={{ width: 15, height: 15, color: S.muted }} />
          </button>
        </div>
        <div style={{ padding: "0.875rem 1rem", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <p style={{ fontSize: "0.82rem", color: "#991B1B", lineHeight: 1.65 }}>
            Tindakan ini <strong>tidak bisa dibatalkan</strong>. Semua data termasuk riwayat generate dan profil akan terhapus permanen.
          </p>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: S.dark, marginBottom: "0.375rem" }}>
            Ketik <strong>HAPUS</strong> untuk mengkonfirmasi
          </label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="HAPUS"
            style={{ width: "100%", padding: "0.6rem 0.875rem", borderRadius: 9, border: `1px solid ${valid ? "#DC2626" : S.border}`, background: S.inputBg, fontSize: "0.875rem", color: "#DC2626", outline: "none", boxSizing: "border-box", fontWeight: 600 }} />
        </div>
        <div style={{ display: "flex", gap: "0.625rem" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.875rem", cursor: "pointer" }}>Batal</button>
          <button onClick={confirm} disabled={!valid || loading}
            style={{ flex: 1, padding: "0.625rem", borderRadius: 10, border: "none", background: valid ? "#DC2626" : "#C4B9AA", color: "#fff", fontSize: "0.875rem", fontWeight: 600, cursor: valid && !loading ? "pointer" : "not-allowed" }}>
            {loading ? "Menghapus..." : "Hapus Akun"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Profile Page ────────────────────────────────────────────
export function ProfilePage({ onNavigate }: Props) {
  const { profile, updateProfile, uploadAvatar, removeAvatar, clearAll, stats, emailVerified, resendVerification } = useUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState<"password" | "notif" | "delete" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      e.target.value = "";
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      toast.error("Ukuran file melebihi batas 50MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => setCropSrc(ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSaveCrop = async (url: string) => {
    setUploading(true);
    const { error } = await uploadAvatar(url);
    setUploading(false);
    setCropSrc(null);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Foto profil diperbarui!");
    }
  };

  const handleRemovePhoto = async () => {
    const { error } = await removeAvatar();
    if (error) {
      toast.error(error);
    } else {
      toast.success("Foto dihapus");
    }
  };

  const handleSaveProfile = () => {
    updateProfile({ ...draft });
    setEditing(false);
    toast.success("Profil berhasil diperbarui!");
  };

  const handleDeleteAccount = async () => {
    await clearAll();
    toast.success("Akun berhasil dihapus");
    onNavigate("landing");
  };

  const field = (label: string, key: keyof typeof draft, icon: any, type = "text") => {
    const Icon = icon;
    const [f, setF] = useState(false);
    return (
      <div>
        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: S.dark, marginBottom: "0.3rem" }}>{label}</label>
        <div style={{ position: "relative" }}>
          <Icon style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: f ? S.gold : "#C4B9AA" }} />
          <input type={type} value={editing ? draft[key] ?? "" : profile[key] ?? ""}
            onChange={e => setDraft(p => ({ ...p, [key]: e.target.value }))}
            readOnly={!editing} onFocus={() => setF(true)} onBlur={() => setF(false)}
            style={{ width: "100%", padding: "0.6rem 0.875rem 0.6rem 2.25rem", borderRadius: 9, border: `1px solid ${editing && f ? S.gold : editing ? S.border : "#F0EBE4"}`, background: editing ? (f ? S.white : S.inputBg) : "#FAFAF7", fontSize: "0.875rem", color: S.dark, outline: "none", boxSizing: "border-box", boxShadow: editing && f ? "0 0 0 3px rgba(196,147,63,0.1)" : "none", cursor: editing ? "text" : "default", transition: "all 0.15s" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, color: S.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Akun</p>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: S.dark }}>Profil Saya</h1>
      </div>

      <div style={{ display: "grid", gap: "1rem" }} className="lg:grid-cols-3">
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Avatar card */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
            <div style={{ height: 72, background: S.dark }} />
            <div style={{ padding: "0 1.25rem 1.25rem", marginTop: -36 }}>
              <div style={{ position: "relative", display: "inline-block", marginBottom: "0.875rem" }}>
                {profile.photo
                  ? <img src={profile.photo} alt="avatar" style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
                  : <div style={{ width: 72, height: 72, borderRadius: "50%", background: S.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.375rem", fontWeight: 700, color: "#fff", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>{initials}</div>
                }
                {uploading && (
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 22, height: 22, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  </div>
                )}
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: S.white, border: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: uploading ? "not-allowed" : "pointer", opacity: uploading ? 0.5 : 1, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                  title="Ganti foto">
                  <Camera style={{ width: 11, height: 11, color: S.muted }} />
                </button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: S.dark }}>{profile.name}</h2>
              <p style={{ fontSize: "0.78rem", color: S.muted, marginTop: "0.125rem" }}>{profile.prodi}</p>

              {/* Email verification status */}
              <div style={{ marginTop: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: 9, border: `1px solid ${emailVerified ? "#BBF7D0" : "#FECACA"}`, background: emailVerified ? "#F0FDF4" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: emailVerified ? "#166534" : "#991B1B" }}>
                    {emailVerified ? "Terverifikasi ✅" : "Belum Terverifikasi ❌"}
                  </span>
                </div>
                {!emailVerified && (
                  <button onClick={async () => {
                    const { error } = await resendVerification();
                    if (error) toast.error(error);
                    else toast.success("Email verifikasi telah dikirim ulang!");
                  }}
                    style={{ fontSize: "0.68rem", fontWeight: 600, color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: 0, whiteSpace: "nowrap" }}>
                    Kirim Ulang
                  </button>
                )}
              </div>
              {profile.photo && (
                <button onClick={handleRemovePhoto} disabled={uploading}
                  style={{ marginTop: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: uploading ? "not-allowed" : "pointer", color: "#A8A29E", fontSize: "0.72rem", padding: 0, opacity: uploading ? 0.5 : 1 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#DC2626")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#A8A29E")}>
                  <Trash2 style={{ width: 11, height: 11 }} /> Hapus Foto
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, padding: "1.125rem 1.25rem" }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: S.dark, marginBottom: "0.875rem" }}>Statistik</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
              {[
                { v: stats.totalSessions, l: "Sesi Generate" },
                { v: stats.totalTitles, l: "Total Judul" },
                { v: stats.totalFavorites, l: "Favorit" },
                { v: stats.totalFields, l: "Bidang" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "0.625rem", borderRadius: 10, background: S.bg }}>
                  <p style={{ fontSize: "1.375rem", fontWeight: 800, color: S.dark }}>{s.v}</p>
                  <p style={{ fontSize: "0.68rem", color: S.muted }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }} className="lg:col-span-2">
          {/* Personal Info */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: `1px solid ${S.border}` }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: S.dark }}>Informasi Pribadi</p>
              {!editing
                ? <button onClick={() => { setDraft({ ...profile }); setEditing(true); }}
                    style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.78rem", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.color = S.dark)}
                    onMouseLeave={e => (e.currentTarget.style.color = S.muted)}>
                    <Edit3 style={{ width: 12, height: 12 }} /> Edit
                  </button>
                : <div style={{ display: "flex", gap: "0.375rem" }}>
                    <button onClick={() => setEditing(false)} style={{ padding: "0.4rem 0.875rem", borderRadius: 8, border: `1px solid ${S.border}`, background: "transparent", color: S.muted, fontSize: "0.78rem", cursor: "pointer" }}>Batal</button>
                    <button onClick={handleSaveProfile}
                      style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.4rem 0.875rem", borderRadius: 8, border: "none", background: S.dark, color: "#fff", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                      <Save style={{ width: 12, height: 12 }} /> Simpan
                    </button>
                  </div>}
            </div>
            <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {field("Nama Lengkap", "name", User)}
              {field("Email", "email", Mail, "email")}
              {field("Program Studi", "prodi", BookOpen)}
              {field("Universitas / Institusi", "universitas", GraduationCap)}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                {field("Angkatan", "angkatan", GraduationCap)}
                {field("NIM / NIP", "nim", User)}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: S.dark, marginBottom: "0.3rem" }}>Bio</label>
                <textarea value={editing ? draft.bio : profile.bio}
                  onChange={e => setDraft(p => ({ ...p, bio: e.target.value }))}
                  readOnly={!editing} rows={3}
                  style={{ width: "100%", padding: "0.6rem 0.875rem", borderRadius: 9, border: `1px solid ${editing ? S.border : "#F0EBE4"}`, background: editing ? S.inputBg : "#FAFAF7", fontSize: "0.875rem", color: S.dark, outline: "none", resize: "vertical", minHeight: 72, boxSizing: "border-box", cursor: editing ? "text" : "default" }} />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div style={{ background: S.white, borderRadius: 16, border: `1px solid ${S.border}`, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: `1px solid ${S.border}` }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 700, color: S.dark }}>Pengaturan Akun</p>
            </div>
            <div style={{ padding: "0.75rem" }}>
              {[
                { icon: Shield, label: "Ubah Kata Sandi", desc: "Ganti password akun Anda", action: () => setModal("password"), color: "#3D6B5A" },
                { icon: Bell, label: "Notifikasi", desc: "Atur preferensi notifikasi", action: () => setModal("notif"), color: "#5A4B8A" },
              ].map((item, i) => (
                <button key={i} onClick={item.action}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", borderRadius: 10, border: "1px solid transparent", background: "transparent", cursor: "pointer", textAlign: "left", marginBottom: "0.25rem", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = S.bg; e.currentTarget.style.borderColor = S.border; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <item.icon style={{ width: 15, height: 15, color: item.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.82rem", fontWeight: 600, color: S.dark }}>{item.label}</p>
                    <p style={{ fontSize: "0.72rem", color: S.muted }}>{item.desc}</p>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: "#C4B9AA", flexShrink: 0 }} />
                </button>
              ))}

              <button onClick={() => setModal("delete")}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem", borderRadius: 10, border: "1px solid transparent", background: "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#FECACA"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Trash2 style={{ width: 15, height: 15, color: "#DC2626" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#DC2626" }}>Hapus Akun</p>
                  <p style={{ fontSize: "0.72rem", color: "#A8A29E" }}>Tindakan ini tidak bisa dibatalkan</p>
                </div>
                <ChevronRight style={{ width: 14, height: 14, color: "#FCA5A5", flexShrink: 0 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {cropSrc && <CropModal src={cropSrc} onSave={handleSaveCrop} onClose={() => setCropSrc(null)} />}
      {modal === "password" && <ChangePasswordModal onClose={() => setModal(null)} />}
      {modal === "notif" && <NotificationsModal onClose={() => setModal(null)} />}
      {modal === "delete" && <DeleteAccountModal onClose={() => setModal(null)} onConfirm={handleDeleteAccount} />}
    </div>
  );
}
