import {
  createContext, useContext, useState, ReactNode,
  useCallback, useMemo, useEffect,
} from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured, getAuthParamsFromUrl, cleanAuthUrl } from "../lib/supabase";
import { AUTH_CALLBACK_URL, RESET_PASSWORD_URL } from "../lib/config";
import { toast } from "sonner";

export interface TitleResult {
  text: string;
  saved: boolean;
}

export interface HistoryItem {
  id: string;
  createdAt: string;
  field: string;
  topic: string;
  keywords: string;
  jenisKarya: string;
  tingkatPendidikan: string;
  results: TitleResult[];
}

export interface FavoriteItem {
  id: string;
  generationId: string;
  judul: string;
  bidang: string;
  topik: string;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  photo: string | null;
  prodi: string;
  universitas: string;
  angkatan: string;
  nim: string;
  bio: string;
}

interface UserContextType {
  user: User | null;
  authLoading: boolean;
  emailVerified: boolean;
  passwordRecovery: boolean;
  authError: { code: string; message: string } | null;
  clearPasswordRecovery: () => void;
  clearAuthError: () => void;
  resendVerification: () => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null; redirect?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  uploadAvatar: (dataUrl: string) => Promise<{ error: string | null }>;
  removeAvatar: () => Promise<{ error: string | null }>;
  history: HistoryItem[];
  historyLoading: boolean;
  addHistoryItem: (item: Omit<HistoryItem, "id" | "createdAt">) => Promise<string>;
  deleteHistoryItem: (id: string) => void;
  toggleSave: (historyId: string, resultIndex: number) => void;
  favorites: FavoriteItem[];
  clearAll: () => Promise<void>;
  stats: {
    totalSessions: number;
    totalTitles: number;
    totalSaved: number;
    totalFavorites: number;
    totalFields: number;
  };
}

const UserContext = createContext<UserContextType | null>(null);

const INITIAL_PROFILE: UserProfile = {
  name: "",
  email: "",
  photo: null,
  prodi: "",
  universitas: "",
  angkatan: "",
  nim: "",
  bio: "",
};

