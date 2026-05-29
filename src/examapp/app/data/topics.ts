export type Topic = {
  id: string;
  name: string;
  categoryId: string; // Jedes Thema gehört zu einer Kategorie
  aiGenerated?: boolean; // KI-generierte Topics
};

export const topics: Topic[] = [
  // MATHEMATIK - Grenzwertsätze
  { id: 'math-cat1-topic1', name: 'Grenzwerte von Funktionen', categoryId: 'math-cat1' },
  { id: 'math-cat1-topic2', name: 'Summenregel für Grenzwerte', categoryId: 'math-cat1' },
  { id: 'math-cat1-topic3', name: 'Produktregel für Grenzwerte', categoryId: 'math-cat1' },
  { id: 'math-cat1-topic4', name: 'Quotientenregel für Grenzwerte', categoryId: 'math-cat1' },
  
  // MATHEMATIK - Epsilon-Delta
  { id: 'math-cat2-topic1', name: 'Epsilon-Delta-Definition', categoryId: 'math-cat2' },
  { id: 'math-cat2-topic2', name: 'Stetigkeitsbeweise mit Epsilon-Delta', categoryId: 'math-cat2' },
  { id: 'math-cat2-topic3', name: 'Grenzwertbeweise', categoryId: 'math-cat2' },
  
  // MATHEMATIK - Differentiation
  { id: 'math-cat3-topic1', name: 'Kettenregel', categoryId: 'math-cat3' },
  { id: 'math-cat3-topic2', name: 'Produktregel der Ableitung', categoryId: 'math-cat3' },
  { id: 'math-cat3-topic3', name: 'Quotientenregel der Ableitung', categoryId: 'math-cat3' },
  { id: 'math-cat3-topic4', name: 'Implizite Differentiation', categoryId: 'math-cat3' },
  
  // MATHEMATIK - Integralrechnung
  { id: 'math-cat4-topic1', name: 'Bestimmte Integrale', categoryId: 'math-cat4' },
  { id: 'math-cat4-topic2', name: 'Unbestimmte Integrale', categoryId: 'math-cat4' },
  { id: 'math-cat4-topic3', name: 'Flächenberechnung', categoryId: 'math-cat4' },
  { id: 'math-cat4-topic4', name: 'Volumenberechnung', categoryId: 'math-cat4' },
  
  // DEUTSCH - Lyrik
  { id: 'german-cat1-topic1', name: 'Gedichtformen und Reimschemata', categoryId: 'german-cat1' },
  { id: 'german-cat1-topic2', name: 'Stilmittel und Metaphern', categoryId: 'german-cat1' },
  { id: 'german-cat1-topic3', name: 'Epochen der Lyrik', categoryId: 'german-cat1' },
  
  // DEUTSCH - Epik
  { id: 'german-cat2-topic1', name: 'Romananalyse', categoryId: 'german-cat2' },
  { id: 'german-cat2-topic2', name: 'Erzählperspektiven', categoryId: 'german-cat2' },
  { id: 'german-cat2-topic3', name: 'Figurencharakterisierung', categoryId: 'german-cat2' },
  
  // DEUTSCH - Dramatik
  { id: 'german-cat3-topic1', name: 'Dramenaufbau', categoryId: 'german-cat3' },
  { id: 'german-cat3-topic2', name: 'Dialoganalyse', categoryId: 'german-cat3' },
  { id: 'german-cat3-topic3', name: 'Klassisches und modernes Drama', categoryId: 'german-cat3' },
  
  // DEUTSCH - Sprachanalyse
  { id: 'german-cat4-topic1', name: 'Syntax und Satzbau', categoryId: 'german-cat4' },
  { id: 'german-cat4-topic2', name: 'Morphologie und Wortbildung', categoryId: 'german-cat4' },
  { id: 'german-cat4-topic3', name: 'Semantik und Bedeutungslehre', categoryId: 'german-cat4' },
  
  // BIOLOGIE - Zellbiologie
  { id: 'biology-cat1-topic1', name: 'Zellaufbau und Organellen', categoryId: 'biology-cat1' },
  { id: 'biology-cat1-topic2', name: 'DNA und Genetik', categoryId: 'biology-cat1' },
  { id: 'biology-cat1-topic3', name: 'Zellteilung (Mitose und Meiose)', categoryId: 'biology-cat1' },
  
  // BIOLOGIE - Evolution
  { id: 'biology-cat2-topic1', name: 'Evolutionstheorien', categoryId: 'biology-cat2' },
  { id: 'biology-cat2-topic2', name: 'Natürliche Selektion', categoryId: 'biology-cat2' },
  { id: 'biology-cat2-topic3', name: 'Ökosysteme und Nahrungsketten', categoryId: 'biology-cat2' },
  
  // BIOLOGIE - Anatomie
  { id: 'biology-cat3-topic1', name: 'Herz-Kreislauf-System', categoryId: 'biology-cat3' },
  { id: 'biology-cat3-topic2', name: 'Verdauungssystem', categoryId: 'biology-cat3' },
  { id: 'biology-cat3-topic3', name: 'Nervensystem', categoryId: 'biology-cat3' },
  
  // BIOLOGIE - Mikrobiologie
  { id: 'biology-cat4-topic1', name: 'Bakterien und Viren', categoryId: 'biology-cat4' },
  { id: 'biology-cat4-topic2', name: 'Immunsystem und Abwehr', categoryId: 'biology-cat4' },
  { id: 'biology-cat4-topic3', name: 'Antibiotika und Resistenzen', categoryId: 'biology-cat4' },
  
  // GESCHICHTE - Antike
  { id: 'history-cat1-topic1', name: 'Römische Republik', categoryId: 'history-cat1' },
  { id: 'history-cat1-topic2', name: 'Römisches Kaiserreich', categoryId: 'history-cat1' },
  { id: 'history-cat1-topic3', name: 'Griechische Antike', categoryId: 'history-cat1' },
  
  // GESCHICHTE - Mittelalter
  { id: 'history-cat2-topic1', name: 'Feudalsystem', categoryId: 'history-cat2' },
  { id: 'history-cat2-topic2', name: 'Kreuzzüge', categoryId: 'history-cat2' },
  { id: 'history-cat2-topic3', name: 'Renaissance', categoryId: 'history-cat2' },
  
  // GESCHICHTE - Neuzeit
  { id: 'history-cat3-topic1', name: 'Französische Revolution', categoryId: 'history-cat3' },
  { id: 'history-cat3-topic2', name: 'Industrialisierung', categoryId: 'history-cat3' },
  { id: 'history-cat3-topic3', name: 'Imperialismus', categoryId: 'history-cat3' },
  
  // GESCHICHTE - 20. Jahrhundert
  { id: 'history-cat4-topic1', name: 'Erster Weltkrieg', categoryId: 'history-cat4' },
  { id: 'history-cat4-topic2', name: 'Zweiter Weltkrieg', categoryId: 'history-cat4' },
  { id: 'history-cat4-topic3', name: 'Kalter Krieg', categoryId: 'history-cat4' },
  
  // ENGLISCH - Grammar
  { id: 'english-cat1-topic1', name: 'Tenses and Verb Forms', categoryId: 'english-cat1' },
  { id: 'english-cat1-topic2', name: 'Conditionals', categoryId: 'english-cat1' },
  { id: 'english-cat1-topic3', name: 'Passive Voice', categoryId: 'english-cat1' },
  
  // ENGLISCH - Literature
  { id: 'english-cat2-topic1', name: 'Shakespeare', categoryId: 'english-cat2' },
  { id: 'english-cat2-topic2', name: 'Modern British Literature', categoryId: 'english-cat2' },
  { id: 'english-cat2-topic3', name: 'American Literature', categoryId: 'english-cat2' },
  
  // ENGLISCH - Vocabulary
  { id: 'english-cat3-topic1', name: 'Academic Vocabulary', categoryId: 'english-cat3' },
  { id: 'english-cat3-topic2', name: 'Phrasal Verbs', categoryId: 'english-cat3' },
  { id: 'english-cat3-topic3', name: 'Idioms and Expressions', categoryId: 'english-cat3' },
  
  // ENGLISCH - Writing
  { id: 'english-cat4-topic1', name: 'Essay Writing', categoryId: 'english-cat4' },
  { id: 'english-cat4-topic2', name: 'Creative Writing', categoryId: 'english-cat4' },
  { id: 'english-cat4-topic3', name: 'Business Writing', categoryId: 'english-cat4' },
  
  // CHEMIE - Anorganische Chemie
  { id: 'chemistry-cat1-topic1', name: 'Periodensystem', categoryId: 'chemistry-cat1' },
  { id: 'chemistry-cat1-topic2', name: 'Säuren und Basen', categoryId: 'chemistry-cat1' },
  { id: 'chemistry-cat1-topic3', name: 'Redoxreaktionen', categoryId: 'chemistry-cat1' },
  
  // CHEMIE - Organische Chemie
  { id: 'chemistry-cat2-topic1', name: 'Kohlenwasserstoffe', categoryId: 'chemistry-cat2' },
  { id: 'chemistry-cat2-topic2', name: 'Funktionelle Gruppen', categoryId: 'chemistry-cat2' },
  { id: 'chemistry-cat2-topic3', name: 'Reaktionsmechanismen', categoryId: 'chemistry-cat2' },
  
  // CHEMIE - Physikalische Chemie
  { id: 'chemistry-cat3-topic1', name: 'Thermodynamik', categoryId: 'chemistry-cat3' },
  { id: 'chemistry-cat3-topic2', name: 'Kinetik', categoryId: 'chemistry-cat3' },
  { id: 'chemistry-cat3-topic3', name: 'Elektrochemie', categoryId: 'chemistry-cat3' },
  
  // CHEMIE - Analytische Chemie
  { id: 'chemistry-cat4-topic1', name: 'Qualitative Analyse', categoryId: 'chemistry-cat4' },
  { id: 'chemistry-cat4-topic2', name: 'Quantitative Analyse', categoryId: 'chemistry-cat4' },
  { id: 'chemistry-cat4-topic3', name: 'Spektroskopie', categoryId: 'chemistry-cat4' },
  
  // FRANZÖSISCH - Grammaire
  { id: 'french-cat1-topic1', name: 'Les temps verbaux', categoryId: 'french-cat1' },
  { id: 'french-cat1-topic2', name: 'Le subjonctif', categoryId: 'french-cat1' },
  { id: 'french-cat1-topic3', name: 'Les pronoms', categoryId: 'french-cat1' },
  
  // FRANZÖSISCH - Littérature
  { id: 'french-cat2-topic1', name: 'Littérature classique', categoryId: 'french-cat2' },
  { id: 'french-cat2-topic2', name: 'Littérature moderne', categoryId: 'french-cat2' },
  { id: 'french-cat2-topic3', name: 'Culture française', categoryId: 'french-cat2' },
  
  // FRANZÖSISCH - Vocabulaire
  { id: 'french-cat3-topic1', name: 'Vocabulaire quotidien', categoryId: 'french-cat3' },
  { id: 'french-cat3-topic2', name: 'Expressions idiomatiques', categoryId: 'french-cat3' },
  { id: 'french-cat3-topic3', name: 'Vocabulaire professionnel', categoryId: 'french-cat3' },
  
  // FRANZÖSISCH - Conversation
  { id: 'french-cat4-topic1', name: 'Compréhension orale', categoryId: 'french-cat4' },
  { id: 'french-cat4-topic2', name: 'Expression orale', categoryId: 'french-cat4' },
  { id: 'french-cat4-topic3', name: 'Débats et discussions', categoryId: 'french-cat4' },
];