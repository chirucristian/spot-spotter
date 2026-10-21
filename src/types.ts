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
  /** Year or period built — only included when clearly stated in the source */
  built?: string;
  /** Rich multi-sentence historical & architectural summary */
  summary: string;
  fallbackImg: string;
  /** Ordered gallery of building photos; index 0 is always an exterior/outside view */
  photos?: string[];
  /** Prominence score (1-100) used for zoom-adaptive filtering */
  importance?: number;
  /** Whether full Wikipedia article intro has been fetched */
  enriched?: boolean;
}

export interface CivicSquare {
  key: string;
  name: string;
  center: { lat: number; lng: number };
  zoom: number;
  landmarks: Landmark[];
}
