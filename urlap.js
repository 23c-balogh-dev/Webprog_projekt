let palyakData = [];
let foglalasokData = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadData();
    initFormControls();
    checkUrlParams();
    setupScrollTop();
});

async function loadData() {
    try {
        const palyaRes = await fetch('../jsonok/palyak.json');
        palyakData = await palyaRes.json();

        const localFoglalasok = localStorage.getItem("foglalasokData");
        if (localFoglalasok) {
            foglalasokData = JSON.parse(localFoglalasok);
        } else {
            const foglRes = await fetch('../jsonok/foglalasok.json');
            foglalasokData = await foglRes.json();
        }
    } catch (e) {
        console.error("Hiba az adatok elérésekor:", e);
    }
}

function initFormControls() {
    const palyaSelect = document.getElementById("palyaSelect");
    const kezdioidoSelect = document.getElementById("kezdioido");
    const datumInput = document.getElementById("datum");

    const today = new Date().toISOString().split("T")[0];
    datumInput.min = today;
    datumInput.value = today;

    palyaSelect.innerHTML = '<option value="" disabled selected>Válasszon pályát...</option>';
    palyakData.forEach(p => {
        palyaSelect.add(new Option(`${p.nev} (${p.oradij.toLocaleString()} Ft/óra)`, p.id));
    });

    kezdioidoSelect.innerHTML = '<option value="" disabled selected>Válasszon...</option>';
    for (let i = 8; i <= 21; i++) {
        kezdioidoSelect.add(new Option(`${i}:00`, i));
    }

    ['change', 'input'].forEach(evt => {
        palyaSelect.addEventListener(evt, updateCalculations);
        datumInput.addEventListener(evt, updateCalculations);
        kezdioidoSelect.addEventListener(evt, updateCalculations);
        document.getElementById("idotartam").addEventListener(evt, updateCalculations);
    });

    document.getElementById("foglalasForm").addEventListener("submit", handleSubmit);
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPalya = urlParams.get('palya');
    if (selectedPalya) {
        document.getElementById("palyaSelect").value = selectedPalya;
        updateCalculations();
    }
}

function updateCalculations() {
    const palyaId = document.getElementById("palyaSelect").value;
    const datum = document.getElementById("datum").value;
    const kezdioido = parseInt(document.getElementById("kezdioido").value);
    const idotartam = parseInt(document.getElementById("idotartam").value) || 1;
    const arDisplay = document.getElementById("szamitottAr");

    const palya = palyakData.find(p => p.id === palyaId);
    if (palya && idotartam > 0) {
        arDisplay.textContent = `${(palya.oradij * idotartam).toLocaleString()} Ft`;
    } else {
        arDisplay.textContent = "0 Ft";
    }

    if (palyaId && datum && kezdioido) {
        if (checkConflict(palyaId, datum, kezdioido, idotartam)) {
            showAlert("Figyelem: A kiválasztott pályán a megadott időpontban már van foglalás!", "danger");
        }
    }
}

function checkConflict(palyaId, datum, kezdioido, idotartam) {
    const ujKezdet = kezdioido;
    const ujVeg = kezdioido + idotartam;

    return foglalasokData.some(f => {
        if (f.softDeleted || f.palyaId !== palyaId || f.datum !== datum) return false;
        const fKezdet = f.kezdioido;
        const fVeg = f.kezdioido + parseInt(f.idotartam);
        return (ujKezdet < fVeg && ujVeg > fKezdet);
    });
}

function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        showAlert("Kérjük, töltse ki megfelelően az összes mezőt!", "danger");
        return;
    }

    const palyaId = document.getElementById("palyaSelect").value;
    const datum = document.getElementById("datum").value;
    const kezdioido = parseInt(document.getElementById("kezdioido").value);
    const idotartam = parseInt(document.getElementById("idotartam").value);

    if (checkConflict(palyaId, datum, kezdioido, idotartam)) {
        showAlert("A kiválasztott időpont foglalt! Kérjük, válasszon másik időpontot.", "danger");
        return;
    }

    const palya = palyakData.find(p => p.id === palyaId);
    const ujFoglalas = {
        id: Date.now(),
        palyaId: palyaId,
        nev: document.getElementById("nev").value,
        email: document.getElementById("email").value,
        telefon: document.getElementById("telefon").value,
        datum: datum,
        kezdioido: kezdioido,
        idotartam: idotartam,
        vegosszeg: palya.oradij * idotartam,
        statusz: "Aktiv",
        softDeleted: false
    };

    foglalasokData.push(ujFoglalas);
    localStorage.setItem("foglalasokData", JSON.stringify(foglalasokData));

    showModal(ujFoglalas, palya.nev);

    form.reset();
    form.classList.remove('was-validated');
    document.getElementById("datum").value = new Date().toISOString().split("T")[0];
    document.getElementById("szamitottAr").textContent = "0 Ft";
}

function showModal(foglalas, palyaNev) {
    const content = document.getElementById("visszaigazolasContent");
    content.innerHTML = `
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Azonosító:</strong> #${foglalas.id}</li>
            <li class="list-group-item"><strong>Név:</strong> ${foglalas.nev}</li>
            <li class="list-group-item"><strong>Pálya:</strong> ${palyaNev}</li>
            <li class="list-group-item"><strong>Időpont:</strong> ${foglalas.datum} | ${foglalas.kezdioido}:00 - ${foglalas.kezdioido + foglalas.idotartam}:00</li>
            <li class="list-group-item"><strong>Fizetendő:</strong> <span class="text-success fw-bold">${foglalas.vegosszeg.toLocaleString()} Ft</span></li>
        </ul>
    `;
    new bootstrap.Modal(document.getElementById("visszaigazolasModal")).show();
}

function showAlert(message, type) {
    const container = document.getElementById("alertContainer");
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

function setupScrollTop() {
    const scrollBtn = document.getElementById("scrollTopBtn");
    window.addEventListener("scroll", () => {
        scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}