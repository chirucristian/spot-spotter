/**
 * Spot Spotter — Distilled Rooftop Name Pills & Spatial Landmark Card
 * Default Engine: Google Maps JavaScript API (with automatic seamless fallback if demo key is rate-limited)
 */

const DEFAULT_GMAPS_KEY = 'AIzaSyB5OWTwB2jmqFB5IZMcwyJ816yGicXnffY';

const CIVIC_SQUARES = {
  'senate-helsinki': {
    name: 'Senate Square · Helsinki',
    center: { lat: 60.1695, lng: 24.9522 },
    zoom: 17,
    landmarks: [
      {
        id: 'helsinki-cathedral',
        name: 'Helsinki Cathedral',
        role: 'Evangelical Lutheran Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 60.1704,
        lng: 24.9522,
        wikiTitle: 'Helsinki_Cathedral',
        summary: 'Designed by Carl Ludvig Engel as the architectural climax of Senate Square, this neoclassical white landmark with green domes was completed in 1852.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Helsinki_Cathedral_in_July_2004.jpg/960px-Helsinki_Cathedral_in_July_2004.jpg'
      },
      {
        id: 'government-palace-fi',
        name: 'Government Palace',
        role: 'Prime Minister’s Office & Council of State',
        category: 'civic',
        catLabel: 'Government',
        lat: 60.1695,
        lng: 24.9539,
        wikiTitle: 'Government_Palace_(Finland)',
        summary: 'Enclosing the eastern side of Senate Square since 1822, this Empire-style palace houses the Prime Minister’s Office and the Finnish Council of State.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Government_Palace_Helsinki.jpg/960px-Government_Palace_Helsinki.jpg'
      },
      {
        id: 'uni-helsinki-main',
        name: 'University Main Building',
        role: 'University of Helsinki Central Hall',
        category: 'law',
        catLabel: 'University',
        lat: 60.1694,
        lng: 24.9502,
        wikiTitle: 'University_of_Helsinki',
        summary: 'Completed by Carl Ludvig Engel in 1832 on the western side of Senate Square, mirroring the Government Palace across the plaza with an Ionic colonnade.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Helsingin_yliopiston_p%C3%A4%C3%A4rakennus.jpg/960px-Helsingin_yliopiston_p%C3%A4%C3%A4rakennus.jpg'
      },
      {
        id: 'national-library-fi',
        name: 'National Library of Finland',
        role: 'Corinthian Rotunda & Research Archive',
        category: 'culture',
        catLabel: 'Library',
        lat: 60.1703,
        lng: 24.9503,
        wikiTitle: 'National_Library_of_Finland',
        summary: 'Renowned for its frescoed vaults, Corinthian columns, and six-story cast-iron Rotunda added by Gustaf Nyström in 1906.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/National_Library_of_Finland_2019.jpg/960px-National_Library_of_Finland_2019.jpg'
      },
      {
        id: 'sederholm-house',
        name: 'Sederholm House',
        role: 'Helsinki City Museum · Oldest Stone Building',
        category: 'culture',
        catLabel: 'Museum',
        lat: 60.1687,
        lng: 24.9535,
        wikiTitle: 'Sederholm_House',
        summary: 'Built in 1757 by merchant Johan Sederholm at the southeast corner of Senate Square, it is the oldest permanent stone building in central Helsinki.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sederholmin_talo.jpg/960px-Sederholmin_talo.jpg'
      }
    ]
  },

  'parliament-london': {
    name: 'Parliament Square · London',
    center: { lat: 51.5007, lng: -0.1266 },
    zoom: 17,
    landmarks: [
      {
        id: 'westminster-palace',
        name: 'Palace of Westminster',
        role: 'Houses of Parliament · Commons & Lords',
        category: 'civic',
        catLabel: 'Parliament',
        lat: 51.4995,
        lng: -0.1248,
        wikiTitle: 'Palace_of_Westminster',
        summary: 'The meeting place of the UK Parliament. Rebuilt in Perpendicular Gothic style by Charles Barry and Augustus Pugin after 1834, anchored by Elizabeth Tower (Big Ben).',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg/960px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall_%28cropped%29.jpg'
      },
      {
        id: 'supreme-court-uk',
        name: 'Middlesex Guildhall',
        role: 'House of Law · UK Supreme Court',
        category: 'law',
        catLabel: 'House of Law',
        lat: 51.5006,
        lng: -0.1277,
        wikiTitle: 'Middlesex_Guildhall',
        summary: 'Standing on the western edge of Parliament Square, this 1913 Gothic Revival courthouse serves as the seat of the Supreme Court of the United Kingdom.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Middlesex_Guildhall_2009-09-21.jpg/960px-Middlesex_Guildhall_2009-09-21.jpg'
      },
      {
        id: 'westminster-abbey',
        name: 'Westminster Abbey',
        role: 'Royal Coronation Church since 1066',
        category: 'sacred',
        catLabel: 'Abbey',
        lat: 51.4994,
        lng: -0.1273,
        wikiTitle: 'Westminster_Abbey',
        summary: 'Gothic abbey church on the southern side of the square that has hosted every British royal coronation since 1066 and the tombs of monarchs and scientists.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Westminster_Abbey_West_Door.jpg/800px-Westminster_Abbey_West_Door.jpg'
      },
      {
        id: 'hm-treasury',
        name: 'HM Treasury',
        role: 'Government Offices Great George Street',
        category: 'civic',
        catLabel: 'Ministry',
        lat: 51.5017,
        lng: -0.1272,
        wikiTitle: 'Government_Offices_Great_George_Street',
        summary: 'Occupying the northern boundary of Parliament Square above the Churchill War Rooms, this Edwardian Baroque block houses His Majesty’s Treasury.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/HM_Treasury_building.jpg/960px-HM_Treasury_building.jpg'
      },
      {
        id: 'portcullis-house',
        name: 'Portcullis House',
        role: 'Parliamentary Select Committees',
        category: 'civic',
        catLabel: 'Chambers',
        lat: 51.5012,
        lng: -0.1249,
        wikiTitle: 'Portcullis_House',
        summary: 'Designed by Michael Hopkins on the northeast corner of the square, providing offices and committee rooms for Members of Parliament.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Portcullis_House_from_London_Eye.jpg/800px-Portcullis_House_from_London_Eye.jpg'
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
        role: 'Parliament of Romania · Senate & Chamber',
        category: 'civic',
        catLabel: 'Parliament',
        lat: 44.4275,
        lng: 26.0875,
        wikiTitle: 'Palace_of_the_Parliament',
        summary: 'Dominating Constitution Square, the heaviest building in the world houses the Senate, Chamber of Deputies, and Constitutional Court of Romania.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bucharest_-_Palace_of_the_Parliament_%282022%29.jpg/960px-Bucharest_-_Palace_of_the_Parliament_%282022%29.jpg'
      },
      {
        id: 'palace-of-justice-ro',
        name: 'Palace of Justice',
        role: 'House of Law · Bucharest Court of Appeal',
        category: 'law',
        catLabel: 'House of Law',
        lat: 44.4288,
        lng: 26.0987,
        wikiTitle: 'Palace_of_Justice,_Bucharest',
        summary: 'Built between 1890 and 1895 by Albert Ballu and Ion Mincu in French Renaissance Revival style, housing the Court of Appeal.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Palatul_de_Justitie_Bucuresti.jpg/960px-Palatul_de_Justitie_Bucuresti.jpg'
      },
      {
        id: 'ministry-of-finance-ro',
        name: 'Ministry of Finance',
        role: 'State Treasury & Fiscal Directorate',
        category: 'civic',
        catLabel: 'Ministry',
        lat: 44.4260,
        lng: 26.0928,
        wikiTitle: 'Piața_Constituției',
        summary: 'Framing the southern hemicycle of Piața Constituției, this monumental colonnaded ministry building faces the Palace of the Parliament.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Piata_Constitutiei_Bucuresti.jpg/960px-Piata_Constitutiei_Bucuresti.jpg'
      },
      {
        id: 'national-cathedral-ro',
        name: 'People’s Salvation Cathedral',
        role: 'National Orthodox Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 44.4259,
        lng: 26.0825,
        wikiTitle: 'People%27s_Salvation_Cathedral',
        summary: 'Rising immediately behind the Parliament courtyard, the tallest and largest Eastern Orthodox church building in the world by volume.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Catedrala_Mantuirii_Neamului_2021.jpg/800px-Catedrala_Mantuirii_Neamului_2021.jpg'
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
        role: 'Town Hall & Signoria Civic Council',
        category: 'civic',
        catLabel: 'Town Hall',
        lat: 43.7693,
        lng: 11.2562,
        wikiTitle: 'Palazzo_Vecchio',
        summary: 'Crenellated Romanesque fortress-palace designed by Arnolfo di Cambio in 1299, serving as the seat of Florentine civic government for seven centuries.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Palazzo_Vecchio_from_Piazza_della_Signoria.jpg/800px-Palazzo_Vecchio_from_Piazza_della_Signoria.jpg'
      },
      {
        id: 'tribunale-mercanzia',
        name: 'Tribunale della Mercanzia',
        role: 'House of Law · Commercial Guild Court',
        category: 'law',
        catLabel: 'House of Law',
        lat: 43.7697,
        lng: 11.2565,
        wikiTitle: 'Tribunale_della_Mercanzia',
        summary: 'Founded in 1359 to adjudicate commercial disputes between Florence’s guilds, carved with the stone coats of arms of all twenty-one Arti.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tribunale_della_mercanzia_01.JPG/800px-Tribunale_della_mercanzia_01.JPG'
      },
      {
        id: 'loggia-dei-lanzi',
        name: 'Loggia dei Lanzi',
        role: 'Ceremonial Arcade & Sculpture Gallery',
        category: 'culture',
        catLabel: 'Loggia',
        lat: 43.7691,
        lng: 11.2555,
        wikiTitle: 'Loggia_dei_Lanzi',
        summary: 'Open-air Gothic Renaissance gallery sheltering Cellini’s bronze Perseus with the Head of Medusa and Giambologna’s Rape of the Sabine Women.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Loggia_dei_Lanzi_Florence.jpg/960px-Loggia_dei_Lanzi_Florence.jpg'
      },
      {
        id: 'uffizi-gallery',
        name: 'Uffizi Gallery',
        role: 'Magistrates’ Offices & Art Museum',
        category: 'culture',
        catLabel: 'Museum',
        lat: 43.7684,
        lng: 11.2553,
        wikiTitle: 'Uffizi',
        summary: 'Commissioned by Cosimo I de’ Medici in 1560 and designed by Giorgio Vasari for the judicial and administrative offices ("uffizi") of Florence.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Uffizi_Gallery_Florence.jpg/800px-Uffizi_Gallery_Florence.jpg'
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
        name: 'Hôtel de Ville',
        role: 'City Hall & Brabantine Gothic Spire',
        category: 'civic',
        catLabel: 'City Hall',
        lat: 50.8465,
        lng: 4.3521,
        wikiTitle: 'Brussels_Town_Hall',
        summary: 'Built between 1401 and 1455 on the southern side of the Grand-Place, crowned by a 96-meter gothic tower topped with a statue of St. Michael.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Bruxelles_Grand-Place_Hotel_de_Ville.jpg/800px-Bruxelles_Grand-Place_Hotel_de_Ville.jpg'
      },
      {
        id: 'maison-du-roi',
        name: 'Maison du Roi (Broodhuis)',
        role: 'Ducal Court & Brussels City Museum',
        category: 'law',
        catLabel: 'Ducal Court',
        lat: 50.8469,
        lng: 4.3529,
        wikiTitle: 'Brussels_City_Museum',
        summary: 'Facing the Town Hall across the square, this former judicial and administrative seat of the Dukes of Brabant now houses the Brussels City Museum.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Maison_du_Roi_Bruxelles.jpg/960px-Maison_du_Roi_Bruxelles.jpg'
      },
      {
        id: 'maison-des-ducs-brabant',
        name: 'Maison des Ducs de Brabant',
        role: 'Six Guildhalls Behind One Facade',
        category: 'culture',
        catLabel: 'Guildhalls',
        lat: 50.8463,
        lng: 4.3531,
        wikiTitle: 'House_of_the_Dukes_of_Brabant',
        summary: 'Closing the eastern side of the Grand-Place, Willem de Bruyn unified six guildhalls behind a single monumental neoclassical facade in 1698.',
        fallbackImg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Maison_des_Ducs_de_Brabant_Bruxelles.jpg/960px-Maison_des_Ducs_de_Brabant_Bruxelles.jpg'
      }
    ]
  }
};

