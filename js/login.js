/* ==========================================================================
   AKKA - login.js
   Menangani validasi dan submit form Login (BAB 3.5, 4.5, 5.4)
   ========================================================================== */

(function () {
  'use strict';

  const form = document.getElementById('loginForm');
  const inputNama = document.getElementById('inputNama');
  const inputKelas = document.getElementById('inputKelas');
  const inputAbsen = document.getElementById('inputAbsen');
  const inputPassword = document.getElementById('inputPassword');

  function showError(id, message) {
    const el = document.getElementById(id);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    ['errNama', 'errKelas', 'errAbsen', 'errPassword'].forEach((id) => showError(id, ''));
  }

async function validate() {
    clearErrors();
    let valid = true;

    if (!inputNama.value.trim()) {
      showError('errNama', 'Nama wajib diisi.');
      valid = false;
    }
    if (!inputKelas.value) {
      showError('errKelas', 'Pilih kelas terlebih dahulu.');
      valid = false;
    }
    const absen = Number(inputAbsen.value);
    if (!inputAbsen.value || absen < 1) {
      showError('errAbsen', 'Nomor absen wajib diisi.');
      valid = false;
    }
    
    // Validasi Password
    const passInput = inputPassword.value.trim();
    if (!passInput) {
      showError('errPassword', 'Masukkan Kata Sandi.');
      valid = false;
    } else {
      try {
        // Memakai fungsi bawaan AKKA.fetchJSON dari app.js
        const data = await AKKA.fetchJSON('data/password.json');
        let passBenar = null;

        if (data.password) {
          passBenar = String(data.password);
        } else if (Array.isArray(data)) {
          const akun = data.find(item => String(item.kelas) === String(inputKelas.value));
          if (akun) passBenar = String(akun.password);
        }

        if (!passBenar || passInput !== passBenar) {
          showError('errPassword', 'Kata Sandi salah!');
          valid = false;
        }
      } catch (err) {
        // Tampil jika file tidak ditemukan atau dibuka tanpa Live Server / GitHub Pages
        showError('errPassword', 'Gagal memuat password. Gunakan Live Server atau upload ke GitHub Pages.');
        valid = false;
      }
    }

    return valid; 
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    
    // Tunggu pengecekan password.json selesai
    const isValid = await validate();
    if (!isValid) return;

    AKKA.storage.setSession({
      nama: inputNama.value.trim(),
      kelas: inputKelas.value,
      absen: Number(inputAbsen.value),
      password: inputPassword.value,
      loginAt: new Date().toISOString()
    });

    window.location.href = 'dashboard.html';
  });

  // Jika sudah login sebelumnya (mis. kembali dari dashboard), kosongkan sesi lama
  // agar identitas selalu diisi ulang sesuai keputusan siswa saat ini.
})();