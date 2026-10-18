/**
 * Spot Spotter — Civic Square & Architectural Building Field Atlas
 * Supports both Google Maps JavaScript + Places API and Zero-Key Live Discovery (Leaflet + Wikipedia Geosearch + Curated Civic Squares)
 */

const CIVIC_SQUARES = {
  'parliament-london': {
    name: 'Parliament Square · London',
    center: { lat: 51.5007, lng: -0.1266 },
    zoom: 17,
    landmarks: [
      {
        id: 'westminster-palace',
        name: 'Palace of Westminster',
        role: 'Parliament · House of Commons & Lords',
        category: 'civic',
        catLabel: 'PARLIAMENT',
        magnitude: 1,
        lat: 51.4995,
        lng: -0.1248,
        wikiTitle: 'Palace_of_Westminster',
        summary: 'The meeting place of the Parliament of the United Kingdom (the House of Commons and the House of Lords). Rebuilt in Perpendicular Gothic style by Charles Barry and Augustus Pugin after the fire of 1834, its 300-meter Thames facade and Elizabeth Tower (Big Ben) anchor the eastern flank of Parliament Square.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg/960px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg'
      },
      {
        id: 'supreme-court-uk',
        name: 'Middlesex Guildhall',
        role: 'House of Law · UK Supreme Court',
        category: 'law',
        catLabel: 'HOUSE OF LAW',
        magnitude: 1,
        lat: 51.5006,
        lng: -0.1277,
        wikiTitle: 'Middlesex_Guildhall',
        summary: 'Standing on the western edge of Parliament Square, this Art Nouveau Gothic Revival courthouse (completed in 1913 by J.S. Gibson) serves as the seat of the Supreme Court of the United Kingdom and the Judicial Committee of the Privy Council.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Middlesex_Guildhall_2009-09-21.jpg/960px-Middlesex_Guildhall_2009-09-21.jpg'
      },
      {
        id: 'westminster-abbey',
        name: 'Westminster Abbey',
        role: 'Coronation Church & Royal Peculiar',
        category: 'sacred',
        catLabel: 'ABBEY',
        magnitude: 1,
        lat: 51.4994,
        lng: -0.1273,
        wikiTitle: 'Westminster_Abbey',
        summary: 'Formally the Collegiate Church of St Peter at Westminster, this Gothic abbey church on the southern side of the square has been the site of every British royal coronation since 1066 and the burial site of monarchs, poets, and scientists.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Westminster_Abbey_West_Door.jpg/800px-Westminster_Abbey_West_Door.jpg'
      },
      {
        id: 'hm-treasury-gogmagog',
        name: 'Government Offices Great George St',
        role: 'His Majesty’s Treasury & Cabinet Hub',
        category: 'civic',
        catLabel: 'MINISTRY',
        magnitude: 2,
        lat: 51.5017,
        lng: -0.1272,
        wikiTitle: 'Government_Offices_Great_George_Street',
        summary: 'Occupying the northern boundary of Parliament Square, this grand Edwardian Baroque civic block designed by John Brydon houses His Majesty’s Treasury and historic Whitehall cabinet rooms above the Churchill War Rooms.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/HM_Treasury_building.jpg/960px-HM_Treasury_building.jpg'
      },
      {
        id: 'portcullis-house',
        name: 'Portcullis House',
        role: 'Parliamentary Chambers & Committees',
        category: 'civic',
        catLabel: 'CHAMBERS',
        magnitude: 2,
        lat: 51.5012,
        lng: -0.1249,
        wikiTitle: 'Portcullis_House',
        summary: 'Designed by Michael Hopkins and Partners and opened in 2001 on the northeast corner of the square, Portcullis House provides offices and select committee chambers for Members of Parliament, recognizable by its bronze roof chimneys.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Portcullis_House_from_London_Eye.jpg/800px-Portcullis_House_from_London_Eye.jpg'
      },
      {
        id: 'central-hall-westminster',
        name: 'Central Hall Westminster',
        role: 'Assembly Dome · First UN General Assembly',
        category: 'culture',
        catLabel: 'ASSEMBLY HALL',
        magnitude: 2,
        lat: 51.4999,
        lng: -0.1296,
        wikiTitle: 'Methodist_Central_Hall,_Westminster',
        summary: 'Crowned by one of the largest self-supporting ferro-concrete domes in Europe, Central Hall hosted the inaugural meeting of the United Nations General Assembly in January 1946 right off the southwest corner of Parliament Square.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Methodist_Central_Hall_Westminster.jpg/800px-Methodist_Central_Hall_Westminster.jpg'
      }
    ]
  },

  'constitution-bucharest': {
    name: 'Piața Constituției · Bucharest',
    center: { lat: 44.4274, lng: 26.0912 },
    zoom: 16,
    landmarks: [
      {
        id: 'palace-of-parliament-ro',
        name: 'Palace of the Parliament',
        role: 'Parliament of Romania · Chamber & Senate',
        category: 'civic',
        catLabel: 'PARLIAMENT',
        magnitude: 1,
        lat: 44.4275,
        lng: 26.0875,
        wikiTitle: 'Palace_of_the_Parliament',
        summary: 'Dominating the western axis of Constitution Square, the Palace of the Parliament is the heaviest building in the world and the second-largest administrative building globally, housing the Senate, the Chamber of Deputies, and the Constitutional Court of Romania.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bucharest_-_Palace_of_the_Parliament_%282022%29.jpg/960px-Bucharest_-_Palace_of_the_Parliament_%282022%29.jpg'
      },
      {
        id: 'palace-of-justice-ro',
        name: 'Palace of Justice',
        role: 'House of Law · Court of Appeal',
        category: 'law',
        catLabel: 'HOUSE OF LAW',
        magnitude: 1,
        lat: 44.4288,
        lng: 26.0987,
        wikiTitle: 'Palace_of_Justice,_Bucharest',
        summary: 'Built between 1890 and 1895 along the Dâmbovița River to designs by Albert Ballu and Ion Mincu in French Renaissance Revival style, its main facade bears six allegories of Law and houses the Bucharest Court of Appeal.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Palatul_de_Justitie_Bucuresti.jpg/960px-Palatul_de_Justitie_Bucuresti.jpg'
      },
      {
        id: 'ministry-of-finance-ro',
        name: 'Ministry of Finance',
        role: 'State Treasury & Fiscal Directorate',
        category: 'civic',
        catLabel: 'MINISTRY',
        magnitude: 2,
        lat: 44.4260,
        lng: 26.0928,
        wikiTitle: 'Piața_Constituției',
        summary: 'Framing the southern hemicycle of Piața Constituției, this monumental colonnaded ministry building anchors the administrative crescent facing the Palace of the Parliament and Bulevardul Unirii.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Piata_Constitutiei_Bucuresti.jpg/960px-Piata_Constitutiei_Bucuresti.jpg'
      },
      {
        id: 'national-cathedral-ro',
        name: 'People’s Salvation Cathedral',
        role: 'Patriarchal Orthodox Cathedral',
        category: 'sacred',
        catLabel: 'CATHEDRAL',
        magnitude: 1,
        lat: 44.4259,
        lng: 26.0825,
        wikiTitle: 'People%27s_Salvation_Cathedral',
        summary: 'Rising immediately behind the Parliament courtyard on Dealul Arsenalului, the tallest and largest Eastern Orthodox church building in the world by volume crowns Bucharest’s southern civic skyline.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Catedrala_Mantuirii_Neamului_2021.jpg/800px-Catedrala_Mantuirii_Neamului_2021.jpg'
      },
      {
        id: 'patriarchal-palace-ro',
        name: 'Palace of the Patriarchate',
        role: 'Former Assembly of Deputies Chamber',
        category: 'culture',
        catLabel: 'HISTORIC CHAMBER',
        magnitude: 2,
        lat: 44.4244,
        lng: 26.0978,
        wikiTitle: 'Palace_of_the_Patriarchate',
        summary: 'Built in 1907 by architect Dimitrie Maimarolu on Dealul Mitropoliei as the seat of Romania’s Chamber of Deputies during the Kingdom era, featuring a neoclassical peristyle and grand domed plenary hall.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Palatul_Patriarhiei_Bucuresti.jpg/960px-Palatul_Patriarhiei_Bucuresti.jpg'
      }
    ]
  },

  'signoria-florence': {
    name: 'Piazza della Signoria · Florence',
    center: { lat: 43.7696, lng: 11.2558 },
    zoom: 18,
    landmarks: [
      {
        id: 'palazzo-vecchio',
        name: 'Palazzo Vecchio',
        role: 'Civic Town Hall & Signoria Council',
        category: 'civic',
        catLabel: 'TOWN HALL',
        magnitude: 1,
        lat: 43.7693,
        lng: 11.2562,
        wikiTitle: 'Palazzo_Vecchio',
        summary: 'The crenellated Romanesque fortress-palace designed by Arnolfo di Cambio in 1299. Its 94-meter Torre di Arnolfo and Salone dei Cinquecento have served as the seat of Florentine civic government for over seven centuries.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Palazzo_Vecchio_from_Piazza_della_Signoria.jpg/800px-Palazzo_Vecchio_from_Piazza_della_Signoria.jpg'
      },
      {
        id: 'tribunale-mercanzia',
        name: 'Tribunale della Mercanzia',
        role: 'House of Law · Guild Commercial Court',
        category: 'law',
        catLabel: 'HOUSE OF LAW',
        magnitude: 1,
        lat: 43.7697,
        lng: 11.2565,
        wikiTitle: 'Tribunale_della_Mercanzia',
        summary: 'Founded in 1359 on the northeast side of the square, this Gothic courthouse adjudicated commercial disputes between Florence’s Major and Minor Guilds (Arti), emblazoned with the carved stone coats of arms of all twenty-one guilds.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tribunale_della_mercanzia_01.JPG/800px-Tribunale_della_mercanzia_01.JPG'
      },
      {
        id: 'loggia-dei-lanzi',
        name: 'Loggia dei Lanzi',
        role: 'Ceremonial Arcade & Sculpture Gallery',
        category: 'culture',
        catLabel: 'LOGGIA',
        magnitude: 1,
        lat: 43.7691,
        lng: 11.2555,
        wikiTitle: 'Loggia_dei_Lanzi',
        summary: 'Built between 1376 and 1382 for public ceremonies and swearing-in of priors, its wide semi-circular arches shelter Renaissance masterworks including Cellini’s bronze Perseus with the Head of Medusa and Giambologna’s Rape of the Sabine Women.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Loggia_dei_Lanzi_Florence.jpg/960px-Loggia_dei_Lanzi_Florence.jpg'
      },
      {
        id: 'uffizi-gallery',
        name: 'Galleria degli Uffizi',
        role: 'Magistrates’ Offices & Art Museum',
        category: 'culture',
        catLabel: 'MAGISTRACY',
        magnitude: 1,
        lat: 43.7684,
        lng: 11.2553,
        wikiTitle: 'Uffizi',
        summary: 'Commissioned by Cosimo I de’ Medici in 1560 and designed by Giorgio Vasari to consolidate the administrative and judicial offices ("uffizi") of the Florentine Republic, opening directly onto Piazza della Signoria.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Uffizi_Gallery_Florence.jpg/800px-Uffizi_Gallery_Florence.jpg'
      },
      {
        id: 'palazzo-uguccioni',
        name: 'Palazzo Uguccioni',
        role: 'High Renaissance Noble Facade',
        category: 'culture',
        catLabel: 'PALAZZO',
        magnitude: 2,
        lat: 43.7700,
        lng: 11.2561,
        wikiTitle: 'Palazzo_Uguccioni',
        summary: 'Dominating the northern side of Piazza della Signoria with rusticated ground arches and paired Ionic and Corinthian columns attributed to drawings from Raphael’s circle (1550).',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Palazzo_Uguccioni_Firenze.jpg/800px-Palazzo_Uguccioni_Firenze.jpg'
      }
    ]
  },

  'grand-place-brussels': {
    name: 'Grand-Place · Brussels',
    center: { lat: 50.8467, lng: 4.3525 },
    zoom: 18,
    landmarks: [
      {
        id: 'brussels-town-hall',
        name: 'Hôtel de Ville (Stadhuis)',
        role: 'Civic Magistrate & Brabantine Gothic Spire',
        category: 'civic',
        catLabel: 'CITY HALL',
        magnitude: 1,
        lat: 50.8465,
        lng: 4.3521,
        wikiTitle: 'Brussels_Town_Hall',
        summary: 'Built between 1401 and 1455 on the southern side of the Grand-Place, it is the only medieval building in the square to survive the 1695 French bombardment, topped by a 96-meter spire bearing St. Michael.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bruxelles_Grand-Place_Hotel_de_Ville.jpg/800px-Bruxelles_Grand-Place_Hotel_de_Ville.jpg'
      },
      {
        id: 'maison-du-roi',
        name: 'Maison du Roi (Broodhuis)',
        role: 'Royal Ducal Court & Brussels City Museum',
        category: 'law',
        catLabel: 'DUCALS & COURT',
        magnitude: 1,
        lat: 50.8469,
        lng: 4.3529,
        wikiTitle: 'Brussels_City_Museum',
        summary: 'Facing the Town Hall across the square, this former bread market became the administrative and judicial seat of the Dukes of Brabant ("King’s House"), where Counts Egmont and Horn were held in 1568.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Maison_du_Roi_Bruxelles.jpg/960px-Maison_du_Roi_Bruxelles.jpg'
      },
      {
        id: 'maison-des-ducs-brabant',
        name: 'Maison des Ducs de Brabant',
        role: 'Neoclassical Guildhall Ensemble (Six Guilds)',
        category: 'culture',
        catLabel: 'GUILDHALLS',
        magnitude: 2,
        lat: 50.8463,
        lng: 4.3531,
        wikiTitle: 'House_of_the_Dukes_of_Brabant',
        summary: 'Closing the eastern side of the Grand-Place, architect Willem de Bruyn unified six separate guildhalls (tanners, millers, carpenters, sculptors) behind one monumental Italianate Baroque-Classical facade in 1698.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Maison_des_Ducs_de_Brabant_Bruxelles.jpg/960px-Maison_des_Ducs_de_Brabant_Bruxelles.jpg'
      },
      {
        id: 'le-roy-d-espagne',
        name: 'Le Roy d’Espagne (Den Coninck van Spaignien)',
        role: 'Corporation of Bakers Guild House',
        category: 'culture',
        catLabel: 'BAKERS GUILD',
        magnitude: 2,
        lat: 50.8471,
        lng: 4.3519,
        wikiTitle: 'Grand-Place',
        summary: 'Built in 1697 on the western corner of the square for the powerful Corporation of Bakers, crowned by an octagonal dome and gilded allegorical statues of Strength, Wheat, and Wind.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Grand_Place_Brussel_Westzijde.jpg/960px-Grand_Place_Brussel_Westzijde.jpg'
      }
    ]
  }
};

