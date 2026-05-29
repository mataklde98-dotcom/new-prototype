Danke für die saubere Umsetzung von Phase 1.
Bevor wir mit Phase 2 starten, müssen wir jedoch eine wichtige Korrektur im Home-Layout vornehmen.

🔴 Problem im Home-Grid

Das aktuelle Verhalten mit:

grid-cols-1 unter 1024px
grid-cols-[340px_1fr] darüber

ist für Desktop nicht optimal.

Bei 1024px wird das Layout zu früh einspaltig.
Das wirkt wie eine vergrößerte Mobile-Version und nicht wie eine adaptive Desktop-UI.

Desktop Responsiveness bedeutet:
Nicht alles untereinander stapeln, sondern sinnvoll nebeneinander platzieren, solange genug Platz vorhanden ist.

⸻

✅ Korrektur – Home Desktop Grid

Bitte passe das Home-Layout wie folgt an:

1️⃣ Breakpoint-Logik
	•	Unter ~900px → 1 Spalte (Stacked erlaubt)
	•	Ab 1024px → 2 Spalten
	•	Ab 1440px → Optional optimiertes 2-Spalten-Layout mit besserer Verteilung (z. B. 55/45 oder 60/40)
	•	Ab 1920px → prüfen, ob 3-Spalten-Layout sinnvoll ist (falls Content das hergibt)

Wichtig:
1024px darf NICHT einspaltig sein.

⸻

2️⃣ Adaptive Grid statt starrem Template

Statt hartem grid-cols-[340px_1fr] bitte:
	•	Flexible Spalten mit minmax(0, 1fr)
	•	Oder ein 12-Spalten-System verwenden
	•	Oder auto-fit / auto-fill mit sinnvoller min-width

Ziel:
Keine überdimensionierten Cards.
Keine riesigen Leerflächen.
Keine gestauchten Inhalte.

⸻

3️⃣ Acceptance Check für Phase 1

Bitte bestätige nach Anpassung:
	•	Home wirkt bei 1024px balanced und nicht wie eine Mobile-Ansicht
	•	Skill-Map und ToDos können nebeneinander existieren
	•	Keine unnötigen langen Scroll-Strecken
	•	Kein Overflow
	•	Kein harter Grid-Template-Bug im Home

⸻

Danach

Erst nach dieser Korrektur starten wir mit Phase 2 (KI-Tools Desktop, Chat Desktop, Props Parity).

⸻

Das ist wichtig:
Wenn wir jetzt mit Phase 2 weitermachen, ohne dass das Home-Grid sauber ist, schleppen wir ein strukturelles Problem weiter.

Bitte zuerst Home-Grid korrigieren.