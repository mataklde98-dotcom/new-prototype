# 📚 MY FLASHCARDS & COMPLETED EXAMS - FEATURE DOKUMENTATION

## 🎯 ÜBERSICHT

Diese Dokumentation erklärt, wie die folgenden Features in "My Flashcards" und "Completed Exams" funktionieren:

1. **Suchfunktion** (Search Feature)
2. **3-Punkte Icon/Menü** (Options Menu)
3. **Tab Bar** - Wechsel zwischen KI-Sets, Eigene, Prognosen (nur My Flashcards)

---

## 📁 DATEI-STRUKTUR

### **My Flashcards:**
```
/src/app/components/
  ├── MyFlashcardsHeaderMobile.tsx    # Haupt-Header mit Search + Options Button
  ├── MobileTabs.tsx                  # Tab Bar (KI-Sets/Eigene/Prognosen)
  ├── SearchOverlay.tsx               # Such-Overlay Component
  ├── MobileOptionsMenu.tsx           # 3-Punkte Menü Component
  └── MobileSubjectChips.tsx          # Subject Filter Chips

/src/app/App.tsx                      # Main App mit Filter Logic
```

### **Completed Exams:**
```
/src/app/components/
  ├── CompletedExamsScreenMobile.tsx  # Screen mit Search + Options
  ├── SearchOverlay.tsx               # Such-Overlay (shared)
  ├── MobileOptionsMenu.tsx           # 3-Punkte Menü (shared)
  └── MobileSubjectChips.tsx          # Subject Filter (shared)
```

---

## 🔍 1. SUCHFUNKTION (SEARCH FEATURE)

### **Wie es funktioniert:**

#### **A) My Flashcards**

**States im Parent Component (`App.tsx`):**
```typescript
// In useFlashcardFilters Hook
const [searchQuery, setSearchQuery] = useState('');
const [showSearch, setShowSearch] = useState(false);
const [searchClosing, setSearchClosing] = useState(false);
```

**Handler Functions:**
```typescript
const handleOpenSearch = () => {
  setShowSearch(true);
  setSearchClosing(false);
};

const handleCloseSearch = () => {
  setSearchClosing(true);
  setTimeout(() => {
    setShowSearch(false);
    setSearchClosing(false);
    setSearchQuery('');
  }, 300); // Animation Duration
};

const handleSearchChange = (query: string) => {
  setSearchQuery(query);
};
```

**Filter Logic (in App.tsx):**
```typescript
const filteredCards = cards.filter(card => {
  // Search Filter
  const matchesSearch = 
    card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.answer.toLowerCase().includes(searchQuery.toLowerCase());
  
  if (!matchesSearch) return false;
  
  // ... andere Filter
  return true;
});
```

**Component Integration (`MyFlashcardsHeaderMobile.tsx`):**
```tsx
<div className="flex items-center justify-between">
  {showSearch ? (
    <SearchOverlay
      show={showSearch}
      searchQuery={searchQuery}
      searchClosing={searchClosing}
      onSearchChange={onSearchChange}
      onClose={onCloseSearch}
    />
  ) : (
    <>
      {/* Options Button */}
      {/* Search Button */}
      <button
        onClick={onOpenSearch}
        className="border border-white/[0.12] rounded-full size-[42px]"
      >
        <svg>{/* Search Icon */}</svg>
      </button>
      {/* Close Button */}
    </>
  )}
</div>
```

---

#### **B) Completed Exams**

**States (`CompletedExamsScreenMobile.tsx`):**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [showSearch, setShowSearch] = useState(false);
const [searchClosing, setSearchClosing] = useState(false);
```

**Handler Functions:**
```typescript
const handleOpenSearch = () => {
  setShowSearch(true);
  setSearchClosing(false);
};

