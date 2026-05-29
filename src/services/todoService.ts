import type { Todo } from '@/types';
import { MOCK_TODOS } from '@/mocks';

// ===== TODO SERVICE =====
// Zentrale Service-Schicht für alle Todo-API-Calls
// JETZT: Nutzt Mock-Daten (simuliert API)
// SPÄTER: Ersetze Mock-Aufrufe durch echte API-Calls

// Simuliere API-Delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const todoService = {
  /**
   * Holt alle Todos
   */
  getAllTodos: async (): Promise<Todo[]> => {
    await delay(250);
    return [...MOCK_TODOS];
  },

  /**
   * Holt ein einzelnes Todo anhand der ID
   */
  getTodoById: async (id: number): Promise<Todo | null> => {
    await delay(150);
    const todo = MOCK_TODOS.find(t => t.id === id);
    return todo ? { ...todo } : null;
  },

  /**
   * Erstellt ein neues Todo
   */
  createTodo: async (data: Omit<Todo, 'id'>): Promise<Todo> => {
    await delay(300);
    const newTodo: Todo = {
      id: Date.now(),
      ...data
    };
    MOCK_TODOS.push(newTodo);
    return newTodo;
  },

  /**
   * Aktualisiert ein bestehendes Todo
   */
  updateTodo: async (id: number, data: Partial<Todo>): Promise<Todo | null> => {
    await delay(250);
    const index = MOCK_TODOS.findIndex(t => t.id === id);
    if (index === -1) return null;

    MOCK_TODOS[index] = {
      ...MOCK_TODOS[index],
      ...data
    };
    
    return { ...MOCK_TODOS[index] };
  },

  /**
   * Löscht ein Todo
   */
  deleteTodo: async (id: number): Promise<{ success: boolean; deletedId: number }> => {
    await delay(250);
    const index = MOCK_TODOS.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }

    MOCK_TODOS.splice(index, 1);
    return { success: true, deletedId: id };
  },

  /**
   * Markiert Todo als completed
   */
  toggleComplete: async (id: number): Promise<Todo | null> => {
    await delay(150);
    const index = MOCK_TODOS.findIndex(t => t.id === id);
    if (index === -1) return null;

    MOCK_TODOS[index].completed = !MOCK_TODOS[index].completed;
    return { ...MOCK_TODOS[index] };
  },

  /**
   * Holt Todos für ein bestimmtes Datum
   */
  getTodosByDate: async (date: Date): Promise<Todo[]> => {
    await delay(200);
    return MOCK_TODOS.filter(todo => {
      const todoDate = new Date(todo.date);
      return (
        todoDate.getFullYear() === date.getFullYear() &&
        todoDate.getMonth() === date.getMonth() &&
        todoDate.getDate() === date.getDate()
      );
    }).map(todo => ({ ...todo }));
  },

  /**
   * Holt Todos für heute
   */
  getTodosForToday: async (): Promise<Todo[]> => {
    await delay(200);
    const today = new Date();
    return MOCK_TODOS.filter(todo => {
      const todoDate = new Date(todo.date);
      return (
        todoDate.getFullYear() === today.getFullYear() &&
        todoDate.getMonth() === today.getMonth() &&
        todoDate.getDate() === today.getDate()
      );
    }).map(todo => ({ ...todo }));
  },

  /**
   * Holt kommende Todos
   */
  getUpcomingTodos: async (days: number = 7): Promise<Todo[]> => {
    await delay(200);
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return MOCK_TODOS
      .filter(todo => {
        const todoDate = new Date(todo.date);
        return todoDate >= now && todoDate <= futureDate && !todo.completed;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(todo => ({ ...todo }));
  },

  /**
   * Holt überfällige Todos
   */
  getOverdueTodos: async (): Promise<Todo[]> => {
    await delay(200);
    const now = new Date();
    
    return MOCK_TODOS
      .filter(todo => {
        const todoDate = new Date(todo.date);
        return todoDate < now && !todo.completed;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(todo => ({ ...todo }));
  },

  /**
   * Holt abgeschlossene Todos
   */
  getCompletedTodos: async (): Promise<Todo[]> => {
    await delay(200);
    return MOCK_TODOS
      .filter(todo => todo.completed)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(todo => ({ ...todo }));
  },

  /**
   * Filtert Todos nach Type
   */
  getTodosByType: async (type: 'nachhilfe' | 'karteikarten' | 'prufung'): Promise<Todo[]> => {
    await delay(200);
    return MOCK_TODOS
      .filter(todo => todo.type === type)
      .map(todo => ({ ...todo }));
  },

  /**
   * Filtert Todos nach Subject
   */
  getTodosBySubject: async (subject: string): Promise<Todo[]> => {
    await delay(200);
    return MOCK_TODOS
      .filter(todo => todo.subject === subject)
      .map(todo => ({ ...todo }));
  },

  /**
   * Filtert Todos nach Priority
   */
  getTodosByPriority: async (priority: 'high' | 'medium' | 'low'): Promise<Todo[]> => {
    await delay(200);
    return MOCK_TODOS
      .filter(todo => todo.priority === priority)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(todo => ({ ...todo }));
  },

  /**
   * Sucht Todos nach Query
   */
  searchTodos: async (query: string): Promise<Todo[]> => {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return MOCK_TODOS.filter(todo =>
      todo.title.toLowerCase().includes(lowerQuery) ||
      todo.subject.toLowerCase().includes(lowerQuery) ||
      todo.description?.toLowerCase().includes(lowerQuery)
    ).map(todo => ({ ...todo }));
  },

  /**
   * Holt Todos mit Filtern
   */
  getTodosWithFilters: async (filters: {
    nachhilfe?: boolean;
    karteikarten?: boolean;
    prufung?: boolean;
    date?: Date;
    subject?: string;
  }): Promise<Todo[]> => {
    await delay(200);
    
    let filtered = [...MOCK_TODOS];

    // Filter by type
    if (filters.nachhilfe !== undefined || filters.karteikarten !== undefined || filters.prufung !== undefined) {
      const allowedTypes: Array<'nachhilfe' | 'karteikarten' | 'prufung'> = [];
      if (filters.nachhilfe) allowedTypes.push('nachhilfe');
      if (filters.karteikarten) allowedTypes.push('karteikarten');
      if (filters.prufung) allowedTypes.push('prufung');
      
      if (allowedTypes.length > 0) {
        filtered = filtered.filter(todo => allowedTypes.includes(todo.type));
      }
    }

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter(todo => {
        const todoDate = new Date(todo.date);
        const filterDate = new Date(filters.date!);
        return (
          todoDate.getFullYear() === filterDate.getFullYear() &&
          todoDate.getMonth() === filterDate.getMonth() &&
          todoDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Filter by subject
    if (filters.subject) {
      filtered = filtered.filter(todo => todo.subject === filters.subject);
    }

    return filtered.map(todo => ({ ...todo }));
  }
};
