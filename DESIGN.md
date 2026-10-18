---
name: Spot Spotter
description: Outdoor surveyor's architectural field atlas and civic square building spotter
colors:
  vermilion: "#B8291C"
  vermilion-tint: "#FCEAE8"
  cobalt: "#164488"
  cobalt-tint: "#E5EFFB"
  ochre: "#9A6300"
  ochre-tint: "#FDF4E2"
  verdigris: "#1C5A37"
  verdigris-tint: "#E3F3EA"
  carbon-purple: "#532B78"
  bg-buff: "#E4EDF4"
  bg-buff-elevated: "#F2F7FB"
  bg-buff-sunken: "#D2E0EC"
  ink-primary: "#0F1A26"
  ink-secondary: "#2A3B4E"
  ink-muted: "#455970"
  rule-hairline: "#0F1A26"
  rule-subtle: "#96ADC2"
  night-bg-buff: "#0E1621"
  night-bg-elevated: "#152130"
  night-bg-sunken: "#091018"
  night-ink-primary: "#ECF3F9"
  night-ink-secondary: "#B8CAE0"
  night-rule-hairline: "#3C526B"
typography:
  display:
    fontFamily: "'Bricolage Grotesque', system-ui, -apple-system, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Bricolage Grotesque', system-ui, -apple-system, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Bricolage Grotesque', system-ui, -apple-system, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 700
    lineHeight: 1.18
  body:
    fontFamily: "'Atkinson Hyperlegible', system-ui, -apple-system, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0.03em"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "14px"
  2xl: "16px"
components:
  button-primary:
    backgroundColor: "{colors.vermilion}"
    textColor: "#FFFFFF"
    typography: "{typography.headline}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.bg-buff-elevated}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "42px"
  button-icon:
    backgroundColor: "{colors.bg-buff-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "38px"
  chip-landmark:
    backgroundColor: "{colors.bg-buff-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "0 9px"
    height: "36px"
  chip-landmark-active:
    backgroundColor: "{colors.vermilion-tint}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "0 9px"
    height: "36px"
  input-key:
    backgroundColor: "{colors.bg-buff-elevated}"
    textColor: "{colors.ink-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 10px"
    height: "40px"
---

# Design System: Spot Spotter

## Overview

**Creative North Star: "The Cadastral Field Plate"**

Spot Spotter treats the smartphone screen not as a consumer social feed or a generic pin-dropper, but as a precision architectural survey instrument carried into a sunlit civic square. Drawing from 19th- and 20th-century Sanborn Fire Insurance Atlases, cyanotype architectural blueprints, star-atlas magnitude notation, and high-density tabular field guides, every UI surface is structured by crisp 1px iron-gall hairlines, squared cadastral cells, and categorical masonry inks. Rather than hiding landmark identities inside anonymous map pins that require exploratory tapping, the interface anchors multi-cell name banners directly over building footprints so the observer can orient themselves at a glance.

The system balances technical authority with outdoor smartphone ergonomics. Because the primary operating context is standing in a bright public plaza, the daylight ground shifts away from warm yellow-cream paper toward a cool, glare-resistant cyanotype blueprint slate (`--bg-buff`), paired with deep iron-gall ink and WCAG AA-compliant structural pigments for Parliament/Civic, Law, Cultural, and Sacred buildings. A zero-latency night-survey inversion flips the entire cadastral plate and underlying map tiles for evening orientation. Full-color landmark photography is strictly quarantined inside a double-ruled chromolithograph plate frame within the slide-up dossier sheet, preserving the graphic clarity of the cartographic stage.