function mapDbToHistory(row: any): HistoryItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    field: row.bidang || "",
    topic: row.topik || "",
    keywords: row.kata_kunci || "",
    jenisKarya: row.jenis_karya || "Skripsi",
    tingkatPendidikan: row.tingkat_pendidikan || "S1",
    results: Array.isArray(row.hasil_judul) ? row.hasil_judul : [],
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState<{ code: string; message: string } | null>(null);

  const loadProfile = useCallback(async (userId: string, email: string) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile({
        name: data.nama || data.name || "",
        email: data.email || email,
        photo: data.avatar_url || null,
        prodi: data.prodi || "",
        universitas: data.universitas || "",
        angkatan: data.angkatan || "",
        nim: data.nim || "",
        bio: data.bio || "",
      });
    } else {
      setProfile(prev => ({ ...prev, email }));
    }
  }, []);

  const loadHistory = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    setHistoryLoading(true);
    try {
      const { data } = await supabase
        .from("title_generations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (data) setHistory(data.map(mapDbToHistory));
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data) {
      setFavorites(data.map(row => ({
        id: row.id,
        generationId: row.generation_id,
        judul: row.judul,
        bidang: row.bidang || "",
        topik: row.topik || "",
        createdAt: row.created_at,
      })));
    }
  }, []);

  // ── Detect auth errors from URL on initial load ────────────────
  useEffect(() => {
    const params = getAuthParamsFromUrl();

    if (params.error) {
      console.log("[Auth] URL contains auth error:", params.error, params.errorDescription, params.errorCode);
      setAuthError({
        code: params.errorCode || params.error || "unknown_error",
        message: params.errorDescription || "Terjadi kesalahan pada link autentikasi.",
      });
      cleanAuthUrl();
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }

    console.log("[Auth] Initializing auth listener...");
    console.log("[Auth] Current URL:", window.location.href);
    console.log("[Auth] URL hash:", window.location.hash);
    console.log("[Auth] URL search:", window.location.search);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        console.log("[Auth] onAuthStateChange:", event, "| user:", currentUser?.email ?? "null", "| email_confirmed:", currentUser?.email_confirmed_at ?? "null");

        // Detect session expiry / token refresh failure
        if (event === "TOKEN_REFRESHED" && !session) {
          console.log("[Auth] Token refresh failed — session expired");
          toast.error("Sesi telah berakhir. Silakan login kembali.");
        }

        // Detect password recovery from email link
        if (event === "PASSWORD_RECOVERY") {
          console.log("[Auth] PASSWORD_RECOVERY detected — recovery mode only");
          console.log("[Auth] NOT loading profile/history/favorites to prevent auth lock");

          setPasswordRecovery(true);
          setUser(currentUser);
          setAuthLoading(false);

          // CRITICAL: Stop here to prevent auth lock
          // DON'T cleanAuthUrl - token needed for updateUser()
          // DON'T loadProfile - causes database lock
          // DON'T loadHistory - causes database lock
          // DON'T loadFavorites - causes database lock
          // DON'T redirect to dashboard
          // Let ResetPasswordPage handle updateUser()
          return;
        }

        // Detect email verification callback - user clicks email link, Supabase creates session
        // When pathname is /auth-callback, just set user and stop. Don't load data, don't sign out.
        // AuthCallbackPage will handle the verification flow.
        if (event === "SIGNED_IN" && window.location.pathname === "/auth-callback") {
          console.log("[Auth] Email verification callback session detected");
          console.log("[Auth] User:", currentUser?.email, "| Email confirmed:", currentUser?.email_confirmed_at);
          console.log("[Auth] NOT loading profile/history/favorites - email verification flow only");
          
          setUser(currentUser);
          setAuthLoading(false);
          // DON'T loadProfile - prevents database lock during verification
          // DON'T loadHistory - prevents database lock during verification
          // DON'T loadFavorites - prevents database lock during verification
          // DON'T signOut - let AuthCallbackPage control when to sign out
          return;
        }

        // CRITICAL: Ignore email verification SIGNED_IN events on NON-callback tabs
        // When user clicks email link in Gmail, Supabase broadcasts SIGNED_IN to ALL tabs
        // Only the /auth-callback tab should process it. Other tabs must ignore it.
        if (event === "SIGNED_IN" && currentUser?.email_confirmed_at) {
          const isAuthCallbackTab = window.location.pathname === "/auth-callback";
          const isPasswordResetTab = window.location.pathname === "/reset-password";
          
          // If this tab is NOT the auth-callback tab, ignore the verification session
          if (!isAuthCallbackTab && !isPasswordResetTab) {
            console.log("[Auth] Ignoring verification session on non-callback tab:", window.location.pathname);
            console.log("[Auth] This tab should NOT process email verification");
            // DON'T set user - this is not this tab's verification
            // DON'T loadProfile - prevents loading wrong user data
            // DON'T loadHistory - prevents loading wrong user data
            // DON'T loadFavorites - prevents loading wrong user data
            // Keep this tab's current state unchanged
            return;
          }
        }

        // Email verification is handled by AuthCallbackPage
        // Don't sign out here - let AuthCallbackPage process the session first

        setUser(currentUser);
        setAuthLoading(false);

        if (currentUser) {
          await loadProfile(currentUser.id, currentUser.email ?? "");
          await loadHistory(currentUser.id);
          await loadFavorites(currentUser.id);
        } else {
          setProfile(INITIAL_PROFILE);
          setHistory([]);
          setFavorites([]);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadProfile, loadHistory, loadFavorites]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode
      setUser({ id: "demo", email } as User);
      setProfile(prev => ({ ...prev, email, name: email.split("@")[0] }));
      setAuthLoading(false);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode: don't set user — register should NOT equal login
      return { error: null };
    }
    console.log("[Auth] signUp called for:", email);

    setUser(null);
    setProfile(INITIAL_PROFILE);
    setHistory([]);
    setFavorites([]);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: AUTH_CALLBACK_URL,
      },
    });
    if (error) {
      console.log("[Auth] signUp error:", error.message);
      return { error: error.message };
    }
    // With email confirmation ON, signUp does NOT create a session.
    // The user must verify email first, then login manually.
    console.log("[Auth] signUp success — email verification required");
    return { error: null, redirect: "verify-email" };
  }, []);

  const signOut = useCallback(async () => {
    console.log("[Auth] signOut: Starting");
    if (isSupabaseConfigured) {
      console.log("[Auth] signOut: Calling supabase.auth.signOut");
      await supabase.auth.signOut();
      console.log("[Auth] signOut: Supabase signOut completed");
    }
    setUser(null);
    setProfile(INITIAL_PROFILE);
    setHistory([]);
    setFavorites([]);
    console.log("[Auth] signOut: State cleared");
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) return { error: null };
    console.log("[RESET EMAIL] Reset URL:", RESET_PASSWORD_URL);
    console.log("[Auth] resetPassword called for:", email, "| redirectTo:", RESET_PASSWORD_URL);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: RESET_PASSWORD_URL,
    });
    if (error) {
      console.log("[Auth] resetPassword error:", error.message);
    } else {
      console.log("[Auth] resetPassword success — recovery email sent");
      console.log("[Auth] Email link will redirect to:", RESET_PASSWORD_URL);
    }
    return { error: error?.message ?? null };
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    if (!isSupabaseConfigured) return { error: null };
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser?.email) return { error: "Sesi tidak valid, silakan login ulang." };

    // Verify current password by signing in again
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword,
    });
    if (verifyError) return { error: "Kata sandi saat ini salah." };

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message ?? null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));

    if (!isSupabaseConfigured) return;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!currentUser) return;
      const dbUpdates: Record<string, any> = {};
      if ("name" in updates) dbUpdates.nama = updates.name;
      if ("email" in updates) dbUpdates.email = updates.email;
      if ("prodi" in updates) dbUpdates.prodi = updates.prodi;
      if ("universitas" in updates) dbUpdates.universitas = updates.universitas;
      if ("angkatan" in updates) dbUpdates.angkatan = updates.angkatan;
      if ("nim" in updates) dbUpdates.nim = updates.nim;
      if ("bio" in updates) dbUpdates.bio = updates.bio;

      if (Object.keys(dbUpdates).length > 0) {
        supabase.from("profiles").update(dbUpdates).eq("id", currentUser.id)
          .then(({ error }) => { if (error) console.error("Gagal memperbarui profil:", error); });
      }
    });
  }, []);

  // ── Upload avatar to Supabase Storage ─────────────────────────────
  const uploadAvatar = useCallback(async (dataUrl: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      setProfile(prev => ({ ...prev, photo: dataUrl }));
      return { error: null };
    }

    // Validate MIME type from data URL
    const mimeMatch = dataUrl.match(/^data:(image\/[\w+]+);base64,/);
    if (!mimeMatch) return { error: "Format file tidak valid." };
    const mime = mimeMatch[1];
    const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_MIMES.includes(mime)) {
      return { error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." };
    }

    // Convert base64 data URL to Blob
    const base64 = dataUrl.split(",")[1];
    const byteStr = atob(base64);
    const ab = new ArrayBuffer(byteStr.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
    const blob = new Blob([ab], { type: mime });

    // Validate file size (50 MB)
    if (blob.size > 50 * 1024 * 1024) {
      return { error: "Ukuran file melebihi batas 50MB." };
    }

    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return { error: "Sesi tidak valid, silakan login ulang." };

    // Delete old avatar from storage if it's a Supabase Storage URL
    const currentPhoto = profile.photo;
    if (currentPhoto && currentPhoto.includes("/storage/v1/object/public/avatars/")) {
      const oldPath = currentPhoto.split("/storage/v1/object/public/avatars/")[1]?.split("?")[0];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }

    // Build file path: user_id/avatar-timestamp.extension
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    const filePath = `${currentUser.id}/avatar-${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, blob, { contentType: mime, upsert: false });
    if (uploadError) return { error: "Gagal mengunggah foto. Silakan coba lagi." };

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // Save public URL to profiles table
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", currentUser.id);
    if (dbError) {
      // Clean up uploaded file on DB failure
      await supabase.storage.from("avatars").remove([filePath]);
      return { error: "Gagal menyimpan foto ke profil." };
    }

    // Update local state
    setProfile(prev => ({ ...prev, photo: publicUrl }));
    return { error: null };
  }, [profile.photo]);

  // ── Remove avatar from Supabase Storage ───────────────────────────
  const removeAvatar = useCallback(async (): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      setProfile(prev => ({ ...prev, photo: null }));
      return { error: null };
    }

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return { error: "Sesi tidak valid, silakan login ulang." };

    // Delete from storage if it's a Supabase Storage URL
    const currentPhoto = profile.photo;
    if (currentPhoto && currentPhoto.includes("/storage/v1/object/public/avatars/")) {
      const oldPath = currentPhoto.split("/storage/v1/object/public/avatars/")[1]?.split("?")[0];
      if (oldPath) {
        await supabase.storage.from("avatars").remove([oldPath]);
      }
    }

    // Update profiles table
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", currentUser.id);
    if (error) return { error: "Gagal menghapus foto dari profil." };

    // Update local state
    setProfile(prev => ({ ...prev, photo: null }));
    return { error: null };
  }, [profile.photo]);

  const addHistoryItem = useCallback(async (
    item: Omit<HistoryItem, "id" | "createdAt">
  ): Promise<string> => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const newItem: HistoryItem = { ...item, id, createdAt };
    setHistory(prev => [newItem, ...prev]);

    if (!isSupabaseConfigured) return id;

    const { data: { user: currentUser } } = await supabase.auth.getUser();
    console.log("[addHistoryItem] user_id:", currentUser?.id);

    if (!currentUser) {
      console.error("[addHistoryItem] Tidak ada user, insert dibatalkan.");
      toast.error("Sesi tidak valid. Silakan login ulang.");
      setHistory(prev => prev.filter(h => h.id !== id));
      return id;
    }

    const insertData = {
      id,
      user_id: currentUser.id,
      bidang: item.field || null,
      topik: item.topic || null,
      kata_kunci: item.keywords || null,
      jenis_karya: item.jenisKarya.toLowerCase(),
      tingkat_pendidikan: item.tingkatPendidikan.toLowerCase(),
      jumlah_judul: item.results.length,
      hasil_judul: item.results,
      model_ai: "gemini-2.0-flash",
    };
    console.log("[addHistoryItem] data insert:", JSON.stringify(insertData, null, 2));

    const { error } = await supabase.from("title_generations").insert(insertData);

    if (error) {
      console.error("[addHistoryItem] Supabase error:", error);
      toast.error(`Gagal menyimpan ke database: ${error.message}`);
      // Rollback optimistic local state
      setHistory(prev => prev.filter(h => h.id !== id));
    } else {
      console.log("[addHistoryItem] Berhasil disimpan, id:", id);
    }

    return id;
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    setFavorites(prev => prev.filter(f => f.generationId !== id));

    if (!isSupabaseConfigured) return;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!currentUser) return;
      supabase.from("favorites").delete().eq("generation_id", id).then(() => {});
      supabase.from("title_generations").delete().eq("id", id).eq("user_id", currentUser.id).then(() => {});
    });
  }, []);

  const toggleSave = useCallback((historyId: string, resultIndex: number) => {
    let prevItem: HistoryItem | undefined;
    let newResults: TitleResult[] = [];

    setHistory(prev =>
      prev.map(item => {
        if (item.id !== historyId) return item;
        prevItem = item;
        const results = item.results.map((r, i) =>
          i === resultIndex ? { ...r, saved: !r.saved } : r
        );
        newResults = results;
        return { ...item, results };
      })
    );

    if (!isSupabaseConfigured || !prevItem) return;

    const wasSaved = prevItem.results[resultIndex].saved;
    const resultText = prevItem.results[resultIndex].text;
    const itemSnap = prevItem;

    console.log("[toggleSave] historyId:", historyId, "resultIndex:", resultIndex, "wasSaved:", wasSaved);
    console.log("[toggleSave] judul:", resultText);

    // Update hasil_judul in title_generations
    supabase.from("title_generations")
      .update({ hasil_judul: newResults })
      .eq("id", historyId)
      .then(({ error }) => {
        if (error) {
          console.error("[toggleSave] Gagal update hasil_judul:", error);
          toast.error("Gagal memperbarui data judul.");
        }
      });

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!currentUser) {
        console.error("[toggleSave] Tidak ada user.");
        return;
      }
      console.log("[toggleSave] user_id:", currentUser.id);

      if (wasSaved) {
        // Delete from favorites
        const deleteData = { user_id: currentUser.id, generation_id: historyId, judul: resultText };
        console.log("[toggleSave] deleting favorite:", JSON.stringify(deleteData));

        supabase.from("favorites")
          .delete()
          .eq("user_id", currentUser.id)
          .eq("generation_id", historyId)
          .eq("judul", resultText)
          .then(({ error }) => {
            if (error) {
              console.error("[toggleSave] Supabase error (delete favorite):", error);
              toast.error("Gagal menghapus favorit.");
            } else {
              console.log("[toggleSave] Favorit berhasil dihapus.");
              setFavorites(prev =>
                prev.filter(f => !(f.generationId === historyId && f.judul === resultText))
              );
            }
          });
      } else {
        // Check for duplicate before inserting
        const isDuplicate = favorites.some(
          f => f.generationId === historyId && f.judul === resultText
        );
        if (isDuplicate) {
          console.log("[toggleSave] Favorit sudah ada, skip insert.");
          return;
        }

        // Use generation_id if available, otherwise null
        const generationId = historyId || null;
        const insertData = {
          user_id: currentUser.id,
          generation_id: generationId,
          judul: resultText,
          bidang: itemSnap.field,
          topik: itemSnap.topic,
        };
        console.log("[toggleSave] inserting favorite:", JSON.stringify(insertData));

        supabase.from("favorites")
          .insert(insertData)
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error("[toggleSave] Supabase error (insert favorite):", error);
              toast.error(`Gagal menyimpan favorit: ${error.message}`);
              // Rollback local state
              setHistory(prev =>
                prev.map(item => {
                  if (item.id !== historyId) return item;
                  const results = item.results.map((r, i) =>
                    i === resultIndex ? { ...r, saved: false } : r
                  );
                  return { ...item, results };
                })
              );
            } else {
              console.log("[toggleSave] Favorit berhasil disimpan.", data);
              if (data) {
                setFavorites(prev => [{
                  id: data.id,
                  generationId: data.generation_id ?? "",
                  judul: data.judul,
                  bidang: data.bidang || "",
                  topik: data.topik || "",
                  createdAt: data.created_at,
                }, ...prev]);
              }
            }
          });
      }
    });
  }, [favorites]);

  const clearAll = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase.from("favorites").delete().eq("user_id", currentUser.id);
        await supabase.from("title_generations").delete().eq("user_id", currentUser.id);
        await supabase.from("profiles").delete().eq("id", currentUser.id);
      }
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(INITIAL_PROFILE);
    setHistory([]);
    setFavorites([]);
  }, []);

  const clearPasswordRecovery = useCallback(() => {
    setPasswordRecovery(false);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const emailVerified = !!user?.email_confirmed_at;

  const resendVerification = useCallback(async () => {
    if (!isSupabaseConfigured) return { error: null };
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user?.email ?? "",
    });
    return { error: error?.message ?? null };
  }, [user?.email]);

  const stats = useMemo(() => {
    const totalSessions = history.length;
    const totalTitles = history.reduce((acc, h) => acc + h.results.length, 0);
    const totalSaved = favorites.length;
    const totalFavorites = favorites.length;
    const totalFields = new Set(history.map(h => h.field).filter(Boolean)).size;
    return { totalSessions, totalTitles, totalSaved, totalFavorites, totalFields };
  }, [history, favorites]);

  return (
    <UserContext.Provider value={{
      user, authLoading, emailVerified, passwordRecovery, clearPasswordRecovery,
      authError, clearAuthError,
      resendVerification,
      signIn, signUp, signOut, resetPassword, changePassword, updatePassword,
      profile, updateProfile, uploadAvatar, removeAvatar,
      history, historyLoading, addHistoryItem, deleteHistoryItem, toggleSave,
      favorites,
      clearAll,
      stats,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
