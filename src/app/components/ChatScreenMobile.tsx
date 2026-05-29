// ===== SOSTUDY CHAT MOBILE - PREMIUM DESIGN =====
// Ultra-modern mobile chat on #0a0a0a background
// No hover: effects, only active: states
// v3 – Phase 4: error states, rate limit, loading states

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  Send,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Sparkles,
  Search,
  Bot,
  BookOpen,
  GraduationCap,
  FileText,
  Lightbulb,
  AlertCircle,
  RefreshCw,
  Loader2,
  ChevronUp,
  Clock,
  MoreVertical,
  Archive,
  Trash2,
} from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useAiChat } from '@/hooks/useAiChat';
import type { ChatMessage } from '@/mocks/chatMocks';
import type { AiChatMessage, AiChat } from '@/hooks/useAiChat';
import type { AiSuggestedAction } from '@/hooks/useAiChat';
import { AI_SUBJECTS } from '@/hooks/useAiChat';
import { ChatHistoryPanel } from './ChatHistoryPanel';
import {
  useChatFeatures,
  UploadSheet,
  AttachmentPreviewBar,
  ChatSettingsSheet,
  MuteDurationSheet,
  ReportModal,
  BlockConfirmation,
  MediaGallerySheet,
  MuteBanner,
  BlockedBar,
} from './ChatFeatureOverlays';
import { MessageAttachments } from './ChatMessageAttachments';
import ExtraSessionRequestCard from './ExtraSessionRequestCard';
import type { ChatAttachment as ChatAttachmentType, ChatRoom } from '@/mocks/chatMocks';
import {
  GroupAvatar,
  GroupMembersSheet,
  MessageReactionBar,
  MessageReactions,
  EmojiPickerSheet,
  ReactorsSheet,
} from './ChatGroupComponents';
import type { ChatReaction } from '@/mocks/chatMocks';
import { useUser } from '@/contexts/UserContext';
import { Lock } from 'lucide-react';

const ff = "Poppins, -apple-system, 'Inter', BlinkMacSystemFont, sans-serif";

const AI_ASSISTANT_ID = 'ai-assistant';

// ===== HELPERS =====
function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatRoomTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Jetzt';
  if (mins < 60) return `${mins} Min`;
  if (hours < 24) return `${hours} Std`;
  if (days === 1) return 'Gestern';
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
}

// Per-sender accent color (WhatsApp-style) — deterministic from senderId so
// every participant gets a stable, distinct hue without implying role/rank.
const SENDER_COLORS = [
  '#FF9F7A', '#7ABCFF', '#9B87FF', '#F5A3D0', '#FFC66B',
  '#62D4A1', '#7FD2F0', '#F48FB1', '#C6A5FF', '#A3E4B8',
];
function getSenderColor(senderId: string): string {
  let hash = 0;
  for (let i = 0; i < senderId.length; i++) {
    hash = (hash * 31 + senderId.charCodeAt(i)) | 0;
  }
  return SENDER_COLORS[Math.abs(hash) % SENDER_COLORS.length];
}

// Map suggestedAction.type → icon (per API spec)
function getActionIcon(type: AiSuggestedAction['type']) {
  switch (type) {
    case 'flashcards': return BookOpen;
    case 'exam': return GraduationCap;
    case 'summary': return FileText;
    case 'explanation': return Lightbulb;
    default: return Sparkles;
  }
}

interface ChatScreenMobileProps {
  onClose: () => void;
  onOpenTeacherProfile?: (teacherId: string) => void;
  onOpenTutoringActivation?: () => void;
}

