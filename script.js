'use strict';

// =============================================================================
// DEVICE.TRACE - Fingerprint nastroj
// =============================================================================
// Tento soubor obsahuje vsechnu logiku pro sběr a zobrazeni device fingerprintu.
//
// JAK PRIDAT NOVOU SEKCI:
// 1. Pridel jmeno sekce do SECTION_ORDER (nahore)
// 2. Vytvor funkci collectNazev() ktera vola set('Nazev', 'klic', hodnota)
// 3. Pridej volani sve funkce do collectAll() (synchroni nebo async)
// 4. Hotovo! Sekce se automaticky zobrazi v tabulce
//
// PRIKLAD NOVE SEKCE:
//   function collectBrowserFeatures() {
//     set('Nasekce', 'feature1', navigator.feature1 ?? 'nedostupne');
//     set('Nasekce', 'feature2', 'hodnota');
//   }
//   // Pak pridej: collectBrowserFeatures(); do collectAll()
// =============================================================================


// -----------------------------------------------------------------------------
// I18N - Preklady
// -----------------------------------------------------------------------------

const LANG = document.documentElement.lang || 'cs';

const I18N = {
  cs: {
    sections: {
      'Navigator': 'Navigator',
      'Obrazovka': 'Obrazovka',
      'Cas': 'Cas',
      'Sit': 'Sit',
      'Baterie': 'Baterie',
      'GPU': 'GPU',
      'WebGPU': 'WebGPU',
      'Media zarizeni': 'Media zarizeni',
      'Media kodeky': 'Media kodeky',
      'Rec (TTS)': 'Rec (TTS)',
      'Permissions': 'Permissions',
      'Fingerprint': 'Fingerprint',
      'Pluginy': 'Pluginy',
      'Uloziste': 'Uloziste',
      'UA Client Hints': 'UA Client Hints'
    },
    keys: {
      'hardwareConcurrency (CPU jadra)': 'hardwareConcurrency (CPU jadra)',
      'deviceMemory (GB, jen Chrome)': 'deviceMemory (GB, jen Chrome)',
      'webdriver (automatizace)': 'webdriver (automatizace)',
      'rozliseni': 'rozliseni',
      'dostupna plocha': 'dostupna plocha',
      'timezoneOffset (min)': 'timezoneOffset (min)',
      'lokalni cas': 'lokalni cas',
      'verejna IPv4': 'verejna IPv4',
      'WebRTC lokalni/leaknute IP': 'WebRTC lokalni/leaknute IP',
      'canvas hash (poslednich 40 znaku)': 'canvas hash (poslednich 40 znaku)',
      'detekovane fonty': 'detekovane fonty',
      'device ID (SHA-256 kombinovanych signalu)': 'device ID (SHA-256 kombinovanych signalu)',
      'pocet hlasu': 'pocet hlasu',
      'kamery (videoinput)': 'kamery (videoinput)',
      'mikrofony (audioinput)': 'mikrofony (audioinput)',
      'reproduktory (audiooutput)': 'reproduktory (audiooutput)',
      'popisky dostupne (po povoleni)': 'popisky dostupne (po povoleni)',
      'podpora': 'podpora',
      'odhad volneho mista (GB)': 'odhad volneho mista (GB)',
      'jiz vyuzito (MB)': 'jiz vyuzito (MB)',
      'platforma': 'platforma',
      'model zarizeni': 'model zarizeni',
      'plna verze': 'plna verze',
      'kamera': 'kamera',
      'mikrofon': 'mikrofon',
      'poloha': 'poloha',
      'notifikace': 'notifikace',
      'trvale uloziste': 'trvale uloziste'
    },
    ui: {
      loading: 'Nacitam\u2026',
      done: 'Hotovo.',
      copyDone: 'Zkopirovano!',
      copyFail: 'Kopirovani selhalo (chybi opravneni ke schrance).',
      generatedAt: 'Vygenerovano:',
      scoreLabel: 'Odhad jedinecnosti (fingerprint skore):',
      noData: 'zatim nedostatek dat',
      scoreLow: 'nizka',
      scoreMid: 'stredni',
      scoreHigh: 'vysoka',
      diffNone: 'Zadne zmeny od posledni navstevy.',
      diffFirst: 'Zadna predchozi navsteva v tomto prohlizeci k porovnani (prvni beh).',
      diffChanged: (n) => `${n} zmena/y od posledni navstevy:`,
      diffMore: (n) => `... a dalsich ${n}`,
      diffMissing: '(chybelo)',
      diffRemoved: '(odstraneno)',
      historyCleared: 'Historie vymazana. Dalsi beh bude povazovan za prvni.',
      na: 'nedostupne',
      naOffline: 'nedostupne (offline/blokovano)',
      naCrypto: 'nedostupne (crypto.subtle chybi)',
      noAdapter: 'zadny adapter nenalezen',
      adapterAvail: 'dostupny (detail nedostupny)',
      noLocalIP: 'zadne nenalezeny',
      noneTested: 'zadne z testovanych',
      unsupported: 'nepodporovano prohlizecem',
      blocked: 'WEBGL_debug_renderer_info blokovano prohlizecem',
      canvasAvail: 'canvas fingerprint dostupny',
      audioAvail: 'audio fingerprint dostupny',
      fontsDetected: (n) => `${n} detekovanych fontu`,
      webrtcLeak: 'WebRTC odhaluje lokalni IP',
      unusualRes: 'neobvykle rozliseni obrazovky',
      uaHintsAvail: 'UA Client Hints dostupne',
      webgpuAvail: 'WebGPU adapter info dostupny',
      ttsAvail: 'hlasy TTS dostupne'
    }
  },
  en: {
    sections: {
      'Navigator': 'Navigator',
      'Obrazovka': 'Screen',
      'Cas': 'Time',
      'Sit': 'Network',
      'Baterie': 'Battery',
      'GPU': 'GPU',
      'WebGPU': 'WebGPU',
      'Media zarizeni': 'Media devices',
      'Media kodeky': 'Media codecs',
      'Rec (TTS)': 'Speech (TTS)',
      'Permissions': 'Permissions',
      'Fingerprint': 'Fingerprint',
      'Pluginy': 'Plugins',
      'Uloziste': 'Storage',
      'UA Client Hints': 'UA Client Hints'
    },
    keys: {
      'hardwareConcurrency (CPU jadra)': 'hardwareConcurrency (CPU cores)',
      'deviceMemory (GB, jen Chrome)': 'deviceMemory (GB, Chrome only)',
      'webdriver (automatizace)': 'webdriver (automation)',
      'rozliseni': 'resolution',
      'dostupna plocha': 'available screen',
      'timezoneOffset (min)': 'timezoneOffset (min)',
      'lokalni cas': 'local time',
      'verejna IPv4': 'public IPv4',
      'WebRTC lokalni/leaknute IP': 'WebRTC local/leaked IP',
      'canvas hash (poslednich 40 znaku)': 'canvas hash (last 40 chars)',
      'detekovane fonty': 'detected fonts',
      'device ID (SHA-256 kombinovanych signalu)': 'device ID (SHA-256 combined signals)',
      'pocet hlasu': 'voice count',
      'kamery (videoinput)': 'cameras (videoinput)',
      'mikrofony (audioinput)': 'microphones (audioinput)',
      'reproduktory (audiooutput)': 'speakers (audiooutput)',
      'popisky dostupne (po povoleni)': 'labels available (after grant)',
      'podpora': 'supported',
      'odhad volneho mista (GB)': 'estimated free space (GB)',
      'jiz vyuzito (MB)': 'used (MB)',
      'platforma': 'platform',
      'model zarizeni': 'device model',
      'plna verze': 'full version',
      'kamera': 'camera',
      'mikrofon': 'microphone',
      'poloha': 'location',
      'notifikace': 'notifications',
      'trvale uloziste': 'persistent storage'
    },
    ui: {
      loading: 'Loading\u2026',
      done: 'Done.',
      copyDone: 'Copied!',
      copyFail: 'Copy failed (clipboard permission denied).',
      generatedAt: 'Generated:',
      scoreLabel: 'Uniqueness estimate (fingerprint score):',
      noData: 'not enough data yet',
      scoreLow: 'low',
      scoreMid: 'medium',
      scoreHigh: 'high',
      diffNone: 'No changes since last visit.',
      diffFirst: 'No previous visit in this browser to compare (first run).',
      diffChanged: (n) => `${n} change(s) since last visit:`,
      diffMore: (n) => `... and ${n} more`,
      diffMissing: '(missing)',
      diffRemoved: '(removed)',
      historyCleared: 'History cleared. Next run will be treated as the first.',
      na: 'unavailable',
      naOffline: 'unavailable (offline/blocked)',
      naCrypto: 'unavailable (crypto.subtle missing)',
      noAdapter: 'no adapter found',
      adapterAvail: 'available (details unavailable)',
      noLocalIP: 'none found',
      noneTested: 'none from tested',
      unsupported: 'not supported by browser',
      blocked: 'WEBGL_debug_renderer_info blocked by browser',
      canvasAvail: 'canvas fingerprint available',
      audioAvail: 'audio fingerprint available',
      fontsDetected: (n) => `${n} fonts detected`,
      webrtcLeak: 'WebRTC exposes local IP',
      unusualRes: 'unusual screen resolution',
      uaHintsAvail: 'UA Client Hints available',
      webgpuAvail: 'WebGPU adapter info available',
      ttsAvail: 'TTS voices available'
    }
  }
};

