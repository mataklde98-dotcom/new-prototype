import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { errorService } from '@/services/errorService';
import { toast } from 'sonner';

// ===== REACT QUERY PROVIDER =====
// QueryClient Konfiguration für die gesamte App mit Error Tracking

// Create QueryClient instance with default options and error tracking
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten - Daten gelten als "frisch"
      gcTime: 10 * 60 * 1000, // 10 Minuten - Garbage Collection Time (früher cacheTime)
      retry: 1, // Bei Fehler 1x retry
      refetchOnWindowFocus: false, // Nicht bei jedem Window-Focus neu laden
      refetchOnReconnect: true, // Bei Reconnect neu laden
      
      // Global error handler for queries
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        errorService.logError({
          message: `Query failed: ${errorMessage}`,
          error: error instanceof Error ? error : undefined,
          context: {
            component: 'ReactQuery',
            action: 'query',
          },
        });
        
        // Show toast for user feedback
        toast.error('Daten konnten nicht geladen werden', {
          description: errorMessage,
        });
      },
    },
    mutations: {
      retry: 0, // Mutations nicht wiederholen
      
      // Global error handler for mutations
      onError: (error, variables, context) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        errorService.logError({
          message: `Mutation failed: ${errorMessage}`,
          error: error instanceof Error ? error : undefined,
          context: {
            component: 'ReactQuery',
            action: 'mutation',
            variables,
            context,
          },
        });
        
        // Show toast for user feedback
        toast.error('Aktion fehlgeschlagen', {
          description: errorMessage,
        });
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Export queryClient for direct access if needed
export { queryClient };
