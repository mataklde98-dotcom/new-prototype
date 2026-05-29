# 🎯 Shared Content Selection

**System-wide synchronized Subject/Category/Topic/Subtopic selection**

## 📋 Overview

This directory contains the **4 base screens** used by ALL features in SoStudy:
1. **SubjectSelection** - Select a subject (Fach)
2. **CategorySelection** - Select a category within a subject
3. **TopicSelection** - Select a topic within a category  
4. **SubtopicSelection** - Select a subtopic within a topic

**These 4 screens are ALWAYS synchronized across the entire app.**

## 🏗️ Architecture

```
Feature Architecture:
┌─────────────────────────────────────────┐
│  Screen 1-4: SHARED (Synchronized)      │
│  ✅ Subject Selection                   │
│  ✅ Category Selection                  │
│  ✅ Topic Selection                     │
│  ✅ Subtopic Selection                  │
├─────────────────────────────────────────┤
│  Screen 5+: FEATURE-SPECIFIC            │
│  📝 ExamApp → ExamConfiguration         │
│  🃏 GenerateFlashcards → FlashcardConfig│
│  🔮 Future Features → Custom Screens    │
└─────────────────────────────────────────┘
```

## 📦 What's Included

### Components
- `SubjectSelection` - Subject picker with search & AI generation
- `CategorySelection` - Category picker with dropdown navigation & AI
- `TopicSelection` - Topic picker with dropdown navigation & AI
- `SubtopicSelection` - Subtopic picker with dropdown navigation & AI
- `LoadingSpinner` - Loading indicator
- `Alert` - Alert/notification component
- `EmptyContentModal` - Empty state modal
- `ConfirmDialog` - Confirmation dialog

**🎨 Custom Titles & Modes**: Each component accepts optional props:
- `title` - Customize the header text
- `mode` - Control selection behavior (`'exam'` or `'generate'`)

```tsx
// Exam Simulation - Multi-select, flexible
<SubjectSelection title="Prüfungssimulation" mode="exam" ... />
<TopicSelection mode="exam" ... /> {/* Can select whole topic */}
<SubtopicSelection mode="exam" ... /> {/* Multi-select subtopics */}

// Generate Flashcards - Single-select, strict
<SubjectSelection title="Generiere Karteikarten" mode="generate" ... />
<TopicSelection mode="generate" ... /> {/* Cannot select whole topic */}
<SubtopicSelection mode="generate" ... /> {/* Single-select only */}
```

### Data & Types
- `subjects` - All available subjects
- `categories` - All categories
- `topics` - All topics  
- `getSubtopicsForTopic()` - Get subtopics for a topic
- `Subject`, `Category`, `Topic`, `Subtopic` types

### Utils
- `loadAllSubjects()` - Load subjects with delay
- `loadCategoriesForSubject()` - Load categories for a subject
- `loadTopicsForCategory()` - Load topics for a category
- `loadSubtopicsForTopic()` - Load subtopics for a topic
- `loadWithMinimumDelay()` - Generic loader with minimum delay

## 🚀 Usage

### Import from shared location:

```tsx
import {
  SubjectSelection,
  CategorySelection,
  TopicSelection,
  SubtopicSelection,
  LoadingSpinner,
  Alert,
  EmptyContentModal,
  ConfirmDialog,
  getSubtopicsForTopic,
  loadAllSubjects,
  loadCategoriesForSubject,
  loadTopicsForCategory,
  loadSubtopicsForTopic,
  loadWithMinimumDelay,
  type Subject,
  type Category,
  type Topic,
  type Subtopic
} from '@/shared-content-selection';
```

### Example: New Feature

```tsx
// ✅ MyNewFeatureApp.tsx
import { useState, useEffect } from 'react';
import {
  SubjectSelection,
  CategorySelection,
  TopicSelection,
  SubtopicSelection,
  loadAllSubjects,
  loadCategoriesForSubject,
  type Subject,
  type Category,
  type Topic,
  type Subtopic
} from '@/shared-content-selection';
import MyCustomConfigScreen from './MyCustomConfigScreen'; // Your own screen

export default function MyNewFeatureApp() {
  const [currentScreen, setCurrentScreen] = useState<'subject' | 'category' | 'topic' | 'subtopic' | 'config'>('subject');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null);

  // Use the shared screens for selection...
  // Then add your own config screen at the end!

  if (currentScreen === 'subject') {
    return <SubjectSelection 
      title="My Feature Title" // 🎨 Custom title
      onSelectSubject={(s) => { setSelectedSubject(s); setCurrentScreen('category'); }} 
    />;
  }

  if (currentScreen === 'category') {
    return <CategorySelection 
      title="My Feature Title"
      onSelectCategory={(c) => { setSelectedCategory(c); setCurrentScreen('topic'); }} 
    />;
  }

  if (currentScreen === 'topic') {
    return <TopicSelection 
      title="My Feature Title"
      onSelectTopic={(t) => { setSelectedTopic(t); setCurrentScreen('subtopic'); }} 
    />;
  }

  if (currentScreen === 'subtopic') {
    return <SubtopicSelection 
      title="My Feature Title"
      onSelectSubtopic={(st) => { setSelectedSubtopic(st); setCurrentScreen('config'); }} 
    />;
  }

  if (currentScreen === 'config') {
    return <MyCustomConfigScreen />;
  }
}
```

## ✅ Benefits

1. **Single Source of Truth**: All features use the same components
2. **Automatic Synchronization**: Changes apply to ALL features automatically  
3. **Easy Maintenance**: Update once, sync everywhere
4. **Scalable**: Add new features without duplicating base screens
5. **Consistent UX**: Same behavior across all features

## 🔄 Current Users

- ✅ **ExamApp** (`/src/examapp/app/App.tsx`)
- ✅ **GenerateFlashcardsApp** (`/src/flashcardgen/GenerateFlashcardsApp.tsx`)

## 🛠️ Making Changes

**When you want to update the shared screens:**

1. Edit the component in `/src/examapp/app/components/[ComponentName].tsx`
2. Changes automatically apply to ALL features using `/src/shared-content-selection/`
3. No need to update multiple files!

**Example: Adding a new feature to CategorySelection**

```tsx
// Edit: /src/examapp/app/components/CategorySelection.tsx
// ✅ Automatically available in:
//   - ExamApp
//   - GenerateFlashcardsApp  
//   - ALL future features
```

## 📝 Notes

- The actual components live in `/src/examapp/app/components/`
- This directory re-exports them for system-wide use
- Feature-specific screens (ExamConfiguration, FlashcardConfig, etc.) remain in their own feature directories
- AI Modals and content generation are also shared via this system

## 🎨 Design Philosophy

**Base Screens (1-4) = Platform Foundation**
- Shared across all features
- Consistent behavior & styling
- Centralized maintenance

**Config Screens (5+) = Feature Innovation**
- Unique to each feature
- Custom functionality
- Independent development

This separation allows for:
- **Consistency** where it matters (content selection)
- **Flexibility** where you need it (feature-specific config)
