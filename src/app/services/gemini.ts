const MOCK: Record<string, string[]> = {
  "Teknik Informatika": [
    "Implementasi Algoritma Random Forest untuk Klasifikasi Sentimen Ulasan Produk E-Commerce Berbasis Twitter",
    "Pengembangan Sistem Deteksi Dini Penyakit Tanaman Menggunakan Deep Learning dengan Transfer Learning MobileNetV3",
    "Analisis Perbandingan LSTM dan GRU dalam Prediksi Harga Saham Perusahaan Teknologi di Bursa Efek Indonesia",
    "Rancang Bangun Sistem Rekomendasi Wisata Berbasis Collaborative Filtering dengan Integrasi Data Geolokasi",
    "Optimasi Deteksi Kerusakan Jalan Berbasis Computer Vision menggunakan YOLOv8 pada Citra UAV",
    "Pengembangan Chatbot Layanan Akademik Berbasis Large Language Model untuk Perguruan Tinggi Indonesia",
    "Implementasi Federated Learning untuk Klasifikasi Penyakit Kulit dengan Menjaga Privasi Data Pasien",
    "Analisis Efektivitas Metode Attention Mechanism pada Penerjemahan Bahasa Daerah ke Bahasa Indonesia",
  ],
  "Sistem Informasi": [
    "Perancangan Sistem Manajemen Inventori Berbasis Web dengan Metode Economic Order Quantity pada UMKM",
    "Analisis Pengaruh Kualitas Layanan E-Government terhadap Kepuasan Masyarakat Menggunakan Model TAM",
    "Pengembangan Dashboard Business Intelligence untuk Monitoring Kinerja UMKM Menggunakan Pendekatan Agile",
    "Implementasi Sistem ERP berbasis Cloud untuk Optimasi Proses Bisnis Perusahaan Manufaktur Skala Menengah",
    "Evaluasi Kematangan Tata Kelola TI Berdasarkan COBIT 2019 pada Lembaga Keuangan Mikro di Indonesia",
    "Perancangan Arsitektur Microservices untuk Sistem Informasi Akademik Universitas Berbasis Domain-Driven Design",
    "Analisis Risiko Keamanan Informasi Menggunakan Metode OCTAVE Allegro pada Perusahaan Fintech",
    "Pengembangan Platform Digital untuk Pemberdayaan Petani Lokal melalui Integrasi IoT dan Sistem Informasi",
  ],
  "Pendidikan": [
    "Pengaruh Pembelajaran Problem-Based Learning terhadap Kemampuan Berpikir Kritis Siswa SMA di Era Digital",
    "Pengembangan Media Pembelajaran Interaktif Berbasis Augmented Reality untuk Materi Sistem Tata Surya SMP",
    "Analisis Efektivitas Metode Flipped Classroom dalam Meningkatkan Hasil Belajar Matematika Siswa Kelas X",
    "Implementasi Gamifikasi dalam Pembelajaran Bahasa Inggris untuk Meningkatkan Motivasi Siswa Sekolah Dasar",
    "Hubungan Gaya Belajar dan Kecerdasan Emosional terhadap Prestasi Akademik Mahasiswa Pendidikan Vokasi",
    "Pengembangan Model Asesmen Autentik Berbasis Portofolio Digital untuk Kurikulum Merdeka Belajar",
    "Analisis Kesenjangan Digital dalam Implementasi Pembelajaran Jarak Jauh di Daerah 3T Indonesia",
    "Efektivitas Program Mentoring Sebaya dalam Meningkatkan Keterampilan Literasi Sains Siswa SMA",
  ],
  "Ekonomi & Bisnis": [
    "Analisis Dampak Adopsi Fintech terhadap Inklusi Keuangan UMKM di Wilayah Perkotaan Indonesia",
    "Pengaruh Transformasi Digital terhadap Kinerja Keuangan Perusahaan Perbankan yang Terdaftar di BEI",
    "Strategi Pengembangan Ekosistem Startup Berbasis Ekonomi Kreatif di Kota-Kota Tier Dua Indonesia",
    "Analisis Faktor-Faktor yang Mempengaruhi Adopsi QRIS oleh Pedagang Pasar Tradisional",
    "Pengaruh Green Marketing dan Corporate Social Responsibility terhadap Loyalitas Konsumen Generasi Z",
    "Model Prediksi Kebangkrutan Perusahaan Manufaktur Indonesia Menggunakan Metode Machine Learning",
    "Analisis Efisiensi Perbankan Syariah di Indonesia dengan Pendekatan Data Envelopment Analysis",
    "Pengaruh Kualitas Produk dan Harga terhadap Keputusan Pembelian pada Platform E-Commerce Lokal",
  ],
  "Kesehatan & Kedokteran": [
    "Analisis Adopsi Teknologi Telemedicine pada Pasien Lansia Menggunakan Technology Acceptance Model",
    "Efektivitas Program Intervensi Gizi Berbasis Komunitas dalam Menurunkan Prevalensi Stunting di Pedesaan",
    "Pengembangan Sistem Deteksi Dini Diabetes Mellitus Tipe 2 Berbasis Machine Learning dari Data Rekam Medis",
    "Analisis Faktor Determinan Kepatuhan Minum Obat pada Pasien Tuberkulosis di Puskesmas Perkotaan",
    "Pengaruh Paparan Media Sosial terhadap Perilaku Mencari Informasi Kesehatan pada Remaja Indonesia",
    "Implementasi Sistem Skoring Risiko Kardiovaskular Berbasis AI untuk Deteksi Dini di Fasilitas Primer",
    "Analisis Perbandingan Teknik Deep Learning untuk Segmentasi Citra Radiologi Thorax pada Dataset Lokal",
    "Hubungan Kualitas Tidur dan Produktivitas Kerja pada Tenaga Kesehatan di Rumah Sakit Umum Daerah",
  ],
  default: [
    "Analisis dan Implementasi Teknologi Modern dalam Peningkatan Efisiensi Sistem Berbasis Kecerdasan Buatan",
    "Pengembangan Model Prediktif Menggunakan Machine Learning untuk Optimasi Proses Pengambilan Keputusan",
    "Evaluasi Pengaruh Penerapan Inovasi Digital terhadap Kinerja Organisasi di Era Transformasi Digital",
    "Rancang Bangun Sistem Cerdas Berbasis Data untuk Mendukung Pengambilan Keputusan Strategis",
    "Perbandingan Efektivitas Metode Konvensional dan Digital dalam Konteks Penelitian Multidisiplin",
    "Analisis Faktor-Faktor Kritis dalam Implementasi Inovasi Berbasis Teknologi pada Sektor Publik",
    "Pengembangan Framework Evaluasi Berbasis Data untuk Pengukuran Dampak Program Pemberdayaan Masyarakat",
    "Studi Komparatif Pendekatan Kuantitatif dan Kualitatif dalam Riset Kebijakan Pembangunan Berkelanjutan",
  ],
};

