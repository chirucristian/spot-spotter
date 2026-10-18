import React from 'react';
import { Landmark } from '../types';
import { computeDistanceMeters, formatDistance } from '../utils/geo';

interface BuildingCardProps {
  landmark: Landmark | null;
  userLocation: { lat: number; lng: number };
  onClose: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  landmark,
  userLocation,
  onClose
}) => {
  if (!landmark) return null;

  const distMeters = computeDistanceMeters(
    userLocation.lat,
    userLocation.lng,
    landmark.lat,
    landmark.lng
  );

  const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    landmark.name
  )}+${landmark.lat},${landmark.lng}`;

  const wikiUrl = `https://en.wikipedia.org/wiki/${
    landmark.wikiTitle || encodeURIComponent(landmark.name)
  }`;

  return (
    <aside
      className="place-card is-open"
      aria-labelledby="card-title"
      aria-hidden="false"
    >
      <button
        type="button"
        className="card-close-btn"
        onClick={onClose}
        aria-label="Close card"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="card-layout">
        <div className="card-photo-wrap">
          <img
            className="card-photo"
            src={landmark.fallbackImg}
            alt={landmark.name}
            loading="lazy"
          />
          <span className="card-category-badge">{landmark.catLabel}</span>
          <span className="card-distance-badge">{formatDistance(distMeters)}</span>
        </div>

        <div className="card-content">
          <div className="card-header-group">
            <h2 id="card-title" className="card-title">
              {landmark.name}
            </h2>
            <p className="card-role">{landmark.role}</p>
          </div>

          {/* 1-Sentence Spatial / Civic Significance Hook */}
          <div className="card-why-box">
            <span className="why-label">What you’re looking at:</span>{' '}
            <span>{landmark.whyItMatters}</span>
          </div>

          {/* Quick Architectural Facts Strip */}
          <div className="card-facts-strip">
            <div className="fact-pill">
              <span className="fact-key">Style &amp; Era</span>
              <span className="fact-val">{landmark.styleAndEra}</span>
            </div>
            <div className="fact-pill">
              <span className="fact-key">Architect</span>
              <span className="fact-val">{landmark.architect}</span>
            </div>
          </div>

          {/* Full Historical & Architectural Summary */}
          <p className="card-summary">{landmark.summary}</p>

          {/* Facade & Structural Highlights */}
          {landmark.highlights && landmark.highlights.length > 0 && (
            <div className="card-highlights">
              <h3 className="highlights-heading">What to spot on this building</h3>
              <ul className="highlights-list">
                {landmark.highlights.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-actions">
            <a
              className="card-btn-primary"
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
            </a>
            <a
              className="card-btn-secondary"
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia ↗
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
