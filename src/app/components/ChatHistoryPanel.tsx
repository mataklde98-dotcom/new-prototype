// ===== CHAT HISTORY SIDE-PANEL =====
// ChatGPT-style slide-in panel from the right
// GPU-optimized CSS transitions, portal-based overlay
// Time-based grouping: Heute, Gestern, Letzte 7 Tage, Diesen Monat, Älter
// Mobile: active: states only, no hover:

import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  Search,
  X,
  Plus,
  Archive,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useDelayedUnmount } from '@/hooks/useDelayedUnmount';
import type { AiChat } from '@/hooks/useAiChat';
import './SlideTransition.css';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

// ===== TIME GROUP HELPERS =====
type TimeGroup = 'today' | 'yesterday' | 'last7' | 'thisMonth' | 'older';

const TIME_GROUP_LABELS: Record<TimeGroup, string> = {
  today: 'Heute',
  yesterday: 'Gestern',
  last7: 'Letzte 7 Tage',
  thisMonth: 'Diesen Monat',
  older: 'Älter',
};

function getTimeGroup(date: Date): TimeGroup {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return 'last7';
  if (diffDays < 30) return 'thisMonth';
  return 'older';
}

function groupChatsByTime(chats: AiChat[]): { group: TimeGroup; chats: AiChat[] }[] {
  const order: TimeGroup[] = ['today', 'yesterday', 'last7', 'thisMonth', 'older'];
  const map = new Map<TimeGroup, AiChat[]>();

  for (const chat of chats) {
    const g = getTimeGroup(chat.createdAt);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(chat);
  }

  return order
    .filter(g => map.has(g))
    .map(g => ({ group: g, chats: map.get(g)! }));
}

// ===== COMPONENT =====

interface ChatHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  pastChats: AiChat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat?: (chatId: string) => void;
  onArchiveChat?: (chatId: string) => void;
}

