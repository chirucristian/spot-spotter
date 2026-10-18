# Spot Spotter — Civic Square & Building Field Atlas

An interactive smartphone-first web application that pinpoints your location on a map and displays the names of surrounding buildings (Parliament, House of Law, Ministries, Abbeys, Guildhalls) directly over their footprints. Tap any building's rooftop callout banner to view a concise architectural summary, distance, compass bearing, and photograph.

## Features
- **Persistent Rooftop Building Callouts:** Labels every notable building directly over its map structure with color-coded civic categories (`PARLIAMENT`, `HOUSE OF LAW`, `MINISTRY`, `ABBEY`, `ASSEMBLY HALL`).
- **One-Tap Architectural Dossier:** Clicking any building opens a slide-up Inspector Plate with a photograph, summary, distance in meters, compass bearing, and direct links to Google Maps & Wikipedia.
- **Dual Map Engine (`$0` Free Mode + Google Maps Live Mode):**
  - **Built-In Free Discovery Engine:** Works out-of-the-box with zero API keys using OpenStreetMap tiles, Wikipedia Geosearch API, and Wikimedia Commons photography.
  - **Google Maps JS + Places API Engine:** Paste a Google Maps API key via the in-app **Google Maps Key** button for Google Maps vector rendering and live Places API nearby searches.
- **Daylight & Night Survey Modes:** High-contrast cyanotype/cadastral slate daylight palette (`#E4EDF4`) with one-tap binary inversion to Night Survey mode (`#0E1621`).
- **Curated Civic Squares + Live GPS:** Explore *Parliament Square (London)*, *Piața Constituției (Bucharest)*, *Piazza della Signoria (Florence)*, *Grand-Place (Brussels)*, or tap **Pinpoint Me & Spot Around** to scan your real-time GPS coordinates anywhere in the world.
