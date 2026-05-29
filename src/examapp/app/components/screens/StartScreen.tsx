// ==================== START SCREEN ====================
// Extrahiert aus App.tsx - Prüfung wird erstellt (Ladeanimation)
// 1:1 Kopie des screen === 'start' Blocks

import PrufungErstellen from '../../../imports/PrufungErstellen';
import MobileViewportLayout from './MobileViewportLayout';

interface StartScreenProps {
  onStartClick: () => void;
  isCreatingExam: boolean;
}

export default function StartScreen({ onStartClick, isCreatingExam }: StartScreenProps) {
  return (
    <MobileViewportLayout>
      <PrufungErstellen onStartClick={onStartClick} isCreating={isCreatingExam} />
    </MobileViewportLayout>
  );
}
