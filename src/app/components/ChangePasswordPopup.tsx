// ===== CHANGE PASSWORD POPUP =====
// Bottom-Sheet Popup für Passwort ändern
// Premium SaaS Style (Linear/Vercel)

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Lock, X, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

interface ChangePasswordPopupProps {
  onClose: () => void;
}

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function ChangePasswordPopup({ onClose }: ChangePasswordPopupProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation state
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Password requirements
  const requirements: PasswordRequirement[] = [
    { label: 'Mindestens 8 Zeichen', met: newPassword.length >= 8 },
    { label: 'Einen Großbuchstaben', met: /[A-Z]/.test(newPassword) },
    { label: 'Einen Kleinbuchstaben', met: /[a-z]/.test(newPassword) },
    { label: 'Eine Zahl', met: /[0-9]/.test(newPassword) },
    { label: 'Ein Sonderzeichen', met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const allRequirementsMet = requirements.every(r => r.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword.length > 0 && allRequirementsMet && passwordsMatch && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Simulate success (in production this would call Supabase)
    setIsSubmitting(false);
    setSuccess(true);

    // Auto-close after success
    setTimeout(() => {
      handleClose();
    }, 1800);
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`relative w-full max-w-[500px] max-h-[90vh] bg-[#141414] border border-white/[0.08] rounded-t-[20px] overflow-hidden transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-[5px] rounded-full bg-white/[0.15]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-white/60" strokeWidth={2} />
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[17px] text-white">
              Passwort ändern
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center active:bg-white/[0.12] transition-colors"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className="w-4 h-4 text-white/60" strokeWidth={2} />
          </button>
        </div>

        <div className="h-px bg-white/[0.06]" />

        {/* Scrollable Content */}
        <div
          className="overflow-y-auto px-5 pb-10 pt-5 scrollbar-thin"
          style={{ maxHeight: 'calc(90vh - 100px)', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Success State */}
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#10B981]" strokeWidth={2} />
              </div>
              <div className="text-center">
                <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-white mb-1">
                  Passwort geändert
                </p>
                <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-white/40">
                  Dein Passwort wurde erfolgreich aktualisiert.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FF4444]/10 border border-[#FF4444]/20 mb-4">
                  <AlertCircle className="w-4 h-4 text-[#FF4444] flex-shrink-0" strokeWidth={2} />
                  <p className="font-['Poppins:Regular',sans-serif] text-[13px] text-[#FF4444]">
                    {error}
                  </p>
                </div>
              )}

              {/* Current Password */}
              <div className="mb-5">
                <label className="block font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 mb-2">
                  Aktuelles Passwort
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => { setCurrentPassword(e.target.value); setError(null); }}
                    placeholder="Aktuelles Passwort eingeben"
                    className="w-full h-[48px] px-4 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-['Poppins:Regular',sans-serif] text-[14px] placeholder:text-white/20 outline-none focus:border-white/[0.20] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/[0.06] transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-5" />

              {/* New Password */}
              <div className="mb-4">
                <label className="block font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 mb-2">
                  Neues Passwort
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Neues Passwort eingeben"
                    className="w-full h-[48px] px-4 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-['Poppins:Regular',sans-serif] text-[14px] placeholder:text-white/20 outline-none focus:border-white/[0.20] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/[0.06] transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {newPassword.length > 0 && (
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3 mb-5">
                  <div className="grid grid-cols-1 gap-1.5">
                    {requirements.map((req) => (
                      <div key={req.label} className="flex items-center gap-2">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 flex-shrink-0 transition-colors duration-200 ${
                            req.met ? 'text-[#10B981]' : 'text-white/15'
                          }`}
                          strokeWidth={2.5}
                        />
                        <span
                          className={`font-['Poppins:Regular',sans-serif] text-[12px] transition-colors duration-200 ${
                            req.met ? 'text-white/60' : 'text-white/25'
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block font-['Poppins:Medium',sans-serif] text-[13px] text-white/50 mb-2">
                  Neues Passwort bestätigen
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Passwort wiederholen"
                    className={`w-full h-[48px] px-4 pr-12 rounded-xl bg-white/[0.04] border text-white font-['Poppins:Regular',sans-serif] text-[14px] placeholder:text-white/20 outline-none transition-colors ${
                      confirmPassword.length > 0
                        ? passwordsMatch
                          ? 'border-[#10B981]/30 focus:border-[#10B981]/50'
                          : 'border-[#FF4444]/30 focus:border-[#FF4444]/50'
                        : 'border-white/[0.08] focus:border-white/[0.20]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/[0.06] transition-colors"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    ) : (
                      <Eye className="w-[18px] h-[18px] text-white/30" strokeWidth={2} />
                    )}
                  </button>
                </div>
                {/* Mismatch hint */}
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-[#FF4444]/70 mt-1.5 ml-1">
                    Passwörter stimmen nicht überein
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`w-full h-[48px] rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px] transition-all duration-200 border ${
                  canSubmit
                    ? 'bg-white/[0.06] border-white/[0.12] text-white active:bg-white/[0.10] active:scale-[0.98]'
                    : 'bg-white/[0.03] border-white/[0.06] text-white/20 cursor-not-allowed'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Wird gespeichert...</span>
                  </div>
                ) : (
                  'Passwort ändern'
                )}
              </button>

              {/* Info Text */}
              <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20 text-center mt-4 px-2 leading-[16px]">
                Nach der Änderung wirst du auf allen anderen Geräten automatisch abgemeldet.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}