function t(path) {
  const lang = I18N[LANG] || I18N.cs;
  const keys = path.split('.');
  let val = lang;
  for (const k of keys) val = val?.[k];
  return val ?? path;
}

function tr(key) {
  const lang = I18N[LANG] || I18N.cs;
  return lang.keys[key] ?? key;
}


// -----------------------------------------------------------------------------
// KONSTANTY A STAV
// -----------------------------------------------------------------------------

/**
 * Poradi sekci ve vysledcich - zajistuje stabilni layout
 * Pridavej nove sekce na konec, NIKDY nepreusporadavej
 */
const SECTION_ORDER = [
  'Navigator', 'Obrazovka', 'Cas', 'Sit', 'Baterie', 'GPU', 'WebGPU',
  'Media zarizeni', 'Media kodeky', 'Rec (TTS)', 'Permissions',
  'Fingerprint', 'Pluginy', 'Uloziste', 'UA Client Hints'
];

/** Text zobrazeny pri nacitani async hodnoty */
const PENDING = '\u2026';

/** Kluc pro localStorage - historie fingerprintu */
const HISTORY_KEY = 'fingerprinter:last-snapshot';

/** Hlavni objekt se vsemi daty - format: { sekace: { klic: { value, isError } } } */
const data = {};

/** Mnozina skrytych sekci (pomoci prepinacu) */
const hiddenSections = new Set();

/** Predchozi snapshot pro diff zobrazeni */
let previousSnapshot = loadPreviousSnapshot();


// -----------------------------------------------------------------------------
// POMOCNE FUNKCE - Ukladani a nacitani
// -----------------------------------------------------------------------------

/**
 * Nacte predchozi snapshot z localStorage
 * @returns {Object|null} Data z predchozi navstevy, nebo null
 */
