# Auth-Flow Dokumentation (Login & Registrierung)

> Stand: 10. März 2026 | Basierend auf aktuellem Codestand

---

## Architektur-Überblick

```
App.tsx
  └── <AuthWrapper>
        ├── NICHT eingeloggt → LoginScreen ODER RegisterScreen
        └── EINGELOGGT → <AppContent userData={...} onLogout={...} />
```

**Beteiligte Dateien:**
| Datei | Rolle |
|---|---|
| `/src/app/App.tsx` | Einstiegspunkt, rendert `<AuthWrapper>` als äußerste Schicht |
| `/src/app/components/AuthWrapper.tsx` | Auth-State-Management, entscheidet was gerendert wird |
| `/src/app/components/LoginScreen.tsx` | Login-UI (E-Mail + Passwort) |
| `/src/app/components/RegisterScreen.tsx` | Registrierungs-UI (7 Felder) |

---

## 1. Einstieg: App.tsx

```tsx
export default function App() {
  return (
    <AuthWrapper>
      {(userData, handleLogout) => (
        <AppContent userData={userData} onLogout={handleLogout} />
      )}
    </AuthWrapper>
  );
}
```

- `AuthWrapper` umschließt die gesamte App
- Render-Prop-Pattern: `children` ist eine Funktion `(userData, handleLogout) => ReactNode`
- Solange der User nicht eingeloggt ist, sieht er **nur** Login oder Register
- Nach erfolgreichem Login/Register wird `<AppContent>` gerendert

---

## 2. AuthWrapper.tsx - Das Gehirn

### State
```tsx
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [userData, setUserData] = useState<any>(null);
const [authView, setAuthView] = useState<'login' | 'register'>('login');
const [isCheckingAuth, setIsCheckingAuth] = useState(true);
```

### Ablauf beim App-Start

1. **Auth-Check** (`useEffect` bei Mount):
   - Liest `localStorage.getItem('isLoggedIn')` und `localStorage.getItem('userData')`
   - Wenn beides vorhanden und `isLoggedIn === 'true'` → User ist eingeloggt, App wird gerendert
   - Sonst → Login-Screen wird angezeigt
   - `isCheckingAuth` wird auf `false` gesetzt → Ladebildschirm verschwindet

2. **Test-User Seeding** (`useEffect` bei Mount, einmalig):
   - Prüft `localStorage.getItem('hasSeededTestUser')`
   - Wenn noch nicht geseeded und echte Supabase-Credentials vorhanden:
     - Ruft `GET /functions/v1/make-server-5cb2ed3a/auth/seed` auf
     - Erstellt den Test-User `alexanderbaum@gmail.com` / `12345678` serverseitig
   - Setzt `hasSeededTestUser = 'true'` in localStorage (auch bei Fehler → silent fail)

### Rendering-Logik

```
isCheckingAuth === true  → Ladebildschirm ("Lädt...")
isLoggedIn === false     → authView === 'login'    → <LoginScreen />
                           authView === 'register'  → <RegisterScreen />
isLoggedIn === true      → children(userData, handleLogout)
```

### Logout
```tsx
const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
  setIsLoggedIn(false);
  setUserData(null);
};
```
- Wird als Prop an `<AppContent>` durchgereicht
- Wird im Profil-Screen beim "Abmelden"-Button aufgerufen

---

## 3. LoginScreen.tsx - Anmelden

### Design
- Apple Vision Pro Style, zentriert auf `#0a0a0a`-Hintergrund
- Logo (Emoji + "SoStudy") oben
- Glassmorphism-Card mit den Eingabefeldern
- Teal-Gradient-Button "Anmelden"
- Link "Jetzt registrieren" darunter

### Felder
| Feld | Typ | Icon | Placeholder |
|---|---|---|---|
| E-Mail | `email` | `Mail` | `alexanderbaum@gmail.com` |
| Passwort | `password` (toggle) | `Lock` + `Eye/EyeOff` | `--------` |

### Props
```tsx
interface LoginScreenProps {
  onLoginSuccess: (userData: any) => void;
  onSwitchToRegister: () => void;
}
```

### Login-Logik (`handleLogin`)

**Validierung:**
- E-Mail und Passwort müssen ausgefüllt sein

**Zwei Modi:**

