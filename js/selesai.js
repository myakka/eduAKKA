/* ==========================================================================
   AKKA - selesai.js
   Menampilkan konfirmasi pengiriman jawaban tanpa menampilkan nilai (BAB 3.11, 4.17, 5.9)
   ========================================================================== */

(function () {
  'use strict';

  let summary = null;
  try { summary = JSON.parse(sessionStorage.getItem('akka_done_summary')); } catch (e) { /* noop */ }

  if (!summary) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('doneNama').textContent = summary.nama;
  document.getElementById('doneAsesmen').textContent = summary.asesmen;
  document.getElementById('doneWaktu').textContent = summary.waktu;

  if (summary.karenaWaktuHabis) {
    document.getElementById('doneIcon').textContent = '⏰';
    document.getElementById('doneTitle').textContent = 'Waktu Habis, Jawaban Terkirim';
    document.getElementById('doneMessage').textContent =
      'Waktu pengerjaan telah habis. Jawabanmu berhasil dikirim secara otomatis. Terima kasih telah mengikuti asesmen.';
  }

  document.getElementById('btnKembaliDashboard').addEventListener('click', function () {
    sessionStorage.removeItem('akka_done_summary');
    sessionStorage.removeItem('akka_selected_assessment');
    window.location.href = 'dashboard.html';
  });
})();
