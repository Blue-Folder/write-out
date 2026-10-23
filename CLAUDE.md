# WRITE OUT – kontext projektu

Osobní projekt Barbory ze studia Blue Folder (GitHub organizace `Blue-Folder`): webová appka na tablet (PWA), soukromý zápisník na ručně psané poznámky. Nejde do App Storu ani Google Play. Hostuje se na GitHub Pages a přidává se na plochu. Barbora se na projektu učí, jak to celé funguje: vysvětluj jí změny srozumitelně, česky a bez zbytečného žargonu.

Komunikace: česky.

## Co appka umí
- Knihovna se složkami a dokumenty, vyhledávání.
- Dokument = nekonečné plátno, na kterém leží stránky vedle sebe jako artboardy v Illustratoru. Stránky jde přesouvat, měnit jim velikost a pozadí (linky, čtverečky…).
- Nástroje: pero, guma, laso, text, ruka, vkládání obrázků.
- Převod rukopisu na text přes Handwriting Recognition API prohlížeče (běží jen v zařízení, kde to prohlížeč podporuje).
- Záloha celé knihovny jako JSON text a obnova ze zálohy.

## Soukromí
Texty jsou soukromé, i před AI. Nic se neposílá na server: data jsou v IndexedDB / localStorage v zařízení. Nepřidávej žádné odesílání dat, analytiku ani externí knihovny bez výslovného přání.

## Technika
- Všechno v jednom souboru `index.html` (HTML + CSS + JS, bez knihoven a bez build kroku).
- Písma jsou v `fonts/` (Big Shoulders Display, IBM Plex Sans a Mono, Literata; latin + latin-ext), žádné Google Fonts, aby appka fungovala offline.
- `sw.js`: offline režim. HTML ze sítě (max 3 s), jinak z cache; ostatní z cache. Ukládá jen skutečné soubory appky (ne přesměrování ani chybové stránky, např. přihlášení k hotelové wifi). `index.html` a `./` musí jít stáhnout, zbytek je „best effort“. Při změně ikon, písem nebo manifestu zvyš `VERSION`.
- V menu appky je řádek „Offline“: ukazuje, jestli je offline kopie v zařízení hotová.
- Barvy jsou v CSS jako proměnné (`--desk`, `--chrome`, `--ink`, `--accent`…) se světlým i tmavým režimem.
- Web: https://blue-folder.github.io/write-out/ (GitHub Pages z větve `main`), repozitář `Blue-Folder/write-out`.
- Commity podepisuj jako `barbaritta <barbaritta@users.noreply.github.com>`, ne celým jménem ani osobním e-mailem.
