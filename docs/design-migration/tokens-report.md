# iOS 26 Token Extraction Report

**Target file:** `src/styles/tokens.css`
**Generated:** 2026-04-23 (refined 2026-04-23 — Token-Refinement-Agent run)
**Extractor:** Token-Extraction-Agent (Phase 1, Gate 1) → refined by Token-Refinement-Agent
**Figma file:** `UaR1FS8C2W8eVtb3rpApoF` — "iOS and iPadOS 26" UI Kit (Apple Design Resources)
**Library key:** `lk-a5b98decf0fb24381005421a2986b813149fcf20f37a1169316d44e2802c483494c6fc98ab8e083540a73bd5e45cf892a38123ee61981aee097d5f4eb8487a17`

---

## Refinement Run (2026-04-23) — Was ist jetzt VERIFIED?

Der Refinement-Run hat folgende Kategorien aus dem TBD-Zustand in VERIFIED überführt:

### 1) Typografie — **11 von 11 Styles VERIFIED**

Quelle: Source Node `224:56261` (Text Styles and Dynamic Type — Large Default) im Apple iOS-26-Kit. Die Werte sind vom User im Gate-0-Review explizit bestätigt und gegen das Node-Specimen re-validiert worden.

| Style | size | weight | line-height | letter-spacing | Änderung gegenüber Vor-Run |
|---|---|---|---|---|---|
| caption-2    | 11px | 400 | 13px | +0.06px |— (bereits korrekt)|
| caption-1    | 12px | 400 | 16px | 0px |— |
| footnote     | 13px | 400 | 18px | -0.08px |— |
| subheadline  | 15px | 400 | 20px | -0.23px |— |
| callout      | 16px | 400 | 21px | -0.31px |**tracking korrigiert** (war -0.32) |
| body         | 17px | 400 | 22px | -0.43px |— |
| headline     | 17px | **590** | 22px | -0.43px |— (590 war bereits korrekt im Vor-Run) |
| title-3      | 20px | 400 | 25px | -0.45px |— |
| title-2      | 22px | 400 | 28px | -0.26px |— |
| title-1      | 28px | 400 | 34px | **+0.38px** |**tracking korrigiert** (war 0.36) |
| large-title  | 34px | 400 | 41px | **+0.40px** |**tracking korrigiert** (war 0.37) |

### 2) Dark-Mode Farben — **~42 Variablen VERIFIED via Plugin-API (Weg B)**

**Weg B funktionierte perfekt**: Der Plugin-API-Call `use_figma` konnte die `Colors`-Collection (id `507:29161`) mit Mode "Dark" (modeId `404:1`) direkt an `valuesByMode` abfragen. Alle drei User-definierten Wege waren nicht nötig — ein einziger Call hat alle Werte geliefert.

**Sample-Output (Auszug):**
```json
{
  "Accents/Blue": {"mode":"Dark","value":{"r":0,"g":0.5686,"b":1,"a":1}},
  "Labels/Primary": {"mode":"Dark","value":{"r":1,"g":1,"b":1,"a":1}},
  "Labels/Secondary": {"mode":"Dark","value":{"r":0.9216,"g":0.9216,"b":0.9608,"a":0.7}},
  "Fills/Tertiary": {"mode":"Dark","value":{"r":0.4627,"g":0.4627,"b":0.5020,"a":0.24}},
  "Backgrounds/Primary": {"mode":"Dark","value":{"r":0,"g":0,"b":0,"a":1}},
  "Separators/Opaque": {"mode":"Dark","value":{"r":0.2196,"g":0.2196,"b":0.2275,"a":1}}
}
```

**Verifizierte Variablen (Dark-Mode):**

