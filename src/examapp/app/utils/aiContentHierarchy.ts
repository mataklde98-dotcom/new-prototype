import { categories } from '../data/categories';
import { topics as standardTopics } from '../data/topics';
import { allSubtopics as standardSubtopics } from '../data/subtopics';
import { subjects } from '../data/subjects';
import { getAICategories, getAITopics, getAISubtopics, saveAICategory, saveAITopic, saveAISubtopic } from './aiContentStorage';
import type { Category } from '../data/categories';
import type { Topic } from '../data/topics';
import type { Subtopic } from '../data/subtopics';

/**
 * ✅ HIERARCHISCHE AI-CONTENT-GENERIERUNG
 * 
 * Diese Funktion implementiert die intelligente Content-Erstellung:
 * 1. Prüft ob Input zu bestehender Kategorie passt
 * 2. Falls ja: Prüft ob Input zu bestehendem Topic passt
 * 3. Erstellt nur fehlende Ebenen
 * 
 * EGAL wo der Button geklickt wird - die Logik ist IMMER gleich!
 * 
 * 🔥 FÜR ECHTE API-INTEGRATION:
 * ================================
 * Ersetze die gesamte Funktion generateAIContentHierarchically() mit einem API-Call:
 * 
 * POST /api/ai/generate-content
 * Body: {
 *   userInput: string,
 *   subjectId: string,
 *   existingCategories: Category[],  // Alle bestehenden (Standard + AI)
 *   existingTopics: Topic[],         // Alle bestehenden (Standard + AI)
 *   existingSubtopics: Subtopic[]    // Alle bestehenden (Standard + AI)
 * }
 * 
 * Response: AIGenerationResult (siehe unten)
 * 
 * Die API muss:
 * 1. Semantische Ähnlichkeit prüfen (nicht nur String-Matching!)
 * 2. Entscheiden ob neue Kategorie/Topic/Subtopics erstellt werden
 * 3. AIGenerationResult zurückgeben mit korrekten Flags
 * 
 * WICHTIG: Die API muss isNew und aiGenerated Flags setzen!
 */

export type AIGenerationResult = {
  type: 'new-category' | 'new-topic' | 'new-subtopics' | 'already-exists' | 'subject-mismatch';
  category: {
    id: string;
    name: string;
    isNew: boolean;
    aiGenerated: boolean;
  };
  topic?: {
    id: string;
    name: string;
    isNew: boolean;
    aiGenerated: boolean;
  };
  subtopics: string[];
  // ✅ NEU: Für flexible Duplikat-Anzeige - HIERARCHISCH organisiert
  existingContent?: {
    // MEHRERE KATEGORIEN möglich (z.B. wenn Anfrage mehrere Fächer betrifft)
    categories?: Array<{
      id: string;
      name: string;
      aiGenerated: boolean;
      // Topics MIT ihren Subtopics
      topics?: Array<{
        id: string;
        name: string;
        aiGenerated: boolean;
        // Subtopics die zu DIESEM Topic gehören
        subtopics?: Array<{
          id: string;
          name: string;
          aiGenerated: boolean;
        }>;
      }>;
    }>;
  };
  // ✅ NEU: Für Fach-Mismatch Detection
  subjectMismatch?: {
    currentSubject: {
      id: string;
      name: string;
    };
    detectedSubject: {
      id: string;
      name: string;
    };
    userInput: string;
  };
};

/**
 * Semantische Ähnlichkeitsprüfung (Mock - in Realität würde API das machen)
 */
