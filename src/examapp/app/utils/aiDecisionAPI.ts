/**
 * AI Decision API - Intelligente hierarchische Content-Erstellung
 * 
 * Diese API analysiert User-Input und entscheidet intelligent:
 * 1. Gibt es eine passende Kategorie? → Falls nein: Erstelle Kategorie + Themen + Subtopics
 * 2. Gibt es ein passendes Thema? → Falls nein: Erstelle Thema + Subtopics
 * 3. Falls beides existiert → Erstelle nur Subtopics
 */

import { type Category } from '../data/categories';
import { type Topic } from '../data/topics';
import { type Subtopic } from '../data/subtopics';

export interface AIDecisionRequest {
  userInput: string;
  subjectId: string;
  existingCategories: Category[];
  existingTopics: Topic[];
  existingSubtopics: Subtopic[];
}

export interface AIDecisionResponse {
  action: 'create_category' | 'create_topic' | 'create_subtopics' | 'content_exists';
  
  // Matched existing content
  matchedCategory?: { id: string; name: string };
  matchedTopic?: { id: string; name: string };
  
  // Content to create
  categoryToCreate?: { name: string };
  topicsToCreate?: Array<{ name: string; subtopics: string[] }>;
  subtopicsToCreate?: string[];
  
  // For duplicate detection
  existingSubtopicNames?: string[];
}

/**
 * MOCK API - Später durch echte API ersetzen
 * 
 * Diese Funktion simuliert die KI-Entscheidung basierend auf dem User-Input.
 * In Production wird dies durch einen POST Request zu einer KI-API ersetzt.
 */
