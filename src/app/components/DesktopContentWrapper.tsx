// ===== DESKTOP CONTENT WRAPPER =====
// Single Layout Authority for all Desktop screens.
//
// ARCHITECTURE:
//   MainLayout → Stage Container → Content Column (pt-3 pb-3) → DesktopContentWrapper → Screen
//
// HIERARCHY:
//   DesktopContentWrapper
//   → DesktopPageHeader (shared header baseline)
//   → ScreenContent
//
// HORIZONTAL AUTHORITY (this component):
//   - Content Width Policy: "standard" | "wide" | "full"
//   - Responsive horizontal padding: px-4 / px-6 / px-8
//   - Centering via mx-auto
//
// VERTICAL AUTHORITY: **NOT HERE** — handled by Content Column (pt-3 pb-3) in MainLayout.
//   This component has ZERO vertical padding. No py, no pt, no pb.
//
// WIDTH POLICY (enum-based — screens declare policy, NOT max-w classes):
//   standard → outer 1440px, inner 1200px (dashboards, overviews, detail pages)
//   wide     → outer 1600px, inner 1440px (large detail pages, future use)
//   full     → no max-width (grids, data-heavy, Chat)
//
// All detail/entity screens use "standard" — no narrow containers.
// Visual width parity: every page fills the same 1200px content area.
//
// MODES:
//   Default:    wrapper scrolls content, scrollbar at viewport edge
//   fillHeight: full height propagation, NO wrapper scroll
//               Child manages its own scrolling (e.g. Chat)
//
// INVARIANTS:
//   1. Scrollbar stays at viewport right edge (no margin/padding on scroll container)
//   2. wrapperLeft === wrapperRight within content column (symmetric mx-auto)
//   3. No screen may add its own px, mx-auto, or max-w for layout purposes
//   4. NO vertical padding — vertical framing is Stage Container's job
//   5. Sidebar expanded/collapsed does NOT change content width policy

import React from 'react';

// ===== WIDTH POLICY =====
export type ContentWidth = 'standard' | 'wide' | 'full';

const WIDTH_MAP: Record<ContentWidth, { outer: number | null; inner: number | null }> = {
  standard: { outer: 1440, inner: 1200 },
  wide:     { outer: 1600, inner: 1440 },
  full:     { outer: null, inner: null },
};

interface DesktopContentWrapperProps {
  children: React.ReactNode;
  /** Content width policy (default: "standard"). Screens declare policy, NOT max-w classes. */
  contentWidth?: ContentWidth;
  /** Custom className for the scroll container */
  className?: string;
  /** Enable wrapper-level scrolling (default: true) */
  scrollable?: boolean;
  /** Full height propagation — child manages scrolling (e.g. Chat). */
  fillHeight?: boolean;
}

export default function DesktopContentWrapper({
  children,
  contentWidth = 'standard',
  className = '',
  scrollable = true,
  fillHeight = false,
}: DesktopContentWrapperProps) {
  const effectiveScrollable = fillHeight ? false : scrollable;
  const { outer, inner } = WIDTH_MAP[contentWidth];
  const outerMax = outer ? `${outer}px` : '100%';
  const innerMax = inner ? `${inner}px` : '100%';

  return (
    <div
      data-content-width={contentWidth}
      className={`
        h-full w-full
        ${effectiveScrollable ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}
        ${fillHeight ? 'flex flex-col' : ''}
        ${className}
      `}
    >
      {/* Outer Wrapper — centered, responsive horizontal padding */}
      <div
        data-debug="content-wrapper"
        className={`
          mx-auto w-full
          px-4
          min-[1024px]:px-6
          min-[1280px]:px-8
          ${fillHeight ? 'flex-1 flex flex-col min-h-0' : ''}
        `}
        style={{ maxWidth: outerMax }}
      >
        {/* Inner Content — centered, NO vertical padding */}
        <div
          data-debug="content-inner"
          className={`
            mx-auto w-full
            ${fillHeight ? 'flex-1 flex flex-col min-h-0' : ''}
          `}
          style={{ maxWidth: innerMax }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}