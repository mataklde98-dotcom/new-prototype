// ===== TUTORING EXPLAIN SCREEN =====
// AI-powered re-explanation of a tutoring session.
// Chat-like interface where the AI "re-teaches" the session content
// and the student can ask follow-up questions.

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Send, Brain, Sparkles, BookOpen,
} from 'lucide-react';
import {
  MOCK_SESSIONS,
} from '@/mocks/tutoringProgress.mock';

// ===================================================================
// TYPES
// ===================================================================

interface TutoringExplainScreenProps {
  sessionId: string | null;
  onClose: () => void;
  externalTransition?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

// ===================================================================
// HELPERS
// ===================================================================

function generateInitialExplanation(session: typeof MOCK_SESSIONS[0]): string {
  const weaknesses = session.weaknesses.map(w => w.title).join(', ');
  const topics = session.topicsCovered.map(t => t.name).join(', ');

  return `In deiner letzten Nachhilfe-Sitzung am ${new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })} habt ihr **${session.mainTopic}** besprochen.\n\nDabei wurden folgende Themen behandelt: ${topics}.\n\n${session.aiSummary}\n\nIch habe erkannt, dass du bei folgenden Bereichen noch Schwierigkeiten hattest: **${weaknesses}**.\n\nSoll ich dir eines dieser Themen Schritt für Schritt erklären?`;
}

// Mock AI responses based on keywords
function generateMockResponse(input: string, session: typeof MOCK_SESSIONS[0]): string {
  const lower = input.toLowerCase();

  if (lower.includes('pq') || lower.includes('formel')) {
    return `Klar! Die **pq-Formel** ist eine Methode, um quadratische Gleichungen der Form x² + px + q = 0 zu lösen.\n\n**So funktioniert es:**\n\n1. Bringe die Gleichung in die Normalform: x² + px + q = 0\n2. Setze in die Formel ein: x₁,₂ = -(p/2) ± √((p/2)² - q)\n3. Der Ausdruck unter der Wurzel heißt **Diskriminante**: D = (p/2)² - q\n\n**Drei Fälle:**\n- D > 0 → Zwei verschiedene Lösungen\n- D = 0 → Genau eine Lösung (doppelte Nullstelle)\n- D < 0 → Keine reelle Lösung\n\n**Beispiel:** x² - 6x + 8 = 0\n→ p = -6, q = 8\n→ x = 3 ± √(9-8) = 3 ± 1\n→ x₁ = 4, x₂ = 2\n\nMöchtest du ein weiteres Beispiel durchrechnen?`;
  }

  if (lower.includes('parabel') || lower.includes('zeichnen') || lower.includes('graph')) {
    return `Beim **Zeichnen einer Parabel** gehst du so vor:\n\n1. **Scheitelpunkt bestimmen:** Bei y = a(x-d)² + e liegt er bei (d, e)\n2. **Öffnungsrichtung:** a > 0 = nach oben, a < 0 = nach unten\n3. **Nullstellen berechnen:** Setze y = 0 und löse nach x\n4. **Wertetabelle:** Berechne 2-3 weitere Punkte\n5. **Symmetrie nutzen:** Die Parabel ist symmetrisch zur Achse x = d\n\n**Tipp:** Beginne immer mit dem Scheitelpunkt, dann die Nullstellen, dann weitere Punkte. Die Symmetrieachse hilft dir, Punkte zu spiegeln.\n\nSoll ich dir zeigen, wie man eine konkrete Parabel Schritt für Schritt zeichnet?`;
  }

  if (lower.includes('umstellen') || lower.includes('gleichung')) {
    return `Beim **Umstellen von Gleichungen** gelten diese Grundregeln:\n\n1. Was du auf einer Seite machst, musst du auch auf der anderen Seite machen\n2. Ziel: Die gesuchte Variable alleine auf eine Seite bringen\n\n**Reihenfolge:**\n1. Klammern auflösen\n2. Zusammenfassen\n3. Variable-Terme auf eine Seite\n4. Zahlen auf die andere Seite\n5. Durch den Koeffizienten teilen\n\n**Beispiel:** 3x + 7 = 2x - 5\n→ 3x - 2x = -5 - 7\n→ x = -12\n\nBei Brüchen: Multipliziere erst mit dem Nenner, um den Bruch loszuwerden.\n\nWelchen Typ Gleichung möchtest du üben?`;
  }

  if (lower.includes('essay') || lower.includes('thesis') || lower.includes('argumentation')) {
    return `Ein gutes **Thesis Statement** hat diese Eigenschaften:\n\n1. Es nimmt eine klare Position ein\n2. Es ist spezifisch, nicht zu allgemein\n3. Es lässt sich mit Argumenten stützen\n\n**Schlecht:** \"Social media is important.\"\n**Besser:** \"Social media has fundamentally changed how teenagers form relationships, leading to both increased connectivity and heightened anxiety.\"\n\n**Formel für ein starkes Thesis Statement:**\n[Thema] + [deine Position] + [warum/wie]\n\nSoll ich dir bei einem konkreten Thema helfen?`;
  }

  if (lower.includes('danke') || lower.includes('verstanden') || lower.includes('klar')) {
    return `Super, das freut mich! 💪\n\nWenn du das Thema weiter festigen möchtest, empfehle ich dir:\n- Die zugehörigen **Karteikarten** zu wiederholen\n- Eine kurze **Übungssitzung** zu machen\n\nDu kannst mich jederzeit wieder fragen, wenn etwas unklar ist!`;
  }

  // Default response
  return `Das ist eine gute Frage! Im Kontext von **${session.mainTopic}** ist das ein wichtiger Punkt.\n\n${session.keyTakeaways[0]?.text || 'Lass mich dir das genauer erklären.'}\n\nMöchtest du, dass ich tiefer auf einen bestimmten Aspekt eingehe? Du kannst mich auch nach konkreten Beispielen oder Übungsaufgaben fragen.`;
}

// ===================================================================
// CHAT BUBBLE
// ===================================================================

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === 'assistant';

