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
  let relevantTitles = allTitles.filter(title => 
    isTitleRelevant(title, field, topic, keywords)
  );
  
  // Filter out duplicates from previous generations
  const nonDuplicateTitles = relevantTitles.filter(title => 
    !isTitleDuplicate(title, previousTitles || [])
  );
  
  // Log filtered titles
  const filteredRelevance = allTitles.length - relevantTitles.length;
  const filteredDuplicates = relevantTitles.length - nonDuplicateTitles.length;
  
  if (filteredRelevance > 0) {
    console.warn(`[Gemini] Filtered out ${filteredRelevance} irrelevant titles`);
  }
  if (filteredDuplicates > 0) {
    console.warn(`[Gemini] Filtered out ${filteredDuplicates} duplicate/similar titles from previous generations`);
  }
  
  allTitles = nonDuplicateTitles;

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
      isTitleRelevant(title, field, topic, keywords)
    );
    
    // Filter duplicates against BOTH current batch AND previous generations
    const uniqueNewTitles = relevantNewTitles.filter(title => 
      !isTitleDuplicate(title, [...allTitles, ...(previousTitles || [])])
    );
    
    const newFilteredRelevance = additionalTitles.length - relevantNewTitles.length;
    const newFilteredDuplicates = relevantNewTitles.length - uniqueNewTitles.length;
    
    if (newFilteredRelevance > 0) {
      console.warn(`[Gemini] Retry ${retryCount}: Filtered out ${newFilteredRelevance} irrelevant titles`);
    }
    if (newFilteredDuplicates > 0) {
      console.warn(`[Gemini] Retry ${retryCount}: Filtered out ${newFilteredDuplicates} duplicate titles`);
    }
    
    // Merge new relevant titles (avoid duplicates)
    allTitles = [...allTitles, ...uniqueNewTitles];
    
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

  // Generate unique ID for this generation to force variation
  const generationId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Format previous titles to avoid repetition
  const previousTitlesSection = previousTitles && previousTitles.length > 0
    ? `\n\n⛔ DAFTAR JUDUL YANG DILARANG (JANGAN ULANGI SAMA SEKALI):\n${previousTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\n❗ PENTING: Jangan menghasilkan judul yang sama atau mirip dengan daftar di atas. Buat yang BENAR-BENAR BARU dan BERBEDA.`
    : '';

  const prompt = `Anda adalah dosen pembimbing skripsi, reviewer jurnal internasional, editor Scopus, dan peneliti senior yang telah membimbing ribuan penelitian.

Tugas Anda adalah menghasilkan judul penelitian akademik yang berkualitas tinggi.

🎲 Generation ID: ${generationId}
(Setiap generation ID menghasilkan variasi yang berbeda)
${previousTitlesSection}

Setiap judul HARUS:

1. Sangat relevan dengan bidang penelitian: ${field}
2. Sangat relevan dengan topik penelitian: ${topic}
3. Memanfaatkan seluruh kata kunci secara alami: ${keywords || "topik terkait"}
4. Sesuai dengan jenis karya: ${jenisKarya || "Skripsi"}
5. Disesuaikan dengan tingkat pendidikan: ${tingkatPendidikan || "S1"}
6. Menggunakan istilah akademik yang modern
7. Menampilkan unsur kebaruan (novelty)
8. Layak diajukan sebagai judul penelitian
9. Tidak terlalu pendek (minimal 10 kata)
10. Tidak terlalu panjang (maksimal 20 kata)
11. Tidak menggunakan kalimat yang sama berulang
12. Tidak menghasilkan judul generik
13. Tidak menggunakan template yang identik
14. Tidak membuat judul yang hanya mengganti satu atau dua kata

UTAMAKAN VARIASI.

Gunakan berbagai pendekatan seperti:
- Perancangan, Pengembangan, Implementasi
- Analisis, Evaluasi, Optimasi
- Prediksi, Klasifikasi, Deteksi
- Monitoring, Rekomendasi
- Decision Support System
- Deep Learning, Machine Learning, Artificial Intelligence
- Computer Vision, NLP, Data Mining
- Blockchain, IoT, Big Data, Cloud Computing
- Cyber Security, Digital Twin
- Explainable AI, Federated Learning
- Multi-Agent AI, RAG, LLM
- Generative AI, Hybrid Model, Smart System

Jika diminta beberapa judul sekaligus, setiap judul WAJIB berbeda konsep.

Contoh variasi konsep:
- Judul 1: menggunakan metode klasifikasi
- Judul 2: menggunakan optimasi
- Judul 3: menggunakan prediksi
- Judul 4: menggunakan evaluasi
- Judul 5: menggunakan pengembangan sistem
- Judul 6: menggunakan analisis komparatif
- Judul 7: menggunakan Decision Support System
- Judul 8: menggunakan model hybrid

Jangan membuat judul yang hanya berbeda satu kata.

Setiap judul harus memiliki sudut pandang penelitian yang berbeda.

Gunakan nama metode penelitian yang memang umum dipakai dalam bidang ${field}.

HINDARI JUDUL TERLALU UMUM SEPERTI:
❌ "Analisis Sistem Informasi Penjualan"
❌ "Perancangan Sistem Berbasis Web"
❌ "Implementasi Machine Learning untuk Bisnis"

HASILKAN JUDUL YANG MENARIK SEPERTI:
✅ "Optimasi Deteksi Fraud Transaksi Digital Menggunakan Hybrid XGBoost dan Explainable Artificial Intelligence"
✅ "Pengembangan Sistem Rekomendasi Karier Mahasiswa Berbasis Large Language Model dan Semantic Matching"
✅ "Model Prediksi Tingkat Kelulusan Mahasiswa Menggunakan Explainable Machine Learning Berbasis Data Akademik"

PARAMETER PENELITIAN:

Bidang Penelitian:
${field}

Jenis Karya:
${jenisKarya || "Skripsi"}

Topik Penelitian:
${topic}

Kata Kunci:
${keywords || "tidak ada kata kunci spesifik"}

Tingkat Pendidikan:
${tingkatPendidikan || "S1"}

Jumlah Judul:
${count}

INSTRUKSI FINAL:

Buat TEPAT ${count} judul penelitian.

Setiap judul harus unik dan menggunakan pendekatan penelitian yang berbeda.

Setiap judul harus benar-benar sesuai dengan seluruh parameter di atas.

Kembalikan HANYA daftar judul tanpa penjelasan, tanpa markdown, tanpa nomor tambahan selain penomoran daftar.

Format: 
1. [judul pertama]
2. [judul kedua]
3. [judul ketiga]
...dst sampai ${count}`;

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

  const prompt = `Anda adalah dosen pembimbing skripsi senior, reviewer jurnal internasional, dan peneliti berpengalaman.

Tugas: Buat TEPAT ${remaining} judul penelitian tambahan yang benar-benar BARU, KREATIF, dan BERBEDA SAMA SEKALI dari semua judul yang sudah ada.

⛔ DAFTAR JUDUL YANG SUDAH ADA (DILARANG MENGULANG ATAU MIRIP):
${existingList}

Setiap judul baru HARUS:

1. Sangat relevan dengan bidang: ${field}
2. Sangat relevan dengan topik: ${topic}
3. Memanfaatkan kata kunci: ${keywords || "topik terkait"}
4. Sesuai jenis karya: ${jenisKarya || "Skripsi"}
5. Sesuai tingkat pendidikan: ${tingkatPendidikan || "S1"}
6. Menggunakan pendekatan/metode yang BERBEDA dari semua judul di atas
7. Memiliki sudut pandang penelitian yang berbeda
8. Menampilkan kebaruan (novelty)
9. Tidak mengulang atau memparaphrase judul yang sudah ada
10. Layak sebagai penelitian akademik

UTAMAKAN VARIASI METODE:

Gunakan pendekatan yang berbeda-beda untuk setiap judul:
- Jika judul existing pakai "Analisis", buat yang "Optimasi" atau "Prediksi"
- Jika existing pakai "Machine Learning", buat yang "Deep Learning" atau "Hybrid Model"
- Jika existing pakai "Sistem Informasi", buat yang "Decision Support System"
- Variasikan: klasifikasi, clustering, forecasting, detection, recommendation, dll.

CONTOH VARIASI YANG BAIK:
✅ Existing: "Analisis Sentimen Menggunakan Naive Bayes"
  → Baru: "Optimasi Akurasi Klasifikasi Sentimen Menggunakan Hybrid CNN-LSTM"

✅ Existing: "Sistem Rekomendasi Berbasis Collaborative Filtering"
  → Baru: "Pengembangan Smart Recommendation System Menggunakan Knowledge Graph dan Semantic Matching"

HINDARI:
❌ Judul yang hanya mengganti 1-2 kata dari yang sudah ada
❌ Judul dengan struktur yang sama persis
❌ Judul dengan metode yang sama hanya beda objek
❌ Judul generik seperti "Analisis Sistem..." atau "Perancangan Sistem..."

PARAMETER:
- Bidang: ${field}
- Topik: ${topic}
- Kata Kunci: ${keywords || "tidak ada"}
- Jenis Karya: ${jenisKarya || "Skripsi"}
- Tingkat: ${tingkatPendidikan || "S1"}
- Jumlah yang Dibutuhkan: ${remaining}

INSTRUKSI FINAL:

Buat TEPAT ${remaining} judul yang benar-benar BARU dan BERBEDA dari semua judul di atas.

Setiap judul harus menggunakan metode/pendekatan yang berbeda.

Kembalikan HANYA daftar judul tanpa penjelasan.

Format:
1. [judul baru pertama]
2. [judul baru kedua]
...dst sampai ${remaining}`;

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

// Check if title is too similar to any existing title
function isTitleDuplicate(
  title: string,
  existingTitles: string[]
): boolean {
  const titleLower = title.toLowerCase();
  const titleWords = new Set(titleLower.split(/\s+/).filter(w => w.length > 3));
  
  for (const existing of existingTitles) {
    const existingLower = existing.toLowerCase();
    
    // Exact match
    if (titleLower === existingLower) {
      console.warn(`[Duplicate] EXACT match: "${title}"`);
      return true;
    }
    
    // Check similarity using word overlap
    const existingWords = new Set(existingLower.split(/\s+/).filter(w => w.length > 3));
    const commonWords = [...titleWords].filter(w => existingWords.has(w));
    
    // Calculate similarity percentage
    const maxWords = Math.max(titleWords.size, existingWords.size);
    const similarity = maxWords > 0 ? commonWords.length / maxWords : 0;
    
    // If more than 70% words are the same, consider it a duplicate
    if (similarity > 0.7) {
      console.warn(`[Duplicate] ${Math.round(similarity * 100)}% similar: "${title}" vs "${existing}"`);
      return true;
    }
  }
  
  return false;
}