// State
const state = {
  activeSquareKey: 'parliament-london',
  userLocation: { lat: 51.5007, lng: -0.1266 },
  landmarks: [],
  selectedLandmarkId: null,
  inspectedIds: new Set(),
  gmapsApiKey: localStorage.getItem('spot_spotter_gmaps_key') || '',
  engine: 'leaflet', // 'leaflet' or 'google'
  leafletMap: null,
  leafletMarkers: [],
  leafletUserMarker: null,
  googleMap: null,
  googleMarkers: [],
  googleUserMarker: null,
  wikiCache: new Map()
};

// DOM Elements
const els = {
  squareSelect: document.getElementById('square-select'),
  apiKeyBtn: document.getElementById('api-key-btn'),
  engineDot: document.getElementById('engine-dot'),
  engineLabel: document.getElementById('engine-label'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  guideSpan: document.getElementById('guide-span'),
  guideCoords: document.getElementById('guide-coords'),
  landmarkStrip: document.getElementById('landmark-strip'),
  pinpointMeBtn: document.getElementById('pinpoint-me-btn'),
  scanHereBtn: document.getElementById('scan-here-btn'),
  leafletContainer: document.getElementById('leaflet-map'),
  googleContainer: document.getElementById('google-map'),
  dossierSheet: document.getElementById('dossier-sheet'),
  dossierCloseBtn: document.getElementById('dossier-close-btn'),
  dossierNum: document.getElementById('dossier-num'),
  dossierCat: document.getElementById('dossier-cat'),
  dossierImg: document.getElementById('dossier-img'),
  dossierSource: document.getElementById('dossier-source'),
  dossierStamp: document.getElementById('dossier-stamp'),
  dossierTitle: document.getElementById('dossier-title'),
  dossierRole: document.getElementById('dossier-role'),
  dossierDistance: document.getElementById('dossier-distance'),
  dossierBearing: document.getElementById('dossier-bearing'),
  dossierCoords: document.getElementById('dossier-coords'),
  dossierSummary: document.getElementById('dossier-summary'),
  dossierGmapsLink: document.getElementById('dossier-gmaps-link'),
  dossierWikiLink: document.getElementById('dossier-wiki-link'),
  apiDrawerBackdrop: document.getElementById('api-drawer-backdrop'),
  apiDrawerClose: document.getElementById('api-drawer-close'),
  gmapsKeyInput: document.getElementById('gmaps-key-input'),
  saveGmapsKeyBtn: document.getElementById('save-gmaps-key-btn'),
  clearGmapsKeyBtn: document.getElementById('clear-gmaps-key-btn'),
  statusToast: document.getElementById('status-toast')
};

/* ==========================================================================
   Geodesic & Formatting Helpers
   ========================================================================== */
function computeDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function computeBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (toDeg(Math.atan2(y, x)) + 360) % 360;
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const compass = dirs[Math.round(brng / 22.5) % 16];
  return `${Math.round(brng)}° ${compass}`;
}

