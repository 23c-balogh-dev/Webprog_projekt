function UrlapBetoltes() {
    // form elem létrehozása
    const urlap = document.createElement("form");
    urlap.id = "idopontForm";

    // a név beírásához
    const nevLabel = document.createElement("label");
    nevLabel.textContent = "Teljes név: ";
    const nevInput = document.createElement("input");
    nevInput.type = "text";
    nevInput.name = "nev";
    nevInput.id = "nev";
    nevInput.required = true;
    nevInput.minLength = 3;
    nevLabel.appendChild(document.createElement("br"));
    nevLabel.appendChild(nevInput);

    // az email
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "E-mail cím: ";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.id = "email";
    emailInput.required = true;
    emailLabel.appendChild(document.createElement("br"));
    emailLabel.appendChild(emailInput);

    // a telefonszám
    const telLabel = document.createElement("label");
    telLabel.textContent = "Telefonszám: ";
    const telInput = document.createElement("input");
    telInput.type = "tel";
    telInput.name = "telefon";
    telInput.id = "telefon";
    telInput.placeholder = "+36301234567";
    telInput.required = true;
    telLabel.appendChild(document.createElement("br"));
    telLabel.appendChild(telInput);

    // a szolgáltatás kiválasztása gördülőmenüből
    const szolgalatLabel = document.createElement("label");
    szolgalatLabel.textContent = "Választott szolgáltatás: ";
    const szolgalatSelect = document.createElement("select");
    szolgalatSelect.name = "szolgaltatas";
    szolgalatSelect.id = "szolgaltatas";
    szolgalatSelect.required = true;

    const opciok = [
        "Kinti focipálya",
        "Kosár pálya",
        "Benti focipálya",
        "Darts",
        "Csocsó"
    ];

    opciok.forEach(opcioSzoveg => {
        const opcio = document.createElement("option");
        opcio.value = opcioSzoveg;
        opcio.textContent = opcioSzoveg;
        szolgalatSelect.appendChild(opcio);
    });

    szolgalatLabel.appendChild(document.createElement("br"));
    szolgalatLabel.appendChild(szolgalatSelect);

    // a dátum kiválasztása
    const datumLabel = document.createElement("label");
    datumLabel.textContent = "Foglalás dátuma: ";
    const datumInput = document.createElement("input");
    datumInput.type = "date";
    datumInput.name = "datum";
    datumInput.id = "datum";
    datumInput.required = true;

    // minimum dátum beállítása (a mai napnál korábbit ne lehessen választani)
    const ma = new Date().toISOString().split("T")[0];
    datumInput.min = ma;
    datumLabel.appendChild(document.createElement("br"));
    datumLabel.appendChild(datumInput);

    // megjegyzés
    const megjegyzesLabel = document.createElement("label");
    megjegyzesLabel.textContent = "Megjegyzés / Részletek: ";
    const megjegyzesTextarea = document.createElement("textarea");
    megjegyzesTextarea.name = "megjegyzes";
    megjegyzesTextarea.id = "megjegyzes";
    megjegyzesTextarea.rows = 4;
    megjegyzesLabel.appendChild(document.createElement("br"));
    megjegyzesLabel.appendChild(megjegyzesTextarea);

    // küldés gomb
    const kuldesGomb = document.createElement("input");
    kuldesGomb.type = "submit";
    kuldesGomb.value = "Időpont lefoglalása";

    // az elemek hozzáadása a formhoz (formázhatóság miatt mindegyik után tehetünk sortörést vagy csomagolhatjuk div-be)
    const elemek = [nevLabel, emailLabel, telLabel, szolgalatLabel, datumLabel, megjegyzesLabel];
    elemek.forEach(elem => {
        const div = document.createElement("div");
        div.style.marginBottom = "15px";
        div.appendChild(elem);
        urlap.appendChild(div);
    });
    urlap.appendChild(kuldesGomb);

    // űrlap beküldése és mentése
    urlap.addEventListener("submit", function (event) {
        event.preventDefault(); // lap újratöltését megakadályozza

        const foglalasAdatok = {
            nev: document.getElementById("nev").value,
            email: document.getElementById("email").value,
            telefon: document.getElementById("telefon").value,
            szolgaltatas: document.getElementById("szolgaltatas").value,
            datum: document.getElementById("datum").value,
            megjegyzes: document.getElementById("megjegyzes").value
        };

        // elmenti az adatokat
        localStorage.setItem("idopontFoglalas", JSON.stringify(foglalasAdatok));

        // átirányít a visszaigazoló oldalra
        window.location.href = "visszaigazolo.html";
    });

    // az űrlap elhelyezése a DOM-ban
    const container = document.getElementById("urlap-container");
    if (container) {
        container.appendChild(urlap);
    } else {
        document.body.appendChild(urlap);
    }
}
