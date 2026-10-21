import { CivicSquare } from '../types';

export const DEFAULT_GMAPS_KEY = 'AIzaSyB5OWTwB2jmqFB5IZMcwyJ816yGicXnffY';

export const CIVIC_SQUARES: Record<string, CivicSquare> = {
  'senate-helsinki': {
    key: 'senate-helsinki',
    name: 'Senate Square · Helsinki',
    center: { lat: 60.1695, lng: 24.9522 },
    zoom: 17,
    landmarks: [
      {
        id: 'helsinki-cathedral',
        name: 'Helsinki Cathedral',
        role: 'Neoclassical Domed Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 60.1704,
        lng: 24.9522,
        wikiTitle: 'Helsinki_Cathedral',
        built: '1830–1852',
        summary:
          'Built as the neoclassical centerpiece of Carl Ludvig Engel’s Imperial Helsinki master plan (and known as St. Nicholas’ Church until 1917), Helsinki Cathedral crowns a monumental granite staircase on the northern crest of Senate Square. Its symmetrical Greek-cross plan is topped by a central green dome rising 62 meters above sea level, flanked by four corner bell towers and twelve rooftop zinc statues of the Apostles added by Ernst Lohrmann.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Exterior_of_Helsinki_Cathedral_%283%29.JPG/960px-Exterior_of_Helsinki_Cathedral_%283%29.JPG',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Exterior_of_Helsinki_Cathedral_%288%29.JPG/960px-Exterior_of_Helsinki_Cathedral_%288%29.JPG',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Sky-foto_M%C3%B6ller_-_Aerial_photograph_of_Helsinki_Cathedral_from_above_it_in_1976.jpg/960px-Sky-foto_M%C3%B6ller_-_Aerial_photograph_of_Helsinki_Cathedral_from_above_it_in_1976.jpg'
        ],
        importance: 98,
        enriched: true
      },
      {
        id: 'government-palace-fi',
        name: 'Government Palace',
        role: 'Empire Neoclassical Civic Palace',
        category: 'civic',
        catLabel: 'Palace',
        lat: 60.1695,
        lng: 24.9539,
        wikiTitle: 'Government_Palace_(Finland)',
        built: '1818–1822',
        summary:
          'Enclosing the eastern flank of Senate Square, the Government Palace was designed by Carl Ludvig Engel and erected between 1818 and 1822 in the Empire Neoclassical style. Its Corinthian pediment overlooking the plaza holds the oldest public clock face in Helsinki, installed by Jaakko Juusten in 1822.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Valtioneuvoston_linna.jpg/1280px-Valtioneuvoston_linna.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Valtioneuvoston_linna.jpg/1280px-Valtioneuvoston_linna.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Finnish_Government_Palace_from_above_in_the_1960s.jpg/960px-Finnish_Government_Palace_from_above_in_the_1960s.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Eric_Sundstr%C3%B6m_-_Finnish_Government_Palace_lobby_in_1917.jpg/960px-Eric_Sundstr%C3%B6m_-_Finnish_Government_Palace_lobby_in_1917.jpg'
        ],
        importance: 86,
        enriched: true
      },
      {
        id: 'uni-helsinki-main',
        name: 'University Main Building',
        role: 'Neoclassical Ionic Colonnaded Building',
        category: 'civic',
        catLabel: 'Building',
        lat: 60.1694,
        lng: 24.9502,
        wikiTitle: 'University_of_Helsinki',
        built: '1828–1832',
        summary:
          'Designed by Carl Ludvig Engel on the western side of Senate Square to mirror the proportions of the Government Palace opposite, the University Main Building features an eight-column Greek Ionic facade and a semicircular Great Ceremonial Hall. In the 1930s, architect J.S. Sirén extended the building westward to encompass the entire city block.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg/1280px-University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg/1280px-University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/University_of_Helsinki%2C_Main_Building_%2852890135967%29.jpg/960px-University_of_Helsinki%2C_Main_Building_%2852890135967%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Helsinki_University_Finland_100_celebration_-_Marit_Henriksson.jpg/960px-Helsinki_University_Finland_100_celebration_-_Marit_Henriksson.jpg'
        ],
        importance: 85,
        enriched: true
      },
      {
        id: 'alexander-ii-statue',
        name: 'Statue of Alexander II',
        role: 'Bronze & Red Granite Monument',
        category: 'culture',
        catLabel: 'Monument',
        lat: 60.1695,
        lng: 24.9522,
        wikiTitle: 'Alexander_II_(statue_in_Helsinki)',
        built: '1894',
        summary:
          'Unveiled on 29 April 1894 at the exact geometric center of Senate Square, this 10.67-meter bronze and red-granite monument by Walter Runeberg and Johannes Takanen is surrounded by four allegorical bronze figures representing Law (Lex), Light (Lux), Peace (Pax), and Labor (Labor).',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/11-07-29-helsinki-by-RalfR-149.jpg/960px-11-07-29-helsinki-by-RalfR-149.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/11-07-29-helsinki-by-RalfR-149.jpg/960px-11-07-29-helsinki-by-RalfR-149.jpg'
        ],
        importance: 68,
        enriched: true
      },
      {
        id: 'national-library-fi',
        name: 'National Library Building',
        role: 'Corinthian Domed Hall & Art Nouveau Rotunda',
        category: 'culture',
        catLabel: 'Library Building',
        lat: 60.1703,
        lng: 24.9503,
        wikiTitle: 'National_Library_of_Finland',
        built: '1840–1844',
        summary:
          'Widely regarded as Carl Ludvig Engel’s architectural masterpiece, this fireproof masonry library building northwest of the Cathedral features three skylit barrel-vaulted halls modeled on classical Roman temples, expanded in 1906 with Gustaf Nyström’s six-story semicircular Art Nouveau Rotunda.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/National_Library_of_Finland.jpg/1280px-National_Library_of_Finland.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/National_Library_of_Finland.jpg/1280px-National_Library_of_Finland.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Kansalliskirjasto_-_National_Library_of_Finland%2C_Helsinki_%2852890137262%29.jpg/1280px-Kansalliskirjasto_-_National_Library_of_Finland%2C_Helsinki_%2852890137262%29.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/e/e5/Rotunda_Julkisivu.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Inside_view_of_National_Library_of_Finland_001_%282%29.jpg/960px-Inside_view_of_National_Library_of_Finland_001_%282%29.jpg'
        ],
        importance: 75,
        enriched: true
      },
      {
        id: 'sederholm-house',
        name: 'Sederholm House',
        role: '18th-Century Stone Merchant House',
        category: 'culture',
        catLabel: 'Building',
        lat: 60.1687,
        lng: 24.9535,
        wikiTitle: 'Sederholm_House',
        built: '1757',
        summary:
          'Erected in 1757 for merchant Johan Sederholm at the southeast corner of Senate Square, Sederholm House is the oldest surviving stone building in central Helsinki, featuring a steep mansard roof, vaulted ground-floor cellars, and symmetrical 18th-century Rococo-classical windows.',
        fallbackImg:
          'https://upload.wikimedia.org/wikipedia/commons/8/83/Sederholmin_talo.jpg',
        photos: [
          'https://upload.wikimedia.org/wikipedia/commons/8/83/Sederholmin_talo.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Sederholmin_talo%2C_taustalla_Valtioneuvoston_kanslia.jpg/960px-Sederholmin_talo%2C_taustalla_Valtioneuvoston_kanslia.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Sederholmin_talo_-_Marit_Henriksson.jpg/960px-Sederholmin_talo_-_Marit_Henriksson.jpg'
        ],
        importance: 52,
        enriched: true
      },
      {
        id: 'uspenski-cathedral',
        name: 'Uspenski Cathedral',
        role: 'Russian Revival Red-Brick Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 60.1683,
        lng: 24.9600,
        wikiTitle: 'Uspenski_Cathedral',
        built: '1862–1868',
        summary:
          'Set atop a rocky granite bluff on the Katajanokka peninsula overlooking the harbor, Uspenski Cathedral was designed by Alexey Gornostayev and built from 700,000 red bricks salvaged from Bomarsund Fortress, crowned with thirteen 22-karat gilded onion domes.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Catedral_Uspenski%2C_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_03.JPG/960px-Catedral_Uspenski%2C_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_03.JPG',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1a/Catedral_Uspenski%2C_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_03.JPG/960px-Catedral_Uspenski%2C_Helsinki%2C_Finlandia%2C_2012-08-14%2C_DD_03.JPG'
        ],
        importance: 95
      },
      {
        id: 'presidential-palace-fi',
        name: 'Presidential Palace',
        role: 'Empire Neoclassical Waterfront Palace',
        category: 'civic',
        catLabel: 'Palace',
        lat: 60.1683,
        lng: 24.9563,
        wikiTitle: 'Presidential_Palace,_Helsinki',
        built: '1820',
        summary:
          'Facing the South Harbor and Market Square waterfront, this three-story Empire Neoclassical palace was originally built in 1820 by Pehr Granstedt as a merchant mansion and remodeled in 1845 by Carl Ludvig Engel with a colonnaded facade, Hall of Mirrors, and octagonal Yellow Salon.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Presidentinlinna%2C_IMG_0548.jpg/960px-Presidentinlinna%2C_IMG_0548.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Presidentinlinna%2C_IMG_0548.jpg/960px-Presidentinlinna%2C_IMG_0548.jpg'
        ],
        importance: 90
      },
      {
        id: 'havis-amanda',
        name: 'Havis Amanda',
        role: 'Art Nouveau Bronze Mermaid Fountain',
        category: 'culture',
        catLabel: 'Fountain',
        lat: 60.1675,
        lng: 24.9514,
        wikiTitle: 'Havis_Amanda',
        built: '1908',
        summary:
          'Cast in Paris by Finnish sculptor Ville Vallgren and unveiled between Market Square and Esplanadi Park in 1908, Havis Amanda depicts a bronze mermaid rising from the waves atop a red granite fountain basin designed with Eliel Saarinen, surrounded by four spouting fish and four bronze sea lions.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/%22Havis_Amanda%22%2C_la_statue_de_la_fontaine_de_Vallgren_%28Helsinki%29_%282744386193%29.jpg/960px-%22Havis_Amanda%22%2C_la_statue_de_la_fontaine_de_Vallgren_%28Helsinki%29_%282744386193%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/38/%22Havis_Amanda%22%2C_la_statue_de_la_fontaine_de_Vallgren_%28Helsinki%29_%282744386193%29.jpg/960px-%22Havis_Amanda%22%2C_la_statue_de_la_fontaine_de_Vallgren_%28Helsinki%29_%282744386193%29.jpg'
        ],
        importance: 72
      },
      {
        id: 'ateneum-museum',
        name: 'Ateneum',
        role: 'Neo-Renaissance Gallery Building',
        category: 'culture',
        catLabel: 'Museum Building',
        lat: 60.1700,
        lng: 24.9442,
        wikiTitle: 'Ateneum',
        built: '1887',
        summary:
          'Anchoring the southern side of Railway Square, the Neo-Renaissance Ateneum building was designed by Theodor Höijer and completed in 1887. Its richly sculpted facade features four caryatids symbolizing Architecture, Painting, Sculpture, and Music, along with relief busts of Bramante, Raphael, and Phidias.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Helsinki_July_2013-26a.jpg/960px-Helsinki_July_2013-26a.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Helsinki_July_2013-26a.jpg/960px-Helsinki_July_2013-26a.jpg'
        ],
        importance: 88
      },
      {
        id: 'helsinki-central-station',
        name: 'Helsinki Central Station',
        role: 'National Romantic Granite Terminal & Clock Tower',
        category: 'civic',
        catLabel: 'Building',
        lat: 60.1719,
        lng: 24.9414,
        wikiTitle: 'Helsinki_Central_Station',
        built: '1909–1919',
        summary:
          'Designed by Eliel Saarinen and clad in Finnish Hanko granite, Helsinki Central Station is one of the defining buildings of 20th-century Nordic architecture. Its arched main portal is flanked by Emil Wikström’s four monumental Lantern-Carrier statues and crowned by a 48.5-meter copper-roofed clock tower.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/HelsinkiStationEntranceAndClockTower.jpg/960px-HelsinkiStationEntranceAndClockTower.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/HelsinkiStationEntranceAndClockTower.jpg/960px-HelsinkiStationEntranceAndClockTower.jpg'
        ],
        importance: 94
      }
    ]
  },

  'parliament-london': {
    key: 'parliament-london',
    name: 'Parliament Square · London',
    center: { lat: 51.5007, lng: -0.1266 },
    zoom: 17,
    landmarks: [
      {
        id: 'westminster-palace',
        name: 'Palace of Westminster',
        role: 'Perpendicular Gothic Revival Palace',
        category: 'civic',
        catLabel: 'Palace',
        lat: 51.4995,
        lng: -0.1248,
        wikiTitle: 'Palace_of_Westminster',
        built: '1840–1870',
        summary:
          'After fire destroyed the medieval royal palace in October 1834, Sir Charles Barry and Augustus Pugin designed this 1,100-room Perpendicular Gothic Revival palace along the River Thames, integrating medieval Westminster Hall (1097) and anchoring the skyline with the 96-meter Elizabeth Tower ("Big Ben") and 98.5-meter Victoria Tower.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Palace_of_Westminster_as_seen_from_Westminster_Bridge.jpg/1280px-Palace_of_Westminster_as_seen_from_Westminster_Bridge.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Palace_of_Westminster_as_seen_from_Westminster_Bridge.jpg/1280px-Palace_of_Westminster_as_seen_from_Westminster_Bridge.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/London_Parliament_2007-1.jpg/1280px-London_Parliament_2007-1.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Palace_of_Westminster%2C_London_-_Feb_2007.jpg/1280px-Palace_of_Westminster%2C_London_-_Feb_2007.jpg'
        ]
      },
      {
        id: 'supreme-court-uk',
        name: 'Middlesex Guildhall',
        role: 'Art Nouveau Gothic Courthouse',
        category: 'law',
        catLabel: 'Courthouse',
        lat: 51.5006,
        lng: -0.1277,
        wikiTitle: 'Middlesex_Guildhall',
        built: '1912–1913',
        summary:
          'Standing on the western face of Parliament Square, Middlesex Guildhall was designed by James Glen Sivewright Gibson in an Art Nouveau Gothic style with a Portland stone facade, a central crenellated tower, and a carved medieval entrance frieze by Henry Charles Fehr.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/London%2C_The_Supreme_Court_--_2016_--_4814.jpg/1280px-London%2C_The_Supreme_Court_--_2016_--_4814.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/London%2C_The_Supreme_Court_--_2016_--_4814.jpg/1280px-London%2C_The_Supreme_Court_--_2016_--_4814.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Supreme_Court_of_the_United_Kingdom_-_Library_-_1.jpg/1280px-Supreme_Court_of_the_United_Kingdom_-_Library_-_1.jpg'
        ]
      },
      {
        id: 'westminster-abbey',
        name: 'Westminster Abbey',
        role: 'Anglo-French Gothic Abbey Church',
        category: 'sacred',
        catLabel: 'Sacred Building',
        lat: 51.4994,
        lng: -0.1273,
        wikiTitle: 'Westminster_Abbey',
        built: '1245–1517',
        summary:
          'Formally the Collegiate Church of St Peter at Westminster, this Anglo-French Gothic abbey church was begun by King Henry III in 1245 on the site of Edward the Confessor’s 11th-century church, with Henry VII’s fan-vaulted Lady Chapel added in 1503 and the twin Portland stone western towers completed by Nicholas Hawksmoor in 1745.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Westminster_Abbey%2C_Westminster.jpg/1280px-Westminster_Abbey%2C_Westminster.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Westminster_Abbey%2C_Westminster.jpg/1280px-Westminster_Abbey%2C_Westminster.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Westminster_Abbey_-_51370229194.jpg/1280px-Westminster_Abbey_-_51370229194.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Chamber_of_the_Pyx.jpg/1280px-Chamber_of_the_Pyx.jpg'
        ]
      },
      {
        id: 'goggs-building',
        name: 'Government Offices Great George Street',
        role: 'Edwardian Baroque Portland-Stone Building',
        category: 'civic',
        catLabel: 'Building',
        lat: 51.5017,
        lng: -0.1272,
        wikiTitle: 'Government_Offices_Great_George_Street',
        built: '1898–1917',
        summary:
          'Stretching from Whitehall to St James’s Park along the northern edge of Parliament Square, Government Offices Great George Street is a monumental Edwardian Baroque building designed by John McKean Brydon around a circular central courtyard inspired by Christopher Wren.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Government_Offices_Great_George_Street.jpg/1280px-Government_Offices_Great_George_Street.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Government_Offices_Great_George_Street.jpg/1280px-Government_Offices_Great_George_Street.jpg'
        ]
      },
      {
        id: 'portcullis-house',
        name: 'Portcullis House',
        role: 'High-Tech Sandstone & Bronze Building',
        category: 'civic',
        catLabel: 'Building',
        lat: 51.5012,
        lng: -0.1249,
        wikiTitle: 'Portcullis_House',
        built: '1998–2001',
        summary:
          'Designed by Michael Hopkins and Partners directly above Westminster Underground station, Portcullis House suspends its entire weight from six external sandstone piers and a roof diagrid crowned by fourteen aluminum-bronze passive ventilation chimneys.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Westminster_Station_Building.jpg/1280px-Westminster_Station_Building.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/09/Westminster_Station_Building.jpg/1280px-Westminster_Station_Building.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Portcullis.house.bigben.arp.jpg/1280px-Portcullis.house.bigben.arp.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c0/Portcullis_House_from_the_Houses_of_Parliament.jpg/1280px-Portcullis_House_from_the_Houses_of_Parliament.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Portcullis_House_Interior_Cafe_2015-09-19_%2827694442083%29.jpg/1280px-Portcullis_House_Interior_Cafe_2015-09-19_%2827694442083%29.jpg'
        ]
      }
    ]
  },

  'constitution-bucharest': {
    key: 'constitution-bucharest',
    name: 'Piața Constituției · Bucharest',
    center: { lat: 44.4274, lng: 26.0912 },
    zoom: 16,
    landmarks: [
      {
        id: 'palace-of-parliament-ro',
        name: 'Palace of the Parliament',
        role: 'Monumental Neoclassical Palace',
        category: 'civic',
        catLabel: 'Palace',
        lat: 44.4275,
        lng: 26.0875,
        wikiTitle: 'Palace_of_the_Parliament',
        built: '1984–1997',
        summary:
          'Dominating Piața Constituției at the western terminus of Bulevardul Unirii, the Palace of the Parliament is the heaviest building in the world and the second-largest administrative building by floor area (365,000 sq m), constructed almost entirely from Romanian marble, steel, and crystal by a team of 700 architects led by Anca Petrescu.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/en/thumb/1/18/Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg/1280px-Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/en/thumb/1/18/Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg/1280px-Bucharest_-_Palace_of_the_Parliament_%282024%29_%282%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/en/thumb/0/00/Palatul_Parlamentului_I_%2842630333435%29.jpg/960px-Palatul_Parlamentului_I_%2842630333435%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Bucuresti_palatul_parlamentului_view.jpg/960px-Bucuresti_palatul_parlamentului_view.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/EPP_Congress_2361_%288096737560%29.jpg/1280px-EPP_Congress_2361_%288096737560%29.jpg'
        ]
      },
      {
        id: 'palace-of-justice-ro',
        name: 'Palace of Justice',
        role: 'French Renaissance Revival Courthouse',
        category: 'law',
        catLabel: 'Courthouse',
        lat: 44.4288,
        lng: 26.0987,
        wikiTitle: 'Palace_of_Justice,_Bucharest',
        built: '1890–1895',
        summary:
          'Constructed along the banks of the Dâmbovița River to French Renaissance Revival designs by Albert Ballu with Neo-Romanian interiors by Ion Mincu, the Palace of Justice is crowned by six allegorical statues representing Law, Justice, Truth, Vigilance, Strength, and Eloquence.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg/1280px-Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg/1280px-Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Antoniu_-_Palatul_de_Justi%C5%A3ie.jpg/1280px-Antoniu_-_Palatul_de_Justi%C5%A3ie.jpg'
        ]
      },
      {
        id: 'national-cathedral-ro',
        name: 'People’s Salvation Cathedral',
        role: 'Neo-Byzantine Domed Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 44.4259,
        lng: 26.0825,
        wikiTitle: 'People%27s_Salvation_Cathedral',
        built: '2010–2025',
        summary:
          'Rising 127 meters on Dealul Arsenalului immediately behind the Palace of the Parliament, the People’s Salvation Cathedral is the tallest and largest Eastern Orthodox church building in the world by volume, blending Neo-Byzantine domes with traditional Romanian Brâncovenesc architectural motifs.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/National_Cathedral_of_Romania_%282025_November%29.jpg/1280px-National_Cathedral_of_Romania_%282025_November%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/National_Cathedral_of_Romania_%282025_November%29.jpg/1280px-National_Cathedral_of_Romania_%282025_November%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Catedrala_M%C3%A2ntuirii_Neamului_%28Iulie_2019%29.jpg/1280px-Catedrala_M%C3%A2ntuirii_Neamului_%28Iulie_2019%29.jpg'
        ]
      }
    ]
  },

  'signoria-florence': {
    key: 'signoria-florence',
    name: 'Piazza della Signoria · Florence',
    center: { lat: 43.7696, lng: 11.2558 },
    zoom: 18,
    landmarks: [
      {
        id: 'palazzo-vecchio',
        name: 'Palazzo Vecchio',
        role: 'Rusticated Gothic Fortress-Palace',
        category: 'civic',
        catLabel: 'Palace',
        lat: 43.7693,
        lng: 11.2562,
        wikiTitle: 'Palazzo_Vecchio',
        built: '1299–1314',
        summary:
          'Built by Arnolfo di Cambio over the ruins of the Roman theater of Florentia, Palazzo Vecchio is a rusticated stone fortress-palace crowned by a 94-meter crenellated belfry and containing the monumental Salone dei Cinquecento frescoed by Giorgio Vasari.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg/1280px-Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg/1280px-Piazza_della_signoria%2C_palazzo_vecchio%2C_veduta_01.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ce/Palazzovecchio-florence.jpg/500px-Palazzovecchio-florence.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Piazza_della_signoria%2C_palazzo_vecchio%2C_cristogramma%2C_1528%2C_con_iscrizione_cambiata_nel_1551%2C_01.jpg/1280px-Piazza_della_signoria%2C_palazzo_vecchio%2C_cristogramma%2C_1528%2C_con_iscrizione_cambiata_nel_1551%2C_01.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/Palacio_Viejo%2C_Florencia%2C_Italia%2C_2022-09-18%2C_DD_86.jpg/1280px-Palacio_Viejo%2C_Florencia%2C_Italia%2C_2022-09-18%2C_DD_86.jpg'
        ]
      },
      {
        id: 'tribunale-mercanzia',
        name: 'Tribunale della Mercanzia',
        role: '14th-Century Gothic Guild Courthouse',
        category: 'law',
        catLabel: 'Courthouse',
        lat: 43.7697,
        lng: 11.2565,
        wikiTitle: 'Tribunale_della_Mercanzia',
        built: '1359',
        summary:
          'Built in 1359 on the eastern edge of Piazza della Signoria, the Tribunale della Mercanzia features a rusticated sandstone facade with pointed Gothic bifora windows beneath a frieze carved with the 21 stone coats of arms of Florence’s major and minor trade guilds.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Tribunale_di_Mercatanzia.jpg/960px-Tribunale_di_Mercatanzia.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/61/Tribunale_di_Mercatanzia.jpg/960px-Tribunale_di_Mercatanzia.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Piazza_della_signoria_9-10%2C_tribunale_della_mercanzia%2C_portalini_01.jpg/960px-Piazza_della_signoria_9-10%2C_tribunale_della_mercanzia%2C_portalini_01.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Piazza_della_signoria_9-10%2C_tribunale_della_mercanzia%2C_replica_di_cristo_benedicente_in_campo_gigliato_tra_stemmi_di_firenze.jpg/960px-Piazza_della_signoria_9-10%2C_tribunale_della_mercanzia%2C_replica_di_cristo_benedicente_in_campo_gigliato_tra_stemmi_di_firenze.jpg'
        ]
      },
      {
        id: 'loggia-dei-lanzi',
        name: 'Loggia dei Lanzi',
        role: 'Vaulted Three-Bay Gothic Arcade',
        category: 'culture',
        catLabel: 'Building',
        lat: 43.7691,
        lng: 11.2555,
        wikiTitle: 'Loggia_dei_Lanzi',
        built: '1376–1382',
        summary:
          'Built between 1376 and 1382 by Benci di Cione and Simone Talenti as an open-air vaulted arcade on Piazza della Signoria, the Loggia dei Lanzi shelters Renaissance masterworks including Benvenuto Cellini’s bronze Perseus and Giambologna’s Rape of the Sabine Women.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Firenze%2C_loggia_dei_lanzi_%282020%29_01.jpg/1280px-Firenze%2C_loggia_dei_lanzi_%282020%29_01.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Firenze%2C_loggia_dei_lanzi_%282020%29_01.jpg/1280px-Firenze%2C_loggia_dei_lanzi_%282020%29_01.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Piazza_della_Signoria%2C_Loggia_de%27_Lanzi%2C_virt%C3%B9_07_fortezza_di_Giovanni_Fetti_e_Jacopo_di_Piero_Guidi%2C_1394_circa.jpg/1280px-Piazza_della_Signoria%2C_Loggia_de%27_Lanzi%2C_virt%C3%B9_07_fortezza_di_Giovanni_Fetti_e_Jacopo_di_Piero_Guidi%2C_1394_circa.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Piazza_della_Signoria%2C_Loggia_de%27_Lanzi%2C_virt%C3%B9_05_giustizia_di_Giovanni_d%27Ambrogio%2C_1394.jpg/1280px-Piazza_della_Signoria%2C_Loggia_de%27_Lanzi%2C_virt%C3%B9_05_giustizia_di_Giovanni_d%27Ambrogio%2C_1394.jpg'
        ]
      },
      {
        id: 'uffizi-gallery',
        name: 'Palazzo degli Uffizi',
        role: 'Mannerist Colonnaded Courtyard Palace',
        category: 'culture',
        catLabel: 'Palace',
        lat: 43.7684,
        lng: 11.2553,
        wikiTitle: 'Uffizi',
        built: '1560–1581',
        summary:
          'Designed by Giorgio Vasari in 1560 for Cosimo I de’ Medici, the U-shaped Palazzo degli Uffizi frames a long Doric-colonnaded courtyard between Piazza della Signoria and the Arno River and carries the elevated Vasari Corridor toward the Ponte Vecchio.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Piazzale_degli_Uffizi_perspective_view%2C_Florence%2C_Italy%2C_August_2025.jpg/960px-Piazzale_degli_Uffizi_perspective_view%2C_Florence%2C_Italy%2C_August_2025.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/Piazzale_degli_Uffizi_perspective_view%2C_Florence%2C_Italy%2C_August_2025.jpg/960px-Piazzale_degli_Uffizi_perspective_view%2C_Florence%2C_Italy%2C_August_2025.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Firenze_-_Florence_-_Galleria_degli_Uffizi_-_Vasari_Corridor_1566_-_View_NNE_through_the_Uffizi_Courtyard_towards_Palazzo_Vecchio.jpg/960px-Firenze_-_Florence_-_Galleria_degli_Uffizi_-_Vasari_Corridor_1566_-_View_NNE_through_the_Uffizi_Courtyard_towards_Palazzo_Vecchio.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Florence%2C_Italy_-_panoramio_%28125%29.jpg/1280px-Florence%2C_Italy_-_panoramio_%28125%29.jpg'
        ]
      }
    ]
  },

  'grand-place-brussels': {
    key: 'grand-place-brussels',
    name: 'Grand-Place · Brussels',
    center: { lat: 50.8467, lng: 4.3525 },
    zoom: 18,
    landmarks: [
      {
        id: 'brussels-town-hall',
        name: 'Hôtel de Ville (Stadhuis)',
        role: 'Brabantine Gothic Town Hall & Belfry',
        category: 'civic',
        catLabel: 'City Hall',
        lat: 50.8465,
        lng: 4.3521,
        wikiTitle: 'Brussels_Town_Hall',
        built: '1401–1455',
        summary:
          'Dominating the southern side of the Grand-Place, the Brussels Town Hall is a masterpiece of Brabantine Gothic architecture crowned by Jan van Ruysbroeck’s 96-meter openwork belfry and a gilded statue of St. Michael. It was the sole medieval building on the square to survive the French artillery bombardment of August 1695.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Brussels%2C_townhall_oeg2043-00090_foto3_2015-06-07_08.38.jpg/1280px-Brussels%2C_townhall_oeg2043-00090_foto3_2015-06-07_08.38.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Brussels%2C_townhall_oeg2043-00090_foto3_2015-06-07_08.38.jpg/1280px-Brussels%2C_townhall_oeg2043-00090_foto3_2015-06-07_08.38.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Brussels_Town_Hall_-_cca_1880.jpg/1280px-Brussels_Town_Hall_-_cca_1880.jpg'
        ]
      },
      {
        id: 'maison-du-roi',
        name: 'Maison du Roi (Broodhuis)',
        role: 'Neo-Gothic Arcaded Hall',
        category: 'law',
        catLabel: 'Building',
        lat: 50.8469,
        lng: 4.3529,
        wikiTitle: 'Brussels_City_Museum',
        built: '1515–1536',
        summary:
          'Facing the Town Hall across the Grand-Place, the Maison du Roi (known in Dutch as the Broodhuis after the medieval bread market that stood on the site) was built between 1515 and 1536 by Antoon II Keldermans and reconstructed in flamboyant Neo-Gothic style with double-tiered arcaded galleries by Victor Jamaer in the late 19th century.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Maison_du_Roi%2C_Brussels_%28DSCF1978%29.jpg/1280px-Maison_du_Roi%2C_Brussels_%28DSCF1978%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Maison_du_Roi%2C_Brussels_%28DSCF1978%29.jpg/1280px-Maison_du_Roi%2C_Brussels_%28DSCF1978%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2b/Grand-Place_%28Brussels%29_-_View_showing_Maison_du_Roi_on_the_left_and_Maison_des_Ducs_de_Brabant_on_the_right.jpg/960px-Grand-Place_%28Brussels%29_-_View_showing_Maison_du_Roi_on_the_left_and_Maison_des_Ducs_de_Brabant_on_the_right.jpg'
        ]
      },
      {
        id: 'maison-des-ducs-brabant',
        name: 'Maison des Ducs de Brabant',
        role: 'Italo-Flemish Baroque Pilastered Ensemble',
        category: 'culture',
        catLabel: 'Building',
        lat: 50.8463,
        lng: 4.3531,
        wikiTitle: 'House_of_the_Dukes_of_Brabant',
        built: '1697–1698',
        summary:
          'Closing the eastern end of the Grand-Place, the Maison des Ducs de Brabant unites six separate guildhouses behind a single palatial Baroque facade designed by Willem de Bruyn between 1697 and 1698 and adorned with nineteen portrait busts of the Dukes of Brabant.',
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Full_frontal_facade_and_Grand-Place_square_with_tourists.jpg/960px-Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Full_frontal_facade_and_Grand-Place_square_with_tourists.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/50/Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Full_frontal_facade_and_Grand-Place_square_with_tourists.jpg/960px-Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Full_frontal_facade_and_Grand-Place_square_with_tourists.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Main_facade_on_the_Grand-Place_with_cobblestone_square_and_tourists.jpg/960px-Maison_des_Ducs_de_Brabant_%28Brussels%29_-_Main_facade_on_the_Grand-Place_with_cobblestone_square_and_tourists.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6e/Bruxelles_Grand-Place_Maison_des_Ducs_de_Brabant_3.jpg/960px-Bruxelles_Grand-Place_Maison_des_Ducs_de_Brabant_3.jpg'
        ]
      }
    ]
  }
};
