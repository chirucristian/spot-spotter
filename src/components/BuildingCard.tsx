import React, { useEffect, useRef, useState } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const [dragOffsetX, setDragOffsetX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setFailedUrls({});
    setDragOffsetX(0);
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [landmark?.id]);

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
        aria-label="Close building details"
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

          {photos.length > 1 && (
            <>
              <span className="card-photo-counter">
                {safeIndex + 1} / {photos.length}
              </span>

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
            </>
          )}

          <div className="card-photo-badges">
            <span className="card-category-badge">{landmark.catLabel}</span>
            <span className="card-distance-badge">{formatDistance(distMeters)}</span>
          </div>
        </div>

        <div className="card-content">
          <header className="card-header">
            <h2 id="card-title" className="card-title">
              {landmark.name}
            </h2>
            <p className="card-role">{landmark.role}</p>
          </header>

          {/* Single "Built" Metadata Field — Only shown when clearly stated in the source */}
          {landmark.built && (
            <div className="card-meta-bar">
              <dl className="card-built-field">
                <dt className="built-label">Built</dt>
                <dd className="built-value">{landmark.built}</dd>
              </dl>
            </div>
          )}

          {/* Summary Only */}
          <p className="card-summary">{landmark.summary}</p>

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
