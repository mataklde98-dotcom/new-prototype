// ===== DESKTOP PAGE HEADER =====
// Global shared header component for ALL Desktop screens that have a header.
//
// RESPONSIBILITIES:
//   - Defines the vertical start baseline for all screens (pt-5 = 20px from DCW top)
//   - Renders: back button (optional) → title + subtitle + actions → children (tabs, breadcrumbs)
//   - Fixed spacing tokens between all elements
//
// RULES:
//   - Screens must NOT render their own back/title layout
//   - Screens must NOT use mt-, pt- to position header
//   - Screens must NOT wrap header in additional containers
//   - Header must live inside DesktopContentWrapper
//
// SPACING TOKENS:
//   pt-5 (20px)   — top breathing room from stage framing
//   gap 6px       — back row → title row
//   gap 12px      — title row → children (tabs, breadcrumbs, etc.)
//   pb-4 (16px)   — bottom gap to screen content

import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface DesktopPageHeaderProps {
  /** Page title (optional — detail screens may omit title if content provides its own) */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Back button handler — if provided, shows back button */
  onBack?: () => void;
  /** Back button label (default: "Zurück") */
  backLabel?: string;
  /** Right-side action buttons */
  actions?: React.ReactNode;
  /** Additional content below title row (tabs, breadcrumbs, filters) */
  children?: React.ReactNode;
  /** Optional: override title font size for compact headers */
  titleSize?: 'default' | 'compact';
}

export default function DesktopPageHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Zurück',
  actions,
  children,
  titleSize = 'default',
}: DesktopPageHeaderProps) {
  const titleFontSize = titleSize === 'compact' ? '20px' : '24px';

  return (
    <div className="pt-5 pb-4 flex-shrink-0">
      {/* Back button row */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 mb-1.5 group transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors" />
          <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/30 group-hover:text-white/50 transition-colors">
            {backLabel}
          </span>
        </button>
      )}

      {/* Title row: title + subtitle left, actions right */}
      <div className="flex items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          {title && (
            <h1
              className="font-['Poppins:SemiBold',sans-serif] text-white/95 tracking-tight truncate min-w-0"
              style={{ fontSize: titleFontSize }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40 mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>

      {/* Children: tabs, breadcrumbs, filters, etc. */}
      {children && (
        <div className="mt-3">
          {children}
        </div>
      )}
    </div>
  );
}