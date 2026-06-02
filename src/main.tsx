import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import NewRegistrationFlow from "./app/components/onboarding/NewRegistrationFlow";
import "./styles/index.css";
import { applyDemoFromQuery } from "./lib/demoSeed";

// NewRegistrationFlow (28-Mai-Wireframe) ist jetzt die STANDARD-Einstiegsstrecke für
// ausgeloggte Nutzer — kein Slug mehr nötig. Sobald eine Session besteht (Registrierung
// oder Login abgeschlossen → isLoggedIn + userData in localStorage), übernimmt die
// Haupt-App <App/> und zeigt Home/Dashboard. Genau diese Keys liest auch AuthWrapper.
function hasSession(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('userData');
  } catch {
    return false;
  }
}

// Einladungs-Deep-Links (?invite / ?parentinvite) gehen weiterhin direkt in die Haupt-App,
// damit die bestehenden Annehmen-Flows in AuthWrapper erreichbar bleiben.
function hasInviteDeepLink(): boolean {
  if (typeof window === 'undefined') return false;
  const search = window.location.search || '';
  return search.includes('invite');
}

// Eingeloggt oder Einladungs-Link → Haupt-App; sonst die neue Registrierungs-/Login-Strecke.
function showMainApp(): boolean {
  return hasSession() || hasInviteDeepLink();
}

// Force rebuild v1.6.7

// ===== PREVENT ALL ZOOM - PINCH, DOUBLE-TAP, KEYBOARD (iOS PWA Native App Behavior) =====

// 1. Prevent pinch-to-zoom with gesture events
document.addEventListener('gesturestart', (e) => e.preventDefault());
document.addEventListener('gesturechange', (e) => e.preventDefault());
document.addEventListener('gestureend', (e) => e.preventDefault());

// 2. Prevent multi-touch zoom
let lastTouchEnd = 0;
document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// 3. Prevent double-tap zoom
document.addEventListener('touchend', (e) => {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

// 4. Prevent keyboard zoom on input focus (iOS)
document.addEventListener('touchstart', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
    const inputElement = target as HTMLInputElement;
    // Ensure font-size is at least 16px to prevent iOS zoom
    const computedStyle = window.getComputedStyle(inputElement);
    const fontSize = parseFloat(computedStyle.fontSize);
    if (fontSize < 16) {
      inputElement.style.fontSize = '16px';
    }
  }
});

// 5. Prevent wheel zoom (Ctrl + Scroll on desktop)
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}, { passive: false });

// Deep-Link-Demo-Zustände (?demo=...) vor dem Rendern anwenden; lädt ggf. einmal neu.
if (!applyDemoFromQuery()) {
  // Globale ErrorBoundary um die GESAMTE App: Fängt Render-Abstürze auch in Auth-,
  // Onboarding- und Eltern-Flows ab (die innere Boundary in App.tsx umschließt nur AppContent).
  // Statt eines schwarzen Bildschirms erscheint die Wiederherstellungs-Karte.
  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      {showMainApp() ? <App /> : <NewRegistrationFlow />}
    </ErrorBoundary>
  );
}