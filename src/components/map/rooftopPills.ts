import { Landmark } from '../../types';

export function createRooftopPillHTML(landmark: Landmark, isSelected: boolean): string {
  const catClass = `cat-${landmark.category || 'civic'}`;
  return `
    <div class="rooftop-pill-anchor ${catClass} ${isSelected ? 'is-selected' : ''}" data-landmark-id="${landmark.id}">
      <div class="rooftop-pill">
        <span class="pill-name">${landmark.name}</span>
      </div>
      <div class="pill-pointer"></div>
      <div class="pill-roof-dot"></div>
    </div>
  `;
}

let collisionRafId: number | null = null;

export function schedulePillCollisionResolution(): void {
  if (collisionRafId !== null) return;
  collisionRafId = requestAnimationFrame(() => {
    collisionRafId = null;
    resolvePillCollisions();
  });
}

/**
 * Pure mathematical collision resolver that uses the untransformed anchor point
 * and static offsetWidth/offsetHeight so CSS transitions never cause a feedback
 * loop or label trembling during zoom.
 */
export function resolvePillCollisions(): void {
  const pills = Array.from(
    document.querySelectorAll<HTMLElement>('.rooftop-pill-anchor:not(.is-exiting)')
  );

  interface PillItem {
    el: HTMLElement;
    anchorX: number;
    anchorY: number;
    width: number;
    height: number;
    isSelected: boolean;
  }

  const items: PillItem[] = [];
  for (const el of pills) {
    const pillBox = el.querySelector<HTMLElement>('.rooftop-pill');
    const parent = el.parentElement;
    if (!pillBox || !parent) continue;

    const width = pillBox.offsetWidth;
    const height = pillBox.offsetHeight;
    if (width === 0 || height === 0) continue;

    // Read the parent marker wrapper's screen position, which is independent of the pill's CSS transition
    const parentRect = parent.getBoundingClientRect();
    items.push({
      el,
      anchorX: parentRect.left,
      anchorY: parentRect.top,
      width,
      height,
      isSelected: el.classList.contains('is-selected')
    });
  }

  // Sort selected first, then bottom-to-top so southern labels stay anchored to their roof
  items.sort((a, b) => {
    if (a.isSelected !== b.isSelected) return a.isSelected ? -1 : 1;
    return b.anchorY - a.anchorY;
  });

  interface Box {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

  const placedBoxes: Box[] = [];

  for (const item of items) {
    let shiftY = 0;
    let attempts = 0;

    const getBox = (sy: number): Box => ({
      left: item.anchorX - item.width / 2,
      right: item.anchorX + item.width / 2,
      top: item.anchorY - item.height - 12 + sy,
      bottom: item.anchorY - 12 + sy
    });

    let candidate = getBox(shiftY);

    while (
      attempts < 3 &&
      placedBoxes.some(
        (b) =>
          candidate.left < b.right - 4 &&
          candidate.right > b.left + 4 &&
          candidate.top < b.bottom + 4 &&
          candidate.bottom > b.top - 4
      )
    ) {
      shiftY -= 28;
      candidate = getBox(shiftY);
      attempts++;
    }

    const stillCollides =
      !item.isSelected &&
      placedBoxes.some(
        (b) =>
          candidate.left < b.right - 4 &&
          candidate.right > b.left + 4 &&
          candidate.top < b.bottom + 4 &&
          candidate.bottom > b.top - 4
      );

    if (stillCollides) {
      item.el.classList.add('is-crowded');
    } else {
      item.el.classList.remove('is-crowded');
      placedBoxes.push(candidate);

      const prevShift = item.el.dataset.shiftY;
      const nextShift = String(shiftY);
      if (prevShift !== nextShift) {
        item.el.dataset.shiftY = nextShift;
        item.el.style.setProperty('--pill-shift-y', `${shiftY}px`);
      }
    }
  }
}

export function getMobileAwareZoom(baseZoom: number): number {
  return typeof window !== 'undefined' && window.innerWidth < 520
    ? Math.max(15.8, baseZoom - 0.6)
    : baseZoom;
}
