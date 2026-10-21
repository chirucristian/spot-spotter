import { CitySearchResult } from '../types';

export const POPULAR_CITIES: CitySearchResult[] = [
  { id: 'seattle', name: 'Seattle', admin1: 'Washington', country: 'United States', lat: 47.6062, lng: -122.3321 },
  { id: 'helsinki', name: 'Helsinki', admin1: 'Uusimaa', country: 'Finland', lat: 60.1699, lng: 24.9525 },
  { id: 'paris', name: 'Paris', admin1: 'Île-de-France', country: 'France', lat: 48.8566, lng: 2.3522 },
  { id: 'london', name: 'London', admin1: 'England', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { id: 'rome', name: 'Rome', admin1: 'Lazio', country: 'Italy', lat: 41.9028, lng: 12.4964 },
  { id: 'new-york', name: 'New York', admin1: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { id: 'tokyo', name: 'Tokyo', admin1: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917 }
];

/**
 * Searches cities using the Open-Meteo Geocoding API with abort signal support.
 */
export async function searchCities(
  query: string,
  signal?: AbortSignal
): Promise<CitySearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    trimmed
  )}&count=7&language=en&format=json`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error('Geocoding request failed');
  const data = await res.json();

  return (data.results || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    admin1: item.admin1,
    country: item.country,
    countryCode: item.country_code,
    lat: item.latitude,
    lng: item.longitude
  }));
}
