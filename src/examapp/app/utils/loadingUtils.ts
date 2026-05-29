/**
 * Loading Utilities
 * 
 * Diese Funktionen laden Content von der Datenquelle.
 * AKTUELL: Laden von lokalen Mock-Daten mit simulierter Latenz
 * SPÄTER: Ersetzen durch echte API-Calls
 */

import { subjects, Subject } from '../data/subjects';
import { categories, Category } from '../data/categories';
import { topics, Topic } from '../data/topics';
import { allSubtopics, Subtopic } from '../data/subtopics';
import { getAICategories, getAITopics, getAISubtopics } from './aiContentStorage';

// Minimum loading time — deaktiviert, da Daten lokal geladen werden
const MIN_LOADING_TIME = 0;

/**
 * Helper: Simuliert Netzwerk-Latenz
 */
export const simulateNetworkDelay = async (minMs: number, maxMs: number): Promise<void> => {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Lädt alle verfügbaren Fächer
 * AKTUELL: Lädt von lokalen Mock-Daten
 * SPÄTER: GET /api/subjects
 */
export const loadAllSubjects = async (): Promise<Subject[]> => {
  // SPÄTER: Ersetzen durch API-Call
  // const response = await fetch('/api/subjects');
  // if (!response.ok) throw new Error('Failed to load subjects');
  // const data = await response.json();
  // return data.subjects;
  
  return [...subjects]; // Return copy to prevent mutations
};

/**
 * Lädt Kategorien für ein bestimmtes Fach
 * AKTUELL: Lädt von lokalen Mock-Daten + AI-generierte aus localStorage
 * SPÄTER: GET /api/categories?subjectId={subjectId}
 */
export const loadCategoriesForSubject = async (subjectId: string): Promise<Category[]> => {
  // SPÄTER: Ersetzen durch API-Call
  // const response = await fetch(`/api/categories?subjectId=${subjectId}`);
  // if (!response.ok) throw new Error('Failed to load categories');
  // const data = await response.json();
  // return data.categories;
  
  // Load standard categories
  const standardCategories = categories.filter(cat => cat.subjectId === subjectId);
  
  // Load AI-generated categories from localStorage
  const aiCategories = getAICategories().filter(cat => cat.subjectId === subjectId);
  
  // Merge: AI-generated categories go at the end
  return [...standardCategories, ...aiCategories];
};

/**
 * Lädt Topics für eine bestimmte Kategorie
 * AKTUELL: Lädt von lokalen Mock-Daten + AI-generierte aus localStorage
 * SPÄTER: GET /api/topics?categoryId={categoryId}
 * 
 * @param categoryId - Kategorie-ID oder leer für ALLE Topics
 */
export const loadTopicsForCategory = async (categoryId: string): Promise<Topic[]> => {
  // SPÄTER: Ersetzen durch API-Call
  // const response = await fetch(`/api/topics?categoryId=${categoryId}`);
  // if (!response.ok) throw new Error('Failed to load topics');
  // const data = await response.json();
  // return data.topics;
  
  // Load standard topics
  const standardTopics = categoryId 
    ? topics.filter(topic => topic.categoryId === categoryId)
    : [...topics];
  
  // Load AI-generated topics from localStorage
  const aiTopics = categoryId
    ? getAITopics().filter(topic => topic.categoryId === categoryId)
    : getAITopics();
  
  // Merge: AI-generated topics go at the end
  return [...standardTopics, ...aiTopics];
};

/**
 * Lädt Subtopics für ein bestimmtes Topic
 * AKTUELL: Lädt von lokalen Mock-Daten + AI-generierte aus localStorage
 * SPÄTER: GET /api/subtopics?topicId={topicId}
 * 
 * @param topicId - Topic-ID oder leer für ALLE Subtopics
 */
export const loadSubtopicsForTopic = async (topicId: string): Promise<Subtopic[]> => {
  // SPÄTER: Ersetzen durch API-Call
  // const response = await fetch(`/api/subtopics?topicId=${topicId}`);
  // if (!response.ok) throw new Error('Failed to load subtopics');
  // const data = await response.json();
  // return data.subtopics;
  
  // Load standard subtopics
  const standardSubtopics = topicId
    ? allSubtopics.filter(sub => sub.topicId === topicId)
    : [...allSubtopics];
  
  // Load AI-generated subtopics from localStorage
  const aiSubtopics = topicId
    ? getAISubtopics().filter(sub => sub.topicId === topicId)
    : getAISubtopics();
  
  // Merge: AI-generated subtopics go at the end
  return [...standardSubtopics, ...aiSubtopics];
};

/**
 * Helper: Wartet mindestens die minimale Ladezeit
 * Verhindert zu schnelle UI-Wechsel (Flash-Effekt)
 */
const minDelay = (): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, MIN_LOADING_TIME));
};

/**
 * Lädt Content mit minimaler Wartezeit
 * Garantiert dass der Loader mindestens MIN_LOADING_TIME sichtbar ist
 */
export const loadWithMinimumDelay = async <T>(loadFunction: () => Promise<T>): Promise<T> => {
  const [data] = await Promise.all([
    loadFunction(),
    minDelay()
  ]);
  return data;
};