  // Simple markdown-like rendering: **bold** → <strong>
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="text-white/80">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} mb-3`}>
      <div className={`max-w-[85%] ${isAssistant ? '' : ''}`}>
        {isAssistant && (
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <div
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'rgba(0,184,148,0.12)' }}
            >
              <Brain className="w-3 h-3" style={{ color: '#00B894' }} />
            </div>
            <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/30">
              Lernassistent
            </span>
          </div>
        )}
        <div
          className="rounded-2xl px-4 py-3"
          style={isAssistant ? {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderTopLeftRadius: '6px',
          } : {
            background: 'rgba(0,184,148,0.08)',
            border: '1px solid rgba(0,184,148,0.15)',
            borderTopRightRadius: '6px',
          }}
        >
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/55 leading-[20px] whitespace-pre-line">
            {renderContent(message.content)}
          </p>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================

export default function TutoringExplainScreen({
  sessionId,
  onClose,
  externalTransition,
}: TutoringExplainScreenProps) {
  const session = useMemo(
    () => MOCK_SESSIONS.find(s => s.id === sessionId) || null,
    [sessionId]
  );

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with AI explanation
  useEffect(() => {
    if (session && messages.length === 0) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setMessages([{
          id: 'initial',
          role: 'assistant',
          content: generateInitialExplanation(session),
          timestamp: Date.now(),
        }]);
        setIsTyping(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [session]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || !session || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateMockResponse(userMsg.content, session);
      setMessages(prev => [...prev, {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  // Quick suggestion chips
  const suggestions = useMemo(() => {
    if (!session) return [];
    const chips: string[] = [];
    session.weaknesses.forEach(w => {
      if (chips.length < 3) chips.push(`Erkläre: ${w.title}`);
    });
    if (chips.length < 3) {
      chips.push(`Was sind die wichtigsten Punkte?`);
    }
    return chips;
  }, [session]);

  if (!session) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#0a0a0a', zIndex: 63 }}>
        <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/40">Sitzung nicht gefunden</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: '#0a0a0a', zIndex: 63 }}>
      {/* ===== HEADER ===== */}
      <div
        className="flex-shrink-0 px-5 pt-[max(env(safe-area-inset-top),12px)] pb-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="flex items-center gap-3 h-[44px]">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ArrowLeft className="w-[18px] h-[18px] text-white/70" strokeWidth={2} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,184,148,0.10)' }}
              >
                <Brain className="w-4 h-4" style={{ color: '#00B894' }} />
              </div>
              <div>
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white/80 leading-[18px]">
                  Lernassistent
                </h1>
                <p className="font-['Poppins:Regular',sans-serif] text-[10px] text-white/30 leading-[13px]">
                  {session.mainTopic}
                </p>
              </div>
            </div>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.12)' }}
          >
            <Sparkles className="w-2.5 h-2.5" style={{ color: '#00B894' }} />
            <span className="font-['Poppins:Regular',sans-serif] text-[9px]" style={{ color: '#00B894' }}>
              AI
            </span>
          </div>
        </div>
      </div>

      {/* ===== CHAT AREA ===== */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pt-4">
        {/* Context banner */}
        <div
          className="rounded-xl p-3 mb-4 flex items-center gap-2.5"
          style={{ background: 'rgba(74,158,255,0.05)', border: '1px solid rgba(74,158,255,0.10)' }}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: '#4A9EFF' }} />
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/35 leading-[15px]">
            Basierend auf deiner Sitzung vom {new Date(session.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })} – {session.subject}
          </p>
        </div>

        {/* Messages */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="max-w-[85%]">
              <div className="flex items-center gap-1.5 mb-1.5 px-1">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(0,184,148,0.12)' }}
                >
                  <Brain className="w-3 h-3" style={{ color: '#00B894' }} />
                </div>
                <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-white/30">
                  Lernassistent
                </span>
              </div>
              <div
                className="rounded-2xl px-4 py-3 inline-flex gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTopLeftRadius: '6px',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Suggestion chips – only show if minimal messages */}
        {messages.length === 1 && !isTyping && (
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {suggestions.map((chip, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputValue(chip);
                  // Auto-send after short delay
                  setTimeout(() => {
                    const userMsg: ChatMessage = {
                      id: `user_${Date.now()}`,
                      role: 'user',
                      content: chip,
                      timestamp: Date.now(),
                    };
                    setMessages(prev => [...prev, userMsg]);
                    setInputValue('');
                    setIsTyping(true);
                    setTimeout(() => {
                      const response = generateMockResponse(chip, session);
                      setMessages(prev => [...prev, {
                        id: `ai_${Date.now()}`,
                        role: 'assistant',
                        content: response,
                        timestamp: Date.now(),
                      }]);
                      setIsTyping(false);
                    }, 1000 + Math.random() * 500);
                  }, 50);
                }}
                className="px-3 py-1.5 rounded-xl font-['Poppins:Regular',sans-serif] text-[11px] text-white/45 transition-all active:scale-[0.97]"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </div>

      {/* ===== INPUT AREA ===== */}
      <div
        className="flex-shrink-0 px-4 py-3 pb-[max(env(safe-area-inset-bottom),12px)]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-4 h-[44px]"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Frage stellen..."
            className="flex-1 bg-transparent font-['Poppins:Regular',sans-serif] text-[13px] text-white/70 placeholder:text-white/20 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90 disabled:opacity-20"
            style={{
              background: inputValue.trim() && !isTyping ? 'rgba(0,184,148,0.15)' : 'transparent',
            }}
          >
            <Send
              className="w-4 h-4"
              style={{ color: inputValue.trim() && !isTyping ? '#00B894' : 'rgba(255,255,255,0.2)' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}