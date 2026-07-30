# AKKA - Asesmen Koding dan Kecerdasan Artifisial

Platform asesmen digital untuk mata pelajaran Koding dan Kecerdasan
Artifisial di Madrasah Ibtidaiyah, kelas 5 dan 6.

**Tagline:** Think • Solve • Code

## Teknologi

HTML5 • CSS3 • JavaScript ES6+ • JSON • Google Apps Script • Google Sheets
(tanpa framework frontend/backend)

## Memulai

1. Baca `docs/INSTALLATION.md` untuk menjalankan/menghosting website.
2. Baca `docs/CONFIGURATION.md` untuk mengatur asesmen, token, bank soal,
   dan integrasi Google Sheets.
3. Baca `docs/DEVELOPMENT.md` bila ingin menambah fitur/bab/jenis soal.

## Struktur Folder

```
AKKA/
├── html/        index.html, login.html, dashboard.html, petunjuk.html, soal.html, selesai.html
├── css/         variables, base, components + 1 file per halaman
├── js/          app, login, dashboard, token, petunjuk, security, timer, autosave, scoring, soal, selesai
├── data/        config.json, assessments.json, tokens.json, questions/
├── assets/      logo, icon, image, animation, audio
├── apps-script/ Code.gs
└── docs/        Blueprint_AKKA.docx + dokumentasi
```

## Alur Aplikasi

Splash → Login → Pilih Asesmen → Petunjuk (+Token) → Validasi Token →
Halaman Soal → Konfirmasi Selesai → Halaman Akhir (nilai tidak ditampilkan)

---
© AKKA - Asesmen Koding dan Kecerdasan Artifisial