function formatDistance(meters) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatLatLng(lat, lng) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${ns} · ${Math.abs(lng).toFixed(4)}°${ew}`;
}

let toastTimer = null;
function showToast(msg) {
  els.statusToast.textContent = msg;
  els.statusToast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.statusToast.classList.remove('is-visible');
  }, 3400);
}

/* ==========================================================================
   Build HTML for Cadastral Building Callout Flag
   ========================================================================== */
function createBuildingCalloutHTML(landmark, index) {
  const numStr = String(index + 1).padStart(2, '0');
  const distMeters = computeDistanceMeters(
    state.userLocation.lat,
    state.userLocation.lng,
    landmark.lat,
    landmark.lng
  );
  const isSelected = state.selectedLandmarkId === landmark.id;
  const isInspected = state.inspectedIds.has(landmark.id);
  const magClass = `mag-${landmark.magnitude || 2}`;
  const catClass = `callout-cat-${landmark.category || 'civic'}`;

  return `
    <div class="cadastral-callout ${catClass} ${magClass} ${isSelected ? 'is-selected' : ''}" data-landmark-id="${landmark.id}">
      <div class="callout-box">
        <div class="callout-num">${numStr}</div>
        <div class="callout-body">
          <span class="callout-type-tag">${landmark.catLabel || 'LANDMARK'}</span>
          <span class="callout-name">${landmark.name}</span>
        </div>
        <div class="callout-meta">
          <span>${formatDistance(distMeters)}</span>
          ${isInspected ? '<span class="callout-stamp">SEEN</span>' : ''}
        </div>
      </div>
      <div class="callout-stem"></div>
      <div class="callout-anchor-dot"></div>
    </div>
  `;
}

/* ==========================================================================
   Leaflet Engine (Zero-Key Immediate Live Map)
   ========================================================================== */
function getResponsiveZoom(baseZoom) {
  return window.innerWidth < 520 ? Math.max(15, baseZoom - 1) : baseZoom;
}

function initLeafletMap() {
  if (state.leafletMap) return;
  const initialSquare = CIVIC_SQUARES[state.activeSquareKey];

  state.leafletMap = L.map('leaflet-map', {
    center: [initialSquare.center.lat, initialSquare.center.lng],
    zoom: getResponsiveZoom(initialSquare.zoom),
    zoomControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(state.leafletMap);

  state.leafletMap.on('moveend', () => {
    const c = state.leafletMap.getCenter();
    els.guideCoords.textContent = formatLatLng(c.lat, c.lng);
  });
}

function renderLeafletMarkers() {
  if (!state.leafletMap) return;

  // Clear previous markers
  state.leafletMarkers.forEach((m) => state.leafletMap.removeLayer(m));
  state.leafletMarkers = [];

  if (state.leafletUserMarker) {
    state.leafletMap.removeLayer(state.leafletUserMarker);
  }

  // User GPS beacon
  const userIcon = L.divIcon({
    className: 'building-marker-wrapper',
    html: `<div class="user-gps-beacon" title="Your Pinpointed Position"><div class="user-gps-pulse"></div><div class="user-gps-core"></div></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });

  state.leafletUserMarker = L.marker([state.userLocation.lat, state.userLocation.lng], {
    icon: userIcon,
    zIndexOffset: 1000
  }).addTo(state.leafletMap);

  // Building callout flags directly over structures
  state.landmarks.forEach((lm, idx) => {
    const icon = L.divIcon({
      className: 'building-marker-wrapper',
      html: createBuildingCalloutHTML(lm, idx),
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const marker = L.marker([lm.lat, lm.lng], {
      icon,
      zIndexOffset: state.selectedLandmarkId === lm.id ? 950 : 500 - idx * 10
    }).addTo(state.leafletMap);

    marker.on('click', () => selectLandmark(lm.id));
    state.leafletMarkers.push(marker);
  });
}

/* ==========================================================================
   Google Maps JavaScript API + Places API Engine
   ========================================================================== */
function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const existing = document.getElementById('gmaps-sdk-script');
    if (existing) existing.remove();

    window.gm_authFailure = () => {
      reject(new Error('Google Maps API key authentication failed. Falling back to Free Engine.'));
    };

    const script = document.createElement('script');
    script.id = 'gmaps-sdk-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps SDK.'));
    document.head.appendChild(script);
  });
}

