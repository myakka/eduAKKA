/* ==========================================================================
   AKKA - timer.js
   Timer hitung mundur berbasis waktu absolut (endAt) agar tetap akurat
   walau siswa menutup/membuka kembali halaman (BAB 3.13, 4.16).
   ========================================================================== */

const AkkaTimer = (function () {
  'use strict';

  let intervalId = null;

  function format(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  /**
   * @param {number} endAt - timestamp (ms) waktu asesmen berakhir
   * @param {(remainingMs:number)=>void} onTick
   * @param {()=>void} onTimeUp - dipanggil sekali saat waktu habis
   */
  function start(endAt, onTick, onTimeUp) {
    stop();
    intervalId = window.setInterval(() => {
      const remaining = endAt - Date.now();
      onTick(remaining);
      if (remaining <= 0) {
        stop();
        onTimeUp();
      }
    }, 1000);
    // Tick pertama langsung, tidak menunggu 1 detik
    onTick(endAt - Date.now());
  }

  function stop() {
    if (intervalId) { window.clearInterval(intervalId); intervalId = null; }
  }

  return { start, stop, format };
})();
