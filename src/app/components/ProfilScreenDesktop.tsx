// ===== PROFIL SCREEN DESKTOP =====
// Desktop Version - EXAKT GLEICH wie Mobile!
// Synchron durch UserContext

import React, { useState, useRef } from 'react';
import { X, GraduationCap, Clock, Book, User, Bell, Lock, LogOut, Shield, FileText, ChevronRight, Pencil, ClipboardList, NotebookPen, BookOpen, BarChart3, Zap, Phone, Mail, CheckCircle2, Scale, Building2, Crown, Headset, Lightbulb } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ProfileImageEditor from './ProfileImageEditor';
import NotificationSettingsPopup from './NotificationSettingsPopup';
import ChangePasswordPopup from './ChangePasswordPopup';
import MeinTarifScreen from './MeinTarifScreen';
import LegalScreen from './LegalScreen';
import ImprovementSuggestionModal from './ImprovementSuggestionModal';
import MeineFaecherPopup from './MeineFaecherPopup';
import VerfuegbarkeitPopup from './VerfuegbarkeitPopup';
import AccountEditScreenMobile from './AccountEditScreenMobile';
import KlassenarbeitenScreen from './KlassenarbeitenScreen';
import SchulaufgabenScreen from './SchulaufgabenScreen';
import SchuleUndKlassePopup from './SchuleUndKlassePopup';
import { useUser } from '@/contexts/UserContext';

interface ProfilScreenDesktopProps {
  onClose?: () => void;
  onLogout?: () => void;
  showKlassenarbeiten?: boolean;
  onShowKlassenarbeitenChange?: (show: boolean) => void;
  onOpenLernanalyse?: () => void;
  onOpenTutoringActivation?: () => void;
  onOpenTutoringProgress?: () => void;
  onOpenCreditHistory?: () => void;
}

