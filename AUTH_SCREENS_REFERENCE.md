# SoStudy Auth Screens - Design Reference

Dieses Dokument beschreibt den kompletten Aufbau der Login-, Registrierungs- und Onboarding-Screens.
Verwende es zusammen mit `DESIGN_SYSTEM_REFERENCE.md` fuer ein visuell identisches Auth-System.

---

## 1. Architektur-Uebersicht

```
AuthWrapper (State Machine)
  ├── LoginScreen          (E-Mail + Passwort + Social Login)
  ├── RegisterScreen       (2-3 Steps mit StepIndicator)
  │     ├── Step 1: UserType Selection (Schueler / Elternteil)
  │     ├── Step 2: Registration Form (Felder + CTA)
  │     └── Step 3: OTP Verification (4-stelliger Code)
  └── [App Content]        (nach erfolgreichem Login)

Post-Login:
  └── OnboardingTrialPopup (Multi-Step Portal-Modal, z-index 9999)
```

### AuthWrapper-Pattern
```tsx
// State: 'login' | 'register'
// Prueft localStorage auf bestehende Session
// Social Auth Info wird zwischen Login → Register weitergereicht

interface SocialAuthInfo {
  provider: 'google' | 'apple';
  email: string;
  firstName?: string;
  lastName?: string;
}
```

---

## 2. Login Screen

### Layout
```
[Vollbild-Container, fixed inset-0, zentriert]
  ├── Logo (SoStudyLogo, h-10, mb-8)
  ├── Subtitle ("Anmelden und weiter lernen", text-white/60, 15px)
  ├── Glass Card (Login-Formular)
  ├── Register-Link
  ├── Divider ("oder")
  └── Social Login Buttons (Google + Apple, nebeneinander)
```

### Globaler Hintergrund
```tsx
background: '#0a0a0a'
// Container: fixed inset-0, overflow-y-auto, flex items-center justify-center
// Innerer Wrapper: max-w-md, px-5, py-10
```

### Glass Card (Login-Formular)
```tsx
className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03] border border-white/[0.10] rounded-3xl p-6 mb-4"
```

**Inhalt der Card:**
1. Error Message (bedingt)
2. E-Mail Input
3. Passwort Input
4. Login Button

### Input-Felder
```tsx
// Container:
<div className="relative">
  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
  <input
    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
               pl-12 pr-4 py-3.5
               text-white font-['Poppins:Regular',sans-serif]
               placeholder:text-white/30
               outline-none focus:border-white/[0.25] transition-colors"
  />
</div>

// Label ueber dem Input:
<label className="block text-white/80 font-['Poppins:Medium',sans-serif] text-sm mb-2">
```

**E-Mail Input:**
- Icon: `Mail` (Lucide), links, `text-white/40`
- Padding: `pl-12 pr-4`

**Passwort Input:**
- Icon links: `Lock` (Lucide), `text-white/40`
- Icon rechts: `Eye` / `EyeOff` toggle button, `text-white/40`
- Padding: `px-12` (beide Seiten fuer Icons)

### Login Button
```tsx
// Identisch zum systemweiten Button:
background: rgba(0, 184, 148, 0.07)
border: 1px solid rgba(0, 184, 148, 0.25)
color: rgba(255, 255, 255, 0.9)

// Loading State:
background: rgba(255, 255, 255, 0.04)
border: 1px solid rgba(255, 255, 255, 0.06)
color: rgba(255, 255, 255, 0.3)
text: "Wird geladen..."

// Klassen:
className="w-full font-['Poppins:SemiBold',sans-serif] text-[14px] py-3.5 rounded-xl
           active:scale-[0.98] transition-all duration-200
           disabled:opacity-30 disabled:cursor-not-allowed"
```

### Error Message
```tsx
<div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
  <AlertCircle className="w-5 h-5 text-red-400" />
  <span className="text-red-200 text-sm font-['Poppins:Regular',sans-serif]">
    {error}
  </span>
</div>
```

