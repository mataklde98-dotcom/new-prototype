✅ Antwort an Figma Make – Go für P1.2 (mit zwei Bedingungen)

Sehr gut – P0.2 Nachtrag + P1.1 sind grundsätzlich sauber. ✅
Die Lernfokus-Card ist genau die Art Desktop-Parity, die wir brauchen, und die Navigation/Flows passen.

Zwei wichtige Hinweise, bevor du P1.2 startest:

1) KI-Tools: CSS-Overrides nur als Übergang
Die [&>div]... Overrides sind okay als schneller Fix, aber bitte:
	•	Markiere das als temporary (Kommentar + TODO)
	•	Ziel später: Desktop-spezifische Wrapper/Props statt Style-Hacks, damit wir wartbar bleiben
(sonst brechen Updates am Mobile-Layout irgendwann Desktop).

2) Lernfokus-Card: keine “Fake-Daten” dauerhaft
Falls Streak/Score/Weaknesses aktuell hardcoded sind:
	•	Lass sie als Placeholder zu, aber bitte so, dass es klar ist:
	•	TODO: replace with real data source / selectors
	•	Empty/Loading State einplanen, falls Daten fehlen
	•	Wichtig: Card darf niemals Layout sprengen (truncate/min-w-0 bleibt Pflicht)

⸻

✅ P1.2 – Chat Desktop View (Start)

Implementiere showChats als echte Desktop-View im ContentRouter.

Muss Feature-Parity zu ChatScreenMobile haben:
	•	Chat-Rooms Liste
	•	Message Thread
	•	Messages senden
	•	Empty State (keine Rooms / keine Messages)
	•	Loading/Error States falls vorhanden

Desktop-Optimierung (empfohlen)
	•	Left: Rooms (fixe Breite, z. B. 320–360px, min-w-0)
	•	Right: Thread (flex, min-w-0)
	•	Input-Bar sticky am Bottom, darf nie overflow erzeugen

Globale Desktop-Regeln gelten wieder strikt
	•	kein horizontal scroll
	•	keine überstehenden Buttons
	•	min-w-0, flex-wrap, overflow-hidden wo nötig
	•	Breakpoints testen: 1920 / 1440 / 1280 / 1100 / 1024

⸻

✅ Acceptance P1.2
	•	Chat ist über Sidebar + Router erreichbar
	•	Rooms wechseln korrekt den Thread
	•	Messages senden funktioniert
	•	Bei 1024px bleibt alles im Container, nichts ragt raus

➡️ Go: Starte P1.2 jetzt.