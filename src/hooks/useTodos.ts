import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '@/services';
import type { Todo } from '@/types';

// ===== TODO HOOKS =====
// Custom Hooks für Todo-Daten mit React Query

// Query Keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
  today: () => [...todoKeys.all, 'today'] as const,
  upcoming: (days: number) => [...todoKeys.all, 'upcoming', days] as const,
  overdue: () => [...todoKeys.all, 'overdue'] as const,
  completed: () => [...todoKeys.all, 'completed'] as const,
  byDate: (date: Date) => [...todoKeys.all, 'byDate', date.toISOString()] as const,
  byType: (type: string) => [...todoKeys.all, 'byType', type] as const,
  bySubject: (subject: string) => [...todoKeys.all, 'bySubject', subject] as const,
};

/**
 * Hook: Holt alle Todos
 */
export function useTodos() {
  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: todoService.getAllTodos,
  });
}

/**
 * Hook: Holt ein einzelnes Todo
 */
export function useTodo(id: number) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoService.getTodoById(id),
    enabled: !!id,
  });
}

/**
 * Hook: Holt Todos für heute
 */
export function useTodosForToday() {
  return useQuery({
    queryKey: todoKeys.today(),
    queryFn: todoService.getTodosForToday,
  });
}

/**
 * Hook: Holt kommende Todos
 */
export function useUpcomingTodos(days: number = 7) {
  return useQuery({
    queryKey: todoKeys.upcoming(days),
    queryFn: () => todoService.getUpcomingTodos(days),
  });
}

/**
 * Hook: Holt überfällige Todos
 */
export function useOverdueTodos() {
  return useQuery({
    queryKey: todoKeys.overdue(),
    queryFn: todoService.getOverdueTodos,
  });
}

/**
 * Hook: Holt abgeschlossene Todos
 */
export function useCompletedTodos() {
  return useQuery({
    queryKey: todoKeys.completed(),
    queryFn: todoService.getCompletedTodos,
  });
}

/**
 * Hook: Holt Todos für ein bestimmtes Datum
 */
export function useTodosByDate(date: Date) {
  return useQuery({
    queryKey: todoKeys.byDate(date),
    queryFn: () => todoService.getTodosByDate(date),
  });
}

/**
 * Hook: Filtert Todos nach Type
 */
export function useTodosByType(type: 'nachhilfe' | 'karteikarten' | 'prufung') {
  return useQuery({
    queryKey: todoKeys.byType(type),
    queryFn: () => todoService.getTodosByType(type),
  });
}

/**
 * Hook: Filtert Todos nach Subject
 */
export function useTodosBySubject(subject: string) {
  return useQuery({
    queryKey: todoKeys.bySubject(subject),
    queryFn: () => todoService.getTodosBySubject(subject),
    enabled: !!subject,
  });
}

/**
 * Hook: Holt Todos mit Filtern
 */
export function useTodosWithFilters(filters: {
  nachhilfe?: boolean;
  karteikarten?: boolean;
  prufung?: boolean;
  date?: Date;
  subject?: string;
}) {
  return useQuery({
    queryKey: todoKeys.list(JSON.stringify(filters)),
    queryFn: () => todoService.getTodosWithFilters(filters),
  });
}

/**
 * Hook: Erstellt ein neues Todo
 */
export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Todo, 'id'>) => todoService.createTodo(data),
    onSuccess: () => {
      // Invalidiere alle Todo-Listen
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/**
 * Hook: Aktualisiert ein Todo
 */
export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Todo> }) => 
      todoService.updateTodo(id, data),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(data.id) });
        queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        queryClient.invalidateQueries({ queryKey: todoKeys.today() });
        queryClient.invalidateQueries({ queryKey: todoKeys.upcoming(7) });
      }
    },
  });
}

/**
 * Hook: Löscht ein Todo
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoService.deleteTodo(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

/**
 * Hook: Togglet Todo Completed Status
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoService.toggleComplete(id),
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: todoKeys.detail(data.id) });
        queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        queryClient.invalidateQueries({ queryKey: todoKeys.today() });
        queryClient.invalidateQueries({ queryKey: todoKeys.completed() });
      }
    },
  });
}
