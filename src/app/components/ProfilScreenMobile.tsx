// ===== PROFIL SCREEN MOBILE =====
// Vollständiges Profil mit School Progress, Tutoring, Account und Other Sections
// Apple Vision Pro Style Design
//
// OVERLAY MANAGEMENT: All sub-overlays (AccountEdit, Klassenarbeiten, Schulaufgaben)
// are now rendered via MobileRouteTransition at App.tsx level. This component only
// signals open/close via callback props.

import React, { useState, useRef } from 'react';
import { GraduationCap, Clock, Book, User, Bell, Lock, LogOut, Shield, FileText, ChevronRight, BookOpen, ClipboardList, NotebookPen, Pencil, BarChart3, Globe, MapPin, Phone, Mail, CheckCircle2, Scale, Building2, Crown, Headset } from 'lucide-react';
import { Lightbulb } from 'lucide-react';
import ProfileImageEditor from './ProfileImageEditor';
import NotificationSettingsPopup from './NotificationSettingsPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import MeinTarifScreen from './MeinTarifScreen';
import LegalScreen from './LegalScreen';
import ImprovementSuggestionModal from './ImprovementSuggestionModal';
import MeineFaecherPopup from './MeineFaecherPopup';
import VerfuegbarkeitPopup from './VerfuegbarkeitPopup';
import { useUser } from '@/contexts/UserContext';

interface ProfilScreenMobileProps {
  onClose: () => void;
  onLogout?: () => void;
  onAccountEditChange?: (isOpen: boolean) => void;
  showKlassenarbeiten?: boolean;
  onShowKlassenarbeitenChange?: (show: boolean) => void;
  showSchulaufgaben?: boolean;
  onShowSchulaufgabenChange?: (show: boolean) => void;
  onOpenLernanalyse?: () => void;
  onShowSchuleUndKlasse?: (show: boolean) => void;
  onOpenTutoringActivation?: () => void;
  onOpenTutoringProgress?: () => void;
  onOpenExtraSessions?: () => void;
  onOpenCreditHistory?: () => void;
}

