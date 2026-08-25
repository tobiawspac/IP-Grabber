# IP Grabber — Browser Privacy Check

What does a website know about you? Click once and see.

## What does it show?

- **Public IP address** — via api.ipify.org
- **Local time & timezone**
- **Device type** — desktop vs mobile/tablet
- **Operating system** — Windows / macOS / Linux / Android / iOS
- **Browser** — Chrome / Firefox / Safari / Edge / Opera
- **Battery status** — level and charging state

Everything runs locally in the browser. Nothing is stored or sent anywhere except the IP lookup.

## Files

```
index.html      — page markup
page.css        — page styles
tool.css        — result styles
script.js       — data collection
```

## Deployment

### Cloudflare

```bash
wrangler deploy
```

### GitHub Pages

Push to `main` and enable Pages in repo settings.

## License

Free to use.
