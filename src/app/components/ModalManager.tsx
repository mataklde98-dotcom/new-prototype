// ===== MODAL MANAGER =====
// Manages all app-level modals in one place
// 🚀 PURE CSS ANIMATIONS - NO BACKDROP - 120fps Performance

import React, { useState, useEffect, useRef } from 'react';
import './ModalManager.css';
import ExamSimulationApp from '@/examapp/app/App';
import GenerateFlashcardsApp from '@/flashcardgen/GenerateFlashcardsApp';
import FlashcardSetView from '@/flashcardgen/components/FlashcardSetView';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ContentStoreProvider } from '@/shared-content-store/ContentStore';
import { FlashcardSet } from '@/types/flashcard';
import { DeleteMode } from '@/hooks/useDeleteModal';
import type { CompletedExam } from '@/examapp/utils/completedExamsStorage';

interface SelectedFlashcardSetData {
  setId: number;
  setName: string;
  subtopicName: string;
  subject: string;
  cards: Array<{
    id: string;
    question: string;
    answer: string;
    confidenceScore?: number;
  }>;
}

interface ModalManagerProps {
  // Modal States
  showExamSimulation: boolean;
  showGenerateFlashcards: boolean;
  showFlashcardSetView: boolean;
  showDeleteConfirm: boolean;

  // Modal Data
  selectedFlashcardSet: SelectedFlashcardSetData | null;
  deleteMode: DeleteMode;
  selectedCount: number;
  filteredCount: number;
  totalCount: number;

  // Data
  allSets: FlashcardSet[];
  
  // ✅ Completed Exam Review
  reviewingCompletedExam?: CompletedExam | null;

  // Weakness Context (from Lernanalyse)
  weaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo' } | null;

  // Exam Weakness Context (from Lernanalyse — pre-fill exam simulation)
  examWeaknessContext?: { topic: string; subject: string; severity: string; recommendation: string; source?: 'weakness' | 'risk' | 'knowledge-gap' | 'teacher-task' | 'practice' | 'prep-todo'; examTitle?: string; examDurationMinutes?: number; assignedDate?: string } | null;

  // Handlers
  isMobile: boolean;
  onCloseExamSimulation: () => void;
  onCloseGenerateFlashcards: () => void;
  onCloseFlashcardSetView: () => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onFlashcardSetCreated: (newSet: FlashcardSet) => void;
  onFlashcardProgressUpdate: (setId: number, progress: number, cards: any[]) => void;
}

type AnimationState = 'entering' | 'active' | 'exiting';