export async function callAIDecisionAPI(
  userInput: string,
  subjectId: string,
  existingCategories: any[],
  existingTopics: any[],
  existingSubtopics: any[]
): Promise<AIDecisionResponse> {
  const request: AIDecisionRequest = {
    userInput,
    subjectId,
    existingCategories,
    existingTopics,
    existingSubtopics
  };
  
  console.log('🤖 AI Decision API called:', request);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const input = request.userInput.toLowerCase();
  
  // ✅ NEUE LOGIK: Erkenne User Intent basierend auf Keywords
  const intentKeywords = {
    wantsCategory: ['neue kategorie', 'kategorie erstellen', 'neue kategorien'],
    wantsTopic: ['neue themen', 'thema erstellen', 'neue topics', 'themen hinzufügen'],
    wantsSubtopic: ['neue unterthemen', 'unterthema erstellen', 'neue subtopics', 'unterthemen hinzufügen']
  };
  
  const hasExplicitCategoryIntent = intentKeywords.wantsCategory.some(kw => input.includes(kw));
  const hasExplicitTopicIntent = intentKeywords.wantsTopic.some(kw => input.includes(kw));
  const hasExplicitSubtopicIntent = intentKeywords.wantsSubtopic.some(kw => input.includes(kw));
  
  // **SCHRITT 1: Prüfe ob passende KATEGORIE existiert**
  const matchedCategory = findMatchingCategory(input, request.existingCategories);
  
  // ✅ FIX: Wenn User explizit "neue Kategorie" will → Immer neue Kategorie erstellen
  if (hasExplicitCategoryIntent) {
    return {
      action: 'create_category',
      categoryToCreate: { name: generateCategoryName(input) },
      topicsToCreate: generateTopicsWithSubtopics(input, 3) // 3 Themen
    };
  }
  
  // ✅ FIX: Wenn User explizit "neue Themen" will → Verwende existierende Kategorie oder erste verfügbare
  if (hasExplicitTopicIntent) {
    const targetCategory = matchedCategory || request.existingCategories[0];
    
    if (!targetCategory) {
      // Keine Kategorie vorhanden → Erstelle Kategorie + Themen
      return {
        action: 'create_category',
        categoryToCreate: { name: generateCategoryName(input) },
        topicsToCreate: generateTopicsWithSubtopics(input, 3)
      };
    }
    
    // Kategorie existiert → Erstelle nur Thema
    return {
      action: 'create_topic',
      matchedCategory: { id: targetCategory.id, name: targetCategory.name },
      topicsToCreate: generateTopicsWithSubtopics(input, 1) // 1 Thema
    };
  }
  
  // ✅ FIX: Wenn User explizit "neue Unterthemen" will → Verwende existierendes Thema oder erstes verfügbares
  if (hasExplicitSubtopicIntent) {
    const targetCategory = matchedCategory || request.existingCategories[0];
    
    if (!targetCategory) {
      return {
        action: 'create_category',
        categoryToCreate: { name: generateCategoryName(input) },
        topicsToCreate: generateTopicsWithSubtopics(input, 3)
      };
    }
    
    const relevantTopics = request.existingTopics.filter(t => t.categoryId === targetCategory.id);
    const targetTopic = findMatchingTopic(input, relevantTopics) || relevantTopics[0];
    
    if (!targetTopic) {
      // Keine Topics in Kategorie → Erstelle Thema
      return {
        action: 'create_topic',
        matchedCategory: { id: targetCategory.id, name: targetCategory.name },
        topicsToCreate: generateTopicsWithSubtopics(input, 1)
      };
    }
    
    // Thema existiert → Erstelle nur Subtopics
    const relevantSubtopics = request.existingSubtopics.filter(s => s.topicId === targetTopic.id);
    const newSubtopics = generateSubtopics(input);
    
    // Check for duplicates
    const duplicates = newSubtopics.filter(newSub => 
      relevantSubtopics.some(existing => 
        existing.name.toLowerCase().includes(newSub.toLowerCase()) ||
        newSub.toLowerCase().includes(existing.name.toLowerCase())
      )
    );
    
    if (duplicates.length === newSubtopics.length) {
      return {
        action: 'content_exists',
        matchedCategory: { id: targetCategory.id, name: targetCategory.name },
        matchedTopic: { id: targetTopic.id, name: targetTopic.name },
        existingSubtopicNames: relevantSubtopics.map(s => s.name)
      };
    }
    
    const uniqueSubtopics = newSubtopics.filter(newSub => !duplicates.includes(newSub));
    
    return {
      action: 'create_subtopics',
      matchedCategory: { id: targetCategory.id, name: targetCategory.name },
      matchedTopic: { id: targetTopic.id, name: targetTopic.name },
      subtopicsToCreate: uniqueSubtopics
    };
  }
  
  // ========== FALLBACK: AUTOMATISCHE HIERARCHISCHE LOGIK ==========
  
  if (!matchedCategory) {
    // KEINE passende Kategorie → Erstelle Kategorie + Themen + Subtopics
    return {
      action: 'create_category',
      categoryToCreate: { name: generateCategoryName(input) },
      topicsToCreate: generateTopicsWithSubtopics(input, 3) // 3 Themen
    };
  }
  
  // **SCHRITT 2: Prüfe ob passendes THEMA existiert**
  const relevantTopics = request.existingTopics.filter(t => t.categoryId === matchedCategory.id);
  const matchedTopic = findMatchingTopic(input, relevantTopics);
  
  if (!matchedTopic) {
    // Kategorie existiert, aber KEIN passendes Thema → Erstelle Thema + Subtopics
    return {
      action: 'create_topic',
      matchedCategory: { id: matchedCategory.id, name: matchedCategory.name },
      topicsToCreate: generateTopicsWithSubtopics(input, 1) // 1 Thema
    };
  }
  
  // **SCHRITT 3: Kategorie UND Thema existieren → Prüfe Duplikate**
  const relevantSubtopics = request.existingSubtopics.filter(s => s.topicId === matchedTopic.id);
  const newSubtopics = generateSubtopics(input);
  
  // Check for duplicates
  const duplicates = newSubtopics.filter(newSub => 
    relevantSubtopics.some(existing => 
      existing.name.toLowerCase().includes(newSub.toLowerCase()) ||
      newSub.toLowerCase().includes(existing.name.toLowerCase())
    )
  );
  
  if (duplicates.length === newSubtopics.length) {
    // Alle Subtopics existieren bereits
    return {
      action: 'content_exists',
      matchedCategory: { id: matchedCategory.id, name: matchedCategory.name },
      matchedTopic: { id: matchedTopic.id, name: matchedTopic.name },
      existingSubtopicNames: relevantSubtopics.map(s => s.name)
    };
  }
  
  // Filter out duplicates
  const uniqueSubtopics = newSubtopics.filter(newSub => !duplicates.includes(newSub));
  
  return {
    action: 'create_subtopics',
    matchedCategory: { id: matchedCategory.id, name: matchedCategory.name },
    matchedTopic: { id: matchedTopic.id, name: matchedTopic.name },
    subtopicsToCreate: uniqueSubtopics
  };
}

