✅ Figma Make Prompt – Desktop Version vollständig auf Mobile Stand bringen

🎯 Ziel

Bringe die gesamte Desktop-Version funktional und visuell auf denselben Stand wie die aktuelle Mobile-Version.

Wichtig:
	•	Die Mobile-Version darf in keiner Weise verändert werden.
	•	Es darf ausschließlich an der Desktop-Version gearbeitet werden.
	•	Die Desktop-Version muss alle Funktionen, Zustände und Logiken der Mobile-Version vollständig enthalten.

⸻

1️⃣ Funktionale Gleichheit (Feature Parity)

Stelle sicher, dass die Desktop-Version:
	•	Alle Features enthält, die in der Mobile-Version existieren
	•	Alle States besitzt (Empty State, Loading, Error, Success etc.)
	•	Alle API-Anbindungen korrekt integriert
	•	Dieselbe Logik verwendet (z. B. Category statt CompetencyArea)
	•	Exam Simulation vollständig abbildet
	•	Learning Progress vollständig abbildet
	•	ToDo-Logik identisch umsetzt
	•	Classwork-Upload-Flow vollständig enthält
	•	Prognosis, Skill Map, Schwächen/Stärken etc. korrekt integriert

Falls in der Desktop-Version Funktionen fehlen → diese exakt wie in Mobile nachbauen.

⸻

2️⃣ Layout-System für Desktop

Die Desktop-Version soll nicht einfach „vergrößerte Mobile-Screens“ sein, sondern ein sauberes Desktop-System bekommen.

Struktur:
	•	Feste Sidebar links
	•	Content-Bereich zentriert
	•	Max-Width Wrapper: 1440px
	•	Innerer Content-Container: 1200px
	•	Einheitliches Spacing:
	•	32px Außenabstand
	•	24px Innenabstand
	•	12-Spalten-Grid-System

⸻

3️⃣ Zentrierung & Konsistenz

Aktuell sind viele Fenster:
	•	Nicht mittig im Content-Bereich
	•	Zu breit oder zu schmal
	•	Unsauber ausgerichtet
	•	Buttons und Suchfelder sind nicht responsive

Fixe folgendes:
	•	Alle Modals und Fenster müssen horizontal UND vertikal korrekt ausgerichtet sein
	•	Kein Element darf „random“ positioniert sein
	•	Einheitliche Button-Höhen
	•	Einheitliche Input-Höhen
	•	Konsistente Abstände zwischen Elementen
	•	Kein überlaufender Content
	•	Responsive Verhalten bei:
	•	1920px
	•	1440px
	•	1280px
	•	1024px

⸻

4️⃣ Responsiveness (Desktop)

Desktop darf nicht starr sein.
	•	Tabellen müssen scrollbar oder intelligent umbrechbar sein
	•	Buttons dürfen nicht aus dem Layout fallen
	•	Suchfelder müssen sich flexibel anpassen
	•	Karten-Layouts sollen sich dynamisch in 2–4 Spalten anpassen
	•	Kein abgeschnittener Text
	•	Keine Überlappungen

⸻

5️⃣ Visuelle Konsistenz
	•	Gleiche Farben wie Mobile
	•	Gleiche Typografie
	•	Gleiche Design-Tokens
	•	Gleiche Icon-Logik
	•	Gleiche KPI-Darstellung
	•	Gleiche Status-Labels

Desktop darf sich größer anfühlen – aber nicht anders.

⸻

6️⃣ Qualitätssicherung

Prüfe:
	•	Sind alle Mobile-Features vorhanden?
	•	Sind alle APIs verbunden?
	•	Sind alle Daten korrekt angezeigt?
	•	Sind alle Zustände sichtbar?
	•	Sind alle Fenster mittig?
	•	Ist das Spacing konsistent?
	•	Ist die UI technisch sauber aufgebaut?

⸻

7️⃣ Wichtige Regel

Mobile ist die Referenz.

Desktop muss 1:1 funktional mithalten, aber im Desktop-Kontext sauber strukturiert sein.

Keine neue Logik einführen.
Keine bestehenden Mobile-Komponenten verändern.
Nur Desktop reparieren, erweitern und auf denselben Stand bringen.