export default React.memo(function ChatScreenMobile({ onClose, onOpenTeacherProfile, onOpenTutoringActivation }: ChatScreenMobileProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { chatRooms, messages, isSending, isTyping, messagesEndRef, sendMessage, clearUnread, toggleReaction } = useChat(selectedRoomId || undefined);

  // Group + reaction + emoji UI state
  const [showMembersSheet, setShowMembersSheet] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionAnchor, setReactionAnchor] = useState<{ messageId: string; x: number; y: number; alignRight?: boolean } | null>(null);
  const [reactorsSheet, setReactorsSheet] = useState<{ messageId: string; reactions: ChatReaction[]; initialEmoji?: string } | null>(null);
  const aiChat = useAiChat();
  const { tutoringStatus } = useUser();
  const isTutoringLocked = tutoringStatus !== 'activated';
  const [aiMessageText, setAiMessageText] = useState('');
  const [showAiUploadSheet, setShowAiUploadSheet] = useState(false);
  const [deleteConfirmChatId, setDeleteConfirmChatId] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const chatFeatures = useChatFeatures();
  const aiInputRef = useRef<HTMLTextAreaElement>(null);

  // Filter rooms by search query
  const filteredRooms = searchQuery.trim()
    ? chatRooms.filter(room =>
        room.participantName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatRooms;

  const isAiSelected = selectedRoomId === AI_ASSISTANT_ID;

  // Show AI entry in search results
  const showAiEntry = !searchQuery.trim() || 'dein lernassistent'.includes(searchQuery.toLowerCase()) || 'ki'.includes(searchQuery.toLowerCase()) || 'ai'.includes(searchQuery.toLowerCase());

  useEffect(() => {
    if (selectedRoomId) {
      clearUnread(selectedRoomId);
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 150);
      }
    }
  }, [selectedRoomId, clearUnread]);

  const handleSendMessage = async () => {
    const hasText = messageText.trim().length > 0;
    const hasAttachments = chatFeatures.attachments.length > 0;
    if ((!hasText && !hasAttachments) || isSending) return;
    // Convert ChatFeatureOverlay attachments to ChatAttachment type
    const attachmentsToSend: ChatAttachmentType[] | undefined = hasAttachments
      ? chatFeatures.attachments.map(a => ({
          id: a.id,
          type: a.type === 'audio' ? 'document' as const : a.type,
          name: a.name,
          size: a.size,
          url: a.url,
          thumbnail: a.thumbnail,
        }))
      : undefined;
    await sendMessage(messageText, 'text', attachmentsToSend);
    setMessageText('');
    chatFeatures.clearAttachments();
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  // ===== ROOM LIST =====
  if (!selectedRoomId) {
    return (
      <div
        className="relative w-full h-full flex flex-col pt-safe"
        style={{ background: '#0a0a0a', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between"
          style={{
            height: '60px',
            padding: '0 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <button
            onClick={onClose}
            className="active:scale-95 active:opacity-60 transition-all"
            style={{ WebkitTapHighlightColor: 'transparent', marginLeft: '-6px' }}
          >
            <ChevronLeft className="w-7 h-7 text-white" strokeWidth={2} />
          </button>

          <h1
            className="text-white text-[18px]"
            style={{ fontFamily: ff, fontWeight: 700, letterSpacing: '-0.4px' }}
          >
            Nachrichten
          </h1>

          {/* Spacer to keep title centered */}
          <div className="w-8 h-8" />
        </div>

        {/* Search Bar */}
        <div className="flex-shrink-0 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Search className="w-4 h-4 text-white/25 flex-shrink-0" strokeWidth={2} />
            <input
              type="text"
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white text-[14px] outline-none placeholder:text-white/20 min-w-0"
              style={{ fontFamily: ff, WebkitTapHighlightColor: 'transparent' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-white/30 text-[12px] active:opacity-60 transition-opacity"
                style={{ fontFamily: ff, WebkitTapHighlightColor: 'transparent' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Room List */}
        <div
          className="flex-1 overflow-y-auto"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 20px)' }}
        >
          {filteredRooms.length === 0 && !showAiEntry ? (
            <div className="flex flex-col items-center justify-center py-24 px-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.08) 0%, rgba(0, 212, 170, 0.02) 100%)',
                  border: '1px solid rgba(0, 212, 170, 0.1)',
                }}
              >
                {searchQuery.trim()
                  ? <Search className="w-7 h-7 text-[#00D4AA]/30" strokeWidth={1.5} />
                  : <Sparkles className="w-7 h-7 text-[#00D4AA]/30" strokeWidth={1.5} />
                }
              </div>
              <p
                className="text-white/40 text-[15px] mb-1"
                style={{ fontFamily: ff, fontWeight: 600 }}
              >
                {searchQuery.trim() ? 'Keine Ergebnisse' : 'Keine Nachrichten'}
              </p>
              <p
                className="text-white/20 text-[13px] text-center"
                style={{ fontFamily: ff, lineHeight: '1.5' }}
              >
                {searchQuery.trim()
                  ? `Kein Chat für „${searchQuery}" gefunden`
                  : 'Starte eine Unterhaltung mit deinen Lehrern'
                }
              </p>
            </div>
          ) : (
            <>
              {/* AI Assistant Entry – always pinned at top */}
              {showAiEntry && (
                <button
                  onClick={() => setSelectedRoomId(AI_ASSISTANT_ID)}
                  className="w-full text-left active:bg-white/[0.04] transition-colors"
                  style={{
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {/* AI Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 150, 120, 0.10) 100%)',
                        border: '2px solid rgba(0, 212, 170, 0.12)',
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-[#00D4AA]/70" strokeWidth={2} />
                    </div>
                    <div
                      className="absolute -bottom-0.5 -right-0.5"
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: '#00D4AA',
                        border: '3px solid #0a0a0a',
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3
                          className="text-white text-[15px] truncate"
                          style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
                        >
                          Dein Lernassistent
                        </h3>
                        <span
                          className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            fontFamily: ff,
                            fontWeight: 600,
                            color: '#00D4AA',
                            background: 'rgba(0, 212, 170, 0.10)',
                            border: '1px solid rgba(0, 212, 170, 0.15)',
                            letterSpacing: '0.3px',
                          }}
                        >
                          KI
                        </span>
                      </div>
                    </div>
                    <p className="text-white/35 text-[13px] truncate" style={{ fontFamily: ff }}>
                      Frag mich alles zum Lernen...
                    </p>
                  </div>
                </button>
              )}

              {/* Separator */}
              {showAiEntry && filteredRooms.length > 0 && (
                <div className="mx-5" style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />
              )}

              {/* Regular rooms – blurred/locked when tutoring not activated */}
              <div className="relative">
                <div style={{ filter: isTutoringLocked ? 'blur(6px)' : 'none', pointerEvents: isTutoringLocked ? 'none' : 'auto', opacity: isTutoringLocked ? 0.5 : 1 }}>
                  {filteredRooms.map((room) => {
                    const isGroup = room.kind === 'group';
                    const onlineMembers = isGroup && room.members
                      ? room.members.filter((m) => m.isOnline).length
                      : 0;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className="w-full active:bg-white/[0.04] transition-colors"
                        style={{
                          padding: '14px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          WebkitTapHighlightColor: 'transparent',
                        }}
                      >
                        {/* Avatar — group or 1:1 */}
                        {isGroup && room.members ? (
                          <GroupAvatar members={room.members} size={52} />
                        ) : (
                          <div className="relative shrink-0">
                            <img
                              src={room.participantAvatar}
                              alt={room.participantName}
                              className="w-[52px] h-[52px] rounded-full object-cover"
                              style={{ border: '2px solid rgba(255,255,255,0.06)' }}
                            />
                            {room.isOnline && (
                              <div
                                className="absolute -bottom-0.5 -right-0.5"
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '50%',
                                  background: '#00D4AA',
                                  border: '3px solid #0a0a0a',
                                }}
                              />
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3
                              className="text-white text-[15px] truncate min-w-0"
                              style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
                            >
                              {isGroup ? (room.groupName ?? room.participantName) : room.participantName}
                            </h3>
                            <span
                              className="text-white/30 text-[11px] shrink-0 ml-2"
                              style={{ fontFamily: ff, fontWeight: 500 }}
                            >
                              {formatRoomTime(room.lastMessageTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <p
                                className="text-white/35 text-[13px] truncate"
                                style={{ fontFamily: ff }}
                              >
                                {room.lastMessage}
                              </p>
                            </div>
                            {room.unreadCount > 0 && (
                              <div
                                className="flex items-center justify-center shrink-0"
                                style={{
                                  minWidth: '20px',
                                  height: '20px',
                                  borderRadius: '10px',
                                  background: 'linear-gradient(135deg, #00D4AA 0%, #00A87D 100%)',
                                  padding: '0 6px',
                                }}
                              >
                                <span
                                  className="text-white text-[10px]"
                                  style={{ fontFamily: ff, fontWeight: 700 }}
                                >
                                  {room.unreadCount}
                                </span>
                              </div>
                            )}
                          </div>
                          {isGroup && (
                            <p
                              className="text-white/25 text-[11px] mt-1"
                              style={{ fontFamily: ff }}
                            >
                              {room.members?.length ?? 0} Mitglieder · {onlineMembers} online
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isTutoringLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ pointerEvents: 'auto' }}>
                    <Lock className="w-5 h-5 text-white/30 mb-2" />
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40 text-center px-8 mb-4">
                      {tutoringStatus === 'requestSent'
                        ? 'Deine Anfrage wurde eingereicht. Du wirst benachrichtigt, sobald die Nachhilfe freigeschaltet ist.'
                        : 'Aktiviere Nachhilfe, um mit deinen Lehrern zu chatten.'}
                    </p>
                    {tutoringStatus === 'requestSent' ? (
                      <div
                        className="px-5 py-2.5 rounded-xl flex items-center gap-2"
                        style={{
                          background: 'rgba(255,184,77,0.07)',
                          border: '1px solid rgba(255,184,77,0.2)',
                        }}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#FFB84D]" strokeWidth={2} />
                        <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#FFB84D]">
                          Anfrage gesendet
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={onOpenTutoringActivation}
                        className="px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]"
                        style={{
                          background: 'rgba(0,184,148,0.07)',
                          border: '1px solid rgba(0,184,148,0.25)',
                        }}
                      >
                        <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#00B894]">
                          Nachhilfe aktivieren
                        </span>
                      </button>
                    )}
                    {tutoringStatus === 'requestSent' && (
                      <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 mt-3 text-center">
                        Dies kann bis zu 48 Stunden dauern.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ===== THREAD VIEW =====
  const currentRoom = chatRooms.find(room => room.id === selectedRoomId);

  // ===== AI ASSISTANT WELCOME (Mobile) =====
  if (isAiSelected) {
    const handleAiSendMobile = async (text?: string) => {
      const msg = text || aiMessageText;
      if (!msg.trim() || aiChat.isSending) return;
      if (!text) {
        setAiMessageText('');
        if (aiInputRef.current) aiInputRef.current.style.height = 'auto';
      }
      await aiChat.sendMessage(msg, aiChat.selectedSubject || undefined);
    };

    return (
      <>
      <div
        className="relative w-full h-full flex flex-col pt-safe"
        style={{ background: '#0a0a0a', WebkitOverflowScrolling: 'touch' }}
      >
        {/* AI Header */}
        <div
          className="flex-shrink-0 flex items-center gap-2"
          style={{
            height: '64px',
            padding: '0 16px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)',
          }}
        >
          <button
            onClick={() => setSelectedRoomId(null)}
            className="active:scale-90 active:opacity-60 transition-all shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent', marginLeft: '-4px' }}
          >
            <ChevronLeft className="w-7 h-7 text-white" strokeWidth={2} />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 150, 120, 0.10) 100%)',
                  border: '2px solid rgba(0, 212, 170, 0.2)',
                }}
              >
                <Sparkles className="w-[18px] h-[18px] text-[#00D4AA]/70" strokeWidth={2} />
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5"
                style={{
                  width: '11px',
                  height: '11px',
                  borderRadius: '50%',
                  background: '#00D4AA',
                  border: '2.5px solid #0a0a0a',
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2
                  className="text-white text-[16px] truncate"
                  style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.3px' }}
                >
                  Lernassistent
                </h2>
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full shrink-0"
                  style={{
                    fontFamily: ff,
                    fontWeight: 600,
                    color: '#00D4AA',
                    background: 'rgba(0, 212, 170, 0.10)',
                    border: '1px solid rgba(0, 212, 170, 0.15)',
                    letterSpacing: '0.3px',
                  }}
                >
                  KI
                </span>
              </div>
              <p className="text-white/35 text-[12px]" style={{ fontFamily: ff }}>
                {aiChat.isTyping ? (
                  <span className="text-[#00D4AA]">denkt nach...</span>
                ) : 'Immer verfügbar'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Chat History toggle */}
            <button
              onClick={() => aiChat.setShowChatHistory(true)}
              className="w-9 h-9 rounded-lg flex items-center justify-center active:scale-90 transition-all"
              style={{
                border: aiChat.showChatHistory
                  ? '1px solid rgba(0, 212, 170, 0.2)'
                  : '1px solid rgba(255,255,255,0.06)',
                background: aiChat.showChatHistory ? 'rgba(0, 212, 170, 0.06)' : 'transparent',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Clock
                className="w-4 h-4"
                strokeWidth={2}
                style={{ color: aiChat.showChatHistory ? '#00D4AA' : 'rgba(255,255,255,0.35)' }}
              />
            </button>

            {/* Current chat menu (archive/delete) */}
            {aiChat.hasMessages && aiChat.chatId && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="w-9 h-9 rounded-lg flex items-center justify-center active:scale-90 transition-all"
                style={{
                  border: '1px solid rgba(255,255,255,0.06)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <MoreVertical className="w-4 h-4 text-white/35" strokeWidth={2} />
              </button>
            )}


          </div>
        </div>

        {/* Mobile Menu Sheet (archive/delete current chat) */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-shrink-0 overflow-hidden"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.015)' }}>
                <button
                  onClick={() => {
                    if (aiChat.chatId) aiChat.archiveChat(aiChat.chatId);
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl active:scale-95 transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Archive className="w-3.5 h-3.5 text-white/35" strokeWidth={2} />
                  <span className="text-white/50 text-[12px]" style={{ fontFamily: ff, fontWeight: 500 }}>
                    Archivieren
                  </span>
                </button>
                <button
                  onClick={() => {
                    setDeleteConfirmChatId(aiChat.chatId);
                    setShowMobileMenu(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl active:scale-95 transition-all"
                  style={{
                    background: 'rgba(255, 80, 80, 0.04)',
                    border: '1px solid rgba(255, 80, 80, 0.1)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" strokeWidth={2} style={{ color: 'rgba(255, 80, 80, 0.6)' }} />
                  <span className="text-[12px]" style={{ fontFamily: ff, fontWeight: 500, color: 'rgba(255, 80, 80, 0.7)' }}>
                    Löschen
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat History Side-Panel (ChatGPT-style, slides from right) */}
        <ChatHistoryPanel
          isOpen={aiChat.showChatHistory}
          onClose={() => aiChat.setShowChatHistory(false)}
          pastChats={aiChat.pastChats}
          activeChatId={aiChat.chatId}
          onSelectChat={(chatId) => aiChat.selectChat(chatId)}
          onNewChat={() => aiChat.clearChat()}
          onDeleteChat={(chatId) => setDeleteConfirmChatId(chatId)}
        />

        {/* Chat Content Area */}
        <div
          className="flex-1 overflow-y-auto min-h-0"
          style={{ padding: '16px 14px' }}
        >
          {aiChat.isLoadingHistory ? (
            /* Skeleton Loader */
            <div className="flex flex-col gap-4 py-4 animate-pulse">
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="w-[65%]">
                  <div className="rounded-2xl px-3.5 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.04)', width: '90%' }} />
                    <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.03)', width: '50%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2 flex-row-reverse">
                <div className="w-[50%]">
                  <div className="rounded-2xl px-3.5 py-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', width: '70%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }} />
                <div className="w-[60%]">
                  <div className="rounded-2xl px-3.5 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-3 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.04)', width: '85%' }} />
                    <div className="h-3 rounded-full" style={{ background: 'rgba(255,255,255,0.03)', width: '45%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : !aiChat.hasMessages ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center h-full">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.10) 0%, rgba(0, 212, 170, 0.03) 100%)',
                  border: '1px solid rgba(0, 212, 170, 0.12)',
                }}
              >
                <Sparkles className="w-9 h-9 text-[#00D4AA]/50" strokeWidth={1.5} />
              </div>
              <h3
                className="text-white text-[17px] mb-2 text-center"
                style={{ fontFamily: ff, fontWeight: 700, letterSpacing: '-0.4px' }}
              >
                Dein persönlicher Lernassistent
              </h3>
              <p
                className="text-white/35 text-[13px] max-w-[320px] text-center mb-8"
                style={{ fontFamily: ff, lineHeight: '1.6' }}
              >
                Ich helfe dir beim Lernen, erkläre schwierige Themen und unterstütze dich bei der Prüfungsvorbereitung.
              </p>

              {/* Quick Prompts */}
              <div className="flex flex-col gap-2.5 w-full max-w-[360px]">
                {[
                  { icon: BookOpen, text: 'Erkläre mir die Mitternachtsformel' },
                  { icon: GraduationCap, text: 'Worin bin ich aktuell am schwächsten?' },
                  { icon: Sparkles, text: 'Erstelle mir Lernkarten für Bruchrechnung' },
                  { icon: Bot, text: 'Bereite mich auf meine nächste Mathe-Prüfung vor' },
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAiSendMobile(prompt.text)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left active:bg-white/[0.04] transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <prompt.icon className="w-4 h-4 text-[#00D4AA]/40 shrink-0" strokeWidth={2} />
                    <span
                      className="text-white/50 text-[13px]"
                      style={{ fontFamily: ff }}
                    >
                      {prompt.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Thread */
            <div className="space-y-0.5">
              {/* Load Older Messages (API: hasMore from GET /v1/.../history) */}
              {aiChat.hasMore && (
                <div className="flex justify-center pb-4">
                  <button
                    onClick={aiChat.loadOlderMessages}
                    disabled={aiChat.isLoadingOlder}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl active:bg-white/[0.04] transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {aiChat.isLoadingOlder ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-white/30 animate-spin" strokeWidth={2} />
                        <span
                          className="text-white/30 text-[12px]"
                          style={{ fontFamily: ff, fontWeight: 500 }}
                        >
                          Wird geladen...
                        </span>
                      </>
                    ) : (
                      <>
                        <ChevronUp className="w-3.5 h-3.5 text-white/30" strokeWidth={2} />
                        <span
                          className="text-white/30 text-[12px]"
                          style={{ fontFamily: ff, fontWeight: 500 }}
                        >
                          Ältere Nachrichten laden
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {aiChat.messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isConsecutive = index > 0 && aiChat.messages[index - 1].role === msg.role;
                const isLast = index === aiChat.messages.length - 1 || aiChat.messages[index + 1]?.role !== msg.role;

                return (
                  <MobileAiMessageBubble
                    key={msg.id}
                    message={msg}
                    isUser={isUser}
                    isConsecutive={isConsecutive}
                    isLast={isLast}
                  />
                );
              })}

              {/* AI Typing Indicator */}
              <AnimatePresence>
                {aiChat.isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex items-end gap-2 pt-3"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 150, 120, 0.10) 100%)',
                        border: '1.5px solid rgba(0, 212, 170, 0.15)',
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00D4AA]/60" strokeWidth={2} />
                    </div>
                    <div
                      className="rounded-2xl px-4 py-3"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderBottomLeftRadius: '6px',
                      }}
                    >
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: 'rgba(0, 212, 170, 0.6)',
                            }}
                            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                            transition={{
                              duration: 1.4,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={aiChat.messagesEndRef} />
            </div>
          )}
        </div>

        {/* Error & Rate Limit Banners */}
        <AnimatePresence>
          {aiChat.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex-shrink-0 px-3.5 overflow-hidden"
            >
              <div
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-1"
                style={{
                  background: aiChat.isRateLimited
                    ? 'rgba(255, 180, 50, 0.06)'
                    : 'rgba(255, 80, 80, 0.06)',
                  border: aiChat.isRateLimited
                    ? '1px solid rgba(255, 180, 50, 0.15)'
                    : '1px solid rgba(255, 80, 80, 0.15)',
                }}
              >
                <AlertCircle
                  className="w-4 h-4 shrink-0"
                  strokeWidth={2}
                  style={{
                    color: aiChat.isRateLimited
                      ? 'rgba(255, 180, 50, 0.7)'
                      : 'rgba(255, 80, 80, 0.7)',
                  }}
                />
                <span
                  className="flex-1 text-[11px]"
                  style={{
                    fontFamily: ff,
                    fontWeight: 500,
                    color: aiChat.isRateLimited
                      ? 'rgba(255, 180, 50, 0.8)'
                      : 'rgba(255, 80, 80, 0.8)',
                  }}
                >
                  {aiChat.error.message}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {(aiChat.error.type === 'send_failed' || aiChat.error.type === 'network') && (
                    <button
                      onClick={aiChat.retryLastMessage}
                      className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-all"
                      style={{
                        border: '1px solid rgba(255, 80, 80, 0.2)',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <RefreshCw className="w-3 h-3 text-white/40" strokeWidth={2} />
                    </button>
                  )}
                  <button
                    onClick={aiChat.dismissError}
                    className="w-6 h-6 rounded-full flex items-center justify-center active:scale-90 transition-all"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    <span className="text-white/30 text-[14px]">✕</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rate Limit Info (API: GET /v1/.../rate-limit/:userId) */}
        {aiChat.hasMessages && aiChat.rateLimit.remainingDay <= 20 && !aiChat.isRateLimited && (
          <div className="flex-shrink-0 px-3.5">
            <div className="flex items-center justify-center py-1">
              <span
                className="text-[10px]"
                style={{
                  fontFamily: ff,
                  fontWeight: 500,
                  color: aiChat.rateLimit.remainingDay <= 5
                    ? 'rgba(255, 180, 50, 0.5)'
                    : 'rgba(255,255,255,0.15)',
                }}
              >
                Heute verbleiben dir noch {aiChat.rateLimit.remainingDay} Nachrichten
              </span>
            </div>
          </div>
        )}

        {/* AI Input Bar */}
        <div
          className="flex-shrink-0"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(255,255,255,0.015)',
            padding: '10px 14px',
            paddingBottom: 'max(env(safe-area-inset-bottom, 10px), 10px)',
          }}
        >
          {/* Subject Selector (optional, API: subject param) */}
          <div
            className="flex items-center gap-1.5 mb-2.5 overflow-x-auto scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <span
              className="text-white/25 text-[11px] shrink-0 mr-0.5"
              style={{ fontFamily: ff, fontWeight: 500 }}
            >
              Fach:
            </span>
            {AI_SUBJECTS.map((subject) => {
              const isActive = aiChat.selectedSubject === subject;
              return (
                <button
                  key={subject}
                  onClick={() => aiChat.setSelectedSubject(isActive ? null : subject)}
                  className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] active:scale-95 transition-all"
                  style={{
                    fontFamily: ff,
                    fontWeight: 500,
                    color: isActive ? '#00D4AA' : 'rgba(255,255,255,0.35)',
                    background: isActive ? 'rgba(0, 212, 170, 0.08)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(0, 212, 170, 0.2)'
                      : '1px solid rgba(255,255,255,0.06)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {subject}
                </button>
              );
            })}
          </div>

          <div className="flex items-end gap-2.5">
            {/* Attachment */}
            <button
              onClick={() => setShowAiUploadSheet(true)}
              className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 active:bg-white/[0.08] transition-all flex-shrink-0 mb-0.5"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Plus className="w-4 h-4 text-white/40" strokeWidth={2} />
            </button>

            {/* Input */}
            <div
              className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-2.5 min-w-0 transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <textarea
                ref={aiInputRef}
                value={aiMessageText}
                onChange={(e) => {
                  setAiMessageText(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAiSendMobile();
                  }
                }}
                placeholder="Frag mich etwas..."
                className="flex-1 bg-transparent text-white resize-none outline-none min-w-0 placeholder:text-white/20 scrollbar-thin"
                style={{
                  fontFamily: ff,
                  fontSize: '16px',
                  lineHeight: '22px',
                  maxHeight: '100px',
                  minHeight: '22px',
                }}
                rows={1}
              />
            </div>

            {/* Send */}
            <button
              onClick={() => handleAiSendMobile()}
              disabled={!aiMessageText.trim() || aiChat.isSending}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all mb-0.5"
              style={{
                background: aiMessageText.trim()
                  ? 'rgba(255,255,255,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: aiMessageText.trim()
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1px solid rgba(255,255,255,0.06)',
                opacity: aiMessageText.trim() ? 1 : 0.5,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <ArrowUpRight className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
      <UploadSheet
        isOpen={showAiUploadSheet}
        onClose={() => setShowAiUploadSheet(false)}
        onAttach={() => {}}
      />
      </>
    );
  }

  return (
    <div
      className="relative w-full h-full flex flex-col pt-safe"
      style={{ background: '#0a0a0a', WebkitOverflowScrolling: 'touch' }}
    >
      {/* Thread Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between gap-3"
        style={{
          height: '64px',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        {/* Back + User */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={() => setSelectedRoomId(null)}
            className="active:scale-90 active:opacity-60 transition-all shrink-0"
            style={{ WebkitTapHighlightColor: 'transparent', marginLeft: '-4px' }}
          >
            <ChevronLeft className="w-7 h-7 text-white" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentRoom?.kind === 'group' && currentRoom.members ? (
              <GroupAvatar members={currentRoom.members} size={40} />
            ) : (
              <div className="relative shrink-0">
                <img
                  src={currentRoom?.participantAvatar}
                  alt={currentRoom?.participantName}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '2px solid rgba(255,255,255,0.06)' }}
                />
                {currentRoom?.isOnline && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5"
                    style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      background: '#00D4AA',
                      border: '2.5px solid #0a0a0a',
                    }}
                  />
                )}
              </div>
            )}
            <button
              className="min-w-0 text-left active:opacity-70 transition-opacity"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              onClick={() => {
                if (!currentRoom) return;
                if (currentRoom.kind === 'group') {
                  setShowMembersSheet(true);
                } else if (onOpenTeacherProfile) {
                  onOpenTeacherProfile(currentRoom.id);
                }
              }}
            >
              <div className="flex items-center gap-1.5">
                <h2
                  className="text-white text-[16px] truncate"
                  style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.3px' }}
                >
                  {currentRoom?.kind === 'group'
                    ? (currentRoom.groupName ?? currentRoom.participantName)
                    : currentRoom?.participantName}
                </h2>
              </div>
              {isTyping ? (
                <p
                  className="text-[#00D4AA] text-[12px]"
                  style={{ fontFamily: ff }}
                >
                  schreibt...
                </p>
              ) : currentRoom?.kind === 'group' ? (
                <p
                  className="text-white/35 text-[12px]"
                  style={{ fontFamily: ff }}
                >
                  {(currentRoom.members?.filter((m) => m.isOnline).length ?? 0)} online · {currentRoom.members?.length ?? 0} Mitglieder
                </p>
              ) : (
                <p
                  className="text-white/35 text-[12px]"
                  style={{ fontFamily: ff }}
                >
                  {currentRoom?.isOnline ? 'Online' : 'Offline'}
                </p>
              )}
            </button>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => chatFeatures.setShowSettingsSheet(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 active:bg-white/[0.08] transition-all flex-shrink-0"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <MoreVertical className="w-5 h-5 text-white/40" strokeWidth={2} />
        </button>
      </div>

      {/* Mute Banner */}
      {chatFeatures.isMuted && (
        <MuteBanner onUnmute={() => chatFeatures.setIsMuted(false)} />
      )}

      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto min-h-0"
        style={{ padding: '16px 14px' }}
      >
        {/* Date Separator */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <span
            className="text-[11px] text-white/30 px-2 shrink-0"
            style={{ fontFamily: ff, fontWeight: 500 }}
          >
            Heute
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>

        {/* Messages */}
        <div className="space-y-0.5">
          {messages.map((message, index) => {
            const isStudent = message.senderId === 'student';
            const isConsecutive = index > 0 && messages[index - 1].senderId === message.senderId;
            const isLast = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;
            const isGroup = currentRoom?.kind === 'group';
            const senderAvatar = message.senderAvatar || currentRoom?.participantAvatar;

            return (
              <MobileMessageBubble
                key={message.id}
                message={message}
                isStudent={isStudent}
                isConsecutive={isConsecutive}
                isLast={isLast}
                avatar={senderAvatar}
                isGroup={isGroup}
                onLongPress={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setReactionAnchor({
                    messageId: message.id,
                    x: rect.left,
                    y: Math.max(72, rect.top - 56),
                    alignRight: isStudent,
                  });
                }}
                onOpenReactors={(initialEmoji) => {
                  setReactorsSheet({
                    messageId: message.id,
                    reactions: message.reactions ?? [],
                    initialEmoji,
                  });
                }}
              />
            );
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-end gap-2 pt-3"
              >
                <img
                  src={currentRoom?.participantAvatar}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                  style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
                />
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderBottomLeftRadius: '6px',
                  }}
                >
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: 'rgba(0, 212, 170, 0.6)',
                        }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                        transition={{
                          duration: 1.4,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ===== INPUT BAR ===== */}
      {chatFeatures.isBlocked ? (
        <BlockedBar onUnblock={() => chatFeatures.setIsBlocked(false)} />
      ) : (
      <div
        className="flex-shrink-0"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        {/* Attachment Previews */}
        <AttachmentPreviewBar attachments={chatFeatures.attachments} onRemove={chatFeatures.removeAttachment} />

        <div style={{ padding: '10px 14px', paddingBottom: 'max(env(safe-area-inset-bottom, 10px), 10px)' }}>
        <div className="flex items-end gap-2.5">
          {/* Attachment */}
          <button
            onClick={() => chatFeatures.setShowUploadSheet(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 active:bg-white/[0.08] transition-all flex-shrink-0 mb-0.5"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Plus className="w-4 h-4 text-white/40" strokeWidth={2} />
          </button>

          {/* Input */}
          <div
            className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-2.5 min-w-0 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Nachricht schreiben..."
              className="flex-1 bg-transparent text-white resize-none outline-none min-w-0 placeholder:text-white/20 scrollbar-thin"
              style={{
                fontFamily: ff,
                fontSize: '16px',
                lineHeight: '22px',
                maxHeight: '100px',
                minHeight: '22px',
              }}
              rows={1}
            />
            <button
              onClick={() => setShowEmojiPicker(true)}
              className="flex-shrink-0 mb-0.5 active:scale-90 transition-transform"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label="Emoji einfügen"
            >
              <Smile className="w-5 h-5 text-white/35" strokeWidth={2} />
            </button>
          </div>

          {/* Send */}
          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && chatFeatures.attachments.length === 0) || isSending}
            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 transition-all mb-0.5"
            style={{
              background: (messageText.trim() || chatFeatures.attachments.length > 0)
                ? 'rgba(255,255,255,0.12)'
                : 'rgba(255,255,255,0.04)',
              border: (messageText.trim() || chatFeatures.attachments.length > 0)
                ? '1px solid rgba(255,255,255,0.15)'
                : '1px solid rgba(255,255,255,0.06)',
              opacity: (messageText.trim() || chatFeatures.attachments.length > 0) ? 1 : 0.5,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <ArrowUpRight className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
          </button>
        </div>
        </div>
      </div>
      )}

      {/* Group Members Sheet */}
      {currentRoom?.kind === 'group' && currentRoom.members && (
        <GroupMembersSheet
          isOpen={showMembersSheet}
          onClose={() => setShowMembersSheet(false)}
          groupName={currentRoom.groupName ?? currentRoom.participantName}
          members={currentRoom.members}
        />
      )}

      {/* Reaction Bar Popup */}
      <MessageReactionBar
        isOpen={!!reactionAnchor}
        anchor={reactionAnchor}
        onClose={() => setReactionAnchor(null)}
        onSelect={(emoji) => {
          if (reactionAnchor) toggleReaction(reactionAnchor.messageId, emoji);
        }}
      />

      {/* Reactors Sheet — who reacted with what */}
      <ReactorsSheet
        isOpen={!!reactorsSheet}
        onClose={() => setReactorsSheet(null)}
        reactions={reactorsSheet?.reactions ?? []}
        initialEmoji={reactorsSheet?.initialEmoji}
        resolveMember={(memberId) => {
          if (memberId === 'student') return { name: 'Du', isSelf: true };
          if (currentRoom?.kind === 'group' && currentRoom.members) {
            const m = currentRoom.members.find((x) => x.id === memberId);
            if (m) return { name: m.name, avatar: m.avatar };
          }
          if (memberId === 'teacher' && currentRoom) {
            return { name: currentRoom.participantName, avatar: currentRoom.participantAvatar };
          }
          return { name: memberId };
        }}
        onRemoveSelf={(emoji) => {
          if (!reactorsSheet) return;
          toggleReaction(reactorsSheet.messageId, emoji);
          // Reflect removal in the open sheet immediately
          setReactorsSheet((prev) => {
            if (!prev) return null;
            const updated = prev.reactions
              .map((r) =>
                r.emoji === emoji
                  ? { ...r, memberIds: r.memberIds.filter((id) => id !== 'student') }
                  : r,
              )
              .filter((r) => r.memberIds.length > 0);
            return { ...prev, reactions: updated };
          });
        }}
      />

      {/* Emoji Picker Sheet */}
      <EmojiPickerSheet
        isOpen={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={(emoji) => {
          setMessageText((prev) => prev + emoji);
          if (inputRef.current) {
            // keep focus + trigger grow
            inputRef.current.focus();
            requestAnimationFrame(() => {
              if (!inputRef.current) return;
              inputRef.current.style.height = 'auto';
              inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
            });
          }
        }}
      />

      {/* Chat Feature Overlays */}
      <UploadSheet
        isOpen={chatFeatures.showUploadSheet}
        onClose={() => chatFeatures.setShowUploadSheet(false)}
        onAttach={chatFeatures.addAttachment}
      />
      <ChatSettingsSheet
        isOpen={chatFeatures.showSettingsSheet}
        onClose={() => chatFeatures.setShowSettingsSheet(false)}
        isMuted={chatFeatures.isMuted}
        isBlocked={chatFeatures.isBlocked}
        onMute={chatFeatures.handleMuteAction}
        onBlock={chatFeatures.handleBlockAction}
        onReport={() => chatFeatures.setShowReportModal(true)}
        onMediaGallery={() => chatFeatures.setShowMediaGallery(true)}
      />
      <MuteDurationSheet
        isOpen={chatFeatures.showMuteDuration}
        onClose={() => chatFeatures.setShowMuteDuration(false)}
        onSelect={() => chatFeatures.setIsMuted(true)}
      />
      <ReportModal
        isOpen={chatFeatures.showReportModal}
        onClose={() => chatFeatures.setShowReportModal(false)}
      />
      <BlockConfirmation
        isOpen={chatFeatures.showBlockConfirm}
        onClose={() => chatFeatures.setShowBlockConfirm(false)}
        onConfirm={() => chatFeatures.setIsBlocked(true)}
      />
      <MediaGallerySheet
        isOpen={chatFeatures.showMediaGallery}
        onClose={() => chatFeatures.setShowMediaGallery(false)}
      />

      {/* Delete Confirmation Modal (API: DELETE /v1/.../chat/:chatId) */}
      <AnimatePresence>
        {deleteConfirmChatId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setDeleteConfirmChatId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-[400px] rounded-t-2xl p-5 pb-8"
              style={{
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.08)',
                borderBottom: 'none',
                boxShadow: '0 -16px 48px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(255, 80, 80, 0.08)',
                    border: '1px solid rgba(255, 80, 80, 0.15)',
                  }}
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2} style={{ color: 'rgba(255, 80, 80, 0.7)' }} />
                </div>
                <div>
                  <h3
                    className="text-white text-[15px]"
                    style={{ fontFamily: ff, fontWeight: 600, letterSpacing: '-0.2px' }}
                  >
                    Chat löschen
                  </h3>
                  <p className="text-white/35 text-[12px]" style={{ fontFamily: ff }}>
                    Diese Aktion kann nicht rückgängig gemacht werden
                  </p>
                </div>
              </div>
              <p
                className="text-white/55 text-[13px] mb-6"
                style={{ fontFamily: ff, lineHeight: '1.6' }}
              >
                Möchtest du diesen Chat wirklich löschen? Alle Nachrichten gehen verloren.
              </p>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={async () => {
                    await aiChat.deleteChat(deleteConfirmChatId);
                    setDeleteConfirmChatId(null);
                  }}
                  className="w-full py-3 rounded-xl text-center active:scale-[0.97] transition-all"
                  style={{
                    fontFamily: ff,
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'white',
                    background: 'rgba(255, 80, 80, 0.15)',
                    border: '1px solid rgba(255, 80, 80, 0.25)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Löschen
                </button>
                <button
                  onClick={() => setDeleteConfirmChatId(null)}
                  className="w-full py-3 rounded-xl text-center active:scale-[0.97] transition-all"
                  style={{
                    fontFamily: ff,
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// ===== MOBILE MESSAGE BUBBLE =====
const MobileMessageBubble = React.memo(function MobileMessageBubble({
  message,
  isStudent,
  isConsecutive,
  isLast,
  avatar,
  isGroup,
  onLongPress,
  onOpenReactors,
}: {
  message: ChatMessage;
  isStudent: boolean;
  isConsecutive: boolean;
  isLast: boolean;
  avatar?: string;
  isGroup?: boolean;
  onLongPress?: (e: React.TouchEvent | React.MouseEvent) => void;
  onOpenReactors?: (initialEmoji?: string) => void;
}) {
  const time = formatMessageTime(message.timestamp);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!onLongPress) return;
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    // Capture ref to currentTarget before the timer fires (React pools events)
    const target = e.currentTarget;
    longPressTimerRef.current = setTimeout(() => {
      onLongPress({ ...e, currentTarget: target } as any);
    }, 420);
  };
  const cancelPress = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Rich card renderer for extra-session requests — skips the bubble UI.
  if (message.type === 'extra-session-request' && message.extraSessionRequestId) {
    return (
      <div
        className={`flex items-end gap-2 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
        style={{ marginTop: isConsecutive ? '2px' : '12px' }}
      >
        {!isStudent && isLast && (
          <img
            src={avatar}
            alt=""
            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
          />
        )}
        {!isStudent && !isLast && <div className="w-7 flex-shrink-0" />}
        <div className="flex flex-col" style={{ maxWidth: '85%' }}>
          <ExtraSessionRequestCard requestId={message.extraSessionRequestId} isStudent={isStudent} />
          {isLast && (
            <span
              className={`font-['Poppins:Regular',sans-serif] text-[10px] text-white/25 mt-1 px-1 ${isStudent ? 'self-end' : 'self-start'}`}
            >
              {time}
            </span>
          )}
        </div>
      </div>
    );
  }

  const showSenderHeader = Boolean(isGroup && !isStudent && !isConsecutive);
  const senderColor = getSenderColor(message.senderId);

  return (
    <div
      className={`flex items-end gap-2 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ marginTop: isConsecutive ? '2px' : '12px' }}
    >
      {/* Avatar – only on last message in group */}
      {!isStudent && isLast && (
        <img
          src={avatar}
          alt=""
          className="w-7 h-7 rounded-full object-cover flex-shrink-0"
          style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
        />
      )}
      {!isStudent && !isLast && <div className="w-7 flex-shrink-0" />}

      {/* Bubble */}
      <div style={{ maxWidth: '78%' }}>
        {showSenderHeader && (
          <div
            className="flex items-center mb-1 px-1"
            style={{ minHeight: 14 }}
          >
            <span
              className="text-[11px] truncate"
              style={{ fontFamily: ff, fontWeight: 600, color: senderColor }}
            >
              {message.senderName}
            </span>
          </div>
        )}
        <div
          className="px-3.5 py-2.5 select-none"
          style={{
            background: isStudent
              ? 'rgba(255,255,255,0.10)'
              : 'rgba(255,255,255,0.05)',
            borderRadius: '18px',
            borderBottomLeftRadius: isStudent
              ? '18px'
              : (isLast ? '6px' : '18px'),
            borderBottomRightRadius: isStudent
              ? (isLast ? '6px' : '18px')
              : '18px',
            borderTopLeftRadius: isStudent
              ? '18px'
              : (isConsecutive ? '12px' : '18px'),
            borderTopRightRadius: isStudent
              ? (isConsecutive ? '12px' : '18px')
              : '18px',
            WebkitTapHighlightColor: 'transparent',
          }}
          onTouchStart={handlePressStart}
          onTouchEnd={cancelPress}
          onTouchMove={cancelPress}
          onTouchCancel={cancelPress}
          onMouseDown={handlePressStart}
          onMouseUp={cancelPress}
          onMouseLeave={cancelPress}
          onContextMenu={(e) => {
            if (!onLongPress) return;
            e.preventDefault();
            onLongPress(e);
          }}
        >
          {message.attachments && message.attachments.length > 0 && (
            <MessageAttachments attachments={message.attachments} />
          )}
          {message.message && (
            <p
              className="text-[15px]"
              style={{
                fontFamily: ff,
                lineHeight: '21px',
                color: isStudent ? 'white' : 'rgba(255,255,255,0.88)',
                wordBreak: 'break-word',
              }}
            >
              {message.message}
            </p>
          )}
        </div>

        {/* Reactions below bubble — tap opens reactors sheet */}
        {onOpenReactors && (
          <MessageReactions
            reactions={message.reactions}
            onOpen={onOpenReactors}
            align={isStudent ? 'end' : 'start'}
          />
        )}

        {/* Time & Status – only on last message in group */}
        {isLast && (
          <div
            className={`flex items-center gap-1 mt-1 px-1 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span
              className="text-[10px]"
              style={{ fontFamily: ff, fontWeight: 500, color: 'rgba(255,255,255,0.25)' }}
            >
              {time}
            </span>
            {isStudent && (
              message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-[#00D4AA]/60" strokeWidth={2.5} />
              ) : (
                <Check className="w-3.5 h-3.5 text-white/25" strokeWidth={2.5} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// ===== MOBILE AI MESSAGE BUBBLE =====
const MobileAiMessageBubble = React.memo(function MobileAiMessageBubble({
  message,
  isUser,
  isConsecutive,
  isLast,
}: {
  message: AiChatMessage;
  isUser: boolean;
  isConsecutive: boolean;
  isLast: boolean;
}) {
  const time = formatMessageTime(message.timestamp);

  return (
    <div
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ marginTop: isConsecutive ? '2px' : '12px' }}
    >
      {/* AI Avatar – only on last message in group */}
      {!isUser && isLast && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 212, 170, 0.15) 0%, rgba(0, 150, 120, 0.10) 100%)',
            border: '1.5px solid rgba(0, 212, 170, 0.15)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00D4AA]/60" strokeWidth={2} />
        </div>
      )}
      {!isUser && !isLast && <div className="w-7 flex-shrink-0" />}

      {/* Bubble + Actions */}
      <div style={{ maxWidth: '82%' }}>
        <div
          className="px-3.5 py-2.5"
          style={{
            background: isUser
              ? 'rgba(255,255,255,0.10)'
              : 'rgba(255,255,255,0.05)',
            borderRadius: '18px',
            borderBottomLeftRadius: isUser
              ? '18px'
              : (isLast ? '6px' : '18px'),
            borderBottomRightRadius: isUser
              ? (isLast ? '6px' : '18px')
              : '18px',
            borderTopLeftRadius: isUser
              ? '18px'
              : (isConsecutive ? '12px' : '18px'),
            borderTopRightRadius: isUser
              ? (isConsecutive ? '12px' : '18px')
              : '18px',
          }}
        >
          <p
            className="text-[15px] whitespace-pre-line"
            style={{
              fontFamily: ff,
              lineHeight: '21px',
              color: isUser ? 'white' : 'rgba(255,255,255,0.88)',
              wordBreak: 'break-word',
            }}
          >
            {message.content}
          </p>
        </div>

        {/* Suggested Action Cards (API: suggestedActions) */}
        {!isUser && message.suggestedActions && message.suggestedActions.length > 0 && (
          <div className="flex flex-col gap-1.5 mt-2">
            {message.suggestedActions.map((action, i) => {
              const ActionIcon = getActionIcon(action.type);
              return (
                <button
                  key={`${action.type}-${i}`}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left active:bg-white/[0.04] transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <ActionIcon
                    className="w-3.5 h-3.5 text-[#00D4AA]/50 shrink-0"
                    strokeWidth={2}
                  />
                  <span
                    className="text-white/50 text-[12px]"
                    style={{ fontFamily: ff, fontWeight: 500 }}
                  >
                    {action.label}
                  </span>
                  <ArrowUpRight
                    className="w-3 h-3 text-white/15 shrink-0 ml-auto"
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Metadata for assistant */}
        {!isUser && isLast && message.metadata && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span
              className="text-[10px]"
              style={{ fontFamily: ff, fontWeight: 500, color: 'rgba(255,255,255,0.18)' }}
            >
              {(message.metadata.responseTime / 1000).toFixed(1)}s
            </span>
          </div>
        )}

        {/* Time */}
        {isLast && (
          <div
            className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <span
              className="text-[10px]"
              style={{ fontFamily: ff, fontWeight: 500, color: 'rgba(255,255,255,0.25)' }}
            >
              {time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});