function getMockTitles(field: string, count: number): string[] {
  const pool = MOCK[field] ?? MOCK["default"];
  return pool.slice(0, count);
}

export async function generateTitles(
  field: string,
  topic: string,
  keywords: string,
  count: number,
  jenisKarya?: string,
  tingkatPendidikan?: string,
  previousTitles?: string[]
): Promise<string[]> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 1800));
    return getMockTitles(field, count);
  }

  let allTitles: string[] = [];
  let retryCount = 0;
  const maxRetries = 3;

  // First attempt
  allTitles = await generateTitlesFromAI(field, topic, keywords, count, jenisKarya, tingkatPendidikan, previousTitles);

  // Validate relevance and filter out irrelevant titles
  const relevantTitles = allTitles.filter(title => 
    isTitleRelevant(title, field, topic, keywords)
  );
  
  // Log filtered titles
  const filteredCount = allTitles.length - relevantTitles.length;
  if (filteredCount > 0) {
    console.warn(`[Gemini] Filtered out ${filteredCount} irrelevant titles, keeping ${relevantTitles.length}`);
  }
  
  allTitles = relevantTitles;

  // Retry if we didn't get enough RELEVANT titles
  while (allTitles.length < count && retryCount < maxRetries) {
    retryCount++;
    const remaining = count - allTitles.length;
    
    console.log(`[Gemini] Retry ${retryCount}/${maxRetries}: Need ${remaining} more RELEVANT titles (have ${allTitles.length}, need ${count})`);
    
    // Generate remaining titles with context of existing ones
    const additionalTitles = await generateAdditionalTitles(
      field, topic, keywords, remaining, allTitles, jenisKarya, tingkatPendidikan, previousTitles
    );
    
    // Validate relevance of new titles
    const relevantNewTitles = additionalTitles.filter(title => 
      isTitleRelevant(title, field, topic, keywords) && !allTitles.includes(title)
    );
    
    const newFilteredCount = additionalTitles.length - relevantNewTitles.length;
    if (newFilteredCount > 0) {
      console.warn(`[Gemini] Retry ${retryCount}: Filtered out ${newFilteredCount} irrelevant titles`);
    }
    
    // Merge new relevant titles (avoid duplicates)
    allTitles = [...allTitles, ...relevantNewTitles];
    
    console.log(`[Gemini] After retry ${retryCount}: ${allTitles.length}/${count} RELEVANT titles`);
    
    // If we got enough, break early
    if (allTitles.length >= count) {
      break;
    }
  }

  // Final validation
  if (allTitles.length >= count) {
    // Trim if we got more than requested
    console.log(`[Gemini] Success! Generated ${allTitles.length} RELEVANT titles, trimming to ${count}`);
    return allTitles.slice(0, count);
  }
  
  // If still not enough after retries, return what we have
  console.warn(`[Gemini] After ${maxRetries} retries, only ${allTitles.length}/${count} RELEVANT titles generated`);
  return allTitles;
}

