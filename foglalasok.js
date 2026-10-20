let foglalasokData = [];
let palyakData = [];
let sortColumn = 'datum';
let sortAsc = true;

document.addEventListener("DOMContentLoaded", async () => {
    await loadInitialData();
    initControls();
    renderFoglalasok();
    setupScrollTop();
});

async function loadInitialData() {
    try {
        const palyaRes = await fetch('../jsonok/palyak.json');
        palyakData = await palyaRes.json();

        const localFoglalasok = localStorage.getItem("foglalasokData");
        if (localFoglalasok) {
            foglalasokData = JSON.parse(localFoglalasok);
        } else {
            const foglRes = await fetch('../jsonok/foglalasok.json');
            foglalasokData = await foglRes.json();
            localStorage.setItem("foglalasokData", JSON.stringify(foglalasokData));
        }

        const filterSelect = document.getElementById("filterPalya");
        palyakData.forEach(p => {
            filterSelect.add(new Option(p.nev, p.id));
        });
    } catch (e) {
        console.error("Adatbetöltési hiba:", e);
    }
}

function getFilteredFoglalasok() {
    const palyaFilter = document.getElementById("filterPalya").value;
    const searchVal = document.getElementById("searchNev").value.toLowerCase().trim();

    return foglalasokData.filter(item => {
        if (item.softDeleted) return false;
        
        const matchesPalya = !palyaFilter || item.palyaId == palyaFilter;
        const matchesSearch = !searchVal || 
            item.nev.toLowerCase().includes(searchVal) || 
            item.email.toLowerCase().includes(searchVal);

        return matchesPalya && matchesSearch;
    });
}

function renderFoglalasok() {
    const filtered = getFilteredFoglalasok();

    filtered.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (sortColumn === 'palyaNev') {
            valA = getPalyaName(a.palyaId);
            valB = getPalyaName(b.palyaId);
        }

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
    });

    const tbody = document.getElementById("foglalasokTableBody");
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">Nincs találat.</td></tr>`;
    } else {
        filtered.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="fw-bold">${item.nev}<br><small class="text-muted fw-normal">${item.email}</small></td>
                <td><span class="badge badge-sport p-2">${getPalyaName(item.palyaId)}</span></td>
                <td>${item.datum}</td>
                <td>${item.kezdioido}:00 - ${item.kezdioido + parseInt(item.idotartam)}:00 (${item.idotartam} óra)</td>
                <td class="fw-bold text-success">${item.vegosszeg.toLocaleString()} Ft</td>
                <td><span class="badge bg-success">Megerősítve</span></td>
                <td class="text-end">
                    <button onclick="softDeleteFoglalas(${item.id})" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i> Törlés
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const cardsContainer = document.getElementById("cardsView");
    cardsContainer.innerHTML = "";

    if (filtered.length === 0) {
        cardsContainer.innerHTML = `<div class="col-12 text-center py-4 text-muted">Nincs találat.</div>`;
    } else {
        filtered.forEach(item => {
            const col = document.createElement("div");
            col.className = "col-md-6 col-lg-4";
            col.innerHTML = `
                <div class="card card-custom h-100 p-3">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold mb-0">${item.nev}</h5>
                        <span class="badge badge-sport">${getPalyaName(item.palyaId)}</span>
                    </div>
                    <p class="text-muted small mb-2"><i class="bi bi-envelope me-1"></i>${item.email} | <i class="bi bi-telephone me-1"></i>${item.telefon}</p>
                    <hr class="my-2">
                    <div class="mb-2">
                        <div><i class="bi bi-calendar-event me-2 text-success"></i>Dátum: <strong>${item.datum}</strong></div>
                        <div><i class="bi bi-clock me-2 text-success"></i>Időpont: <strong>${item.kezdioido}:00 - ${item.kezdioido + parseInt(item.idotartam)}:00</strong></div>
                    </div>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                        <span class="fs-5 fw-bold text-success">${item.vegosszeg.toLocaleString()} Ft</span>
                        <button onclick="softDeleteFoglalas(${item.id})" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash me-1"></i> Törlés
                        </button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(col);
        });
    }
}

function getPalyaName(id) {
    const p = palyakData.find(x => x.id === id);
    return p ? p.nev : id;
}

function softDeleteFoglalas(id) {
    const index = foglalasokData.findIndex(item => item.id === id);
    if (index !== -1) {
        foglalasokData[index].softDeleted = true;
        localStorage.setItem("foglalasokData", JSON.stringify(foglalasokData));
        renderFoglalasok();
        showAlert(`A(z) #${id} foglalás törölve lett (soft delete).`, 'warning');
    }
}

function initControls() {
    document.getElementById("filterPalya").addEventListener("change", renderFoglalasok);
    document.getElementById("searchNev").addEventListener("input", renderFoglalasok);

    document.getElementById("sortNev").addEventListener("click", () => handleSort('nev'));
    document.getElementById("sortPalya").addEventListener("click", () => handleSort('palyaNev'));
    document.getElementById("sortDatum").addEventListener("click", () => handleSort('datum'));

    document.getElementById("btnViewTable").addEventListener("click", () => {
        document.getElementById("tableView").classList.remove("d-none");
        document.getElementById("cardsView").classList.add("d-none");
        document.getElementById("btnViewTable").classList.add("active");
        document.getElementById("btnViewCards").classList.remove("active");
    });

    document.getElementById("btnViewCards").addEventListener("click", () => {
        document.getElementById("tableView").classList.add("d-none");
        document.getElementById("cardsView").classList.remove("d-none");
        document.getElementById("btnViewCards").classList.add("active");
        document.getElementById("btnViewTable").classList.remove("active");
    });
}

function handleSort(col) {
    if (sortColumn === col) {
        sortAsc = !sortAsc;
    } else {
        sortColumn = col;
        sortAsc = true;
    }
    renderFoglalasok();
}

function showAlert(message, type) {
    const container = document.getElementById("alertContainer");
    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-info-circle-fill me-2"></i>${message}
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