**Key Characteristics:**
- **Hairline-Ruled Cadastral Cells:** Zero-radius (`0px`) rectangular compartments divided by 1px structural rules (`#0F1A26` in daylight, `#3C526B` in night mode) that pack index numbers, category tags, building titles, and metric telemetry without decorative bloat.
- **Persistent Footprint Callout Banners:** Floating 3-cell architectural flags anchored to structures via a 2px vertical stem and a magnitude-scaled anchor dot (`13px`, `10px`, or `8px`) indicating monument prominence.
- **Categorical Structural Pigments:** Four high-contrast masonry inks—Vermilion (`--vermilion`), Cobalt (`--cobalt`), Ochre (`--ochre`), and Verdigris (`--verdigris`)—plus Carbon Purple (`--carbon-purple`) for the persistent `INSPECTED ✓` verification stamp.
- **Lexicon Guide-Word Telemetry Bar:** A continuous monospace running subheader reporting the active visible span of numbered landmarks (`SPAN: [01] ... — [06] ...`) alongside live tabular GPS coordinates.
- **Quarantined Chromolithograph Plate:** Landmark photographs appear exclusively inside a double-bordered mat frame (`.chromo-plate-frame`) with archive attribution and inspection status in the caption bar.

## Colors

The palette pairs a cool cyanotype blueprint paper ground with deep iron-gall typography and five high-contrast cadastral coding inks engineered for outdoor sunlight legibility (all categorical badge fills maintain ≥4.5:1 contrast against `#FFFFFF` text).

### Primary
- **Cadastral Vermilion** (`#B8291C` day / `#D93B2B` night): Primary action color and the categorical ink for parliamentary, royal, and primary civic masonry structures. Used on the cadastral seal, the primary "Pinpoint Me & Spot Around" CTA, selected callout borders, and `[01]` civic index cells.
- **Vermilion Wash Tint** (`#FCEAE8` day / `#331614` night): Active background fill for the selected building chip in the bottom index strip.

### Secondary
- **Surveyor Cobalt** (`#164488` day / `#2D6BC4` night): Categorical ink for courts, ministries, and halls of justice (`.callout-cat-law`), the live user GPS beacon core and pulse ring, and the active Google Maps engine indicator dot.
- **Cobalt Wash Tint** (`#E5EFFB` day / `#12233B` night): Active state background for header mode toggles (`.icon-btn.active-mode`).

### Tertiary
- **Masonry Ochre** (`#9A6300` day / `#C98A14` night): Categorical ink for museums, assembly halls, and cultural monuments (`.callout-cat-culture`), paired with **Ochre Wash Tint** (`#FDF4E2` day / `#2B210E` night).
- **Park Verdigris** (`#1C5A37` day / `#2B7A4B` night): Categorical ink for cathedrals, abbeys, and sacred landmarks (`.callout-cat-sacred`), the default zero-key engine status dot, and the free-tier cost callout box border, paired with **Verdigris Wash Tint** (`#E3F3EA` day / `#11291B` night).
- **Carbon Stamp Purple** (`#532B78` day / `#A982CE` night): Dedicated archival rotary-stamp ink used exclusively for the `INSPECTED ✓` badge on visited building callouts and dossier plates.

### Neutral
- **Cyanotype Blueprint Ground** (`#E4EDF4` day / `#0E1621` night): Primary app shell surface for the top surveyor header, bottom thumb-zone dock, and slide-up dossier sheet (`--bg-buff`). Note: While early concept exploration referenced a warm surveyor buff (`#F4EFE3`), the shipped build deliberately establishes a cool cyanotype slate ground to eliminate warm-cream glare in daylight and sharpen contrast against map tiles.
- **Elevated Plate Surface** (`#F2F7FB` day / `#152130` night): Raised cell background for floating building callouts, buttons, metric grids, and the chromolithograph photo mat (`--bg-buff-elevated`).
- **Sunken Telemetry Well** (`#D2E0EC` day / `#091018` night): Recessed surface for the Lexicon guide-word bar, callout distance cells, dossier top header bar, and map canvas backdrop (`--bg-buff-sunken`).
- **Iron-Gall Primary Ink** (`#0F1A26` day / `#ECF3F9` night): Primary text, display headings, primary dark action links, and the 1px structural hairline rule in daylight (`--ink-primary` / `--rule-hairline`).
- **Slate Secondary Ink** (`#2A3B4E` day / `#B8CAE0` night): Category tags, distances, subtitles, and guide-bar metadata (`--ink-secondary`).
- **Subtle Compartment Rule** (`#96ADC2` day / `#243549` night): Secondary 1px internal cell dividers inside callout boxes, index chips, and the 3-column telemetry grid (`--rule-subtle`).

