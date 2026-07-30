# Panduan Konfigurasi AKKA

Semua pengaturan sistem berada di folder `data/` sebagai file JSON, sehingga
guru dapat mengubah konfigurasi **tanpa menyentuh kode program**.

## 1. `data/config.json`

```json
{
  "namaPlatform": "AKKA",
  "appsScriptUrl": "URL_WEB_APP_APPS_SCRIPT_ANDA",
  "bobotDefault": { ... },
  "durasiDefaultMenit": 60
}
```
- `appsScriptUrl` **wajib diisi** dengan URL deployment Apps Script Anda
  (lihat bagian 4). Selama masih bertuliskan `GANTI_...`, hasil asesmen
  tidak akan terkirim ke Google Sheets (namun siswa tetap bisa mengerjakan
  dan tidak akan macet, karena kegagalan pengiriman ditangani dengan aman).

## 2. `data/assessments.json`

Daftar seluruh asesmen per kelas per bab. Contoh satu entri:

```json
{
  "id": "k5-bab1",
  "kelas": "5",
  "bab": 1,
  "nama": "Asesmen Harian Bab 1",
  "status": "aktif",
  "durasiMenit": 60,
  "jumlahSoal": 6,
  "jenisSoal": ["pg", "pg_kompleks", "benar_salah", "menjodohkan", "isian_singkat", "uraian"]
}
```

**Untuk menambah asesmen baru:** tambahkan objek baru dengan `id` unik,
lalu buat file bank soal yang sesuai di `data/questions/` (lihat bagian 4).

**Mengaktifkan/menonaktifkan asesmen:** ubah `status` menjadi `"aktif"`
atau `"belum_aktif"`. Perubahan ini langsung berlaku tanpa perlu mengubah
kode website (BAB 4.2).

## 3. `data/tokens.json`

Setiap kelas memiliki 2 token per asesmen: Paket A dan Paket B.

```json
{ "assessmentId": "k5-bab1", "kelas": "5", "paket": "A", "token": "K5B1A25", "statusAktif": true }
```

- Token bersifat **case-insensitive** saat diinput siswa (otomatis di-uppercase).
- Token hanya berlaku untuk `assessmentId` + `kelas` yang sama persis.
- Ganti nilai `token` kapan saja untuk asesmen baru; tidak memengaruhi kode.

## 4. `data/questions/{assessmentId}-paket{A|B}.json`

Contoh nama file: `k5-bab1-paketA.json`, `k5-bab1-paketB.json`.

Setiap file berisi array `soal`. Format tiap jenis soal:

| Jenis | Field khusus |
|---|---|
| `pg` | `opsi: string[]`, `kunci: index angka` |
| `pg_kompleks` | `opsi: string[]`, `kunci: index[]` (bisa lebih dari satu) |
| `benar_salah` | `pernyataan: [{teks, kunci: "benar"/"salah"}, ...]` (biasanya 3 pernyataan per soal) |
| `menjodohkan` | `pasangan: [{kiri, kanan}, ...]` |
| `isian_singkat` | `bobot: "manual"` (dinilai guru) |
| `uraian` | `bobot: "manual"` (dinilai guru) |

Setiap soal wajib memiliki `id` (angka, unik dalam 1 paket), `jenis`,
`pertanyaan`, dan `bobot` (angka untuk soal otomatis, atau `"manual"`).

## 5. Google Apps Script (Integrasi Google Sheets)

1. Buat Google Sheet baru (atau gunakan yang sudah ada).
2. Menu **Extensions > Apps Script**.
3. Hapus kode contoh, tempel seluruh isi `apps-script/Code.gs`.
4. Klik **Deploy > New deployment**.
   - Pilih tipe **Web app**.
   - **Execute as:** Me (akun Anda).
   - **Who has access:** Anyone.
5. Klik **Deploy**, salin **URL Web App** yang muncul.
6. Tempel URL tersebut ke `data/config.json` pada `"appsScriptUrl"`.
7. Setiap kali ada siswa mengirim jawaban, sebuah sheet bernama
   `HasilAsesmen` akan otomatis dibuat/diisi.

### Menilai Soal Isian Singkat & Uraian

Buka kolom **"Detail Jawaban (JSON)"** di sheet `HasilAsesmen` untuk melihat
jawaban lengkap tiap siswa (termasuk isian singkat & uraian). Guru
menuliskan nilai manual pada kolom **"Nilai Uraian/Isian (Manual)"**, lalu
menjumlahkannya sendiri dengan kolom **"Nilai Otomatis"** untuk mendapatkan
**"Nilai Akhir"**.

## 6. Mengubah Bobot Nilai

Bobot nilai tiap soal disimpan langsung pada tiap objek soal di
`data/questions/...json` (field `bobot`), bukan bobot global — sesuai
BAB 4.8 bahwa bobot bersifat fleksibel dan dapat berbeda tiap asesmen.
Ubah angka `bobot` pada soal yang diinginkan, tidak perlu mengubah kode.
