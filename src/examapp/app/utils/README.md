# Loading Utilities - API Integration Guide

## 📁 Datei: `loadingUtils.ts`

Diese Datei enthält alle Loading-Funktionen für die Prüfungssimulation.

---

## 🎯 Aktueller Status: **SIMULATION**

Alle Funktionen **simulieren** aktuell das Laden von Content mit zufälligen Ladezeiten (800ms - 1800ms).

---

## 🚀 Für API-Integration (Zukünftig)

### **Schritt 1: API-Endpunkte erstellen**

Erstelle Backend-Endpunkte für:

```
GET /api/categories?subjectId={subjectId}
GET /api/topics?categoryId={categoryId}
GET /api/subtopics?topicId={topicId}
```

---

### **Schritt 2: Loading-Funktionen anpassen**

Ersetze die simulierten Funktionen mit echten API-Calls:

#### **Vorher (Simulation):**
```typescript
export const loadCategoriesForSubject = async (subjectId: string): Promise<void> => {
  const loadTime = Math.random() * 1000 + 800;
  await new Promise(resolve => setTimeout(resolve, loadTime));
};
```

#### **Nachher (Echte API):**
```typescript
export const loadCategoriesForSubject = async (subjectId: string): Promise<Category[]> => {
  const response = await fetch(`/api/categories?subjectId=${subjectId}`);
  
  if (!response.ok) {
    throw new Error('Failed to load categories');
  }
  
  const data = await response.json();
  return data.categories;
};
```

---

### **Schritt 3: Error Handling hinzufügen**

Füge in `App.tsx` Error-States hinzu:

```typescript
const [loadError, setLoadError] = useState<string | null>(null);

// In den Loading-Calls:
loadWithMinimumDelay(() => loadCategoriesForSubject(subject.id))
  .then((categories) => {
    // Speichere geladene Kategorien wenn nötig
    setSelectionState({ ...selectionState, subject, categories });
    setScreen('categorySelection');
    setLoadedScreens(prev => new Set(prev).add(screenKey));
    setIsLoading(false);
    setLoadError(null);
  })
  .catch((error) => {
    console.error('Loading error:', error);
    setLoadError('Fehler beim Laden der Kategorien. Bitte versuche es erneut.');
    setIsLoading(false);
  });
```

---

### **Schritt 4: Return Types anpassen**

Aktualisiere die Return-Types wenn du echte Daten zurückgibst:

```typescript
// Statt Promise<void>:
export const loadCategoriesForSubject = async (subjectId: string): Promise<Category[]>

// Statt Promise<void>:
export const loadTopicsForCategory = async (categoryId: string): Promise<Topic[]>

// Statt Promise<void>:
export const loadSubtopicsForTopic = async (topicId: string): Promise<Subtopic[]>
```

---

## ⚙️ Minimum Loading Time

Die `MIN_LOADING_TIME` (aktuell 500ms) verhindert zu schnelle UI-Wechsel.

**Warum?**
- Bessere UX (kein "Flash"-Effekt)
- User sehen dass etwas passiert
- Professioneller Look

**Anpassen?**
```typescript
const MIN_LOADING_TIME = 500; // Ändern nach Bedarf (in ms)
```

---

## 📝 Beispiel: Vollständige API-Integration

```typescript
import { Category } from '../data/categories';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const loadCategoriesForSubject = async (
  subjectId: string
): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/categories?subjectId=${subjectId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Füge Auth-Headers hinzu wenn nötig:
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

## 🔄 Caching Strategy

Das `loadedScreens` Set in `App.tsx` cached bereits besuchte Screens:

```typescript
const [loadedScreens, setLoadedScreens] = useState<Set<string>>(new Set());
```

- **Erstes Mal**: Zeigt Loading + lädt Daten
- **Zweites Mal**: Instant Navigation (kein Loading)

---

## ✅ Checklist für API-Integration

- [ ] Backend-Endpunkte erstellt
- [ ] Return-Types in `loadingUtils.ts` angepasst
- [ ] API-Calls implementiert
- [ ] Error-Handling in `App.tsx` hinzugefügt
- [ ] Loading-States getestet
- [ ] Error-States getestet
- [ ] Caching funktioniert
- [ ] Environment Variables konfiguriert
- [ ] Auth-Headers hinzugefügt (falls nötig)

---

## 🐛 Debugging

### Ladezeiten zu lang?
- Reduziere `MIN_LOADING_TIME`
- Überprüfe API-Performance
- Nutze Browser DevTools → Network Tab

### Ladezeiten zu kurz?
- Erhöhe `MIN_LOADING_TIME`
- Prüfe ob Caching korrekt funktioniert

---

**Erstellt für die Prüfungssimulation**  
**Autor: AI Assistant**  
**Datum: Januar 2026**
