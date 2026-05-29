✅ P2 – Navigation System Finalisieren (keine toten Menü-Punkte)

Sehr gute Umsetzung von P1.2.
Bevor wir weitergehen, müssen wir jetzt die gesamte Desktop-Navigation systematisch konsistent machen.

Aktuell existieren mehrere Menü-Punkte (Sidebar + Sub-Items), aber nicht alle sind sauber mit dem Router und den Views verbunden.

⸻

🔍 Schritt 1 – Vollständiges Navigation-Audit (Desktop)

Bitte liste systematisch auf:

Sidebar Hauptpunkte:
	•	Home
	•	Meetings
	•	Chats
	•	KI-Tools
	•	Profil
	•	Einstellungen
	•	ggf. Sub-Items (z. B. Lernassistent, Meine Karteikarten etc.)

Für jeden Punkt bitte dokumentieren:
	1.	Welche Funktion wird aufgerufen?
	2.	Welche Navigation-State-Flags werden gesetzt?
	3.	Welche View rendert der ContentRouter?
	4.	Gibt es Konflikte mit anderen Flags (z. B. showProfilDesktop + showChats etc.)?
	5.	Gibt es Punkte, die nur UI sind, aber nichts rendern?

Erst wenn diese Tabelle steht, geht es weiter.

⸻

🎯 Ziel von P2

1️⃣ Jeder Menüpunkt muss exakt eine klare Route haben

Kein:
	•	Doppelt gesetzter State
	•	Verwaister Handler
	•	Mobile-only Navigation
	•	toter Menüpunkt
	•	Punkt, der nichts rendert

⸻

2️⃣ Single Source of Truth

Navigation darf nicht verteilt und inkonsistent sein.

Bitte prüfen:
	•	useNavigation
	•	useLayoutProps
	•	App.tsx
	•	ContentRouter.tsx
	•	Sidebar

Es darf keine Stelle geben, wo:
	•	Navigation direkt State manipuliert ohne zentralen Handler
	•	mehrere Flags gleichzeitig true sein können
	•	Views sich gegenseitig überlagern

⸻

3️⃣ Konsistenz-Regel

Wenn ich im Sidebar auf:
	•	Chats klicke → Chat Desktop View
	•	KI-Tools → KI-Tools Desktop View
	•	Meine Karteikarten → MyFlashcards
	•	Abgeschlossene Klausuren → CompletedExams
	•	Lernanalyse → Overlay
	•	Profil → Profil Desktop
	•	Einstellungen → Einstellungen Desktop (falls existiert)

Dann muss das:
	•	immer funktionieren
	•	immer dieselbe Route nehmen
	•	immer andere Views sauber schließen

⸻

4️⃣ Acceptance Criteria

Nach Umsetzung bitte bestätigen:
	•	Jeder Sidebar-Punkt rendert eine gültige View
	•	Kein Menüpunkt ohne Funktion
	•	Kein horizontal scroll
	•	Kein doppeltes Rendern
	•	Kein überlappender State
	•	Alle getestet bei 1920 / 1440 / 1280 / 1100 / 1024

⸻

⚠️ Wichtige Regel

Navigation ist Infrastruktur.
Ohne saubere Navigation ist jedes Feature instabil.

Erst wenn Navigation 100 % konsistent ist, machen wir weiter.