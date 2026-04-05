import { useState, useEffect, useMemo } from 'react';
import { prognosisService } from '@/services';
import type { FlashcardSet } from '@/types';

// ===== PROGNOSIS STATE MANAGEMENT HOOK =====
// Zentrales State Management für Prognosis-Daten (Erkannte Schwächen, Zukünftige Risiken & Wissenslücken)
// Nutzt prognosisService → später einfach durch API austauschbar
// 
// Die API wird später Flashcard-Sets mit subject, kategorie, thema, unterthema zurückgeben
// Daten werden beim App-Start einmalig geladen (kein Loading-State nötig)

export interface PrognosisData {
  weaknesses: FlashcardSet[];
  relevantTopics: FlashcardSet[];
  knowledgeGaps: FlashcardSet[];
}

export interface PrognosisFilters {
  activeSubject: string | null;
  activeKategorie: string | null;
  activeThema: string | null;
  activeUnterthema: string | null;
  searchQuery?: string;
  allSets?: FlashcardSet[]; // Optional: Use allSets as single source of truth
}

export function usePrognosis(filters?: PrognosisFilters) {
  const [prognosisData, setPrognosisData] = useState<PrognosisData>({
    weaknesses: [],
    relevantTopics: [],
    knowledgeGaps: []
  });

  /**
   * Lädt alle Prognosis-Daten beim Mount
   * Daten werden vom Service geladen (später API, jetzt Mocks)
   * ODER nutzt allSets als Single Source of Truth (empfohlen!)
   */
  useEffect(() => {
    // If allSets is provided, use it as single source of truth
    if (filters?.allSets) {
      const prognosisSets = filters.allSets.filter(set => set.type === 'weakness');
      const riskSets = filters.allSets.filter(set => set.type === 'risk');
      const knowledgeGapSets = filters.allSets.filter(set => set.type === 'knowledge-gap');
      
      // prognosis → Erkannte Schwächen
      // risk → Zukünftige Risiken
      // knowledge-gap → Wissenslücken
      const weaknesses = prognosisSets;
      const relevantTopics = riskSets;
      
      setPrognosisData({ weaknesses, relevantTopics, knowledgeGaps: knowledgeGapSets });
      return;
    }

    // Fallback: Load from service
    const loadData = async () => {
      try {
        const data = await prognosisService.getAllPrognosisData();
        setPrognosisData(data);
      } catch (err) {
        console.error('Error loading prognosis data:', err);
      }
    };
    loadData();
  }, [filters?.allSets]);

  /**
   * Filter-Funktion für Sets
   */
  const filterSets = (sets: FlashcardSet[]): FlashcardSet[] => {
    if (!filters) return sets;

    return sets.filter(set => {
      // Subject Filter
      if (filters.activeSubject && filters.activeSubject !== 'All' && set.subject !== filters.activeSubject) {
        return false;
      }
      
      // Kategorie Filter
      if (filters.activeKategorie && set.kategorie !== filters.activeKategorie) {
        return false;
      }
      
      // Thema Filter
      if (filters.activeThema && set.thema !== filters.activeThema) {
        return false;
      }
      
      // Unterthema Filter
      if (filters.activeUnterthema && set.unterthema !== filters.activeUnterthema) {
        return false;
      }
      
      // Search Query Filter
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = set.title?.toLowerCase().includes(query);
        const matchesSubject = set.subject?.toLowerCase().includes(query);
        const matchesKategorie = set.kategorie?.toLowerCase().includes(query);
        const matchesThema = set.thema?.toLowerCase().includes(query);
        const matchesUnterthema = set.unterthema?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesSubject && !matchesKategorie && !matchesThema && !matchesUnterthema) {
          return false;
        }
      }
      
      return true;
    });
  };

  /**
   * Gefilterte Daten mit useMemo für Performance
   */
  const filteredWeaknesses = useMemo(
    () => filterSets(prognosisData.weaknesses),
    [prognosisData.weaknesses, filters?.activeSubject, filters?.activeKategorie, filters?.activeThema, filters?.activeUnterthema, filters?.searchQuery]
  );

  const filteredRelevantTopics = useMemo(
    () => filterSets(prognosisData.relevantTopics),
    [prognosisData.relevantTopics, filters?.activeSubject, filters?.activeKategorie, filters?.activeThema, filters?.activeUnterthema, filters?.searchQuery]
  );

  const filteredKnowledgeGaps = useMemo(
    () => filterSets(prognosisData.knowledgeGaps),
    [prognosisData.knowledgeGaps, filters?.activeSubject, filters?.activeKategorie, filters?.activeThema, filters?.activeUnterthema, filters?.searchQuery]
  );

  return {
    prognosisData,
    filteredWeaknesses,
    filteredRelevantTopics,
    filteredKnowledgeGaps
  };
}