async function activateGoogleMapsEngine(apiKey) {
  try {
    showToast('Connecting to Google Maps JavaScript & Places API...');
    await loadGoogleMapsScript(apiKey);

    state.engine = 'google';
    els.leafletContainer.classList.add('hidden');
    els.googleContainer.classList.remove('hidden');
    els.engineDot.classList.add('gmaps');
    els.engineLabel.textContent = 'Google Maps Live';
    els.apiKeyBtn.classList.add('active-mode');

    const center = state.leafletMap
      ? { lat: state.leafletMap.getCenter().lat, lng: state.leafletMap.getCenter().lng }
      : state.userLocation;

    state.googleMap = new google.maps.Map(els.googleContainer, {
      center,
      zoom: 17,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
       clickableIcons: false,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#f0ead8' }] },
        { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfd4ea' }] },
        { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d5e4d4' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }
      ]
    });

    state.googleMap.addListener('idle', () => {
      const c = state.googleMap.getCenter();
      if (c) els.guideCoords.textContent = formatLatLng(c.lat(), c.lng());
    });

    renderGoogleMarkers();
    showToast('Google Maps Engine active! Tap "Scan Map Area" for Places API results.');
  } catch (err) {
    console.warn(err);
    revertToFreeEngine(err.message || 'Invalid Google Maps key; using Free Engine.');
  }
}

function revertToFreeEngine(reason) {
  state.engine = 'leaflet';
  els.googleContainer.classList.add('hidden');
  els.leafletContainer.classList.remove('hidden');
  els.engineDot.classList.remove('gmaps');
  els.engineLabel.textContent = 'Google Maps Key';
  els.apiKeyBtn.classList.remove('active-mode');
  if (state.leafletMap) {
    state.leafletMap.invalidateSize();
    renderLeafletMarkers();
  }
  if (reason) showToast(reason);
}

function renderGoogleMarkers() {
  if (!state.googleMap || !window.google) return;

  state.googleMarkers.forEach((overlay) => overlay.setMap(null));
  state.googleMarkers = [];

  if (state.googleUserMarker) state.googleUserMarker.setMap(null);

  // Define custom HTML OverlayView class once
  class CadastralOverlay extends google.maps.OverlayView {
    constructor(position, htmlContent, onClick) {
      super();
      this.position = new google.maps.LatLng(position.lat, position.lng);
      this.htmlContent = htmlContent;
      this.onClick = onClick;
      this.div = null;
    }
    onAdd() {
      this.div = document.createElement('div');
      this.div.style.position = 'absolute';
      this.div.innerHTML = this.htmlContent;
      if (this.onClick) {
        this.div.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onClick();
        });
      }
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(this.div);
    }
    draw() {
      const projection = this.getProjection();
      if (!projection || !this.div) return;
      const point = projection.fromLatLngToDivPixel(this.position);
      if (point) {
        this.div.style.left = `${point.x}px`;
        this.div.style.top = `${point.y}px`;
      }
    }
    onRemove() {
      if (this.div && this.div.parentNode) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
  }

  // User GPS beacon overlay
  state.googleUserMarker = new CadastralOverlay(
    state.userLocation,
    `<div class="user-gps-beacon"><div class="user-gps-pulse"></div><div class="user-gps-core"></div></div>`,
    null
  );
  state.googleUserMarker.setMap(state.googleMap);

  // Building Callout overlays
  state.landmarks.forEach((lm, idx) => {
    const ov = new CadastralOverlay(
      { lat: lm.lat, lng: lm.lng },
      createBuildingCalloutHTML(lm, idx),
      () => selectLandmark(lm.id)
    );
    ov.setMap(state.googleMap);
    state.googleMarkers.push(ov);
  });
}

