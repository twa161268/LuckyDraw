let shuffleInterval = null;
let currentCandidates = [];
let jumlahHadiah = 0;
let currentHadiah = "";
//let shuffleTimer = null;

async function loadHadiah() {
   setUIState("idle");
    const res = await fetch("/api/undian/hadiah");
    const data = await res.json();

    const cb = document.getElementById("cmbHadiah");
    cb.innerHTML = "";
    data.forEach(h => {
        cb.innerHTML += `
            <option value="${h.nomorhadiah}" data-jumlah="${h.jumlahhadiah}">
                ${h.hadiah}
            </option>
        `;
    });
}

async function enroll() {
   
   setUIState("shuffling");

  // ambil nomor undian
    const cb = document.getElementById("cmbHadiah");
    if (!cb.value) {
      alert("Pilih hadiah dulu");
      setUIState("idle");
      return;
    }

    currentHadiah = cb.value;
    jumlahHadiah = cb.selectedOptions[0].dataset.jumlah;

    // cek apakah sudah ada hasil
    const cek = await fetch(`/api/undian/hasil/${currentHadiah}`);
    const hasil = await cek.json();

    if (hasil.length > 0) {
        document.getElementById("status").textContent = "FINAL";
        tampilkanPemenang(hasil);
        setUIState("locked");
        return;
    }

    const res = await fetch("/api/undian/nomor-tersedia");
    currentCandidates = await res.json();

    buatTextbox(jumlahHadiah);

    shuffleInterval = setInterval(() => {
        document.querySelectorAll(".box").forEach(box => {
            box.classList.add("shuffling"); 
            const rnd = currentCandidates[
                Math.floor(Math.random() * currentCandidates.length)
            ];
            box.value = rnd.nomorundian;
            box.dataset.nama = rnd.nama;
        });
    }, 80);
}


async function stopShuffle() {

  clearInterval(shuffleInterval);
  shuffleInterval=null;

  document.querySelectorAll(".box").forEach(b => {
    b.classList.remove("shuffling");
  });

  document.getElementById("status").textContent = "FINAL";

  // kumpulkan pemenang
  const winners = [];
  document.querySelectorAll(".box").forEach(box => {
    winners.push({
      nomorundian: box.value,
      nama: box.dataset.nama
    });
  


  });

  // simpan ke backend
  await fetch("/api/undian/simpan-hasil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nomorHadiah: document.getElementById("cmbHadiah").value,
      winners
    })
  });

  setUIState("locked"); // hadiah ini terkunci
}


function resetAll() {
    fetch("/api/undian/reset", { method: "POST" })
        .then(() => location.reload());
}

// fungsi UI TOMBOL
function setUIState(state) {
  const enrollBtn = document.getElementById("enrollBtn");
  const stopBtn = document.getElementById("stopBtn");
  const cmbHadiah = document.getElementById("cmbHadiah");

  if (state === "idle") {
    enrollBtn.disabled = false;
    stopBtn.disabled = true;
    cmbHadiah.disabled = false;
  }

  if (state === "shuffling") {
    enrollBtn.disabled = true;
    stopBtn.disabled = false;
    cmbHadiah.disabled = true;
  }

  if (state === "locked") {
    enrollBtn.disabled = true;
    stopBtn.disabled = true;
    cmbHadiah.disabled = false;
  }
}

function buatTextbox(jumlah) {
  const pages = document.getElementById("pages");
  pages.innerHTML = "";

  const page = document.createElement("div");
  page.className = "page active";

  const container = document.createElement("div");
  container.className = "box-container";

  for (let i = 0; i < jumlah; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "box";
    input.readOnly = true;
    container.appendChild(input);
  }

  page.appendChild(container);
  pages.appendChild(page);

  document.getElementById("status").textContent = "SHUFFLING...";
}

function tampilkanPemenang(data) {
  buatTextbox(data.length);
  document.querySelectorAll(".box").forEach((box, i) => {
    box.value = data[i].nomorundian;
    box.dataset.nama = data[i].nama;
    box.classList.add("locked");
  });
  document.getElementById("status").textContent = "FINAL";
}

document.addEventListener("DOMContentLoaded", () => {
  loadHadiah();
  setUIState("idle");

  document.getElementById("enrollBtn").addEventListener("click", enroll);
  document.getElementById("stopBtn").addEventListener("click", stopShuffle);
  //document.getElementById("resetBtn").addEventListener("click", resetAll);

  // 🔥 Tambahkan ini
  document.getElementById("cmbHadiah").addEventListener("change", () => {
    setUIState("idle");
    document.getElementById("status").textContent = "READY";
  });

// ==== POPUP KONFIRMASI RESET ==== //
// === CUSTOM MODAL ===
const modal = document.getElementById("resetModal");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const modalOkBtn = document.getElementById("modalOkBtn");
const resetInput = document.getElementById("resetInput");

function showResetModal() {
    resetInput.value = "";
    modal.style.display = "flex"; // tampil
}

function hideResetModal() {
    modal.style.display = "none"; // sembunyikan
}

// buka modal saat klik RESET
document.getElementById("resetBtn").addEventListener("click", showResetModal);

// tombol batal
modalCancelBtn.addEventListener("click", hideResetModal);

// tombol OK
modalOkBtn.addEventListener("click", () => {
    if (resetInput.value.trim().toLowerCase() === "reset ok") {
        hideResetModal();
        resetAll();
    } else {
        alert('Teks tidak sesuai. Ketik "reset ok".');
    }
});

// klik di luar kotak untuk menutup
modal.addEventListener("click", (e) => {
    if (e.target === modal) hideResetModal();
});


});