### Named Rules
**The Sunlight AA Invariant Rule.** Every categorical pigment cell (`--vermilion`, `--cobalt`, `--ochre`, `--verdigris`) must maintain at least a 4.5:1 contrast ratio against crisp white (`#FFFFFF`) monospace numerals in daylight mode so index numbers remain effortless to read outdoors.

**The Carbon Inspection Ink Rule.** Carbon Purple (`--carbon-purple`) is reserved strictly for the `INSPECTED ✓` verification mark on buildings the user has already opened; never use it for general decorative accents or unvisited controls.

## Typography

**Display Font:** `'Bricolage Grotesque'` (with `system-ui, -apple-system, sans-serif` fallback)
**Body Font:** `'Atkinson Hyperlegible'` (with `system-ui, -apple-system, sans-serif` fallback)
**Label/Mono Font:** `'JetBrains Mono'` (with `monospace` fallback and `font-variant-numeric: tabular-nums`)

**Character:** Architectural grotesque authority meets extreme outdoor legibility. `Bricolage Grotesque` gives building names and dossier titles a crisp, engraved plaque presence at tight tracking (`-0.02em`), `Atkinson Hyperlegible` ensures effortless scanning of architectural summaries and controls under bright sun, and `JetBrains Mono` locks plate numbers, compass bearings, distances, and coordinates into a rigid tabular grid.

### Hierarchy
- **Display / Dossier Heading** (`700` weight, `1.35rem`, `1.15` line-height, `-0.02em` letter-spacing): Landmark title inside the slide-up Inspector Plate dossier sheet (`.dossier-heading`) and API setup drawer.
- **Headline / App Title** (`700` weight, `1.05rem`, `1.15` line-height, `-0.02em` letter-spacing): Top bar brand header (`.app-title`) and primary CTA button label (`0.9rem`).
- **Title / Callout Building Name** (`700` weight, `0.84rem`, `1.18` line-height): Landmark name inside floating map callout banners (`.callout-name`), clamped to 2 lines maximum.
- **Body / Architectural Summary** (`400` weight, `0.95rem`, `1.55` line-height, max-width `68ch`): Historical and architectural prose in `.dossier-summary`; `700` weight at `0.8125rem–0.88rem` is used for interactive buttons, square selector, and dossier subtitle.
- **Label / Cadastral Telemetry** (`600–700` weight, `0.75rem–0.84rem`, `1.15` line-height, `0.03em–0.04em` letter-spacing, uppercase on category tags and metric headers): Used for `.lexicon-guide-bar`, `.callout-num`, `.callout-type-tag`, `.callout-meta`, `.dossier-plate-id`, and `.cadastral-metrics-grid`.

### Named Rules
**The Tabular Telemetry Rule.** All coordinates, distances (`140 m`), compass bearings (`112° ESE`), and plate indices (`#01`) must use `JetBrains Mono` with `font-variant-numeric: tabular-nums` so numbers never jitter when live GPS updates.

**The No-Kicker Heading Rule.** Headings (`h1`, `h2`) stand on their own typographic weight; plate identification (`PLATE #01`) belongs in the structural window header bar (`.dossier-top-bar`) above the chromolithograph frame, never as an eyebrow or kicker stacked directly above a heading.

## Layout

Spot Spotter uses a fixed full-viewport (`100dvh`, `overflow: hidden`) cartographic stage (`.map-stage`) overlaid by a `pointer-events: none` foreground surveyor frame (`.app-shell`) that concentrates interactive chrome at the top and bottom edges of the viewport:

