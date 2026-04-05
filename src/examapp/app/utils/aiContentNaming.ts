/**
 * AI Content Naming - Mock KI die aus User-Input intelligente Kategorie/Themen/Unterthemen-Namen generiert
 * In Production würde dies durch echte KI-API ersetzt werden
 * 
 * WICHTIG: Diese Mock-Version nutzt KEINE Keyword-Datenbank mehr, sondern erstellt
 * direkt aus dem User-Input neue Kategorien/Topics. Die echte KI-API wird später
 * die intelligente Analyse übernehmen.
 */

type AIGeneratedContent = {
  categoryName: string;
  topics: string[];
  subtopicsPerTopic: string[][];
};

/**
 * Generiert intelligente Kategorie-, Themen- und Unterthemen-Namen basierend auf User-Input
 * Mock-Implementierung - in Production würde dies durch echte KI-API ersetzt
 * 
 * WICHTIG: Diese Mock-Version erstellt IMMER neue Kategorien basierend auf User-Input,
 * damit die Logik getestet werden kann. In Production übernimmt die echte KI-API
 * die intelligente Generierung.
 */
export function generateAIContentNames(
  userInput: string,
  subjectId: string
): AIGeneratedContent {
  // Kapitalisiere den ersten Buchstaben für schönere Namen
  const capitalizedInput = userInput.charAt(0).toUpperCase() + userInput.slice(1);
  
  console.log('🤖 Mock-KI generiert Content für:', { userInput, subjectId });
  
  // Generiere 3 Topics basierend auf dem User-Input
  const topics = [
    `${capitalizedInput} - Grundlagen`,
    `${capitalizedInput} - Vertiefung`,
    `${capitalizedInput} - Praxis`
  ];
  
  // Generiere 3 Subtopics pro Topic
  const subtopicsPerTopic = [
    ['Einführung', 'Theorie', 'Übungen'],
    ['Fortgeschrittene Konzepte', 'Anwendungen', 'Problemlösung'],
    ['Praxisbeispiele', 'Projektarbeit', 'Wiederholung']
  ];

  console.log('✅ Mock-KI hat generiert:', {
    categoryName: capitalizedInput,
    topics,
    subtopicsPerTopic
  });

  return {
    categoryName: capitalizedInput,
    topics,
    subtopicsPerTopic
  };
}

/**
 * Generiert intelligente Themen- und Unterthemen-Namen für eine existierende Kategorie
 * Mock-Implementierung - in Production würde dies durch echte KI-API ersetzt
 */
export function generateTopicsForCategory(
  userInput: string,
  categoryName: string,
  subjectId: string
): { topics: string[]; subtopicsPerTopic: string[][] } {
  // Kapitalisiere den ersten Buchstaben für schönere Namen
  const capitalizedInput = userInput.charAt(0).toUpperCase() + userInput.slice(1);
  
  console.log('🤖 Mock-KI generiert Topic für Kategorie:', { userInput, categoryName });
  
  // Generiere 1 Topic basierend auf dem User-Input
  const topics = [capitalizedInput];
  
  // Generiere 3 Subtopics für das Topic
  const subtopicsPerTopic = [
    ['Einführung', 'Übungen', 'Vertiefung']
  ];

  console.log('✅ Mock-KI hat Topic generiert:', { topics, subtopicsPerTopic });

  return {
    topics,
    subtopicsPerTopic
  };
}