const handleCloseSearch = () => {
  setSearchClosing(true);
  setTimeout(() => {
    setShowSearch(false);
    setSearchClosing(false);
    setSearchQuery('');
  }, 300);
};
```

**Filter Logic:**
```typescript
const filteredExams = completedExams.filter(exam => {
  // Search Filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      exam.topicName.toLowerCase().includes(query) ||
      exam.subjectName.toLowerCase().includes(query) ||
      exam.categoryName.toLowerCase().includes(query) ||
      (exam.subtopicNames && exam.subtopicNames.some(s => 
        s.toLowerCase().includes(query)
      ));
    
    if (!matchesSearch) return false;
  }
  
  // ... andere Filter
  return true;
});
```

---

### **SearchOverlay Component (`SearchOverlay.tsx`):**

**Props Interface:**
```typescript
interface SearchOverlayProps {
  show: boolean;
  searchQuery: string;
  searchClosing: boolean;
  onSearchChange: (query: string) => void;
  onClose: () => void;
}
```

**Component Structure:**
```tsx
export default function SearchOverlay({
  show,
  searchQuery,
  searchClosing,
  onSearchChange,
  onClose
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus(); // Auto-focus beim Öffnen
    }
  }, [show]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: searchClosing ? 0 : 1, x: searchClosing ? -20 : 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex items-center gap-3"
    >
      {/* Search Input */}
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Suchen..."
        className="flex-1 bg-transparent text-white"
      />
      
      {/* Close Button */}
      <button onClick={onClose}>
        <svg>{/* X Icon */}</svg>
      </button>
    </motion.div>
  );
}
```

---

## ⚙️ 2. 3-PUNKTE ICON/MENÜ (OPTIONS MENU)

### **Wie es funktioniert:**

#### **A) My Flashcards**

**States:**
```typescript
const [showOptionsMenu, setShowOptionsMenu] = useState(false);
```

**Handler Functions:**
```typescript
const handleToggleOptionsMenu = () => {
  setShowOptionsMenu(!showOptionsMenu);
};

const handleCloseOptionsMenu = () => {
  setShowOptionsMenu(false);
};
```

**Button Component (`MyFlashcardsHeaderMobile.tsx`):**
```tsx
<div className="relative flex-shrink-0">
  <button
    ref={optionsButtonRef}
    onClick={onToggleOptionsMenu}
    className="border border-white/[0.12] rounded-full size-[42px]"
  >
    <svg
      className="w-[18px] h-[18px] text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  </button>

  <MobileOptionsMenu
    show={showOptionsMenu}
    sortedSetsCount={sortedSetsCount}
    allSetsCount={allSets.length}
    activeSubject={activeSubject}
    activeKategorie={activeKategorie}
    activeThema={activeThema}
    activeUnterthema={activeUnterthema}
    onClose={onCloseOptionsMenu}
    onEnterSelectionMode={onEnterSelectionMode}
    onDeleteFiltered={onDeleteFiltered}
    onDeleteAll={onDeleteAll}
  />
</div>
```

---

#### **B) Completed Exams**

**States:**
```typescript
const [showOptionsMenu, setShowOptionsMenu] = useState(false);
```

**Handler Functions:**
```typescript
const handleToggleOptionsMenu = () => {
  setShowOptionsMenu(!showOptionsMenu);
};

const handleCloseOptionsMenu = () => {
  setShowOptionsMenu(false);
};
```

**Integration (identisch zu My Flashcards):**
```tsx
<button onClick={handleToggleOptionsMenu}>
  <svg>{/* 3-Dots Icon */}</svg>
</button>

<MobileOptionsMenu
  show={showOptionsMenu}
  sortedSetsCount={filteredExams.length}
  allSetsCount={completedExams.length}
  activeSubject={activeSubject}
  activeKategorie={activeKategorie}
  activeThema={activeThema}
  activeUnterthema={activeUnterthema}
  onClose={handleCloseOptionsMenu}
  onEnterSelectionMode={handleEnterSelectionMode}
  onDeleteFiltered={handleDeleteFiltered}
  onDeleteAll={handleDeleteAll}
