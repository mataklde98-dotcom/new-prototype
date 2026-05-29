import type { Todo } from '@/types';

// ===== TODOS MOCK DATA =====
// Vollständige Mock-Daten für ToDo Items

export const MOCK_TODOS: Todo[] = [
  // Heute
  {
    id: 1,
    title: "Mathe Hausaufgaben - Lineare Gleichungen",
    subject: "Mathematik",
    type: "karteikarten",
    date: new Date(),
    time: "14:00",
    completed: false,
    priority: "high",
    description: "Aufgaben 1-15 auf Seite 87 lösen"
  },
  {
    id: 2,
    title: "Biologie Referat vorbereiten",
    subject: "Biologie",
    type: "prufung",
    date: new Date(),
    time: "16:30",
    completed: false,
    priority: "high",
    description: "Präsentation über Mitochondrien fertigstellen"
  },
  {
    id: 3,
    title: "Englisch Vokabeln lernen - Unit 5",
    subject: "Englisch",
    type: "karteikarten",
    date: new Date(),
    time: "18:00",
    completed: true,
    priority: "medium",
    description: "30 neue Vokabeln wiederholen"
  },
  
  // Morgen
  {
    id: 4,
    title: "Nachhilfe - Physik",
    subject: "Physik",
    type: "nachhilfe",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    time: "15:00",
    completed: false,
    priority: "high",
    description: "Newtonsche Gesetze wiederholen"
  },
  {
    id: 5,
    title: "Chemie Protokoll schreiben",
    subject: "Chemie",
    type: "karteikarten",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    time: "17:00",
    completed: false,
    priority: "medium",
    description: "Versuch zu Säuren und Basen dokumentieren"
  },
  
  // Übermorgen
  {
    id: 6,
    title: "Deutschaufsatz schreiben",
    subject: "Deutsch",
    type: "prufung",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "10:00",
    completed: false,
    priority: "high",
    description: "Textanalyse zu 'Die Verwandlung'"
  },
  {
    id: 7,
    title: "Geschichte Karteikarten erstellen",
    subject: "Geschichte",
    type: "karteikarten",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: "14:00",
    completed: false,
    priority: "low",
    description: "Zweiter Weltkrieg - wichtige Daten"
  },
  
  // In 3 Tagen
  {
    id: 8,
    title: "Mathe Prüfung - Analysis",
    subject: "Mathematik",
    type: "prufung",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "08:00",
    completed: false,
    priority: "high",
    description: "Ableitungen, Integrale, Kurvendiskussion"
  },
  {
    id: 9,
    title: "Nachhilfe - Englisch Konversation",
    subject: "Englisch",
    type: "nachhilfe",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "16:00",
    completed: false,
    priority: "medium",
    description: "Speaking practice - B2 level topics"
  },
  
  // In 4 Tagen
  {
    id: 10,
    title: "Biologie Klausur vorbereiten",
    subject: "Biologie",
    type: "prufung",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: "09:00",
    completed: false,
    priority: "high",
    description: "Genetik - Mendelsche Regeln"
  },
  {
    id: 11,
    title: "Physik Übungsaufgaben",
    subject: "Physik",
    type: "karteikarten",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    time: "15:00",
    completed: false,
    priority: "medium",
    description: "Mechanik - Kräfte und Bewegung"
  },
  
  // In 5 Tagen
  {
    id: 12,
    title: "Chemie Test - Organische Chemie",
    subject: "Chemie",
    type: "prufung",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "10:30",
    completed: false,
    priority: "high",
    description: "Alkane, Alkene, Alkohole"
  },
  {
    id: 13,
    title: "Deutsch Gedichtanalyse",
    subject: "Deutsch",
    type: "karteikarten",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "14:00",
    completed: false,
    priority: "medium",
    description: "Romantik - Eichendorff"
  },
  
  // In 6 Tagen
  {
    id: 14,
    title: "Nachhilfe - Mathe Stochastik",
    subject: "Mathematik",
    type: "nachhilfe",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    time: "15:30",
    completed: false,
    priority: "medium",
    description: "Wahrscheinlichkeitsrechnung und Kombinatorik"
  },
  {
    id: 15,
    title: "Englisch Essay schreiben",
    subject: "Englisch",
    type: "karteikarten",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    time: "17:00",
    completed: false,
    priority: "low",
    description: "Argumentative essay - 300 words"
  },
  
  // Vergangene Woche (completed)
  {
    id: 16,
    title: "Physik Hausaufgaben",
    subject: "Physik",
    type: "karteikarten",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    time: "14:00",
    completed: true,
    priority: "medium",
    description: "Elektrizität - Ohmsches Gesetz"
  },
  {
    id: 17,
    title: "Biologie Lernkarten wiederholen",
    subject: "Biologie",
    type: "karteikarten",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    time: "16:00",
    completed: true,
    priority: "low",
    description: "Zellatmung und Photosynthese"
  },
  {
    id: 18,
    title: "Mathe Nachhilfe",
    subject: "Mathematik",
    type: "nachhilfe",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    time: "15:00",
    completed: true,
    priority: "high",
    description: "Quadratische Gleichungen"
  }
];

// Helper function to get todos for a specific date
export const getTodosByDate = (date: Date): Todo[] => {
  return MOCK_TODOS.filter(todo => {
    const todoDate = new Date(todo.date);
    return (
      todoDate.getFullYear() === date.getFullYear() &&
      todoDate.getMonth() === date.getMonth() &&
      todoDate.getDate() === date.getDate()
    );
  });
};

// Helper function to get todos for today
export const getTodosForToday = (): Todo[] => {
  return getTodosByDate(new Date());
};

// Helper function to get upcoming todos
export const getUpcomingTodos = (days: number = 7): Todo[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return MOCK_TODOS.filter(todo => {
    const todoDate = new Date(todo.date);
    return todoDate >= now && todoDate <= futureDate && !todo.completed;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());
};
