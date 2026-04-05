// ===== DEBUG LAYOUT OVERLAY =====
// Temporary dev tool — toggle with Ctrl+Shift+D (Desktop only)
// Measures layout invariants for the new Stage Container architecture.
// DELETE THIS FILE when layout verification is complete.

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DebugLayoutOverlayProps {
  sidebarWidth: number;
  sidebarCollapsed: boolean;
  mainMarginLeft: number; // legacy — kept for comparison
}

interface Measurements {
  viewportWidth: number;
  viewportHeight: number;
  // Sidebar column
  sidebarColWidth: number;
  sidebarCardLeft: number;
  sidebarCardRight: number;
  sidebarCardTop: number;
  sidebarCardBottom: number;
  // Content column
  contentColLeft: number;
  contentColRight: number;
  contentColWidth: number;
  // Wrapper (max-w-1440 inside DCW)
  wrapperLeft: number;
  wrapperRight: number;
  wrapperWidth: number;
  wrapperTop: number;
  // Inner (max-w-1200 inside DCW)
  innerLeft: number;
  innerRight: number;
  innerWidth: number;
  // Relative measurements (within content column)
  wrapperLeftRel: number;
  wrapperRightRel: number;
  // Chat panels
  chatLeftPanelWidth: number | null;
  chatRightPanelWidth: number | null;
  // Scroll info
  scrollElement: string | null;
  scrollRightEdge: number;
  // Content width policy
  contentWidthPolicy: string;
  // Header / first content measurement
  headerHeight: number;
  firstContentHeight: number;
}

