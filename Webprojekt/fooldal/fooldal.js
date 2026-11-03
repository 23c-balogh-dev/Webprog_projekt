// fooldal.js - A főoldal teljes, javított JavaScript logikája

document.addEventListener("DOMContentLoaded", () => {
    loadPortfolio();
    loadReviews();
    setupScrollTop();
});

// 1. PÁLYÁK PORTFÓLIÓJÁNAK BETÖLTÉSE JSON-BŐL
function loadPortfolio() {
    const container = document.getElementById("palyak-portfolio");
    if (!container) return; // Biztonsági ellenőrzés
    
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

// 2. EDDIGI VISSZAJELZÉSEK DINAMIKUS GENERÁLÁSA JAVÍTOTT KÉPEKKEL ÉS CSILLAGOKKAL
function loadReviews() {
    const container = document.getElementById("visszajelzesek-container");
    if (!container) return; // Biztonsági ellenőrzés

    // A megjelenítendő vélemények adatai (Valódi, működő képlinkekkel és eltérő értékelésekkel)
    const visszajelzesek = [
        {
            nev: "Kovács Dániel",
            szerep: "Amatőr Focicsapat Kapitány",
            ertekeles: 5, // 5 teli csillag
            szoveg: "Rendszeresen járunk ide a csapattal péntek esténként. A műfüves pálya minősége kiváló, az online foglalás pedig pár másodperc az egész!",
            avatar: "https://i.pravatar.cc/150?img=3"
        },
        {
            nev: "Tóth Betti",
            szerep: "Rendszeres Teniszező",
            ertekeles: 4, // 4 teli csillag, 1 üres csillag
            szoveg: "Nagyon tiszták az öltözők és a salakos pálya karbantartása is kifogástalan. Külön tetszik, hogy azonnal látom a szabad időpontokat.",
            avatar: "https://i.pravatar.cc/150?img=5"
        },
        {
            nev: "Szabó Péter",
            szerep: "Céges Bajnokság Szervező",
            ertekeles: 5, // 5 teli csillag
            szoveg: "A cégünk házi bajnokságát szerveztük ide a benti terembe. A büfé és a kiszolgálás is szuper volt, biztosan visszatérünk még!",
            avatar: "https://i.pravatar.cc/150?img=7"
        }
    ];

    container.innerHTML = "";
    
    // Kártyák dinamikus generálása
    visszajelzesek.forEach(v => {
        let csillagHtml = "";
        
        // 1. Teli sárga csillagok kirakása az értékelés alapján
        for (let i = 0; i < v.ertekeles; i++) {
            csillagHtml += `<i class="bi bi-star-fill text-warning me-1"></i>`;
        }
        
        // 2. A maradék helyek feltöltése üres szürke csillagokkal (hogy mindig 5 csillagból látszódjon)
        for (let i = v.ertekeles; i < 5; i++) {
            csillagHtml += `<i class="bi bi-star text-muted me-1"></i>`;
        }

        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
            <div class="card card-custom h-100 p-4 border-0">
                <div class="d-flex align-items-center mb-3">
                    <img src="${v.avatar}" alt="${v.nev}" class="rounded-circle me-3" width="50" height="50" style="object-fit: cover; border: 2px solid var(--accent-color);">
                    <div>
                        <h6 class="fw-bold mb-0">${v.nev}</h6>
                        <small class="text-muted small">${v.szerep}</small>
                    </div>
                </div>
                <div class="mb-3">
                    ${csillagHtml}
                </div>
                <p class="card-text text-muted fst-italic mb-0">"${v.szoveg}"</p>
            </div>
        `;
        container.appendChild(col);
    });
}

// 3. OLDAL TETEJÉRE JUGATÓ GOMB LOGIKÁJA
function setupScrollTop() {
    const scrollBtn = document.getElementById("scrollTopBtn");
    if (!scrollBtn) return;

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
