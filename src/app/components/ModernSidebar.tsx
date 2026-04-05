import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import imgAvatar from "figma:asset/2327c42282ec79530a1b3980a446bd44de9918c8.png";
import imgAvatar1 from "figma:asset/24c561561440c52b7db7866898da16ac1fea6ab0.png";
import Group from "@/imports/Group";
import NotificationPanel from '@/app/components/NotificationPanel';
import { useUser } from '@/contexts/UserContext';
import { 
  Home, Video, MessageSquare, FileText, Sparkles, 
  GraduationCap, CreditCard, Wand2, ClipboardCheck, CheckCircle2, 
  User, TrendingUp, ChevronRight,
  PanelLeftClose, PanelLeftOpen, Bell, Settings
} from 'lucide-react';

interface ModernSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onHomeClick?: () => void;
  onMyFlashcardsClick?: () => void;
  onNavigateToCompletedExams?: () => void;
  onNavigateToProfilDesktop?: () => void;
  onNavigateToKITools?: () => void;
  onNavigateToChats?: () => void;
  onNavigateToMeetings?: () => void;
  onOpenExamSimulation?: () => void;
  onOpenGenerateFlashcards?: () => void;
  onOpenLernanalyse?: () => void;
}

const f = { fontFamily: "-apple-system, 'Inter', BlinkMacSystemFont, sans-serif" };