- **Top Surveyor Header Bar (`--header-h: 94px`):** Full-width top bar (`z-index: 30`) split into two horizontal bands: a `54px` minimum-height main control row (`8px 12px` padding, `8px` gap) housing the cadastral seal, app title, square preset `<select>`, Google Maps Key status button, and day/night theme toggle; followed by the recessed `.lexicon-guide-bar` (`4px 12px` padding) displaying the visible monument span and live coordinates.
- **Interactive Map Canvas (`100dvh`):** Full-bleed Leaflet (`#leaflet-map`) or Google Maps (`#google-map`) canvas (`z-index: 1`) where building callouts float directly over structure footprints. Leaflet tiles receive a subtle cadastral filter (`contrast(1.06) brightness(0.97) saturate(0.82)` in daylight; `invert(0.92) hue-rotate(195deg) contrast(1.12) brightness(0.86)` at night).
- **Bottom Thumb-Zone Dock (`--dock-h: 110px`):** Anchored at the bottom edge (`padding: 8px 12px calc(10px + env(safe-area-inset-bottom, 0px))`, `gap: 8px`, `z-index: 30`) for single-handed smartphone operation. Contains the horizontally scrolling `.landmark-strip` of numbered building chips (`6px` gap) above the primary `.dock-controls-row` (`Pinpoint Me & Spot Around` flex-1 button + `Scan Map Area` button).
- **Responsive Breakpoint (`@media (min-width: 768px)`):** On tablet and desktop viewports, the bottom dock constrains to `max-width: 680px` centered with `14px` bottom margin and a full 1px perimeter border, while the `.dossier-sheet` converts from a bottom-anchored slide-up sheet (`max-width: 560px`, `max-height: 82dvh`) into a right-hand floating inspector panel (`width: 400px`, `right: 20px`, `bottom: calc(var(--dock-h) + 16px)`) that slides horizontally via `translateX`.

## Elevation & Depth

The system uses a hybrid of **1px structural ink borders** and **soft, atmospheric offset-blur shadows** to separate floating surveyor plates from the underlying map canvas. Hard zero-blur block shadows are strictly avoided so that callout banners read as physical paper labels hovering above an architectural plan rather than neobrutalist cartoons.

### Shadow Vocabulary
- **Badge Elevation** (`--shadow-badge: 0 3px 10px rgba(15, 26, 38, 0.18), 0 1px 3px rgba(15, 26, 38, 0.12)` day / `0 4px 14px rgba(0, 0, 0, 0.58), 0 1px 4px rgba(0, 0, 0, 0.42)` night): Applied to floating map `.callout-box` banners, the top `.survey-header`, status toasts, and the desktop floating dock.
- **Selected Callout Elevation** (`--shadow-badge-active: 0 8px 22px rgba(184, 41, 28, 0.3), 0 2px 6px rgba(15, 26, 38, 0.22)` day / `0 8px 26px rgba(217, 59, 43, 0.38), 0 2px 8px rgba(0, 0, 0, 0.65)` night): Paired with a `1px solid var(--vermilion)` outline and `scale(1.05)` lift when a building callout is hovered or active.
- **Sheet Elevation** (`--shadow-sheet: 0 -8px 32px rgba(15, 26, 38, 0.24)` day / `0 -10px 36px rgba(0, 0, 0, 0.7)` night): Cast upward by the slide-up `.dossier-sheet` and `.api-drawer` dialogs.

### Named Rules
**The Soft-Blur Cadastral Lift Rule.** Every floating plate combines a crisp `1px solid var(--rule-hairline)` perimeter rule with a soft multi-layered blur shadow (`--shadow-badge`); never use zero-blur hard offset shadows (`4px 4px 0`) or borderless blurred glass.

## Shapes