const state = {
  activeSquareKey: 'senate-helsinki',
  userLocation: { lat: 60.1695, lng: 24.9522 },
  landmarks: [],
  selectedLandmarkId: null,
  engine: 'google', // Default to Google Maps
  googleMap: null,
  googleMarkers: [],
  googleUserMarker: null,
  leafletMap: null,
  leafletMarkers: [],
  leafletUserMarker: null,
  wikiCache: new Map()
};

const els = {
  squareSelect: document.getElementById('square-select'),
  scanAreaBtn: document.getElementById('scan-area-btn'),
  locateMeBtn: document.getElementById('locate-me-btn'),
  googleContainer: document.getElementById('google-map'),
  leafletContainer: document.getElementById('leaflet-map'),
  placeCard: document.getElementById('place-card'),
  cardCloseBtn: document.getElementById('card-close-btn'),
  cardImg: document.getElementById('card-img'),
  cardBadge: document.getElementById('card-badge'),
  cardTitle: document.getElementById('card-title'),
  cardDistance: document.getElementById('card-distance'),
  cardRole: document.getElementById('card-role'),
  cardSummary: document.getElementById('card-summary'),
  cardMapsLink: document.getElementById('card-maps-link'),
  cardWikiLink: document.getElementById('card-wiki-link'),
  statusToast: document.getElementById('status-toast')
};

