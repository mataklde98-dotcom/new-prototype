GLOBAL DESKTOP LAYOUT AUDIT & STANDARDIZATION

Ziel:
Überprüfe die gesamte Desktop-Version der App und vereinheitliche das Layout vollständig. 
Es dürfen keine alten, inkonsistenten oder mobilen Layout-Strukturen mehr aktiv sein.

1. GLOBAL DESKTOP WRAPPER ERZWINGEN
- Jeder Screen muss in einem einheitlichen DesktopContentWrapper laufen.
- Einheitliche max-width (z.B. 1200–1280px)
- mx-auto Centering
- Einheitliches horizontales Padding (px-6 oder px-8)
- Keine hardcodierten max-w-[...] Werte mehr
- Keine schmalen Karten in der Mitte auf großen Screens

2. BACK BUTTON STANDARDISIEREN
- Alle "Zurück"-Buttons müssen identisch sein:
  - Gleiche Position (immer oberhalb des Page-Titels)
  - Gleicher Abstand zum oberen Rand
  - Gleiche Icon-Größe
  - Gleiche Typografie
  - Gleiche Hover-States
- Entferne alle individuellen Back-Button-Implementierungen
- Erstelle eine zentrale BackButton-Komponente

3. DETAILSEITEN FIXEN
Prüfe insbesondere:
- ToDo → Erledigte Klassenarbeiten → Detailansicht
- Lernziele → Detailansicht
- Klassenarbeiten Details
- Alle Nested-Detailseiten

Diese nutzen teilweise noch alte Layout-Strukturen.
Ersetze sie vollständig durch das neue Desktop-Layout-System.

4. CONTENT-SKALIERUNG
- Auf großen Screens darf Content nicht schmal wirken.
- Karten sollen sich responsiv anpassen.
- Grid-System mit auto-fit oder auto-fill verwenden.
- Keine fixe 560px oder 700px Container mehr.

5. SIDEBAR-INTERAKTION
- Content darf bei Sidebar-Toggle nicht verrutschen.
- Zentrierung muss immer visuell konsistent bleiben.
- Kein unterschiedlicher Startpunkt je Screen.

6. VISUELLE VERTIKALE KONSISTENZ
- Alle Seiten starten auf gleicher Höhe.
- Einheitlicher Top-Spacing zwischen:
  - Back Button
  - Titel
  - Content Card

7. MOBILE-LOGIK ENTFERNEN (DESKTOP)
- Entferne alle mobilen max-width oder centered mobile containers.
- Desktop darf kein „Tablet-Look“ mehr haben.

Erstelle:
- Eine globale Layout-Struktur
- Eine BackButton-Komponente
- Einen einheitlichen Content-Wrapper
- Und migriere ALLE Screens darauf

Wichtig:
Es geht nicht um einzelne Screens.
Es geht um eine vollständige Desktop-Standardisierung der gesamten App.