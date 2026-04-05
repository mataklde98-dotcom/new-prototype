// ===== MAIN LAYOUT =====
// Global Desktop Layout Authority
//
// ARCHITECTURE (Desktop):
//   Viewport (h-screen, overflow-hidden)
//   └── Stage Container (flex row, min-h-0)
//       ├── Sidebar Column (flex-shrink-0, in-flow, pl-3 pt-3 pb-3)
//       │   └── ModernSidebar (h-full, rounded card)
//       └── Content Column (flex-1, min-w-0, min-h-0, pt-3 pb-3)
//           └── DesktopContentWrapper (scroll + centering + width policy authority)
//               └── DesktopPageHeader (shared header baseline — optional)
//               └── ScreenContent
//
// SPACING TOKENS:
//   SIDEBAR_INSET        = 12px (pl-3, pt-3, pb-3 on sidebar column)
//   CONTENT_INSET        = 12px (pt-3, pb-3 on content column — matches sidebar)
//   CONTENT_PADDING      = responsive px-4/px-6/px-8 (inside DesktopContentWrapper)
//   SIDEBAR→CONTENT GAP  = equals CONTENT_PADDING left (no extra gap — DCW padding IS the gap)
//   CONTENT→VIEWPORT     = equals CONTENT_PADDING right (symmetric)
//
// VERTICAL AUTHORITY (Option A):
//   Stage Container defines vertical inset (pt-3 pb-3 on both columns).
//   DesktopContentWrapper has NO vertical padding.
//   Screens define no top margin.
//
// WIDTH POLICY (enum-based, DCW only):
//   standard → outer 1440px, inner 1200px (ALL screens incl. detail pages)
//   wide     → outer 1600px, inner 1440px (future use)
//   full     → no max-width (grids, data-heavy, Chat)
//   All detail/entity screens use "standard" — visual width parity enforced.
//   Screens declare policy ONLY — no max-w classes in screens.
//
// INVARIANTS:
//   1. Sidebar is IN-FLOW (flex child), never fixed/absolute
//   2. Content column extends to viewport right edge — scrollbar flush with viewport
//   3. DesktopContentWrapper is the ONLY horizontal/width spacing authority
//   4. Stage Container (Content Column pt-3 pb-3) is the ONLY vertical authority
//   5. No screen may define its own px, mx-auto, max-w, or layout-level mt/pt
//   6. wrapperLeft === wrapperRight (symmetric centering within content column)
//   7. Content top === Sidebar card top (both at 12px from viewport)
//   8. DesktopPageHeader defines shared header baseline for all screens with headers
//   9. Sidebar expanded/collapsed does NOT change content width policy
import React from 'react';
import ModernSidebar from './ModernSidebar';
import MobileNavigation from './MobileNavigation';
import { StatusBar } from '@/imports/Section7';
import { useScrollDirection } from '@/hooks/useScrollDirection';

interface MainLayoutProps {
  children: React.ReactNode;
  isMobile: boolean;
  windowWidth: number;
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  mobileActiveTab: string;
  showMyFlashcards?: boolean;
  showCompletedExams?: boolean;
  showChats?: boolean;
  showAccountEdit?: boolean;
  showTodoManagement?: boolean;
  showKlassenarbeiten?: boolean;
  showSchulaufgaben?: boolean;
  showSchuleUndKlasse?: boolean;
  showLernanalyse?: boolean;
  showTutoringActivation?: boolean;
  showTutoringProgress?: boolean;
  showMeetings?: boolean;
  onToggleSidebar: () => void;
  onHomeClick: () => void;
  onMyFlashcardsClick: () => void;
  onNavigateToCompletedExams?: () => void;
  onNavigateToProfilDesktop?: () => void;
  onNavigateToKITools?: () => void;
  onNavigateToChats?: () => void;
  onNavigateToMeetings?: () => void;
  onOpenExamSimulation?: () => void;
  onOpenGenerateFlashcards?: () => void;
  onOpenLernanalyse?: () => void;
  onMobileTabChange: (tab: string) => void;
}