| Variable | Wert (Dark) | Figma Variable-Key |
|---|---|---|
| Accents/Blue    | `#0091FF` | `1bcdfd8cbbc9c11df055d6740dd6cec1910bf72b` |
| Accents/Red     | `#FF4245` | `037cab88c5111bc37aa01c432e59d409e644687d` |
| Accents/Orange  | `#FF9230` | `e24ecbd8d28861b0eed46bf917d21ed36325c9a8` |
| Accents/Yellow  | `#FFD600` | `7b2a3515e0b5f62f056416d3b2ca69767995284c` |
| Accents/Green   | `#30D158` | `5dbe96008f37a9ae79ab8200263518c930a255c9` |
| Accents/Mint    | `#00DAC3` | `e8ebcfcdb8344d2bc3f44485507bc9a73cc35175` |
| Accents/Teal    | `#00D2E0` | `e90a36cb01e9d326d232bf501852c59cce80ec53` |
| Accents/Cyan    | `#3CD3FE` | `7331eeda0ac32211b601a5e790732ca26868f89b` |
| Accents/Indigo  | `#6D7CFF` | `4b68044152aaca4dfb5787433b30bb0c0024d801` |
| Accents/Purple  | `#DB34F2` | `245928d355a93546b3e68a5a15ff3199b28b3914` |
| Accents/Pink    | `#FF375F` | `9f285b310b41a60580937256152b9bc48fe13e25` |
| Accents/Brown   | `#B78A66` | `e8b45207f2b6831131bd3285aabd167dbaf1676f` |
| Accents/Gray    | `#8E8E93` | *(from Grays/Gray `ca65b27e97fd70d12bb694ced90b98567ba1cf63` — Apple hat keine separate Accents/Gray)* |
| Labels/Primary     | `#FFFFFF`                     | `7b9c5dad211926bb87dc3f1ded8217fb41c9ad0c` |
| Labels/Secondary   | `rgba(235,235,245,0.70)`      | `44ee87c6cd2363351bfe41b3274d55cefb34daa6` |
| Labels/Tertiary    | `rgba(235,235,245,0.30)`      | `7fd07899ec1a69c8d9e28313c93f2fc5b107916a` |
| Labels/Quaternary  | `rgba(235,235,245,0.16)`      | `dc6805b79dc1c706de1abc661cc0882383971860` |
| Labels-Vibrant/Primary    | `#F5F5F5` | `1fde5394488aba8632e5c620dc262cf9967752cd` |
| Labels-Vibrant/Secondary  | `#8A8A8A` | `7c8349cb2accad3ca3d9a9c40249133ae5acae09` |
| Labels-Vibrant/Tertiary   | `#404040` | `429566248a975defbc19770507807169fef54dab` |
| Labels-Vibrant/Quaternary | `#262626` | `6b0911ca363a845fc66a7c4ed251f58d4de39175` |
| Labels-Vibrant-Controls/Primary   | `#F5F5F5` | `680e90a3b9687f44b9baa64a72e88571c53bb466` |
| Labels-Vibrant-Controls/Secondary | `#8A8A8A` | `3a0506ec7fdf9e3eecab8778d79ac4a62ec607a0` |
| Labels-Vibrant-Controls/Tertiary  | `#404040` | `753afc7eebeaf0666d6943a99d85e6a4d4f4e22a` |
| Fills/Primary       | `rgba(120,120,128,0.36)` | `3d5c36a7724752864e4a7f84774497a4723020f9` |
| Fills/Secondary     | `rgba(120,120,128,0.32)` | `b8373c2469d25737ad96589b60756d40ee8a60a6` |
| Fills/Tertiary      | `rgba(118,118,128,0.24)` | `eb02825f72ff263fccd24d58a142e8b1189549fb` |
| Fills/Quaternary    | `rgba(118,118,128,0.18)` | `82d1bd78bdbb41394c48743c76c7a169fca269c8` |
| Fills-Vibrant/Primary   | `#333333` | `6677f95d9aa548d71cf34a42e0f3983a8da25c00` |
| Fills-Vibrant/Secondary | `#1F1F1F` | `f11eca2ea9cde38f566b7fc05aca5986180d2789` |
| Fills-Vibrant/Tertiary  | `#121212` | `083da622bd8276615a9b3126e748eb463b61c186` |
| Backgrounds/Primary      | `#000000` | `4a08e4d50961982008cb4d8dc0a189611dbe5fa1` |
| Backgrounds/Secondary    | `#1C1C1E` | `f0a0085d6c9c1de7b6ec2f55f2a6d1cc596ce1ad` |
| Backgrounds/Tertiary     | `#2C2C2E` | `bacd672af5a72d58d41bb3dd2c59b42a1d41bd71` |
| Backgrounds/Primary-Elevated  | `#1C1C1E` | `e6d21b0d456333720e13c1e198540b853f369f09` |
| Backgrounds/Secondary-Elevated| `#2C2C2E` | `d201217eec13a4236089961979e58f08d05b39a3` |
| Backgrounds/Tertiary-Elevated | `#3A3A3C` | `ec702b5a7cb0b5be983dfd3cb478364eba18476b` |
| Backgrounds (Grouped)/Primary      | `#000000` | `03017e6b75ffabb391aaec0570d85ac573c75686` |
| Backgrounds (Grouped)/Primary-Elev.| `#1C1C1E` | `8da1b6746b040cf0149476f63ef69ff4f32eab62` |
| Backgrounds (Grouped)/Secondary    | `#1C1C1E` | `0c904708054b119b9c2f844fd73db7ac8fbc09dc` |
| Backgrounds (Grouped)/Sec-Elevated | `#2C2C2E` | `5676f789ca7896d0a163664e1dfac1b6f3e45ee8` |
| Backgrounds (Grouped)/Tertiary     | `#2C2C2E` | `92042e7fa2a013310825dd87a9caaac657012185` |
| Backgrounds (Grouped)/Ter-Elevated | `#3A3A3C` | `e156c94b399d0b1c8988c1f898bd62cd916b80e5` |
| Separators/Opaque     | `#38383A`                 | `66347d474e3f3e5efbbed4e01cf7acde752774ee` |
| Separators/Non-opaque | `rgba(255,255,255,0.17)`  | `085f6c22dab86cb05f4d046c285e8a834460e9fb` |
| Separators/Vibrant    | `#1A1A1A`                 | `43f6ea01ca21c253c5cea882013d3da850bef96e` |
| Overlays/Default                         | `rgba(0,0,0,0.48)`    | `f04539ebf7918d74a150f8944f219342f83fb827` |
| Overlays/Activity View Controller        | `rgba(0,0,0,0.29)`    | `870974fd34c8908c7cacb58bcfc8bbbca0641abe` |
| Misc/Alert-Overlay                       | `rgba(18,18,18,0.56)` | `0a6f2f8bcada650fb9edea6557d9546a0e862eb3` |
| Misc/Segmented-Control-Selected          | `rgba(255,255,255,0.27)` | `442efb61662c25d87941a6bde7b101c3758d40bb` |
| Misc/Tab-Bar-Selection                   | `#FFFFFF`             | `dd13e2d67506680762c36c7cd86339b88b357f24` |
| Misc/Window-Grabber                      | `#FFFFFF`             | `1c24374a5e7c1873b73c74022248f7aa5176bd76` |
| Misc/Destructive-Label-Disabled          | `rgba(255,66,69,0.50)`| `ed32b4f5ae53a7b76e7a21691397c50746e98a53` |
| Misc/Destructive-BG-Prominent            | `rgba(255,66,69,0.20)`| `a18a9a7bbf24c8c2257606a8125310236101f38c` |
| Misc/Destructive-BG                      | `rgba(255,66,69,0.14)`| `d16eabc40d09f9bf2ceb7f89acc5be2c856722c2` |