/* ==========================================================================
   Helpers
   ========================================================================== */
function computeDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistance(meters) {
  return meters < 1000 ? `${meters} m` : `${(meters / 1000).toFixed(1)} km`;
}

let toastTimer = null;
function showToast(msg) {
  els.statusToast.textContent = msg;
  els.statusToast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.statusToast.classList.remove('is-visible');
  }, 3000);
}

/* ==========================================================================
   Compact Rooftop Pill HTML & Collision De-Crowding
   ========================================================================== */
function createRooftopPillHTML(landmark) {
  const isSelected = state.selectedLandmarkId === landmark.id;
  const catClass = `cat-${landmark.category || 'civic'}`;
  return `
    <div class="rooftop-pill-anchor ${catClass} ${isSelected ? 'is-selected' : ''}" data-landmark-id="${landmark.id}">
      <div class="rooftop-pill">
        <span class="pill-dot"></span>
        <span class="pill-name">${landmark.name}</span>
      </div>
      <div class="pill-pointer"></div>
      <div class="pill-roof-dot"></div>
    </div>
  `;
}

function resolvePillCollisions() {
  const pills = Array.from(document.querySelectorAll('.rooftop-pill-anchor'));
  pills.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = el.classList.contains('is-selected')
      ? 'translate(-50%, -106%) scale(1.06)'
      : 'translate(-50%, -100%)';
  });

  // Sort by vertical position (bottom to top) so lower pills stay anchored and upper pills lift up if needed
  const ordered = pills.sort((a, b) => {
    const aSel = a.classList.contains('is-selected') ? 1 : 0;
    const bSel = b.classList.contains('is-selected') ? 1 : 0;
    if (aSel !== bSel) return bSel - aSel;
    return b.getBoundingClientRect().top - a.getBoundingClientRect().top;
  });

  const placedBoxes = [];
  for (const el of ordered) {
    const pillBox = el.querySelector('.rooftop-pill');
    if (!pillBox) continue;
    let rect = pillBox.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;

    let shiftY = 0;
    let attempts = 0;
    while (
      attempts < 3 &&
      placedBoxes.some(
        (b) =>
          rect.left < b.right - 2 &&
          rect.right > b.left + 2 &&
          rect.top < b.bottom + 2 &&
          rect.bottom > b.top - 2
      )
    ) {
      shiftY -= 32;
      el.style.transform = `translate(-50%, calc(-100% + ${shiftY}px))`;
      rect = pillBox.getBoundingClientRect();
      attempts++;
    }

    placedBoxes.push(rect);
  }
}

