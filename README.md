# Journeyasya — Hendra & Tasya

**Novel interaktif berbasis web** dengan desain buku digital, 12 bab, 14 momen linimasa, ilustrasi asli (SVG), mode baca terang/malam, unduhan PDF, dan tata letak responsif untuk iPhone, Android, tablet, dan desktop.

**Website:** https://journeyasya.vercel.app  
**GitHub:** https://github.com/podsni/journeyasya

> **Catatan penting:** Novel ditulis dari sudut pandang Hendra. Narasi, perasaan, percakapan yang didramatisasi, dan gambaran suasana merupakan karya kreatif. Novel tidak menyimpulkan perasaan Tasya. Hormati privasi dan persetujuan semua pihak sebelum membagikan cerita ini kepada orang lain.

## Fitur utama

- **Sampul sinematik:** ilustrasi malam kafe dan pegunungan.
- **Reader ala e-book:** panel buku, daftar isi, bab sebelumnya/berikutnya, keyboard ←/→ dan Esc.
- **Pengaturan baca:** huruf A−/A+, mode kertas terang dan malam, halaman lanjut baca.
- **Progres pribadi:** bab selesai, posisi gulir, bab terakhir, dan favorit tersimpan menggunakan `localStorage`; tidak dikirim ke server.
- **14 momen timeline:** filter per bulan, klik untuk membuka bab terkait.
- **Galeri:** ilustrasi kafe malam dan matahari terbit (bukan foto dokumenter).
- **Surat digital:** dibuka dengan sentuhan, sebagai monolog fiksi.
- **PDF:** tombol unduh `/downloads/novel-hendra-tasya.pdf` yang dapat dibaca secara offline.
- **Responsive & accessible:** layout mobile/desktop, label aksesibilitas, tampilan fokus keyboard, dan `prefers-reduced-motion`.

## Struktur folder

```text
journeyasya/
├── index.html                  # Beranda, reader, timeline, galeri, surat
├── README.md                   # Dokumentasi ini
├── vercel.json                 # Pengaturan static hosting + security headers
├── robots.txt                  # Petunjuk mesin pencari
├── .gitignore
├── assets/
│   ├── cafe-night.svg          # Ilustrasi malam di kafe
│   ├── dawn.svg                # Ilustrasi pegunungan saat pagi
│   └── icon.svg                # Favicon
├── data/
│   └── story.js                # Isi 12 bab dan 14 momen (sumber konten)
├── src/
│   └── app.js                  # Navigasi, reader, progress, localStorage
├── styles/
│   └── main.css                # Desain & layout responsif
└── downloads/
    └── novel-hendra-tasya.pdf  # Novel offline
```

## Menjalankan di komputer

Tidak membutuhkan Node.js, npm, atau build tool. Gunakan server statis lokal agar jalur `/assets/`, `/data/` dan `/scripts/` bekerja benar.

```bash
git clone https://github.com/podsni/journeyasya.git
cd journeyasya
python3 -m http.server 8000
```

Buka http://localhost:8000.

> Jangan membuka `index.html` langsung memakai protokol `file://` bila berkas terpisah tidak termuat. Gunakan server lokal atau tautan HTTPS.

## Mengubah isi cerita

1. Edit `data/story.js`. Semua teks bab berada pada `window.JOURNEY_STORY.chapters`; tiap bab berisi `id`, `title`, `date`, `subtitle`, `quote`, `paragraphs`, dan `minutes`.
2. Edit `milestones` untuk menambah/mengubah momen timeline. Properti `chapter` mengacu ke nomor bab.
3. Edit `styles/main.css` untuk tampilan dan `src/app.js` untuk interaksi.
4. Bila cerita berubah, **buat ulang PDF** di `downloads/` agar versi unduh selaras.
5. Uji di layar 390 px, 768 px, dan desktop. Uji tombol A+/A−, daftar isi, pergantian tema, scroll, PDF, dan tautan bab.

## Deploy ke Vercel

Project telah tersedia di workspace Vercel sebagai **`journeyasya`**.

- **Framework:** Other / Static HTML.
- **Root Directory:** `./`.
- **Build command:** kosong.
- **Output directory:** kosong.
- **Production domain:** `https://journeyasya.vercel.app`.

**Penting:** Koneksi Vercel workspace saat dokumentasi dibuat **belum berhasil menautkan repository `podsni/journeyasya`** (provider menjawab `repo_not_found`). Versi production diterbitkan dengan upload manual. Artinya, mengubah file GitHub **belum otomatis** memperbarui Vercel. Agar auto-deploy aktif, buka Vercel → Project → Settings → Git dan instal/otorisasi integrasi GitHub untuk akun `podsni`, lalu sambungkan repository ini. Jangan membuat project kedua tanpa memeriksa domain dan pengaturan project yang telah aktif.

Setelah Git integration tersedia, push ke branch `main` akan memicu deployment secara otomatis.

## Privasi dan batasan

- Kode dan novel berada di **repositori publik** saat proyek ini dibuat. Siapa pun dapat melihat atau menyalin konten.
- `robots.txt` dan `noindex` **bukan proteksi privasi**. Mereka hanya permintaan kepada perayap.
- Jangan menyertakan transkrip pesan privat mentah, nomor telepon, alamat rumah, atau rahasia dalam source publik.
- Simpan bab favorit, ukuran huruf dan progres secara lokal saja. Data bisa hilang jika cache/browser dihapus atau pindah perangkat.
- Ilustrasi bersifat artistik; bukan foto nyata Hendra, Tasya, atau kafe yang spesifik.
- Konten ini bukan sarana menekan seseorang agar membalas atau menjalin hubungan.

## Teknologi

HTML5, CSS3, vanilla JavaScript, SVG, PDF statis, dan `localStorage`. Tidak memakai tracker, backend, database, API key, atau dependency npm.

## Status

Versi 2 · 18 November 2026. Dibangun untuk pengalaman membaca personal dan privasi yang lebih disadari.