### Register-Link (unter der Card)
```tsx
<div className="text-center">
  <span className="text-white/60 font-['Poppins:Regular',sans-serif] text-sm">
    Noch kein Konto?{' '}
  </span>
  <button className="text-white font-['Poppins:SemiBold',sans-serif] text-sm active:opacity-70 transition-opacity">
    Jetzt registrieren
  </button>
</div>
```

### Divider
```tsx
<div className="flex items-center gap-4 my-5">
  <div className="flex-1 h-px bg-white/[0.06]" />
  <span className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/25 uppercase tracking-widest">
    oder
  </span>
  <div className="flex-1 h-px bg-white/[0.06]" />
</div>
```

### Social Login Buttons (Google + Apple)
```tsx
<div className="flex gap-3">
  {/* Jeder Button: */}
  <button className="flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl
                      bg-white/[0.04] border border-white/[0.08]
                      active:scale-[0.97] active:bg-white/[0.07]
                      transition-all duration-150
                      disabled:opacity-50 disabled:active:scale-100">
    {/* Google: Mehrfarbiges SVG-Logo (18x18) */}
    {/* Apple: Weisses Apple SVG-Logo (16x18) */}
    <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-white/60">
      Google / Apple
    </span>
  </button>
</div>

// Loading-State: Spinning border circle
<div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
```

**Google SVG (Mehrfarbig, 18x18):**
```svg
<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
  <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844..." fill="#4285F4"/>
  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259..." fill="#34A853"/>
  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593..." fill="#FBBC05"/>
  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58..." fill="#EA4335"/>
</svg>
```

**Apple SVG (Weiss, 16x20):**
```svg
<svg width="16" height="18" viewBox="0 0 16 20" fill="white">
  <path d="M13.04 10.58c-.03-2.78 2.27-4.12 2.37-4.18..."/>
</svg>
```

---

## 3. Register Screen

### Layout (Outer Shell)
```tsx
// Identisch zum Login: fixed inset-0, #0a0a0a, scrollbar-hide
<div className="fixed inset-0 overflow-y-auto px-5 py-8 scrollbar-hide"
     style={{ background: '#0a0a0a' }}>
  <div className="w-full max-w-md mx-auto">
    {/* Logo (kleiner als Login) */}
    <SoStudyLogo className="h-7 mx-auto mb-1.5" />
    <p className="text-white/60 font-['Poppins:Regular',sans-serif] text-[13px]">
      Jetzt kostenlos registrieren
    </p>

    {/* Step Indicator */}
    <StepIndicator currentStep={n} totalSteps={2|3} />

    {/* Glass Card (gleich wie Login) */}
    <div className="relative bg-gradient-to-br from-white/[0.06] to-white/[0.03]
                    border border-white/[0.10] rounded-3xl p-6 mb-4">
      {/* Step Content */}
    </div>

    {/* Login Link */}
  </div>
</div>
```

### 3.1 StepIndicator

Kreise mit Nummern, verbunden durch Linien. Aktiver Step = skaliert, erledigter Step = Checkmark.

```tsx
// Container:
<div className="flex items-center gap-2 justify-center mb-8">

// Verbindungslinie zwischen Steps:
<div className="h-[2px] w-6 sm:w-8 rounded-full"
     style={{ background: isCompleted ? 'rgba(0,184,148,0.5)' : 'rgba(0,184,148,0.1)' }} />

// Step-Kreis (32x32px):
style={{
  width: 32, height: 32,
  backgroundColor: isCompleted
    ? 'rgba(0,184,148,0.2)'
    : isActive
      ? 'rgba(0,184,148,0.15)'
      : 'rgba(0,184,148,0.06)',
  border: isCompleted
    ? '1.5px solid rgba(0,184,148,0.5)'
    : isActive
      ? '1.5px solid rgba(0,184,148,0.45)'
      : '1px solid rgba(0,184,148,0.2)',
  transform: isActive ? 'scale(1)' : 'scale(0.75)',
  // Transitions:
  transition: 'transform 0.45s cubic-bezier(0.25, 0.1, 0.25, 1),
               background-color 0.45s ease, border-color 0.45s ease',
}}

// Checkmark (SVG, 12x12):
stroke="rgba(0,184,148,0.9)" strokeWidth="1.8"
// Einblende-Animation: opacity 0→1, scale 0.3→1, 350ms

// Nummer:
className="font-['Poppins:SemiBold',sans-serif]"
fontSize: isActive ? 13 : 11
color: isActive ? 'rgba(0,184,148,0.95)' : 'rgba(0,184,148,0.5)'
// Ausblende-Animation: opacity 1→0, scale 1→0.5, 250ms
```

