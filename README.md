# Journeyasya — Hendra & Tasya

**Website:** https://journeyasya.vercel.app  
**GitHub:** https://github.com/podsni/journeyasya

Novel digital interaktif berbasis **Vite 8 + React 19** tentang perjalanan Hendra dan Tasya. Dirancang seperti buku digital yang nyaman dibaca lewat iPhone, Android, tablet, serta desktop.

## Fitur

- **12 bab** dengan ilustrasi suasana, kutipan, dan navigasi bab sebelumnya/berikutnya.
- **Daftar isi** sebagai sidebar (desktop) atau drawer (mobile).
- **3 tema baca:** terang, sepia, gelap; ukuran font 16–25 px.
- Penanda favorit, catatan pribadi per bab, bab terakhir, dan progres baca tersimpan menggunakan `localStorage` pada perangkat pembaca.
- **14 momen** linimasa interaktif yang menaut ke bab terkait.
- Surat digital dengan animasi amplop, galeri suasana, serta refleksi epilog interaktif.
- Tombol **unduh novel PDF** di beranda dan di pembaca.
- Aksesibilitas: semantic landmarks, fokus keyboard, shortcut kiri/kanan, reduced motion, gambar berteks alternatif.

## Teknologi

- React dan Vite, single-page application statis.
- CSS modern tanpa library UI tambahan.
- Konten cerita terpisah dari tampilan dalam `src/story.js`.
- Ilustrasi SVG dan PDF berkas lokal pada `public/`.

## Menjalankan di komputer

Persyaratan: Node.js 20.19+ atau 22.12+.

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Struktur folder

```text
journeyasya/
├── public/
│   ├── images/
│   │   ├── cafe-night.svg
│   │   ├── dawn.svg
│   │   ├── icon.svg
│   │   ├── rain-coffee.svg
│   │   └── road-night.svg
│   └── books/novel-hendra-tasya.pdf
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── story.js
│   └── styles.css
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
└── README.md
```

## Deploy ke Vercel

Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`. Proyek Vercel bernama `journeyasya`.

> Vercel Git Integration perlu tersambung ke GitHub yang memiliki izin pada `podsni/journeyasya` agar setiap push branch `main` langsung memicu deployment. Jika belum tersambung, update manual via Vercel API dapat menampilkan hasilnya tetapi **tidak mengaktifkan redeploy otomatis**.

## Mengubah cerita

Sunting `src/story.js` dan perbarui PDF di `public/books/novel-hendra-tasya.pdf` jika ada perubahan isi. Pastikan tanggal, tokoh, dan dialog mengikuti sumber yang telah disepakati. Gambar dalam `public/images` merupakan ilustrasi, bukan dokumentasi peristiwa asli.

## Privasi dan batasan narasi

Kisah ini adalah **novelisasi dari sudut pandang Hendra**. Adegan, suasana, dan pikiran tokoh bersifat kreatif; bukan bukti bahwa Tasya memiliki perasaan atau keputusan tertentu. Konten pribadi perlu disebarkan dengan pertimbangan persetujuan.

Repositori `public` berarti isinya dapat dilihat orang lain. `noindex` hanyalah permintaan kepada mesin pencari dan **bukan** kontrol privasi. Bila menginginkan akses terbatas, atur visibilitas repo serta Deployment Protection di Vercel.

---

Made with care, one chapter at a time.
