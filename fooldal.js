document.addEventListener("DOMContentLoaded", () => {
    loadPortfolio();
    setupScrollTop();
});

function loadPortfolio() {
    const container = document.getElementById("palyak-portfolio");
    
    fetch('../jsonok/palyak.json')
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("palyakData", JSON.stringify(data));
            
            container.innerHTML = "";
            data.forEach(palya => {
                const col = document.createElement("div");
                col.className = "col-md-6 col-lg-4";
                col.innerHTML = `
                    <div class="card card-custom h-100">
                        <img src="${palya.kep}" class="card-img-top" alt="${palya.nev}" style="height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title fw-bold">${palya.nev}</h5>
                            <p class="card-text text-muted mb-2"><i class="bi bi-layers me-1"></i>Típus: ${palya.tipus}</p>
                            <p class="card-text text-muted mb-3"><i class="bi bi-people me-1"></i>Férőhely: ${palya.kapacitas} fő</p>
                            <div class="mt-auto d-flex justify-content-between align-items-center">
                                <span class="fs-5 fw-bold text-success">${palya.oradij.toLocaleString()} Ft / óra</span>
                                <a href="../urlap/urlap.html?palya=${palya.id}" class="btn btn-outline-success btn-sm"><i class="bi bi-calendar-plus me-1"></i>Foglalás</a>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(col);
            });
        })
        .catch(err => console.error("Hiba a pályák betöltésekor:", err));
}

function setupScrollTop() {
    const scrollBtn = document.getElementById("scrollTopBtn");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = "block";
        } else {
            scrollBtn.style.display = "none";
        }
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


// Hívd meg ezt a függvényt a DOMContentLoaded eseménykezelőben:
// loadReviews();

function loadReviews() {
    const container = document.getElementById("visszajelzesek-container");
    if (!container) return;

    // A megjelenítendő vélemények adatai
    const visszajelzesek = [
        {
            nev: "Kovács Dániel",
            szerep: "Amatőr Focicsapat Kapitány",
            ertekeles: 5,
            szoveg: "Rendszeresen járunk ide a csapattal péntek esténként. A műfüves pálya minősége kiváló, az online foglalás pedig pár másodperc az egész!",
            avatar: "https://i.pravatar.cc/100?img=12"
        },
        {
            nev: "Tóth Betti",
            szerep: "Rendszeres Teniszező",
            ertekeles: 5,
            szoveg: "Nagyon tiszták az öltözők és a salakos pálya karbantartása is kifogástalan. Külön tetszik, hogy azonnal látom a szabad időpontokat.",
            avatar: "https://i.pravatar.cc/100?img=47"
        },
        {
            nev: "Szabó Péter",
            szerep: "Céges Bajnokság Szervező",
            ertekeles: 5,
            szoveg: "A cégünk házi bajnokságát szerveztük ide a benti terembe. A büfé és a kiszolgálás is szuper volt, biztosan visszatérünk még!",
            avatar: "https://i.pravatar.cc/100?img=33"
        }
    ];

    container.innerHTML = "";
    
    // Kártyák dinamikus generálása
    visszajelzesek.forEach(v => {
        let csillagok = "";
        for (let i = 0; i < v.ertekeles; i++) {
            csillagok += `<i class="bi bi-star-fill text-warning me-1"></i>`;
        }

        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
            <div class="card card-custom h-100 p-4 border-0 shadow-sm">
                <div class="d-flex align-items-center mb-3">
                    <img src="${v.avatar}" alt="${v.nev}" class="rounded-circle me-3" width="50" height="50">
                    <div>
                        <h6 class="fw-bold mb-0">${v.nev}</h6>
                        <small class="text-muted">${v.szerep}</small>
                    </div>
                </div>
                <div class="mb-3">
                    ${csillagok}
                </div>
                <p class="card-text text-muted fst-italic">"${v.szoveg}"</p>
            </div>
        `;
        container.appendChild(col);
    });
}