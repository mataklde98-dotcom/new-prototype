export type Subtopic = {
  id: string;
  name: string;
  topicId: string;
  aiGenerated?: boolean; // AI-generated subtopics have this flag
};

export const allSubtopics: Subtopic[] = [
  // MATHEMATIK - Grenzwerte von Funktionen (math-cat1-topic1)
  { id: 'math-sub1', name: 'Rechtsseitiger Grenzwert', topicId: 'math-cat1-topic1' },
  { id: 'math-sub2', name: 'Linksseitiger Grenzwert', topicId: 'math-cat1-topic1' },
  { id: 'math-sub3', name: 'Beidseitiger Grenzwert', topicId: 'math-cat1-topic1' },
  { id: 'math-sub4', name: 'Grenzwert im Unendlichen', topicId: 'math-cat1-topic1' },
  { id: 'math-sub5', name: 'Uneigentliche Grenzwerte', topicId: 'math-cat1-topic1' },
  
  // MATHEMATIK - Summenregel (math-cat1-topic2)
  { id: 'math-sub6', name: 'Grundlagen der Summenregel', topicId: 'math-cat1-topic2' },
  { id: 'math-sub7', name: 'Summenregel bei Polynomen', topicId: 'math-cat1-topic2' },
  { id: 'math-sub8', name: 'Summenregel mit mehreren Termen', topicId: 'math-cat1-topic2' },
  
  // MATHEMATIK - Produktregel für Grenzwerte (math-cat1-topic3)
  { id: 'math-sub9', name: 'Grundlagen der Produktregel', topicId: 'math-cat1-topic3' },
  { id: 'math-sub10', name: 'Produktregel bei gebrochenen Funktionen', topicId: 'math-cat1-topic3' },
  { id: 'math-sub11', name: 'Produktregel mit Exponentialfunktionen', topicId: 'math-cat1-topic3' },
  
  // MATHEMATIK - Quotientenregel (math-cat1-topic4)
  { id: 'math-sub12', name: 'Grundlagen der Quotientenregel', topicId: 'math-cat1-topic4' },
  { id: 'math-sub13', name: 'Quotientenregel bei Polynomen', topicId: 'math-cat1-topic4' },
  { id: 'math-sub14', name: 'Unbestimmte Formen auflösen', topicId: 'math-cat1-topic4' },
  
  // MATHEMATIK - Epsilon-Delta (math-cat2-topic1)
  { id: 'math-sub15', name: 'Epsilon-Delta Definition verstehen', topicId: 'math-cat2-topic1' },
  { id: 'math-sub16', name: 'Epsilon-Delta Beweise durchführen', topicId: 'math-cat2-topic1' },
  { id: 'math-sub17', name: 'Epsilon und Delta bestimmen', topicId: 'math-cat2-topic1' },
  
  // MATHEMATIK - Kettenregel (math-cat3-topic1)
  { id: 'math-sub18', name: 'Kettenregel Grundlagen', topicId: 'math-cat3-topic1' },
  { id: 'math-sub19', name: 'Mehrfache Verkettung ableiten', topicId: 'math-cat3-topic1' },
  { id: 'math-sub20', name: 'Kettenregel mit trigonometrischen Funktionen', topicId: 'math-cat3-topic1' },
  
  // DEUTSCH - Gedichtformen (german-cat1-topic1)
  { id: 'german-sub1', name: 'Sonett analysieren', topicId: 'german-cat1-topic1' },
  { id: 'german-sub2', name: 'Ballade verstehen', topicId: 'german-cat1-topic1' },
  { id: 'german-sub3', name: 'Freie Verse interpretieren', topicId: 'german-cat1-topic1' },
  { id: 'german-sub4', name: 'Ode und Hymne unterscheiden', topicId: 'german-cat1-topic1' },
  
  // DEUTSCH - Stilmittel (german-cat1-topic2)
  { id: 'german-sub5', name: 'Metapher erkennen', topicId: 'german-cat1-topic2' },
  { id: 'german-sub6', name: 'Personifikation analysieren', topicId: 'german-cat1-topic2' },
  { id: 'german-sub7', name: 'Alliteration identifizieren', topicId: 'german-cat1-topic2' },
  { id: 'german-sub8', name: 'Symbol interpretieren', topicId: 'german-cat1-topic2' },
  
  // DEUTSCH - Romananalyse (german-cat2-topic1)
  { id: 'german-sub9', name: 'Aufbau eines Romans verstehen', topicId: 'german-cat2-topic1' },
  { id: 'german-sub10', name: 'Erzählstränge identifizieren', topicId: 'german-cat2-topic1' },
  { id: 'german-sub11', name: 'Thematik herausarbeiten', topicId: 'german-cat2-topic1' },
  
  // BIOLOGIE - Zellaufbau (biology-cat1-topic1)
  { id: 'biology-sub1', name: 'Zellmembran und Aufbau', topicId: 'biology-cat1-topic1' },
  { id: 'biology-sub2', name: 'Zellkern und DNA', topicId: 'biology-cat1-topic1' },
  { id: 'biology-sub3', name: 'Mitochondrien verstehen', topicId: 'biology-cat1-topic1' },
  { id: 'biology-sub4', name: 'Ribosomen und Proteinbiosynthese', topicId: 'biology-cat1-topic1' },
  { id: 'biology-sub5', name: 'Endoplasmatisches Retikulum', topicId: 'biology-cat1-topic1' },
  
  // BIOLOGIE - DNA und Genetik (biology-cat1-topic2)
  { id: 'biology-sub6', name: 'DNA-Struktur verstehen', topicId: 'biology-cat1-topic2' },
  { id: 'biology-sub7', name: 'DNA-Replikation', topicId: 'biology-cat1-topic2' },
  { id: 'biology-sub8', name: 'Genetischer Code', topicId: 'biology-cat1-topic2' },
  { id: 'biology-sub9', name: 'Mutationen und Variationen', topicId: 'biology-cat1-topic2' },
  
  // GESCHICHTE - Römische Republik (history-cat1-topic1)
  { id: 'history-sub1', name: 'Gründung Roms', topicId: 'history-cat1-topic1' },
  { id: 'history-sub2', name: 'Senat und Konsuln', topicId: 'history-cat1-topic1' },
  { id: 'history-sub3', name: 'Punische Kriege', topicId: 'history-cat1-topic1' },
  { id: 'history-sub4', name: 'Ende der Republik', topicId: 'history-cat1-topic1' },
  
  // GESCHICHTE - Römisches Kaiserreich (history-cat1-topic2)
  { id: 'history-sub5', name: 'Augustus und Prinzipat', topicId: 'history-cat1-topic2' },
  { id: 'history-sub6', name: 'Pax Romana', topicId: 'history-cat1-topic2' },
  { id: 'history-sub7', name: 'Untergang Westroms', topicId: 'history-cat1-topic2' },
  
  // ENGLISCH - Tenses (english-cat1-topic1)
  { id: 'english-sub1', name: 'Present Simple', topicId: 'english-cat1-topic1' },
  { id: 'english-sub2', name: 'Present Continuous', topicId: 'english-cat1-topic1' },
  { id: 'english-sub3', name: 'Present Perfect', topicId: 'english-cat1-topic1' },
  { id: 'english-sub4', name: 'Past Simple', topicId: 'english-cat1-topic1' },
  { id: 'english-sub5', name: 'Past Continuous', topicId: 'english-cat1-topic1' },
  { id: 'english-sub6', name: 'Future Tenses', topicId: 'english-cat1-topic1' },
  
  // ENGLISCH - Conditionals (english-cat1-topic2)
  { id: 'english-sub7', name: 'Zero Conditional', topicId: 'english-cat1-topic2' },
  { id: 'english-sub8', name: 'First Conditional', topicId: 'english-cat1-topic2' },
  { id: 'english-sub9', name: 'Second Conditional', topicId: 'english-cat1-topic2' },
  { id: 'english-sub10', name: 'Third Conditional', topicId: 'english-cat1-topic2' },
  { id: 'english-sub11', name: 'Mixed Conditionals', topicId: 'english-cat1-topic2' },
  
  // CHEMIE - Periodensystem (chemistry-cat1-topic1)
  { id: 'chemistry-sub1', name: 'Aufbau des Periodensystems', topicId: 'chemistry-cat1-topic1' },
  { id: 'chemistry-sub2', name: 'Hauptgruppen verstehen', topicId: 'chemistry-cat1-topic1' },
  { id: 'chemistry-sub3', name: 'Nebengruppen und Übergangsmetalle', topicId: 'chemistry-cat1-topic1' },
  { id: 'chemistry-sub4', name: 'Periodizität von Eigenschaften', topicId: 'chemistry-cat1-topic1' },
  
  // CHEMIE - Säuren und Basen (chemistry-cat1-topic2)
  { id: 'chemistry-sub5', name: 'Säure-Base-Theorie nach Brønsted', topicId: 'chemistry-cat1-topic2' },
  { id: 'chemistry-sub6', name: 'pH-Wert berechnen', topicId: 'chemistry-cat1-topic2' },
  { id: 'chemistry-sub7', name: 'Neutralisation', topicId: 'chemistry-cat1-topic2' },
  { id: 'chemistry-sub8', name: 'Puffersysteme', topicId: 'chemistry-cat1-topic2' },
  
  // FRANZÖSISCH - Les temps verbaux (french-cat1-topic1)
  { id: 'french-sub1', name: 'Le présent', topicId: 'french-cat1-topic1' },
  { id: 'french-sub2', name: 'Le passé composé', topicId: 'french-cat1-topic1' },
  { id: 'french-sub3', name: 'L\'imparfait', topicId: 'french-cat1-topic1' },
  { id: 'french-sub4', name: 'Le futur simple', topicId: 'french-cat1-topic1' },
  { id: 'french-sub5', name: 'Le conditionnel', topicId: 'french-cat1-topic1' },
  
  // FRANZÖSISCH - Le subjonctif (french-cat1-topic2)
  { id: 'french-sub6', name: 'Formation du subjonctif', topicId: 'french-cat1-topic2' },
  { id: 'french-sub7', name: 'Utilisation du subjonctif', topicId: 'french-cat1-topic2' },
  { id: 'french-sub8', name: 'Subjonctif après certaines conjonctions', topicId: 'french-cat1-topic2' },
];

