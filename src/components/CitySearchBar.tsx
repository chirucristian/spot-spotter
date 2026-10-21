import React, { useEffect, useRef, useState } from 'react';
import { CitySearchResult } from '../types';
import { POPULAR_CITIES, searchCities } from '../services/geocoding';

export type { CitySearchResult };
export { POPULAR_CITIES };

interface CitySearchBarProps {
  onSelectCity: (city: CitySearchResult) => void;
  isScanning?: boolean;
}

export const CitySearchBar: React.FC<CitySearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [results, setResults] = useState<CitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities when query changes
  useEffect(() => {
    const trimmed = query.trim();

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      setHighlightedIndex(-1);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    debounceTimerRef.current = window.setTimeout(async () => {
      try {
        const items = await searchCities(trimmed, controller.signal);
        setResults(items);
        setHighlightedIndex(-1);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query]);

  const handleSelect = (city: CitySearchResult) => {
    setQuery(city.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
    onSelectCity(city);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const activeList = query.trim().length >= 2 ? results : POPULAR_CITIES;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) => (prev + 1 < activeList.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < activeList.length) {
        handleSelect(activeList[highlightedIndex]);
      } else if (activeList.length > 0) {
        handleSelect(activeList[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const activeList = query.trim().length >= 2 ? results : POPULAR_CITIES;
  const showDropdown = isOpen;

  return (
    <div className="city-search-wrap" ref={containerRef}>
      <div className={`city-search-bar ${isOpen ? 'is-focused' : ''}`}>
        <svg
          className="search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="city-search-input"
          placeholder="Search city…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          aria-label="Search city"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />

        {isLoading && <div className="city-search-spinner" aria-label="Loading cities" />}

        {query.length > 0 && !isLoading && (
          <button
            type="button"
            className="city-search-clear"
            onClick={handleClear}
            aria-label="Clear city search"
            title="Clear"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="city-search-dropdown" role="listbox">
          {query.trim().length < 2 && (
            <div className="city-dropdown-header">Featured Cities</div>
          )}

          {activeList.map((city, idx) => {
            const isHighlighted = idx === highlightedIndex;
            const subtitle = [city.admin1, city.country].filter(Boolean).join(', ');

            return (
              <div
                key={`${city.id}-${city.lat}-${city.lng}`}
                role="option"
                aria-selected={isHighlighted}
                className={`city-result-item ${isHighlighted ? 'is-highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleSelect(city)}
              >
                <div className="city-result-pin">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="city-result-info">
                  <span className="city-result-name">{city.name}</span>
                  {subtitle && <span className="city-result-sub">{subtitle}</span>}
                </div>
              </div>
            );
          })}

          {query.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className="city-empty-state">
              <span>No cities found for “{query.trim()}”</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