#### a) Echte Supabase-Credentials vorhanden
```
POST https://{projectId}.supabase.co/functions/v1/make-server-5cb2ed3a/auth/login
Headers: Content-Type: application/json, Authorization: Bearer {publicAnonKey}
Body: { email, password }
```
- Bei Erfolg: `localStorage` wird gesetzt, `onLoginSuccess(data.user)` wird aufgerufen
- Bei Fehler: Fehlermeldung wird angezeigt

#### b) Mock-Modus (Development, keine echten Credentials)
Zwei hardcoded Mock-User:

| E-Mail | Passwort | Vorname | Nachname |
|---|---|---|---|
| `alexanderbaum@gmail.com` | `12345678` | Alexander Johannes | Baum |
| `newuser@sostudytest.com` | `12345678` | Max | Mustermann |

- E-Mail wird lowercased + getrimmt
- Bei Match: `userData`-Objekt wird erstellt mit `userId: user_{emailPrefix}_mock_123`
- localStorage wird gesetzt, `onLoginSuccess(userData)` aufgerufen
- Bei Nicht-Match: Fehler "Ungültige E-Mail oder Passwort"

### UX-Details
- Enter-Taste im Passwort-Feld triggert Login
- Passwort-Sichtbarkeit umschaltbar (Eye/EyeOff)
- Loading-State: Button zeigt "Wird geladen..." und ist disabled
- Fehler: Rote Alert-Box mit `AlertCircle`-Icon

---

## 4. RegisterScreen.tsx - Registrieren

### Design
- Gleicher Apple Vision Pro Style wie Login
- Längeres Formular (scrollbar, `overflow-y-auto`)
- Gleiche Glassmorphism-Card

### Felder (7 Stück, in dieser Reihenfolge)
| Feld | Typ | Icon | UI-Element |
|---|---|---|---|
| Bundesland | Picker | `MapPin` | Dropdown (16 Bundesländer) |
| Schultyp | Picker | `GraduationCap` | Dropdown (6 Schultypen) |
| Klasse | Picker | `BookOpen` | 4-spaltige Button-Grid (1-13) |
| Vorname | `text` | `User` | Input (Placeholder: "Alexander") |
| Nachname | `text` | `User` | Input (Placeholder: "Baum") |
| E-Mail | `email` | `Mail` | Input (Placeholder: "alexanderbaum@gmail.com") |
| Passwort | `password` (toggle) | `Lock` + `Eye/EyeOff` | Input (Placeholder: "Mindestens 6 Zeichen") |

### Picker-Optionen

**Bundesländer (16):**
Baden-Württemberg, Bayern, Berlin, Brandenburg, Bremen, Hamburg, Hessen, Mecklenburg-Vorpommern, Niedersachsen, Nordrhein-Westfalen, Rheinland-Pfalz, Saarland, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen

**Schultypen (6):**
Grundschule, Hauptschule, Realschule, Gymnasium, Gesamtschule, Berufsschule

**Klassen (13):**
1-13 (als 4-spaltige Button-Grid)

### Props
```tsx
interface RegisterScreenProps {
  onRegisterSuccess: (userData: any) => void;
  onSwitchToLogin: () => void;
}
```

### Registrierungs-Logik (`handleRegister`)

**Validierung:**
- Alle 7 Felder müssen ausgefüllt sein
- Passwort muss mindestens 6 Zeichen lang sein

**Zwei Modi:**

#### a) Echte Supabase-Credentials vorhanden
```
POST https://{projectId}.supabase.co/functions/v1/make-server-5cb2ed3a/auth/register
Headers: Content-Type: application/json, Authorization: Bearer {publicAnonKey}
Body: { bundesland, schoolType, grade, firstName, lastName, email, password }
```
- Bei Erfolg: localStorage wird gesetzt, `onRegisterSuccess(data.user)` aufgerufen
- Bei Fehler: Fehlermeldung angezeigt

#### b) Mock-Modus (Development)
- Erstellt sofort ein `userData`-Objekt mit allen Formular-Daten
- `userId: user_{emailPrefix}_mock_{timestamp}`
- localStorage wird gesetzt, `onRegisterSuccess(userData)` aufgerufen
- **Keine E-Mail-Validierung** (Duplikat-Check etc.) im Mock-Modus

### UX-Details
- Picker-Dropdowns öffnen/schließen inline unter dem Button
- Bundesland-Dropdown hat `max-h-60 overflow-y-auto` (scrollbar)
- Klassen-Picker nutzt eine 4-Spalten-Grid-Ansicht statt Dropdown
- Enter-Taste im Passwort-Feld triggert Registrierung
- Link "Jetzt anmelden" am Ende wechselt zum LoginScreen

