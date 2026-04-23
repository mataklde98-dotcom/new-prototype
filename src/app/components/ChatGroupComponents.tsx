// ===== CHAT GROUP + REACTION + EMOJI COMPONENTS =====
// Shared widgets used by ChatScreenMobile and ChatScreenDesktop.
// - GroupAvatar — stacked mini-avatars for chat list and header
// - GroupMembersSheet — bottom sheet with member list + roles + online
// - MessageReactionBar — WhatsApp-style emoji bar on long-press
// - EmojiPickerSheet — bottom sheet emoji grid for the input
// - MessageReactions — inline badges under a bubble

import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { ChatMember, ChatReaction } from '@/mocks/chatMocks';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

// ===================================================================
// GROUP AVATAR
// ===================================================================
export function GroupAvatar({
  members,
  size = 52,
}: {
  members: ChatMember[];
  size?: number;
}) {
  const visible = members.slice(0, 3);
  const restCount = Math.max(0, members.length - visible.length);

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,170,0.18) 0%, rgba(123,97,255,0.18) 100%)',
          border: '2px solid rgba(255,255,255,0.08)',
        }}
      />
      {/* First big avatar */}
      {visible[0] && (
        <img
          src={visible[0].avatar}
          alt=""
          className="absolute object-cover rounded-full"
          style={{
            width: size * 0.65,
            height: size * 0.65,
            left: size * 0.05,
            top: size * 0.05,
            border: '2px solid #0a0a0a',
          }}
        />
      )}
      {/* Stacked second avatar */}
      {visible[1] && (
        <img
          src={visible[1].avatar}
          alt=""
          className="absolute object-cover rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            right: size * 0.02,
            bottom: size * 0.02,
            border: '2px solid #0a0a0a',
          }}
        />
      )}
      {/* +N badge in-place of 3rd if there are more */}
      {(visible[2] || restCount > 0) && (
        <div
          className="absolute flex items-center justify-center rounded-full"
          style={{
            width: size * 0.42,
            height: size * 0.42,
            left: size * 0.48,
            top: size * 0.04,
            background: restCount > 0
              ? 'linear-gradient(135deg, #00D4AA 0%, #00A87D 100%)'
              : '#1a1a1a',
            border: '2px solid #0a0a0a',
          }}
        >
          {restCount > 0 ? (
            <span
              className="text-white"
              style={{ fontFamily: ff, fontSize: Math.max(9, size * 0.18), fontWeight: 700 }}
            >
              +{restCount}
            </span>
          ) : visible[2] ? (
            <img
              src={visible[2].avatar}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

// ===================================================================
// GROUP MEMBERS SHEET
// ===================================================================
export function GroupMembersSheet({
  isOpen,
  onClose,
  groupName,
  members,
}: {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  members: ChatMember[];
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const onlineCount = useMemo(() => members.filter((m) => m.isOnline).length, [members]);
  const teachers = members.filter((m) => m.role === 'teacher');
  const students = members.filter((m) => m.role === 'student');

  if (!mounted) return null;

  const sheet = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[12000] flex items-end sm:items-center justify-center"
          initial={{ background: 'rgba(0,0,0,0)' }}
          animate={{ background: 'rgba(0,0,0,0.55)' }}
          exit={{ background: 'rgba(0,0,0,0)' }}
          onClick={onClose}
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '86vh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>

            {/* Header */}
            <div className="px-5 pt-3 pb-4 flex items-start justify-between gap-3 border-b border-white/[0.06]">
              <div className="flex-1 min-w-0">
                <h3
                  className="text-white text-[16px] truncate"
                  style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
                >
                  {groupName}
                </h3>
                <p className="text-white/45 text-[12px] mt-0.5" style={{ fontFamily: ff }}>
                  {members.length} Mitglieder · {onlineCount} online
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform flex-shrink-0"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0 scrollbar-hide">
              {teachers.length > 0 && <MembersSection label="Lehrer" items={teachers} />}
              {students.length > 0 && <MembersSection label={`Schüler (${students.length})`} items={students} />}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(sheet, document.body) : null;
}

function MembersSection({ label, items }: { label: string; items: ChatMember[] }) {
  return (
    <div className="mb-2">
      <div
        className="px-3 pt-3 pb-1.5 text-[10px] uppercase tracking-wider text-white/35"
        style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '0.08em' }}
      >
        {label}
      </div>
      <div>
        {items.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="relative shrink-0">
              <img
                src={m.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
                style={{ border: '2px solid rgba(255,255,255,0.06)' }}
              />
              {m.isOnline && (
                <div
                  className="absolute -bottom-0.5 -right-0.5"
                  style={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#00D4AA',
                    border: '2.5px solid #121212',
                  }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span
                className="text-white text-[14px] truncate block"
                style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
              >
                {m.name}{m.isSelf ? ' (Du)' : ''}
              </span>
              <p className="text-white/35 text-[11px] mt-0.5" style={{ fontFamily: ff }}>
                {m.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// MESSAGE REACTION BAR (long-press / right-click popup)
// ===================================================================
export const QUICK_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏'] as const;

export function MessageReactionBar({
  isOpen,
  anchor,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  /** { x, y, alignRight } absolute viewport coords of the tapped message. */
  anchor: { x: number; y: number; alignRight?: boolean } | null;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}) {
  if (!isOpen || !anchor || typeof document === 'undefined') return null;

  const popup = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* dismiss layer */}
          <motion.div
            className="fixed inset-0 z-[11500]"
            initial={{ background: 'rgba(0,0,0,0)' }}
            animate={{ background: 'rgba(0,0,0,0.35)' }}
            exit={{ background: 'rgba(0,0,0,0)' }}
            style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
            onClick={onClose}
          />
          {/* pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ type: 'spring', damping: 22, stiffness: 360 }}
            className="fixed z-[11510] rounded-full flex items-center gap-1.5 px-2.5 py-2"
            style={{
              top: anchor.y,
              left: anchor.alignRight ? undefined : Math.max(12, anchor.x),
              right: anchor.alignRight ? 16 : undefined,
              background: 'rgba(30,30,30,0.95)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 18px 40px rgba(0,0,0,0.55)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
            }}
          >
            {QUICK_REACTIONS.map((em) => (
              <button
                key={em}
                onClick={() => { onSelect(em); onClose(); }}
                className="w-10 h-10 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent', fontSize: 22 }}
              >
                <span style={{ lineHeight: 1 }}>{em}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return ReactDOM.createPortal(popup, document.body);
}

// ===================================================================
// EMOJI PICKER SHEET
// ===================================================================
const EMOJI_GRID = [
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
  '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛',
  '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤔', '🤨',
  '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '😮',
  '😯', '😲', '😳', '🥺', '😢', '😭', '😱', '😖',
  '😤', '😠', '😡', '🤬', '😨', '😰', '😥', '😓',
  '🤝', '🙏', '👍', '👎', '👏', '💪', '👀', '🧠',
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
  '💯', '🔥', '✨', '🎉', '🎯', '📚', '📝', '🔬',
];

export function EmojiPickerSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) setMounted(true);
    else {
      const t = setTimeout(() => setMounted(false), 260);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[11800] flex items-end sm:items-center justify-center"
          initial={{ background: 'rgba(0,0,0,0)' }}
          animate={{ background: 'rgba(0,0,0,0.5)' }}
          exit={{ background: 'rgba(0,0,0,0)' }}
          onClick={onClose}
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              maxHeight: '60vh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-white/[0.06]">
              <h3
                className="text-white text-[15px]"
                style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
              >
                Emoji auswählen
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>
            <div className="overflow-y-auto p-3 grid grid-cols-8 gap-1.5 scrollbar-hide">
              {EMOJI_GRID.map((em) => (
                <button
                  key={em}
                  onClick={() => { onSelect(em); }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center active:scale-90 transition-transform active:bg-white/[0.06]"
                  style={{ WebkitTapHighlightColor: 'transparent', fontSize: 22 }}
                >
                  <span style={{ lineHeight: 1 }}>{em}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(node, document.body) : null;
}

// ===================================================================
// INLINE REACTION BADGES (below message)
// ===================================================================
export function MessageReactions({
  reactions,
  selfId = 'student',
  onOpen,
  align = 'start',
}: {
  reactions?: ChatReaction[];
  selfId?: string;
  /** Tap opens the reactors sheet (who reacted, grouped by emoji). */
  onOpen: (initialEmoji?: string) => void;
  align?: 'start' | 'end';
}) {
  if (!reactions || reactions.length === 0) return null;
  return (
    <div
      className={`flex flex-wrap gap-1 mt-1 ${align === 'end' ? 'justify-end' : 'justify-start'}`}
    >
      {reactions.map((r) => {
        const mine = r.memberIds.includes(selfId);
        return (
          <button
            key={r.emoji}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(r.emoji);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full active:scale-95 transition-transform"
            style={{
              background: mine ? 'rgba(0,212,170,0.14)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${mine ? 'rgba(0,212,170,0.35)' : 'rgba(255,255,255,0.08)'}`,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: 13, lineHeight: 1 }}>{r.emoji}</span>
            <span
              className="text-[11px]"
              style={{
                fontFamily: ff,
                fontWeight: 600,
                color: mine ? '#00D4AA' : 'rgba(255,255,255,0.55)',
              }}
            >
              {r.memberIds.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ===================================================================
// REACTORS SHEET — shows "who reacted with what" grouped by emoji
// ===================================================================
export function ReactorsSheet({
  isOpen,
  onClose,
  reactions,
  resolveMember,
  selfId = 'student',
  onRemoveSelf,
  initialEmoji,
}: {
  isOpen: boolean;
  onClose: () => void;
  reactions: ChatReaction[];
  /** Return display info for a given memberId. Parent supplies this because
   *  1:1 rooms resolve differently (teacher name/avatar) than group rooms. */
  resolveMember: (memberId: string) => { name: string; avatar?: string; isSelf?: boolean };
  selfId?: string;
  /** Called when the current user taps their own entry to remove that reaction. */
  onRemoveSelf: (emoji: string) => void;
  /** Preselected emoji tab when the sheet opens. */
  initialEmoji?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [activeEmoji, setActiveEmoji] = useState<string | 'all'>('all');

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setActiveEmoji(initialEmoji ?? 'all');
    } else {
      const t = setTimeout(() => setMounted(false), 240);
      return () => clearTimeout(t);
    }
  }, [isOpen, initialEmoji]);

  const totalCount = useMemo(
    () => reactions.reduce((sum, r) => sum + r.memberIds.length, 0),
    [reactions],
  );

  const visibleEntries = useMemo(() => {
    const list: { emoji: string; memberId: string }[] = [];
    reactions.forEach((r) => {
      if (activeEmoji !== 'all' && r.emoji !== activeEmoji) return;
      r.memberIds.forEach((mid) => list.push({ emoji: r.emoji, memberId: mid }));
    });
    // Put self on top so removing is easy to find
    list.sort((a, b) => {
      const aSelf = a.memberId === selfId ? 0 : 1;
      const bSelf = b.memberId === selfId ? 0 : 1;
      return aSelf - bSelf;
    });
    return list;
  }, [reactions, activeEmoji, selfId]);

  if (!mounted) return null;

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[11900] flex items-end sm:items-center justify-center"
          initial={{ background: 'rgba(0,0,0,0)' }}
          animate={{ background: 'rgba(0,0,0,0.55)' }}
          exit={{ background: 'rgba(0,0,0,0)' }}
          onClick={onClose}
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)',
              border: '1px solid rgba(255,255,255,0.10)',
              maxHeight: '70vh',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
          >
            <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-white/[0.06]">
              <h3
                className="text-white text-[15px]"
                style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
              >
                Reaktionen
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] active:scale-95 transition-transform"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Emoji tabs */}
            <div
              className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto scrollbar-hide border-b border-white/[0.04]"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <button
                onClick={() => setActiveEmoji('all')}
                className="shrink-0 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                style={{
                  background: activeEmoji === 'all' ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeEmoji === 'all' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span
                  className="text-[12px]"
                  style={{
                    fontFamily: ff,
                    fontWeight: 600,
                    color: activeEmoji === 'all' ? 'white' : 'rgba(255,255,255,0.55)',
                  }}
                >
                  Alle {totalCount}
                </span>
              </button>
              {reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => setActiveEmoji(r.emoji)}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                  style={{
                    background: activeEmoji === r.emoji ? 'rgba(0,212,170,0.14)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${activeEmoji === r.emoji ? 'rgba(0,212,170,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{r.emoji}</span>
                  <span
                    className="text-[12px]"
                    style={{
                      fontFamily: ff,
                      fontWeight: 600,
                      color: activeEmoji === r.emoji ? '#00D4AA' : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {r.memberIds.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Reactor list */}
            <div className="flex-1 overflow-y-auto px-2 py-2 min-h-0 scrollbar-hide">
              {visibleEntries.length === 0 ? (
                <p
                  className="text-white/35 text-[13px] text-center py-8"
                  style={{ fontFamily: ff }}
                >
                  Noch keine Reaktionen
                </p>
              ) : (
                visibleEntries.map((entry) => {
                  const info = resolveMember(entry.memberId);
                  const isSelf = entry.memberId === selfId || info.isSelf;
                  return (
                    <button
                      key={`${entry.emoji}-${entry.memberId}`}
                      onClick={() => {
                        if (isSelf) onRemoveSelf(entry.emoji);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors active:bg-white/[0.04] text-left"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {info.avatar ? (
                        <img
                          src={info.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          style={{ border: '2px solid rgba(255,255,255,0.06)' }}
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '2px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <span
                            className="text-white/60 text-[13px]"
                            style={{ fontFamily: ff, fontWeight: 600 }}
                          >
                            {info.name.slice(0, 1)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="text-white text-[14px] truncate"
                            style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
                          >
                            {info.name}
                          </span>
                          {isSelf && (
                            <span
                              className="text-[10px]"
                              style={{
                                fontFamily: ff,
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.35)',
                              }}
                            >
                              (Du)
                            </span>
                          )}
                        </div>
                        {isSelf && (
                          <p
                            className="text-white/35 text-[11px] mt-0.5"
                            style={{ fontFamily: ff }}
                          >
                            Tippen, um Reaktion zu entfernen
                          </p>
                        )}
                      </div>
                      <span
                        className="text-[20px] flex-shrink-0"
                        style={{ lineHeight: 1 }}
                      >
                        {entry.emoji}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? ReactDOM.createPortal(node, document.body) : null;
}