function loadPreviousSnapshot() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null; // localStorage blokovany (private mode)
  }
}

/**
 * Ulozi aktualni snapshot do localStorage
 * @param {Object} snapshot - Data k ulozeni
 */
function savePreviousSnapshot(snapshot) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(snapshot));
  } catch (e) {
    // Storage plne nebo blokovane - diff nebude pretrvavat
  }
}


// -----------------------------------------------------------------------------
// POMOCNE FUNKCE - Bezpecnost a formatovani
// -----------------------------------------------------------------------------

/**
 * Escapuje HTML specialni znaky - CHRANI PRED XSS
 * @param {*} value - Hodnota k escapovani
 * @returns {string} Bezpecna HTML hodnota
 */
function escapeHtml(value) {
  const str = String(value);
  return str.replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}


// -----------------------------------------------------------------------------
// SYSTÉM ZOBRAZOVANI DAT
// -----------------------------------------------------------------------------

/**
 * Nastavi hodnotu v hlavnim objektu data a znovu vyrenderuje tabulku
 *
 * JAK POUZIVAT:
 *   set('NazevSekce', 'klic', 'hodnota');          // bez chyby
 *   set('NazevSekce', 'klic', 'chyba', true);      // chyba (cervene)
 *
 * @param {string} section - Jmeno sekce (musi byt v SECTION_ORDER)
 * @param {string} key - Nazev polozky
 * @param {*} value - Hodnota k zobrazeni
 * @param {boolean} isError - Zda se jedna o chybu
 */
function set(section, key, value, isError) {
  if (!data[section]) data[section] = {};
  data[section][key] = { value, isError: Boolean(isError) };
  render();
}

/**
 * Nastavi hodnotu jako "pending" (nacita se...)
 * @param {string} section - Jmeno sekce
 * @param {string} key - Klic polozky
 */
function setPending(section, key) {
  set(section, key, PENDING, false);
}


// -----------------------------------------------------------------------------
// RENDERING - Zobrazeni vysledku
// -----------------------------------------------------------------------------

/**
 * Vykresli vsechna data do HTML tabulek
 * Vola se automaticky pri kazde zmene pres set()
 */
function render() {
  const container = document.getElementById('output');

  // Serad sekce podle SECTION_ORDER, pripadne na konec pridej nove
  const orderedSections = [
    ...SECTION_ORDER.filter((s) => data[s]),
    ...Object.keys(data).filter((s) => !SECTION_ORDER.includes(s))
  ];

  const parts = [];
  for (const section of orderedSections) {
    const sectionLabel = t('sections.' + section) || section;
    parts.push(`<div class="section" data-section="${escapeHtml(section)}"><h2>${escapeHtml(sectionLabel)}</h2><table><tbody>`);

    for (const key in data[section]) {
      const entry = data[section][key];
      const isPending = entry.value === PENDING;
      const cls = isPending ? 'pending' : (entry.isError ? 'error' : '');
      const keyLabel = tr(key);
      parts.push(
        `<tr><td class="key">${escapeHtml(keyLabel)}</td>` +
        `<td class="value ${cls}">${escapeHtml(entry.value)}</td></tr>`
      );
    }

    parts.push('</tbody></table></div>');
  }

  container.innerHTML = parts.join('');
  applyFilters();
}

/**
 * Aplikuje vyhledavani a skryvani sekci
 * Vola se po render() a pri zmene vyhledavani/prepinacu
 */
function applyFilters() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  document.querySelectorAll('#output .section').forEach((sectionEl) => {
    const name = sectionEl.dataset.section;

    // Skryta sekce pomoci prepinace
    if (hiddenSections.has(name)) {
      sectionEl.style.display = 'none';
      return;
    }

    // Filtrovani radku podle vyhledavani
    let anyVisible = false;
    sectionEl.querySelectorAll('tbody tr').forEach((row) => {
      const matches = !query || row.textContent.toLowerCase().includes(query);
      row.style.display = matches ? '' : 'none';
      if (matches) anyVisible = true;
    });

    // Skryj celou sekci pokud zadna polozka neodpovida
    sectionEl.style.display = (query && !anyVisible) ? 'none' : '';
  });
}


// -----------------------------------------------------------------------------
// ASYNC POMOCNE FUNKCE
// -----------------------------------------------------------------------------

/**
 * Obali promise timeoutem - zabrani nekonecnemu cekani
 * @param {Promise} promise - Puvodni promise
 * @param {number} ms - Timeout v milisekundach
 * @returns {Promise} Reseni nebo chyba pri timeoutu
 */
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}


// =============================================================================
// SEKCE SBIRAJICI DATA - kazda ma svoji funkci
// =============================================================================
// VSECHNY FUNKCE MJI STEJNOU PODOBU:
//   1. Volaji set('Sekce', 'klic', hodnota) pro kazdy prvek
//   2. Pro async: nejdriv setPending(), pak await, pak set()
//   3. Chyby se zachytavaji a oznacuji pres isError=true
// =============================================================================


// -----------------------------------------------------------------------------
// 1. NAVIGATOR - Zakladni info o prohlizeci
// -----------------------------------------------------------------------------
function collectNavigator() {
  set('Navigator', 'userAgent', navigator.userAgent);
  set('Navigator', 'platform', navigator.platform);
  set('Navigator', 'language', navigator.language);
  set('Navigator', 'languages', navigator.languages?.join(', ') ?? t('ui.na'));
  set('Navigator', 'hardwareConcurrency (CPU jadra)', navigator.hardwareConcurrency ?? t('ui.na'));
  set('Navigator', 'deviceMemory (GB, jen Chrome)', navigator.deviceMemory ?? t('ui.na'));
  set('Navigator', 'maxTouchPoints', navigator.maxTouchPoints);
  set('Navigator', 'cookieEnabled', navigator.cookieEnabled);
  set('Navigator', 'vendor', navigator.vendor || t('ui.na'));
  set('Navigator', 'webdriver (automatizace)', navigator.webdriver);
}