function isSimilar(input: string, target: string): boolean {
  const inputLower = input.toLowerCase().trim();
  const targetLower = target.toLowerCase().trim();
  
  // Exakte Übereinstimmung
  if (inputLower === targetLower) return true;
  
  // Enthält den anderen String
  if (inputLower.includes(targetLower) || targetLower.includes(inputLower)) return true;
  
  // Einfache Keyword-Matching (Mock)
  const inputKeywords = inputLower.split(/\s+/);
  const targetKeywords = targetLower.split(/\s+/);
  
  // Mindestens 50% der Keywords müssen übereinstimmen
  const matchingKeywords = inputKeywords.filter(kw => 
    targetKeywords.some(tk => tk.includes(kw) || kw.includes(tk))
  );
  
  return matchingKeywords.length >= Math.min(inputKeywords.length, targetKeywords.length) * 0.5;
}

/**
 * ✅ EXAKTE Duplikat-Prüfung (für User-Warnung)
 */
function isExactMatch(input: string, target: string): boolean {
  return input.toLowerCase().trim() === target.toLowerCase().trim();
}

/**
 * 🔍 NEU: Prüfe auf EXAKTE Duplikate auf allen Ebenen
 * 
 * ⚠️ WICHTIG FÜR API-INTEGRATION:
 * Diese Funktion ist ein MOCK für Testing!
 * 
 * Die echte API wird VIEL INTELLIGENTER sein:
 * - Semantische Analyse statt String-Matching
 * - "Quadratische Funktionen" → erkennt dass es zu "Algebra" gehört
 * - "Wie löse ich x² = 4?" → erkennt dass es in "Quadratische Gleichungen" inkludiert ist
 * 
 * Die API bekommt ALLE existierenden Inhalte und entscheidet:
 * - Ist der User-Input bereits irgendwo abgedeckt? → Return 'already-exists' mit Hierarchie
 * - Passt der Input zu bestehender Kategorie/Topic? → Erstelle nur fehlende Ebenen
 * - Ist es komplett neu? → Erstelle alles
 */