export default function ModalManager({
  showExamSimulation,
  showGenerateFlashcards,
  showFlashcardSetView,
  showDeleteConfirm,
  selectedFlashcardSet,
  deleteMode,
  selectedCount,
  filteredCount,
  totalCount,
  allSets,
  reviewingCompletedExam,
  weaknessContext,
  examWeaknessContext,
  isMobile,
  onCloseExamSimulation,
  onCloseGenerateFlashcards,
  onCloseFlashcardSetView,
  onCloseDeleteModal,
  onConfirmDelete,
  onFlashcardSetCreated,
  onFlashcardProgressUpdate,
}: ModalManagerProps) {
  // 🚀 Pure CSS Animation States (like ScreenManager)
  const [examSimState, setExamSimState] = useState<AnimationState>('entering');
  const [genFlashState, setGenFlashState] = useState<AnimationState>('entering');
  const [flashSetState, setFlashSetState] = useState<AnimationState>('entering');

  // 🚀 Mount States (for controlled unmount after exit animation)
  const [isExamSimMounted, setIsExamSimMounted] = useState(false);
  const [isGenFlashMounted, setIsGenFlashMounted] = useState(false);
  const [isFlashSetMounted, setIsFlashSetMounted] = useState(false);

  // 🔥 Track if modals were ever mounted (to avoid exit animation on initial load)
  const wasExamSimMountedRef = useRef(false);
  const wasGenFlashMountedRef = useRef(false);
  const wasFlashSetMountedRef = useRef(false);

  // ========== EXAM SIMULATION ANIMATION ==========
  useEffect(() => {
    // Desktop: ExamSimulation renders inline via ContentRouter, skip modal
    if (!isMobile) return;
    
    if (showExamSimulation) {
      // Mount immediately + start entering animation
      setIsExamSimMounted(true);
      wasExamSimMountedRef.current = true;
      setExamSimState('entering');
      
      // Transition to active after 300ms
      const timer = setTimeout(() => {
        setExamSimState('active');
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (wasExamSimMountedRef.current) {
      // Start exit animation ONLY if modal was previously mounted
      setExamSimState('exiting');
      
      // Unmount after exit animation completes (300ms)
      const timer = setTimeout(() => {
        setIsExamSimMounted(false);
        wasExamSimMountedRef.current = false;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showExamSimulation, isMobile]);

  // ========== GENERATE FLASHCARDS ANIMATION ==========
  useEffect(() => {
    if (showGenerateFlashcards) {
      setIsGenFlashMounted(true);
      wasGenFlashMountedRef.current = true;
      setGenFlashState('entering');
      
      const timer = setTimeout(() => {
        setGenFlashState('active');
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (wasGenFlashMountedRef.current) {
      // Start exit animation ONLY if modal was previously mounted
      setGenFlashState('exiting');
      
      const timer = setTimeout(() => {
        setIsGenFlashMounted(false);
        wasGenFlashMountedRef.current = false;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showGenerateFlashcards]);

  // ========== FLASHCARD SET VIEW ANIMATION ==========
  useEffect(() => {
    if (showFlashcardSetView) {
      setIsFlashSetMounted(true);
      wasFlashSetMountedRef.current = true;
      setFlashSetState('entering');
      
      const timer = setTimeout(() => {
        setFlashSetState('active');
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (wasFlashSetMountedRef.current) {
      // Start exit animation ONLY if modal was previously mounted
      setFlashSetState('exiting');
      
      const timer = setTimeout(() => {
        setIsFlashSetMounted(false);
        wasFlashSetMountedRef.current = false;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [showFlashcardSetView]);

  // ========== ANIMATION CLASS HELPERS ==========
  const getAnimationClass = (state: AnimationState, deviceType: 'mobile' | 'desktop') => {
    const prefix = deviceType === 'mobile' ? 'modal' : 'modal';
    const suffix = deviceType === 'mobile' ? 'mobile' : 'desktop';
    
    if (state === 'entering') return `${prefix}-entering-${suffix}`;
    if (state === 'exiting') return `${prefix}-exiting-${suffix}`;
    return `${prefix}-active-${suffix}`;
  };

  const currentDevice = isMobile ? 'mobile' : 'desktop';

  return (
    <>
      {/* Exam Simulation Modal — only on Mobile (Desktop uses inline ContentRouter) */}
      {isExamSimMounted && isMobile && (
        <ContentStoreProvider>
          <div 
            className={`modal-container ${getAnimationClass(examSimState, currentDevice)}`}
            onClick={onCloseExamSimulation}
          >
            <div 
              className="w-full h-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full">
                <ExamSimulationApp 
                  onClose={onCloseExamSimulation}
                  reviewingCompletedExam={reviewingCompletedExam || undefined}
                  examWeaknessContext={examWeaknessContext}
                />
              </div>
            </div>
          </div>
        </ContentStoreProvider>
      )}

      {/* Generate Flashcards Modal — only on Mobile (Desktop uses inline ContentRouter) */}
      {isGenFlashMounted && isMobile && (
        <ContentStoreProvider>
          <div 
            className={`modal-container ${getAnimationClass(genFlashState, currentDevice)}`}
            onClick={onCloseGenerateFlashcards}
          >
            <div 
              className="w-full h-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full">
                <GenerateFlashcardsApp 
                  onClose={onCloseGenerateFlashcards}
                  onFlashcardSetCreated={onFlashcardSetCreated}
                  weaknessContext={weaknessContext}
                />
              </div>
            </div>
          </div>
        </ContentStoreProvider>
      )}

      {/* Flashcard Set View Modal */}
      {isFlashSetMounted && selectedFlashcardSet && (
        <div 
          className={`modal-container ${getAnimationClass(flashSetState, currentDevice)}`}
          onClick={onCloseFlashcardSetView}
        >
          <div 
            className="relative w-full h-full lg:max-w-[430px] lg:max-h-[932px] lg:scale-[0.8] lg:origin-center lg:overflow-hidden lg:rounded-[24px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full bg-[#0a0a0a] overflow-hidden lg:rounded-[24px] lg:shadow-2xl lg:border lg:border-white/10">
              <FlashcardSetView
                isOpen={showFlashcardSetView}
                onClose={onCloseFlashcardSetView}
                setName={selectedFlashcardSet.setName}
                subtopicName={selectedFlashcardSet.subtopicName}
                subject={selectedFlashcardSet.subject}
                cards={selectedFlashcardSet.cards}
                onProgressUpdate={(newProgress, updatedCards) => {
                  onFlashcardProgressUpdate(
                    selectedFlashcardSet.setId,
                    newProgress,
                    updatedCards
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        deleteMode={deleteMode}
        selectedCount={selectedCount}
        filteredCount={filteredCount}
        totalCount={totalCount}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}