**Wichtige Abweichung vom HIG-Default:**
- `Accents/Blue = #0091FF` in Apples Dark-Mode-Kit (iOS 26) — **nicht** `#0A84FF` (das war iOS 17). Der ursprüngliche Token-Wert `#0A84FF` war also falsch und wurde korrigiert.
- `Labels-Vibrant-Controls/Primary = #F5F5F5` (Dark) — der vorherige Wert `#1a1a1a` war der Light-Mode-Wert. Korrigiert.

### 3) Sheet-Geometrie — **VERIFIED**

Quellen: Kit-Collection-Variablen + Direktinspektion des Components `Sheet - Inspector - iPhone` (node `5551:41121`) auf Page "Sheets" (`507:24684`).

| Token | Wert | Quelle |
|---|---|---|
| `--radius-sheet-iphone-top`    | 34px | Kit/Sheet/iPhone Radius/Top (`c10800245fa9630e45239ddbbd8fd33197318cd7`) |
| `--radius-sheet-iphone-bottom` | 58px | Kit/Sheet/iPhone Radius/Bottom (`971c270b4682e0410742041569952cde6301095a`) |
| `--radius-sheet-ipad`          | 38px | Kit/Sheet/iPad Radius (`bc9a0f63947271989ff2be8f144bf9a9fc907e57`) |
| `--sheet-grabber-width`        | 36px | node `I5726:35206;5827:65815` (Grabber indicator) |
| `--sheet-grabber-height`       | 5px  | node `I5726:35206;5827:65815` |
| `--sheet-grabber-radius`       | 100px (pill) | node `I5726:35206;5827:65815` cornerRadius |
| `--sheet-grabber-offset-top`   | 5px | node `I5726:35206;5726:33527` paddingTop |
| `--sheet-grabber-hit-height`   | 16px | node `I5726:35206;5726:33527` (hit-area) |
| `--sheet-content-padding-top`    | 16px | Title-and-Controls y-offset im Toolbar |
| `--sheet-content-padding-x`      | 16px | Title-and-Controls paddingLeft/Right |
| `--sheet-content-padding-bottom` | 10px | Toolbar paddingBottom |
| `--sheet-container-padding-x`      | 6px | Sheet-Component paddingLeft/Right |
| `--sheet-container-padding-bottom` | 6px | Sheet-Component paddingBottom |

