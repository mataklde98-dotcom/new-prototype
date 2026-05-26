import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== TYPES =====
export type Subject = {
  id: string;
  name: string;
  icon: 'math' | 'german' | 'biology' | 'history' | 'english' | 'chemistry' | 'french';
};

export type Category = {
  id: string;
  subjectId: string;
  name: string;
};

export type Topic = {
  id: string;
  categoryId: string;
  name: string;
};

export type Subtopic = {
  id: string;
  topicId: string;
  name: string;
};

// AI Generated Content (stored in localStorage)
export type AIGeneratedContent = {
  subjectId?: string;
  categoryId?: string;
  topicId?: string;
  subtopicId?: string;
  name: string;
  timestamp: number;
};

// ===== INITIAL DATA =====
const INITIAL_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematik', icon: 'math' },
  { id: 'german', name: 'Deutsch', icon: 'german' },
  { id: 'biology', name: 'Biologie', icon: 'biology' },
  { id: 'history', name: 'Geschichte', icon: 'history' },
  { id: 'english', name: 'Englisch', icon: 'english' },
  { id: 'chemistry', name: 'Chemie', icon: 'chemistry' },
  { id: 'french', name: 'Französisch', icon: 'french' },
];

const INITIAL_CATEGORIES: Category[] = [
  // Mathematik
  { id: 'math-algebra', subjectId: 'math', name: 'Algebra' },
  { id: 'math-geometry', subjectId: 'math', name: 'Geometrie' },
  { id: 'math-analysis', subjectId: 'math', name: 'Analysis' },
  
  // Deutsch
  { id: 'german-grammar', subjectId: 'german', name: 'Grammatik' },
  { id: 'german-literature', subjectId: 'german', name: 'Literatur' },
  
  // Biologie
  { id: 'biology-cells', subjectId: 'biology', name: 'Zellbiologie' },
  { id: 'biology-genetics', subjectId: 'biology', name: 'Genetik' },
  
  // Geschichte
  { id: 'history-modern', subjectId: 'history', name: 'Neuzeit' },
  { id: 'history-medieval', subjectId: 'history', name: 'Mittelalter' },
  
  // Englisch
  { id: 'english-grammar', subjectId: 'english', name: 'Grammar' },
  { id: 'english-vocabulary', subjectId: 'english', name: 'Vocabulary' },
  
  // Chemie
  { id: 'chemistry-organic', subjectId: 'chemistry', name: 'Organische Chemie' },
  { id: 'chemistry-inorganic', subjectId: 'chemistry', name: 'Anorganische Chemie' },
  
  // Französisch
  { id: 'french-grammar', subjectId: 'french', name: 'Grammaire' },
  { id: 'french-vocabulary', subjectId: 'french', name: 'Vocabulaire' },
];

const INITIAL_TOPICS: Topic[] = [
  // Math - Algebra
  { id: 'algebra-equations', categoryId: 'math-algebra', name: 'Gleichungen' },
  { id: 'algebra-functions', categoryId: 'math-algebra', name: 'Funktionen' },
  
  // Math - Geometry
  { id: 'geometry-triangles', categoryId: 'math-geometry', name: 'Dreiecke' },
  { id: 'geometry-circles', categoryId: 'math-geometry', name: 'Kreise' },
  
  // German - Grammar
  { id: 'grammar-syntax', categoryId: 'german-grammar', name: 'Syntax' },
  { id: 'grammar-morphology', categoryId: 'german-grammar', name: 'Morphologie' },
];

const INITIAL_SUBTOPICS: Subtopic[] = [
  // Algebra - Equations
  { id: 'eq-linear', topicId: 'algebra-equations', name: 'Lineare Gleichungen' },
  { id: 'eq-quadratic', topicId: 'algebra-equations', name: 'Quadratische Gleichungen' },
  
  // Algebra - Functions
  { id: 'func-linear', topicId: 'algebra-functions', name: 'Lineare Funktionen' },
  { id: 'func-exponential', topicId: 'algebra-functions', name: 'Exponentialfunktionen' },
];

// ===== CONTEXT =====
interface ContentStoreContextType {
  // Data
  subjects: Subject[];
  categories: Category[];
  topics: Topic[];
  subtopics: Subtopic[];
  aiGeneratedContent: AIGeneratedContent[];
  
  // Methods
  addSubject: (subject: Subject) => void;
  addCategory: (category: Category) => void;
  addTopic: (topic: Topic) => void;
  addSubtopic: (subtopic: Subtopic) => void;
  
  deleteSubject: (subjectId: string) => void;
  deleteCategory: (categoryId: string) => void;
  deleteTopic: (topicId: string) => void;
  deleteSubtopic: (subtopicId: string) => void;
  
  addAIContent: (content: AIGeneratedContent) => void;
  