// Helper function for initial generation
async function generateTitlesFromAI(
  field: string,
  topic: string,
  keywords: string,
  count: number,
  jenisKarya?: string,
  tingkatPendidikan?: string,
  previousTitles?: string[]
): Promise<string[]> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  // Format previous titles to avoid repetition
  const previousTitlesSection = previousTitles && previousTitles.length > 0
    ? `\n\nJudul yang SUDAH PERNAH DIBUAT SEBELUMNYA (JANGAN ULANGI ATAU MIRIP):\n${previousTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nBuat judul yang BENAR-BENAR BERBEDA dari daftar di atas.`
    : '';

  const prompt = `Kamu adalah dosen pembimbing skripsi senior dan reviewer jurnal ilmiah.

Tugasmu adalah membuat rekomendasi judul penelitian yang KREATIF, UNIK, SPESIFIK, dan BERKUALITAS TINGGI.${previousTitlesSection}

WAJIB mengikuti seluruh parameter berikut.

Bidang Penelitian:
${field}

Topik Penelitian:
${topic}

Kata Kunci:
${keywords || "tidak ada kata kunci spesifik"}

${jenisKarya ? `Jenis Karya:\n${jenisKarya}\n\n` : ""}${tingkatPendidikan ? `Tingkat Pendidikan:\n${tingkatPendidikan}\n\n` : ""}Jumlah Judul:
${count}

ATURAN:

1. Semua judul HARUS berada pada bidang ${field}.

2. Semua judul HARUS membahas topik ${topic}.

3. Semua judul HARUS menggunakan atau mencerminkan kata kunci: ${keywords || "topik terkait"}

4. Jangan membuat judul di luar topik ${topic}.

5. Jangan menggunakan bidang ilmu lain selain ${field}.

6. Jangan menghasilkan judul yang terlalu umum.

7. Judul harus realistis untuk skripsi Indonesia.

8. Hindari judul yang sama atau sangat mirip.

9. Gunakan bahasa akademik.

10. Berikan tepat ${count} judul.

11. Spesifik (sebutkan metode, lokasi, atau objek yang jelas).

12. Menggunakan kata kerja ilmiah (Analisis, Pengembangan, Implementasi, Evaluasi, Perancangan, dll.).

13. Panjang 10-20 kata.

14. Bahasa Indonesia baku.

15. Tidak menggunakan tanda tanya atau tanda seru.

PENTING: WAJIB menghasilkan TEPAT ${count} judul. Jangan kurang dan jangan lebih.

Format output: daftar bernomor saja (1. judul, 2. judul, dst.) dari nomor 1 sampai ${count}. Tanpa keterangan tambahan di awal atau akhir.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.95, maxOutputTokens: 2048 }, // Higher temp for creativity
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini ${res.status}`);

    const data = await res.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return parseTitles(raw, count);
  } catch {
    return getMockTitles(field, count);
  }
}

