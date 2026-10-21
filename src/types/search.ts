export interface CitySearchResult {
  id: number | string;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  lat: number;
  lng: number;
}