  // Getters
  getCategoriesBySubject: (subjectId: string) => Category[];
  getTopicsByCategory: (categoryId: string) => Topic[];
  getSubtopicsByTopic: (topicId: string) => Subtopic[];
}

const ContentStoreContext = createContext<ContentStoreContextType | undefined>(undefined);

// ===== PROVIDER =====
export function ContentStoreProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [aiGeneratedContent, setAIGeneratedContent] = useState<AIGeneratedContent[]>([]);
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem('shared_content_subjects');
    const savedCategories = localStorage.getItem('shared_content_categories');
    const savedTopics = localStorage.getItem('shared_content_topics');
    const savedSubtopics = localStorage.getItem('shared_content_subtopics');
    const savedAIContent = localStorage.getItem('shared_content_ai');
    
    // Sicheres Parsen: ein einzelner korrupter Key darf nicht den ganzen Content-Store (und damit
    // Probeklausuren + Karteikarten-Generierung) mit einem schwarzen Bildschirm lahmlegen.
    const parse = <T,>(raw: string | null, fallback: T): T => {
      if (!raw) return fallback;
      try { return JSON.parse(raw) as T; } catch { return fallback; }
    };
    setSubjects(parse(savedSubjects, INITIAL_SUBJECTS));
    setCategories(parse(savedCategories, INITIAL_CATEGORIES));
    setTopics(parse(savedTopics, INITIAL_TOPICS));
    setSubtopics(parse(savedSubtopics, INITIAL_SUBTOPICS));
    setAIGeneratedContent(parse(savedAIContent, []));
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    if (subjects.length > 0) {
      localStorage.setItem('shared_content_subjects', JSON.stringify(subjects));
    }
  }, [subjects]);
  
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem('shared_content_categories', JSON.stringify(categories));
    }
  }, [categories]);
  
  useEffect(() => {
    if (topics.length > 0) {
      localStorage.setItem('shared_content_topics', JSON.stringify(topics));
    }
  }, [topics]);
  
  useEffect(() => {
    if (subtopics.length > 0) {
      localStorage.setItem('shared_content_subtopics', JSON.stringify(subtopics));
    }
  }, [subtopics]);
  
  useEffect(() => {
    localStorage.setItem('shared_content_ai', JSON.stringify(aiGeneratedContent));
  }, [aiGeneratedContent]);
  
  // Add methods
  const addSubject = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
  };
  
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };
  
  const addTopic = (topic: Topic) => {
    setTopics(prev => [...prev, topic]);
  };
  
  const addSubtopic = (subtopic: Subtopic) => {
    setSubtopics(prev => [...prev, subtopic]);
  };
  
  // Delete methods with cascade
  const deleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    // Cascade delete categories
    const categoriesToDelete = categories.filter(c => c.subjectId === subjectId);
    categoriesToDelete.forEach(cat => deleteCategory(cat.id));
  };
  
  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    // Cascade delete topics
    const topicsToDelete = topics.filter(t => t.categoryId === categoryId);
    topicsToDelete.forEach(topic => deleteTopic(topic.id));
  };
  
  const deleteTopic = (topicId: string) => {
    setTopics(prev => prev.filter(t => t.id !== topicId));
    // Cascade delete subtopics
    setSubtopics(prev => prev.filter(st => st.topicId !== topicId));
  };
  
  const deleteSubtopic = (subtopicId: string) => {
    setSubtopics(prev => prev.filter(st => st.id !== subtopicId));
  };
  
  const addAIContent = (content: AIGeneratedContent) => {
    setAIGeneratedContent(prev => [...prev, content]);
  };
  
  // Getters
  const getCategoriesBySubject = (subjectId: string) => {
    return categories.filter(c => c.subjectId === subjectId);
  };
  
  const getTopicsByCategory = (categoryId: string) => {
    return topics.filter(t => t.categoryId === categoryId);
  };
  
  const getSubtopicsByTopic = (topicId: string) => {
    return subtopics.filter(st => st.topicId === topicId);
  };
  
  const value: ContentStoreContextType = {
    subjects,
    categories,
    topics,
    subtopics,
    aiGeneratedContent,
    addSubject,
    addCategory,
    addTopic,
    addSubtopic,
    deleteSubject,
    deleteCategory,
    deleteTopic,
    deleteSubtopic,
    addAIContent,
    getCategoriesBySubject,
    getTopicsByCategory,
    getSubtopicsByTopic,
  };
  
  return (
    <ContentStoreContext.Provider value={value}>
      {children}
    </ContentStoreContext.Provider>
  );
}

// ===== HOOK =====
export function useContentStore() {
  const context = useContext(ContentStoreContext);
  if (!context) {
    throw new Error('useContentStore must be used within ContentStoreProvider');
  }
  return context;
}
