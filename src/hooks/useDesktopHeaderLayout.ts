// ===== useDesktopHeaderLayout =====
// Reusable hook for responsive Desktop header layouts.
//
// PURPOSE:
//   Provides a container-width-aware "isNarrow" flag so headers can switch
//   between a single-row layout (wide) and a multi-row layout (narrow).
//   Uses ResizeObserver on the actual container element — automatically
//   accounts for sidebar state, zoom level, and viewport width.
//
// HEADER INVARIANTS (must always hold for any Desktop header using this hook):
//   1. No overlap ever — no UI element may cover/overlay another at any width/zoom.
//   2. No control outside card padding — kebab/icons stay inside the rounded card.
//   3. Kebab always visible — never clipped or pushed off-screen.
//   4. Title never covered — truncation with ellipsis is allowed, but not hidden.
//   5. Search always accessible — may move to row 2, but must remain reachable.
//   6. Tabs always usable — wrap to row 2 on narrow, but never overlay other controls.
//   7. No horizontal page overflow — container must not create scrollbars.
//   8. No layout jitter when toggling search — right-side controls must not shift.
//
// BREAKPOINT:
//   Default: 820px container content width.
//   This is a UX breakpoint, not derived from current label pixel widths.
//   It represents the minimum width at which a header with:
//     Title (~200px) + Search (40–200px) + Tabs (~340px) + Kebab (36px) + gaps (~50px)
//   can comfortably fit in a single row WITHOUT compressing any element.
//   The value includes headroom for:
//     - Longer tab labels (i18n, future features)
//     - 4th tab addition (~+120px)
//     - Title truncation (title becomes flex-shrink in wide mode)
//   If labels change (i18n), icons change, or tabs are added, only this constant
//   needs adjustment — all consumers automatically adapt.
//
// USAGE:
//   const ref = useRef<HTMLDivElement>(null);
//   const { isNarrow } = useDesktopHeaderLayout(ref);
//   // or with custom breakpoint:
//   const { isNarrow } = useDesktopHeaderLayout(ref, 600);
//
//   return (
//     <div ref={ref}>
//       {isNarrow ? <TwoRowHeader /> : <SingleRowHeader />}
//     </div>
//   );
//
// TEST MATRIX (must pass for any header using this hook):
//   Widths: 960, 1024, 1100, 1280, 1366, 1440, 1536, 1728, 1920
//   Zoom: 100%, 110%, 125%
//   States: search collapsed + search expanded
//   Sidebar: expanded + collapsed
//   All 8 invariants must hold at every combination.

import { useEffect, useState, type RefObject } from 'react';

/** Default breakpoint: container width below which headers switch to multi-row */
export const DESKTOP_HEADER_NARROW_BP = 820;

/**
 * Tracks the content width of a container element via ResizeObserver
 * and returns `isNarrow` when it falls below the given breakpoint.
 *
 * @param ref   - React ref attached to the header card/container element
 * @param breakpoint - Width threshold in px (default: DESKTOP_HEADER_NARROW_BP)
 * @returns { isNarrow: boolean; containerWidth: number }
 */
export function useDesktopHeaderLayout(
  ref: RefObject<HTMLElement | null>,
  breakpoint: number = DESKTOP_HEADER_NARROW_BP
): { isNarrow: boolean; containerWidth: number } {
  const [isNarrow, setIsNarrow] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setContainerWidth(w);
        setIsNarrow(w < breakpoint);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, breakpoint]);

  return { isNarrow, containerWidth };
}