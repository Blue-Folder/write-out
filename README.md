# WRITE OUT

Soukromý zápisník na tablet. Píšeš perem, stránky leží vedle sebe na nekonečném plátně jako artboardy v Illustratoru a ručně psaný text jde jedním klepnutím převést na text. Poznámky zůstávají jen v tvém zařízení.

## Co je v repozitáři

| Soubor | K čemu je |
|---|---|
| `index.html` | Celá appka: vzhled (CSS), obrazovky (HTML) i logika (JavaScript). Tady probíhá většina úprav. |
| `manifest.webmanifest` | „Občanka“ appky: název, ikona, barvy. Díky ní jde WRITE OUT dát na plochu a otevře se bez lišty prohlížeče. |
| `sw.js` | Service worker. Uloží appku do tabletu, takže se otevře i bez internetu, a stahuje nové verze. |
| `fonts/` | Písma uložená přímo v appce, aby vypadala stejně i offline. |
| `icons/` | Ikony na plochu. |
| `.nojekyll` | Prázdný soubor, který říká GitHub Pages, ať soubory nijak neupravuje. |

## Kde jsou poznámky

Poznámky **nejsou na GitHubu ani na žádném serveru**. Ukládají se do úložiště prohlížeče v tabletu (IndexedDB). Na GitHubu je jen prázdná appka.

Když v prohlížeči smažeš data webů, poznámky zmizí. Proto si občas udělej zálohu: menu vpravo nahoře → Záloha celé knihovny.

## Jak to běží na internetu

Appka patří do studia **Blue Folder** a hostuje ji **GitHub Pages** zdarma. Zapíná se jednou: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main`, složka `/ (root)` → Save**.

Adresa: **https://blue-folder.github.io/write-out/**

## Jak si ji dát na plochu

- **iPad:** otevři odkaz v Safari → tlačítko Sdílet → Přidat na plochu.
- **Android tablet:** otevři odkaz v Chromu → menu ⋮ → Nainstalovat aplikaci / Přidat na plochu.

Po prvním otevření s internetem appka funguje i offline.

## Jak probíhají úpravy

1. Změníš soubor (nejčastěji `index.html`) a uložíš změnu na GitHub (commit + push).
2. GitHub Pages web do minuty sám aktualizuje.
3. Na tabletu se nová verze stáhne při dalším otevření appky s internetem. Poznámky zůstanou.

Když změníš ikony, písma nebo manifest, zvyš v `sw.js` číslo verze (`writeout-v1` → `writeout-v2`).