### 3.2 Step 1: UserType Selection

**StepHeader:**
```tsx
<h2 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-white mb-1.5 tracking-tight">
  Wer wird registriert?
</h2>
<p className="font-['Poppins:Regular',sans-serif] text-[14px] text-white/50 leading-relaxed">
  Waehle aus, fuer wen dieses Konto erstellt wird.
</p>
```

**SelectionCard (wiederverwendbare Komponente):**
```tsx
// Unselected:
background: rgba(255,255,255,0.03)
border: 1.5px solid rgba(255,255,255,0.08)

// Selected:
background: linear-gradient(135deg, rgba(0,184,148,0.12), rgba(0,147,121,0.06))
border: 1.5px solid rgba(0,184,148,0.4)
// + Radial Glow Overlay: radial-gradient(circle at 30% 40%, rgba(0,184,148,0.25), transparent 70%)

// Layout: flex items-start gap-4, p-5, rounded-2xl
// Links: Icon-Box (48x48, rounded-xl)
//   Unselected: bg rgba(255,255,255,0.06), border rgba(255,255,255,0.08)
//   Selected:   gradient #00B894 → #009379, keine border
// Mitte: Titel (15px, SemiBold) + Beschreibung (13px, Regular)
// Rechts: Radio-Indikator (20x20px, rounded-full)
//   Unselected: border 2px rgba(255,255,255,0.15), transparent
//   Selected:   border 2px #00B894 + innerer Dot (10x10px, #00B894)

// Interaction:
active:scale-[0.98]
WebkitTapHighlightColor: transparent
```

### 3.3 Step 2: Registration Form

**Header mit Back-Button:**
```tsx
<div className="flex items-center mb-1.5">
  {/* Back Button: */}
  <button className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center
                      text-white/50 active:text-white/80 active:bg-white/[0.06] transition-colors">
    <ArrowLeft className="w-4 h-4 text-white/60" />
  </button>
  {/* Titel zentriert (pr-9 kompensiert den Back-Button): */}
  <h2 className="flex-1 text-center font-['Poppins:SemiBold',sans-serif] text-[22px] text-white tracking-tight pr-9">
    Konto erstellen
  </h2>
</div>
```

**Formularfelder (alle identisch gestylt):**

| Feld | Icon (links) | Typ |
|------|-------------|-----|
| Bundesland | `MapPin` | Native `<select>` mit `appearance-none` |
| Schultyp | `GraduationCap` | Native `<select>` mit `appearance-none` |
| Klasse | `BookOpen` | Native `<select>` mit `appearance-none` |
| Vor-/Nachname | `User` | Text-Input |
| E-Mail | `Mail` | E-Mail-Input |
| Passwort | `Lock` + `Eye`/`EyeOff` rechts | Password-Input |

**Native Select Styling (in Register):**
```tsx
<select className="w-full appearance-none bg-white/[0.04] border border-white/[0.08]
                   rounded-xl pl-12 pr-12 py-3.5
                   font-['Poppins:Regular',sans-serif]
                   outline-none focus:border-white/[0.25] transition-colors
                   {hasValue ? 'text-white' : 'text-white/30'}">
// ChevronDown icon rechts (absolut positioniert, text-white/40)
```

**Info-Badge (Social Auth / Eltern-Hinweis):**
```tsx
<div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
     style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.15)' }}>
  <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(0,184,148,0.8)' }} />
  <p className="font-['Poppins:Regular',sans-serif] text-[12px] leading-relaxed"
     style={{ color: 'rgba(0,184,148,0.7)' }}>
    Hinweistext...
  </p>
</div>
```

**Section Divider (Eltern-Flow):**
```tsx
<div className="flex items-center gap-3 my-6">
  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
  <span className="font-['Poppins:Medium',sans-serif] text-[12px] text-white/40 uppercase tracking-wider">
    Label
  </span>
  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
</div>
```

