MOBILE TRANSITION STANDARDIZATION + FIXED FOOTER/HEADER ENFORCEMENT

Problem:
Bei einigen Mobile-Transitions blendet der Footer während der Transition aus / bewegt sich,
anstatt fix zu stehen. Dadurch wirkt es so, als würde die Transition "unterbrechen" und nicht sauber
über Header+Footer laufen. Der Header ist in manchen Menüpunkten korrekt fixed, aber der Footer nicht
konsistent.

Ziel:
Alle Mobile-Screens müssen während jeder Transition einheitlich funktionieren:
- Header bleibt fix (wenn vorgesehen)
- Footer / BottomNav bleibt fix (wenn vorhanden)
- Der Content (Screen-Body) ist der einzige Bereich, der transitioned/animiert und gescrollt wird.
- Transitions dürfen niemals den Footer wegblenden oder Layout-shiften.

Ursache:
Es existieren mehrere Transition-Implementierungen pro Screen / Route.
Das erzeugt Inkonsistenzen bei positioning, z-index und mount/unmount Timing.

Anforderung (globale Lösung):
1) Erstelle eine einzige zentrale Transition-Komponente für Mobile, z.B. <MobileRouteTransition />
   Diese ist die einzige erlaubte Route-Transition im gesamten Mobile-Stack.

2) Architektur-Regel:
   - AppShell / Layout bestimmt dauerhaft:
     - Fixed Header Container (optional)
     - Fixed Footer/BottomNav Container (optional)
     - Scrollable Content Area dazwischen
   - Transition wirkt ausschließlich auf den Content Area Container
     (nicht auf Header/Footer)

3) Implementierungs-Details (wichtig):
   - Header/Footer müssen außerhalb des transition-enabled Containers liegen.
   - Content Area bekommt overflow-y-auto und die Transition-Animation.
   - Z-Index sicherstellen:
     - Header/Footer z.B. z-50
     - Transition Content darunter z.B. z-10
   - Kein Conditional Rendering, das Footer während Transition unmountet.

4) Audit & Migration:
   - Finde alle Stellen, wo separate Transitions gebaut wurden (pro Screen / Route).
   - Entferne diese lokalen Transition Wrapper.
   - Migriere alle Routen auf die zentrale <MobileRouteTransition />.
   - Prüfe insbesondere Menüitems (inkl. dem markierten), ob Header korrekt fixed ist
     UND ob Footer ebenfalls stabil bleibt.

5) Verifizierung:
   - Teste Transition in mindestens 5 typischen Routen:
     - Home → Menüpunkt → zurück
     - ToDo → Detail → zurück
     - Lernziele → Detail → zurück
     - Klassenarbeiten → Detail → zurück
     - Profil/Settings → zurück
   - Während Transition darf Footer nicht flackern, nicht ausblenden, nicht springen.

Deliverable:
- Eine zentrale Transition-Komponente, wiederverwendet in allen Mobile-Routen
- Entfernte lokale Transition-Implementierungen
- Kurzreport: welche Files/Routes geändert wurden