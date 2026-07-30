# Panduan Pengembangan AKKA

## Prinsip Arsitektur (BAB 7)

- **HTML** (struktur) - **CSS** (tampilan) - **JS** (logika) - **JSON** (data)
  dipisahkan sepenuhnya. Tidak ada kode yang digabung dalam satu file.
- Tidak menggunakan framework frontend/backend apa pun kecuali diminta.
- Setiap file JS punya satu tanggung jawab (single responsibility):

| File | Tanggung Jawab |
|---|---|
| `app.js` | Namespace global, util sesi, fetch JSON, footer tahun, splash controller |
| `login.js` | Validasi & submit form login |
| `dashboard.js` | Render daftar asesmen sesuai kelas |
| `token.js` | Validasi token & penentuan paket soal |
| `petunjuk.js` | Info asesmen + alur validasi token |
| `security.js` | Fullscreen, deteksi pindah tab, watermark |
| `timer.js` | Hitung mundur berbasis waktu absolut (`endAt`) |
| `autosave.js` | Simpan jawaban & hitung pindah tab otomatis |
| `scoring.js` | Penilaian otomatis per jenis soal |
| `soal.js` | Controller utama halaman pengerjaan soal |
| `selesai.js` | Halaman akhir setelah jawaban terkirim |

## Menambah Bab / Asesmen Baru

1. Tambahkan entri baru di `data/assessments.json`.
2. Buat token Paket A & B di `data/tokens.json`.
3. Buat file bank soal `data/questions/{id}-paketA.json` dan `...-paketB.json`.
4. Set `status: "aktif"` saat siap digunakan siswa.

Tidak perlu mengubah satu pun file HTML/CSS/JS untuk menambah asesmen baru
(BAB 1.10, 7.9) — semuanya membaca dari `data/` secara dinamis.

## Menambah Jenis Soal Baru

1. Tambahkan case baru pada `buildQuestionHTML()` dan `attachQuestionEvents()`
   di `js/soal.js` untuk cara menampilkan & menangkap jawaban.
2. Tambahkan case penilaian baru pada `scoreQuestion()` di `js/scoring.js`.
3. Tambahkan style baru (bila perlu) di `css/soal.css`.
4. Tambahkan label jenis soal ke objek `JENIS_LABEL` di `js/petunjuk.js` dan `js/soal.js`.

## Menambah Kelas Baru

Tambahkan opsi baru pada `<select id="inputKelas">` di `html/login.html`,
lalu tambahkan asesmen/token/bank soal untuk kelas tersebut seperti biasa.

## Format Data Jawaban (untuk debugging)

Objek jawaban tiap soal (`attempt.jawaban[soalId]`) berbentuk:

- `pg` → `number` (index opsi terpilih)
- `pg_kompleks` → `number[]` (index-index opsi terpilih)
- `benar_salah` → `string[]` (`"benar"`/`"salah"` per pernyataan, sesuai urutan)
- `menjodohkan` → `string[]` (teks jawaban kanan yang dipilih, sesuai urutan `pasangan`)
- `isian_singkat` / `uraian` → `string`

## Rencana Pengembangan Selanjutnya (BAB 8.9, 9.5)

- Dashboard guru untuk mengelola bank soal & token tanpa mengedit JSON manual.
- Migrasi bank soal ke Google Sheets.
- Statistik & analisis hasil asesmen otomatis.
- Ekspor hasil ke Excel.
- Riwayat asesmen siswa.
- Pengembangan menjadi aplikasi Android via WebView.

## Catatan Perubahan

### v1.1.0 (rebuild sesuai Blueprint terbaru)
- Palet warna diperbarui: menambahkan Ungu sebagai warna aksen pendukung.
- Soal Benar/Salah diubah strukturnya: 1 soal berisi 3 pernyataan yang
  masing-masing dijawab Benar/Salah (bukan 1 soal = 1 jawaban Benar/Salah).
- Splash screen tetap hanya animasi logo (tanpa ilustrasi karakter siswa).
