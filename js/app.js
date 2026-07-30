/* ==========================================================================
   AKKA - app.js
   Namespace global aplikasi + util yang dipakai di seluruh halaman.
   ========================================================================== */

const AKKA = (function () {
  'use strict';

  const SESSION_KEY = 'akka_session';   // identitas siswa (nama, kelas, absen)
  const ATTEMPT_KEY = 'akka_attempt';   // status pengerjaan asesmen yang sedang berjalan

  /* ------------------------- Util Penyimpanan ------------------------- */

  const storage = {
    getSession() {
      try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null; }
      catch (e) { return null; }
    },
    setSession(data) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    },
    clearSession() {
      sessionStorage.removeItem(SESSION_KEY);
    },

    getAttempt() {
      try { return JSON.parse(localStorage.getItem(ATTEMPT_KEY)) || null; }
      catch (e) { return null; }
    },
    setAttempt(data) {
      localStorage.setItem(ATTEMPT_KEY, JSON.stringify(data));
    },
    clearAttempt() {
      localStorage.removeItem(ATTEMPT_KEY);
    }
  };

  /* ------------------------- Util Fetch JSON ------------------------- */

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) throw new Error('Gagal memuat data: ' + path);
    return res.json();
  }

  /* ------------------------- Navigasi Guard ------------------------- */

  function requireSession(redirectTo = 'login.html') {
    const session = storage.getSession();
    if (!session) {
      window.location.href = redirectTo;
      return null;
    }
    return session;
  }

  /* ------------------------- Footer Tahun Otomatis ------------------------- */

  function mountFooterYear() {
    const el = document.getElementById('tahunFooter');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------- Splash Controller ------------------------- */

  const splash = {
    run({ redirectTo, duration }) {
      const el = document.getElementById('splashScreen');
      window.setTimeout(() => {
        if (el) el.classList.add('is-leaving');
        window.setTimeout(() => { window.location.href = redirectTo; }, 480);
      }, duration);
    }
  };

  document.addEventListener('DOMContentLoaded', mountFooterYear);

  return { storage, fetchJSON, requireSession, splash,getTingkatKelas};
  
  function getTingkatKelas(kelas) {
   return String(kelas).trim().charAt(0);
}
})();