/**
 * 🎯 USAGE EXAMPLE - Shared Content Selection with Mode Support
 * 
 * This example shows how to use the shared content selection screens
 * in both 'exam' mode (multi-select) and 'generate' mode (single-select).
 */

import { useState, useEffect } from 'react';
import {
  SubjectSelection,
  CategorySelection,
  TopicSelection,
  SubtopicSelection,
  loadAllSubjects,
  loadCategoriesForSubject,
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  type Subject,
  type Category,
  type Topic,
  type Subtopic
} from '@/shared-content-selection';

// ================================
// Example 1: EXAM MODE (Multi-select, flexible)
// ================================

export function ExampleExamApp() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'subject' | 'category' | 'topic' | 'subtopic' | 'config'>('subject');
  
  // Selection state
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; name: string } | null>(null);
  const [subtopicsByTopic, setSubtopicsByTopic] = useState<{ [topicId: string]: Subtopic[] }>({});
  const [selectedSubtopics, setSelectedSubtopics] = useState<Subtopic[]>([]);
  
  // Data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load subjects on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await loadAllSubjects();
      setSubjects(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // === SCREEN 1: Subject Selection ===
  if (currentScreen === 'subject') {
    return (
      <SubjectSelection
        mode="exam" // ✅ Multi-select mode
        title="Prüfungssimulation"
        subjects={subjects}
        isLoading={isLoading}
        onSelectSubject={async (subject) => {
          setSelectedSubject(subject);
          setIsLoading(true);
          const cats = await loadCategoriesForSubject(subject.id);
          setCategories(cats);
          setIsLoading(false);
          setCurrentScreen('category');
        }}
      />
    );
  }

  // === SCREEN 2: Category Selection ===
  if (currentScreen === 'category' && selectedSubject) {
    return (
      <CategorySelection
        mode="exam" // ✅ Multi-select mode
        title="Prüfungssimulation"
        subjectId={selectedSubject.id}
        subjectName={selectedSubject.name}
        categories={categories}
        isLoading={isLoading}
        onSelectCategory={async (category) => {
          setSelectedCategory(category);
          setIsLoading(true);
          const topicsList = await loadTopicsForCategory(category.id);
          setTopics(topicsList);
          setIsLoading(false);
          setCurrentScreen('topic');
        }}
        onBack={() => setCurrentScreen('subject')}
      />
    );
  }

  // === SCREEN 3: Topic Selection ===
  if (currentScreen === 'topic' && selectedCategory && selectedSubject) {
    return (
      <TopicSelection
        mode="exam" // ✅ Can select whole topic with checkbox!
        title="Prüfungssimulation"
        categoryId={selectedCategory.id}
        categoryName={selectedCategory.name}
        subjectId={selectedSubject.id}
        subjectName={selectedSubject.name}
        topics={topics}
        selectedTopic={selectedTopic}
        subtopicsByTopic={subtopicsByTopic}
        isLoading={isLoading}
        onSelectTopic={(topic) => setSelectedTopic(topic)}
        onContinue={() => {
          // User selected whole topic → go to exam config
          setCurrentScreen('config');
        }}
        onNavigateToSubtopics={async (topic) => {
          setSelectedTopic({ id: topic.id, name: topic.name });
          setIsLoading(true);
          const subtopicsList = await loadSubtopicsForTopic(topic.id);
          setSubtopics(subtopicsList);
          setIsLoading(false);
          setCurrentScreen('subtopic');
        }}
        onBack={() => setCurrentScreen('category')}
      />
    );
  }

  // === SCREEN 4: Subtopic Selection ===
  if (currentScreen === 'subtopic' && selectedTopic) {
    return (
      <SubtopicSelection
        mode="exam" // ✅ Multi-select! Can select multiple subtopics
        title="Prüfungssimulation"
        topicId={selectedTopic.id}
        topicName={selectedTopic.name}
        categoryId={selectedCategory!.id}
        subjectId={selectedSubject!.id}
        subtopics={subtopics}
        initialSelection={subtopicsByTopic[selectedTopic.id]}
        isLoading={isLoading}
        onContinue={(selected) => {
          setSelectedSubtopics(selected);
          setSubtopicsByTopic({ ...subtopicsByTopic, [selectedTopic.id]: selected });
          setCurrentScreen('config');
        }}
        onBack={(selected) => {
          setSubtopicsByTopic({ ...subtopicsByTopic, [selectedTopic.id]: selected });
          setCurrentScreen('topic');
        }}
      />
    );
  }

  // === SCREEN 5+: Feature-Specific ===
  if (currentScreen === 'config') {
    return (
      <div className="p-6 bg-[#0a0a0a] text-white">
        <h1 className="text-2xl font-bold mb-4">Exam Configuration</h1>
        <p>Subject: {selectedSubject?.name}</p>
        <p>Category: {selectedCategory?.name}</p>
        <p>Topic: {selectedTopic?.name}</p>
        <p>Subtopics: {selectedSubtopics.length > 0 ? selectedSubtopics.map(s => s.name).join(', ') : 'Whole topic'}</p>
      </div>
    );
  }

  return null;
}

// ================================
// Example 2: GENERATE MODE (Single-select, strict)
// ================================

