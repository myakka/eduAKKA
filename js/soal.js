/* ==========================================================================
   AKKA - soal.js
   Controller utama halaman pengerjaan soal: render soal, navigasi,
   progress, timer, autosave, keamanan, dan pengiriman jawaban.
   (BAB 3.9 - 3.13, 4.9 - 4.19, 5.7 - 5.9)
   ========================================================================== */

(function () {
  'use strict';

  const attempt = AKKA.storage.getAttempt();
  if (!attempt || attempt.submitted) {
    window.location.href = 'dashboard.html';
    return;
  }
    
  const JENIS_LABEL = {
    pg: 'Pilihan Ganda',
    pg_kompleks: 'Pilihan Ganda Kompleks',
    benar_salah: 'Benar/Salah',
    menjodohkan: 'Menjodohkan',
    isian_singkat: 'Isian Singkat',
    uraian: 'Uraian'
  };

  let soalList = [];
  let currentIndex = 0;

  const el = {
    questionBody: document.getElementById('questionBody'),
    questionNumber: document.getElementById('questionNumber'),
    questionTotal: document.getElementById('questionTotal'),
    questionTypeBadge: document.getElementById('questionTypeBadge'),
    examNamaAsesmen: document.getElementById('examNamaAsesmen'),
    timerText: document.getElementById('timerText'),
    timerBadge: document.getElementById('timerBadge'),
    progressText: document.getElementById('progressText'),
    questionGrid: document.getElementById('questionGrid'),
    btnPrev: document.getElementById('btnPrev'),
    btnNext: document.getElementById('btnNext'),
    btnSelesai: document.getElementById('btnSelesai'),
    modalKonfirmasi: document.getElementById('modalKonfirmasi'),
    btnBatalSelesai: document.getElementById('btnBatalSelesai'),
    btnKirimJawaban: document.getElementById('btnKirimJawaban'),
    modalWarning: document.getElementById('modalWarning'),
    warningText: document.getElementById('warningText'),
    btnTutupWarning: document.getElementById('btnTutupWarning')
  };

  /* ------------------------- Inisialisasi Halaman ------------------------- */

  el.examNamaAsesmen.textContent = attempt.assessmentNama;
  AkkaSecurity.renderWatermark(attempt.nama, attempt.kelas);
  AkkaSecurity.requestFullscreen();

  AkkaSecurity.watchTabSwitch(function () {
    const count = AkkaAutosave.recordTabSwitch();
    el.warningText.textContent =
      `Sistem mendeteksi kamu berpindah tab/aplikasi (ke-${count}). Aktivitas ini telah dicatat.`;
    el.modalWarning.hidden = false;
  });

  if (el.btnTutupWarning) {
  el.btnTutupWarning.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation(); // 👈 Mencegah klik tertahan/terhalang layer background
    if (el.modalWarning) {
      el.modalWarning.hidden = true;
      el.modalWarning.style.display = 'none'; // 👈 Memaksa modal benar-benar hilang dari layar
    }
  });
}

  /* ------------------------- Render Soal ------------------------- */

  function renderQuestionGrid() {
    el.questionGrid.innerHTML = '';
    soalList.forEach((soal, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'q-nav-btn';
      btn.textContent = i + 1;
      if (i === currentIndex) btn.classList.add('is-current');
      else if (isAnswered(soal.id)) btn.classList.add('is-done');
      btn.addEventListener('click', () => goToIndex(i));
      el.questionGrid.appendChild(btn);
    });
  }

  function isAnswered(soalId) {
    const jawaban = attempt.jawaban[soalId];
    if (jawaban === undefined || jawaban === null) return false;
    if (Array.isArray(jawaban)) return jawaban.some((v) => v !== null && v !== undefined && v !== '');
    if (typeof jawaban === 'string') return jawaban.trim() !== '';
    return true;
  }

  function updateProgress() {
    const total = soalList.length;
    const answered = soalList.filter((s) => isAnswered(s.id)).length;
    el.progressText.textContent = `${answered}/${total} dijawab`;
  }

  function renderCurrentQuestion() {
    const soal = soalList[currentIndex];
    el.questionNumber.textContent = currentIndex + 1;
    el.questionTotal.textContent = soalList.length;
    el.questionTypeBadge.textContent = JENIS_LABEL[soal.jenis] || soal.jenis;

    el.questionBody.innerHTML = buildQuestionHTML(soal);
    attachQuestionEvents(soal);

    el.btnPrev.disabled = currentIndex === 0;
    el.btnNext.textContent = currentIndex === soalList.length - 1 ? 'Selesai →' : 'Berikutnya →';

    renderQuestionGrid();
    updateProgress();
  }

  function buildQuestionHTML(soal) {
    const jawabanSaved = attempt.jawaban[soal.id];
    let html = `<p class="soal-pertanyaan">${soal.pertanyaan || ''}</p>`;

    switch (soal.jenis) {
      case 'pg':
        html += '<div class="option-list">' + (soal.opsi || []).map((opsi, i) => `
          <label class="option-item ${jawabanSaved === i ? 'is-selected' : ''}">
            <input type="radio" name="opsiPG" value="${i}" ${jawabanSaved === i ? 'checked' : ''} />
            <span>${opsi}</span>
          </label>`).join('') + '</div>';
        break;

      case 'pg_kompleks': {
        const selected = Array.isArray(jawabanSaved) ? jawabanSaved : [];
        html += '<div class="option-list">' + (soal.opsi || []).map((opsi, i) => `
          <label class="option-item ${selected.includes(i) ? 'is-selected' : ''}">
            <input type="checkbox" name="opsiPGK" value="${i}" ${selected.includes(i) ? 'checked' : ''} />
            <span>${opsi}</span>
          </label>`).join('') + '</div>';
        break;
      }

      case 'benar_salah': {
        const jawabanArr = Array.isArray(jawabanSaved) ? jawabanSaved : [];
        html += '<div class="statement-list">' + (soal.pernyataan || []).map((p, i) => `
          <div class="statement-item" data-index="${i}">
            <div class="statement-item__text">${i + 1}. ${p.teks}</div>
            <div class="statement-item__choices">
              <button type="button" class="choice-pill choice-benar ${jawabanArr[i] === 'benar' ? 'is-selected-benar' : ''}" data-value="benar">Benar</button>
              <button type="button" class="choice-pill choice-salah ${jawabanArr[i] === 'salah' ? 'is-selected-salah' : ''}" data-value="salah">Salah</button>
            </div>
          </div>`).join('') + '</div>';
        break;
      }

      case 'menjodohkan': {
        const jawabanArr = Array.isArray(jawabanSaved) ? jawabanSaved : [];
        const opsiKanan = (soal.pasangan || []).map((p) => p.kanan);
        html += '<div class="match-wrap">' + (soal.pasangan || []).map((p, i) => `
          <div class="match-row">
            <div class="match-row__left">${p.kiri}</div>
            <div class="match-row__arrow">→</div>
            <select class="form-control match-select" data-index="${i}">
              <option value="">Pilih pasangan</option>
              ${opsiKanan.map((k) => `<option value="${k}" ${jawabanArr[i] === k ? 'selected' : ''}>${k}</option>`).join('')}
            </select>
          </div>`).join('') + '</div>';
        break;
      }

      case 'isian_singkat':
        html += `<input type="text" class="input-singkat" id="jawabanIsian" placeholder="Ketik jawabanmu" value="${jawabanSaved || ''}" />`;
        break;

      case 'uraian':
        html += `<textarea class="textarea-answer" id="jawabanUraian" placeholder="Tulis jawabanmu di sini">${jawabanSaved || ''}</textarea>`;
        break;
    }

    return html;
  }

  function attachQuestionEvents(soal) {
    switch (soal.jenis) {
      case 'pg':
        el.questionBody.querySelectorAll('input[name="opsiPG"]').forEach((input) => {
          input.addEventListener('change', function () {
            const value = Number(this.value);
            attempt.jawaban[soal.id] = value;
            AkkaAutosave.saveAnswer(soal.id, value);
            renderCurrentQuestion();
          });
        });
        break;

      case 'pg_kompleks':
        el.questionBody.querySelectorAll('input[name="opsiPGK"]').forEach((input) => {
          input.addEventListener('change', function () {
            const checked = Array.from(el.questionBody.querySelectorAll('input[name="opsiPGK"]:checked'))
              .map((i) => Number(i.value));
            attempt.jawaban[soal.id] = checked;
            AkkaAutosave.saveAnswer(soal.id, checked);
            renderCurrentQuestion();
          });
        });
        break;

      case 'benar_salah':
        el.questionBody.querySelectorAll('.choice-pill').forEach((btn) => {
          btn.addEventListener('click', function () {
            const idx = Number(this.closest('.statement-item').dataset.index);
            const value = this.dataset.value;
            const jawabanArr = Array.isArray(attempt.jawaban[soal.id]) ? attempt.jawaban[soal.id].slice() : [];
            jawabanArr[idx] = value;
            attempt.jawaban[soal.id] = jawabanArr;
            AkkaAutosave.saveAnswer(soal.id, jawabanArr);
            renderCurrentQuestion();
          });
        });
        break;

      case 'menjodohkan':
        el.questionBody.querySelectorAll('.match-select').forEach((select) => {
          select.addEventListener('change', function () {
            const idx = Number(this.dataset.index);
            const jawabanArr = Array.isArray(attempt.jawaban[soal.id]) ? attempt.jawaban[soal.id].slice() : [];
            jawabanArr[idx] = this.value;
            attempt.jawaban[soal.id] = jawabanArr;
            AkkaAutosave.saveAnswer(soal.id, jawabanArr);
            updateProgress();
            renderQuestionGrid();
          });
        });
        break;

      case 'isian_singkat': {
        const input = document.getElementById('jawabanIsian');
        input.addEventListener('input', function () {
          attempt.jawaban[soal.id] = this.value;
          AkkaAutosave.saveAnswer(soal.id, this.value);
          updateProgress();
          renderQuestionGrid();
        });
        break;
      }

      case 'uraian': {
        const textarea = document.getElementById('jawabanUraian');
        textarea.addEventListener('input', function () {
          attempt.jawaban[soal.id] = this.value;
          AkkaAutosave.saveAnswer(soal.id, this.value);
          updateProgress();
          renderQuestionGrid();
        });
        break;
      }
    }
  }

  function goToIndex(i) {
    if (i < 0 || i >= soalList.length) return;
    currentIndex = i;
    renderCurrentQuestion();
  }

  /* ------------------------- Navigasi ------------------------- */

  el.btnPrev.addEventListener('click', () => goToIndex(currentIndex - 1));

  el.btnNext.addEventListener('click', () => {
    if (currentIndex === soalList.length - 1) {
      openConfirmModal();
    } else {
      goToIndex(currentIndex + 1);
    }
  });

  /* ------------------------- Konfirmasi & Pengiriman ------------------------- */

  function openConfirmModal() { el.modalKonfirmasi.hidden = false; }
  function closeConfirmModal() { el.modalKonfirmasi.hidden = true; }

  el.btnSelesai.addEventListener('click', openConfirmModal);
  el.btnBatalSelesai.addEventListener('click', closeConfirmModal);
  el.btnKirimJawaban.addEventListener('click', () => submitAttempt(false));

  async function submitAttempt(isTimeUp) {
    AkkaTimer.stop();
    closeConfirmModal();

    const { totalOtomatis, totalMaksimalOtomatis, adaManual } = AkkaScoring.scoreAttempt(soalList, attempt.jawaban);

    attempt.submitted = true;
    attempt.submittedAt = new Date().toISOString();
    attempt.nilaiOtomatis = totalOtomatis;
    attempt.nilaiMaksimalOtomatis = totalMaksimalOtomatis;
    attempt.adaPenilaianManual = adaManual;
    attempt.karenaWaktuHabis = !!isTimeUp;
    AKKA.storage.setAttempt(attempt);

    try {
      const config = await AKKA.fetchJSON('data/config.json');
      if (config.appsScriptUrl && !config.appsScriptUrl.includes('GANTI_')) {
        await fetch(config.appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(attempt)
        });
      }
    } catch (err) {
      // Kegagalan kirim ke Google Sheets tidak menghentikan alur siswa;
      // data tetap tersimpan pada attempt (localStorage) untuk dikirim ulang oleh guru bila perlu.
      console.error('Gagal mengirim ke Apps Script:', err);
    }

    sessionStorage.setItem('akka_done_summary', JSON.stringify({
      nama: attempt.nama,
      asesmen: attempt.assessmentNama,
      waktu: new Date().toLocaleString('id-ID'),
      karenaWaktuHabis: !!isTimeUp
    }));

    AKKA.storage.clearAttempt();
    window.location.href = 'selesai.html';
  }

  /* ------------------------- Timer ------------------------- */

  AkkaTimer.start(attempt.endAt, function (remaining) {
    el.timerText.textContent = AkkaTimer.format(remaining);
    el.timerBadge.classList.toggle('is-critical', remaining <= 5 * 60 * 1000);
  }, function () {
    submitAttempt(true);
  });

  /* ------------------------- Muat Bank Soal ------------------------- */

  async function init() {
    try {
      const path = `data/questions/${attempt.assessmentId}-paket${attempt.paket}.json`;
      const data = await AKKA.fetchJSON(path);
      soalList = data.soal || [];
      renderCurrentQuestion();
    } catch (err) {
      console.error(err);
      el.questionBody.innerHTML = '<p>Gagal memuat soal. Silakan hubungi guru.</p>';
    }
  }

  init();
})();
