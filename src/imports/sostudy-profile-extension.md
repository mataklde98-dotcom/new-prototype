✅ Figma Make Master Prompt – SoStudy Profil Erweiterung (System-Architektur + High-End UX)

⸻

Kontext

Erweitere das bestehende Schülerprofil in der bestehenden SoStudy App.

Wichtig:
	•	KEIN neues App-Layout erstellen.
	•	KEIN neues Design-System erstellen.
	•	Bestehende Farben, Spacing, Typografie und Komponenten verwenden.
	•	Die Erweiterung muss modular, skalierbar und komponentenbasiert aufgebaut sein.
	•	Desktop-first, responsive.
	•	Clean, modern, produktreif.
	•	Keine schweren Schatten, kein übermäßiger Blur.
	•	Klare Hierarchie, ruhige Datenstruktur.

⸻

🔷 Informations-Hierarchie (WICHTIG)

Die Profilseite erhält eine neue Unter-Navigation mit 4 Tabs:
	1.	Übersicht
	2.	Lernfortschritt
	3.	KI-Prognose
	4.	Leistungsanalyse

Priorität der Tabs:
1 → 2 → 3 → 4
(Übersicht ist Standard-Tab)

Keine Gleichgewichtung. Übersicht ist primär.

⸻

1️⃣ TAB: Übersicht (Primärbereich)

Datenquelle:
GET /v1/curriculum/profile-overview/:userId

Layoutstruktur (zwingend einhalten)

SECTION 1 – Status Snapshot (Hero Bereich)
	•	Gesamttrend (improving / declining)
	•	Anzahl kritischer Schwächen
	•	Data Quality Status
	•	1 Primary CTA: „Jetzt Schwächen trainieren“

SECTION 2 – Top Schwächen (max 5 sichtbar)

Card-Komponente:
	•	Topic
	•	Score %
	•	Severity Badge (rot/gelb/grün)
	•	1 Zeile Empfehlung
	•	CTA: „Trainieren“
	•	Secondary CTA: „Karteikarten“

Karten müssen wiederverwendbar sein (für Prognose ebenfalls).

SECTION 3 – Stärken (kompakt)
	•	Grid mit Topics
	•	Score
	•	Positives Badge

⸻

2️⃣ TAB: Lernfortschritt

Datenquelle:
GET /v1/curriculum/learning-progress/:userId

Layoutstruktur

SECTION 1 – Gesamtfortschritt
	•	Große Progress-Bar
	•	Prozent
	•	Optional Trendindikator

SECTION 2 – Fächerübersicht

Accordion oder Tabs pro Fach.

Pro Fach:

Header:
	•	Fachname
	•	Fach-Fortschritt %
	•	Curriculum Coverage %
	•	Status Badge

Body:

A) Needs Attention (max 3 Chips)
B) Upcoming Themen (max 3 Chips)

C) Themenliste (Tabellarische Karten)

Pro Thema:
	•	Durchschnittsscore
	•	Anzahl Versuche
	•	Trend (↑ → ↓)
	•	CTA: „Üben“
	•	CTA: „Karteikarten“

Themen-Komponente wiederverwendbar designen.

⸻

3️⃣ TAB: KI-Prognose

Datenquelle:
GET /v1/curriculum/profile-prognosis/:userId

Layoutstruktur

SECTION 1 – Prognose Überblick
	•	Gesamttrend
	•	Urgent Actions Counter
	•	Anzahl kritischer Risiken

SECTION 2 – Kritische Schwächen

Wiederverwendung der Schwächen-Card aus Übersicht.
Zusätzlich:
	•	Kritikalitätsindikator
	•	Handlungsempfehlung

SECTION 3 – Zukünftige Risiken

Card:
	•	Topic
	•	Risiko-Level (high/medium/low)
	•	Begründungstext (reason)
	•	CTA: „Vorbereiten“
	•	CTA: „Karteikarten“

Design etwas analytischer, aber gleiche Design-Sprache wie Rest.

⸻

4️⃣ TAB: Leistungsanalyse

Datenquelle:
GET /v1/curriculum/unified-performance/:userId

Wichtig:
Wenn unified-performance vorhanden → andere Daten NICHT duplizieren.

Layoutstruktur

SECTION 1 – KPI Summary (Horizontal Cards)
	•	Total Activities
	•	Average Performance
	•	Strongest Subject
	•	Weakest Subject
	•	Trend

SECTION 2 – Aktivitätsfeed (Timeline)
	•	Flashcard Sessions
	•	Exam Results
	•	Submissions

Chronologisch sortiert.
Einheitliche Activity-Komponente.

SECTION 3 – Cross Source Analyse
	•	Consistent Weaknesses
	•	Consistent Strengths
	•	Learning Style Badge

⸻

⚙️ UX-Regeln (Zwingend)
	1.	Jede Schwäche benötigt mindestens eine klare Handlungsoption.
	2.	Keine leeren Screens → Empty State Designs definieren.
	3.	Skeleton Loading States für jede Section.
	4.	Klare visuelle Hierarchie:
	•	KPI > Schwächen > Details
	5.	Wiederverwendbare Komponenten verwenden.
	6.	Keine überladenen Layouts.
	7.	Maximal 3 Ebenen Verschachtelung.