// Helper function for generating additional titles (retry)
async function generateAdditionalTitles(
  field: string,
  topic: string,
  keywords: string,
  remaining: number,
  existingTitles: string[],
  jenisKarya?: string,
  tingkatPendidikan?: string,
  previousTitles?: string[]
): Promise<string[]> {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;

  // Combine existing and previous titles to avoid repetition
  const allExistingTitles = [...existingTitles, ...(previousTitles || [])];
  const existingList = allExistingTitles
    .map((t, i) => `${i + 1}. ${t}`)
    .join("\n");

  const prompt = `Kamu adalah dosen pembimbing skripsi senior dan reviewer jurnal ilmiah.

Tugas: Buat TEPAT ${remaining} judul penelitian tambahan yang KREATIF, UNIK, dan BERBEDA SAMA SEKALI dari judul yang sudah ada.

WAJIB mengikuti seluruh parameter berikut.

Bidang Penelitian:
${field}

Topik Penelitian:
${topic}

Kata Kunci:
${keywords || "tidak ada kata kunci spesifik"}

${jenisKarya ? `Jenis Karya:\n${jenisKarya}\n\n` : ""}${tingkatPendidikan ? `Tingkat Pendidikan:\n${tingkatPendidikan}\n\n` : ""}Jumlah Judul Baru:
${remaining}

Judul yang SUDAH ADA (JANGAN ULANG):
${existingList}

ATURAN:

1. Semua judul HARUS berada pada bidang ${field}.

2. Semua judul HARUS membahas topik ${topic}.

3. Semua judul HARUS menggunakan atau mencerminkan kata kunci: ${keywords || "topik terkait"}

4. Jangan membuat judul di luar topik ${topic}.

5. Jangan menggunakan bidang ilmu lain selain ${field}.

6. JANGAN mengulang judul yang sudah ada di atas.

7. Setiap judul harus unik dan tidak mirip dengan yang sudah ada.

8. Judul harus realistis untuk skripsi Indonesia.

9. Gunakan bahasa akademik.

10. Berikan tepat ${remaining} judul baru.

11. Spesifik (sebutkan metode, lokasi, atau objek yang jelas).

12. Menggunakan kata kerja ilmiah yang berbeda dari judul existing.

13. Panjang 10-20 kata.

14. Bahasa Indonesia baku.

PENTING:
1. WAJIB menghasilkan TEPAT ${remaining} judul baru
2. JANGAN mengulang judul yang sudah ada
3. Setiap judul harus unik dan tidak mirip dengan yang sudah ada
4. HARUS sesuai dengan bidang, topik, dan kata kunci

Format output: daftar bernomor saja (1. judul, 2. judul, dst.) dari nomor 1 sampai ${remaining}. Tanpa keterangan tambahan.`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini ${res.status}`);

    const data = await res.json();
    const raw: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return parseTitles(raw, remaining);
  } catch {
    console.warn(`[Gemini] Retry generation failed, falling back to mock`);
    return getMockTitles(field, remaining);
  }
}

// Helper function to parse titles from AI response
function parseTitles(raw: string, count: number): string[] {
  const parsed = raw
    .split("\n")
    .map((l: string) => l.trim())
    .filter((l: string) => /^\d+[\.\)]\s/.test(l))
    .map((l: string) => l.replace(/^\d+[\.\)]\s*/, "").trim())
    .filter((t: string) => t.length > 10);

  return parsed;
}

// Relevance validation function
function isTitleRelevant(
  title: string,
  field: string,
  topic: string,
  keywords: string
): boolean {
  const titleLower = title.toLowerCase();
  const fieldLower = field.toLowerCase();
  const topicLower = topic.toLowerCase();
  const keywordsLower = keywords.toLowerCase();
  
  // Extract key terms from field, topic, and keywords
  const fieldTerms = fieldLower.split(/\s+/).filter(term => term.length > 3);
  const topicTerms = topicLower.split(/\s+/).filter(term => term.length > 3);
  const keywordTerms = keywordsLower.split(/[,\s]+/).filter(term => term.length > 3);
  
  // Check if title contains topic terms (most important)
  const hasTopicRelevance = topicTerms.some(term => titleLower.includes(term));
  
  // Check if title contains keyword terms (if keywords provided)
  const hasKeywordRelevance = keywords 
    ? keywordTerms.some(term => titleLower.includes(term))
    : true; // If no keywords, this check passes
  
  // Check if title contains field terms
  const hasFieldRelevance = fieldTerms.some(term => titleLower.includes(term));
  
  // Title must have at least topic OR field relevance
  const isRelevant = hasTopicRelevance || hasFieldRelevance;
  
  // Log validation details for debugging
  if (!isRelevant) {
    console.warn(`[Validation] Title rejected: "${title}"`);
    console.warn(`  - Topic terms: ${topicTerms.join(", ")}`);
    console.warn(`  - Keyword terms: ${keywordTerms.join(", ")}`);
    console.warn(`  - Field terms: ${fieldTerms.join(", ")}`);
  }
  
  return isRelevant;
}