export default function DebugLayoutOverlay({
  sidebarWidth,
  sidebarCollapsed,
}: DebugLayoutOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [m, setM] = useState<Measurements | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const measure = useCallback(() => {
    if (!visible) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Content column
    const contentCol = document.querySelector('[data-debug="content-column"]') as HTMLElement;
    const contentColRect = contentCol?.getBoundingClientRect();

    // Sidebar card (ModernSidebar root — has rounded-2xl)
    const sidebarCard = contentCol?.previousElementSibling?.querySelector('.rounded-2xl') as HTMLElement
      || document.querySelector('.rounded-2xl[style*="rgba(255,255,255,0.02)"]') as HTMLElement;
    const sidebarCardRect = sidebarCard?.getBoundingClientRect();

    // Sidebar column (content column's previous sibling)
    const sidebarCol = contentCol?.previousElementSibling as HTMLElement;
    const sidebarColRect = sidebarCol?.getBoundingClientRect();

    // DCW wrapper/inner
    const wrapperEl = document.querySelector('[data-debug="content-wrapper"]') as HTMLElement;
    const innerEl = document.querySelector('[data-debug="content-inner"]') as HTMLElement;
    const wRect = wrapperEl?.getBoundingClientRect();
    const iRect = innerEl?.getBoundingClientRect();

    // Content width policy
    const dcwRoot = wrapperEl?.parentElement as HTMLElement;
    const contentWidthPolicy = dcwRoot?.getAttribute('data-content-width') || 'unknown';

    // Header / first content measurement
    const headerEl = innerEl?.querySelector('[class*="pt-5"][class*="pb-4"]') as HTMLElement;
    const headerRect = headerEl?.getBoundingClientRect();
    const firstContentEl = headerEl ? headerEl.nextElementSibling as HTMLElement : innerEl?.firstElementChild as HTMLElement;
    const firstContentRect = firstContentEl?.getBoundingClientRect();

    // Scroll container
    let scrollEl: HTMLElement | null = null;
    let check = wrapperEl?.parentElement;
    while (check) {
      const s = window.getComputedStyle(check);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') { scrollEl = check; break; }
      check = check.parentElement;
    }
    if (!scrollEl && wrapperEl?.parentElement) {
      const s = window.getComputedStyle(wrapperEl.parentElement);
      if (s.overflowY === 'auto' || s.overflowY === 'scroll') scrollEl = wrapperEl.parentElement;
    }
    const scrollRect = scrollEl?.getBoundingClientRect();

    // Chat panels
    const chatContainer = document.querySelector('[class*="rounded-2xl"][class*="gap-0"]') as HTMLElement;
    let chatLP: number | null = null, chatRP: number | null = null;
    if (chatContainer && chatContainer.children.length >= 2) {
      chatLP = Math.round((chatContainer.children[0] as HTMLElement).getBoundingClientRect().width);
      chatRP = Math.round((chatContainer.children[1] as HTMLElement).getBoundingClientRect().width);
    }

    const ccLeft = contentColRect ? Math.round(contentColRect.left) : 0;

    setM({
      viewportWidth: vw,
      viewportHeight: vh,
      sidebarColWidth: sidebarColRect ? Math.round(sidebarColRect.width) : 0,
      sidebarCardLeft: sidebarCardRect ? Math.round(sidebarCardRect.left) : 0,
      sidebarCardRight: sidebarCardRect ? Math.round(vw - sidebarCardRect.right) : 0,
      sidebarCardTop: sidebarCardRect ? Math.round(sidebarCardRect.top) : 0,
      sidebarCardBottom: sidebarCardRect ? Math.round(vh - sidebarCardRect.bottom) : 0,
      contentColLeft: ccLeft,
      contentColRight: contentColRect ? Math.round(vw - contentColRect.right) : 0,
      contentColWidth: contentColRect ? Math.round(contentColRect.width) : 0,
      wrapperLeft: wRect ? Math.round(wRect.left) : 0,
      wrapperRight: wRect ? Math.round(vw - wRect.right) : 0,
      wrapperWidth: wRect ? Math.round(wRect.width) : 0,
      wrapperTop: wRect ? Math.round(wRect.top) : 0,
      innerLeft: iRect ? Math.round(iRect.left) : 0,
      innerRight: iRect ? Math.round(vw - iRect.right) : 0,
      innerWidth: iRect ? Math.round(iRect.width) : 0,
      wrapperLeftRel: wRect ? Math.round(wRect.left - ccLeft) : 0,
      wrapperRightRel: wRect && contentColRect ? Math.round(contentColRect.right - wRect.right) : 0,
      chatLeftPanelWidth: chatLP,
      chatRightPanelWidth: chatRP,
      scrollElement: scrollEl ? `${scrollEl.tagName.toLowerCase()}${scrollEl.dataset.debug ? `[${scrollEl.dataset.debug}]` : ''}` : 'none',
      scrollRightEdge: scrollRect ? Math.round(vw - scrollRect.right) : 0,
      contentWidthPolicy,
      headerHeight: headerRect ? Math.round(headerRect.height) : 0,
      firstContentHeight: firstContentRect ? Math.round(firstContentRect.height) : 0,
    });

    rafRef.current = requestAnimationFrame(measure);
  }, [visible, sidebarWidth]);

  useEffect(() => {
    if (visible) rafRef.current = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, measure]);

  if (!visible || !m) return null;

  const ok = '#0f0', warn = '#f90', bad = '#f44';

  // PASS/FAIL checks
  const wrapperSymmetric = Math.abs(m.wrapperLeftRel - m.wrapperRightRel) <= 1;
  const scrollFlush = m.scrollRightEdge === 0;
  const contentColFlush = m.contentColRight === 0;
  const sidebarGap = m.contentColLeft - (m.sidebarCardLeft + sidebarWidth);
  // The gap from sidebar card right edge to content = DCW left padding
  // The gap from content right edge to viewport = 0 (content column extends to edge)
  // DCW internal padding is the visual spacing

  return (
    <div
      className="fixed top-3 right-3 z-[99999] rounded-lg px-3 py-2.5 pointer-events-auto select-text"
      style={{
        background: 'rgba(0,0,0,0.95)',
        border: `1px solid ${wrapperSymmetric && scrollFlush && contentColFlush ? 'rgba(0,255,100,0.3)' : 'rgba(255,100,100,0.3)'}`,
        backdropFilter: 'blur(10px)',
        color: '#7df',
        fontFamily: 'monospace',
        fontSize: '10px',
        lineHeight: '1.6',
        minWidth: 310,
        maxHeight: 'calc(100vh - 24px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ color: '#fff', marginBottom: 4, fontSize: 11 }}>
        Layout Debug <span style={{ color: '#555' }}>(Ctrl+Shift+D)</span>
      </div>

      {/* PASS/FAIL */}
      <Sec title="PASS/FAIL" color={wrapperSymmetric && scrollFlush ? ok : bad}>
        <R l="wrapperL/R symmetric" v={wrapperSymmetric ? `YES (${m.wrapperLeftRel}=${m.wrapperRightRel})` : `NO (${m.wrapperLeftRel} vs ${m.wrapperRightRel})`} c={wrapperSymmetric ? ok : bad} />
        <R l="scrollbar at viewport" v={scrollFlush ? 'YES' : `NO (+${m.scrollRightEdge}px)`} c={scrollFlush ? ok : bad} />
        <R l="content col flush right" v={contentColFlush ? 'YES' : `NO (+${m.contentColRight}px)`} c={contentColFlush ? ok : bad} />
        <R l="sidebar→content gap" v={`${sidebarGap}px`} c={warn} />
      </Sec>

      {/* Sidebar */}
      <Sec title="Sidebar" color="#888">
        <R l="state" v={sidebarCollapsed ? 'collapsed' : 'expanded'} />
        <R l="card width" v={`${sidebarWidth}px`} />
        <R l="col width" v={`${m.sidebarColWidth}px`} />
        <R l="card inset" v={`L:${m.sidebarCardLeft} T:${m.sidebarCardTop} B:${m.sidebarCardBottom}`} />
      </Sec>

      {/* Content column */}
      <Sec title="Content Column" color={warn}>
        <R l="left" v={`${m.contentColLeft}px`} />
        <R l="right" v={`${m.contentColRight}px`} c={m.contentColRight === 0 ? ok : bad} />
        <R l="width" v={`${m.contentColWidth}px`} />
      </Sec>

      {/* Wrapper (within content column) */}
      <Sec title="Wrapper (max-w-1440)" color="#0ff">
        <R l="L from col" v={`${m.wrapperLeftRel}px`} />
        <R l="R from col" v={`${m.wrapperRightRel}px`} />
        <R l="L/R delta" v={`${Math.abs(m.wrapperLeftRel - m.wrapperRightRel)}px`} c={wrapperSymmetric ? ok : bad} />
        <R l="width" v={`${m.wrapperWidth}px`} />
      </Sec>

      {/* Inner */}
      <Sec title="Inner (max-w-1200)" color="#0f0">
        <R l="L from viewport" v={`${m.innerLeft}px`} />
        <R l="R from viewport" v={`${m.innerRight}px`} />
        <R l="width" v={`${m.innerWidth}px`} />
      </Sec>

      {/* Stage framing */}
      <Sec title="Stage Framing (vertical)" color="#f0f">
        <R l="sidebar card T" v={`${m.sidebarCardTop}px`} />
        <R l="sidebar card B" v={`${m.sidebarCardBottom}px`} />
        <R l="content col T" v={`${m.contentColLeft > 0 ? 12 : 0}px (pt-3)`} />
        <R l="content col B" v={`${m.contentColLeft > 0 ? 12 : 0}px (pb-3)`} />
        <R l="DCW scroll top" v={`${m.wrapperTop || 0}px`} c={Math.abs((m.wrapperTop || 0) - m.sidebarCardTop) <= 2 ? ok : bad} />
      </Sec>

      {/* Chat */}
      {m.chatLeftPanelWidth !== null && (
        <Sec title="Chat Panels" color="#ff0">
          <R l="left" v={`${m.chatLeftPanelWidth}px`} />
          <R l="right" v={`${m.chatRightPanelWidth}px`} />
        </Sec>
      )}

      {/* Scroll */}
      <Sec title="Scroll" color="#ff0">
        <R l="element" v={m.scrollElement || 'none'} />
        <R l="right edge" v={`${m.scrollRightEdge}px from viewport`} c={scrollFlush ? ok : bad} />
      </Sec>

      {/* Content width policy */}
      <Sec title="Content Width Policy" color="#ff0">
        <R l="policy" v={m.contentWidthPolicy} />
      </Sec>

      {/* Header / first content measurement */}
      <Sec title="Header / First Content" color="#ff0">
        <R l="header height" v={`${m.headerHeight}px`} />
        <R l="first content height" v={`${m.firstContentHeight}px`} />
      </Sec>

      <div style={{ color: '#444', marginTop: 4 }}>{m.viewportWidth}x{m.viewportHeight}</div>
    </div>
  );
}

function Sec({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return <div style={{ marginTop: 5 }}><div style={{ color, fontSize: 10, marginBottom: 1 }}>{title}</div>{children}</div>;
}
function R({ l, v, c }: { l: string; v: string; c?: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span style={{ color: '#555' }}>{l}:</span><span style={{ color: c || '#aaa' }}>{v}</span></div>;
}