# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
delegated: Static HTML/CSS/JS (zero-build single-page web application optimized for smartphone viewports and GitHub Pages deployment).

## Users
Explorers, tourists, and curious locals standing in a public square or civic plaza on their smartphones who want instant spatial orientation ("What is that building right there? Which one is the Parliament, which is the Palace of Justice?").

## Product Purpose
Spot Spotter pinpoints the user's real-time location on an interactive map and overlays persistent, legible building/landmark name labels directly over nearby structures and monuments. Tapping any floating building label reveals a concise architectural/historical summary and a photograph so the user immediately understands what they are looking at without typing search queries.

## Positioning
Unlike standard maps that hide landmark names until extreme zoom levels or bury details behind tiny generic pins and multi-tabbed review sheets, Spot Spotter places the building's name directly over its footprint in a high-contrast architectural callout and surfaces a focused summary + photo card in a single thumb tap.

## Operating Context
Used outdoors on a smartphone screen—often under bright daylight while standing in the middle of a busy square—requiring immediate visual legibility, thumb-zone controls, compass/location centering, and instant switching between live Google Maps data and curated civic square presets.

## Capabilities and Constraints
- Pinpoints user location via browser Geolocation API (`navigator.geolocation`) with accuracy radius and instant recenter control.
- Displays persistent floating name badges directly over surrounding buildings, civic institutions, monuments, and cultural landmarks.
- Tapping a building label opens a bottom sheet / architectural dossier card with a photograph, category badge, distance from the user, short summary, and quick walking/orientation metadata.
- Integrates Google Maps JavaScript API & Places API (with an in-app API key configuration drawer and step-by-step free-tier setup guide), alongside a zero-key Live/Free Discovery Mode (powered by OpenStreetMap Overpass + Wikipedia/Wikimedia Commons REST APIs + curated famous civic squares) so the app works immediately out of the box at zero cost.

## Brand Commitments
- Name: Spot Spotter

## Evidence on Hand
- Live geolocation + real-world civic square coordinates, Wikipedia/Wikimedia Commons architectural summaries and verified landmark photography, plus live Google Maps JS & Places API support when a user key is supplied.
- No fabricated user testimonials or commercial claims.

## Product Principles
1. **Labels Over Footprints, Not Mystery Pins:** Every notable building around the user displays its actual name directly over the structure on the map.
2. **Outdoor Smartphone Legibility:** High-contrast typography, generous touch targets (minimum 44x44px), and one-handed bottom-sheet ergonomics built for standing in a sunny plaza.
3. **One Tap to Context:** Clicking a building name immediately shows what it is, a clear photograph, and a concise summary without clutter.
4. **Zero-Cost Immediate Utility:** Works instantly out of the box with curated squares and free live discovery, while seamlessly upgrading to full Google Maps 3D/Vector & Places data when an API key is entered.
