// ===== BREADCRUMB DROPDOWN FILTER =====
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FlashcardSet } from "@/types/flashcard";

interface BreadcrumbFilterProps {
  allSets: FlashcardSet[];
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  onSubjectChange: (val: string) => void;
  onKategorieChange: (val: string) => void;
  onThemaChange: (val: string) => void;
  onUnterthemaChange: (val: string) => void;
  showOnlySubject?: boolean; // True for "Eigene" tab - users can only create subjects, not full hierarchy
}

function BreadcrumbFilter({
  allSets,
  activeSubject,
  activeKategorie,
  activeThema,
  activeUnterthema,
  onSubjectChange,
  onKategorieChange,
  onThemaChange,
  onUnterthemaChange,
  showOnlySubject = false,
}: BreadcrumbFilterProps) {
  const [openDropdown, setOpenDropdown] = useState<
    string | null
  >(null);
  const [hoveredOption, setHoveredOption] = useState<
    string | null
  >(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [subjectButtonRef, setSubjectButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [kategorieButtonRef, setKategorieButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [themaButtonRef, setThemaButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const [unterthemaButtonRef, setUnterthemaButtonRef] =
    useState<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if there are any items at all
  const hasAnyItems = allSets.length > 0;

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Auto-scroll to newly visible chips
  useEffect(() => {
    if (
      kategorieButtonRef &&
      activeSubject !== "Alle Fächer" &&
      activeSubject !== "All" &&
      activeSubject !== ""
    ) {
      setTimeout(() => {
        kategorieButtonRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [activeSubject, kategorieButtonRef]);

  useEffect(() => {
    if (
      themaButtonRef &&
      activeKategorie !== "Alle" &&
      activeKategorie !== ""
    ) {
      setTimeout(() => {
        themaButtonRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [activeKategorie, themaButtonRef]);

  useEffect(() => {
    if (
      unterthemaButtonRef &&
      activeThema !== "Alle" &&
      activeThema !== ""
    ) {
      setTimeout(() => {
        unterthemaButtonRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [activeThema, unterthemaButtonRef]);

  // Auto-scroll when Unterthema is selected
  useEffect(() => {
    if (
      unterthemaButtonRef &&
      activeUnterthema !== "Alle" &&
      activeUnterthema !== ""
    ) {
      setTimeout(() => {
        unterthemaButtonRef.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [activeUnterthema, unterthemaButtonRef]);



  const subjects = [
    "Alle Fächer",
    ...Array.from(new Set(allSets.map((s) => s.subject).filter(s => s && s !== 'Custom'))),
  ];
  const kategorien =
    activeSubject === "Alle Fächer" || activeSubject === "All"
      ? []
      : [
          "Alle",
          ...Array.from(
            new Set(
              allSets
                .filter((s) => s.subject === activeSubject)
                .map((s) => s.kategorie)
                .filter((k) => k && k.trim() !== ''), // Filter empty/null/undefined
            ),
          ),
        ];
  const themen =
    activeKategorie === "Alle" || activeKategorie === ""
      ? []
      : [
          "Alle",
          ...Array.from(
            new Set(
              allSets
                .filter(
                  (s) =>
                    s.subject === activeSubject &&
                    s.kategorie === activeKategorie,
                )
                .map((s) => s.thema)
                .filter((t) => t && t.trim() !== ''), // Filter empty/null/undefined
            ),
          ),
        ];
  const unterthemen =
    activeThema === "Alle" || activeThema === ""
      ? []
      : [
          "Alle",
          ...Array.from(
            new Set(
              allSets
                .filter(
                  (s) =>
                    s.subject === activeSubject &&
                    s.kategorie === activeKategorie &&
                    s.thema === activeThema,
                )
                .map((s) => s.unterthema)
                .filter((u) => u && u.trim() !== ''), // Filter empty/null/undefined
            ),
          ),
        ];

  const getSubjectColor = (subject: string): string => {
    const colorMap: Record<string, string> = {
      "Alle Fächer": "#009379",
      "All": "#009379", // Fallback for legacy data
      "Mathematik": "#618cff",
      "Mathe": "#618cff",
      "Deutsch": "#ff6b9d",
      "Englisch": "#4a9eff",
      "Biologie": "#00d084",
      "Geschichte": "#ffa94d",
      "Chemie": "#a78bfa",
      "Französisch": "#3b82f6",
    };
    return colorMap[subject] || "#618cff";
  };

  const color = getSubjectColor(activeSubject);

  const renderDropdown = (
    options: string[],
    active: string,
    onChange: (val: string) => void,
    level: string,
    buttonRef: HTMLButtonElement | null,
  ) => {
    if (openDropdown !== level || !buttonRef) return null;

    // Auto-highlight first option on desktop when dropdown opens
    if (!isTouchDevice && hoveredOption === null && options.length > 0) {
      // Use setTimeout to avoid state update during render
      setTimeout(() => setHoveredOption(options[0]), 0);
    }

    const rect = buttonRef.getBoundingClientRect();

    const dropdownContent = (
      <div
        className="fixed z-[150] rounded-xl border border-white/[0.12] bg-[#141414] overflow-y-auto scrollbar-thin"
        style={{
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          minWidth: `${Math.max(rect.width, 240)}px`,
          maxWidth: "360px",
          maxHeight: "380px",
        }}
        onMouseLeave={() => {
          setOpenDropdown(null);
          setHoveredOption(null);
        }}
      >
        {options.map((option) => {
          // "Alle" ist aktiv wenn: active === "Alle" ODER active === "" (initial state)
          const isActive = active === option || (option === 'Alle' && active === '');
          const isHovered = hoveredOption === option;
          const isTruncated = option.length > 50;

          return (
            <div key={option} className="relative">
              <button
                onClick={() => {
                  onChange(option);
                  setOpenDropdown(null);
                  setHoveredOption(null);
                }}
                onMouseEnter={!isTouchDevice ? () => setHoveredOption(option) : undefined}
                onMouseLeave={!isTouchDevice ? () => setHoveredOption(null) : undefined}
                className="w-full text-left font-['Poppins:Medium',sans-serif] transition-all duration-200 relative active:bg-white/[0.08]"
                style={{
                  padding: "12px 16px",
                  fontSize: "13px",
                  lineHeight: "1.35",
                  color: isActive
                    ? "white"
                    : isHovered && !isTouchDevice
                      ? "white"
                      : "rgba(255, 255, 255, 0.6)",
                  background: isActive
                    ? `linear-gradient(90deg, ${color}20, transparent)`
                    : isHovered && !isTouchDevice
                      ? "rgba(255, 255, 255, 0.05)"
                      : "transparent",
                  borderLeft: isActive
                    ? `3px solid ${color}`
                    : "none",
                  paddingLeft: isActive ? "13px" : "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {option}
                </span>
              </button>

              {/* Tooltip für lange Texte bei Hover (Desktop only) */}
              {isHovered && isTruncated && !isTouchDevice && (
                <div
                  className="fixed z-[250] rounded-lg border border-white/[0.15] bg-[#141414] pointer-events-none"
                  style={{
                    top: "50%",
                    left: "100%",
                    transform: "translateY(-50%)",
                    marginLeft: "12px",
                    maxWidth: "300px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    lineHeight: "1.4",
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {option}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );

    return createPortal(dropdownContent, document.body);
  };

  const renderBreadcrumbItem = (
    label: string,
    level: string,
    options: string[],
    active: string,
    onChange: (val: string) => void,
    buttonRef: HTMLButtonElement | null,
    setButtonRef: (ref: HTMLButtonElement | null) => void,
  ) => {
    if (options.length === 0) return null;

    // ✅ Disable "Alle Fächer" chip when there are no items at all
    const isDisabled = !hasAnyItems && level === 'subject';

    // Display logic: Map "All" → "Alle Fächer" for Subject
    let displayText: string;
    if (level === "subject" && active === "All") {
      displayText = "Alle Fächer";
    } else if (active) {
      displayText = active;
    } else {
      displayText = label;
    }

    // "Alle Fächer" or "All" count as active state (green) for Subject
    const isActive = 
      (level === "subject" && (active === "Alle Fächer" || active === "All")) ||
      (active !== "" && active !== "Alle");

    return (
      <div className="relative z-[100] flex-shrink-0">
        <button
          ref={setButtonRef}
          onClick={() => {
            if (!isDisabled) {
              const newState = openDropdown === level ? null : level;
              setOpenDropdown(newState);
              // Reset hover when closing
              if (!newState) {
                setHoveredOption(null);
              }
            }
          }}
          disabled={isDisabled}
          className={`
            relative flex items-center gap-1 px-2.5 py-1.5 rounded-lg overflow-hidden
            font-['Poppins:Medium',sans-serif] text-[11.5px]
            transition-all duration-300
            ${isActive ? "text-white" : "text-white/50"}
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          style={
            isActive
              ? {
                  background: `${color}25`,
                  border: `1px solid ${color}40`
                }
              : {
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }
          }
        >
          {/* Inner Glow - wie FlashcardItem Badge */}
          {isActive && (
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${color}50, transparent 70%)`
              }}
            />
          )}
          <span
            className="relative z-10"
            style={{
              maxWidth: "140px",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayText}
          </span>
          {!isDisabled && (
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 12 12"
            >
              <path
                d="M3 4.5L6 7.5L9 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        {renderDropdown(
          options,
          active,
          onChange,
          level,
          buttonRef,
        )}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-2 relative z-50 breadcrumb-container scrollbar-hide"
      style={{
        overflowX: "auto",
        overflowY: "visible",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {renderBreadcrumbItem(
        "Subject",
        "subject",
        subjects,
        activeSubject,
        onSubjectChange,
        subjectButtonRef,
        setSubjectButtonRef,
      )}
      {!showOnlySubject && renderBreadcrumbItem(
        "Kategorie",
        "kategorie",
        kategorien,
        activeKategorie,
        onKategorieChange,
        kategorieButtonRef,
        setKategorieButtonRef,
      )}
      {!showOnlySubject && renderBreadcrumbItem(
        "Thema",
        "thema",
        themen,
        activeThema,
        onThemaChange,
        themaButtonRef,
        setThemaButtonRef,
      )}
      {!showOnlySubject && renderBreadcrumbItem(
        "Unterthema",
        "unterthema",
        unterthemen,
        activeUnterthema,
        onUnterthemaChange,
        unterthemaButtonRef,
        setUnterthemaButtonRef,
      )}
    </div>
  );
}

export default BreadcrumbFilter;