### 3.4 Step 3: OTP Verification

**4-Digit Input:**
```tsx
<div className="flex justify-center gap-3 mb-6">
  {[0,1,2,3].map(i => (
    <input
      type="text" inputMode="numeric" maxLength={1}
      className="w-14 h-14 text-center text-[22px]
                 font-['Poppins:SemiBold',sans-serif] text-white
                 bg-white/[0.04] rounded-xl outline-none
                 transition-all duration-200"
      // Border-States:
      // Leer:    border border-white/[0.08]
      // Gefuellt: border-2, borderColor: rgba(0,184,148,0.5)
      // Falsch:  border-2, borderColor: rgba(239,68,68,0.5)
    />
  ))}
</div>
```

**Shake-Animation (falscher Code):**
```css
@keyframes otpShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}
```

**Verified Badge:**
```tsx
<div className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl"
     style={{
       background: 'rgba(0,184,148,0.1)',
       border: '1px solid rgba(0,184,148,0.25)',
       animation: 'otpVerifiedFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
     }}>
  <CheckCircle className="w-[18px] h-[18px]" style={{ color: '#00B894' }} />
  <span className="font-['Poppins:SemiBold',sans-serif] text-[14px]" style={{ color: '#00B894' }}>
    Verifiziert
  </span>
</div>
```

**Resend Link:**
```tsx
// Cooldown: text-white/30, "Erneut senden in {n}s"
// Aktiv:    color #00B894, "Code erneut senden"
// Font: Poppins Medium, 13px
```

---

## 4. CTAButton (wiederverwendbar)

```tsx
// Identisch zum systemweiten Button, aber inline definiert im RegisterScreen:
<button
  className="w-full py-3.5 rounded-xl font-['Poppins:SemiBold',sans-serif] text-[14px]
             transition-all duration-200 active:scale-[0.98]
             disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
  style={{
    background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(0,184,148,0.07)',
    border: disabled ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,184,148,0.25)',
    color: disabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
  }}
>
  {isLoading ? 'Wird geladen...' : label}
</button>
```

---

## 5. Onboarding Trial Popup (Post-Login)

Wird nach der ersten Registrierung angezeigt. Mehrstufiges Portal-Modal.

```tsx
// Rendering via: ReactDOM.createPortal(jsx, document.body)
// z-index: 9999
// Pruefung: localStorage.getItem('isNewRegistration') === 'true'
```

### Aufbau
```
Step 1: Hero Statement (Logo + Willkommen)
Step 2: Feature-Karten (KI-Funktionen)
Step 3: AI-Enhanced Tutoring
Step 4: Trial-Info + Referral + CTA
```

---

## 6. Wichtige Patterns

### Loading Spinner (Social Auth)
```tsx
<div className="w-[18px] h-[18px] border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
```

### Password Toggle
```tsx
<button
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 active:scale-95 transition-transform"
>
  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
</button>
```

### Formular-Spacing
```
Label → Input:    mb-2
Input → Input:    mb-4
Letzes Input → Button: mb-6
Card → Link:      mb-4
```

### Dev Hint Box
```tsx
<div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/20" />
  <p className="font-['Poppins:Regular',sans-serif] text-[11px] text-white/20">
    Demo-Modus Hinweis...
  </p>
</div>
```

---

## 7. Auth Flow Zusammenfassung

```
1. AuthWrapper prueft localStorage('isLoggedIn')
2. Nicht eingeloggt → LoginScreen
3. Login erfolgreich → userData in localStorage + State
4. "Jetzt registrieren" → RegisterScreen
5. Social Auth → SocialAuthInfo an RegisterScreen weitergeben
6. Register Step 1 → UserType (Schueler/Elternteil)
7. Register Step 2 → Formular
8. Register Step 3 → OTP (nur bei normalem Flow, nicht bei Social Auth)
9. OTP verifiziert → Auto-Register nach 1.8s
10. Erste Anmeldung → OnboardingTrialPopup
11. Logout → localStorage leeren, zurueck zu LoginScreen
```
