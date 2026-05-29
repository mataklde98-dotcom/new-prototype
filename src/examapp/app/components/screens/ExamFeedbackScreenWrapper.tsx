// ==================== EXAM FEEDBACK SCREEN ====================
// Extrahiert aus App.tsx - Feedback nach Prüfungsabschluss
// 1:1 Kopie des screen === 'examFeedback' Blocks

import FeedbackScreen from '../FeedbackScreen';
import MobileViewportLayout from './MobileViewportLayout';

interface ExamFeedbackScreenProps {
  onSubmit: (difficulty: number, comment?: string) => void;
  onSkip: () => void;
}

export default function ExamFeedbackScreenWrapper({ onSubmit, onSkip }: ExamFeedbackScreenProps) {
  return (
    <MobileViewportLayout>
      <FeedbackScreen
        onSubmit={onSubmit}
        onSkip={onSkip}
      />
    </MobileViewportLayout>
  );
}
