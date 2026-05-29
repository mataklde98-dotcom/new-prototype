export type Subject = {
  id: string;
  name: string;
  icon: 'math' | 'german' | 'biology' | 'history' | 'english' | 'chemistry' | 'french';
};

export const subjects: Subject[] = [
  { id: 'math', name: 'Mathematik', icon: 'math' },
  { id: 'german', name: 'Deutsch', icon: 'german' },
  { id: 'biology', name: 'Biologie', icon: 'biology' },
  { id: 'history', name: 'Geschichte', icon: 'history' },
  { id: 'english', name: 'Englisch', icon: 'english' },
  { id: 'chemistry', name: 'Chemie', icon: 'chemistry' },
  { id: 'french', name: 'Französisch', icon: 'french' },
];
