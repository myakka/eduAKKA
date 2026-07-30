/* ==========================================================================
   AKKA - security.js (Versi Bebas Warning saat Refresh)
   Mekanisme keamanan & integritas asesmen
   ========================================================================== */

const AkkaSecurity = (function () {
  'use strict';

  // Sembunyikan modal/flag refresh saat halaman mulai dimuat ulang
  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('akka_is_reloading', 'true');
  });

  function requestFullscreen() {
    const el = document.documentElement;
    const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) {
      req.call(el).catch(() => {});
    }
  }

  function renderWatermark(nama, kelas) {
    const wm = document.getElementById('watermark');
    if (!wm) return;
    const label = `${nama} • Kelas ${kelas}`;
    let html = '';
    for (let i = 0; i < 24; i++) html += `<span>${label}</span>`;
    wm.innerHTML = html;
  }

  /**
   * Memantau perpindahan tab/jendela browser.
   * Hanya dipicu jika siswa BENAR-BENAR berpindah tab atau meminimalkan browser,
   * dan mengabaikan aksi Refresh/Reload.
   */
  function watchTabSwitch(onSwitch) {
    // Bersihkan status reloading setelah halaman selesai dimuat sempurna
    setTimeout(function () {
      sessionStorage.removeItem('akka_is_reloading');
    }, 1000);

    // Gunakan murni Page Visibility API (hindari 'blur' karena rentan saat refresh)
    document.addEventListener('visibilitychange', function () {
      const isReloading = sessionStorage.getItem('akka_is_reloading') === 'true';

      // Hanya panggil warning jika halaman tersembunyi DAN bukan karena refresh
      if (document.hidden && !isReloading) {
        if (typeof onSwitch === 'function') {
          onSwitch();
        }
      }
    });
  }

  return { requestFullscreen, renderWatermark, watchTabSwitch };
})();