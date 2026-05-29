Deine Priorisierung ist korrekt.
Wir gehen strukturiert und systematisch vor.

Phase 1 – Fundament (höchste Priorität)

Baue zuerst ein sauberes Desktop-Layout-System auf.

Implementiere in MainLayout.tsx und ContentRouter.tsx:
	•	Outer Wrapper: max-width 1440px, centered
	•	Inner Content Container: max-width 1200px
	•	Einheitliches Spacing:
	•	32px outer padding
	•	24px inner spacing
	•	12-Column Grid System
	•	Responsive Breakpoints:
	•	1920px
	•	1440px
	•	1280px
	•	1024px
	•	Konsistente Zentrierung aller Views und Modals

Bevor neue Features implementiert werden, muss das Layout-Fundament sauber stehen.
Kein weiteres Feature-Upgrade ohne stabiles Layout-System.

⸻

Phase 2 – Feature Parity

Sobald das Layout-System steht:
	1.	Implementiere KI-Tools als vollständige Desktop-View im ContentRouter.
	2.	Baue einen vollwertigen Desktop-Chat-Bereich (kein Mobile-Clone, sondern Desktop-optimiert).
	3.	Ergänze fehlende Props wie onNavigateToLernanalyse im HomeScreenDesktop.
	4.	Prüfe systematisch jede Mobile-View auf Feature-Gleichheit.

Wichtig:
Keine Feature-Logik verändern.
Keine neue Logik einführen.
Nur parity herstellen.

⸻

Phase 3 – Konsistenz & Feinschliff

Danach:
	•	Einheitliche Button-Höhen
	•	Einheitliche Input-Höhen
	•	Einheitliche Card-Paddings
	•	Einheitliche Spacing-Werte
	•	Fix aller nicht-zentrierten Fenster
	•	Fix aller nicht-responsiven Buttons/Suchfelder
	•	Kein Overflow
	•	Keine abgeschnittenen Texte

⸻

Wichtige Regel

Mobile ist die Referenz.
Desktop wird technisch und visuell angepasst, aber niemals Mobile verändert.