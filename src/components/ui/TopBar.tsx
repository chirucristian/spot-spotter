import React from 'react';
import { CitySearchBar } from '../CitySearchBar';
import { CitySearchResult } from '../../types';

interface TopBarProps {
  isScanning: boolean;
  onSelectCity: (city: CitySearchResult) => void;
  onSpotCurrentView: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isScanning,
  onSelectCity,
  onSpotCurrentView
}) => {
  return (
    <header className="floating-top-bar">
      <CitySearchBar onSelectCity={onSelectCity} isScanning={isScanning} />
      <button
        type="button"
        id="scan-area-btn"
        className={`floating-action-pill ${isScanning ? 'is-scanning' : ''}`}
        title="Spot landmarks and buildings in this map view"
        disabled={isScanning}
        onClick={onSpotCurrentView}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>{isScanning ? 'Spotting…' : 'Spot Here'}</span>
      </button>
    </header>
  );
};
