// ==================== EXAM TIMER HOOK ====================
// Extrahiert aus App.tsx - Timer-Logik für die Prüfungssimulation
// Verantwortlich für: Timer-State, Countdown, Auto-Submit bei 0, formatTime()

import { useState, useEffect, useCallback } from 'react';

interface UseExamTimerProps {
  initialMinutes?: number;
  screen: string;
  examCompleted: boolean;
  onTimeUp: () => void;
}

interface UseExamTimerReturn {
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  examDuration: number;
  setExamDuration: React.Dispatch<React.SetStateAction<number>>;
  formatTime: (seconds: number) => string;
}

export function useExamTimer({
  initialMinutes = 10,
  screen,
  examCompleted,
  onTimeUp,
}: UseExamTimerProps): UseExamTimerReturn {
  const [timer, setTimer] = useState(initialMinutes * 60); // Timer in seconds
  const [examDuration, setExamDuration] = useState(initialMinutes); // Store selected exam duration in minutes for resets

  // Timer countdown - Runs during both 'question' and 'feedback' screens (Simulator 1 & 2)
  useEffect(() => {
    if ((screen === 'question' || screen === 'feedback') && timer > 0 && !examCompleted) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [screen, timer, examCompleted]);

  // Auto-submit exam when timer reaches 0
  useEffect(() => {
    if ((screen === 'question' || screen === 'feedback') && timer === 0 && !examCompleted) {
      // Zeit ist abgelaufen - Prüfung automatisch beenden
      console.log('⏰ Zeit abgelaufen - Prüfung wird automatisch beendet');
      onTimeUp();
    }
  }, [timer, screen, examCompleted]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timer,
    setTimer,
    examDuration,
    setExamDuration,
    formatTime,
  };
}
