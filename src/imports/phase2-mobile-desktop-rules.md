✅ Phase 2 – Mobile Parity + Globale Desktop-Regeln

1️⃣ Mobile ist die einzige Referenz

Bevor du mit Phase 2 startest:
	•	Mobile definiert Feature-Umfang.
	•	Desktop darf nur das enthalten, was Mobile enthält.
	•	Keine neuen Features erfinden.
	•	Keine Logik verändern.
	•	Keine API-Flows anpassen.

Zuerst Mobile vollständig analysieren und dokumentieren:
	•	Alle Screens
	•	Alle Tabs
	•	Alle States
	•	Alle Buttons
	•	Alle Props
	•	Alle API-Calls

Erst danach Desktop angleichen.

⸻

2️⃣ Globale Desktop-Regel (verbindlich für alle Screens)

Ab jetzt gilt für jede Desktop-Implementierung:

❌ Niemals erlaubt:
	•	Buttons ragen aus dem Container
	•	Icons überlappen
	•	Text wird abgeschnitten
	•	Horizontaler Scroll entsteht
	•	Header-Actions quetschen sich ohne Anpassung
	•	Starre Grid-Definitionen verursachen Layout-Brüche

✅ Immer verpflichtend:
	•	min-w-0 bei flex/grid children
	•	overflow-hidden wo nötig
	•	flex-wrap bei Action-Bereichen
	•	Adaptive Button-Strategien (Compact-Mode mit Icon + Tooltip)
	•	Container-basierte Anpassung (nicht nur viewport-basiert)
	•	Flexible minmax() Grid-Definitionen statt harte Pixelwerte

Desktop-Responsiveness bedeutet:
Intelligente Kompression und Umbruch – niemals Überlauf.

Diese Regel gilt für:
	•	Header
	•	Cards
	•	Tabellen
	•	Action-Bereiche
	•	Modals
	•	Toolbars
	•	Filterleisten
	•	Pagination
	•	Alles

⸻

3️⃣ Phase 2 Vorgehen
	1.	Mobile auditieren und dokumentieren
	2.	Desktop-Feature-Parity herstellen
	3.	Nach jeder View:
	•	Breakpoints testen (1920 / 1440 / 1280 / 1100 / 1024)
	•	Overflow prüfen
	•	Action-Bereiche prüfen
	•	Container-Kompression prüfen

Keine View gilt als abgeschlossen ohne Responsive-Check.