export default React.memo(function ProfilScreenMobile({
  onClose,
  onLogout,
  onAccountEditChange,
  showKlassenarbeiten,
  onShowKlassenarbeitenChange,
  showSchulaufgaben,
  onShowSchulaufgabenChange,
  onOpenLernanalyse,
  onShowSchuleUndKlasse,
  onOpenTutoringActivation,
  onOpenTutoringProgress,
  onOpenExtraSessions,
  onOpenCreditHistory,
}: ProfilScreenMobileProps) {
  // Use UserContext for centralized state
  const { profileImage, setProfileImage, userName, accountData, tutoringStatus, setTutoringStatus, tutoringRequestData, extraSessions } = useUser();

  // Extra lessons available (from UserContext)
  const extraLessonsAvailable = extraSessions.available;

  // Profile Picture Editor State
  const [tempImageForEditing, setTempImageForEditing] = useState<string | null>(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMeinTarif, setShowMeinTarif] = useState(false);
  const [showLegal, setShowLegal] = useState<'agb' | 'impressum' | 'datenschutz' | null>(null);
  const [showImprovementSuggestion, setShowImprovementSuggestion] = useState(false);
  const [showMeineFaecher, setShowMeineFaecher] = useState(false);
  const [showVerfuegbarkeit, setShowVerfuegbarkeit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Profile Picture Selection
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setTempImageForEditing(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save from Editor
  const handleSaveEditedImage = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl);
    setTempImageForEditing(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle Cancel from Editor
  const handleCancelEdit = () => {
    setTempImageForEditing(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // Menu item component - iPhone Style mit Glasoptik!
  const MenuItem = ({ 
    icon, 
    label, 
    sublabel, 
    onClick, 
    iconColor = '#9CA3AF',
    showChevron = true,
    textColor = '#FFFFFF',
    badgeText,
    badgeColor,
    isLast = false
  }: { 
    icon: React.ReactNode; 
    label: string; 
    sublabel?: string;
    onClick?: () => void;
    iconColor?: string;
    showChevron?: boolean;
    textColor?: string;
    badgeText?: string;
    badgeColor?: string;
    isLast?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-4 transition-all duration-150 relative active:bg-white/[0.03]"
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Icon - direkt ohne Background Circle */}
      <div className="flex-shrink-0" style={{ color: iconColor }}>
        {icon}
      </div>

      {/* Label Container */}
      <div className="flex-1 text-left min-w-0">
        <p 
          className="font-['Poppins:Medium',sans-serif] text-[15px] leading-[20px]"
          style={{ color: textColor }}
        >
          {label}
        </p>
        {sublabel && (
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#8E8E93] leading-[18px] mt-0.5">
            {sublabel}
          </p>
        )}
      </div>

      {/* Badge or Chevron */}
      {badgeText && (
        <div 
          className="px-2.5 py-1 rounded-full font-['Poppins:SemiBold',sans-serif] text-[11px]"
          style={{ 
            backgroundColor: `${badgeColor}20`,
            color: badgeColor,
            border: `1px solid ${badgeColor}40`
          }}
        >
          {badgeText}
        </div>
      )}
      {showChevron && !badgeText && (
        <ChevronRight className="w-[20px] h-[20px] text-[#8E8E93] flex-shrink-0" strokeWidth={2} />
      )}

      {/* Bottom Border - except last item */}
      {!isLast && (
        <div className="absolute bottom-0 left-4 right-0 h-px bg-white/[0.08]" />
      )}
    </button>
  );

  // Section Header
  const SectionHeader = ({ title }: { title: string }) => (
    <h2 className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-[#8E8E93] uppercase tracking-wide mb-2 px-1">
      {title}
    </h2>
  );

  // Section Container - Dunklere Glassmorphism Card!
  const SectionContainer = ({ children }: { children: React.ReactNode }) => (
    <div 
      className="overflow-hidden rounded-[14px] bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06]"
    >
      {children}
    </div>
  );

  return (
    <>
      {/* Image Editor Overlay */}
      {tempImageForEditing && (
        <ProfileImageEditor
          imageUrl={tempImageForEditing}
          onSave={handleSaveEditedImage}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Main Profile Screen */}
      {!tempImageForEditing && (
      <div 
        className="relative w-full h-full bg-[#0a0a0a] overflow-y-auto pt-safe scrollbar-thin"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Content */}
        <div className="px-5 pb-32 pt-6 space-y-4">
        {/* Profile Header Card - Ultra-Modern Apple Style */}
        <div className="flex flex-col items-center pt-6 pb-3">
          {/* Profile Picture with Elegant Glassmorphism */}
          <div className="relative mb-4">
            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            
            {/* Perfect Circular Glass Ring Container */}
            <div className="relative w-[136px] h-[136px] rounded-full p-[8px]"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)'
              }}
            >
              {/* Profile Picture - Clickable */}
              <button
                onClick={handleProfilePictureClick}
                className="relative w-full h-full rounded-full transition-all duration-300 active:scale-95 overflow-hidden"
                style={{
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                {/* Inner Shadow Ring for depth */}
                <div className="absolute inset-0 rounded-full pointer-events-none z-20"
                  style={{
                    border: '1.5px solid rgba(255, 255, 255, 0.06)'
                  }}
                />
                
                <img 
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                
                {/* Subtle Edit Overlay - appears on active */}
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 active:opacity-100 transition-opacity duration-200 flex items-center justify-center z-30">
                  <Pencil className="w-[24px] h-[24px] text-white" strokeWidth={2} />
                </div>
              </button>
            </div>
            
            {/* Elegant Edit Button Badge - Also Clickable */}
            <button
              onClick={handleProfilePictureClick}
              className="absolute bottom-0 right-0 w-[34px] h-[34px] rounded-full flex items-center justify-center z-40 transition-all duration-300 active:scale-90"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                border: '2.5px solid #0a0a0a',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <Pencil className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* User Name with Premium Typography */}
          <h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white text-center mb-1 tracking-tight"
            style={{
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            {userName}
          </h2>
          
          {/* Subtle Email/Info below name */}
          <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#707070] text-center">
            {accountData.email}
          </p>
        </div>

        {/* School Progress Section */}
        <div>
          <SectionHeader title="Schulfortschritt" />
          <SectionContainer>
            <MenuItem
              icon={<ClipboardList className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Klassenarbeiten"
              onClick={() => onShowKlassenarbeitenChange?.(true)}
            />

            <MenuItem
              icon={<NotebookPen className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Schulaufgaben"
              onClick={() => onShowSchulaufgabenChange?.(true)}
            />

            <MenuItem
              icon={<GraduationCap className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Schule und Klasse"
              sublabel={[accountData.schoolType, accountData.grade ? `${accountData.grade}. Klasse` : null].filter(Boolean).join(', ') || undefined}
              onClick={() => onShowSchuleUndKlasse?.(true)}
            />

            <MenuItem
              icon={<BarChart3 className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Lernanalyse"
              iconColor="#00D4AA"
              onClick={() => onOpenLernanalyse?.()}
              isLast={true}
            />
          </SectionContainer>
        </div>

        {/* Tutoring Section – conditional on tutoringStatus */}
        <div>
          <SectionHeader title="Nachhilfe" />

          {/* STATE: notActivated → CTA Card */}
          {tutoringStatus === 'notActivated' && (
            <button
              onClick={() => onOpenTutoringActivation?.()}
              className="w-full rounded-2xl p-5 text-left transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(0,184,148,0.08), rgba(0,147,121,0.04))',
                border: '1px solid rgba(0,184,148,0.18)',
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00B894, #009379)' }}
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[15px] text-white mb-0.5">
                    Nachhilfe aktivieren
                  </h3>
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/45 leading-relaxed">
                    Verbinde dich mit Nachhilfelehrern, die dank KI genau deine Schwächen erkennen und gezielt mit dir daran arbeiten.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 flex-shrink-0" />
              </div>
            </button>
          )}

          {/* STATE: requestSent → Status Card */}
          {tutoringStatus === 'requestSent' && tutoringRequestData && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="px-4 py-3.5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FFB800' }} />
                <div className="flex-1">
                  <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">
                    Anfrage gesendet
                  </p>
                  <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">
                    Dein Nachhilfe-Institut wird sich bald melden.
                  </p>
                </div>
              </div>
              <div className="px-4 py-3">
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 mb-2">
                  {tutoringRequestData.selectedPartner?.name}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-white/30" />
                    <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">
                      {tutoringRequestData.selectedPartner?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/30" />
                    <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">
                      {tutoringRequestData.selectedPartner?.email}
                    </span>
                  </div>
                  {tutoringRequestData.selectedPartner?.openingHours && tutoringRequestData.selectedPartner.openingHours.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/30 mt-px flex-shrink-0" />
                      <div className="flex flex-col">
                        {tutoringRequestData.selectedPartner.openingHours.map((line, i) => (
                          <span key={i} className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50 leading-[17px]">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Prototype: Accept Request Button */}
              <button
                onClick={() => setTutoringStatus('activated')}
                className="w-full px-4 py-3 text-left transition-colors active:bg-white/[0.03]"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-center" style={{ color: '#00B894' }}>
                  Anfrage akzeptieren (Prototyp)
                </p>
              </button>
              {/* Prototype: Remove Request Button */}
              <button
                onClick={() => {
                  setTutoringStatus('notActivated');
                }}
                className="w-full px-4 py-2 text-left transition-colors active:bg-white/[0.03]"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-center text-white/20">
                  Anfrage entfernen (Prototyp)
                </p>
              </button>
              {/* SoStudy Support Hotline */}
              <div
                className="px-4 py-3 flex items-center gap-2.5"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Headset className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 leading-relaxed">
                  Probleme oder Fragen? SoStudy-Hotline: <span className="text-white/40">+49 800 7678839</span>
                </p>
              </div>
            </div>
          )}

          {/* STATE: activated → Full tutoring menu */}
          {tutoringStatus === 'activated' && (
            <>
            <SectionContainer>
              <MenuItem
                icon={<BarChart3 className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Fortschritt"
                sublabel="AI-Lerneinblicke"
                iconColor="#00B894"
                onClick={() => onOpenTutoringProgress?.()}
              />
              <MenuItem
                icon={<Clock className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Verfügbarkeit"
                onClick={() => setShowVerfuegbarkeit(true)}
              />
              <MenuItem
                icon={<Book className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Meine Fächer"
                onClick={() => setShowMeineFaecher(true)}
              />
              <MenuItem
                icon={<BookOpen className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Extra-Stunden"
                iconColor="#00B894"
                badgeText={`${extraLessonsAvailable} Verfügbar`}
                badgeColor="#00B894"
                onClick={() => onOpenExtraSessions?.()}
                isLast={true}
              />
            </SectionContainer>
            {/* Prototype: Deactivate Tutoring Button */}
            <button
              onClick={() => {
                setTutoringStatus('notActivated');
              }}
              className="w-full px-4 py-2 mt-1 transition-colors active:bg-white/[0.03]"
            >
              <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-center text-white/20">
                Nachhilfe deaktivieren (Prototyp)
              </p>
            </button>
            </>
          )}
        </div>

        {/* Account Section */}
        <div>
          <SectionHeader title="Konto" />
          <SectionContainer>
            <MenuItem
              icon={<User className="w-[22px] h-[22px]" strokeWidth={2} />}
              label={userName}
              sublabel={accountData.email}
              onClick={() => {
                // Signal to App.tsx: open AccountEdit overlay immediately
                onAccountEditChange?.(true);
              }}
            />

            <MenuItem
              icon={<Crown className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Mein Tarif"
              onClick={() => setShowMeinTarif(true)}
            />

            <MenuItem
              icon={<Bell className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Benachrichtigungen"
              onClick={() => setShowNotificationSettings(true)}
            />

            <MenuItem
              icon={<Lock className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Passwort ändern"
              onClick={() => setShowChangePassword(true)}
            />

            <MenuItem
              icon={<Lightbulb className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Verbesserungsvorschlag"
              onClick={() => setShowImprovementSuggestion(true)}
            />

            <MenuItem
              icon={<LogOut className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Abmelden"
              iconColor="#FF4444"
              textColor="#FF4444"
              showChevron={false}
              onClick={() => {
                if (onLogout) {
                  onLogout();
                }
              }}
              isLast={true}
            />
          </SectionContainer>
        </div>

        {/* Other Section */}
        <div>
          <SectionHeader title="Sonstiges" />
          <SectionContainer>
            <MenuItem
              icon={<Scale className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="AGB"
              onClick={() => setShowLegal('agb')}
            />

            <MenuItem
              icon={<Building2 className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Impressum"
              onClick={() => setShowLegal('impressum')}
            />

            <MenuItem
              icon={<Shield className="w-[22px] h-[22px]" strokeWidth={2} />}
              label="Datenschutzerklärung"
              onClick={() => setShowLegal('datenschutz')}
              isLast={true}
            />
          </SectionContainer>
        </div>

        {/* App Version Footer */}
        <div className="pt-4 pb-2">
          <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#707070] text-center">
            SoStudy Version 1.0.0
          </p>
        </div>
      </div>
      </div>
      )}

      {/* Notification Settings Popup */}
      {showNotificationSettings && (
        <NotificationSettingsPopup
          onClose={() => setShowNotificationSettings(false)}
        />
      )}

      {/* Change Password Popup */}
      {showChangePassword && (
        <ChangePasswordPopup
          onClose={() => setShowChangePassword(false)}
        />
      )}

      {/* Mein Tarif Screen */}
      {showMeinTarif && (
        <MeinTarifScreen
          onClose={() => setShowMeinTarif(false)}
          tutoringActive={tutoringStatus === 'activated'}
          onOpenCreditHistory={onOpenCreditHistory ? () => {
            setShowMeinTarif(false);
            setTimeout(() => onOpenCreditHistory(), 50);
          } : undefined}
        />
      )}

      {/* Legal Screen */}
      {showLegal && (
        <LegalScreen
          onClose={() => setShowLegal(null)}
          type={showLegal}
        />
      )}

      {/* Improvement Suggestion Modal */}
      {showImprovementSuggestion && (
        <ImprovementSuggestionModal
          onClose={() => setShowImprovementSuggestion(false)}
        />
      )}

      {/* Meine Fächer Popup */}
      {showMeineFaecher && (
        <MeineFaecherPopup onClose={() => setShowMeineFaecher(false)} />
      )}

      {/* Verfügbarkeit Popup */}
      {showVerfuegbarkeit && (
        <VerfuegbarkeitPopup onClose={() => setShowVerfuegbarkeit(false)} />
      )}
    </>
  );
});