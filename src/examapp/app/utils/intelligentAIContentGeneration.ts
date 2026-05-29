/**
 * Intelligente AI Content Generation
 * 
 * Die KI analysiert User-Input und entscheidet hierarchisch was erstellt werden muss:
 * 1. Passende Kategorie finden → Nein? Erstelle neue Kategorie
 * 2. Passendes Thema finden → Nein? Erstelle neues Thema
 * 3. Passende Unterthemen finden → Nein? Erstelle fehlende Unterthemen
 * 
 * Die KI erstellt NUR was wirklich fehlt, nicht einfach immer neue Kategorien.
 * 
 * MOCK-VERSION: Die Namen werden aktuell von generateAIContentNames() generiert,
 * das einfach den User-Input als Basis nutzt. In Production wird die echte KI-API
 * intelligente Namen generieren und die Matching-Logik hier funktioniert dann genauso.
 * 
 * TEST-KEYWORDS (für Mock-Testing):
 * - "neue kategorie" → Erstellt komplett neue Kategorie mit Topics & Subtopics
 * - "neues thema" → Erstellt nur Topic in bestehender Kategorie
 * - "neue unterthemen" → Erstellt nur Subtopics in bestehendem Topic
 * - "duplikat" → Simuliert existierenden Content
 */

import { generateAIContentNames } from './aiContentNaming';
import { Category } from '../data/categories';
import { Topic } from '../data/topics';
import { Subtopic } from '../data/subtopics';

