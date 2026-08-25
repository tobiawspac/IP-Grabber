# What your browser tells

*(Česky níže / Czech version below)*

A small page that shows what your browser reveals about you the moment you open it — no cookies, no login, no data storage.

## Features

* **Public IP** – queried from `api.ipify.org`
* **Local time and timezone** – from `Date` and `Intl.DateTimeFormat`
* **Device type** – Desktop / Mobile-tablet (based on user agent and `pointer: coarse`)
* **Operating system** – Windows, macOS, Linux, ChromeOS, Android (with version), iOS
* **Browser** – Chrome, Firefox, Safari, Edge, Opera
* **Battery status** – via the Battery Status API (if supported by the browser)

Everything is only detected after clicking the "Show my info" button — nothing runs automatically in the background.

## How to run

Just clone the repo and open `index.html` in your browser. No build step, no dependencies.

## A note on data

The only request that leaves the page is the call to `api.ipify.org` for the public IP. Everything else (OS, browser, battery, time) is computed locally from data every visited page already has access to.

---

# What your browser tells

*(English version above)*

Malá stránka, která ukáže, co o tobě prozradí prohlížeč hned po otevření webu — bez cookies, bez loginu, bez ukládání dat.

## Funkce

* **Veřejná IP** – dotaz na `api.ipify.org`
* **Lokální čas a časová zóna** – z `Date` a `Intl.DateTimeFormat`
* **Typ zařízení** – Desktop / Mobile-tablet (podle user agenta a `pointer: coarse`)
* **Operační systém** – Windows, macOS, Linux, ChromeOS, Android (s verzí), iOS
* **Prohlížeč** – Chrome, Firefox, Safari, Edge, Opera
* **Stav baterie** – přes Battery Status API (pokud ho prohlížeč podporuje)

Vše se zjišťuje až po kliknutí na tlačítko "Show my info" — nic neběží automaticky na pozadí.

## Jak spustit

Stačí stáhnout repo a otevřít `index.html` v prohlížeči. Žádný build, žádné závislosti.

## Poznámka k datům

Jediný request, který opouští stránku, je dotaz na `api.ipify.org` kvůli veřejné IP. Zbytek (OS, prohlížeč, baterie, čas) se počítá lokálně z dat, která už má prohlížeč sám o sobě k dispozici každé navštívené stránce.
