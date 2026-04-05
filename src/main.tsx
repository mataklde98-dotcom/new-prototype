import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

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

createRoot(document.getElementById("root")!).render(<App />);