function checkExactDuplicate(
  userInput: string,
  subjectId: string
): AIGenerationResult | null {
  const inputTrimmed = userInput.trim();
  
  // Alle existierenden Inhalte sammeln
  const allCategories = [
    ...categories.filter(c => c.subjectId === subjectId),
    ...getAICategories().filter(c => c.subjectId === subjectId)
  ];
  
  const allTopics = [
    ...standardTopics,
    ...getAITopics()
  ];
  
  const allSubtopics = [
    ...standardSubtopics,
    ...getAISubtopics()
  ];
  
  // 1️⃣ Prüfe: Kategorie mit EXAKT diesem Namen?
  for (const category of allCategories) {
    if (isExactMatch(inputTrimmed, category.name)) {
      console.log('⚠️ DUPLIKAT GEFUNDEN: Kategorie existiert bereits!', category.name);
      
      // ✅ FINDE ALLE TOPICS UND SUBTOPICS FÜR DIESE KATEGORIE
      const relatedTopics = allTopics.filter(t => t.categoryId === category.id);
      
      return {
        type: 'already-exists',
        category: {
          id: category.id,
          name: category.name,
          isNew: false,
          aiGenerated: category.aiGenerated || false
        },
        subtopics: [],
        existingContent: {
          categories: [{
            id: category.id,
            name: category.name,
            aiGenerated: category.aiGenerated || false,
            topics: relatedTopics.map(topic => ({
              id: topic.id,
              name: topic.name,
              aiGenerated: topic.aiGenerated || false,
              subtopics: getAISubtopics().filter(s => s.topicId === topic.id).map(subtopic => ({
                id: subtopic.id,
                name: subtopic.name,
                aiGenerated: subtopic.aiGenerated || false
              }))
            }))
          }]
        }
      };
    }
  }
  
  // 2️⃣ Prüfe: Topic mit EXAKT diesem Namen?
  
  for (const topic of allTopics) {
    if (isExactMatch(inputTrimmed, topic.name)) {
      const category = allCategories.find(c => c.id === topic.categoryId);
      if (category) {
        console.log('⚠️ DUPLIKAT GEFUNDEN: Topic existiert bereits!', topic.name);
        return {
          type: 'already-exists',
          category: {
            id: category.id,
            name: category.name,
            isNew: false,
            aiGenerated: category.aiGenerated || false
          },
          topic: {
            id: topic.id,
            name: topic.name,
            isNew: false,
            aiGenerated: topic.aiGenerated || false
          },
          subtopics: []
        };
      }
    }
  }
  
  // 3️⃣ Prüfe: Subtopic mit EXAKT diesem Namen?
  
  for (const subtopic of allSubtopics) {
    if (isExactMatch(inputTrimmed, subtopic.name)) {
      const topic = allTopics.find(t => t.id === subtopic.topicId);
      if (topic) {
        const category = allCategories.find(c => c.id === topic.categoryId);
        if (category) {
          console.log('⚠️ DUPLIKAT GEFUNDEN: Subtopic existiert bereits!', subtopic.name);
          return {
            type: 'already-exists',
            category: {
              id: category.id,
              name: category.name,
              isNew: false,
              aiGenerated: category.aiGenerated || false
            },
            topic: {
              id: topic.id,
              name: topic.name,
              isNew: false,
              aiGenerated: topic.aiGenerated || false
            },
            subtopics: [],
            existingContent: {
              categories: [
                {
                  id: category.id,
                  name: category.name,
                  aiGenerated: category.aiGenerated || false,
                  topics: [
                    {
                      id: topic.id,
                      name: topic.name,
                      aiGenerated: topic.aiGenerated || false,
                      subtopics: [
                        {
                          id: subtopic.id,
                          name: subtopic.name,
                          aiGenerated: subtopic.aiGenerated || false
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          };
        }
      }
    }
  }
  
  // Kein exaktes Duplikat gefunden
  return null;
}

/**
 * 🚨 NEU: Prüfe ob User-Input zum gewählten Fach passt
 * 
 * ⚠️ MOCK-FUNKTION FÜR TESTING!
 * Die echte API macht semantische Analyse!
 * 
 * BEISPIELE:
 * - "Groß- und Kleinschreibung" bei Mathe → Erkennt: Passt zu Deutsch
 * - "Photosynthese" bei Mathe → Erkennt: Passt zu Biologie
 * - "Französische Revolution" bei Mathe → Erkennt: Passt zu Geschichte
 */
function detectSubjectMismatch(
  userInput: string,
  currentSubjectId: string
): AIGenerationResult | null {
  const inputLower = userInput.toLowerCase().trim();
  
  // MOCK: Einfache Keyword-basierte Erkennung
  // Die echte API würde semantische NLP-Analyse machen!
  
  const subjectKeywords: Record<string, string[]> = {
    'german': ['groß', 'klein', 'schreibung', 'grammatik', 'rechtschreibung', 'komma', 'satzzeichen', 'verb', 'nomen', 'adjektiv'],
    'biology': ['photosynthese', 'zelle', 'dna', 'evolution', 'ökosystem', 'pflanze', 'tier', 'biologie'],
    'history': ['revolution', 'krieg', 'mittelalter', 'antike', 'römisch', 'geschichte', 'historisch'],
    'english': ['grammar', 'vocabulary', 'tense', 'englisch', 'vokabeln'],
    'chemistry': ['reaktion', 'atom', 'molekül', 'chemie', 'element', 'säure', 'base'],
    'french': ['französisch', 'conjugation', 'verbe', 'grammaire']
  };
  
  // Prüfe ob Input besser zu anderem Fach passt
  for (const [subjectId, keywords] of Object.entries(subjectKeywords)) {
    if (subjectId === currentSubjectId) continue;
    
    const hasMatch = keywords.some(keyword => inputLower.includes(keyword));
    if (hasMatch) {
      const currentSubject = subjects.find(s => s.id === currentSubjectId);
      const detectedSubject = subjects.find(s => s.id === subjectId);
      
      if (currentSubject && detectedSubject) {
        console.log('🚨 SUBJECT MISMATCH:', {
          input: userInput,
          current: currentSubject.name,
          detected: detectedSubject.name
        });
        
        return {
          type: 'subject-mismatch',
          category: {
            id: '',
            name: '',
            isNew: false,
            aiGenerated: false
          },
          subtopics: [],
          subjectMismatch: {
            currentSubject: {
              id: currentSubject.id,
              name: currentSubject.name
            },
            detectedSubject: {
              id: detectedSubject.id,
              name: detectedSubject.name
            },
            userInput: userInput
          }
        };
      }
    }
  }
  
  return null;
}

/**
 * 🔍 Schritt 1: Finde passende Kategorie
 * 
 * ✅ ERWEITERT MIT TEST-KEYWORDS
 */
function findMatchingCategory(userInput: string, subjectId: string): Category | null {
  const inputLower = userInput.toLowerCase().trim();
  
  // 🧪 TEST-KEYWORDS: Force specific scenarios
  // "neue kategorie" → KEINE Match finden → Erstellt neue Kategorie
  if (inputLower === 'neue kategorie') {
    console.log('🧪 TEST: "neue kategorie" → Keine Kategorie matchen');
    return null;
  }
  
  // "neue themen" → FORCE Match zu erster Kategorie → Erstellt neues Thema
  if (inputLower === 'neue themen' || inputLower === 'neues thema') {
    console.log('🧪 TEST: "neue themen" → Force Match zu erster Kategorie');
    const allCategories = [
      ...categories.filter(c => c.subjectId === subjectId),
      ...getAICategories().filter(c => c.subjectId === subjectId)
    ];
    if (allCategories.length > 0) {
      console.log('✅ Force-Match zu Kategorie:', allCategories[0].name);
      return allCategories[0];
    }
  }
  
  // "neue unterthemen" → FORCE Match zu erster Kategorie → Wird später Topic matchen
  if (inputLower === 'neue unterthemen') {
    console.log('🧪 TEST: "neue unterthemen" → Force Match zu erster Kategorie');
    const allCategories = [
      ...categories.filter(c => c.subjectId === subjectId),
      ...getAICategories().filter(c => c.subjectId === subjectId)
    ];
    if (allCategories.length > 0) {
      console.log('✅ Force-Match zu Kategorie:', allCategories[0].name);
      return allCategories[0];
    }
  }
  
  // Kombiniere Standard + AI Kategorien
  const allCategories = [
    ...categories.filter(c => c.subjectId === subjectId),
    ...getAICategories().filter(c => c.subjectId === subjectId)
  ];
  
  console.log('🔍 Kategorie-Check:', {
    userInput,
    subjectId,
    availableCategories: allCategories.map(c => c.name)
  });
  
  // Suche ähnliche Kategorie
  for (const category of allCategories) {
    if (isSimilar(userInput, category.name)) {
      console.log('✅ Kategorie gefunden:', category.name);
      return category;
    }
  }
  
  console.log('❌ Keine passende Kategorie gefunden');
  return null;
}

/**
 * 🔍 Schritt 2: Finde passendes Topic
 * 
 * ✅ ERWEITERT MIT TEST-KEYWORDS
 */
function findMatchingTopic(userInput: string, categoryId: string): Topic | null {
  const inputLower = userInput.toLowerCase().trim();
  
  // 🧪 TEST-KEYWORDS
  // "neue themen" → KEINE Topic-Match → Erstellt neues Thema
  if (inputLower === 'neue themen' || inputLower === 'neues thema') {
    console.log('🧪 TEST: "neue themen" → Kein Topic matchen');
    return null;
  }
  
  // "neue unterthemen" → FORCE Match zu erstem Topic → Erstellt nur Subtopics
  if (inputLower === 'neue unterthemen') {
    console.log('🧪 TEST: "neue unterthemen" → Force Match zu erstem Topic');
    const allTopics = [
      ...standardTopics.filter(t => t.categoryId === categoryId),
      ...getAITopics().filter(t => t.categoryId === categoryId)
    ];
    if (allTopics.length > 0) {
      console.log('✅ Force-Match zu Topic:', allTopics[0].name);
      return allTopics[0];
    }
  }
  
  // Kombiniere Standard + AI Topics
  const allTopics = [
    ...standardTopics.filter(t => t.categoryId === categoryId),
    ...getAITopics().filter(t => t.categoryId === categoryId)
  ];
  
  console.log('🔍 Topic-Check:', {
    userInput,
    categoryId,
    availableTopics: allTopics.map(t => t.name)
  });
  
  // Suche ähnliches Topic
  for (const topic of allTopics) {
    if (isSimilar(userInput, topic.name)) {
      console.log('✅ Topic gefunden:', topic.name);
      return topic;
    }
  }
  
  console.log('❌ Kein passendes Topic gefunden');
  return null;
}

/**
 * 🏗️ Erstelle neue Kategorie + Topic + Subtopics
 */
function createNewCategory(
  userInput: string,
  subjectId: string
): AIGenerationResult {
  const timestamp = Date.now();
  
  // Erstelle Kategorie
  const categoryName = userInput.trim();
  const newCategory: Category = {
    id: `ai-cat-${timestamp}`,
    name: categoryName,
    subjectId: subjectId,
    aiGenerated: true
  };
  saveAICategory(newCategory);
  console.log('✅ Neue Kategorie erstellt:', newCategory);
  
  // Erstelle Topic
  const topicName = `${categoryName} - Grundlagen`;
  const newTopic: Topic = {
    id: `ai-topic-${timestamp}`,
    name: topicName,
    categoryId: newCategory.id,
    aiGenerated: true
  };
  saveAITopic(newTopic);
  console.log('✅ Neues Topic erstellt:', newTopic);
  
  // Erstelle Subtopics
  const subtopicNames = [
    `${categoryName} - Einführung`,
    `${categoryName} - Grundkonzepte`,
    `${categoryName} - Anwendung`
  ];
  
  subtopicNames.forEach((subtopicName, index) => {
    const subtopic: Subtopic = {
      id: `ai-subtopic-${timestamp}-${index}`,
      name: subtopicName,
      topicId: newTopic.id,
      aiGenerated: true
    };
    saveAISubtopic(subtopic);
  });
  console.log(`✅ ${subtopicNames.length} Subtopics erstellt`);
  
  return {
    type: 'new-category',
    category: {
      id: newCategory.id,
      name: newCategory.name,
      isNew: true,
      aiGenerated: true
    },
    topic: {
      id: newTopic.id,
      name: newTopic.name,
      isNew: true,
      aiGenerated: true
    },
    subtopics: subtopicNames
  };
}

/**
 * 🏗️ Erstelle neues Topic + Subtopics (in bestehender Kategorie)
 */
function createNewTopic(
  userInput: string,
  categoryId: string
): AIGenerationResult {
  const timestamp = Date.now();
  
  // Hole Kategorie Info
  const allCategories = [...categories, ...getAICategories()];
  const category = allCategories.find(c => c.id === categoryId)!;
  
  // Erstelle Topic
  const topicName = userInput.trim();
  const newTopic: Topic = {
    id: `ai-topic-${timestamp}`,
    name: topicName,
    categoryId: categoryId,
    aiGenerated: true
  };
  saveAITopic(newTopic);
  console.log('✅ Neues Topic erstellt:', newTopic);
  
  // Erstelle Subtopics
  const subtopicNames = [
    `${topicName} - Grundlagen`,
    `${topicName} - Anwendung`,
    `${topicName} - Vertiefung`
  ];
  
  subtopicNames.forEach((subtopicName, index) => {
    const subtopic: Subtopic = {
      id: `ai-subtopic-${timestamp}-${index}`,
      name: subtopicName,
      topicId: newTopic.id,
      aiGenerated: true
    };
    saveAISubtopic(subtopic);
  });
  console.log(`✅ ${subtopicNames.length} Subtopics erstellt`);
  
  return {
    type: 'new-topic',
    category: {
      id: category.id,
      name: category.name,
      isNew: false,
      aiGenerated: category.aiGenerated || false
    },
    topic: {
      id: newTopic.id,
      name: newTopic.name,
      isNew: true,
      aiGenerated: true
    },
    subtopics: subtopicNames
  };
}

/**
 * 🏗️ Erstelle nur Subtopics (für bestehendes Topic)
 */
function createNewSubtopics(
  userInput: string,
  topicId: string
): AIGenerationResult {
  const timestamp = Date.now();
  
  // Hole Topic + Category Info
  const allTopics = [...standardTopics, ...getAITopics()];
  const topic = allTopics.find(t => t.id === topicId)!;
  
  const allCategories = [...categories, ...getAICategories()];
  const category = allCategories.find(c => c.id === topic.categoryId)!;
  
  // Erstelle Subtopics
  const subtopicNames = [
    `${userInput} - Grundlagen`,
    `${userInput} - Anwendung`,
    `${userInput} - Vertiefung`
  ];
  
  subtopicNames.forEach((subtopicName, index) => {
    const subtopic: Subtopic = {
      id: `ai-subtopic-${timestamp}-${index}`,
      name: subtopicName,
      topicId: topicId,
      aiGenerated: true
    };
    saveAISubtopic(subtopic);
  });
  console.log(`✅ ${subtopicNames.length} Subtopics erstellt`);
  
  return {
    type: 'new-subtopics',
    category: {
      id: category.id,
      name: category.name,
      isNew: false,
      aiGenerated: category.aiGenerated || false
    },
    topic: {
      id: topic.id,
      name: topic.name,
      isNew: false,
      aiGenerated: topic.aiGenerated || false
    },
    subtopics: subtopicNames
  };
}

/**
 * 🤖 HAUPTFUNKTION: Hierarchische AI-Content-Generierung
 */
export async function generateAIContentHierarchically(
  userInput: string,
  subjectId: string
): Promise<AIGenerationResult> {
  console.log('🤖 AI-GENERATION START:', { userInput, subjectId });
  
  // ⚠️ PRODUCTION TODO: Ersetze diese Zeile durch echten API-Call!
  // await fetch('/api/ai/generate', { method: 'POST', body: JSON.stringify({ userInput, subjectId }) })
  await new Promise(resolve => setTimeout(resolve, 3500)); // 3.5 Sekunden künstliches Delay
  
  // 🔍 SCHRITT 0: Prüfe auf EXAKTE Duplikate (wird später von API gemacht)
  const duplicateCheck = checkExactDuplicate(userInput, subjectId);
  if (duplicateCheck) {
    console.log('⚠️ DUPLIKAT GEFUNDEN - User wird benachrichtigt');
    return duplicateCheck;
  }
  
  // 🔍 SCHRITT 1: Prüfe auf Fach-Mismatch (wird später von API gemacht)
  const subjectMismatchCheck = detectSubjectMismatch(userInput, subjectId);
  if (subjectMismatchCheck) {
    console.log('🚨 Fach-MISMATCH GEFUNDEN - User wird benachrichtigt');
    return subjectMismatchCheck;
  }
  
  // 1️⃣ Kategorie-Check
  const matchingCategory = findMatchingCategory(userInput, subjectId);
  
  if (!matchingCategory) {
    console.log('📦 Erstelle: Neue Kategorie + Topic + Subtopics');
    return createNewCategory(userInput, subjectId);
  }
  
  // 2️⃣ Topic-Check
  const matchingTopic = findMatchingTopic(userInput, matchingCategory.id);
  
  if (!matchingTopic) {
    console.log('📦 Erstelle: Neues Topic + Subtopics (in bestehender Kategorie)');
    return createNewTopic(userInput, matchingCategory.id);
  }
  
  // 3️⃣ Erstelle nur Subtopics
  console.log('📦 Erstelle: Nur Subtopics (für bestehendes Topic)');
  return createNewSubtopics(userInput, matchingTopic.id);
}

/**
 * 🧪 TEST-FUNKTION: Zeige komplexe Duplikat-Hierarchie
 * 
 * Demonstriert die Flexibilität der API:
 * - 2 Kategorien (gemischt: Standard + AI)
 * - 5 Themen (gemischt: Standard + AI)
 * - 12 Unterthemen (VERSCHACHTELT unter ihren Topics!)
 * 
 * USAGE: Füge diese Funktion in handleAIGeneration ein zum Testen
 */
export function createComplexDuplicateTestCase(): AIGenerationResult {
  return {
    type: 'already-exists',
    category: {
      id: 'test-cat-1',
      name: 'Mathematik Grundlagen',
      isNew: false,
      aiGenerated: true
    },
    existingContent: {
      categories: [
        // KATEGORIE 1: Mathematik Grundlagen (KI)
        {
          id: 'cat-1',
          name: 'Mathematik Grundlagen',
          aiGenerated: true,
          topics: [
            // Topic 1: Lineare Gleichungen (Standard mit 2 Subtopics)
            {
              id: 'topic-1',
              name: 'Lineare Gleichungen',
              aiGenerated: false,
              subtopics: [
                {
                  id: 'sub-1',
                  name: 'Substitutionsmethode',
                  aiGenerated: false
                },
                {
                  id: 'sub-2',
                  name: 'Additionsmethode',
                  aiGenerated: false
                }
              ]
            },
            // Topic 2: Quadratische Gleichungen (KI mit 3 Subtopics)
            {
              id: 'topic-2',
              name: 'Quadratische Gleichungen',
              aiGenerated: true,
              subtopics: [
                {
                  id: 'sub-3',
                  name: 'pq-Formel',
                  aiGenerated: false
                },
                {
                  id: 'sub-4',
                  name: 'abc-Formel (Mitternachtsformel)',
                  aiGenerated: true
                },
                {
                  id: 'sub-5',
                  name: 'Quadratische Ergänzung',
                  aiGenerated: true
                }
              ]
            },
            // Topic 3: Exponentialfunktionen (Standard mit 3 Subtopics)
            {
              id: 'topic-3',
              name: 'Exponentialfunktionen',
              aiGenerated: false,
              subtopics: [
                {
                  id: 'sub-6',
                  name: 'Wachstumsprozesse',
                  aiGenerated: true
                },
                {
                  id: 'sub-7',
                  name: 'Zerfallsprozesse',
                  aiGenerated: true
                },
                {
                  id: 'sub-8',
                  name: 'e-Funktion Eigenschaften',
                  aiGenerated: false
                }
              ]
            }
          ]
        },
        // KATEGORIE 2: Algebra (Standard)
        {
          id: 'cat-2',
          name: 'Algebra',
          aiGenerated: false,
          topics: [
            // Topic 4: Logarithmus (KI mit 2 Subtopics)
            {
              id: 'topic-4',
              name: 'Logarithmus-Funktionen',
              aiGenerated: true,
              subtopics: [
                {
                  id: 'sub-9',
                  name: 'Logarithmusgesetze',
                  aiGenerated: false
                },
                {
                  id: 'sub-10',
                  name: 'Natürlicher Logarithmus',
                  aiGenerated: true
                }
              ]
            },
            // Topic 5: Trigonometrie (Standard mit 2 Subtopics)
            {
              id: 'topic-5',
              name: 'Trigonometrische Funktionen',
              aiGenerated: false,
              subtopics: [
                {
                  id: 'sub-11',
                  name: 'Sinus & Kosinus',
                  aiGenerated: false
                },
                {
                  id: 'sub-12',
                  name: 'Tangens & Kotangens',
                  aiGenerated: false
                }
              ]
            }
          ]
        }
      ]
    },
    subtopics: []
  };
}