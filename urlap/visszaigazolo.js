document.addEventListener("DOMContentLoaded", () => {
    const adatok = JSON.parse(localStorage.getItem("idopontFoglalas") || "{}");

    document.getElementById("resNev").textContent = adatok.nev || "";
    document.getElementById("resEmail").textContent = adatok.email || "";
    document.getElementById("resTelefon").textContent = adatok.telefon || "";
    document.getElementById("resSzolgaltatas").textContent = adatok.szolgaltatas || "";
    document.getElementById("resDatum").textContent = adatok.datum || "";
    document.getElementById("resMegjegyzes").textContent = adatok.megjegyzes || "";
});
