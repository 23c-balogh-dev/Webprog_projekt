function UrlapBetoltes() {
    // form elem
    const urlap = document.createElement('form');
    urlap.id = "idopontForm";

    //  a nev beirasahoz
    const nevLabel = document.createElement('label');
    nevLabel.textContent = "Teljes név: ";
    const nevInput = document.createElement('input');
    nevInput.type = "text";
    nevInput.name = "nev";
    nevInput.id = "nev";
    nevInput.required = true;
    nevInput.minLength = 3; 
    nevLabel.appendChild(nevInput);

    // az email 
    const emailLabel = document.createElement('label');
    emailLabel.textContent = "E-mail cím: ";
    const emailInput = document.createElement('input');
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.id = "email";
    emailInput.required = true;
    emailLabel.appendChild(emailInput);

    //a telefonszam
    const telLabel = document.createElement('label');
    telLabel.textContent = "Telefonszám: ";
    const telInput = document.createElement('input');
    telInput.type = "tel";
    telInput.name = "telefon";
    telInput.id = "telefon";
    telInput.placeholder = "+36301234567";
    telInput.required = true;
    telLabel.appendChild(telInput);

    // a szolgaltatasnak a kivalasztasa gordolobol
    const szolgalatLabel = document.createElement('label');
    szolgalatLabel.textContent = "Választott szolgáltatás: ";
    const szolgalatSelect = document.createElement('select');
    szolgalatSelect.name = "szolgaltatas";
    szolgalatSelect.id = "szolgaltatas";
    szolgalatSelect.required = true;

    const opcio1 = document.createElement('option');
    opcio1.value = "Esküvői fotózás";
    opcio1.textContent = "Esküvői fotózás";

    const opcio2 = document.createElement('option');
    opcio2.value = "Jegyes fotózás";
    opcio2.textContent = "Jegyes fotózás";

    const opcio3 = document.createElement('option');
    opcio3.value = "Párfotózás";
    opcio3.textContent = "Párfotózás";

    szolgalatSelect.appendChild(opcio1);
    szolgalatSelect.appendChild(opcio2);
    szolgalatSelect.appendChild(opcio3);
    szolgalatLabel.appendChild(szolgalatSelect);

    // a datumnak a kivalasztasa
    const datumLabel = document.createElement('label');
    datumLabel.textContent = "Foglalás dátuma: ";
    const datumInput = document.createElement('input');
    datumInput.type = "date";
    datumInput.name = "datum";
    datumInput.id = "datum";
    datumInput.required = true;

    // minimumot kell beallitani a datumra h a korabbit ne lehessen
    const ma = new Date().toISOString().split('T')[0];
    datumInput.min = ma;

    datumLabel.appendChild(datumInput);

    // megjegyzes
    const megjegyzesLabel = document.createElement('label');
    megjegyzesLabel.textContent = "Megjegyzés / Részletek: ";
    const megjegyzesTextarea = document.createElement('textarea');
    megjegyzesTextarea.name = "megjegyzes";
    megjegyzesTextarea.id = "megjegyzes";
    megjegyzesTextarea.rows = 4;
    megjegyzesLabel.appendChild(megjegyzesTextarea);

    // gomb
    const kuldesGomb = document.createElement('input');
    kuldesGomb.type = "submit";
    kuldesGomb.value = "Időpont lefoglalása";

    // az elemek hozaadasa a formhoz
    urlap.appendChild(nevLabel);
    urlap.appendChild(emailLabel);
    urlap.appendChild(telLabel);
    urlap.appendChild(szolgalatLabel);
    urlap.appendChild(datumLabel);
    urlap.appendChild(megjegyzesLabel);
    urlap.appendChild(kuldesGomb);

  //urlap bekuldesswe
    urlap.addEventListener('submit', function (event) {
        event.preventDefault(); //lap ujratolteset megekadalyozza

        const foglalasAdatok = {
            nev: document.getElementById('nev').value,
            email: document.getElementById('email').value,
            telefon: document.getElementById('telefon').value,
            szolgaltatas: document.getElementById('szolgaltatas').value,
            datum: document.getElementById('datum').value,
            megjegyzes: document.getElementById('megjegyzes').value
        };

        // elmenti
        localStorage.setItem('idopontFoglalas', JSON.stringify(foglalasAdatok));

        // atiranyit
        window.location.href = 'urlapvisszaigazolo.html';
    });

    // az urlapot a zeredmenybe
    const container = document.getElementById('urlap-container');
    if (container) {
        container.appendChild(urlap);
    } else {
        document.body.appendChild(urlap);
    }
}