export default function MainLayout({
  children,
  isMobile,
  windowWidth,
  sidebarWidth,
  sidebarCollapsed,
  mobileActiveTab,
  showMyFlashcards = false,
  showCompletedExams = false,
  showChats = false,
  showAccountEdit = false,
  showTodoManagement = false,
  showKlassenarbeiten = false,
  showSchulaufgaben = false,
  showSchuleUndKlasse = false,
  showLernanalyse = false,
  showTutoringActivation = false,
  showTutoringProgress = false,
  showMeetings = false,
  onToggleSidebar,
  onHomeClick,
  onMyFlashcardsClick,
  onNavigateToCompletedExams,
  onNavigateToProfilDesktop,
  onNavigateToKITools,
  onNavigateToChats,
  onNavigateToMeetings,
  onOpenExamSimulation,
  onOpenGenerateFlashcards,
  onOpenLernanalyse,
  onMobileTabChange,
}: MainLayoutProps) {
  const { isVisible } = useScrollDirection({ threshold: 10 });

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden">
      {/* Animated grain background texture */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {!isMobile ? (
        /* ===== DESKTOP: Stage Container ===== */
        <div className="flex-1 flex min-h-0">
          {/* Sidebar Column — in-flow flex child, NOT fixed */}
          <div
            className="flex-shrink-0 pl-3 pt-3 pb-3 transition-all duration-700 ease-in-out"
            style={{ width: `${sidebarWidth + 12}px` }}
          >
            <ModernSidebar
              isCollapsed={sidebarCollapsed}
              onToggle={onToggleSidebar}
              onHomeClick={onHomeClick}
              onMyFlashcardsClick={onMyFlashcardsClick}
              onNavigateToCompletedExams={onNavigateToCompletedExams}
              onNavigateToProfilDesktop={onNavigateToProfilDesktop}
              onNavigateToKITools={onNavigateToKITools}
              onNavigateToChats={onNavigateToChats}
              onNavigateToMeetings={onNavigateToMeetings}
              onOpenExamSimulation={onOpenExamSimulation}
              onOpenGenerateFlashcards={onOpenGenerateFlashcards}
              onOpenLernanalyse={onOpenLernanalyse}
            />
          </div>

          {/* Content Column — extends to viewport right edge */}
          <div
            className="flex-1 flex flex-col min-w-0 min-h-0 pt-3 pb-3"
            data-debug="content-column"
          >
            {children}
          </div>
        </div>
      ) : (
        /* ===== MOBILE: unchanged ===== */
        <div
          className="flex-1 flex flex-col"
          style={{
            paddingBottom: !showMyFlashcards && !showCompletedExams && !showAccountEdit && !showTodoManagement && !showKlassenarbeiten && !showSchulaufgaben && !showSchuleUndKlasse && !showLernanalyse && !showTutoringActivation && !showTutoringProgress ? "80px" : 0,
            overflow: "hidden",
          }}
        >
          <div className="flex-shrink-0 w-full" style={{ marginBottom: "12px" }}>
            <StatusBar />
          </div>
          {children}
        </div>
      )}

      {/* Bottom Navigation Bar - Mobile Only — ALWAYS MOUNTED, visibility via CSS transform */}
      {isMobile && (() => {
        const hideBottomNav = showMyFlashcards || showCompletedExams || showChats || showAccountEdit || showTodoManagement || showKlassenarbeiten || showSchulaufgaben || showSchuleUndKlasse || showLernanalyse || showTutoringActivation || showTutoringProgress;
        return (
          <div
            className="fixed bottom-0 left-0 right-0 z-[60] px-5 pb-[max(env(safe-area-inset-bottom,8px),8px)]"
            style={{
              transform: hideBottomNav ? 'translateY(calc(100% + 20px))' : 'translateY(0)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              willChange: 'transform',
              pointerEvents: hideBottomNav ? 'none' : 'auto',
            }}
          >
            <MobileNavigation
              activeTab={mobileActiveTab}
              onTabChange={onMobileTabChange}
              isVisible={isVisible && !hideBottomNav}
            />
          </div>
        );
      })()}
    </div>
  );
}
