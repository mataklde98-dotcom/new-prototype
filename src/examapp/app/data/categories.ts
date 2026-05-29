export type Category = {
  id: string;
  name: string;
  subjectId: string; // Jede Kategorie gehört zu einem Fach
  aiGenerated?: boolean; // KI-generierte Kategorien
};

export const categories: Category[] = [
  // MATHEMATIK Kategorien
  { id: 'math-cat1', name: 'Grenzwertsätze einschließlich Summen-, Produkt- und Quotientenregel', subjectId: 'math' },
  { id: 'math-cat2', name: 'Epsilon-Delta-Kriterium für mathematische Grenzwertdefinitionen', subjectId: 'math' },
  { id: 'math-cat3', name: 'Differentiation zusammengesetzter Funktionen', subjectId: 'math' },
  { id: 'math-cat4', name: 'Integralrechnung und Flächenbestimmung', subjectId: 'math' },
  
  // DEUTSCH Kategorien
  { id: 'german-cat1', name: 'Lyrik und Gedichtanalyse', subjectId: 'german' },
  { id: 'german-cat2', name: 'Epische Texte und Romane', subjectId: 'german' },
  { id: 'german-cat3', name: 'Dramatik und Theaterstücke', subjectId: 'german' },
  { id: 'german-cat4', name: 'Sprachanalyse und Grammatik', subjectId: 'german' },
  
  // BIOLOGIE Kategorien
  { id: 'biology-cat1', name: 'Zellbiologie und Genetik', subjectId: 'biology' },
  { id: 'biology-cat2', name: 'Evolution und Ökologie', subjectId: 'biology' },
  { id: 'biology-cat3', name: 'Anatomie und Physiologie', subjectId: 'biology' },
  { id: 'biology-cat4', name: 'Mikrobiologie und Immunsystem', subjectId: 'biology' },
  
  // GESCHICHTE Kategorien
  { id: 'history-cat1', name: 'Antike und Römisches Reich', subjectId: 'history' },
  { id: 'history-cat2', name: 'Mittelalter und Renaissance', subjectId: 'history' },
  { id: 'history-cat3', name: 'Neuzeit und Industrialisierung', subjectId: 'history' },
  { id: 'history-cat4', name: '20. Jahrhundert und Weltkriege', subjectId: 'history' },
  
  // ENGLISCH Kategorien
  { id: 'english-cat1', name: 'English Grammar and Syntax', subjectId: 'english' },
  { id: 'english-cat2', name: 'Literature and Poetry', subjectId: 'english' },
  { id: 'english-cat3', name: 'Vocabulary and Idioms', subjectId: 'english' },
  { id: 'english-cat4', name: 'Writing and Composition', subjectId: 'english' },
  
  // CHEMIE Kategorien
  { id: 'chemistry-cat1', name: 'Anorganische Chemie', subjectId: 'chemistry' },
  { id: 'chemistry-cat2', name: 'Organische Chemie', subjectId: 'chemistry' },
  { id: 'chemistry-cat3', name: 'Physikalische Chemie', subjectId: 'chemistry' },
  { id: 'chemistry-cat4', name: 'Analytische Chemie', subjectId: 'chemistry' },
  
  // FRANZÖSISCH Kategorien
  { id: 'french-cat1', name: 'Grammaire française', subjectId: 'french' },
  { id: 'french-cat2', name: 'Littérature et culture', subjectId: 'french' },
  { id: 'french-cat3', name: 'Vocabulaire et expressions', subjectId: 'french' },
  { id: 'french-cat4', name: 'Conversation et compréhension', subjectId: 'french' },
];