// -----------------------------------------------------------------------------
// 2. OBRAZOVKA - Rozliseni a vlastnosti displaye
// -----------------------------------------------------------------------------
function collectScreen() {
  set('Obrazovka', 'rozliseni', `${screen.width}x${screen.height}`);
  set('Obrazovka', 'dostupna plocha', `${screen.availWidth}x${screen.availHeight}`);
  set('Obrazovka', 'colorDepth', screen.colorDepth);
  set('Obrazovka', 'pixelDepth', screen.pixelDepth);
  set('Obrazovka', 'devicePixelRatio', window.devicePixelRatio);
  set('Obrazovka', 'orientation', screen.orientation?.type ?? t('ui.na'));
}


// -----------------------------------------------------------------------------
// 3. CAS - Casove pásmo a lokalni cas
// -----------------------------------------------------------------------------
function collectTime() {
  set('Cas', 'timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);
  set('Cas', 'timezoneOffset (min)', new Date().getTimezoneOffset());
  set('Cas', 'lokalni cas', new Date().toString());
}


// -----------------------------------------------------------------------------
// 4. SIT - Informace o pripojeni a sitovych datech
// -----------------------------------------------------------------------------
function collectConnection() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn) {
    set('Sit', 'effectiveType', conn.effectiveType ?? t('ui.na'));
    set('Sit', 'downlink (Mbps)', conn.downlink ?? t('ui.na'));
    set('Sit', 'rtt (ms)', conn.rtt ?? t('ui.na'));
    set('Sit', 'saveData', Boolean(conn.saveData));
  }
}


// -----------------------------------------------------------------------------
// 5. BATERIE - Stav baterie (deprecated API, nepodporuje se vsude)
// -----------------------------------------------------------------------------
async function collectBattery() {
  if (!navigator.getBattery) {
    set('Baterie', 'podpora', false);
    return;
  }

  setPending('Baterie', 'level');
  try {
    const battery = await navigator.getBattery();
    set('Baterie', 'level', `${Math.round(battery.level * 100)}%`);
    set('Baterie', 'charging', battery.charging);
  } catch (e) {
    set('Baterie', 'level', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 6. GPU - Informace o graficke karte pres WebGL
// -----------------------------------------------------------------------------
function collectGpu() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) throw new Error('WebGL ' + t('ui.na'));

    const dbgInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!dbgInfo) {
      set('GPU', 'info', t('ui.blocked'), true);
      return;
    }

    set('GPU', 'vendor', gl.getParameter(dbgInfo.UNMASKED_VENDOR_WEBGL));
    set('GPU', 'renderer', gl.getParameter(dbgInfo.UNMASKED_RENDERER_WEBGL));
  } catch (e) {
    set('GPU', 'error', e.message || ('WebGL ' + t('ui.na')), true);
  }
}


// -----------------------------------------------------------------------------
// 7. WEBGPU - Novejsi API pro grafiku
// -----------------------------------------------------------------------------
async function collectWebGpu() {
  if (!navigator.gpu) {
    set('WebGPU', 'podpora', false);
    return;
  }

  setPending('WebGPU', 'adapter');
  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      set('WebGPU', 'adapter', t('ui.noAdapter'), true);
      return;
    }

    const info = adapter.info || (adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : null);
    if (info) {
      set('WebGPU', 'vendor', info.vendor || t('ui.na'));
      set('WebGPU', 'architektura', info.architecture || t('ui.na'));
      set('WebGPU', 'zarizeni', info.device || t('ui.na'));
      set('WebGPU', 'popis', info.description || t('ui.na'));
    } else {
      set('WebGPU', 'adapter', t('ui.adapterAvail'));
    }
  } catch (e) {
    set('WebGPU', 'adapter', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 8. FINGERPRINT - Canvas hash
// -----------------------------------------------------------------------------
/**
 * Vytvori canvas fingerprint - unikatni otisk podle GPU/drivers
 * @returns {string|null} Poslednich 40 znaku canvas dat
 */
function canvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillText('fingerprint-test-\u{1F600}', 2, 2);

    return canvas.toDataURL().slice(-40);
  } catch (e) {
    return null;
  }
}

