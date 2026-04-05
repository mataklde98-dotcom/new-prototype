Sehr gut – Mobile-Audit + Gap-Analyse passt. Genau so machen wir’s.

✅ Phase 2 Priorität (bitte exakt in dieser Reihenfolge)

P0 – Blocker Bugs (sofort)
	1.	ContentRouter Bug fixen
	•	onNavigateToMyFlashcards={onNavigateToKITools} ist falsch → korrekt verdrahten.
	•	Danach kurz bestätigen, welche Navigation jetzt wohin führt (MyFlashcards, KI-Tools, Exam, Generate).
	2.	HomeScreenDesktop Parity
	•	onNavigateToLernanalyse Prop ergänzen und durchreichen
	•	Button/Entry muss wie Mobile erreichbar sein

Acceptance P0:
Navigation funktioniert korrekt, keine falschen Routen, Lernanalyse kann von Home Desktop geöffnet werden.

⸻

P1 – Missing Views
	3.	KI-Tools Desktop View
	•	showKITools muss im ContentRouter wirklich rendern (kein “State existiert aber View fehlt”)
	•	Du darfst KIToolsScreen reuse’n oder KIToolsDesktop machen – Hauptsache: Feature parity mit Mobile
	•	Enthält: Hero-Charakter, Chat-Button, AI-Tools Grid, Library Grid, Navigation-Buttons
	4.	Chat Desktop View
	•	ChatScreenMobile existiert → Desktop View muss gleichen Umfang haben
	•	Desktop-optimiert erlaubt (z. B. left rooms / right thread), aber gleiche Funktionen wie Mobile

Acceptance P1:
KI-Tools und Chat sind als Desktop Views vollständig nutzbar und über Sidebar + Router erreichbar.

⸻

P2 – Sidebar Wiring
	5.	Sidebar Navigation Handler sauber verdrahten:

	•	KI-Tools → öffnet Desktop KI-Tools View
	•	Chats → öffnet Desktop Chat View
	•	Keine toten Links / keine Mobile-only Routen

⸻

🔒 Globale Desktop-Regel (muss überall gelten)

Bei jeder neuen Desktop View / jedem Header:
	•	nie Overflow / herausragende Buttons / horizontal scroll
	•	immer: min-w-0, overflow-hidden wo nötig, flex-wrap bei Actions
	•	adaptive Buttons (compact mode + tooltip) bei engem Container
	•	flexible minmax() Grids statt starrer Pixel

Nach jeder Sub-Task testen: 1920 / 1440 / 1280 / 1100 / 1024

⸻

✅ Reporting

Nach jedem Punkt (P0.1, P0.2, P1.3, P1.4, P2.5) bitte kurz:
	•	was geändert wurde (Dateien)
	•	welche Navigation geprüft wurde
	•	Screenshot oder klare Bestätigung: kein Overflow / kein horizontal scroll

➡️ Go: Starte jetzt mit P0 (ContentRouter Bug + Lernanalyse Prop).