export function ChatHistoryPanel({
  isOpen,
  onClose,
  pastChats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onArchiveChat,
}: ChatHistoryPanelProps) {
  const isMounted = useDelayedUnmount(isOpen, 320);
  const [searchQuery, setSearchQuery] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Trigger animation after mount
  useEffect(() => {
    if (isOpen && isMounted) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimateIn(true);
        });
      });
    }
    if (!isOpen) {
      setAnimateIn(false);
    }
  }, [isOpen, isMounted]);

  // Reset search when closing
  useEffect(() => {
    if (!isOpen) setSearchQuery('');
  }, [isOpen]);

  // Focus search on open
  useEffect(() => {
    if (animateIn && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 320);
    }
  }, [animateIn]);

  // Split & filter chats
  const activeChats = useMemo(() => pastChats.filter(c => c.status === 'active'), [pastChats]);
  const archivedChats = useMemo(() => pastChats.filter(c => c.status === 'archived'), [pastChats]);

  const filteredActive = useMemo(() => {
    if (!searchQuery.trim()) return activeChats;
    const q = searchQuery.toLowerCase();
    return activeChats.filter(c =>
      c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [activeChats, searchQuery]);

  const filteredArchived = useMemo(() => {
    if (!searchQuery.trim()) return archivedChats;
    const q = searchQuery.toLowerCase();
    return archivedChats.filter(c =>
      c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q)
    );
  }, [archivedChats, searchQuery]);

  // Group active chats by time
  const groupedActive = useMemo(() => groupChatsByTime(filteredActive), [filteredActive]);

  if (!isMounted) return null;

  const handleSelect = (chatId: string) => {
    // CRITICAL: Close panel FIRST (sync), then start loading chat (async)
    // This ensures showChatHistory is false before any async state changes
    onClose();
    onSelectChat(chatId);
  };

  const handleNewChat = () => {
    onClose();
    onNewChat();
  };

  // CRITICAL: pointer-events none during exit animation prevents
  // backdrop from intercepting clicks on the toggle button underneath
  const isExiting = !isOpen && isMounted;

  return ReactDOM.createPortal(
    <div style={{ pointerEvents: isExiting ? 'none' : 'auto' }}>
      {/* Backdrop */}
      <div
        className={`chat-history-backdrop ${animateIn ? 'chat-history-backdrop-visible' : ''}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`chat-history-panel ${animateIn ? 'chat-history-panel-visible' : ''}`}
      >
        <div className="size-full flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="shrink-0 flex items-center justify-between"
            style={{
              padding: '16px 16px 12px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(0, 212, 170, 0.08)',
                  border: '1px solid rgba(0, 212, 170, 0.12)',
                }}
              >
                <MessageSquare className="w-4 h-4 text-[#00D4AA]/60" strokeWidth={2} />
              </div>
              <div>
                <span
                  className="text-white text-[15px] block"
                  style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.3px' }}
                >
                  Chat-Verlauf
                </span>
                <span
                  className="text-white/25 text-[10px] block"
                  style={{ fontFamily: ff, fontWeight: 500 }}
                >
                  {activeChats.length} aktiv · {archivedChats.length} archiviert
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 active:bg-white/[0.06] transition-all"
              style={{
                border: '1px solid rgba(255,255,255,0.06)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <X className="w-4 h-4 text-white/40" strokeWidth={2} />
            </button>
          </div>

          {/* Search */}
          <div className="shrink-0 px-4 pt-3 pb-2">
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Search className="w-4 h-4 text-white/25 shrink-0" strokeWidth={2} />
              <input
                ref={searchRef}
                type="text"
                placeholder="Chats durchsuchen..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/20 outline-none"
                style={{ fontFamily: ff, fontWeight: 400 }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="active:scale-90 transition-transform"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <X className="w-3.5 h-3.5 text-white/30" strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* New Chat Button */}
          <div className="shrink-0 px-4 pb-2 pt-1">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl active:scale-[0.97] active:bg-[#00D4AA]/[0.08] transition-all"
              style={{
                background: 'rgba(0, 212, 170, 0.05)',
                border: '1px solid rgba(0, 212, 170, 0.12)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(0, 212, 170, 0.10)',
                  border: '1px solid rgba(0, 212, 170, 0.15)',
                }}
              >
                <Plus className="w-3.5 h-3.5 text-[#00D4AA]/70" strokeWidth={2.5} />
              </div>
              <span
                className="text-[#00D4AA]/80 text-[13px]"
                style={{ fontFamily: ff, fontWeight: 600 }}
              >
                Neuer Chat
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="mx-4" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

          {/* Chat List - scrollable */}
          <div
            className="flex-1 overflow-y-auto min-h-0 scrollbar-thin"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* Active Chats – grouped by time */}
            {groupedActive.map(({ group, chats }) => (
              <div key={group}>
                {/* Group Header */}
                <div className="px-5 pt-3.5 pb-1.5">
                  <span
                    className="text-white/25 text-[10px]"
                    style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}
                  >
                    {TIME_GROUP_LABELS[group]}
                  </span>
                </div>

                {/* Chat Items */}
                <div className="px-2.5">
                  {chats.map(chat => {
                    const isActive = activeChatId === chat.chatId;
                    return (
                      <div key={chat.chatId} className="group relative">
                        <button
                          onClick={() => handleSelect(chat.chatId)}
                          className="w-full text-left px-3 py-2.5 rounded-xl active:bg-white/[0.04] transition-all"
                          style={{
                            background: isActive ? 'rgba(0, 212, 170, 0.04)' : 'transparent',
                            border: isActive ? '1px solid rgba(0, 212, 170, 0.08)' : '1px solid transparent',
                            WebkitTapHighlightColor: 'transparent',
                          }}
                        >
                          <span
                            className="text-[13px] block truncate"
                            style={{
                              fontFamily: ff,
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.50)',
                            }}
                          >
                            {chat.title}
                          </span>
                        </button>

                        {/* Desktop hover actions */}
                        {(onArchiveChat || onDeleteChat) && (
                          <div className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            {onArchiveChat && (
                              <button
                                onClick={() => onArchiveChat(chat.chatId)}
                                className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/[0.06] transition-all"
                                title="Archivieren"
                              >
                                <Archive className="w-3 h-3 text-white/25" strokeWidth={2} />
                              </button>
                            )}
                            {onDeleteChat && (
                              <button
                                onClick={() => onDeleteChat(chat.chatId)}
                                className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-red-500/10 transition-all"
                                title="Löschen"
                              >
                                <Trash2 className="w-3 h-3 text-red-400/40" strokeWidth={2} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Archived Chats */}
            {filteredArchived.length > 0 && (
              <>
                <div className="mx-4 mt-3 mb-0.5" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />
                <div className="px-5 pt-3 pb-1.5">
                  <span
                    className="text-white/18 text-[10px]"
                    style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}
                  >
                    Archiviert
                  </span>
                </div>
                <div className="px-2.5 pb-3">
                  {filteredArchived.map(chat => (
                    <button
                      key={chat.chatId}
                      onClick={() => handleSelect(chat.chatId)}
                      className="w-full text-left px-3 py-2.5 rounded-xl active:bg-white/[0.03] transition-all"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[12px] truncate"
                          style={{ fontFamily: ff, fontWeight: 500, color: 'rgba(255,255,255,0.28)' }}
                        >
                          {chat.title}
                        </span>
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            fontFamily: ff,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.18)',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          Archiv
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {filteredActive.length === 0 && filteredArchived.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <MessageSquare className="w-6 h-6 text-white/10" strokeWidth={1.5} />
                </div>
                <p
                  className="text-white/20 text-[13px] text-center"
                  style={{ fontFamily: ff, fontWeight: 500 }}
                >
                  {searchQuery ? 'Keine Chats gefunden' : 'Noch keine Chats'}
                </p>
                {searchQuery && (
                  <p
                    className="text-white/12 text-[11px] text-center mt-1"
                    style={{ fontFamily: ff }}
                  >
                    Versuche einen anderen Suchbegriff
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}