function collectCanvasFingerprint() {
  const hash = canvasFingerprint();
  if (hash) {
    set('Fingerprint', 'canvas hash (poslednich 40 znaku)', hash);
  } else {
    set('Fingerprint', 'canvas hash (poslednich 40 znaku)', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 9. PLUGINY - Stare API pro pluginy prohlizece
// -----------------------------------------------------------------------------
function collectPlugins() {
  set('Pluginy', 'pocet', navigator.plugins?.length ?? 0);
}


// -----------------------------------------------------------------------------
// 10. ULOZISTE - Podpora ruznych storage technologii
// -----------------------------------------------------------------------------
function collectStorageSupport() {
  set('Uloziste', 'localStorage', typeof localStorage !== 'undefined');
  set('Uloziste', 'indexedDB', typeof indexedDB !== 'undefined');
}


// -----------------------------------------------------------------------------
// 11. VEREJNA IP - Ziskani IP pres externi API
// -----------------------------------------------------------------------------
async function collectPublicIp() {
  setPending('Sit', 'verejna IPv4');
  try {
    const res = await withTimeout(fetch('https://api.ipify.org?format=json'), 5000);
    const json = await res.json();
    set('Sit', 'verejna IPv4', json.ip);
  } catch (e) {
    set('Sit', 'verejna IPv4', t('ui.naOffline'), true);
  }
}


// -----------------------------------------------------------------------------
// 12. WEBRTC LEAK - Ziskani lokalni IP pres WebRTC
// -----------------------------------------------------------------------------
/**
 * Pokusi se ziskat lokalni IP pres WebRTC ICE kandidaty
 * @returns {Promise<string[]>} Pole nalezenych IP adres
 */
function getLocalIPs() {
  return new Promise((resolve) => {
    const ips = new Set();
    let settled = false;

    const finish = (pc) => {
      if (settled) return;
      settled = true;
      resolve([...ips]);
      try { pc.close(); } catch (e) { /* jiz zavreno */ }
    };

    try {
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => finish(pc));

      pc.onicecandidate = (e) => {
        if (!e.candidate) { finish(pc); return; }
        const match = e.candidate.candidate.match(/(\d{1,3}\.){3}\d{1,3}|[a-f0-9:]+:+[a-f0-9]+/i);
        if (match) ips.add(match[0]);
      };

      setTimeout(() => finish(pc), 1000);
    } catch (e) {
      resolve([]);
    }
  });
}

async function collectWebRtcLeak() {
  setPending('Sit', 'WebRTC lokalni/leaknute IP');
  const ips = await getLocalIPs();
  set('Sit', 'WebRTC lokalni/leaknute IP', ips.length ? ips.join(', ') : t('ui.noLocalIP'));
}


// -----------------------------------------------------------------------------
// 13. AUDIO FINGERPRINT - Otisk pres Web Audio API
// -----------------------------------------------------------------------------
/**
 * Vytvori audio fingerprint pres analyzu zvukoveho signalu
 * @returns {Promise<string>} Hash audio fingerprintu
 */
function audioFingerprint() {
  return new Promise((resolve) => {
    try {
      const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Ctx) { resolve(t('ui.na')); return; }

      const ctx = new Ctx(1, 44100, 44100);
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(10000, ctx.currentTime);

      const compressor = ctx.createDynamicsCompressor();
      osc.connect(compressor);
      compressor.connect(ctx.destination);

      osc.start(0);

      ctx.oncomplete = (e) => {
        const buf = e.renderedBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 4500; i < 5000; i++) sum += Math.abs(buf[i]);
        resolve(sum.toFixed(8));
      };

      ctx.startRendering().catch(() => resolve(t('ui.na')));
    } catch (e) {
      resolve(t('ui.na'));
    }
  });
}

async function collectAudioFingerprint() {
  setPending('Fingerprint', 'audio hash');
  const hash = await withTimeout(audioFingerprint(), 3000).catch(() => t('ui.na'));
  set('Fingerprint', 'audio hash', hash);
}


// -----------------------------------------------------------------------------
// 14. FONTY - Detekce nainstalovanych fontu
// -----------------------------------------------------------------------------
/**
 * Detekuje nainstalovane fonty porovnanim sirky textu
 * @returns {string[]} Pole nazvu nalezenych fontu
 */
function detectFonts() {
  const testFonts = [
    'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas',
    'Courier New', 'Georgia', 'Impact', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS',
    'Verdana', 'Helvetica', 'Roboto', 'Noto Sans', 'Ubuntu', 'DejaVu Sans', 'Liberation Sans',
    'Microsoft YaHei', 'SimSun', 'Meiryo', 'Malgun Gothic'
  ];

  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testString = 'mmmmmmmmmmlli';
  const testSize = '72px';

  const span = document.createElement('span');
  span.style.fontSize = testSize;
  span.style.position = 'absolute';
  span.style.left = '-9999px';
  span.style.top = '-9999px';
  span.textContent = testString;
  document.body.appendChild(span);

  // Ziskej zakladni sirky pro porovnani
  const baseWidths = {};
  baseFonts.forEach((bf) => {
    span.style.fontFamily = bf;
    baseWidths[bf] = span.offsetWidth;
  });

  // Testuj kazdy font
  const detected = [];
  testFonts.forEach((font) => {
    let isDetected = false;
    for (const bf of baseFonts) {
      span.style.fontFamily = `'${font}', ${bf}`;
      if (span.offsetWidth !== baseWidths[bf]) { isDetected = true; break; }
    }
    if (isDetected) detected.push(font);
  });

  document.body.removeChild(span);
  return detected;
}

function collectFonts() {
  const detected = detectFonts();
  set('Fingerprint', 'detekovane fonty', detected.join(', ') || t('ui.noneTested'));
}


