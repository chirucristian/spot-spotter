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
        role: 'Evangelical Lutheran Cathedral',
        category: 'sacred',
        catLabel: 'Cathedral',
        lat: 60.1704,
        lng: 24.9522,
        wikiTitle: 'Helsinki_Cathedral',
        whyItMatters: 'The towering white neoclassical centerpiece anchoring the northern crest of Senate Square.',
        styleAndEra: 'Neoclassical · 1830–1852',
        architect: 'Carl Ludvig Engel & Ernst Lohrmann',
        summary:
          'Built as a tribute to Grand Duke Nicholas I of Russia (and known as St. Nicholas’ Church until Finnish independence in 1917), Helsinki Cathedral crowns a monumental granite staircase above Senate Square. Its Greek-cross plan is symmetrical on all four sides, topped by a central green dome rising 62 meters above sea level and flanked by four smaller corner domes added by Ernst Lohrmann.',
        highlights: [
          'Twelve zinc statues of the Apostles on the roofline — one of the largest unified zinc sculpture ensembles in the world.',
          'Symmetrical Corinthian porticos facing all four cardinal directions.',
          'Underground crypt beneath the granite steps now used for exhibitions and concerts.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Exterior_of_Helsinki_Cathedral_%283%29.JPG/960px-Exterior_of_Helsinki_Cathedral_%283%29.JPG',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Exterior_of_Helsinki_Cathedral_%288%29.JPG/960px-Exterior_of_Helsinki_Cathedral_%288%29.JPG',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Sky-foto_M%C3%B6ller_-_Aerial_photograph_of_Helsinki_Cathedral_from_above_it_in_1976.jpg/960px-Sky-foto_M%C3%B6ller_-_Aerial_photograph_of_Helsinki_Cathedral_from_above_it_in_1976.jpg'
        ]
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
        whyItMatters: 'The executive seat of Finland’s government enclosing the entire eastern flank of the square.',
        styleAndEra: 'Empire Neoclassical · 1822',
        architect: 'Carl Ludvig Engel',
        summary:
          'Originally erected between 1818 and 1822 to house the Imperial Senate of Finland after Helsinki replaced Turku as capital, the Government Palace sets the visual proportion for the entire square. Today it serves as the official seat of the Prime Minister’s Office, the Chancellor of Justice, and major departments of the Ministry of Finance.',
        highlights: [
          'Central Corinthian pediment containing the oldest public clock face in Helsinki (installed by Jaakko Juusten in 1822).',
          'Grand Presidential Session Hall where bills are formally presented by the Council of State.',
          'Pale ochre-and-white Empire facade balanced directly against the University across the plaza.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Valtioneuvoston_linna.jpg/1280px-Valtioneuvoston_linna.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Valtioneuvoston_linna.jpg/1280px-Valtioneuvoston_linna.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Finnish_Government_Palace_from_above_in_the_1960s.jpg/960px-Finnish_Government_Palace_from_above_in_the_1960s.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Eric_Sundstr%C3%B6m_-_Finnish_Government_Palace_lobby_in_1917.jpg/960px-Eric_Sundstr%C3%B6m_-_Finnish_Government_Palace_lobby_in_1917.jpg'
        ]
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
        whyItMatters: 'Forms the western academic pillar of Senate Square, deliberately mirroring the Government Palace opposite.',
        styleAndEra: 'Neoclassical · 1832',
        architect: 'Carl Ludvig Engel & J.S. Sirén',
        summary:
          'Following the Great Fire of Turku in 1827, the Imperial Alexander University was relocated to Helsinki and placed directly opposite the Senate to symbolize the partnership of learning and governance. Completed by Engel in 1832, its Great Hall was severely damaged by aerial bombing in 1944 and meticulously reconstructed after the war.',
        highlights: [
          'Eight-column Ionic facade contrasting subtly with the Corinthian columns of the Government Palace across the square.',
          'Inscription above the main frieze reading "Per Aspera Ad Astra" and honoring arts and sciences.',
          'Semi-circular Great Ceremonial Hall modeled on classical Greek amphitheaters.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg/1280px-University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b4/University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg/1280px-University_of_Helsinki%2C_Main_Building_%2852890870759%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5b/University_of_Helsinki%2C_Main_Building_%2852890135967%29.jpg/960px-University_of_Helsinki%2C_Main_Building_%2852890135967%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/56/Helsinki_University_Finland_100_celebration_-_Marit_Henriksson.jpg/960px-Helsinki_University_Finland_100_celebration_-_Marit_Henriksson.jpg'
        ]
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
        whyItMatters: 'Considered Carl Ludvig Engel’s architectural masterpiece, housing Finland’s national cultural heritage.',
        styleAndEra: 'Neoclassical & Art Nouveau · 1844 / 1906',
        architect: 'Carl Ludvig Engel & Gustaf Nyström',
        summary:
          'Standing immediately northwest of the Cathedral on Unioninkatu, the National Library of Finland is the country’s oldest and most important scholarly library. Built in 1844 with barrel-vaulted reading halls modeled on Roman baths, it was expanded in 1906 with a six-story semicircular Art Nouveau book-stack Rotunda.',
        highlights: [
          'Vaulted Cupola Hall featuring ceiling frescoes, marble-stuccoed Corinthian columns, and parquet floors.',
          '1906 cast-iron and glass Rotunda wing designed by Gustaf Nyström.',
          'Underground Fabiania cave stacks carved 18 meters deep into solid granite bedrock.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/National_Library_of_Finland.jpg/1280px-National_Library_of_Finland.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/National_Library_of_Finland.jpg/1280px-National_Library_of_Finland.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Kansalliskirjasto_-_National_Library_of_Finland%2C_Helsinki_%2852890137262%29.jpg/1280px-Kansalliskirjasto_-_National_Library_of_Finland%2C_Helsinki_%2852890137262%29.jpg',
          'https://upload.wikimedia.org/wikipedia/commons/e/e5/Rotunda_Julkisivu.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Inside_view_of_National_Library_of_Finland_001_%282%29.jpg/960px-Inside_view_of_National_Library_of_Finland_001_%282%29.jpg'
        ]
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
        whyItMatters: 'The oldest surviving stone building in central Helsinki (1757), pre-dating Senate Square itself.',
        styleAndEra: '18th-Century Rococo Classicism · 1757',
        architect: 'Samuel Berner (attributed)',
        summary:
          'Built in 1757 by wealthy merchant and shipowner Johan Sederholm at the southeast corner of the square, this two-story stone residence survived the fires and the 1812 imperial rebuilding of Helsinki. After serving as a merchant residence, girls’ school, and municipal court, it was converted into part of the Helsinki City Museum.',
        highlights: [
          'Steep mansard roof and symmetrical 18th-century Swedish merchant windows.',
          'Ground-floor vaulted cellars that originally stored imported salt, wine, and grain.',
          'Preserved as a historic anchor when Engel redesigned the surrounding square in the 1820s.'
        ],
        fallbackImg:
          'https://upload.wikimedia.org/wikipedia/commons/8/83/Sederholmin_talo.jpg',
        photos: [
          'https://upload.wikimedia.org/wikipedia/commons/8/83/Sederholmin_talo.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Sederholmin_talo%2C_taustalla_Valtioneuvoston_kanslia.jpg/960px-Sederholmin_talo%2C_taustalla_Valtioneuvoston_kanslia.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Sederholmin_talo_-_Marit_Henriksson.jpg/960px-Sederholmin_talo_-_Marit_Henriksson.jpg'
        ]
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
        role: 'Houses of Parliament · Commons & Lords',
        category: 'civic',
        catLabel: 'Parliament',
        lat: 51.4995,
        lng: -0.1248,
        wikiTitle: 'Palace_of_Westminster',
        whyItMatters: 'The seat of the UK Parliament (House of Commons and House of Lords) framing the eastern side of the square.',
        styleAndEra: 'Perpendicular Gothic Revival · 1840–1870',
        architect: 'Sir Charles Barry & Augustus Pugin',
        summary:
          'After a devastating fire destroyed the medieval royal palace in October 1834, Charles Barry won the competition for a grand Gothic Revival legislature, with Augustus Pugin designing its intricate interiors, spires, and furnishings. Only medieval Westminster Hall (1097) and the Jewel Tower survived the blaze and were integrated into the 1,100-room complex.',
        highlights: [
          'Elizabeth Tower (96m) at the north end housing the 13.7-tonne Great Bell ("Big Ben").',
          'Victoria Tower (98.5m) at the southwest corner flying the Sovereign’s Royal Standard when in residence.',
          'Westminster Hall (1097) with the largest medieval hammerbeam timber roof in Northern Europe.'
        ],
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
        role: 'House of Law · UK Supreme Court',
        category: 'law',
        catLabel: 'House of Law',
        lat: 51.5006,
        lng: -0.1277,
        wikiTitle: 'Middlesex_Guildhall',
        whyItMatters: 'The highest court in the United Kingdom, occupying the western face of Parliament Square.',
        styleAndEra: 'Art Nouveau Gothic Revival · 1913',
        architect: 'James Glen Sivewright Gibson',
        summary:
          'Standing directly across the square from Parliament, Middlesex Guildhall was completed in 1913 as the county council chamber and quarter sessions courthouse for Middlesex. In October 2009, following constitutional reform that separated the top judiciary from the House of Lords, it became the permanent home of the Supreme Court of the United Kingdom.',
        highlights: [
          'Richly carved Portland stone entrance frieze by Henry Charles Fehr depicting King John granting Magna Carta.',
          'Central crenellated tower overlooking the Parliament Square statues.',
          'Three modern appellate courtrooms open to the public and live-streamed.'
        ],
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
        role: 'Royal Coronation Church since 1066',
        category: 'sacred',
        catLabel: 'Abbey',
        lat: 51.4994,
        lng: -0.1273,
        wikiTitle: 'Westminster_Abbey',
        whyItMatters: 'Britain’s coronation church since William the Conqueror in 1066, bordering the southern side of the square.',
        styleAndEra: 'English Gothic · 1245–1745',
        architect: 'Henry of Reyns, Henry Yevele & Nicholas Hawksmoor',
        summary:
          'Formally titled the Collegiate Church of St Peter at Westminster, this royal peculiar (answering directly to the Sovereign rather than a bishop) was rebuilt in Anglo-French Gothic style by King Henry III starting in 1245. It is the burial place of 30 kings and queens and more than 3,300 historical figures including Isaac Newton, Charles Darwin, and Geoffrey Chaucer.',
        highlights: [
          'Twin iconic white Portland stone western towers completed by Nicholas Hawksmoor in 1745.',
          'Lady Chapel of Henry VII (1503) famous for its gravity-defying fan-vaulted stone ceiling.',
          'Coronation Chair (1296) and Cosmati pavement in front of the High Altar.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Westminster_Abbey%2C_Westminster.jpg/1280px-Westminster_Abbey%2C_Westminster.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Westminster_Abbey%2C_Westminster.jpg/1280px-Westminster_Abbey%2C_Westminster.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Westminster_Abbey_-_51370229194.jpg/1280px-Westminster_Abbey_-_51370229194.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Chamber_of_the_Pyx.jpg/1280px-Chamber_of_the_Pyx.jpg'
        ]
      },
      {
        id: 'hm-treasury',
        name: 'HM Treasury (GOGGS)',
        role: 'Government Offices Great George Street',
        category: 'civic',
        catLabel: 'Ministry',
        lat: 51.5017,
        lng: -0.1272,
        wikiTitle: 'Government_Offices_Great_George_Street',
        whyItMatters: 'Anchors the entire northern edge of Parliament Square, housing the UK Treasury above the Churchill War Rooms.',
        styleAndEra: 'Edwardian Baroque · 1898–1917',
        architect: 'John McKean Brydon',
        summary:
          'Stretching from Whitehall to St James’s Park along the north side of Parliament Square, this monumental Portland stone complex houses His Majesty’s Treasury and UK Export Finance. Deep inside its reinforced concrete basement lies the preserved World War II bunker complex where Winston Churchill directed the war effort.',
        highlights: [
          'Circular central courtyard modeled after Christopher Wren’s unbuilt Whitehall palace plans.',
          'Churchill War Rooms bunker preserved intact beneath the western wing.',
          'Sculptural allegories of Science, Art, Education, and Local Government over the Great George Street facade.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Government_Offices_Great_George_Street.jpg/1280px-Government_Offices_Great_George_Street.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Government_Offices_Great_George_Street.jpg/1280px-Government_Offices_Great_George_Street.jpg'
        ]
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
        whyItMatters: 'Modern parliamentary office and select committee hub directly above Westminster Underground station.',
        styleAndEra: 'High-Tech Structural Expressionism · 2001',
        architect: 'Michael Hopkins and Partners',
        summary:
          'Opened in 2001 on the northeast corner of Parliament Square to provide offices for 213 Members of Parliament and public Select Committee hearing rooms. Because the Jubilee Line ticket hall sits directly underneath, the building’s entire weight is suspended from six external solid sandstone piers and a roof diagrid.',
        highlights: [
          'Fourteen passive-ventilation aluminum-bronze chimneys echoing the gothic pinnacles of Big Ben next door.',
          'Glazed central courtyard roof made of English oak and stainless steel.',
          'Underground secure pedestrian tunnel linking MPs directly to the House of Commons chamber.'
        ],
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
        role: 'Parliament of Romania · Senate & Chamber',
        category: 'civic',
        catLabel: 'Parliament',
        lat: 44.4275,
        lng: 26.0875,
        wikiTitle: 'Palace_of_the_Parliament',
        whyItMatters: 'The heaviest building in the world and seat of Romania’s bicameral Parliament dominating Constitution Square.',
        styleAndEra: 'Totalitarian Neoclassical · 1984–1997',
        architect: 'Anca Petrescu & team of 700 architects',
        summary:
          'Measuring 270 by 240 meters, 86 meters high, and 92 meters deep underground, the Palace of the Parliament has a floor area of 365,000 square meters—second only to the Pentagon among administrative buildings worldwide. Built almost exclusively from Romanian materials (including 1 million cubic meters of Transylvanian marble), it houses the Chamber of Deputies, the Senate, and the Constitutional Court.',
        highlights: [
          'Weighs approximately 4.10 million tonnes due to massive marble, steel, and crystal interiors.',
          'Contains 1,100 rooms, 4,500 crystal chandeliers, and eight underground levels including a nuclear bunker.',
          'Forms the western terminus of the 3.5-kilometer Bulevardul Unirii civic axis.'
        ],
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
        role: 'House of Law · Bucharest Court of Appeal',
        category: 'law',
        catLabel: 'House of Law',
        lat: 44.4288,
        lng: 26.0987,
        wikiTitle: 'Palace_of_Justice,_Bucharest',
        whyItMatters: 'Romania’s historic temple of law along the Dâmbovița River, housing the Bucharest Court of Appeal.',
        styleAndEra: 'French Renaissance Revival · 1890–1895',
        architect: 'Albert Ballu & Ion Mincu',
        summary:
          'King Carol I laid the foundation stone of the Palace of Justice in 1890 to designs by French architect Albert Ballu (who also designed the Palace of Justice in Charleroi), with interiors completed by Romanian Neo-Romanian pioneer Ion Mincu. Its grand "Hall of Lost Steps" (Sala Pașilor Pierduți) covers nearly a quarter of the building’s footprint.',
        highlights: [
          'Six monumental rooftop statues representing Vigilance, Strength, Law, Justice, Eloquence, and Truth.',
          'Central clock flanked by two additional allegories marking the imperative of timely justice.',
          'Restored monumental oak vaults and Neo-Romanian decorative ceilings by Ion Mincu.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg/1280px-Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/db/Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg/1280px-Bucharest_-_Palace_of_Justice_%28Justizpalast%29_-_no_filter_%2829340923631%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ed/Antoniu_-_Palatul_de_Justi%C5%A3ie.jpg/1280px-Antoniu_-_Palatul_de_Justi%C5%A3ie.jpg'
        ]
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
        whyItMatters: 'Anchors the curved southern hemicycle of Piața Constituției directly facing the Parliament courtyard.',
        styleAndEra: 'Monumental Civic Neoclassical · 1980s',
        architect: 'Centrul Civic Design Institute',
        summary:
          'Designed as part of the symmetrical semicircular plaza framing the view of the Palace of the Parliament, this colonnaded ministry complex houses Romania’s Ministry of Finance (Ministerul Finanțelor) and key treasury directorates.',
        highlights: [
          'Curved neoclassical colonnade following the geometry of the Piața Constituției hemicycle.',
          'Symmetric twin facade mirrored across Bulevardul Libertății by the SRI/Ministry blocks.',
          'Direct view line down Bulevardul Unirii’s 43 monumental fountains.'
        ],
        fallbackImg:
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Piata_Constitutiei_si_Bulevardul_Unirii.jpg/960px-Piata_Constitutiei_si_Bulevardul_Unirii.jpg',
        photos: [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Piata_Constitutiei_si_Bulevardul_Unirii.jpg/960px-Piata_Constitutiei_si_Bulevardul_Unirii.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/Bulevardul_Unirii_-_panoramio_%282%29.jpg/1280px-Bulevardul_Unirii_-_panoramio_%282%29.jpg',
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Bucuresti_palatul_parlamentului_view.jpg/960px-Bucuresti_palatul_parlamentului_view.jpg'
        ]
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
        whyItMatters: 'The tallest and largest Eastern Orthodox church building in the world by volume (127m high).',
        styleAndEra: 'Neo-Byzantine & Brâncovenesc · 2010–2025',
        architect: 'Constantin Amâiei (Vanel Exim)',
        summary:
          'Rising on Dealul Arsenalului immediately behind the Palace of the Parliament courtyard, the National Cathedral of Romania fulfills a project first proposed after the 1877 War of Independence. Standing 127 meters tall to the top of its central golden cross, it combines Byzantine domes with traditional Romanian Brâncovenesc porches.',
        highlights: [
          'Houses the largest free-swinging church bell in the world (25.2 tonnes), cast in Innsbruck.',
          'Interior covered in over 25,000 square meters of Venetian glass and gold leaf mosaic.',
          'Curved colonnaded esplanade accommodating over 100,000 pilgrims.'
        ],
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
        role: 'Town Hall & Signoria Civic Council',
        category: 'civic',
        catLabel: 'Town Hall',
        lat: 43.7693,
        lng: 11.2562,
        wikiTitle: 'Palazzo_Vecchio',
        whyItMatters: 'The crenellated fortress-town hall that has governed Florence from Piazza della Signoria since 1299.',
        styleAndEra: 'Tuscan Gothic & Renaissance · 1299',
        architect: 'Arnolfo di Cambio & Giorgio Vasari',
        summary:
          'Built in 1299 over the ruins of the ancient Roman theater of Florentia to house the Priors of the Guilds (the Signoria), Palazzo Vecchio is a rusticated stone fortress crowned by the 94-meter Torre di Arnolfo. Inside lies the Salone dei Cinquecento, built in 1495 for Savonarola’s 500-member Grand Council and later frescoed by Giorgio Vasari for Duke Cosimo I de’ Medici.',
        highlights: [
          'Replica of Michelangelo’s David (stood here in the original from 1504 to 1873) flanking the main portal.',
          'Off-center 94-meter Arnolfo Tower containing the "Alberghetto" cell where Cosimo the Elder and Savonarola were imprisoned.',
          'Frescoed first courtyard redesigned by Michelozzo in 1453 with Verrocchio’s Putto with Dolphin fountain.'
        ],
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
        role: 'House of Law · Commercial Guild Court',
        category: 'law',
        catLabel: 'House of Law',
        lat: 43.7697,
        lng: 11.2565,
        wikiTitle: 'Tribunale_della_Mercanzia',
        whyItMatters: 'The medieval commercial supreme court where six foreign lawyers settled disputes among Florence’s guilds.',
        styleAndEra: 'Florentine Gothic · 1359',
        architect: 'Florentine Guild Masons',
        summary:
          'Founded in 1359 on the eastern side of Piazza della Signoria between Via dei Gondi and Via de’ Calzaiuoli, the Tribunale della Mercanzia adjudicated maritime, banking, and trade disputes between members of the Florentine guilds across Europe.',
        highlights: [
          'Upper facade carved with the 21 stone coats of arms of Florence’s 7 Major Guilds (Arti Maggiori) and 14 Minor Guilds.',
          'Originally featured bronze statues by Donatello and Verrocchio in its ground-floor niches.',
          'Rusticated sandstone facade with pointed Gothic bifora windows.'
        ],
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
        role: 'Ceremonial Arcade & Sculpture Gallery',
        category: 'culture',
        catLabel: 'Loggia',
        lat: 43.7691,
        lng: 11.2555,
        wikiTitle: 'Loggia_dei_Lanzi',
        whyItMatters: 'Open-air civic inauguration stage turned into the world’s premier outdoor Renaissance sculpture gallery.',
        styleAndEra: 'Late Gothic / Proto-Renaissance · 1376–1382',
        architect: 'Benci di Cione & Simone di Francesco Talenti',
        summary:
          'Constructed between 1376 and 1382 as a covered ceremonial stage where the Florentine Republic swore in priors and received foreign ambassadors. Its wide semicircular arches anticipated the Renaissance, and under the Medici Grand Dukes it became an open-air showcase of political sculpture.',
        highlights: [
          'Benvenuto Cellini’s bronze Perseus with the Head of Medusa (1554) under the left arch.',
          'Giambologna’s marble Rape of the Sabine Women (1583) carved from a single block under the right arch.',
          'Four allegorical trefoil reliefs of the Cardinal Virtues designed by Agnolo Gaddi above the arches.'
        ],
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
        name: 'Uffizi Gallery',
        role: 'Magistrates’ Offices & Art Museum',
        category: 'culture',
        catLabel: 'Museum',
        lat: 43.7684,
        lng: 11.2553,
        wikiTitle: 'Uffizi',
        whyItMatters: 'Built in 1560 to unite all 13 Florentine judicial and administrative magistracies ("uffizi") under one roof.',
        styleAndEra: 'Mannerist Renaissance · 1560–1581',
        architect: 'Giorgio Vasari, Alfonso Parigi & Bernardo Buontalenti',
        summary:
          'Stretching south from Piazza della Signoria to the Arno River, the U-shaped Uffizi palace was commissioned by Cosimo I de’ Medici to consolidate Florence’s courts, guild tribunals, and state archives, while carrying the secret elevated Vasari Corridor across the Ponte Vecchio above.',
        highlights: [
          'Doric colonnaded canyon framing Piazza della Signoria at one end and the Arno River Serlian arch at the other.',
          'Twenty-eight marble niches holding statues of Tuscany’s greatest artists, scientists, and jurists.',
          'Top-floor loggia converted by Francesco I de’ Medici in 1581 into the oldest public art museum in Europe.'
        ],
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
        role: 'City Hall & Brabantine Gothic Spire',
        category: 'civic',
        catLabel: 'City Hall',
        lat: 50.8465,
        lng: 4.3521,
        wikiTitle: 'Brussels_Town_Hall',
        whyItMatters: 'The sole medieval building on the Grand-Place to survive the 1695 French bombardment.',
        styleAndEra: 'Brabantine Gothic · 1401–1455',
        architect: 'Jacob van Thienen & Jan van Ruysbroeck',
        summary:
          'Dominating the southern side of the UNESCO-listed Grand-Place, the Brussels Town Hall was built in two asymmetric Gothic wings between 1401 and 1444, with its openwork 96-meter belfry completed by Jan van Ruysbroeck in 1455. In August 1695, French Marshal de Villeroy’s artillery targeted its spire for 36 hours, destroying the surrounding square while the stone facade and tower held.',
        highlights: [
          '96-meter gothic spire crowned by a 5-meter gilded copper statue of St. Michael slaying a dragon (1454).',
          'Famous asymmetrical main portal directly below the tower, which sits slightly off-center to the two wings.',
          'Nearly 300 nineteenth-century carved stone statues of Dukes and Duchesses of Brabant across the facade.'
        ],
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
        role: 'Ducal Court & Brussels City Museum',
        category: 'law',
        catLabel: 'Ducal Court',
        lat: 50.8469,
        lng: 4.3529,
        wikiTitle: 'Brussels_City_Museum',
        whyItMatters: 'Originally the 13th-century bread hall ("Broodhuis"), later the royal tax and judicial court of the Dukes of Brabant.',
        styleAndEra: 'Neo-Gothic · 1515 / Rebuilt 1873–1895',
        architect: 'Antoon II Keldermans & Victor Jamaer',
        summary:
          'Facing the Town Hall directly across the square, this building takes its Dutch name (Broodhuis) from the medieval bakers’ market that stood here, and its French name (Maison du Roi / King’s House) from Duke Charles V, whose administrative and judicial courts occupied the building from the 16th century. Today it houses the Brussels City Museum.',
        highlights: [
          'Double-tiered arcaded gallery and lace-like Neo-Gothic pinnacles restored by Victor Jamaer.',
          'Where Counts Egmont and Horn spent their final night imprisoned before their execution on the square in 1568.',
          'Houses the original 1619 Manneken Pis bronze statue and its wardrobe of over 1,000 costumes.'
        ],
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
        role: 'Six Guildhalls Behind One Facade',
        category: 'culture',
        catLabel: 'Guildhalls',
        lat: 50.8463,
        lng: 4.3531,
        wikiTitle: 'House_of_the_Dukes_of_Brabant',
        whyItMatters: 'Six independent trade guildhalls unified behind a single palatial Baroque facade closing the eastern end of the square.',
        styleAndEra: 'Italo-Flemish Baroque Classicism · 1697–1698',
        architect: 'Willem de Bruyn',
        summary:
          'Following the 1695 bombardment of Brussels, city architect Willem de Bruyn persuaded six separate trade guilds—the Tanners, Millers, Carpenters, Sculptors/Masons, Coopers, and Mercers—to rebuild their adjacent houses behind one grand pilastered palace front, topped by 19 busts of the Dukes of Brabant.',
        highlights: [
          'Nineteen gilded portrait busts of the historical Dukes of Brabant mounted along the second-story frieze.',
          'Six separate street entrances (Nos. 14–19): La Fortune, Le Moulin à Vent, Le Pot d’Étain, La Colline, La Bourse, and L’Ermitage.',
          'Arched pediment relief by Jan van Delen depicting Peace, Abundance, and Commerce.'
        ],
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
