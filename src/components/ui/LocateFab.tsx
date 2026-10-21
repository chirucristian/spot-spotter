import React from 'react';

interface LocateFabProps {
  isActive: boolean;
  onLocate: () => void;
}

export const LocateFab: React.FC<LocateFabProps> = ({ isActive, onLocate }) => {
  return (
    <button
      type="button"
      id="locate-me-btn"
      className={`locate-fab ${isActive ? 'is-active' : ''}`}
      aria-label="Pinpoint my location"
      title="Pinpoint my location"
      onClick={onLocate}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4"></circle>
        <line x1="12" y1="2" x2="12" y2="5"></line>
        <line x1="12" y1="19" x2="12" y2="22"></line>
        <line x1="2" y1="12" x2="5" y2="12"></line>
        <line x1="19" y1="12" x2="22" y2="12"></line>
      </svg>
    </button>
  );
};