/>
```

---

### **MobileOptionsMenu Component (`MobileOptionsMenu.tsx`):**

**Props Interface:**
```typescript
interface MobileOptionsMenuProps {
  show: boolean;
  sortedSetsCount: number;
  allSetsCount: number;
  activeSubject: string;
  activeKategorie: string;
  activeThema: string;
  activeUnterthema: string;
  onClose: () => void;
  onEnterSelectionMode: () => void;
  onDeleteFiltered: () => void;
  onDeleteAll: () => void;
}
```

**Component Structure:**
```tsx
export default function MobileOptionsMenu({ ... }) {
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute left-0 top-[50px] z-50"
        >
          {/* Menu Items */}
          <button onClick={onEnterSelectionMode}>Auswählen</button>
          <button onClick={onDeleteFiltered}>Gefilterte löschen</button>
          <button onClick={onDeleteAll}>Alle löschen</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 🎛️ 3. TAB BAR - WECHSEL ZWISCHEN KI-SETS, EIGENE, PROGNOSEN

### **Wie es funktioniert (nur My Flashcards):**

#### **Tab States & Logic:**

**States (`useFlashcardFilters` Hook):**
```typescript
const [activeTab, setActiveTab] = useState<string>('Repeat');
```

**Tab Values:**
```typescript
// Interne IDs (lowercase):
'repeat'    → KI-Sets (AI-generierte Flashcards)
'manual'    → Eigene (Manuell erstellte Flashcards)
'prognosis' → Prognosen (Prognose-basierte Sets)

// Display Values (capitalized):
'Repeat'
'Manual'
'Prognosis'
```

**Handler Function:**
```typescript
const handleTabChange = (tab: string) => {
  setActiveTab(tab); // 'Repeat', 'Manual', or 'Prognosis'
};
```

---

#### **Filter Logic (App.tsx):**

```typescript
// Tab-filtered sets (nur nach Tab, ohne Hierarchie-Filter)
const tabFilteredSets = React.useMemo(() => {
  switch (filters.activeTab) {
    case 'Repeat':
      return allSets.filter(set => set.type === 'repeat');
    case 'Manual':
      return allSets.filter(set => set.type === 'manual');
    case 'Prognosis':
      return allSets.filter(set => set.type === 'prognosis');
    default:
      return allSets;
  }
}, [allSets, filters.activeTab]);

// Vollständig gefilterte Sets (Tab + Subject + Category + Theme + Subtheme)
const sortedSets = filterFlashcardSets(allSets, {
  activeTab: filters.activeTab,
  activeSubject: filters.activeSubject,
  activeKategorie: filters.activeKategorie,
  activeThema: filters.activeThema,
  activeUnterthema: filters.activeUnterthema,
  searchQuery: filters.searchQuery
});
```

---

#### **MobileTabs Component (`MobileTabs.tsx`):**

**Props Interface:**
```typescript
interface MobileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

**Tab Configuration:**
```typescript
const tabs = [
  { 
    id: 'repeat',      // Lowercase ID
    label: 'Repeat',   // Display Name (KI-Sets)
    icon: (
      <svg className="w-[9px] h-[9px]" fill="currentColor" viewBox="0 0 9 9">
        <path d="M7.5 3.75V1.5L9 0L7.5 1.5H5.25C3.585 1.5 2.25 2.835 2.25 4.5C2.25 6.165 3.585 7.5 5.25 7.5H6.75V6H5.25C4.425 6 3.75 5.325 3.75 4.5C3.75 3.675 4.425 3 5.25 3H7.5L6 4.5L7.5 3.75Z" />
      </svg>
    )
  },
  { 
    id: 'manual',      // Lowercase ID
    label: 'Manual',   // Display Name (Eigene)
    icon: (
      <svg className="w-[10px] h-[9px]" fill="currentColor" viewBox="0 0 10 9">
        <path d="M5 0L0 4.5L5 9L10 4.5L5 0Z" />
      </svg>
    )
  },
  { 
    id: 'prognosis',   // Lowercase ID
    label: 'Prognosis', // Display Name (Prognosen)
    icon: (
      <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 10 10">
        <path d="M9 5.5H5.5V9H4.5V5.5H1V4.5H4.5V1H5.5V4.5H9V5.5Z" />
      </svg>
    )
  }
];
```

**Component Structure:**
```tsx
export function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative inline-flex items-center gap-1 bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-lg p-1">
        {tabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id.charAt(0).toUpperCase() + tab.id.slice(1))}
              className="relative px-4 py-2 rounded-md transition-all duration-500"
            >
              {/* Active background with gradient */}
              {isActive && (
                <>
                  <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#009379] to-[#007a63]" />
                  <div className="absolute inset-0 rounded-md blur-lg opacity-40" />
                </>
              )}

              {/* Icon */}
              <div style={{ color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)' }}>
                {tab.icon}
              </div>

              {/* Label */}
              <span style={{ color: isActive ? 'white' : 'rgba(255, 255, 255, 0.4)' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

---

#### **Integration im Header:**

**MyFlashcardsHeaderMobile.tsx:**
```tsx
<div className="px-6 py-4">
  {/* Title + Search/Options Row */}
  <div className="flex items-center justify-between">
    {/* ... Options Button, Search Button, Close Button ... */}
  </div>

  {/* Tab Bar */}
  <div className="mt-4">
    <MobileTabs
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  </div>

  {/* Subject Chips Filter */}
  <MobileSubjectChips
    allSets={allSets}
    activeSubject={activeSubject}
    onSubjectChange={onSubjectChange}
  />
</div>
```

---

## 🔗 DATEN-FLOW DIAGRAMM

### **My Flashcards - Complete Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  MyFlashcardsHeaderMobile.tsx                                │
│  ├── Options Button → onClick={onToggleOptionsMenu}          │
│  ├── Search Button  → onClick={onOpenSearch}                 │
│  ├── Tab Bar        → MobileTabs (onTabChange)               │
│  └── Subject Filter → MobileSubjectChips (onSubjectChange)   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STATE MANAGEMENT (App.tsx / Hooks)                          │
│  ├── useFlashcardFilters()                                   │
│  │   ├── activeTab                                           │
│  │   ├── activeSubject                                       │
│  │   ├── searchQuery                                         │
│  │   ├── showSearch                                          │
│  │   └── showOptionsMenu                                     │
│  └── useFlashcards() → fetchFlashcards()                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  FILTER LOGIC (App.tsx)                                      │
│  ├── Tab Filter:     type === activeTab                      │
│  ├── Subject Filter: subject === activeSubject               │
│  ├── Search Filter:  includes(searchQuery)                   │
│  └── Results:        filteredSets[]                          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER COMPONENTS                                           │
│  ├── FlashcardGrid (filteredSets)                            │
│  ├── SearchOverlay (if showSearch)                           │
│  ├── MobileOptionsMenu (if showOptionsMenu)                  │
│  └── MobileTabs (highlight activeTab)                        │
└─────────────────────────────────────────────────────────────┘
```

---

### **Completed Exams - Complete Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  USER INTERACTION                                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  CompletedExamsScreenMobile.tsx                              │
│  ├── Options Button → onClick={handleToggleOptionsMenu}      │
│  ├── Search Button  → onClick={handleOpenSearch}             │
│  └── Subject Filter → MobileSubjectChips                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STATE MANAGEMENT (CompletedExamsScreenMobile.tsx)           │
│  ├── searchQuery                                             │
│  ├── showSearch                                              │
│  ├── showOptionsMenu                                         │
│  ├── activeSubject                                           │
│  └── completedExams[] (from localStorage)                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  FILTER LOGIC                                                │
│  ├── Subject Filter: subject === activeSubject               │
│  ├── Search Filter:  topic/subject includes(searchQuery)     │
│  └── Results:        filteredExams[]                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RENDER COMPONENTS                                           │
│  ├── CompletedExamCard[] (filteredExams)                     │
│  ├── SearchOverlay (if showSearch)                           │
│  └── MobileOptionsMenu (if showOptionsMenu)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🐛 HÄUFIGE FEHLER & LÖSUNGEN

### **Problem 1: Suchfunktion funktioniert nicht**

**Mögliche Ursachen:**

1. **State nicht richtig gesetzt:**
```typescript
// ❌ FALSCH:
const [searchQuery, setSearchQuery] = useState();

// ✅ RICHTIG:
const [searchQuery, setSearchQuery] = useState('');
```

2. **Handler nicht verbunden:**
```tsx
// ❌ FALSCH:
<SearchOverlay onSearchChange={setSearchQuery} />

// ✅ RICHTIG:
<SearchOverlay onSearchChange={(query) => setSearchQuery(query)} />
```

3. **Filter Logic fehlt:**
```typescript
// ✅ MUSS VORHANDEN SEIN:
const filteredData = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
  if (!matchesSearch) return false;
  return true;
});
```

---

### **Problem 2: 3-Punkte Icon reagiert nicht**

**Mögliche Ursachen:**

1. **State nicht initialisiert:**
```typescript
// ❌ FALSCH: State fehlt
<button onClick={handleToggleOptionsMenu}>...</button>

// ✅ RICHTIG:
const [showOptionsMenu, setShowOptionsMenu] = useState(false);
const handleToggleOptionsMenu = () => setShowOptionsMenu(!showOptionsMenu);
```

2. **Click Handler fehlt:**
```tsx
// ❌ FALSCH:
<button className="...">
  <svg>...</svg>
</button>

// ✅ RICHTIG:
<button onClick={onToggleOptionsMenu} className="...">
  <svg>...</svg>
</button>
```

3. **MobileOptionsMenu nicht gerendert:**
```tsx
// ✅ MUSS NACH DEM BUTTON SEIN:
<button onClick={onToggleOptionsMenu}>...</button>

<MobileOptionsMenu
  show={showOptionsMenu}
  onClose={onCloseOptionsMenu}
  {...props}
/>
```

---

### **Problem 3: Tab Bar wechselt nicht**

**Mögliche Ursachen:**

1. **activeTab State fehlt:**
```typescript
// ❌ FALSCH: State fehlt
<MobileTabs onTabChange={handleTabChange} />

// ✅ RICHTIG:
const [activeTab, setActiveTab] = useState('Repeat');
<MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
```

2. **Case Sensitivity Fehler:**
```typescript
// ❌ FALSCH:
const isActive = activeTab === tab.id; // 'Repeat' !== 'repeat'

// ✅ RICHTIG:
const isActive = activeTab.toLowerCase() === tab.id;
```

3. **Filter Logic fehlt:**
```typescript
// ✅ MUSS VORHANDEN SEIN:
const tabFilteredSets = useMemo(() => {
  switch (activeTab) {
    case 'Repeat':
      return allSets.filter(set => set.type === 'repeat');
    case 'Manual':
      return allSets.filter(set => set.type === 'manual');
    case 'Prognosis':
      return allSets.filter(set => set.type === 'prognosis');
    default:
      return allSets;
  }
}, [allSets, activeTab]);
```

4. **onClick Capitalization fehlt:**
```tsx
// ❌ FALSCH:
onClick={() => onTabChange(tab.id)} // sendet 'repeat', 'manual', etc.

// ✅ RICHTIG:
onClick={() => onTabChange(tab.id.charAt(0).toUpperCase() + tab.id.slice(1))}
// sendet 'Repeat', 'Manual', 'Prognosis'
```

---

## ✅ CHECKLISTE FÜR DEBUGGING

### **Suchfunktion:**
- [ ] State `searchQuery` initialisiert (`useState('')`)
- [ ] State `showSearch` initialisiert (`useState(false)`)
- [ ] Handler `handleOpenSearch` vorhanden
- [ ] Handler `handleCloseSearch` vorhanden
- [ ] Handler `handleSearchChange` vorhanden
- [ ] SearchOverlay Component gerendert wenn `showSearch === true`
- [ ] Props korrekt übergeben (show, searchQuery, onSearchChange, onClose)
- [ ] Filter Logic implementiert (`.filter()` mit searchQuery)
- [ ] Auto-focus auf Input funktioniert (`useRef` + `useEffect`)

### **3-Punkte Menu:**
- [ ] State `showOptionsMenu` initialisiert (`useState(false)`)
- [ ] Handler `handleToggleOptionsMenu` vorhanden
- [ ] Handler `handleCloseOptionsMenu` vorhanden
- [ ] Button mit `onClick={handleToggleOptionsMenu}`
- [ ] MobileOptionsMenu Component gerendert
- [ ] Props korrekt übergeben (show, onClose, counts, handlers)
- [ ] Click Outside Handler funktioniert (`useEffect` + Event Listener)
- [ ] Menu Actions funktionieren (Delete, Select Mode)

### **Tab Bar (nur My Flashcards):**
- [ ] State `activeTab` initialisiert (`useState('Repeat')`)
- [ ] Handler `handleTabChange` vorhanden
- [ ] MobileTabs Component gerendert
- [ ] Props korrekt übergeben (activeTab, onTabChange)
- [ ] Tab Configuration korrekt (id, label, icon)
- [ ] Case Sensitivity korrekt (`activeTab.toLowerCase() === tab.id`)
- [ ] onClick Capitalization korrekt (`.charAt(0).toUpperCase()`)
- [ ] Filter Logic implementiert (switch/case mit activeTab)
- [ ] Active State Styling funktioniert (gradient + glow)

---

## 🎨 STYLING REQUIREMENTS

### **Apple Vision Pro Aesthetik:**

```css
/* Glassmorphism Background */
background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
backdrop-filter: blur(40px);
border: 1px solid rgba(255, 255, 255, 0.08);

/* Buttons */
border: 1px solid rgba(255, 255, 255, 0.12);
border-radius: 21px; /* size / 2 for perfect circle */
transition: all 0.15s ease;

/* Active State (Buttons) */
border-color: rgba(255, 255, 255, 0.3);
transform: scale(0.95);

/* Tab Active State */
background: linear-gradient(to bottom right, #009379, #007a63);
box-shadow: 0 2px 12px rgba(0, 147, 121, 0.25), 0 0 24px rgba(0, 147, 121, 0.12);
```

---

## 📱 RESPONSIVE BEHAVIOR

### **Mobile (< 768px):**
- Search Overlay: Full-width mit Animation
- Options Menu: Dropdown von links-oben
- Tab Bar: Zentriert, scrollable wenn nötig

### **Desktop (≥ 768px):**
- Search: Inline Input Field
- Options Menu: Dropdown oder Modal
- Tab Bar: Desktop verwendet andere Component (nicht MobileTabs)

---

## 🔧 TESTING CHECKLIST

### **Manuelle Tests:**

**Suchfunktion:**
1. Click Search Button → Overlay erscheint
2. Input Feld auto-focused
3. Typing filtert Ergebnisse in Echtzeit
4. Click X → Overlay schließt mit Animation
5. searchQuery wird geleert

**3-Punkte Menu:**
1. Click 3-Dots → Menu erscheint
2. Click Outside → Menu schließt
3. Click Menu Item → Action wird ausgeführt, Menu schließt
4. Counts korrekt angezeigt (Filtered vs. All)

**Tab Bar:**
1. Click Tab → activeTab ändert sich
2. Active Tab hat Gradient Background + Glow
3. Inactive Tabs haben opacity 0.4
4. Daten werden nach Tab gefiltert
5. Subject Filter resettet beim Tab-Wechsel (optional)

---

## 📄 CODE EXAMPLES - KOMPLETTE IMPLEMENTIERUNG

### **Example 1: My Flashcards Header Integration**

```tsx
// MyFlashcardsHeaderMobile.tsx
import { MobileTabs } from './MobileTabs';
import SearchOverlay from './SearchOverlay';
import MobileOptionsMenu from './MobileOptionsMenu';

export default function MyFlashcardsHeaderMobile({
  activeTab,
  searchQuery,
  showSearch,
  searchClosing,
  showOptionsMenu,
  allSets,
  sortedSetsCount,
  onTabChange,
  onSearchChange,
  onOpenSearch,
  onCloseSearch,
  onToggleOptionsMenu,
  onCloseOptionsMenu,
  ...otherProps
}) {
  return (
    <div className="px-6 py-4">
      {/* Title + Icons Row */}
      <div className="flex items-center justify-between">
        {showSearch ? (
          <SearchOverlay
            show={showSearch}
            searchQuery={searchQuery}
            searchClosing={searchClosing}
            onSearchChange={onSearchChange}
            onClose={onCloseSearch}
          />
        ) : (
          <>
            {/* Options Button */}
            <button onClick={onToggleOptionsMenu} className="...">
              <svg>{/* 3 Dots */}</svg>
            </button>
            
            <MobileOptionsMenu
              show={showOptionsMenu}
              sortedSetsCount={sortedSetsCount}
              allSetsCount={allSets.length}
              onClose={onCloseOptionsMenu}
              {...otherProps}
            />

            {/* Search Button */}
            <button onClick={onOpenSearch} className="...">
              <svg>{/* Search Icon */}</svg>
            </button>

            {/* Close Button */}
            <button onClick={onClose} className="...">
              <svg>{/* X Icon */}</svg>
            </button>
          </>
        )}
      </div>

      {/* Tab Bar */}
      <div className="mt-4">
        <MobileTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </div>
  );
}
```

---

### **Example 2: Completed Exams Integration**

```tsx
// CompletedExamsScreenMobile.tsx
import SearchOverlay from './SearchOverlay';
import MobileOptionsMenu from './MobileOptionsMenu';

export default function CompletedExamsScreenMobile({ onClose, onExamClick }) {
  const [completedExams, setCompletedExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchClosing, setSearchClosing] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleOpenSearch = () => {
    setShowSearch(true);
    setSearchClosing(false);
  };

  const handleCloseSearch = () => {
    setSearchClosing(true);
    setTimeout(() => {
      setShowSearch(false);
      setSearchClosing(false);
      setSearchQuery('');
    }, 300);
  };

  const handleToggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const filteredExams = completedExams.filter(exam => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        exam.topicName.toLowerCase().includes(query) ||
        exam.subjectName.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    return true;
  });

  return (
    <div className="...">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        {showSearch ? (
          <SearchOverlay
            show={showSearch}
            searchQuery={searchQuery}
            searchClosing={searchClosing}
            onSearchChange={setSearchQuery}
            onClose={handleCloseSearch}
          />
        ) : (
          <>
            <button onClick={handleToggleOptionsMenu}>
              <svg>{/* 3 Dots */}</svg>
            </button>
            
            <MobileOptionsMenu
              show={showOptionsMenu}
              sortedSetsCount={filteredExams.length}
              allSetsCount={completedExams.length}
              onClose={() => setShowOptionsMenu(false)}
              {...handlers}
            />

            <button onClick={handleOpenSearch}>
              <svg>{/* Search */}</svg>
            </button>
          </>
        )}
      </div>

      {/* Exams Grid */}
      <div className="grid gap-4 px-6">
        {filteredExams.map(exam => (
          <CompletedExamCard key={exam.id} {...exam} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 QUICK START GUIDE

### **Wenn Suchfunktion fehlt:**

1. **States hinzufügen:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [showSearch, setShowSearch] = useState(false);
const [searchClosing, setSearchClosing] = useState(false);
```

2. **Handlers hinzufügen:**
```typescript
const handleOpenSearch = () => {
  setShowSearch(true);
  setSearchClosing(false);
};

const handleCloseSearch = () => {
  setSearchClosing(true);
  setTimeout(() => {
    setShowSearch(false);
    setSearchClosing(false);
    setSearchQuery('');
  }, 300);
};
```

3. **SearchOverlay Component integrieren:**
```tsx
{showSearch ? (
  <SearchOverlay
    show={showSearch}
    searchQuery={searchQuery}
    searchClosing={searchClosing}
    onSearchChange={setSearchQuery}
    onClose={handleCloseSearch}
  />
) : (
  <button onClick={handleOpenSearch}>
    <svg>{/* Search Icon */}</svg>
  </button>
)}
```

4. **Filter Logic hinzufügen:**
```typescript
const filteredData = data.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
  if (!matchesSearch) return false;
  return true;
});
```

---

### **Wenn 3-Punkte Menu fehlt:**

1. **State hinzufügen:**
```typescript
const [showOptionsMenu, setShowOptionsMenu] = useState(false);
```

2. **Handlers hinzufügen:**
```typescript
const handleToggleOptionsMenu = () => setShowOptionsMenu(!showOptionsMenu);
const handleCloseOptionsMenu = () => setShowOptionsMenu(false);
```

3. **Button + Menu integrieren:**
```tsx
<button onClick={handleToggleOptionsMenu}>
  <svg viewBox="0 0 24 24">
    <path d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
  </svg>
</button>

<MobileOptionsMenu
  show={showOptionsMenu}
  onClose={handleCloseOptionsMenu}
  {...props}
/>
```

---

### **Wenn Tab Bar fehlt (My Flashcards):**

1. **State hinzufügen:**
```typescript
const [activeTab, setActiveTab] = useState('Repeat');
```

2. **Filter Logic hinzufügen:**
```typescript
const tabFilteredSets = useMemo(() => {
  switch (activeTab) {
    case 'Repeat':
      return allSets.filter(set => set.type === 'repeat');
    case 'Manual':
      return allSets.filter(set => set.type === 'manual');
    case 'Prognosis':
      return allSets.filter(set => set.type === 'prognosis');
    default:
      return allSets;
  }
}, [allSets, activeTab]);
```

3. **MobileTabs Component integrieren:**
```tsx
<MobileTabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

---

## 📞 SUPPORT

Bei weiteren Fragen oder Problemen:
1. Prüfe CHECKLISTE oben
2. Vergleiche Code mit EXAMPLES
3. Teste mit DEBUGGING TOOLS (React DevTools)
4. Prüfe Console auf Errors

**Viel Erfolg beim Fixen! 🚀**
