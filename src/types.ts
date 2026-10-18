export type LandmarkCategory = 'civic' | 'law' | 'sacred' | 'culture';

export interface Landmark {
  id: string;
  name: string;
  role: string;
  category: LandmarkCategory;
  catLabel: string;
  lat: number;
  lng: number;
  wikiTitle: string;
  /** Quick 1-sentence spatial/purpose hook */
  whyItMatters: string;
  /** Architectural style & era */
  styleAndEra: string;
  /** Architect or builder */
  architect: string;
  /** Rich multi-sentence historical & architectural summary */
  summary: string;
  /** 2-3 quick bullet highlights when looking at the facade */
  highlights: string[];
  fallbackImg: string;
  /** Ordered gallery of building photos; index 0 is always an exterior/outside view */
  photos?: string[];
  /** Prominence score (1-100) used for zoom-adaptive filtering */
  importance?: number;
}

export interface CivicSquare {
  key: string;
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
  landmarks: Landmark[];
}
