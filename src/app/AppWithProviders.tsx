import React from 'react';
import { QueryProvider } from '@/providers/QueryProvider';
import { Toaster } from '@/app/components/ui/sonner';
import AppCore from './App';

// ===== APP WITH PROVIDERS =====
// Wrapper für App mit React Query Provider und Toaster
// ContentStoreProvider wird bereits intern in App.tsx für spezifische Modals genutzt

export default function AppWithProviders() {
  return (
    <QueryProvider>
      <AppCore />
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fff',
          },
        }}
      />
    </QueryProvider>
  );
}
