document.addEventListener("DOMContentLoaded", () => {
    UrlapBetoltes();
});

function UrlapBetoltes() {
    const urlap = document.createElement("form");
    urlap.id = "idopontForm";

    const nevLabel = document.createElement("label");
    nevLabel.textContent = "Teljes név: ";
    const nevInput = document.createElement("input");
    nevInput.type = "text";
    nevInput.id = "nev";
    nevInput.required = true;
    nevInput.minLength = 3;
    nevLabel.appendChild(nevInput);

    const emailLabel = document.createElement("label");
    emailLabel.textContent = "E-mail cím: ";
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email";
    emailInput.required = true;
    emailLabel.appendChild(emailInput);

    const telLabel = document.createElement("label");
    telLabel.textContent = "Telefonszám: ";
    const telInput = document.createElement("input");
    telInput.type = "tel";
    telInput.id = "telefon";
    telInput.placeholder = "+36301234567";
    telInput.required = true;
    telLabel.appendChild(telInput);

    const szolgalatLabel = document.createElement("label");
    szolgalatLabel.textContent = "Választott pálya: ";
    const szolgalatSelect = document.createElement("select");
    szolgalatSelect.id = "szolgaltatas";
    szolgalatSelect.required = true;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Válassz pályát!";
    defaultOption.selected = true;
    defaultOption.disabled = true;
    szolgalatSelect.appendChild(defaultOption);

    const palyak = [
        { nev: "Kinti focipálya", ar: 8000 },
        { nev: "Kosár pálya", ar: 6000 },
        { nev: "Benti focipálya", ar: 10000 },
        { nev: "Darts", ar: 3000 },
        { nev: "Csocsó", ar: 2500 }
    ];

    palyak.forEach(palyi => {
        const opcio = document.createElement("option");
        opcio.value = palyi.nev;
        opcio.dataset.ar = palyi.ar;
        opcio.textContent = `${palyi.nev} (${palyi.ar} Ft / óra)`;
        szolgalatSelect.appendChild(opcio);
    });
    szolgalatLabel.appendChild(szolgalatSelect);

    const datumLabel = document.createElement("label");
    datumLabel.textContent = "Foglalás dátuma: ";
    const datumInput = document.createElement("input");
    datumInput.type = "date";
    datumInput.id = "datum";
    datumInput.required = true;
    datumInput.min = new Date().toISOString().split("T")[0];
    datumLabel.appendChild(datumInput);

    const idotartamLabel = document.createElement("label");
    idotartamLabel.textContent = "Időtartam (óra): ";
    const idotartamInput = document.createElement("input");
    idotartamInput.type = "number";
    idotartamInput.id = "idotartam";
    idotartamInput.value = 1;
    idotartamInput.min = 1;
    idotartamInput.max = 24;
    idotartamLabel.appendChild(idotartamInput);

    const osszegLabel = document.createElement("label");
    osszegLabel.textContent = "Fizetendő összeg: ";
    const osszegInput = document.createElement("input");
    osszegInput.type = "text";
    osszegInput.id = "vegösszeg";
    osszegInput.readOnly = true;
    osszegInput.value = "8000 Ft";
    osszegLabel.appendChild(osszegInput);

    function frissitAr() {
        const valasztottOpcio = szolgalatSelect.options[szolgalatSelect.selectedIndex];
        const oradij = parseInt(valasztottOpcio.dataset.ar || 8000);
        const orakSzama = parseInt(idotartamInput.value) || 1;
        
        const vegösszeg = oradij * orakSzama;
        osszegInput.value = `${vegösszeg.toLocaleString()} Ft`;
    }

    szolgalatSelect.addEventListener("change", frissitAr);
    idotartamInput.addEventListener("input", frissitAr);

    const megjegyzesLabel = document.createElement("label");
    megjegyzesLabel.textContent = "Megjegyzés / Részletek: ";
    const megjegyzesTextarea = document.createElement("textarea");
    megjegyzesTextarea.id = "megjegyzes";
    megjegyzesTextarea.rows = 3;
    megjegyzesLabel.appendChild(megjegyzesTextarea);

    const kuldesGomb = document.createElement("input");
    kuldesGomb.type = "submit";
    kuldesGomb.value = "Időpont lefoglalása";

    const tabOrder = [
        nevInput,
        emailInput,
        telInput,
        szolgalatSelect,
        datumInput,
        idotartamInput,
        osszegInput,
        megjegyzesTextarea,
        kuldesGomb
    ];

    tabOrder.forEach((field, index) => {
        field.tabIndex = index + 1;
    });

    const elemek = [
        nevLabel, emailLabel, telLabel, 
        szolgalatLabel, datumLabel, idotartamLabel, 
        osszegLabel, megjegyzesLabel
    ];

    elemek.forEach(elem => {
        const div = document.createElement("div");
        div.style.marginBottom = "15px";
        div.appendChild(elem);
        urlap.appendChild(div);
    });
    urlap.appendChild(kuldesGomb);

    urlap.addEventListener("submit", function (event) {
        event.preventDefault();

        const foglalasAdatok = {
            nev: document.getElementById("nev").value,
            email: document.getElementById("email").value,
            telefon: document.getElementById("telefon").value,
            szolgaltatas: document.getElementById("szolgaltatas").value,
            datum: document.getElementById("datum").value,
            idotartam: document.getElementById("idotartam").value,
            osszeg: document.getElementById("vegösszeg").value,
            megjegyzes: document.getElementById("megjegyzes").value
        };

        localStorage.setItem("idopontFoglalas", JSON.stringify(foglalasAdatok));
        window.location.href = "visszaigazolo.html";
    });

    const container = document.getElementById("urlap-container") || document.body;
    container.appendChild(urlap);
}