export function ExampleGenerateFlashcardsApp() {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState<'subject' | 'category' | 'topic' | 'subtopic' | 'config'>('subject');
  
  // Selection state
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<{ id: string; name: string } | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);
  
  // Data state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load subjects on mount
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await loadAllSubjects();
      setSubjects(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // === SCREEN 1: Subject Selection ===
  if (currentScreen === 'subject') {
    return (
      <SubjectSelection
        mode="generate" // ✅ Single-select mode (same behavior as exam for subject)
        title="Generiere Karteikarten"
        subjects={subjects}
        isLoading={isLoading}
        onSelectSubject={async (subject) => {
          setSelectedSubject(subject);
          setIsLoading(true);
          const cats = await loadCategoriesForSubject(subject.id);
          setCategories(cats);
          setIsLoading(false);
          setCurrentScreen('category');
        }}
      />
    );
  }

  // === SCREEN 2: Category Selection ===
  if (currentScreen === 'category' && selectedSubject) {
    return (
      <CategorySelection
        mode="generate" // ✅ Single-select mode (same behavior as exam for category)
        title="Generiere Karteikarten"
        subjectId={selectedSubject.id}
        subjectName={selectedSubject.name}
        categories={categories}
        isLoading={isLoading}
        onSelectCategory={async (category) => {
          setSelectedCategory(category);
          setIsLoading(true);
          const topicsList = await loadTopicsForCategory(category.id);
          setTopics(topicsList);
          setIsLoading(false);
          setCurrentScreen('topic');
        }}
        onBack={() => setCurrentScreen('subject')}
      />
    );
  }

  // === SCREEN 3: Topic Selection ===
  if (currentScreen === 'topic' && selectedCategory && selectedSubject) {
    return (
      <TopicSelection
        mode="generate" // ⚠️ CANNOT select whole topic! Checkbox disabled!
        title="Generiere Karteikarten"
        categoryId={selectedCategory.id}
        categoryName={selectedCategory.name}
        subjectId={selectedSubject.id}
        subjectName={selectedSubject.name}
        topics={topics}
        selectedTopic={selectedTopic}
        subtopicsByTopic={{}}
        isLoading={isLoading}
        onSelectTopic={(topic) => {
          // This won't be called in generate mode (checkbox disabled)
          setSelectedTopic(topic);
        }}
        onContinue={() => {
          // This button is HIDDEN in generate mode
          // User MUST navigate to subtopics
        }}
        onNavigateToSubtopics={async (topic) => {
          // User MUST use this to navigate
          setSelectedTopic({ id: topic.id, name: topic.name });
          setIsLoading(true);
          const subtopicsList = await loadSubtopicsForTopic(topic.id);
          setSubtopics(subtopicsList);
          setIsLoading(false);
          setCurrentScreen('subtopic');
        }}
        onBack={() => setCurrentScreen('category')}
      />
    );
  }

  // === SCREEN 4: Subtopic Selection ===
  if (currentScreen === 'subtopic' && selectedTopic) {
    return (
      <SubtopicSelection
        mode="generate" // ⚠️ SINGLE-SELECT ONLY! Can only select ONE subtopic!
        title="Generiere Karteikarten"
        topicId={selectedTopic.id}
        topicName={selectedTopic.name}
        categoryId={selectedCategory!.id}
        subjectId={selectedSubject!.id}
        subtopics={subtopics}
        initialSelection={selectedSubtopic ? [selectedSubtopic] : []}
        isLoading={isLoading}
        onContinue={(selected) => {
          // selected.length will always be 1 in generate mode
          setSelectedSubtopic(selected[0]);
          setCurrentScreen('config');
        }}
        onBack={(selected) => {
          if (selected.length > 0) {
            setSelectedSubtopic(selected[0]);
          }
          setCurrentScreen('topic');
        }}
      />
    );
  }

  // === SCREEN 5+: Feature-Specific ===
  if (currentScreen === 'config') {
    return (
      <div className="p-6 bg-[#0a0a0a] text-white">
        <h1 className="text-2xl font-bold mb-4">Flashcard Configuration</h1>
        <p>Subject: {selectedSubject?.name}</p>
        <p>Category: {selectedCategory?.name}</p>
        <p>Topic: {selectedTopic?.name}</p>
        <p>Subtopic: {selectedSubtopic?.name}</p>
        <p className="mt-4 text-sm text-gray-400">
          ✅ Exactly ONE subtopic selected (required for flashcard generation)
        </p>
      </div>
    );
  }

  return null;
}

// ================================
// Key Differences Summary
// ================================

/*
┌────────────────────────────────────────────────────────────────────────────┐
│                         MODE COMPARISON                                    │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  EXAM MODE (mode="exam")                                                   │
│  ─────────────────────────                                                 │
│  ✅ SubjectSelection:     Normal selection                                 │
│  ✅ CategorySelection:    Normal selection                                 │
│  ✅ TopicSelection:       Can select WHOLE TOPIC (checkbox works)          │
│                          "Continue" button shown                           │
│  ✅ SubtopicSelection:    MULTI-SELECT (select many)                       │
│                          "Alle auswählen" button shown                     │
│                                                                            │
│  Use case: Create exam with multiple subtopics or whole topics            │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  GENERATE MODE (mode="generate")                                           │
│  ────────────────────────────────                                          │
│  ✅ SubjectSelection:     Normal selection (same as exam)                  │
│  ✅ CategorySelection:    Normal selection (same as exam)                  │
│  ⚠️  TopicSelection:       CANNOT select whole topic (checkbox disabled)   │
│                          "Continue" button HIDDEN                          │
│                          MUST navigate to subtopics                        │
│  ⚠️  SubtopicSelection:    SINGLE-SELECT (only ONE)                        │
│                          "Alle auswählen" button HIDDEN                    │
│                          "Weiter" button full width                        │
│                                                                            │
│  Use case: Generate flashcards for exactly ONE subtopic                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
*/
