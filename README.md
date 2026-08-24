# IP Grabber — Device Fingerprint Tool

Co o vás ví váš prohlížeč — a jak to omezit.

## Co to dělá?

Nástroj spustí 7 testů přímo ve vašem prohlížeči a ukáže, jaké signály vysíláte na každou navštívenou stránku:

1. **Veřejná IP adresa** — přes api.ipify.org
2. **Lokální IP přes WebRTC** — leak i přes VPN
3. **Canvas fingerprint** — otisk GPU/renderingu
4. **Audio fingerprint** — otisk přes Web Audio API
5. **Nainstalované fonty** — detekce fontů na systému
6. **GPU přes WebGL/WebGPU** — výrobce a model grafické karty
7. **Kombinovaný device ID** — SHA-256 hash ze všech signálů

Nic se neposílá nikam kromě dotazu na veřejnou IP. Vše probíhá lokálně v prohlížeči.

## Funkce

- Skóre unikátosti (0–100)
- Porovnání s poslední návštěvou (historie v localStorage)
- Filtrování výsledků
- Kopírování do schránky
- Export JSON
- Přepínání sekcí
- **CZ / EN** lokalizace

## Nasazení

### Cloudflare

```bash
wrangler deploy
```

### GitHub Pages

Push na `main` branch a nastav Pages v nastavení repo.

## Soubory

```
index.html      — česká verze
index.en.html   — anglická verze
page.css        — styly stránky
tool.css        — styly nástroje (výsledky)
script.js       — logika sběru dat a renderování
page.js         — ovládání zobrazení nástroje
```

## License

Volné k použití.