/* ==========================================================================
   Live Nearby Building Discovery (Wikipedia Geosearch + Google Places API)
   ========================================================================== */
function inferCategoryFromTitle(title, desc = '') {
  const text = `${title} ${desc}`.toLowerCase();
  if (text.includes('court') || text.includes('justice') || text.includes('law') || text.includes('tribunal') || text.includes('guildhall')) {
    return { category: 'law', catLabel: 'HOUSE OF LAW', magnitude: 1 };
  }
  if (text.includes('parliament') || text.includes('palace') || text.includes('ministry') || text.includes('hall') || text.includes('senate') || text.includes('council') || text.includes('government')) {
    return { category: 'civic', catLabel: 'CIVIC BUILDING', magnitude: 1 };
  }
  if (text.includes('cathedral') || text.includes('church') || text.includes('abbey') || text.includes('basilica') || text.includes('chapel') || text.includes('mosque') || text.includes('synagogue')) {
    return { category: 'sacred', catLabel: 'SACRED LANDMARK', magnitude: 1 };
  }
  return { category: 'culture', catLabel: 'MONUMENT', magnitude: 2 };
}

async function scanNearbyBuildingsAt(lat, lng) {
  showToast('Scanning buildings & landmarks around map center...');

  // If Google Maps Places API is active, query Google Places Nearby Search first
  if (state.engine === 'google' && state.googleMap && window.google?.maps?.places) {
    try {
      const service = new google.maps.places.PlacesService(state.googleMap);
      const placesResults = await new Promise((resolve) => {
        service.nearbySearch(
          {
            location: new google.maps.LatLng(lat, lng),
            radius: 450,
            type: 'tourist_attraction'
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
              resolve(results.slice(0, 8));
            } else {
              resolve(null);
            }
          }
        );
      });

      if (placesResults && placesResults.length > 0) {
        state.landmarks = placesResults.map((p, i) => {
          const catInfo = inferCategoryFromTitle(p.name, (p.types || []).join(' '));
          const photoUrl =
            p.photos && p.photos.length > 0
              ? p.photos[0].getUrl({ maxWidth: 800 })
              : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg/960px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg';
          return {
            id: p.place_id || `gplace-${i}`,
            name: p.name,
            role: p.vicinity || 'Notable Civic Landmark',
            category: catInfo.category,
            catLabel: catInfo.catLabel,
            magnitude: i < 3 ? 1 : 2,
            lat: p.geometry.location.lat(),
            lng: p.geometry.location.lng(),
            wikiTitle: p.name.replace(/\s+/g, '_'),
            summary: `${p.name} is a prominent landmark located at ${p.vicinity || 'this civic square'}. Rated ${p.rating || 'N/A'} ★ (${p.user_ratings_total || 0} reviews) on Google Maps.`,
            fallbackImg: photoUrl,
            sourceLabel: 'SOURCE: GOOGLE MAPS PLACES API'
          };
        });
        refreshMapAndUI();
        showToast(`Mapped ${state.landmarks.length} buildings via Google Places API.`);
        return;
      }
    } catch (e) {
      console.warn('Google Places scan fallback to Wikipedia Geosearch:', e);
    }
  }

  // Wikipedia Geosearch + PageImages + Extracts API (Works globally with $0 API key)
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=650&ggslimit=8&prop=coordinates|pageimages|extracts|description&exintro=1&explaintext=1&exchars=320&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

    if (pages.length === 0) {
      showToast('No Wikipedia-indexed buildings within 650m; try zooming to a city center.');
      return;
    }

    state.landmarks = pages
      .filter((p) => p.coordinates && p.coordinates.length > 0)
      .map((p, idx) => {
        const coord = p.coordinates[0];
        const catInfo = inferCategoryFromTitle(p.title, p.description || p.extract || '');
        return {
          id: `wiki-${p.pageid}`,
          name: p.title,
          role: p.description
            ? p.description.charAt(0).toUpperCase() + p.description.slice(1)
            : 'Surrounding Landmark & Structure',
          category: catInfo.category,
          catLabel: catInfo.catLabel,
          magnitude: idx < 3 ? 1 : 2,
          lat: coord.lat,
          lng: coord.lon,
          wikiTitle: encodeURIComponent(p.title.replace(/\s+/g, '_')),
          summary: p.extract || 'Historic architectural landmark and point of interest at this location.',
          fallbackImg:
            p.thumbnail?.source ||
            'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg/960px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg',
          sourceLabel: 'SOURCE: WIKIMEDIA COMMONS & GEOSEARCH'
        };
      });

    refreshMapAndUI();
    showToast(`Pinpointed ${state.landmarks.length} notable buildings around you!`);
  } catch (err) {
    console.error(err);
    showToast('Network scan error; displaying cached square landmarks.');
  }
}