---

## 5. localStorage-Schema

| Key | Wert | Gesetzt von |
|---|---|---|
| `isLoggedIn` | `'true'` | LoginScreen, RegisterScreen |
| `userData` | JSON-String des User-Objekts | LoginScreen, RegisterScreen |
| `hasSeededTestUser` | `'true'` | AuthWrapper (einmalig) |

### userData-Objekt (Mock)
```json
{
  "email": "alexanderbaum@gmail.com",
  "firstName": "Alexander Johannes",
  "lastName": "Baum",
  "userId": "user_alexanderbaum_mock_123",
  "createdAt": "2026-03-10T..."
}
```

### userData-Objekt (Register, Mock)
```json
{
  "email": "neuer@user.de",
  "firstName": "Max",
  "lastName": "Mustermann",
  "bundesland": "Bayern",
  "schoolType": "Gymnasium",
  "grade": "10",
  "userId": "user_neuer_mock_1741600000000",
  "createdAt": "2026-03-10T..."
}
```

---

## 6. User-Flow-Diagramm

```
┌─────────────────────────────────────────────────────────┐
│                     APP START                            │
│                                                          │
│  localStorage hat 'isLoggedIn' === 'true'?               │
│         │                                                │
│    ┌────┴────┐                                           │
│    │  JA     │  NEIN                                     │
│    ▼         ▼                                           │
│  AppContent  LoginScreen                                 │
│  (Dashboard) ┌──────────────────────┐                    │
│              │ E-Mail               │                    │
│              │ Passwort             │                    │
│              │ [Anmelden]           │                    │
│              │                      │                    │
│              │ "Jetzt registrieren" ──────────┐          │
│              └────────┬─────────────┘          │          │
│                       │                        ▼          │
│                  Login OK?           RegisterScreen       │
│                  ┌──┴──┐            ┌──────────────────┐  │
│                  │ JA  │ NEIN       │ Bundesland       │  │
│                  ▼     ▼            │ Schultyp         │  │
│            AppContent  Error        │ Klasse           │  │
│                        anzeigen     │ Vorname          │  │
│                                     │ Nachname         │  │
│                                     │ E-Mail           │  │
│                                     │ Passwort         │  │
│                                     │ [Konto erstellen]│  │
│                                     │                  │  │
│                                     │ "Jetzt anmelden" ───┘
│                                     └───────┬──────────┘  │
│                                             │             │
│                                        Register OK?       │
│                                        ┌──┴──┐            │
│                                        │ JA  │ NEIN       │
│                                        ▼     ▼            │
│                                  AppContent  Error        │
│                                              anzeigen     │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Bekannte Einschränkungen / Offene Punkte

1. **Kein Onboarding-Flow nach Erstregistrierung** - User landet direkt im Dashboard ohne Einführung/Tutorial
2. **Kein "Passwort vergessen"** - Weder Link noch Funktionalität vorhanden
3. **Keine E-Mail-Verifizierung** - Weder im Mock- noch im Supabase-Modus
4. **Keine Passwort-Stärke-Anzeige** - Nur Mindestlänge 6 Zeichen wird geprüft
5. **Mock-User sind hardcoded** - Nur 2 Accounts im Dev-Modus verfügbar
6. **Keine "Remember me"-Option** - Login bleibt immer persistent via localStorage
7. **Keine Session-Expiry** - Einmal eingeloggt = für immer eingeloggt (bis Logout oder localStorage.clear())
8. **Picker-Dropdowns sind nicht barrierefrei** - Keine Keyboard-Navigation, kein ARIA
9. **Register-Daten (Bundesland, Schultyp, Klasse) werden im Mock-Modus nur lokal gespeichert** - keine Synchronisation mit dem UserContext-Default (Gymnasium, 10. Klasse)
10. **Kein Social Login** (Google, Apple etc.)
11. **Keine Rate-Limiting** - Keine Schutzmaßnahmen gegen Brute-Force im Frontend

---

## 8. Supabase API Endpoints

| Endpoint | Methode | Zweck |
|---|---|---|
| `/auth/login` | POST | Login mit E-Mail + Passwort |
| `/auth/register` | POST | Neues Konto erstellen |
| `/auth/seed` | GET | Test-User erstellen (Development) |

Basis-URL: `https://{projectId}.supabase.co/functions/v1/make-server-5cb2ed3a`
Auth-Header: `Authorization: Bearer {publicAnonKey}`