// ===== MAIN SIDEBAR =====
export default function ModernSidebar({ isCollapsed, onToggle, onHomeClick, onMyFlashcardsClick, onNavigateToCompletedExams, onNavigateToProfilDesktop, onNavigateToKITools, onNavigateToChats, onNavigateToMeetings, onOpenExamSimulation, onOpenGenerateFlashcards, onOpenLernanalyse }: ModernSidebarProps) {
  const { profileImage, userName } = useUser();
  const [expanded, setExpanded] = useState<string[]>(['ki-tools']);
  const [active, setActive] = useState('meine-karteikarten');
  const [activeParent, setActiveParent] = useState('ki-tools');
  const [notifOpen, setNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const notifRef = useRef<HTMLButtonElement | HTMLDivElement>(null);
  const [notifPos, setNotifPos] = useState({ top: 70, left: 0 });
  const popRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pop, setPop] = useState<{ id: string; top: number; left: number } | null>(null);

  useEffect(() => {
    if (isCollapsed) setExpanded([]);
    else if (activeParent) setExpanded([activeParent]);
  }, [isCollapsed, activeParent]);

  useEffect(() => {
    if (notifOpen && notifRef.current) {
      const r = notifRef.current.getBoundingClientRect();
      setNotifPos({ top: r.bottom + 8, left: r.left });
    }
  }, [notifOpen, isCollapsed]);

  const toggle = (id: string) => {
    if (isCollapsed) {
      const el = popRefs.current[id];
      if (el) {
        const r = el.getBoundingClientRect();
        setPop(pop?.id === id ? null : { id, top: r.top - 4, left: r.right + 12 });
      }
      return;
    }
    setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [id]);
  };

  const pick = (item: string, parent: string) => { setActive(item); setActiveParent(parent); setPop(null); };
  const pickTop = (item: string) => { setActive(item); setActiveParent(''); setExpanded([]); };

  const isExp = (id: string) => expanded.includes(id) && !isCollapsed;

  // Sub-menu data
  const subMenus: Record<string, Array<{ id: string; icon: React.ReactNode; label: string; action?: () => void }>> = {
    chats: [
      { id: 'chats', icon: <MessageSquare className="w-full h-full" strokeWidth={1.5} />, label: 'Chats', action: onNavigateToChats },
      { id: 'dokumente', icon: <FileText className="w-full h-full" strokeWidth={1.5} />, label: 'Dokumente' },
    ],
    'ki-tools': [
      { id: 'lernassistent', icon: <GraduationCap className="w-full h-full" strokeWidth={1.5} />, label: 'Lernassistent', action: onNavigateToKITools },
      { id: 'meine-karteikarten', icon: <CreditCard className="w-full h-full" strokeWidth={1.5} />, label: 'Meine Karteikarten', action: onMyFlashcardsClick },
      { id: 'generiere-karteikarten', icon: <Wand2 className="w-full h-full" strokeWidth={1.5} />, label: 'Generiere Karteikarten', action: onOpenGenerateFlashcards },
      { id: 'pruefungssimulation', icon: <ClipboardCheck className="w-full h-full" strokeWidth={1.5} />, label: 'Prüfungssimulation', action: onOpenExamSimulation },
      { id: 'abgeschlossene-pruefungen', icon: <CheckCircle2 className="w-full h-full" strokeWidth={1.5} />, label: 'Abgeschl. Prüfungen', action: onNavigateToCompletedExams },
    ],
    profil: [
      { id: 'mein-profil', icon: <User className="w-full h-full" strokeWidth={1.5} />, label: 'Mein Profil', action: onNavigateToProfilDesktop },
      { id: 'lernanalyse', icon: <TrendingUp className="w-full h-full" strokeWidth={1.5} />, label: 'Lernanalyse', action: onOpenLernanalyse },
    ],
  };

  // Reusable item renderer
  const Item = ({ icon, label, isActive, onClick, chevron, chevronOpen, className = '' }: {
    icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void;
    chevron?: boolean; chevronOpen?: boolean; className?: string;
  }) => (
    <div
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-2.5 py-[7px] rounded-lg cursor-pointer select-none
        transition-all duration-150 ease-out
        ${isActive ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:text-white/75 hover:bg-white/[0.04]'}
        ${className}
      `}
    >
      <div className={`shrink-0 w-[18px] h-[18px] transition-colors duration-150 ${isActive ? 'text-white/90' : 'text-white/40 group-hover:text-white/60'}`}>
        {icon}
      </div>
      <span className="flex-1 text-[13.5px]" style={{ ...f, fontWeight: isActive ? 500 : 400, letterSpacing: '-0.01em' }}>
        {label}
      </span>
      {chevron && (
        <ChevronRight 
          className={`shrink-0 w-3.5 h-3.5 text-white/20 transition-transform duration-200 ease-out ${chevronOpen ? 'rotate-90' : ''}`} 
          strokeWidth={1.8} 
        />
      )}
    </div>
  );

  // Sub-item renderer
  const Sub = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
    <div
      onClick={onClick}
      className={`
        flex items-center pl-[38px] pr-2.5 py-[6px] rounded-lg cursor-pointer select-none
        transition-all duration-150 ease-out
        ${isActive ? 'text-white/85' : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'}
      `}
    >
      <span className="text-[13px]" style={{ ...f, fontWeight: isActive ? 500 : 400, letterSpacing: '-0.005em' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div 
      className="relative h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-700 ease-in-out"
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(40px) saturate(140%)',
        WebkitBackdropFilter: 'blur(40px) saturate(140%)',
        border: '1px solid rgba(255,255,255,0.055)',
        boxShadow: '0 0 0 0.5px rgba(255,255,255,0.02) inset',
      }}
    >
      <div className="absolute top-0 left-6 right-6 h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

      {/* Header expanded */}
      <div className={`flex-none transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'h-0 opacity-0 p-0' : 'opacity-100 px-4 pt-4 pb-2'}`}>
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <div className="h-6 opacity-75"><Group /></div>
            <div className="flex items-center gap-0.5">
              <button ref={notifRef} onClick={() => setNotifOpen(!notifOpen)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] transition-colors relative">
                <Bell className="w-[15px] h-[15px] text-white/30" strokeWidth={1.5} />
                {hasUnread && <div className="absolute top-1 right-1 w-[5px] h-[5px] rounded-full bg-blue-400" />}
              </button>
              <button onClick={onToggle} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] transition-colors">
                <PanelLeftClose className="w-[15px] h-[15px] text-white/25" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Header collapsed */}
      {isCollapsed && (
        <div className="flex-none flex flex-col items-center gap-1 pt-3 pb-1 px-2">
          <button onClick={onToggle} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors">
            <PanelLeftOpen className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          </button>
          <button ref={notifRef as any} onClick={() => setNotifOpen(!notifOpen)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors relative">
            <Bell className="w-4 h-4 text-white/30" strokeWidth={1.5} />
            {hasUnread && <div className="absolute top-1.5 right-2 w-[5px] h-[5px] rounded-full bg-blue-400" />}
          </button>
        </div>
      )}

      <div className={`mx-3 ${isCollapsed ? 'my-1' : 'my-0.5'}`}>
        <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>

      {/* Nav */}
      <div className="flex-1 relative" style={{ overflow: 'visible' }}>
        <div className={`absolute inset-0 pb-2 ${isCollapsed ? 'px-2 pt-1' : 'px-2.5 pt-1'}`} style={{ overflowY: isCollapsed ? 'visible' : 'auto', overflowX: 'clip' }}>

          {!isCollapsed ? (
            <>
              {/* Section: Menu */}
              <div className="px-2.5 pt-1 pb-1.5">
                <span className="text-[11px] text-white/20 uppercase tracking-[0.1em]" style={{ ...f, fontWeight: 600 }}>Menu</span>
              </div>

              <div className="space-y-[1px]">
                <Item icon={<Home className="w-full h-full" strokeWidth={1.5} />} label="Home" isActive={active === 'home'} onClick={() => { pickTop('home'); onHomeClick?.(); }} />
                <Item icon={<Video className="w-full h-full" strokeWidth={1.5} />} label="Meetings" isActive={active === 'meetings'} onClick={() => { pickTop('meetings'); onNavigateToMeetings?.(); }} />
                <Item icon={<MessageSquare className="w-full h-full" strokeWidth={1.5} />} label="Chats" isActive={activeParent === 'chats' && !isExp('chats')} onClick={() => toggle('chats')} chevron chevronOpen={isExp('chats')} />
                {isExp('chats') && (
                  <div className="overflow-hidden" style={{ animation: 'sbExpand 0.2s ease-out' }}>
                    {subMenus.chats.map(s => (
                      <Sub key={s.id} label={s.label} isActive={active === s.id} onClick={() => { pick(s.id, 'chats'); s.action?.(); }} />
                    ))}
                  </div>
                )}

                <Item icon={<Sparkles className="w-full h-full" strokeWidth={1.5} />} label="KI-Tools" isActive={activeParent === 'ki-tools' && !isExp('ki-tools')} onClick={() => toggle('ki-tools')} chevron chevronOpen={isExp('ki-tools')} />
                {isExp('ki-tools') && (
                  <div className="overflow-hidden" style={{ animation: 'sbExpand 0.2s ease-out' }}>
                    {subMenus['ki-tools'].map(s => (
                      <Sub key={s.id} label={s.label} isActive={active === s.id} onClick={() => { pick(s.id, 'ki-tools'); s.action?.(); }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="my-2.5 mx-2">
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>

              <div className="px-2.5 pb-1.5">
                <span className="text-[11px] text-white/20 uppercase tracking-[0.1em]" style={{ ...f, fontWeight: 600 }}>Account</span>
              </div>

              <div className="space-y-[1px]">
                <Item icon={<User className="w-full h-full" strokeWidth={1.5} />} label="Profil" isActive={activeParent === 'profil' && !isExp('profil')} onClick={() => toggle('profil')} chevron chevronOpen={isExp('profil')} />
                {isExp('profil') && (
                  <div className="overflow-hidden" style={{ animation: 'sbExpand 0.2s ease-out' }}>
                    {subMenus.profil.map(s => (
                      <Sub key={s.id} label={s.label} isActive={active === s.id} onClick={() => { pick(s.id, 'profil'); s.action?.(); }} />
                    ))}
                  </div>
                )}
                <Item icon={<Settings className="w-full h-full" strokeWidth={1.5} />} label="Einstellungen" isActive={active === 'settings'} onClick={() => { pickTop('settings'); onNavigateToProfilDesktop?.(); }} /> {/* TODO: Eigene Einstellungen View implementieren */}
              </div>
            </>
          ) : (
            /* Collapsed */
            <div className="flex flex-col items-center gap-1 pt-1" style={{ overflow: 'visible' }}>
              {[
                { icon: <Home className="w-full h-full" strokeWidth={1.5} />, id: 'home', onClick: () => { pickTop('home'); onHomeClick?.(); } },
                { icon: <Video className="w-full h-full" strokeWidth={1.5} />, id: 'meetings', onClick: () => { pickTop('meetings'); onNavigateToMeetings?.(); } },
                { icon: <MessageSquare className="w-full h-full" strokeWidth={1.5} />, id: 'chats', onClick: () => toggle('chats'), parent: true },
                { icon: <Sparkles className="w-full h-full" strokeWidth={1.5} />, id: 'ki-tools', onClick: () => toggle('ki-tools'), parent: true },
              ].map(item => (
                <div
                  key={item.id}
                  ref={item.parent ? (el: any) => { popRefs.current[item.id] = el; } : undefined}
                  onClick={item.onClick}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 ${
                    (item.parent ? activeParent === item.id : active === item.id) ? 'bg-white/[0.09] text-white' : 'text-white/35 hover:bg-white/[0.05] hover:text-white/55'
                  }`}
                >
                  <div className="w-[18px] h-[18px]">{item.icon}</div>
                </div>
              ))}
              <div className="w-5 my-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              {[
                { icon: <User className="w-full h-full" strokeWidth={1.5} />, id: 'profil', onClick: () => toggle('profil'), parent: true },
                { icon: <Settings className="w-full h-full" strokeWidth={1.5} />, id: 'settings', onClick: () => { pickTop('settings'); onNavigateToProfilDesktop?.(); } }, // TODO: Eigene Einstellungen View implementieren
              ].map(item => (
                <div
                  key={item.id}
                  ref={item.parent ? (el: any) => { popRefs.current[item.id] = el; } : undefined}
                  onClick={item.onClick}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-150 ${
                    (item.parent ? activeParent === item.id : active === item.id) ? 'bg-white/[0.09] text-white' : 'text-white/35 hover:bg-white/[0.05] hover:text-white/55'
                  }`}
                >
                  <div className="w-[18px] h-[18px]">{item.icon}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-none px-2.5 py-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className={`flex items-center gap-2.5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors duration-150 hover:bg-white/[0.04] ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <div className="relative shrink-0 w-[28px] h-[28px] rounded-full overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08)' }}>
            {profileImage ? (
              <img alt="User" className="w-full h-full object-cover" src={profileImage} />
            ) : (
              <>
                <img alt="User" className="absolute inset-0 w-full h-full object-cover" src={imgAvatar} />
                <img alt="" className="absolute inset-0 w-full h-full object-cover" src={imgAvatar1} />
              </>
            )}
          </div>
          <div className={`transition-all duration-200 ease-out overflow-hidden min-w-0 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <p className="text-[12.5px] text-white/65 whitespace-nowrap truncate" style={{ ...f, fontWeight: 500 }}>{userName || 'Sam'}</p>
            <p className="text-[10.5px] text-white/25 whitespace-nowrap" style={f}>Premium</p>
          </div>
        </div>
      </div>

      {/* Collapsed popover */}
      {pop && typeof document !== 'undefined' && createPortal(
        <>
          <div className="fixed inset-0 z-[9999]" onClick={() => setPop(null)} />
          <div
            className="fixed min-w-[190px] rounded-xl overflow-hidden z-[10000] py-1"
            style={{
              top: `${pop.top}px`, left: `${pop.left}px`,
              background: 'rgba(28,28,30,0.94)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              animation: 'sbPopIn 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {(subMenus[pop.id] || []).map((item, i, arr) => (
              <div
                key={item.id}
                onClick={() => { pick(item.id, pop.id); item.action?.(); }}
                className={`flex items-center gap-2.5 px-3 py-[8px] mx-1 rounded-lg cursor-pointer transition-colors duration-100 ${
                  active === item.id ? 'bg-white/[0.08] text-white' : 'text-white/50 hover:bg-white/[0.05] hover:text-white/75'
                }`}
              >
                <div className="shrink-0 w-3.5 h-3.5">{item.icon}</div>
                <span className="text-[12.5px]" style={{ ...f, fontWeight: active === item.id ? 500 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </>,
        document.body
      )}

      {/* Notification Panel – rendered via portal to escape overflow:hidden */}
      {typeof document !== 'undefined' && createPortal(
        <NotificationPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} position={notifPos} />,
        document.body
      )}

      <style>{`
        @keyframes sbExpand {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 300px; }
        }
        @keyframes sbPopIn {
          from { opacity: 0; transform: translateX(-4px) scale(0.96); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>
    </div>
  );
}