// Fuzzy String Matching (Levenshtein Distance)
function levenshteinDistance(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  const matrix: number[][] = [];

  if (an === 0) return bn;
  if (bn === 0) return an;

  for (let i = 0; i <= bn; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= an; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[bn][an];
}

function similarityScore(a: string, b: string): number {
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

// AI Decision Types
type AIDecision =
  | {
      action: 'create_category';
      categoryName: string;
      topics: string[];
      subtopicsPerTopic: string[][];
    }
  | {
      action: 'create_topic';
      categoryId: string;
      categoryName: string;
      topicName: string;
      subtopics: string[];
    }
  | {
      action: 'create_subtopics';
      categoryId: string;
      topicId: string;
      categoryName: string;
      topicName: string;
      subtopics: string[];
    }
  | {
      action: 'content_exists';
      message: string;
      categoryName: string;
      topicName: string;
      subtopicCount: number;
      subtopicName?: string;
    };

/**
 * Hauptfunktion: Analysiert User-Input und entscheidet was erstellt werden muss
 */
export function analyzeAndDecide(
  userInput: string,
  subjectId: string,
  existingCategories: Category[],
  existingTopics: Topic[],
  existingSubtopics: Subtopic[]
): AIDecision {
  console.log('🔍 Analysiere User-Input:', userInput);
  
  // ============================================================
  // TEST-KEYWORDS (Mock-Modus für einfaches Testing)
  // ============================================================
  const inputLower = userInput.toLowerCase().trim();
  
  // TEST 1: "neue kategorie" → Erstellt komplett neue Kategorie
  if (inputLower === 'neue kategorie') {
    console.log('🧪 TEST-KEYWORD erkannt: NEUE KATEGORIE');
    const aiContent = generateAIContentNames(userInput, subjectId);
    return {
      action: 'create_category',
      categoryName: aiContent.categoryName,
      topics: aiContent.topics,
      subtopicsPerTopic: aiContent.subtopicsPerTopic
    };
  }
  
  // TEST 2: "neues thema" → Erstellt Topic in ERSTER bestehender Kategorie
  if (inputLower === 'neues thema') {
    console.log('🧪 TEST-KEYWORD erkannt: NEUES THEMA');
    
    if (existingCategories.length === 0) {
      console.log('⚠️ Keine Kategorien vorhanden - erstelle neue Kategorie stattdessen');
      const aiContent = generateAIContentNames('Test Kategorie', subjectId);
      return {
        action: 'create_category',
        categoryName: aiContent.categoryName,
        topics: aiContent.topics,
        subtopicsPerTopic: aiContent.subtopicsPerTopic
      };
    }
    
    const targetCategory = existingCategories[0];
    return {
      action: 'create_topic',
      categoryId: targetCategory.id,
      categoryName: targetCategory.name,
      topicName: 'Neues Thema',
      subtopics: ['Einführung', 'Übungen', 'Vertiefung']
    };
  }
  
  // TEST 3: "neue unterthemen" → Erstellt Subtopics in ERSTEM bestehenden Topic
  if (inputLower === 'neue unterthemen') {
    console.log('🧪 TEST-KEYWORD erkannt: NEUE UNTERTHEMEN');
    
    if (existingTopics.length === 0 || existingCategories.length === 0) {
      console.log('⚠️ Keine Topics/Kategorien vorhanden - erstelle neue Kategorie stattdessen');
      const aiContent = generateAIContentNames('Test Kategorie', subjectId);
      return {
        action: 'create_category',
        categoryName: aiContent.categoryName,
        topics: aiContent.topics,
        subtopicsPerTopic: aiContent.subtopicsPerTopic
      };
    }
    
    const targetTopic = existingTopics[0];
    const targetCategory = existingCategories.find(cat => cat.id === targetTopic.categoryId);
    
    if (!targetCategory) {
      console.log('⚠️ Kategorie nicht gefunden - erstelle neue Kategorie');
      const aiContent = generateAIContentNames('Test Kategorie', subjectId);
      return {
        action: 'create_category',
        categoryName: aiContent.categoryName,
        topics: aiContent.topics,
        subtopicsPerTopic: aiContent.subtopicsPerTopic
      };
    }
    
    return {
      action: 'create_subtopics',
      categoryId: targetCategory.id,
      topicId: targetTopic.id,
      categoryName: targetCategory.name,
      topicName: targetTopic.name,
      subtopics: ['Neue Übung 1', 'Neue Übung 2', 'Neue Übung 3']
    };
  }
  
  // TEST 4: "duplikat" → Simuliert existierenden Content
  if (inputLower === 'duplikat') {
    console.log('🧪 TEST-KEYWORD erkannt: DUPLIKAT');
    
    if (existingCategories.length === 0) {
      console.log('⚠️ Keine Kategorien vorhanden - erstelle neue Kategorie stattdessen');
      const aiContent = generateAIContentNames('Test Kategorie', subjectId);
      return {
        action: 'create_category',
        categoryName: aiContent.categoryName,
        topics: aiContent.topics,
        subtopicsPerTopic: aiContent.subtopicsPerTopic
      };
    }
    
    const category = existingCategories[0];
    const categoryTopics = existingTopics.filter(t => t.categoryId === category.id);
    
    if (categoryTopics.length === 0) {
      console.log('⚠️ Keine Topics vorhanden - erstelle neues Topic');
      return {
        action: 'create_topic',
        categoryId: category.id,
        categoryName: category.name,
        topicName: 'Neues Thema',
        subtopics: ['Einführung', 'Übungen', 'Vertiefung']
      };
    }
    
    const topic = categoryTopics[0];
    const topicSubtopics = existingSubtopics.filter(s => s.topicId === topic.id);
    
    return {
      action: 'content_exists',
      message: 'Dieser Content existiert bereits!',
      categoryName: category.name,
      topicName: topic.name,
      subtopicCount: topicSubtopics.length,
      subtopicName: topicSubtopics.length > 0 ? topicSubtopics[0].name : undefined
    };
  }
  
  // ============================================================
  // NORMALE LOGIK (wenn keine Test-Keywords verwendet werden)
  // ============================================================
  
  // Generiere intelligente Namen basierend auf User-Input
  const aiContent = generateAIContentNames(userInput, subjectId);
  
  console.log('🤖 KI-Vorschlag:', aiContent);

  // Schritt 1: Prüfe ob passende Kategorie existiert
  const matchingCategory = findMatchingCategory(
    aiContent.categoryName, 
    existingCategories
  );

  if (!matchingCategory) {
    // KEINE passende Kategorie → Erstelle neue Kategorie mit Topics & Subtopics
    console.log('✨ Entscheidung: Neue Kategorie erstellen');
    return {
      action: 'create_category',
      categoryName: aiContent.categoryName,
      topics: aiContent.topics,
      subtopicsPerTopic: aiContent.subtopicsPerTopic
    };
  }

  console.log('✅ Passende Kategorie gefunden:', matchingCategory.name);

  // Schritt 2: Kategorie existiert → Prüfe ZUERST ob User ein spezifisches Subtopic sucht
  // (Wichtig: Über ALLE Topics in der Kategorie suchen, nicht nur in einem Topic!)
  const categoryTopics = existingTopics.filter(t => t.categoryId === matchingCategory.id);
  const categorySubtopics = existingSubtopics.filter(s => 
    categoryTopics.some(t => t.id === s.topicId)
  );
  
  console.log(`📊 Kategorie-Inhalt: ${categoryTopics.length} Topics, ${categorySubtopics.length} Subtopics`);
  
  // Prüfe ob User nach einem SPEZIFISCHEN Subtopic gefragt hat
  const matchingSubtopic = findMatchingSubtopic(userInput, categorySubtopics);
  
  if (matchingSubtopic) {
    // Finde das Topic zu diesem Subtopic
    const subtopicTopic = categoryTopics.find(t => t.id === matchingSubtopic.topicId);
    
    if (subtopicTopic) {
      const topicSubtopicsCount = categorySubtopics.filter(s => s.topicId === subtopicTopic.id).length;
      
      console.log(`✅ Spezifisches Unterthema gefunden: "${matchingSubtopic.name}" in Topic "${subtopicTopic.name}"`);
      return {
        action: 'content_exists',
        message: `Kategorie "${matchingCategory.name}" → Thema "${subtopicTopic.name}" → Unterthema "${matchingSubtopic.name}" existiert bereits.`,
        categoryName: matchingCategory.name,
        topicName: subtopicTopic.name,
        subtopicCount: topicSubtopicsCount,
        subtopicName: matchingSubtopic.name
      };
    }
  }
  
  // Schritt 3: Kein spezifisches Subtopic gefunden → Prüfe Topics
  const matchingTopic = findMatchingTopic(
    userInput,
    aiContent.topics,
    categoryTopics
  );

  if (!matchingTopic) {
    // KEIN passendes Topic → Erstelle neues Topic mit Subtopics
    console.log('✨ Entscheidung: Neues Topic in existierender Kategorie erstellen');
    
    // Generiere Topic-Namen basierend auf User-Input
    const topicSuggestion = generateTopicsForCategory(userInput, matchingCategory.name, subjectId);
    
    return {
      action: 'create_topic',
      categoryId: matchingCategory.id,
      categoryName: matchingCategory.name,
      topicName: topicSuggestion.topics[0], // Nur 1 Topic erstellen
      subtopics: topicSuggestion.subtopicsPerTopic[0]
    };
  }

  console.log('✅ Passendes Topic gefunden:', matchingTopic.name);

  // Schritt 4: Topic existiert → Prüfe Subtopics
  const topicSubtopics = existingSubtopics.filter(s => s.topicId === matchingTopic.id);
  
  if (topicSubtopics.length === 0) {
    // KEINE Subtopics → Erstelle Subtopics
    console.log('✨ Entscheidung: Neue Subtopics in existierendem Topic erstellen');
    
    const subtopicSuggestion = generateTopicsForCategory(userInput, matchingCategory.name, subjectId);
    
    return {
      action: 'create_subtopics',
      categoryId: matchingCategory.id,
      topicId: matchingTopic.id,
      categoryName: matchingCategory.name,
      topicName: matchingTopic.name,
      subtopics: subtopicSuggestion.subtopicsPerTopic[0]
    };
  }

  // Alles existiert bereits (aber kein spezifisches Subtopic im User-Input)
  console.log('ℹ️ Content existiert bereits vollständig');
  
  return {
    action: 'content_exists',
    message: `Kategorie "${matchingCategory.name}" → Thema "${matchingTopic.name}" existiert bereits mit ${topicSubtopics.length} Unterthemen.`,
    categoryName: matchingCategory.name,
    topicName: matchingTopic.name,
    subtopicCount: topicSubtopics.length
  };
}

/**
 * Findet passende Kategorie (flexible Matching)
 */
function findMatchingCategory(
  suggestedName: string,
  existingCategories: Category[]
): Category | null {
  const normalized = suggestedName.toLowerCase().trim();
  
  // Exakte Übereinstimmung (höchste Priorität)
  let match = existingCategories.find(
    cat => cat.name.toLowerCase().trim() === normalized
  );
  
  if (match) {
    console.log('✅ Exakte Kategorie-Übereinstimmung:', match.name);
    return match;
  }
  
  // Sehr ähnliche Namen (80%+ Übereinstimmung)
  // Z.B. "Quantenphysik" matches "Quantenphysik & Quantenmechanik"
  match = existingCategories.find(cat => {
    const catNormalized = cat.name.toLowerCase().trim();
    const similarity = calculateSimilarity(normalized, catNormalized);
    if (similarity > 0.8) {
      console.log(`✅ Ähnliche Kategorie gefunden: "${cat.name}" (${Math.round(similarity * 100)}% Ähnlichkeit)`);
      return true;
    }
    return false;
  });
  
  if (match) return match;
  
  // Keyword-basiertes Matching (nur wenn wirklich eindeutig)
  const suggestedKeywords = normalized.split(/\s+|&/).filter(w => w.length > 3);
  
  for (const category of existingCategories) {
    const categoryKeywords = category.name.toLowerCase().split(/\s+|&/).filter(w => w.length > 3);
    
    // Mindestens 70% der Keywords müssen übereinstimmen UND mind. 2 Keywords
    const matchingKeywords = suggestedKeywords.filter(kw => 
      categoryKeywords.some(ckw => ckw.includes(kw) || kw.includes(ckw))
    );
    
    if (matchingKeywords.length >= Math.max(2, Math.ceil(suggestedKeywords.length * 0.7))) {
      console.log(`✅ Keyword-Match Kategorie: "${category.name}" (${matchingKeywords.length}/${suggestedKeywords.length} Keywords)`);
      return category;
    }
  }
  
  console.log('❌ Keine passende Kategorie gefunden');
  return null;
}

/**
 * Findet passendes Topic (flexible Matching)
 */
function findMatchingTopic(
  userInput: string,
  suggestedTopics: string[],
  existingTopics: Topic[]
): Topic | null {
  const inputNormalized = userInput.toLowerCase().trim();
  
  console.log('🔍 Topic-Suche startet:', {
    userInput: inputNormalized,
    suggestedTopics,
    existingTopicsCount: existingTopics.length
  });
  
  // Prüfe zuerst ob vorgeschlagene Topics bereits existieren (höchste Priorität)
  for (const suggestedTopic of suggestedTopics) {
    const suggestedNormalized = suggestedTopic.toLowerCase().trim();
    
    const match = existingTopics.find(topic => {
      const topicNormalized = topic.name.toLowerCase().trim();
      
      // Exakte Übereinstimmung
      if (topicNormalized === suggestedNormalized) {
        console.log(`✅ Exakte Topic-Übereinstimmung: "${topic.name}"`);
        return true;
      }
      
      // Sehr ähnliche Namen (85%+ Ähnlichkeit)
      const similarity = calculateSimilarity(suggestedNormalized, topicNormalized);
      if (similarity > 0.85) {
        console.log(`✅ Ähnliches Topic gefunden: "${topic.name}" (${Math.round(similarity * 100)}% Ähnlichkeit)`);
        return true;
      }
      
      return false;
    });
    
    if (match) return match;
  }
  
  // Prüfe ob User-Input direkt ein Topic erwähnt (mittlere Priorität)
  for (const topic of existingTopics) {
    const topicNormalized = topic.name.toLowerCase().trim();
    
    // User-Input enthält den Topic-Namen
    if (inputNormalized.includes(topicNormalized)) {
      console.log(`✅ Topic im User-Input gefunden: "${topic.name}"`);
      return topic;
    }
    
    // Topic-Name enthält den User-Input (mit mind. 5 Zeichen)
    if (inputNormalized.length >= 5 && topicNormalized.includes(inputNormalized)) {
      console.log(`✅ User-Input im Topic-Namen gefunden: "${topic.name}"`);
      return topic;
    }
  }
  
  // Keyword-basiertes Matching (niedrigste Priorität, sehr streng)
  const inputKeywords = inputNormalized.split(/\s+/).filter(w => w.length > 4);
  
  if (inputKeywords.length > 0) {
    for (const topic of existingTopics) {
      const topicKeywords = topic.name.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      
      const matchingKeywords = inputKeywords.filter(kw =>
        topicKeywords.some(tkw => tkw.includes(kw) || kw.includes(tkw))
      );
      
      // Mind. 75% der Keywords UND mind. 2 Keywords müssen matchen
      if (matchingKeywords.length >= Math.max(2, Math.ceil(inputKeywords.length * 0.75))) {
        console.log(`✅ Keyword-Match Topic: "${topic.name}" (${matchingKeywords.length}/${inputKeywords.length} Keywords)`);
        return topic;
      }
    }
  }
  
  console.log('❌ Kein passendes Topic gefunden');
  return null;
}

/**
 * Findet passendes Subtopic (flexible Matching)
 */
function findMatchingSubtopic(
  userInput: string,
  existingSubtopics: Subtopic[]
): Subtopic | null {
  const inputNormalized = userInput.toLowerCase().trim();
  
  console.log('🔍 Subtopic-Suche startet:', {
    userInput: inputNormalized,
    existingSubtopicsCount: existingSubtopics.length,
    subtopicNames: existingSubtopics.map(s => s.name)
  });
  
  // Extrahiere wichtige Keywords aus User-Input (Wörter mit mind. 4 Buchstaben)
  const inputWords = inputNormalized.split(/\s+/).filter(w => w.length >= 4);
  
  console.log('📝 Extrahierte Keywords:', inputWords);
  
  // Priorität 1: Exakte Übereinstimmung des gesamten Subtopic-Namens
  for (const subtopic of existingSubtopics) {
    const subtopicNormalized = subtopic.name.toLowerCase().trim();
    
    if (subtopicNormalized === inputNormalized) {
      console.log(`✅ Exakte Subtopic-Übereinstimmung: "${subtopic.name}"`);
      return subtopic;
    }
  }
  
  // Priorität 2: User-Input enthält den vollständigen Subtopic-Namen
  for (const subtopic of existingSubtopics) {
    const subtopicNormalized = subtopic.name.toLowerCase().trim();
    
    if (inputNormalized.includes(subtopicNormalized)) {
      console.log(`✅ Subtopic im User-Input gefunden: "${subtopic.name}"`);
      return subtopic;
    }
  }
  
  // Priorität 3: Subtopic-Name enthält ein wichtiges Keyword aus User-Input
  // Das ist wichtig für Fälle wie "Ich möchte Genitiv lernen" → findet "Genitiv"
  for (const word of inputWords) {
    for (const subtopic of existingSubtopics) {
      const subtopicNormalized = subtopic.name.toLowerCase().trim();
      
      // Keyword ist identisch mit Subtopic-Name (z.B. "genitiv" === "genitiv")
      if (word === subtopicNormalized) {
        console.log(`✅ Keyword-Match (identisch): "${subtopic.name}" matched Keyword "${word}"`);
        return subtopic;
      }
      
      // Subtopic-Name besteht NUR aus diesem Keyword (mit höherer Ähnlichkeit)
      const subtopicWords = subtopicNormalized.split(/\s+/).filter(w => w.length >= 3);
      if (subtopicWords.length === 1 && subtopicWords[0].includes(word)) {
        console.log(`✅ Keyword-Match (einzelnes Wort): "${subtopic.name}" enthält Keyword "${word}"`);
        return subtopic;
      }
      
      // Keyword ist Teil des Subtopic-Namens und lang genug (mind. 5 Zeichen)
      if (word.length >= 5 && subtopicNormalized.includes(word)) {
        console.log(`✅ Keyword-Match (lang): "${subtopic.name}" enthält Keyword "${word}"`);
        return subtopic;
      }
    }
  }
  
  // Priorität 4: Subtopic-Name enthält den User-Input (wenn Input lang genug ist)
  if (inputNormalized.length >= 5) {
    for (const subtopic of existingSubtopics) {
      const subtopicNormalized = subtopic.name.toLowerCase().trim();
      
      if (subtopicNormalized.includes(inputNormalized)) {
        console.log(`✅ User-Input im Subtopic-Namen gefunden: "${subtopic.name}"`);
        return subtopic;
      }
    }
  }
  
  console.log('❌ Kein passendes Subtopic gefunden');
  return null;
}

/**
 * Erklärt die KI-Entscheidung in natürlicher Sprache
 */
export function explainDecision(decision: AIDecision): string {
  switch (decision.action) {
    case 'create_category':
      return `Neue Kategorie "${decision.categoryName}" wird erstellt mit ${decision.topics.length} Themen.`;
    
    case 'create_topic':
      return `Neues Thema "${decision.topicName}" wird in Kategorie "${decision.categoryName}" erstellt.`;
    
    case 'create_subtopics':
      return `${decision.subtopics.length} Unterthemen werden zu "${decision.categoryName} → ${decision.topicName}" hinzugefügt.`;
    
    case 'content_exists':
      return decision.message;
  }
}

/**
 * Berechnet die Ähnlichkeit zwischen zwei Strings
 * @param str1 Erster String
 * @param str2 Zweiter String
 * @returns Ähnlichkeitswert zwischen 0 und 1
 */
function calculateSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1; // Beide Strings sind leer

  const distance = levenshteinDistance(str1, str2);
  return 1 - (distance / maxLength);
}