// ==================== HELPER FUNCTIONS ====================

function findMatchingCategory(input: string, categories: Category[]): Category | null {
  // Mock: Simple keyword matching
  // In production, this would use AI/embeddings
  
  const keywords: { [key: string]: string[] } = {
    'math': ['mathe', 'mathematik', 'rechnen', 'zahlen', 'algebra', 'geometrie', 'analysis', 'grenzwert', 'ableitung', 'integral', 'pythagoras', 'dreiecke'],
    'german': ['deutsch', 'gedicht', 'lyrik', 'roman', 'literatur', 'sprache', 'grammatik'],
    'biology': ['biologie', 'bio', 'zelle', 'dna', 'genetik', 'organismus', 'pflanze', 'tier'],
    'history': ['geschichte', 'historie', 'römisch', 'antike', 'mittelalter', 'krieg'],
    'english': ['englisch', 'english', 'tense', 'conditional', 'grammar'],
    'chemistry': ['chemie', 'element', 'periodensystem', 'säure', 'base', 'reaktion'],
    'french': ['französisch', 'french', 'français', 'temps', 'subjonctif']
  };
  
  for (const category of categories) {
    const categoryKeywords = keywords[category.subjectId] || [];
    const matchesKeyword = categoryKeywords.some(keyword => input.includes(keyword));
    const matchesName = input.includes(category.name.toLowerCase());
    
    if (matchesKeyword || matchesName) {
      return category;
    }
  }
  
  return null;
}

function findMatchingTopic(input: string, topics: Topic[]): Topic | null {
  // Mock: Simple keyword matching
  for (const topic of topics) {
    if (input.includes(topic.name.toLowerCase())) {
      return topic;
    }
  }
  return null;
}

function generateCategoryName(input: string): string {
  // Mock: Generate category name based on input
  // In production, AI would generate this
  
  if (input.includes('neue kategorie')) return 'Neue KI-Kategorie';
  if (input.includes('pythagoras') || input.includes('dreiecke')) return 'Geometrie';
  if (input.includes('algebra')) return 'Algebra';
  if (input.includes('analysis')) return 'Analysis';
  
  return 'Neue Kategorie';
}

function generateTopicsWithSubtopics(input: string, count: number): Array<{ name: string; subtopics: string[] }> {
  // Mock: Generate topics with subtopics
  // In production, AI would generate this
  
  const topics: Array<{ name: string; subtopics: string[] }> = [];
  
  if (input.includes('pythagoras') || input.includes('dreiecke')) {
    topics.push({
      name: 'Satz des Pythagoras',
      subtopics: [
        'Grundlagen des Satzes',
        'Anwendung in rechtwinkligen Dreiecken',
        'Beweis des Satzes',
        'Praktische Beispiele'
      ]
    });
  } else if (input.includes('neues thema') || input.includes('neue themen')) {
    for (let i = 0; i < count; i++) {
      topics.push({
        name: `Neues KI-Thema ${i + 1}`,
        subtopics: [
          `Unterthema ${i + 1}.1`,
          `Unterthema ${i + 1}.2`,
          `Unterthema ${i + 1}.3`
        ]
      });
    }
  } else {
    topics.push({
      name: 'Neues Thema',
      subtopics: ['Grundlagen', 'Vertiefung', 'Anwendung']
    });
  }
  
  return topics.slice(0, count);
}

function generateSubtopics(input: string): string[] {
  // Mock: Generate subtopics based on input
  // In production, AI would generate this
  
  if (input.includes('neue unterthemen') || input.includes('neues unterthema')) {
    return [
      'Neues KI-Unterthema 1',
      'Neues KI-Unterthema 2',
      'Neues KI-Unterthema 3'
    ];
  }
  
  if (input.includes('pythagoras')) {
    return [
      'Pythagoras Grundlagen',
      'Pythagoras Anwendung',
      'Pythagoras Beweis'
    ];
  }
  
  return [
    'Grundlagen',
    'Vertiefung',
    'Anwendung'
  ];
}