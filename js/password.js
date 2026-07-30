/* ==========================================================================
   AKKA - password.js
   Validasi kata sandi login siswa
   ========================================================================== */

const AkkaPassword = (function () {
  'use strict';

  /**
   * Memvalidasi kata sandi berdasarkan kelas.
   * @returns {Promise<{valid:boolean}>}
   */
  async function validate(kelas, inputPassword) {
    const password = await AKKA.fetchJSON('data/password.json');

    const passwordInput = (inputPassword || '').trim();

    const match = password.find((p) =>
      String(p.kelas) === String(kelas) &&
      p.password === passwordInput
    );

    if (!match) {
      return { valid: false };
    }

    return { valid: true };
  }

  return {
    validate
  };
})();