Spot Spotter enforces a disciplined **orthogonal cadastral geometry**:
- **Zero Corner Radius (`0px`):** All buttons, callout banners, index chips, metric cells, inputs, scrollbars, and sheet containers use sharp `0px` corners. Every element is a ruled rectangular compartment in a surveyor's ledger.
- **Circular Cartographic Anchors (`50%` radius):** Circles are reserved strictly for spatial point markers on the map and status LEDs: the magnitude-scaled building anchor dots (`.callout-anchor-dot` at `13px`, `10px`, and `8px`), the pulsing user GPS beacon (`.user-gps-core` at `14px`), and the `7px` engine indicator dot (`.engine-dot`).
- **Multi-Cell Hairline Compartments:** Components are subdivided internally by `1px solid var(--rule-hairline)` or `1px solid var(--rule-subtle)` vertical and horizontal lines rather than whitespace alone (e.g., the 3-column `.callout-box`, 2-cell `.strip-chip`, and 3-column `.cadastral-metrics-grid`).
- **Double-Ruled Chromolithograph Frame:** The `.chromo-plate-frame` wraps landmark photography in a `5px` elevated mat with a `1px solid var(--rule-hairline)` outer border and a `1px solid var(--rule-subtle)` inner aperture border (`.chromo-plate-inner`, `height: 188px`).

## Components

Every interactive component feels like a precision brass-and-paper surveyor control: squared corners, 1px hairline borders, high-contrast tabular numerals, and immediate tactile feedback.

### Buttons
- **Shape:** Squared cadastral rectangle (`0px` radius) with a `1px solid var(--rule-hairline)` border.
- **Primary (`.pinpoint-btn`, `.save-key-btn`):** Cadastral Vermilion background (`#B8291C`), white text (`#FFFFFF`), `Bricolage Grotesque` `700` weight (`0.9rem`), `42px` height (`0 14px` padding), subtle vermilion drop shadow (`0 2px 6px rgba(184, 41, 28, 0.25)`), inline crosshair SVG icon.
- **Secondary / Utility (`.scan-btn`, `.dossier-secondary-btn`):** Elevated plate background (`--bg-buff-elevated`), primary ink text (`--ink-primary`), `1px solid var(--rule-hairline)`, `40px–42px` height (`0 12px` padding), `Atkinson Hyperlegible` `700` weight (`0.84rem`).
- **Header Icon Button (`.icon-btn`):** `38px` height, `min-width: 38px`, `0 10px` padding, elevated plate background, `1px solid var(--rule-hairline)`. Active engine state (`.icon-btn.active-mode`) shifts to `--cobalt-tint` background with `--cobalt` border and text.
- **Hover / Focus / Active:** Primary buttons brighten (`filter: brightness(1.06)`); secondary and icon buttons shift background to `--bg-buff-sunken`; active press translates `translateY(1px)`; keyboard `:focus-visible` renders a `2px solid var(--vermilion)` outline with `2px` offset.

### Chips (`.strip-chip`)
- **Style:** Two-compartment horizontal rectangular chip (`height: 36px`, `0px` radius, `1px solid var(--rule-hairline)`) in the bottom `.landmark-strip`. Left compartment (`.strip-chip-num`) holds the monospace building number (`0 7px` padding, `--bg-buff-sunken` background, `1px solid var(--rule-subtle)` right divider); right compartment (`.strip-chip-label`) holds the bold building name (`0 9px` padding, `--bg-buff-elevated` background).
- **State:** When selected (`.strip-chip.is-active`), the outer border shifts to `--vermilion`, the label cell tints to `--vermilion-tint`, and the number cell fills with solid `--vermilion` and `#FFFFFF` text.

### Cards / Containers (`.dossier-sheet`, `.cadastral-metrics-grid`)
- **Corner Style:** `0px` sharp corners across all sheets, dialogs, and metric grids.
- **Background:** `--bg-buff` outer sheet surface with a `--bg-buff-sunken` header bar (`.dossier-top-bar`) and `--bg-buff-elevated` inner frames (`.chromo-plate-frame`, `.cadastral-metrics-grid`).
- **Shadow Strategy:** Upward sheet shadow (`--shadow-sheet`) on mobile bottom sheets; badge shadow (`--shadow-badge`) on floating desktop containers.
- **Border:** `2px solid var(--rule-hairline)` top border and `1px solid var(--rule-hairline)` side borders on mobile sheets; full `1px solid var(--rule-hairline)` perimeter on desktop and on internal grids.
- **Internal Padding:** `8px 14px` on sheet header bars; `14px` (`12px` vertical gap) on `.dossier-scroll-body`; `6px 8px` inside `.metric-cell`.