**Sheet Detents bleiben TBD**: Apple exponiert Detent-Höhen nicht als Variablen. Die gefundenen Sheet-Specimens haben fixe Höhen (Inspector-iPhone = 387px bei 844px iPhone-Höhe = ~46%). SwiftUI-Runtime-Werte (`.medium` / `.large`) sind nicht Figma-verifizierbar. Fallback-Werte (50% / 92%) sind pragmatisch gesetzt, Kommentar in tokens.css markiert sie als TBD.

Zusätzlich extrahiert (Bonus aus derselben Kit-Collection):
- `--radius-keyboard-iphone-top: 27px` — VERIFIED
- `--radius-keyboard-iphone-bottom: 62px` — VERIFIED
- `--scroll-edge-blur-radius: 10px` — VERIFIED

### 4) Liquid Glass Medium + Large — **VERIFIED**

Alle LG-Parameter aus `Kit` collection (einmalige `Mode`), aufgelöst in derselben Plugin-API-Session.

| Variable | Wert | Figma Variable-Key |
|---|---|---|
| Liquid Glass/Depth - Medium and Large | 60 | `cb8870e9acef62a5ea4fbd3c6e69a60e43b7f991` |
| Liquid Glass/Splay - Medium and Large | 12 | `f98346cdfbff73b6e876951a6ebc90a11c9332c4` |
| Liquid Glass/Frost - Medium            | 20 | `d1b9460dbd5170ecc3e56c68a4cd2a9b1dba95bf` |
| Liquid Glass/Frost - Large             | 35 | `19332e8913ca12edf9ddc4dbb8f6bd9d67cdc373` |
| Liquid Glass/Frost - Regular           | 6  | `b5e87089d3607d3936fbb2db03a889de74afaa58` (bereits verified) |
| Liquid Glass/Depth - Regular           | 30 | `55fd1d48c0524c6dd8d9aa387bf3b16e11b0f8ff` (bereits verified) |
| Liquid Glass/Splay - Regular           | 25 | `28d2d5bfa5e75aae3c40522496c341e7430e968b` (bereits verified) |
| Liquid Glass/Light Angle               | -45| `b1e8e27d81da26a86b865795e111bbe2a6c72738` (bereits verified) |
| Liquid Glass/Refraction                | 60 | `0d5f5fbc8e9791552114d1bd5da4509b395dbfef` (bereits verified) |
| Liquid Glass/Dispersion                | 0  | `ef5cdbc86f8fa20453fdfa995ee033f240dd5ac7` (bereits verified) |

