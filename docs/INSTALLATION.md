# Panduan Instalasi AKKA

## 1. Persyaratan

- Browser modern (Chrome, Edge, Firefox, atau browser Android berbasis Chromium).
- Layanan hosting web statis (contoh: GitHub Pages, Netlify, Vercel, cPanel/shared hosting, atau sekadar folder di server sekolah).
- Akun Google (untuk Google Sheets + Google Apps Script).

> **Penting:** Karena `index.html`, `login.html`, dll saling memuat data lewat
> `fetch()` ke file JSON di folder `data/`, membuka file secara langsung
> (`file://...`) di sebagian browser akan diblokir kebijakan CORS. Selalu
> jalankan lewat server statis (hosting sungguhan) atau server lokal saat
> menguji coba (lihat langkah 3).

## 2. Struktur Folder

```
AKKA/
├── html/            # Seluruh halaman website
├── css/             # Seluruh stylesheet
├── js/               # Seluruh logika aplikasi
├── data/             # Konfigurasi, bank soal, token
├── assets/           # Logo, ikon, gambar, animasi, audio
├── apps-script/      # Kode Google Apps Script
├── docs/             # Dokumentasi (termasuk blueprint)
└── README.md
```

## 3. Menjalankan di Komputer Lokal (untuk pengujian)

Karena butuh server (bukan `file://`), cara termudah:

**Menggunakan Python (sudah ada di banyak komputer):**
```bash
cd AKKA
python -m http.server 8000
```
Lalu buka `http://localhost:8000/html/index.html` di browser.

**Menggunakan VS Code:** install ekstensi "Live Server", klik kanan pada
`html/index.html` > "Open with Live Server".

## 4. Publikasi ke Hosting

1. Unggah seluruh isi folder `AKKA/` ke hosting pilihan Anda.
2. Pastikan struktur folder tidak berubah (relative path antar file bergantung padanya).
3. Alamat yang dibuka siswa adalah `https://domain-anda.com/html/index.html`
   (atau atur `index.html` di folder `html/` sebagai halaman utama lewat
   pengaturan hosting/redirect bila diinginkan agar cukup buka `domain-anda.com`).

## 5. Menghubungkan ke Google Sheets

Lihat langkah lengkap di `docs/CONFIGURATION.md` bagian **Google Apps Script**.
Setelah Web App Apps Script di-deploy, salin URL-nya ke `data/config.json`
pada key `"appsScriptUrl"`.

## 6. Uji Coba Sebelum Digunakan Siswa

Ikuti daftar pengujian pada BAB 9.3 Blueprint:
- Login siswa
- Pemilihan asesmen
- Validasi token (Paket A & Paket B)
- Seluruh 6 jenis soal
- Timer & waktu habis
- Autosave jawaban
- Pengiriman hasil ke Google Sheets
- Tampilan di HP, tablet, laptop, desktop
