import React, { useEffect, useRef, useState } from 'react';
import { Landmark } from '../types';
import {
  computeBearingDegrees,
  computeDistanceMeters,
  formatCardinalDirection,
  formatCompassBearing,
  formatDistance,
  formatWalkTime
} from '../utils/geo';

interface BuildingCardProps {
  landmark: Landmark | null;
  userLocation: { lat: number; lng: number };
  visibleLandmarks: Landmark[];
  onSelectLandmark: (id: string) => void;
  onClose: () => void;
}

export const BuildingCard: React.FC<BuildingCardProps> = ({
  landmark,
  userLocation,
  visibleLandmarks,
  onSelectLandmark,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isExpandedSummary, setIsExpandedSummary] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setFailedUrls({});
    setDragOffsetX(0);
    setIsDragging(false);
    setIsExpandedSummary(false);
    setIsSpeaking(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [landmark?.id]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!landmark) return null;

  const rawPhotos =
    landmark.photos && landmark.photos.length > 0
      ? landmark.photos
      : [landmark.fallbackImg];

  const validPhotos = rawPhotos.filter((url) => Boolean(url) && !failedUrls[url]);
  const photos =
    validPhotos.length > 0
      ? validPhotos
      : [
          'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/27/Lutheran_Cathedral_Helsinki.jpg/960px-Lutheran_Cathedral_Helsinki.jpg'
        ];

  const safeIndex = Math.min(currentIndex, photos.length - 1);

  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev <= 0 ? photos.length - 1 : prev - 1));
  };

  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev >= photos.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (photos.length <= 1) return;
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (
      !isDragging ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      photos.length <= 1
    ) {
      return;
    }
    const dx = e.touches[0].clientX - touchStartXRef.current;
    const dy = e.touches[0].clientY - touchStartYRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      setDragOffsetX(dx);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || photos.length <= 1) return;
    const threshold = 40;
    if (dragOffsetX <= -threshold) {
      setCurrentIndex((prev) => (prev >= photos.length - 1 ? 0 : prev + 1));
    } else if (dragOffsetX >= threshold) {
      setCurrentIndex((prev) => (prev <= 0 ? photos.length - 1 : prev - 1));
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    setDragOffsetX(0);
    setIsDragging(false);
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (photos.length <= 1) return;
    touchStartXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || touchStartXRef.current === null || photos.length <= 1) return;
    setDragOffsetX(e.clientX - touchStartXRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    handleTouchEnd();
  };

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const narrative = [
      `${landmark.name}. ${landmark.role}.`,
      landmark.whyItMatters,
      landmark.summary,
      landmark.historicalContext || ''
    ]
      .filter(Boolean)
      .join(' ');

    const utterance = new SpeechSynthesisUtterance(narrative);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const distMeters = computeDistanceMeters(
    userLocation.lat,
    userLocation.lng,
    landmark.lat,
    landmark.lng
  );
  const bearingDeg = computeBearingDegrees(
    userLocation.lat,
    userLocation.lng,
    landmark.lat,
    landmark.lng
  );
  const compassLabel = formatCompassBearing(bearingDeg);
  const cardinalFull = formatCardinalDirection(bearingDeg);
  const walkLabel = formatWalkTime(distMeters);

  const landmarkIndex = visibleLandmarks.findIndex((l) => l.id === landmark.id);
  const canStepLandmarks = visibleLandmarks.length > 1 && landmarkIndex !== -1;

  const stepPrevLandmark = () => {
    if (!canStepLandmarks) return;
    const prevIdx =
      landmarkIndex <= 0 ? visibleLandmarks.length - 1 : landmarkIndex - 1;
    onSelectLandmark(visibleLandmarks[prevIdx].id);
  };

  const stepNextLandmark = () => {
    if (!canStepLandmarks) return;
    const nextIdx =
      landmarkIndex >= visibleLandmarks.length - 1 ? 0 : landmarkIndex + 1;
    onSelectLandmark(visibleLandmarks[nextIdx].id);
  };

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
        aria-label="Close building summary"
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

      <div className="card-layout" ref={scrollContainerRef}>
        <div
          className="card-photo-wrap"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
        >
          <div
            className={`card-photo-track ${isDragging ? 'is-dragging' : ''}`}
            style={{
              transform: `translate3d(calc(${-safeIndex * 100}% + ${dragOffsetX}px), 0, 0)`
            }}
          >
            {photos.map((src, idx) => (
              <div className="card-photo-slide" key={`${src}-${idx}`}>
                <img
                  className="card-photo"
                  src={src}
                  alt={`${landmark.name} — photo ${idx + 1} of ${photos.length}`}
                  draggable={false}
                  onError={() =>
                    setFailedUrls((prev) => ({
                      ...prev,
                      [src]: true
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="card-photo-scrim" aria-hidden="true" />

          <span className="card-photo-counter">
            {safeIndex === 0
              ? `1 / ${photos.length} · Exterior`
              : `${safeIndex + 1} / ${photos.length}`}
          </span>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="carousel-nav-btn prev"
                onClick={goPrev}
                aria-label="Previous photo"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                className="carousel-nav-btn next"
                onClick={goNext}
                aria-label="Next photo"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              <div className="carousel-dots" role="tablist" aria-label="Building photos">
                {photos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === safeIndex}
                    aria-label={`View photo ${idx + 1}`}
                    className={`carousel-dot ${idx === safeIndex ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                  />
                ))}
              </div>
            </>
          )}

          <span className="card-category-badge">{landmark.catLabel}</span>
          <span
            className="card-distance-badge"
            title={`Located ${formatDistance(distMeters)} ${cardinalFull} (${bearingDeg}°) from your pin`}
          >
            {formatDistance(distMeters)} · {compassLabel}
          </span>
        </div>

        <div className="card-content">
          <div className="card-header-row">
            <div className="card-header-group">
              <h2 id="card-title" className="card-title">
                {landmark.name}
              </h2>
              <p className="card-role">{landmark.role}</p>
            </div>

            <div className="card-utility-bar">
              {typeof window !== 'undefined' && 'speechSynthesis' in window && (
                <button
                  type="button"
                  className={`card-icon-pill ${isSpeaking ? 'is-active' : ''}`}
                  onClick={toggleSpeech}
                  aria-label={isSpeaking ? 'Stop audio summary' : 'Listen to audio summary'}
                  title={isSpeaking ? 'Stop audio guide' : 'Listen to audio summary'}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    {isSpeaking ? (
                      <line x1="22" y1="9" x2="16" y2="15"></line>
                    ) : (
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    )}
                  </svg>
                  <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                </button>
              )}

              {canStepLandmarks && (
                <div className="card-stepper" aria-label="Browse nearby landmarks">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={stepPrevLandmark}
                    aria-label="Previous landmark in view"
                    title="Previous landmark"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <span className="stepper-count">
                    {landmarkIndex + 1}/{visibleLandmarks.length}
                  </span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={stepNextLandmark}
                    aria-label="Next landmark in view"
                    title="Next landmark"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 1-Sentence Spatial / Civic Significance Lead */}
          <p className="card-lead">
            <strong className="lead-prefix">In the square:</strong> {landmark.whyItMatters}
          </p>

          {/* Hairline-Ruled Architectural Ledger (No nested cards) */}
          <dl className="card-ledger">
            <div className="ledger-cell">
              <dt className="ledger-term">Style &amp; Era</dt>
              <dd className="ledger-desc">{landmark.styleAndEra}</dd>
            </div>
            <div className="ledger-cell">
              <dt className="ledger-term">Architect / Origin</dt>
              <dd className="ledger-desc">{landmark.architect}</dd>
            </div>
            <div className="ledger-cell">
              <dt className="ledger-term">Orientation</dt>
              <dd className="ledger-desc">
                {cardinalFull} · {walkLabel}
              </dd>
            </div>
          </dl>

          {/* Architectural & Historical Summary */}
          <div className="card-narrative">
            <p className="card-summary">{landmark.summary}</p>
            {landmark.historicalContext && (
              <>
                {isExpandedSummary && (
                  <p className="card-summary card-summary-extended">
                    {landmark.historicalContext}
                  </p>
                )}
                <button
                  type="button"
                  className="summary-expand-btn"
                  onClick={() => setIsExpandedSummary((v) => !v)}
                >
                  <span>
                    {isExpandedSummary
                      ? 'Show concise summary'
                      : 'Read deeper architectural & historical context'}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={isExpandedSummary ? 'is-rotated' : ''}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Facade & Structural Highlights */}
          {landmark.highlights && landmark.highlights.length > 0 && (
            <div className="card-highlights">
              <h3 className="highlights-heading">Details to spot on site</h3>
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
                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
              </svg>
              <span>Open in Google Maps</span>
            </a>
            <a
              className="card-btn-secondary"
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Wikipedia ↗</span>
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
};