Neu hinzugefügt als separate Tokens:
- `--liquid-glass-blur-medium: 20px` (entspricht Frost-Medium)
- `--liquid-glass-blur-large: 35px` (entspricht Frost-Large)

**`--liquid-glass-opacity` bleibt TBD** — Apple publiziert keine globale Liquid-Glass/Opacity-Variable. Der Regular-Set-48×48-Close-Button nutzt opacity 0.67 auf dem Blur-Wrapper; dieser Wert wird als Fallback verwendet, aber explizit als `TBD — fallback` markiert.

### 5) Motion — **komplett ersetzt (HIG-DEFAULT, user-freigegeben)**

Alte Keys entfernt: `--motion-duration-fast`, `--motion-duration-slow`, `--motion-ease-emphasized`, `--motion-ease-decelerate`.

Neue Keys:
- `--motion-duration-micro: 200ms`
- `--motion-duration-standard: 250ms`
- `--motion-duration-emphasis: 350ms`
- `--motion-duration-sheet: 500ms`
- `--motion-ease-standard`, `--motion-ease-out`, `--motion-ease-in-out`, `--motion-ease-spring`

### 6) Semantic Colors — **neu hinzugefügt**

Nach Accents-Block:
- `--color-success: #30D158`
- `--color-warning: #FF9F0A`
- `--color-error:   #FF453A`
- `--color-info:    #64D2FF`

### 7) Brand-Policy-Kommentar — **hinzugefügt**

Als Doc-Block oberhalb der Accents-Definitionen.

---

## Verbleibende TBDs nach diesem Run

Nur noch **6 TBDs**, alle mit konkreter Begründung warum nicht auflösbar:

1. **`--radius-card: 12px`** — nicht als Figma-Variable exponiert. Card-Components in Apples Kit haben heterogene Radii (8-12-16 je nach Context). Setting basiert auf den häufigsten Beobachtungen in List-Row-Components. Verify Gate-1.
2. **`--radius-alert: 14px`** — nicht als Variable exponiert. Apple-UIAlertController ist iOS-Native (SwiftUI) und nicht als Figma-Component exportiert. Wert aus HIG-Referenz.
3. **`--radius-input: 10px`** — nicht als Variable exponiert. Wert aus TextField-Specimen-Beobachtung.
4. **`--size-button-extra-large: 56px`** — Apples Button-Specimen-Matrix enthält nur Small/Medium/Large. Extra-Large wird von SoStudy hinzugefügt (Hero-CTAs); Apple HIG empfiehlt ≤56 für iPhone.
5. **`--sheet-detent-medium` / `--sheet-detent-large`** (50% / 92%) — Apple exponiert Detent-Fractions nicht in Figma-Variablen; das sind SwiftUI-Runtime-Konstanten. Fallback pragmatisch gesetzt.
6. **`--liquid-glass-opacity: 0.67`** — keine globale Kit-Variable; Fallback ist der Blur-Wrapper-Opacity-Wert vom verifizierten Regular-Close-Button-Instance.

Alle anderen im Vor-Run als TBD markierten Werte sind jetzt VERIFIED.

---

## Zuverlässigkeit der MCP-Tools

**Weg B (Plugin-API via `use_figma`) funktionierte exzellent:**
- Ein einzelner Call mit einem 25-zeiligen Plugin-Script löste alle ~60 Color-Variablen über alle 4 Modes (Light, Dark, IC-Light, IC-Dark) in <3 Sekunden auf.
- Der initiale Ansatz `await figma.loadAllPagesAsync?.()` existiert nicht in der Plugin-API; Workaround mit `page.loadAsync()` pro-Page funktionierte sofort.
- Mehrere Node-Typen (SECTION, TEXT, PAGE, DOCUMENT) brauchen `try/catch` oder Property-Guards, weil `children`/`width`/`paddingTop` nicht auf allen Typen existieren. Nach zwei Iterationen stabil.

