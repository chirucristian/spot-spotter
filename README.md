# Spot Spotter — Civic Square & Building Field Atlas

**Live App (GitHub Pages):** [https://chirucristian.github.io/spot-spotter/](https://chirucristian.github.io/spot-spotter/)

An interactive smartphone-first web application that pinpoints your location on a map and displays the names of surrounding buildings (Parliament, House of Law, Ministries, Abbeys, Guildhalls, Cathedrals, and Monuments) directly over their footprints. Tap any building's rooftop callout pill to view a rich architectural dossier, exterior photo carousel, distance, compass bearing, walking time, and audio guide.

## Features
- **Category-Coded Rooftop Building Pills:** Labels every notable building directly over its map footprint with color-coded category indicators (`Civic`, `Law`, `Sacred`, `Culture`) and zero-tremble collision avoidance.
- **Rich Architectural Dossier & Live Wikipedia Enrichment:** Tapping any building opens a hairline-ruled dossier sheet with:
  - Exterior-first swipeable photo carousel
  - Distance in meters, compass bearing (`NE · 42°`), and estimated walking time
  - Non-repetitive spatial hook, parsed **Style & Era**, **Architect / Origin**, expandable historical & architectural context, and on-site facade highlights
  - Built-in **Listen** voice tour guide (`speechSynthesis`) and **Prev / Next** landmark stepper
- **Square Switcher & Category Filter Bar:** Instantly jump between *Senate Square (Helsinki)*, *Parliament Square (London)*, *Piața Constituției (Bucharest)*, *Piazza della Signoria (Florence)*, and *Grand-Place (Brussels)*, filter by building category, or tap **Spot Here** / **Pinpoint Me** anywhere in the world.
- **Dual Map Engine:** Uses Google Maps JavaScript API with automatic fallback to Carto/OpenStreetMap Leaflet tiles and live Wikipedia Geosearch + Wikimedia Commons APIs.
