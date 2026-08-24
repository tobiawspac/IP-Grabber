'use strict';

// =============================================================================
// PAGE.JS - Ovladani zobrazeni vysledku
// =============================================================================
// Tento soubor ridi prechod mezi uvodnim textem a nastrojem s vysledky.
// Nastroj se spusti AZ po kliknuti na tlacitko = gdpr-kompatibilni pristup.
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Hledame klicove prvky v DOM
  const btn = document.getElementById('btn-reveal');      // Tlacitko "Zobrazit"
  const gate = document.getElementById('tool-gate');       // Placeholder pred spustenim
  const toolRoot = document.getElementById('tool-root');   // Korenovy prvek nastroje

  // Pokud tlacitko neexistuje, konec
  if (!btn) return;

  // Kliknuti na tlacitko - odemkne nastroj
  btn.addEventListener('click', () => {
    // 1. Skryjeme uvodni placeholder
    gate.style.display = 'none';

    // 2. Odemkneme zobrazeni nastroje (prepne display: none -> block)
    toolRoot.classList.add('unlocked');

    // 3. Skryjeme tlacitko a jeho kontejner
    btn.closest('.reveal-band').querySelector('.reveal-cta').style.display = 'none';

    // 4. Spustime sbirani dat (pokud je dostupna funkce ze script.js)
    if (typeof window.__deviceTraceStart === 'function') {
      window.__deviceTraceStart();
    }

    // 5. Plynule scrollovat k vysledkum
    toolRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
