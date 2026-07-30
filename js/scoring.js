/* ==========================================================================
   AKKA - scoring.js
   Penilaian otomatis untuk PG, PG Kompleks, Benar/Salah, Menjodohkan.
   Isian Singkat dan Uraian dinilai manual oleh guru (BAB 4.7).
   ========================================================================== */

const AkkaScoring = (function () {
  'use strict';

  function arraysEqualAsSet(a = [], b = []) {
    if (a.length !== b.length) return false;
    const sa = [...a].sort();
    const sb = [...b].sort();
    return sa.every((v, i) => v === sb[i]);
  }

  /**
   * Menilai satu soal berdasarkan jenisnya.
   * @returns {{skor:number, maksimal:number, manual:boolean}}
   */
  function scoreQuestion(soal, jawaban) {
    const bobot = typeof soal.bobot === 'number' ? soal.bobot : 0;

    switch (soal.jenis) {
      case 'pg': {
        const benar = jawaban === soal.kunci;
        return { skor: benar ? bobot : 0, maksimal: bobot, manual: false };
      }

       case 'pg_kompleks': {
        const kunci = soal.kunci || [];
        const jawabanArr = jawaban || [];

        let benarCount = 0;

        kunci.forEach((k) => {
           if (jawabanArr.includes(k)) {
             benarCount++;
           }
        });

        const skor = kunci.length
          ? (bobot * benarCount) / kunci.length
          : 0;

        return { skor, maksimal: bobot, manual: false };
        }

      case 'benar_salah': {
        // Setiap soal berisi beberapa pernyataan; skor dibagi rata per pernyataan
        // lalu dijumlahkan sesuai jumlah pernyataan yang dijawab benar.
        const pernyataan = soal.pernyataan || [];
        const jawabanArr = jawaban || [];
        let benarCount = 0;
        pernyataan.forEach((p, i) => {
          if (jawabanArr[i] === p.kunci) benarCount++;
        });
        const skor = pernyataan.length ? (bobot * benarCount) / pernyataan.length : 0;
        return { skor, maksimal: bobot, manual: false };
      }

      case 'menjodohkan': {
        const pasangan = soal.pasangan || [];
        const jawabanArr = jawaban || [];
        let benarCount = 0;
        pasangan.forEach((p, i) => {
          if (jawabanArr[i] === p.kanan) benarCount++;
        });
        const skor = pasangan.length ? (bobot * benarCount) / pasangan.length : 0;
        return { skor, maksimal: bobot, manual: false };
      }

      case 'isian_singkat':
      case 'uraian':
        return { skor: 0, maksimal: 0, manual: true };

      default:
        return { skor: 0, maksimal: 0, manual: false };
    }
  }

  /**
   * Menghitung total nilai otomatis dari seluruh soal dalam satu paket.
   */
  function scoreAttempt(soalList, jawabanMap) {
    let totalOtomatis = 0;
    let totalMaksimalOtomatis = 0;
    let adaManual = false;

    soalList.forEach((soal) => {
      const hasil = scoreQuestion(soal, jawabanMap[soal.id]);
      if (hasil.manual) {
        adaManual = true;
      } else {
        totalOtomatis += hasil.skor;
        totalMaksimalOtomatis += hasil.maksimal;
      }
    });

    return { totalOtomatis, totalMaksimalOtomatis, adaManual };
  }

  return { scoreQuestion, scoreAttempt };
})();