/* ==========================================================================
   Selection, Dossier Sheet, and Wikipedia Summary/Photo Enrichment
   ========================================================================== */
async function selectLandmark(landmarkId, panTo = true) {
  const idx = state.landmarks.findIndex((l) => l.id === landmarkId);
  if (idx === -1) return;

  const lm = state.landmarks[idx];
  state.selectedLandmarkId = lm.id;
  state.inspectedIds.add(lm.id);

  // Pan map smoothly
  if (panTo) {
    if (state.engine === 'google' && state.googleMap) {
      state.googleMap.panTo({ lat: lm.lat, lng: lm.lng });
    } else if (state.leafletMap) {
      state.leafletMap.panTo([lm.lat, lm.lng], { animate: true, duration: 0.45 });
    }
  }

  refreshMapAndUI(false);

  // Populate Dossier Sheet immediately
  const numStr = String(idx + 1).padStart(2, '0');
  const distMeters = computeDistanceMeters(
    state.userLocation.lat,
    state.userLocation.lng,
    lm.lat,
    lm.lng
  );
  const bearingStr = computeBearing(
    state.userLocation.lat,
    state.userLocation.lng,
    lm.lat,
    lm.lng
  );

  els.dossierNum.textContent = `PLATE #${numStr}`;
  els.dossierCat.textContent = lm.catLabel || 'LANDMARK';
  els.dossierTitle.textContent = lm.name;
  els.dossierRole.textContent = lm.role;
  els.dossierDistance.textContent = formatDistance(distMeters);
  els.dossierBearing.textContent = bearingStr;
  els.dossierCoords.textContent = `${lm.lat.toFixed(4)}°N, ${lm.lng.toFixed(4)}°E`;
  els.dossierSummary.textContent = lm.summary;
  els.dossierImg.src = lm.fallbackImg;
  els.dossierImg.alt = `Photograph of ${lm.name}`;
  els.dossierSource.textContent = lm.sourceLabel || 'SOURCE: WIKIMEDIA ARCHITECTURAL ARCHIVE';
  els.dossierGmapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lm.name)}+${lm.lat},${lm.lng}`;
  els.dossierWikiLink.href = `https://en.wikipedia.org/wiki/${lm.wikiTitle || encodeURIComponent(lm.name)}`;

  els.dossierSheet.classList.add('is-open');
  els.dossierSheet.setAttribute('aria-hidden', 'false');

  // Enrich photo & summary from Wikipedia REST API if available
  if (lm.wikiTitle && !state.wikiCache.has(lm.wikiTitle)) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${lm.wikiTitle}`);
      if (res.ok) {
        const wikiData = await res.json();
        state.wikiCache.set(lm.wikiTitle, wikiData);
      }
    } catch (_) {
      // Ignore network error, fallback already rendered
    }
  }

  const cached = state.wikiCache.get(lm.wikiTitle);
  if (cached && state.selectedLandmarkId === lm.id) {
    if (cached.thumbnail?.source) {
      els.dossierImg.src = cached.thumbnail.source;
    }
    if (cached.extract && cached.extract.length > 40) {
      els.dossierSummary.textContent = cached.extract;
    }
  }
}

function closeDossier() {
  els.dossierSheet.classList.remove('is-open');
  els.dossierSheet.setAttribute('aria-hidden', 'true');
}

/* ==========================================================================
   Synchronize Strip Chips, Lexicon Guide-Word Bar, and Map Overlays
   ========================================================================== */
function refreshMapAndUI(recenter = false) {
  if (recenter) {
    const z = getResponsiveZoom(17);
    if (state.engine === 'google' && state.googleMap) {
      state.googleMap.setCenter(state.userLocation);
      state.googleMap.setZoom(z);
    } else if (state.leafletMap) {
      state.leafletMap.setView([state.userLocation.lat, state.userLocation.lng], z);
    }
  }

  // Update Lexicon Guide-Word Span
  if (state.landmarks.length > 0) {
    const first = state.landmarks[0].name.toUpperCase();
    const last = state.landmarks[state.landmarks.length - 1].name.toUpperCase();
    const countStr = String(state.landmarks.length).padStart(2, '0');
    els.guideSpan.textContent = `SPAN: [01] ${first} — [${countStr}] ${last}`;
  } else {
    els.guideSpan.textContent = 'SPAN: NO LANDMARKS INDEXED IN VIEW';
  }

  els.guideCoords.textContent = formatLatLng(state.userLocation.lat, state.userLocation.lng);

  // Render Bottom Strip Chips
  els.landmarkStrip.innerHTML = state.landmarks
    .map((lm, idx) => {
      const numStr = String(idx + 1).padStart(2, '0');
      const activeClass = state.selectedLandmarkId === lm.id ? 'is-active' : '';
      return `
        <button type="button" class="strip-chip ${activeClass}" data-strip-id="${lm.id}">
          <span class="strip-chip-num">${numStr}</span>
          <span class="strip-chip-label">${lm.name}</span>
        </button>
      `;
    })
    .join('');

  els.landmarkStrip.querySelectorAll('[data-strip-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectLandmark(btn.getAttribute('data-strip-id'), true);
    });
  });

  // Render Map Markers
  if (state.engine === 'google') {
    renderGoogleMarkers();
  } else {
    renderLeafletMarkers();
  }
}

/* ==========================================================================
   Load a Civic Square Preset or Pinpoint Real User GPS
   ========================================================================== */
function loadSquarePreset(squareKey) {
  const sq = CIVIC_SQUARES[squareKey];
  if (!sq) return;

  state.activeSquareKey = squareKey;
  state.userLocation = { ...sq.center };
  state.landmarks = sq.landmarks.map((l) => ({ ...l }));
  state.selectedLandmarkId = sq.landmarks[0]?.id || null;

  closeDossier();
  refreshMapAndUI(true);

  const z = getResponsiveZoom(sq.zoom);
  if (state.leafletMap && state.engine === 'leaflet') {
    state.leafletMap.setView([sq.center.lat, sq.center.lng], z);
  } else if (state.googleMap && state.engine === 'google') {
    state.googleMap.setCenter(sq.center);
    state.googleMap.setZoom(z);
  }
}

function pinpointUserGPS() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.');
    return;
  }

  showToast('Acquiring high-accuracy smartphone GPS fix...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      state.userLocation = { lat, lng };
      els.squareSelect.value = 'live-gps';
      closeDossier();

      if (state.engine === 'google' && state.googleMap) {
        state.googleMap.setCenter({ lat, lng });
        state.googleMap.setZoom(17);
      } else if (state.leafletMap) {
        state.leafletMap.setView([lat, lng], 17);
      }

      await scanNearbyBuildingsAt(lat, lng);
    },
    (err) => {
      console.warn('Geolocation error:', err);
      showToast('GPS permission denied or unavailable. Exploring active civic square.');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

/* ==========================================================================
   Event Listeners & Initialization
   ========================================================================== */
function initApp() {
  initLeafletMap();
  loadSquarePreset('parliament-london');

  // Open first building dossier briefly or let user see all building names clearly on map
  // Select the first landmark marker state without covering the map until clicked
  state.selectedLandmarkId = state.landmarks[0]?.id || null;
  refreshMapAndUI(false);

  // Square preset selector
  els.squareSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'live-gps') {
      pinpointUserGPS();
    } else {
      loadSquarePreset(val);
    }
  });

  // Pinpoint Me GPS button
  els.pinpointMeBtn.addEventListener('click', () => {
    pinpointUserGPS();
  });

  // Scan current map center
  els.scanHereBtn.addEventListener('click', () => {
    let center = state.userLocation;
    if (state.engine === 'google' && state.googleMap) {
      const c = state.googleMap.getCenter();
      if (c) center = { lat: c.lat(), lng: c.lng() };
    } else if (state.leafletMap) {
      const c = state.leafletMap.getCenter();
      center = { lat: c.lat, lng: c.lng };
    }
    state.userLocation = center;
    scanNearbyBuildingsAt(center.lat, center.lng);
  });

  // Close Dossier Sheet
  els.dossierCloseBtn.addEventListener('click', closeDossier);

  // Daylight / Night Survey Binary Inversion Toggle
  els.themeToggleBtn.addEventListener('click', () => {
    const html = document.documentElement;
    const next = html.getAttribute('data-theme') === 'night' ? 'day' : 'night';
    html.setAttribute('data-theme', next);
    showToast(next === 'night' ? 'Night Survey Mode active' : 'Daylight Buff Mode active');
  });

  // Google Maps API Key Drawer
  els.apiKeyBtn.addEventListener('click', () => {
    els.gmapsKeyInput.value = state.gmapsApiKey;
    els.apiDrawerBackdrop.classList.add('is-open');
    els.apiDrawerBackdrop.setAttribute('aria-hidden', 'false');
  });

  els.apiDrawerClose.addEventListener('click', () => {
    els.apiDrawerBackdrop.classList.remove('is-open');
    els.apiDrawerBackdrop.setAttribute('aria-hidden', 'true');
  });

  els.apiDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === els.apiDrawerBackdrop) {
      els.apiDrawerBackdrop.classList.remove('is-open');
      els.apiDrawerBackdrop.setAttribute('aria-hidden', 'true');
    }
  });

  els.saveGmapsKeyBtn.addEventListener('click', () => {
    const key = els.gmapsKeyInput.value.trim();
    if (!key) {
      showToast('Please paste a valid Google Maps API key starting with AIza...');
      return;
    }
    state.gmapsApiKey = key;
    localStorage.setItem('spot_spotter_gmaps_key', key);
    els.apiDrawerBackdrop.classList.remove('is-open');
    els.apiDrawerBackdrop.setAttribute('aria-hidden', 'true');
    activateGoogleMapsEngine(key);
  });

  els.clearGmapsKeyBtn.addEventListener('click', () => {
    state.gmapsApiKey = '';
    localStorage.removeItem('spot_spotter_gmaps_key');
    els.gmapsKeyInput.value = '';
    els.apiDrawerBackdrop.classList.remove('is-open');
    els.apiDrawerBackdrop.setAttribute('aria-hidden', 'true');
    revertToFreeEngine('Switched to Free Built-In Discovery Engine ($0 cost).');
  });

  // Auto-activate Google Maps if user saved a key previously
  if (state.gmapsApiKey) {
    activateGoogleMapsEngine(state.gmapsApiKey);
  }
}

document.addEventListener('DOMContentLoaded', initApp);