/* ==========================================================================
   Google Maps Default Engine + Automatic Fallback
   ========================================================================== */
function loadGoogleMapsSDK(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    window.gm_authFailure = () => {
      reject(new Error('Google Maps demo key quota reached; switching to live fallback map.'));
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load.'));
    document.head.appendChild(script);
  });
}

function getMobileAwareZoom(baseZoom) {
  return window.innerWidth < 520 ? Math.max(15.6, baseZoom - 0.8) : baseZoom;
}

async function initMapEngine() {
  const initialSquare = CIVIC_SQUARES[state.activeSquareKey];
  state.userLocation = { ...initialSquare.center };
  state.landmarks = initialSquare.landmarks.map((l) => ({ ...l }));

  try {
    await loadGoogleMapsSDK(DEFAULT_GMAPS_KEY);
    state.engine = 'google';
    els.googleContainer.classList.remove('hidden');
    els.leafletContainer.classList.add('hidden');

    state.googleMap = new google.maps.Map(els.googleContainer, {
      center: initialSquare.center,
      zoom: getMobileAwareZoom(initialSquare.zoom),
      disableDefaultUI: true,
      gestureHandling: 'greedy',
      clickableIcons: false,
      styles: [
        { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] }
      ]
    });

    state.googleMap.addListener('idle', () => {
      requestAnimationFrame(resolvePillCollisions);
    });

    renderMarkers();
  } catch (err) {
    console.warn(err.message);
    switchToLeafletFallback();
  }
}