// -----------------------------------------------------------------------------
// 15. UA CLIENT HINTS - Novejsi API pro detekci prohlizece (Chromium)
// -----------------------------------------------------------------------------
async function collectUaClientHints() {
  if (!navigator.userAgentData) {
    set('UA Client Hints', 'podpora', false);
    return;
  }

  setPending('UA Client Hints', 'platforma');
  try {
    const ua = await navigator.userAgentData.getHighEntropyValues(
      ['platform', 'platformVersion', 'model', 'uaFullVersion', 'fullVersionList']
    );
    set('UA Client Hints', 'platforma', `${ua.platform} ${ua.platformVersion || ''}`.trim());
    set('UA Client Hints', 'model zarizeni', ua.model || '(desktop, prazdne)');
    set('UA Client Hints', 'plna verze', ua.uaFullVersion || JSON.stringify(ua.fullVersionList));
  } catch (e) {
    set('UA Client Hints', 'platforma', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 16. ULOZISTE KVOTA - Odhad volneho mista
// -----------------------------------------------------------------------------
async function collectStorageQuota() {
  if (!navigator.storage?.estimate) return;

  setPending('Uloziste', 'odhad volneho mista (GB)');
  try {
    const est = await navigator.storage.estimate();
    set('Uloziste', 'odhad volneho mista (GB)', (est.quota / 1e9).toFixed(1));
    set('Uloziste', 'jiz vyuzito (MB)', (est.usage / 1e6).toFixed(1));
  } catch (e) {
    set('Uloziste', 'odhad volneho mista (GB)', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 17. PERMISSIONS - Stav opravneni prohlizece
// -----------------------------------------------------------------------------
async function collectPermissions() {
  if (!navigator.permissions?.query) {
    set('Permissions', 'podpora', false);
    return;
  }

  const permList = [
    ['camera', 'kamera'],
    ['microphone', 'mikrofon'],
    ['geolocation', 'poloha'],
    ['notifications', 'notifikace'],
    ['persistent-storage', 'trvale uloziste']
  ];

  permList.forEach(([, label]) => setPending('Permissions', label));

  for (const [name, label] of permList) {
    try {
      const status = await navigator.permissions.query({ name });
      set('Permissions', label, status.state);
    } catch (e) {
      set('Permissions', label, t('ui.unsupported'), true);
    }
  }
}


// -----------------------------------------------------------------------------
// 18. MEDIA ZARIZENI - Pocet kamer a mikrofonu
// -----------------------------------------------------------------------------
async function collectMediaDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) {
    set('Media zarizeni', 'podpora', false);
    return;
  }

  setPending('Media zarizeni', 'kamery (videoinput)');
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const counts = { videoinput: 0, audioinput: 0, audiooutput: 0 };
    devices.forEach((d) => { if (counts[d.kind] !== undefined) counts[d.kind] += 1; });

    set('Media zarizeni', 'kamery (videoinput)', counts.videoinput);
    set('Media zarizeni', 'mikrofony (audioinput)', counts.audioinput);
    set('Media zarizeni', 'reproduktory (audiooutput)', counts.audiooutput);
    set('Media zarizeni', 'popisky dostupne (po povoleni)', devices.some((d) => d.label));
  } catch (e) {
    set('Media zarizeni', 'kamery (videoinput)', t('ui.na'), true);
  }
}


// -----------------------------------------------------------------------------
// 19. MEDIA KODEKY - Podpora prehravani ruznych formatu
// -----------------------------------------------------------------------------
function collectCodecs() {
  // Video kodeky
  const video = document.createElement('video');
  const videoTests = [
    ['H.264', 'video/mp4; codecs="avc1.42E01E"'],
    ['H.265/HEVC', 'video/mp4; codecs="hvc1.1.6.L93.B0"'],
    ['VP9', 'video/webm; codecs="vp9"'],
    ['AV1', 'video/mp4; codecs="av01.0.05M.08"']
  ];

  videoTests.forEach(([label, mime]) => {
    const support = video.canPlayType ? video.canPlayType(mime) : '';
    set('Media kodeky', `video: ${label}`, support || 'ne');
  });

  // Audio kodeky
  const audio = document.createElement('audio');
  const audioTests = [
    ['MP3', 'audio/mpeg'],
    ['AAC', 'audio/mp4; codecs="mp4a.40.2"'],
    ['Opus (WebM)', 'audio/webm; codecs="opus"'],
    ['FLAC', 'audio/flac']
  ];

  audioTests.forEach(([label, mime]) => {
    const support = audio.canPlayType ? audio.canPlayType(mime) : '';
    set('Media kodeky', `audio: ${label}`, support || 'ne');
  });
}


// -----------------------------------------------------------------------------
// 20. RECOVNI SYNTEZE - TTS hlasy jako dalsi fingerprint signal
// -----------------------------------------------------------------------------
function collectSpeechVoices() {
  if (!window.speechSynthesis) {
    set('Rec (TTS)', 'podpora', false);
    return;
  }

  setPending('Rec (TTS)', 'pocet hlasu');

  const readVoices = () => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return false;

    set('Rec (TTS)', 'pocet hlasu', voices.length);
    const langs = [...new Set(voices.map((v) => v.lang))].sort();
    set('Rec (TTS)', 'jazyky', langs.join(', '));
    return true;
  };

  if (!readVoices()) {
    speechSynthesis.onvoiceschanged = () => readVoices();
    setTimeout(() => { if (!readVoices()) set('Rec (TTS)', 'pocet hlasu', 0); }, 1500);
  }
}


// =============================================================================
// FINGERPRINT SKORE A DEVICE ID
// =============================================================================

/**
 * Spocita kombinovany device ID hash ze vsech stabilnich signalu
 * Pouziva SHA-256 pro jednoznacny identifikator zarizeni
 */
async function computeDeviceIdHash() {
  // Slozit text z vsech stabilnich signalu (bez casovych znacek)
  const parts = [
    navigator.userAgent,
    navigator.platform,
    navigator.language,
    (navigator.languages || []).join(','),
    String(navigator.hardwareConcurrency ?? ''),
    String(navigator.deviceMemory ?? ''),
    String(navigator.maxTouchPoints ?? ''),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    String(window.devicePixelRatio),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    data.GPU?.vendor?.value ?? '',
    data.GPU?.renderer?.value ?? '',
    data.Fingerprint?.['canvas hash (poslednich 40 znaku)']?.value ?? '',
    data.Fingerprint?.['audio hash']?.value ?? '',
    data.Fingerprint?.['detekovane fonty']?.value ?? ''
  ];

  const text = parts.join('||');

  try {
    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return null;
  }
}

async function collectDeviceIdHash() {
  setPending('Fingerprint', 'device ID (SHA-256 kombinovanych signalu)');
  const hash = await computeDeviceIdHash();
  if (hash) {
    set('Fingerprint', 'device ID (SHA-256 kombinovanych signalu)', hash);
  } else {
    set('Fingerprint', 'device ID (SHA-256 kombinovanych signalu)', t('ui.naCrypto'), true);
  }
}


// -----------------------------------------------------------------------------
// FINGERPRINT SKORE - Odhad unikatnosti zarizeni
// -----------------------------------------------------------------------------

/**
 * Vypocita skore unikatnosti fingerprintu (0-100)
 * Cim vyssi skore, tim vice se vase zarizeni lisi od ostatnich
 */
function computeFingerprintScore() {
  let score = 0;
  const factors = [];

  // Canvas fingerprint (+15)
  const canvasEntry = data.Fingerprint?.['canvas hash (poslednich 40 znaku)'];
  if (canvasEntry && canvasEntry.value !== PENDING && !canvasEntry.isError) {
    score += 15;
    factors.push(t('ui.canvasAvail'));
  }

  // Audio fingerprint (+15)
  const audioEntry = data.Fingerprint?.['audio hash'];
  if (audioEntry && audioEntry.value !== PENDING && audioEntry.value !== t('ui.na')) {
    score += 15;
    factors.push(t('ui.audioAvail'));
  }

  // Detekovane fonty (+2 za kazdy, max +20)
  const fontsEntry = data.Fingerprint?.['detekovane fonty'];
  if (fontsEntry && fontsEntry.value !== PENDING && fontsEntry.value !== t('ui.noneTested')) {
    const count = String(fontsEntry.value).split(',').filter(Boolean).length;
    const pts = Math.min(count * 2, 20);
    score += pts;
    factors.push(t('ui.fontsDetected')(count));
  }

  // WebRTC leak (+15)
  const webrtcEntry = data.Sit?.['WebRTC lokalni/leaknute IP'];
  if (webrtcEntry && webrtcEntry.value !== PENDING && webrtcEntry.value !== t('ui.noLocalIP')) {
    score += 15;
    factors.push(t('ui.webrtcLeak'));
  }

  // Neobvykle rozliseni (+10)
  const commonResolutions = new Set([
    '1920x1080', '1366x768', '1440x900', '1536x864', '1280x720',
    '1280x800', '2560x1440', '375x812', '390x844', '412x915'
  ]);
  const resolutionEntry = data.Obrazovka?.['rozliseni'];
  if (resolutionEntry && !commonResolutions.has(resolutionEntry.value)) {
    score += 10;
    factors.push(t('ui.unusualRes'));
  }

  // UA Client Hints (+10)
  const uaHintsSection = data['UA Client Hints'];
  if (uaHintsSection && !('podpora' in uaHintsSection)) {
    score += 10;
    factors.push(t('ui.uaHintsAvail'));
  }

  // WebGPU info (+10)
  const gpuEntry = data.WebGPU?.vendor;
  if (gpuEntry && gpuEntry.value !== PENDING && gpuEntry.value !== t('ui.na')) {
    score += 10;
    factors.push(t('ui.webgpuAvail'));
  }

  // TTS hlasy (+5)
  const voiceEntry = data['Rec (TTS)']?.['pocet hlasu'];
  if (voiceEntry && typeof voiceEntry.value === 'number' && voiceEntry.value > 0) {
    score += 5;
    factors.push(t('ui.ttsAvail'));
  }

  // Omezeni na 0-100
  score = Math.min(score, 100);

  // Barva podle skore
  let label = t('ui.scoreLow');
  let colorVar = '--green';
  if (score >= 60) { label = t('ui.scoreHigh'); colorVar = '--warn'; }
  else if (score >= 30) { label = t('ui.scoreMid'); colorVar = '--cyan'; }

  return { score, label, factors, colorVar };
}

/**
 * Vykresli panel se skorem unikatnosti
 */
function renderScore() {
  const result = computeFingerprintScore();
  const el = document.getElementById('score-card');
  const factorsText = result.factors.length
    ? result.factors.join(', ')
    : t('ui.noData');

  el.innerHTML = `
    <div class="score-number" style="color:var(${result.colorVar})">${result.score}</div>
    <div class="score-body">
      <div class="score-label">${t('ui.scoreLabel')} <strong style="color:var(${result.colorVar})">${result.label}</strong></div>
      <div>${escapeHtml(factorsText)}</div>
      <div class="score-bar-track"><div class="score-bar-fill" style="width:${result.score}%; background:var(${result.colorVar})"></div></div>
    </div>
  `;
}


// =============================================================================
// PREPINACE SEKCI
// =============================================================================

/**
 * Vytvori prepinace pro skryvani/zobrazovani jednotlivych sekci
 */
function buildSectionToggles() {
  const panel = document.getElementById('section-toggles');
  panel.innerHTML = SECTION_ORDER.map((name) => `
    <label>
      <input type="checkbox" checked data-section="${escapeHtml(name)}">
      <span>${escapeHtml(t('sections.' + name) || name)}</span>
    </label>
  `).join('');

  panel.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const section = checkbox.dataset.section;
      if (checkbox.checked) hiddenSections.delete(section);
      else hiddenSections.add(section);
      applyFilters();
    });
  });
}


