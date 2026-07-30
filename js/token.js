/* ==========================================================================
   AKKA - token.js
   Validasi token asesmen dan penentuan paket soal (BAB 3.8, 4.4, 6.6)
   ========================================================================== */

const AkkaToken = (function () {
  'use strict';

  /**
   * Memvalidasi token yang dimasukkan siswa.
   * Token hanya berlaku untuk kelas & asesmen yang sesuai (BAB 3.8).
   * @returns {Promise<{valid:boolean, paket?:string}>}
   */
  async function validate(assessmentId, kelas, inputToken) {
    const tokens = await AKKA.fetchJSON('data/tokens.json');
    const tokenUpper = (inputToken || '').trim().toUpperCase();

    const match = tokens.find((t) =>
      t.assessmentId === assessmentId &&
      String(t.kelas).trim() === AKKA.getTingkatKelas(kelas) &&
      t.token.trim().toUpperCase() === tokenUpper &&
      t.statusAktif===true
    );

    if (!match) return { valid: false };
    return { valid: true, paket: match.paket };
  }

  return { validate };
})();