function switchToLeafletFallback() {
  state.engine = 'leaflet';
  els.googleContainer.classList.add('hidden');
  els.leafletContainer.classList.remove('hidden');

  const sq = CIVIC_SQUARES[state.activeSquareKey];
  if (!state.leafletMap) {
    state.leafletMap = L.map('leaflet-map', {
      center: [sq.center.lat, sq.center.lng],
      zoom: sq.zoom,
      zoomControl: false
    });

    // Clean, light Carto Voyager base map so building name pills pop cleanly
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(state.leafletMap);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      opacity: 0.55
    }).addTo(state.leafletMap);

    state.leafletMap.on('moveend zoomend', () => {
      requestAnimationFrame(resolvePillCollisions);
    });
  }

  loadSquarePreset(state.activeSquareKey);
}

// Intercept Google Maps runtime modal / billing errors and seamlessly switch to clean map
const gmObserver = new MutationObserver(() => {
  const errContainer = els.googleContainer.querySelector('.gm-err-container, .dismissButton');
  if (errContainer && state.engine === 'google') {
    gmObserver.disconnect();
    switchToLeafletFallback();
  }
});
gmObserver.observe(els.googleContainer, { childList: true, subtree: true });

/* ==========================================================================
   Render Rooftop Pills on Active Map Engine
   ========================================================================== */