### Inputs / Fields (`.square-select`, `.key-input`)
- **Style:** Squared `0px` radius fields with `--bg-buff-elevated` background, `1px solid var(--rule-hairline)` border, and `--ink-primary` text. `.square-select` uses a custom inline SVG chevron (`padding: 2px 24px 2px 8px`, `0.8125rem` bold); `.key-input` uses `40px` height, `0 10px` padding, and `JetBrains Mono` (`0.84rem`).
- **Focus:** `2px solid var(--vermilion)` outline at `2px` offset (`caret-color: var(--vermilion)`).

### Navigation (`.survey-header` & `.bottom-dock`)
- **Top Header Bar:** Combines the vermilion `.cadastral-seal` (`34x34px`), app title, square selector dropdown, Google Maps engine pill button, and theme toggle above the full-width `.lexicon-guide-bar`.
- **Bottom Thumb-Zone Dock:** Pairs the horizontally scrollable `.landmark-strip` index with the primary GPS pinpoint CTA and map scan trigger.

### Cadastral Building Callout Banner (`.cadastral-callout`)
- **Structure:** The signature map overlay component. Consists of a 3-column `.callout-box` (`grid-template-columns: auto 1fr auto`, `min-width: 152px`, `max-width: 248px`, `1px solid var(--rule-hairline)`, `--shadow-badge`), a `2px × 10px` vertical pointer stem (`.callout-stem`), and a circular anchor dot (`.callout-anchor-dot`) scaled by monument magnitude (`mag-1`: `13px`, `mag-2`: `10px`, `mag-3`: `8px`).
- **Compartments:** Left `.callout-num` cell colored by building category (`--vermilion`, `--cobalt`, `--ochre`, `--verdigris`); center `.callout-body` stacking the uppercase monospace category tag (`.callout-type-tag`) over the 2-line `Bricolage Grotesque` building name (`.callout-name`); right `.callout-meta` cell on `--bg-buff-sunken` showing tabular distance (`183 m`) and, once viewed, the carbon-purple `.callout-stamp` (`✓`).
- **Interaction:** Hovering or selecting applies `transform: translate(-50%, -104%) scale(1.05)`, elevates `z-index: 900`, and highlights the box border, outline, and stem in `--vermilion`.

## Do's and Don'ts

### Do:
- **Do** anchor persistent, multi-cell building callout banners (`.cadastral-callout`) directly over landmark footprints with a vertical stem and magnitude-scaled anchor dot (`13px`, `10px`, `8px`).
- **Do** quarantine all landmark photography inside the double-ruled `.chromo-plate-frame` (`5px` elevated mat, `1px solid var(--rule-hairline)` outer border, `1px solid var(--rule-subtle)` inner border) with source attribution and inspection stamp below.
- **Do** enforce `0px` border-radius on all UI chrome, buttons, chips, inputs, and sheets, reserving `50%` circular radii strictly for map coordinate anchor dots, the GPS beacon, and status LED dots.
- **Do** use `JetBrains Mono` with `font-variant-numeric: tabular-nums` (`.tabular`) for every index number, distance, compass bearing, and GPS coordinate.
- **Do** maintain full parity between `[data-theme="day"]` and `[data-theme="night"]`, inverting both the UI token variables and the Leaflet map tile filter simultaneously.

### Don't:
- **Don't** hide building names behind anonymous drop pins that require tapping before the user can see what a structure is.
- **Don't** place kickers or eyebrows directly above headings; keep plate numbers and category pills inside the structural `.dossier-top-bar` header chrome.
- **Don't** use rounded corners (`4px`, `8px`, `16px`), glassmorphism (`backdrop-filter: blur`), gradient text, or hard zero-blur neobrutalist offset shadows (`box-shadow: 4px 4px 0`).
- **Don't** allow full-bleed unframed photographs to touch the edges of sheets or cards, or place photographs inside floating map callout badges.
- **Don't** use low-contrast yellow or pastel category fills behind white numerals; every category badge fill must pass ≥4.5:1 WCAG AA contrast with `#FFFFFF`.
