# Design System: Spot Spotter (Distilled Rooftop Pills)

## 1. Visual Direction & North Star
- **Core Concept:** Compact Rooftop Building Name Pills (`Apple Look Around` / `Google Live View` spatial label aesthetic).
- **Principle:** Zero clutter, zero label overlap, one-line building names anchored right over structures, and a single sleek photo + summary card on tap.

## 2. Color Palette & Tokens
- **Surface Card (`--surface-card`):** `#FFFFFF`
- **Surface Pill (`--surface-pill`):** `#0F172A`
- **Surface Pill Active (`--surface-pill-active`):** `#DC2626`
- **Surface Subtle (`--surface-subtle`):** `#F1F5F9`
- **Map Canvas Ground:** `#E2E8F0`
- **Hover Dark Slate:** `#1E293B`
- **Primary Ink (`--ink-primary`):** `#0F172A`
- **Secondary Ink (`--ink-secondary`):** `#334155`
- **Muted Ink (`--ink-muted`):** `#475569`
- **Ink on Dark (`--ink-on-dark`):** `#FFFFFF`
- **Border Subtle (`--border-subtle`):** `#E2E8F0`
- **GPS Location Blue:** `#2563EB`
- **Category Indicator Dots:**
  - Civic / Parliament (`--dot-civic`): `#EF4444`
  - Law / University (`--dot-law`): `#3B82F6`
  - Sacred / Cathedral (`--dot-sacred`): `#10B981`
  - Culture / Monument (`--dot-culture`): `#F59E0B`

## 3. Typography & Scale
- **Font Family:** `'Bricolage Grotesque', 'Atkinson Hyperlegible', -apple-system, BlinkMacSystemFont, sans-serif`
- **Numeric Discipline:** `font-variant-numeric: tabular-nums` on distances, compass bearings, photo counters, and landmark steppers.
- **Type Scale:**
  - Card Title: `1.2rem` (`800` weight, `-0.02em` tracking, `text-wrap: balance`)
  - Body Base: `16px` (`1rem`)
  - Architectural Summary & Spatial Lead: `0.91rem` / `0.88rem` (`1.56` / `1.48` line-height, `66ch` max measure)
  - Action Buttons & Role: `0.85rem` / `0.84rem` (`700` weight)
  - Rooftop Pill Name & Ledger Values: `0.82rem` / `0.8rem` (`700` weight)
  - Status Toast & Category Filter Chips: `0.8rem` / `0.78rem` (`600` / `700` weight)
  - Photo Counter, Distance/Bearing Badge & Category Badge: `0.76rem` (`700` weight)

## 4. Shape & Elevation
- **Border Radius Scale:**
  - Full Capsule Pills & FABs: `999px` / `50%`
  - Place Summary Card: `20px`
  - Card Action Buttons: `10px`
- **Elevation Shadows:**
  - Floating Bar & Card (`--shadow-float`): `0 8px 24px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.08)`
  - Rooftop Pill (`--shadow-pill`): `0 4px 12px rgba(15, 23, 42, 0.25), 0 1px 3px rgba(15, 23, 42, 0.14)`
  - Active Rooftop Pill (`--shadow-pill-active`): `0 6px 18px rgba(220, 38, 38, 0.38), 0 2px 6px rgba(15, 23, 42, 0.2)`
