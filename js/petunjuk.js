/* ==========================================================================
   AKKA - petunjuk.js
   Menampilkan info asesmen + validasi token sebelum mulai (BAB 3.7, 3.8, 5.6)
   ========================================================================== */

(function () {
  'use strict';

  const session = AKKA.requireSession('login.html');
  if (!session) return;

  const assessmentId = sessionStorage.getItem('akka_selected_assessment');
  if (!assessmentId) { window.location.href = 'dashboard.html'; return; }

  document.getElementById('btnKembali').addEventListener('click', function () {
    window.location.href = 'dashboard.html';
  });

  document.getElementById('infoNama').textContent = session.nama;
  document.getElementById('infoAbsen').textContent = session.absen;
  document.getElementById('infoKelas').textContent = 'Kelas ' + session.kelas;

  let currentAssessment = null;

  const JENIS_LABEL = {
    pg: 'Pilihan Ganda',
    pg_kompleks: 'Pilihan Ganda Kompleks',
    benar_salah: 'Benar/Salah',
    menjodohkan: 'Menjodohkan',
    isian_singkat: 'Isian Singkat',
    uraian: 'Uraian'
  };

  async function loadAssessment() {
    const assessments = await AKKA.fetchJSON('data/assessments.json');
    const found = assessments.find((a) => a.id === assessmentId);

    if (!found || found.status !== 'aktif') {
      // Asesmen belum/tidak aktif tidak dapat diakses (BAB 4.2)
      window.location.href = 'dashboard.html';
      return;
    }

    currentAssessment = found;
    document.getElementById('namaAsesmen').textContent = found.nama;
    document.getElementById('infoJumlahSoal').textContent = found.jumlahSoal + ' soal';
    document.getElementById('infoJenisSoal').textContent = (found.jenisSoal || [])
      .map((j) => JENIS_LABEL[j] || j).join(', ');
    document.getElementById('infoDurasi').textContent = found.durasiMenit + ' menit';
  }

  const form = document.getElementById('tokenForm');
  const inputToken = document.getElementById('inputToken');
  const btnMulai = document.getElementById('btnMulai');
  const errToken = document.getElementById('errToken');

  let validatedPaket = null;

  inputToken.addEventListener('input', function () {
    btnMulai.disabled = true;
    validatedPaket = null;
    errToken.textContent = '';
  });

  inputToken.addEventListener('blur', async function () {
    if (!inputToken.value.trim()) return;
    
    // Mengekstrak angka saja dari nama kelas.
    // Contoh: "5A", "5B", "5 E" akan diubah menjadi "5"
    const tingkatKelas = session.kelas.replace(/[^0-9]/g, '');
    
    // Gunakan tingkatKelas untuk validasi, BUKAN session.kelas
    const result = await AkkaToken.validate(assessmentId, tingkatKelas, inputToken.value);
    
    if (result.valid) {
      validatedPaket = result.paket;
      btnMulai.disabled = false;
      errToken.textContent = '';
    } else {
      validatedPaket = null;
      btnMulai.disabled = true;
      errToken.textContent = 'Kode tidak sesuai.';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validatedPaket || !currentAssessment) return;

    const now = Date.now();
    const attempt = {
      assessmentId: currentAssessment.id,
      assessmentNama: currentAssessment.nama,
      kelas: session.kelas,
      nama: session.nama,
      absen: session.absen,
      paket: validatedPaket,
      token: inputToken.value.trim().toUpperCase(),
      durasiMenit: currentAssessment.durasiMenit,
      startAt: now,
      endAt: now + currentAssessment.durasiMenit * 60 * 1000,
      tabSwitchCount: 0,
      jawaban: {},
      submitted: false
    };

    // Jangan timpa attempt yang sudah berjalan untuk asesmen yang sama (BAB 3.13, 4.16)
    const existing = AKKA.storage.getAttempt();
    if (existing && existing.assessmentId === attempt.assessmentId &&
        existing.nama === attempt.nama && existing.kelas === attempt.kelas &&
        !existing.submitted && existing.endAt > now) {
      window.location.href = 'soal.html';
      return;
    }

    AKKA.storage.setAttempt(attempt);
    window.location.href = 'soal.html';
  });

  loadAssessment();
})();
