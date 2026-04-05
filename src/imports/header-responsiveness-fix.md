✅ Rückmeldung – Header & Action Responsiveness Fix (Phase 1 Finalisierung)

Das Grid ist jetzt korrekt. Gute Umsetzung.

Allerdings gibt es ein Responsiveness-Problem im Header-Bereich der To-Do Section:

🔴 Problem

Bei kleineren Desktop-Breiten (z. B. ~1024px):
	•	Der „+ Aufgabe hinzufügen“ Button ist zu groß.
	•	Der Filter-Button ragt teilweise aus dem Container.
	•	Die Header-Actions sind nicht adaptiv genug.
	•	Das Layout wirkt gequetscht.

Das darf auf Desktop nicht passieren.

⸻

✅ Bitte folgende Struktur umsetzen

1️⃣ Header-Layout neu strukturieren

Der To-Do Header soll bestehen aus:

[ Title ]                                [ Actions ]

Die Actions müssen in einem eigenen Flex-Container sein:
	•	display: flex
	•	gap: 12px
	•	flex-wrap: wrap
	•	justify-content: flex-end
	•	align-items: center

⸻

2️⃣ Adaptive Button-Strategie

Ab bestimmten Breiten:
	•	Unter ~1200px:
	•	Der Button „+ Aufgabe hinzufügen“ wird kompakter
	•	Padding reduzieren (z. B. px-4 statt px-6)
	•	Text ggf. verkürzen zu „+ Aufgabe“
	•	Unter ~1050px:
	•	Icon + Tooltip statt voller Text möglich
	•	Der Filter-Button darf niemals overflow verursachen.

Kein Element darf:
	•	aus dem Container ragen
	•	überlappen
	•	abgeschnitten sein

⸻

3️⃣ Max-Width Schutz
	•	Stelle sicher, dass Action-Buttons max-width: 100% haben
	•	Falls nicht genug Platz:
	•	Actions umbrechen lassen (wrap)
	•	oder in 2 Zeilen gehen

Aber:
Nicht über Container hinausgehen.

⸻

4️⃣ Acceptance Criteria

Bitte bestätigen:
	•	Bei 1024px ist der To-Do Header sauber
	•	Keine Buttons ragen heraus
	•	Kein horizontaler Scroll
	•	Kein abgeschnittener Text
	•	Verhalten getestet bei:
	•	1920px
	•	1440px
	•	1280px
	•	1100px
	•	1024px

⸻

Wichtige Regel

Desktop Responsiveness bedeutet:
Anpassung durch intelligente Kompression und Wrap —
nicht durch Überlaufenlassen.
