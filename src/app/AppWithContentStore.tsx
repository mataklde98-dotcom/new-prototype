import React from 'react';
import App from './App';
import { ContentStoreProvider } from '@/shared-content-store/ContentStore';

/**
 * Wrapper component that provides the Content Store to the entire app.
 * This allows both Exam Simulation and Generate Flashcards to share
 * Subjects, Categories, Topics, and Subtopics.
 */
export default function AppWithContentStore() {
  return (
    <ContentStoreProvider>
      <App />
    </ContentStoreProvider>
  );
}