// Helper function to get all subtopics for a topic
export const getSubtopicsForTopic = (topicId: string): Subtopic[] => {
  // Get hardcoded subtopics
  const hardcodedSubtopics = allSubtopics.filter(st => st.topicId === topicId);
  
  // Get AI-generated subtopics from localStorage
  const aiSubtopics: Subtopic[] = [];
  try {
    const storedSubtopics = localStorage.getItem('exam_app_ai_subtopics');
    if (storedSubtopics) {
      const allAISubtopics = JSON.parse(storedSubtopics);
      const aiSubtopicsForTopic = allAISubtopics.filter((st: Subtopic) => st.topicId === topicId);
      aiSubtopics.push(...aiSubtopicsForTopic);
      
      if (aiSubtopicsForTopic.length > 0) {
        console.log(`✅ AI-Subtopics für Topic ${topicId} geladen:`, aiSubtopicsForTopic.length);
      }
    }
  } catch (error) {
    console.error('❌ Fehler beim Laden der AI-Subtopics:', error);
  }
  
  // Combine both
  const combined = [...hardcodedSubtopics, ...aiSubtopics];
  console.log(`📊 Gesamt Subtopics für Topic ${topicId}:`, combined.length, '(hardcoded:', hardcodedSubtopics.length, ', AI:', aiSubtopics.length, ')');
  
  return combined;
};

// Helper function to get subtopic count for a topic
export const getSubtopicCountForTopic = (topicId: string): number => {
  // Get all subtopics (hardcoded + AI-generated)
  return getSubtopicsForTopic(topicId).length;
};