function renderMarkers() {
  if (state.engine === 'google' && state.googleMap && window.google?.maps) {
    state.googleMarkers.forEach((m) => m.setMap(null));
    state.googleMarkers = [];
    if (state.googleUserMarker) state.googleUserMarker.setMap(null);

    class RooftopOverlay extends google.maps.OverlayView {
      constructor(pos, html, onClick) {
        super();
        this.pos = new google.maps.LatLng(pos.lat, pos.lng);
        this.html = html;
        this.onClick = onClick;
        this.div = null;
      }
      onAdd() {
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.innerHTML = this.html;
        if (this.onClick) {
          this.div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onClick();
          });
        }
        this.getPanes().overlayMouseTarget.appendChild(this.div);
      }
      draw() {
        const proj = this.getProjection();
        if (!proj || !this.div) return;
        const pt = proj.fromLatLngToDivPixel(this.pos);
        if (pt) {
          this.div.style.left = `${pt.x}px`;
          this.div.style.top = `${pt.y}px`;
        }
        requestAnimationFrame(resolvePillCollisions);
      }
      onRemove() {
        if (this.div?.parentNode) this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }

    state.googleUserMarker = new RooftopOverlay(
      state.userLocation,
      `<div class="user-gps-dot"><div class="user-gps-halo"></div><div class="user-gps-inner"></div></div>`,
      null
    );
    state.googleUserMarker.setMap(state.googleMap);

    state.landmarks.forEach((lm) => {
      const ov = new RooftopOverlay(
        { lat: lm.lat, lng: lm.lng },
        createRooftopPillHTML(lm),
        () => selectLandmark(lm.id)
      );
      ov.setMap(state.googleMap);
      state.googleMarkers.push(ov);
    });

    setTimeout(resolvePillCollisions, 120);
    return;
  }

  if (state.leafletMap) {
    state.leafletMarkers.forEach((m) => state.leafletMap.removeLayer(m));
    state.leafletMarkers = [];
    if (state.leafletUserMarker) state.leafletMap.removeLayer(state.leafletUserMarker);

    const userIcon = L.divIcon({
      className: 'rooftop-marker-wrap',
      html: `<div class="user-gps-dot"><div class="user-gps-halo"></div><div class="user-gps-inner"></div></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    state.leafletUserMarker = L.marker([state.userLocation.lat, state.userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(state.leafletMap);

    state.landmarks.forEach((lm, idx) => {
      const icon = L.divIcon({
        className: 'rooftop-marker-wrap',
        html: createRooftopPillHTML(lm),
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

    setTimeout(resolvePillCollisions, 80);
  }
}

/* ==========================================================================
   Select Building & Open Clean Summary + Photo Card
   ========================================================================== */
async function selectLandmark(landmarkId) {
  const lm = state.landmarks.find((l) => l.id === landmarkId);
  if (!lm) return;

  state.selectedLandmarkId = lm.id;

  if (state.engine === 'google' && state.googleMap) {
    state.googleMap.panTo({ lat: lm.lat, lng: lm.lng });
  } else if (state.leafletMap) {
    state.leafletMap.panTo([lm.lat, lm.lng], { animate: true, duration: 0.4 });
  }

  renderMarkers();

  const distMeters = computeDistanceMeters(
    state.userLocation.lat,
    state.userLocation.lng,
    lm.lat,
    lm.lng
  );

  els.cardBadge.textContent = lm.catLabel || 'Landmark';
  els.cardTitle.textContent = lm.name;
  els.cardDistance.textContent = formatDistance(distMeters);
  els.cardRole.textContent = lm.role;
  els.cardSummary.textContent = lm.summary;
  els.cardImg.src = lm.fallbackImg;
  els.cardImg.alt = lm.name;
  els.cardMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lm.name)}+${lm.lat},${lm.lng}`;
  els.cardWikiLink.href = `https://en.wikipedia.org/wiki/${lm.wikiTitle || encodeURIComponent(lm.name)}`;

  els.placeCard.classList.add('is-open');
  els.placeCard.setAttribute('aria-hidden', 'false');

  // Enrich photo & summary from Wikipedia REST API
  if (lm.wikiTitle && !state.wikiCache.has(lm.wikiTitle)) {
    try {
      const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${lm.wikiTitle}`);
      if (res.ok) {
        const data = await res.json();
        state.wikiCache.set(lm.wikiTitle, data);
      }
    } catch (_) {}
  }

  const cached = state.wikiCache.get(lm.wikiTitle);
  if (cached && state.selectedLandmarkId === lm.id) {
    if (cached.thumbnail?.source) els.cardImg.src = cached.thumbnail.source;
    if (cached.extract && cached.extract.length > 35) els.cardSummary.textContent = cached.extract;
  }
}

function closeCard() {
  state.selectedLandmarkId = null;
  els.placeCard.classList.remove('is-open');
  els.placeCard.setAttribute('aria-hidden', 'true');
  renderMarkers();
}

/* ==========================================================================
   Load Preset Square or Spot Buildings in Current View
   ========================================================================== */
function loadSquarePreset(squareKey) {
  const sq = CIVIC_SQUARES[squareKey];
  if (!sq) return;

  state.activeSquareKey = squareKey;
  state.userLocation = { ...sq.center };
  state.landmarks = sq.landmarks.map((l) => ({ ...l }));
  state.selectedLandmarkId = null;
  closeCard();

  const isMobile = window.innerWidth < 520;
  if (state.engine === 'google' && state.googleMap) {
    if (isMobile && state.landmarks.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      state.landmarks.forEach((l) => bounds.extend({ lat: l.lat, lng: l.lng }));
      state.googleMap.fitBounds(bounds, { top: 80, right: 65, bottom: 70, left: 65 });
    } else {
      state.googleMap.setCenter(sq.center);
      state.googleMap.setZoom(sq.zoom);
    }
  } else if (state.leafletMap) {
    if (isMobile && state.landmarks.length > 1) {
      const bounds = L.latLngBounds(state.landmarks.map((l) => [l.lat, l.lng]));
      state.leafletMap.fitBounds(bounds, { padding: [65, 65] });
    } else {
      state.leafletMap.setView([sq.center.lat, sq.center.lng], sq.zoom);
    }
  }

  renderMarkers();
}

function inferCategory(title, desc = '') {
  const t = `${title} ${desc}`.toLowerCase();
  if (t.includes('court') || t.includes('justice') || t.includes('law') || t.includes('tribunal')) {
    return { category: 'law', catLabel: 'House of Law' };
  }
  if (t.includes('parliament') || t.includes('palace') || t.includes('ministry') || t.includes('government') || t.includes('city hall') || t.includes('town hall')) {
    return { category: 'civic', catLabel: 'Civic Building' };
  }
  if (t.includes('cathedral') || t.includes('church') || t.includes('abbey') || t.includes('basilica') || t.includes('chapel')) {
    return { category: 'sacred', catLabel: 'Sacred' };
  }
  return { category: 'culture', catLabel: 'Landmark' };
}

/**
 * Filter out streets, markets, or events so only real buildings & monuments appear,
 * and enforce minimum 45m spacing so rooftop pills stay clean and uncrowded.
 */
async function spotBuildingsAround(lat, lng) {
  showToast('Spotting notable buildings around you...');

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&generator=geosearch&ggscoord=${lat}|${lng}&ggsradius=550&ggslimit=16&prop=coordinates|pageimages|extracts|description&exintro=1&explaintext=1&exchars=260&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const pages = data?.query?.pages ? Object.values(data.query.pages) : [];

    // Filter out streets ("katu", "street", "road") and seasonal events ("Christmas Market")
    const filtered = pages.filter((p) => {
      if (!p.coordinates?.length) return false;
      const text = `${p.title} ${p.description || ''}`.toLowerCase();
      if (text.includes('street') || text.includes('road') || text.includes('christmas market') || text.includes('avenue') || text.includes('railway station')) {
        return false;
      }
      return true;
    });

    // De-duplicate spatially (at least 45m apart) up to 7 crisp landmarks
    const selected = [];
    for (const p of filtered) {
      const c = p.coordinates[0];
      const tooClose = selected.some(
        (s) => computeDistanceMeters(c.lat, c.lon, s.lat, s.lng) < 45
      );
      if (!tooClose) {
        const cat = inferCategory(p.title, p.description || p.extract || '');
        selected.push({
          id: `wiki-${p.pageid}`,
          name: p.title.replace(/\s*\([^)]*\)\s*/g, ''), // Strip parenthetical clutter like "(Finland)"
          role: p.description
            ? p.description.charAt(0).toUpperCase() + p.description.slice(1)
            : 'Notable Building & Landmark',
          category: cat.category,
          catLabel: cat.catLabel,
          lat: c.lat,
          lng: c.lon,
          wikiTitle: encodeURIComponent(p.title.replace(/\s+/g, '_')),
          summary: p.extract || 'Historic architectural landmark at this location.',
          fallbackImg:
            p.thumbnail?.source ||
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Helsinki_Cathedral_in_July_2004.jpg/960px-Helsinki_Cathedral_in_July_2004.jpg'
        });
      }
      if (selected.length >= 6) break;
    }

    if (selected.length === 0) {
      showToast('No major landmarks found within 550m.');
      return;
    }

    state.landmarks = selected;
    closeCard();
    renderMarkers();
    showToast(`Spotted ${selected.length} buildings around this square`);
  } catch (err) {
    console.error(err);
    showToast('Could not fetch live landmarks right now.');
  }
}

function pinpointMe() {
  if (!navigator.geolocation) {
    showToast('Geolocation not available on this device.');
    return;
  }
  showToast('Locating your position...');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      state.userLocation = { lat, lng };
      els.squareSelect.value = 'live-gps';

      if (state.engine === 'google' && state.googleMap) {
        state.googleMap.setCenter({ lat, lng });
        state.googleMap.setZoom(17);
      } else if (state.leafletMap) {
        state.leafletMap.setView([lat, lng], 17);
      }
      await spotBuildingsAround(lat, lng);
    },
    () => {
      showToast('Location permission denied — use the dropdown or pan the map.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

/* ==========================================================================
   Events
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initMapEngine();

  els.squareSelect.addEventListener('change', (e) => {
    if (e.target.value === 'live-gps') {
      pinpointMe();
    } else {
      loadSquarePreset(e.target.value);
    }
  });

  els.locateMeBtn.addEventListener('click', pinpointMe);

  els.scanAreaBtn.addEventListener('click', () => {
    let center = state.userLocation;
    if (state.engine === 'google' && state.googleMap) {
      const c = state.googleMap.getCenter();
      if (c) center = { lat: c.lat(), lng: c.lng() };
    } else if (state.leafletMap) {
      const c = state.leafletMap.getCenter();
      center = { lat: c.lat, lng: c.lng };
    }
    state.userLocation = center;
    spotBuildingsAround(center.lat, center.lng);
  });

  els.cardCloseBtn.addEventListener('click', closeCard);
});