export default React.memo(function ProfilScreenDesktop({ onClose, onLogout, showKlassenarbeiten, onShowKlassenarbeitenChange, onOpenLernanalyse, onOpenTutoringActivation, onOpenTutoringProgress, onOpenCreditHistory }: ProfilScreenDesktopProps) {
  // Use UserContext for centralized state
  const { profileImage, setProfileImage, userName, accountData, setAccountData, tutoringStatus, setTutoringStatus, tutoringRequestData } = useUser();
  
  // Extra lessons available
  const extraLessonsAvailable = 2;

  // Profile Picture Editor State
  const [tempImageForEditing, setTempImageForEditing] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account Edit Screen State
  const [showAccountEdit, setShowAccountEdit] = useState(false);

  // Schulaufgaben Screen State
  const [showSchulaufgaben, setShowSchulaufgaben] = useState(false);

  // Schule und Klasse Screen State
  const [showSchuleUndKlasse, setShowSchuleUndKlasse] = useState(false);

  // Notification Settings State
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // Change Password State
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Mein Tarif State
  const [showMeinTarif, setShowMeinTarif] = useState(false);

  // Legal Screen State
  const [showLegal, setShowLegal] = useState<'agb' | 'impressum' | 'datenschutz' | null>(null);
  const [showImprovementSuggestion, setShowImprovementSuggestion] = useState(false);
  const [showMeineFaecher, setShowMeineFaecher] = useState(false);
  const [showVerfuegbarkeit, setShowVerfuegbarkeit] = useState(false);

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
    isLast = false,
    isFirst = false
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
    isFirst?: boolean;
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

      {/* Bottom Border - außer beim letzten Item */}
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
      {/* Account Edit Screen with AnimatePresence for exit animation */}
      <AnimatePresence mode="popLayout">
        {showAccountEdit && !tempImageForEditing && (
          <AccountEditScreenMobile
            onBack={() => setShowAccountEdit(false)}
            initialData={accountData}
            onSave={setAccountData}
          />
        )}
      </AnimatePresence>

      {/* Klassenarbeiten Screen - replaces profile content */}
      {showKlassenarbeiten && !tempImageForEditing && (
        <KlassenarbeitenScreen
          onClose={() => {
            if (onShowKlassenarbeitenChange) {
              onShowKlassenarbeitenChange(false);
            }
          }}
        />
      )}

      {/* Schulaufgaben Screen - replaces profile content */}
      {showSchulaufgaben && !tempImageForEditing && (
        <SchulaufgabenScreen
          onClose={() => {
            setShowSchulaufgaben(false);
          }}
        />
      )}

      {/* Schule und Klasse Popup */}
      {showSchuleUndKlasse && (
        <SchuleUndKlassePopup
          accountData={accountData}
          onSave={(data) => {
            setAccountData(data);
            setShowSchuleUndKlasse(false);
          }}
          onClose={() => setShowSchuleUndKlasse(false)}
        />
      )}

      {/* Image Editor Overlay */}
      {tempImageForEditing && (
        <ProfileImageEditor
          imageUrl={tempImageForEditing}
          onSave={handleSaveEditedImage}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Main Profile Screen - hidden when Klassenarbeiten is open */}
      {/* No internal scroll container — DesktopContentWrapper (default mode) scrolls.
          No px — DCW provides horizontal spacing. Scrollbar flush at viewport edge. */}
      {!showKlassenarbeiten && !showSchulaufgaben && !showMeinTarif && !showLegal && !tempImageForEditing && (
      <div className="pb-32 space-y-4">
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

              {/* Glowing Background Ring */}
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(145deg, rgba(74,144,226,0.3), rgba(53,122,189,0.3))',
                  filter: 'blur(20px)',
                  transform: 'scale(1.1)',
                }}
              />

              {/* Profile Picture Button */}
              <button
                onClick={handleProfilePictureClick}
                className="relative"
              >
                {/* Main Picture Container */}
                <div 
                  className="w-[120px] h-[120px] rounded-full overflow-hidden relative"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                    border: '2px solid rgba(255,255,255,0.12)'
                  }}
                >
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A90E2] to-[#357ABD]">
                      <User className="w-[60px] h-[60px] text-white" strokeWidth={2} />
                    </div>
                  )}
                </div>

                {/* Floating Edit Button - Bottom Right */}
                <div
                  className="absolute bottom-0 right-0 w-[36px] h-[36px] rounded-full flex items-center justify-center pointer-events-none"
                  style={{
                    background: 'linear-gradient(145deg, #4A90E2 0%, #357ABD 100%)',
                    border: '2px solid #0a0a0a'
                  }}
                >
                  <Pencil className="w-[15px] h-[15px] text-white" strokeWidth={2.5} />
                </div>
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
                onClick={() => {
                  if (onShowKlassenarbeitenChange) {
                    onShowKlassenarbeitenChange(true);
                  }
                }}
                isFirst={true}
              />

              <MenuItem
                icon={<NotebookPen className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Schulaufgaben"
                onClick={() => setShowSchulaufgaben(true)}
              />

              <MenuItem
                icon={<GraduationCap className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Schule und Klasse"
                sublabel={[accountData.schoolType, accountData.grade ? `${accountData.grade}. Klasse` : null].filter(Boolean).join(', ') || undefined}
                onClick={() => setShowSchuleUndKlasse(true)}
              />

              <MenuItem
                icon={<BarChart3 className="w-[22px] h-[22px]" strokeWidth={2} />}
                label="Lernanalyse"
                iconColor="#00D4AA"
                onClick={() => {
                  if (onOpenLernanalyse) {
                    onOpenLernanalyse();
                  }
                }}
                isLast={true}
              />
            </SectionContainer>
          </div>

          {/* Tutoring Section – conditional on tutoringStatus */}
          <div>
            <SectionHeader title="Nachhilfe" />

            {/* STATE: notActivated */}
            {tutoringStatus === 'notActivated' && (
              <button
                onClick={() => onOpenTutoringActivation?.()}
                className="w-full rounded-2xl p-5 text-left transition-all duration-200 hover:bg-white/[0.02] active:scale-[0.98]"
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
                    <Zap className="w-6 h-6 text-white" />
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

            {/* STATE: requestSent */}
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
                    <p className="font-['Poppins:SemiBold',sans-serif] text-[14px] text-white">Anfrage gesendet</p>
                    <p className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/40">Dein Nachhilfe-Institut wird sich bald melden.</p>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/70 mb-2">{tutoringRequestData.selectedPartner?.name}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-white/30" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">{tutoringRequestData.selectedPartner?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-white/30" />
                      <span className="font-['Poppins:Regular',sans-serif] text-[12px] text-white/50">{tutoringRequestData.selectedPartner?.email}</span>
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
                <button
                  onClick={() => setTutoringStatus('activated')}
                  className="w-full px-4 py-3 transition-colors hover:bg-white/[0.02] active:bg-white/[0.03]"
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
                  className="w-full px-4 py-2 transition-colors hover:bg-white/[0.02] active:bg-white/[0.03]"
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

            {/* STATE: activated */}
            {tutoringStatus === 'activated' && (
              <>
              <SectionContainer>
                <MenuItem
                  icon={<BarChart3 className="w-[22px] h-[22px]" strokeWidth={2} />}
                  label="Fortschritt"
                  sublabel="AI-Lerneinblicke"
                  iconColor="#00B894"
                  onClick={() => onOpenTutoringProgress?.()}
                  isFirst={true}
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
                  iconColor="#00D4AA"
                  badgeText={`${extraLessonsAvailable} Verfügbar`}
                  badgeColor="#00D4AA"
                  onClick={() => console.log('Extra-Lessons clicked')}
                  isLast={true}
                />
              </SectionContainer>
              {/* Prototype: Deactivate Tutoring Button */}
              <button
                onClick={() => {
                  setTutoringStatus('notActivated');
                }}
                className="w-full px-4 py-2 mt-1 transition-colors hover:bg-white/[0.02] active:bg-white/[0.03]"
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
                onClick={() => setShowAccountEdit(true)}
                isFirst={true}
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
                isFirst={true}
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
      )}

      {/* Mein Tarif Screen - replaces profile content on Desktop */}
      {showMeinTarif && !tempImageForEditing && (
        <MeinTarifScreen
          onClose={() => setShowMeinTarif(false)}
          externalTransition={true}
          tutoringActive={tutoringStatus === 'activated'}
          onOpenCreditHistory={onOpenCreditHistory ? () => {
            setShowMeinTarif(false);
            setTimeout(() => onOpenCreditHistory(), 50);
          } : undefined}
        />
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

      {/* Legal Screen */}
      {showLegal && (
        <LegalScreen
          onClose={() => setShowLegal(null)}
          type={showLegal}
          externalTransition={true}
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