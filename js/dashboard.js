/* ==========================================================================
   AKKA - dashboard.js
   Menampilkan daftar asesmen sesuai kelas siswa (BAB 3.6, 4.2, 5.5)
   ========================================================================== */

(function () {
  'use strict';

  const session = AKKA.requireSession('login.html');
  if (!session) return;

  document.getElementById('namaSiswa').textContent = session.nama;
  document.getElementById('kelasSiswa').textContent = 'Kelas ' + session.kelas;
  document.getElementById('userPill').textContent = session.nama + ' • Kelas ' + session.kelas;

  document.getElementById('btnKeluar').addEventListener('click', function () {
    AKKA.storage.clearSession();
    window.location.href = 'login.html';
  });

  const grid = document.getElementById('assessmentGrid');
  const emptyState = document.getElementById('emptyState');

  const ICONS = {
    aktif: '🟢',
    locked: '🔒'
  };

  function renderCard(asesmen) {
    const isAktif = asesmen.status === 'aktif';
    const card = document.createElement('div');
    card.className = 'assessment-card ' + (isAktif ? 'assessment-card--active' : 'assessment-card--locked');

    card.innerHTML = `
      <div class="assessment-card__icon">${isAktif ? '📘' : '🔒'}</div>
      <div class="assessment-card__title">${asesmen.nama}</div>
      <div class="assessment-card__meta">${asesmen.jumlahSoal} soal • ${asesmen.durasiMenit} menit</div>
      <span class="badge ${isAktif ? 'badge--active' : 'badge--locked'}">${isAktif ? 'Aktif' : 'Belum Aktif'}</span>
    `;

    if (isAktif) {
      card.addEventListener('click', function () {
        sessionStorage.setItem('akka_selected_assessment', asesmen.id);
        window.location.href = 'petunjuk.html';
      });
    }

    return card;
  }

  async function init() {
    try {
      const assessments = await AKKA.fetchJSON('data/assessments.json');
      // Ambil nomor kelas saja (5A -> 5, 6D -> 6)
      const kelasUtama = String(session.kelas).trim().charAt(0);

      const forClass = assessments.filter(
         (a) => String(a.kelas).trim() === kelasUtama
      );
      
      if (forClass.length === 0) {
        emptyState.hidden = false;
        return;
      }

      forClass.forEach((a) => grid.appendChild(renderCard(a)));
    } catch (err) {
      console.error(err);
      emptyState.hidden = false;
      emptyState.textContent = 'Terjadi kesalahan memuat daftar asesmen.';
    }
  }

  init();
})();
