/* ==========================================================================
   AKKA - autosave.js
   Menyimpan jawaban siswa secara otomatis setiap kali memilih/mengubah
   jawaban atau berpindah soal, tanpa perlu tombol simpan (BAB 4.11).
   ========================================================================== */

const AkkaAutosave = (function () {
  'use strict';

  /**
   * @param {number} nomorSoal
   * @param {*} jawaban - bentuk jawaban tergantung jenis soal
   */
  function saveAnswer(nomorSoal, jawaban) {
    const attempt = AKKA.storage.getAttempt();
    if (!attempt) return;
    attempt.jawaban[nomorSoal] = jawaban;
    attempt.lastSavedAt = new Date().toISOString();
    AKKA.storage.setAttempt(attempt);
  }

  function getAnswer(nomorSoal) {
    const attempt = AKKA.storage.getAttempt();
    if (!attempt) return undefined;
    return attempt.jawaban[nomorSoal];
  }

  function recordTabSwitch() {
    const attempt = AKKA.storage.getAttempt();
    if (!attempt) return 0;
    attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
    AKKA.storage.setAttempt(attempt);
    return attempt.tabSwitchCount;
  }

  return { saveAnswer, getAnswer, recordTabSwitch };
})();