// =============================================================================
// EXPORT DAT
// =============================================================================

/**
 * Vrati data jako cisty objekt bez internich struktur
 */
function toPlainData() {
  const plain = {};
  for (const section in data) {
    plain[section] = {};
    for (const key in data[section]) plain[section][key] = data[section][key].value;
  }
  return plain;
}

/**
 * Vrati data jako formatovany text pro kopirovani
 */
function toPlainText() {
  const lines = [];
  const orderedSections = [
    ...SECTION_ORDER.filter((s) => data[s]),
    ...Object.keys(data).filter((s) => !SECTION_ORDER.includes(s))
  ];

  for (const section of orderedSections) {
    lines.push(`## ${section}`);
    for (const key in data[section]) {
      lines.push(`${key}: ${data[section][key].value}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Stahne soubor s obsahem
 */
function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


// =============================================================================
// DIFF - Zmeny od posledni navstevy
// =============================================================================

/**
 * Porovna predchozi a aktualni data, vrati seznam zmen
 */
function computeDiff(prevPlain, currentPlain) {
  const changes = [];
  const sections = new Set([...Object.keys(prevPlain), ...Object.keys(currentPlain)]);

  sections.forEach((section) => {
    const prevSec = prevPlain[section] || {};
    const curSec = currentPlain[section] || {};
    const keys = new Set([...Object.keys(prevSec), ...Object.keys(curSec)]);

    keys.forEach((key) => {
      const prevVal = prevSec[key];
      const curVal = curSec[key];
      if (prevVal !== curVal) changes.push({ section, key, prevVal, curVal });
    });
  });

  return changes;
}

/**
 * Vykresli panel se zmenami od posledni navstevy
 */
function renderDiff(changes, isFirstRun) {
  const el = document.getElementById('diff-summary');

  if (isFirstRun) {
    el.textContent = t('ui.diffFirst');
    el.className = 'neutral';
    return;
  }

  if (!changes.length) {
    el.textContent = t('ui.diffNone');
    el.className = 'neutral';
    return;
  }

  const shown = changes.slice(0, 20);
  const items = shown.map((c) =>
    `<li>${escapeHtml(c.section)} / ${escapeHtml(c.key)}: ${escapeHtml(c.prevVal ?? t('ui.diffMissing'))} &rarr; ${escapeHtml(c.curVal ?? t('ui.diffRemoved'))}</li>`
  ).join('');

  const more = changes.length > 20
    ? `<div>${t('ui.diffMore')(changes.length - 20)}</div>`
    : '';

  el.innerHTML = `<div>${t('ui.diffChanged')(changes.length)}</div><ul>${items}</ul>${more}`;
  el.className = 'changed';
}


// =============================================================================
// HLAVNI FUNKCE - Sber vsech dat
// =============================================================================

/**
 * Spusti cely sběr fingerprintu
 * Vola se po kliknuti na tlacitko "Zobrazit"
 */
async function collectAll() {
  // Vymaz stare data
  Object.keys(data).forEach((k) => delete data[k]);

  // Aktualizuj UI
  document.getElementById('status').textContent = t('ui.loading');
  document.getElementById('generated-at').textContent =
    `${t('ui.generatedAt')} ${new Date().toLocaleString(LANG === 'en' ? 'en-US' : 'cs-CZ')}`;

  // ---- SYNCHRONI SBIRANI (okamzite) ----
  collectNavigator();
  collectScreen();
  collectTime();
  collectConnection();
  collectGpu();
  collectCanvasFingerprint();
  collectPlugins();
  collectStorageSupport();
  collectFonts();
  collectCodecs();

  // ---- ASYNC SBIRANI (paralelne) ----
  await Promise.allSettled([
    collectBattery(),
    collectWebGpu(),
    collectPublicIp(),
    collectWebRtcLeak(),
    collectAudioFingerprint(),
    collectUaClientHints(),
    collectStorageQuota(),
    collectPermissions(),
    collectMediaDevices()
  ]);

  // Speech voices muzou byt pozde - dame jim cas
  collectSpeechVoices();
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Device ID hash zavisi na vsech predchozich datech - spusti se posledni
  await collectDeviceIdHash();

  // Vykresli vysledky
  renderScore();

  // Uloz a porovnej s predchozi navstevou
  const currentPlain = toPlainData();
  const isFirstRun = previousSnapshot === null;
  const changes = isFirstRun ? [] : computeDiff(previousSnapshot, currentPlain);
  renderDiff(changes, isFirstRun);
  previousSnapshot = currentPlain;
  savePreviousSnapshot(currentPlain);

  document.getElementById('status').textContent = t('ui.done');
}


// =============================================================================
// EVENT LISTENERY
// =============================================================================

document.getElementById('btn-refresh').addEventListener('click', collectAll);

document.getElementById('btn-sections').addEventListener('click', () => {
  document.getElementById('section-toggles').classList.toggle('open');
});

document.getElementById('search-input').addEventListener('input', applyFilters);

document.getElementById('btn-copy').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(toPlainText());
    const btn = document.getElementById('btn-copy');
    const original = btn.textContent;
    btn.textContent = t('ui.copyDone');
    setTimeout(() => { btn.textContent = original; }, 1500);
  } catch (e) {
    document.getElementById('status').textContent = t('ui.copyFail');
  }
});

document.getElementById('btn-export').addEventListener('click', () => {
  downloadFile('pc-info.json', JSON.stringify(toPlainData(), null, 2), 'application/json');
});

document.getElementById('btn-clear-history').addEventListener('click', () => {
  try { localStorage.removeItem(HISTORY_KEY); } catch (e) { /* ignore */ }
  previousSnapshot = null;
  document.getElementById('diff-summary').textContent = t('ui.historyCleared');
  document.getElementById('diff-summary').className = 'neutral';
});


// =============================================================================
// INICIALIZACE
// =============================================================================

buildSectionToggles();

// NE Spousti se automaticky - ceka na kliknuti uzivatele (viz page.js)
// Toto umoznuje GDPR-kompatibilni pristup: data se sbiraji az po souhlasu
window.__deviceTraceStart = collectAll;