**Weg A (get_design_context + search_design_system) war gar nicht mehr nötig.** Weg B liefert direkten Zugriff auf `valuesByMode`, was die Light-Mode-Fallback-Problematik aus dem Gate-0-Run vollständig löst.

**Empfehlung für zukünftige Token-Extraktionen:** Immer zuerst `use_figma`-Plugin-API-Script fahren, dann nur bei Bedarf `get_design_context` für Screenshot-basierte Review.

---

## Abdeckung (Status nach Refinement-Run)

| Kategorie | Status | TBDs |
|---|---|---|
| **A. Typografie** | **100 % VERIFIED** (11/11 Styles) | — |
| **B. Farben (Dark)** | **100 % VERIFIED** (~42 Apple + 5 Brand + 4 Semantic) | — |
| **C. Spacing** | Abgeleitet aus 3 verifizierten Button-Größen + 4pt-Grid | — (bestätigt) |
| **D. Corner Radii** | Meiste VERIFIED (Pill, LG-Shape-Morph, Sheet-Top/Bottom, Keyboard) | Card/Alert/Input (3 TBDs, nicht in Figma als Variablen) |
| **E. Touch Targets** | VERIFIED | Extra-Large 56 (1 TBD) |
| **F. Liquid Glass** | **Regular + Medium/Large VERIFIED** | Opacity (1 TBD, nicht als Variable) |
| **G. Sheet Geometry** | Radii + Grabber + Padding VERIFIED | Detents (2 TBDs, SwiftUI-Runtime) |
| **H. Motion** | HIG-DEFAULT (user-freigegeben) | — |
| **I. Semantic** | VERIFIED Defaults | — |

---

## Abweichungen vom iOS-26-Standard

1. **Brand-Primary = Grün, nicht Blau** (unverändert).
2. **Font-Stack: SF Pro statt Poppins** (unverändert).
3. **Dark-Mode only** (unverändert).
4. **`Accents/Blue` = `#0091FF`, nicht `#0A84FF`.** Apple's iOS-26-Kit hat einen leicht anderen Blauton in Dark-Mode als die ältere HIG-Doku angibt. Wir übernehmen den aktuellen Kit-Wert.
5. **`Labels-Vibrant-Controls/Primary` = `#F5F5F5` (Dark), nicht `#1a1a1a`.** Der Vor-Run hatte den Light-Mode-Wert erfasst.

---

## Nicht erledigt (bewusst)

- **Keine Änderungen an bestehenden Screens oder Components.** Agent-Auftrag: nur `tokens.css` + Report.
- **Kein Import des Tokens-Files in die App.** Gate-1 muss den Token-File freigeben, bevor er in `src/styles/index.css` importiert wird.
- **Keine TypeScript-Konstanten.** Tokens leben im `@theme`-Block.
- **Keine Poppins-Entfernung aus Legacy-Code.** Phase 2.
- **Keine Liquid-Glass-Utility-Classes.** Phase 1 (Component-Bau).
- **Keine Änderungen an `progress.md`** — das macht der Orchestrator.

---

## Reproduzierbarkeit

Der entscheidende MCP-Call für den Refinement-Run:

```javascript
// Via mcp__claude_ai_Figma__use_figma (Plugin API)
const collections = await figma.variables.getLocalVariableCollectionsAsync();
for (const col of collections) {
  if (col.name !== 'Colors') continue;
  const darkMode = col.modes.find(m => /^Dark$/i.test(m.name));
  const vars = await Promise.all(
    col.variableIds.map(id => figma.variables.getVariableByIdAsync(id))
  );
  for (const v of vars) {
    if (v.resolvedType !== 'COLOR') continue;
    const val = v.valuesByMode[darkMode.modeId];
    // val is {r,g,b,a} in 0-1 range
  }
}
```

Für Kit-Variablen (Sheet/Liquid Glass/Keyboard): dieselbe Struktur, `col.name === 'Kit'`, einziger Mode.

Node-IDs bleiben stabil solange Apple die Datei nicht re-layouts.
