# What your browser tells

Malá stránka, která ukáže, co o tobě prozradí prohlížeč hned po otevření webu — bez cookies, bez loginu, bez ukládání dat.

## Funkce

- **Veřejná IP** – dotaz na `api.ipify.org`
- **Lokální čas** a **časová zóna** – z `Date` a `Intl.DateTimeFormat`
- **Typ zařízení** – Desktop / Mobile-tablet (podle user agenta a `pointer: coarse`)
- **Operační systém** – Windows, macOS, Linux, ChromeOS, Android (s verzí), iOS
- **Prohlížeč** – Chrome, Firefox, Safari, Edge, Opera
- **Stav baterie** – přes Battery Status API (pokud ho prohlížeč podporuje)

Vše se zjišťuje až po kliknutí na tlačítko "Show my info" — nic neběží automaticky na pozadí.

## Jak spustit

Stačí stáhnout repo a otevřít `index.html` v prohlížeči. Žádný build, žádné závislosti.

## Poznámka k datům

Jediný request, který opouští stránku, je dotaz na `api.ipify.org` kvůli veřejné IP. Zbytek (OS, prohlížeč, baterie, čas) se počítá lokálně z dat, která už má prohlížeč sám o sobě k dispozici každé navštívené stránce.
