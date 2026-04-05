Tab 1: „Übersicht"
1. 71% Gesamt-KPI → overallProgress
Du hast absolut recht. Der overallProgress: 65 aus Endpoint 1 (learning-progress) ist genau dafür da – das ist der Gesamtfortschritt den die API berechnet basierend auf allen Fächern und Lehrplanabdeckung. Aktuell berechnen wir ihn falsch im Frontend als Durchschnitt der Subject-Progress-Werte. Das muss geändert werden → direkt overallProgress aus der API nehmen, sowohl hier in Tab 1 als auch in Tab 2.

Sektion „Top Schwächen":
1. SeverityBadge – Genau, severity kommt von der API (z.B. "hoch"), wir mappen das dann im Frontend auf Labels: hoch → Kritisch, mittel → Achtung, niedrig → Mittel. Passt, bleibt so.

2. Mathematik Fach-Subtitle – Richtig, das SOLLTE von der API kommen. Aktuell ist es nicht in der API-Response von Endpoint 2 (profile-overview). Das ist eine Info die der KI-Entwickler im Backend ergänzen muss → jedes topWeaknesses[]-Item braucht ein subject-Feld. Wir notieren das als Backend-Anforderung.

3. Play-Icon entfernen – Wird gemacht. Die criticalActions werden dann nur noch als visuelle Tags angezeigt, nicht mehr als klickbare Buttons.

4. Buttons – „Trainieren" → „Karteikarten erstellen", zweiten „Karteikarten"-Button entfernen. Wird gemacht.

Sektion „Stärken":
1. Fachname bei Stärken – Ja, genau. Der KI-Entwickler muss auch bei topStrengths[] ein subject-Feld mitliefern. Gleiche Backend-Anforderung wie bei den Schwächen.

Tab 2: „Lernfortschritt"
Gesamtfortschritt
Ja, gleiche Sache wie Tab 1 – muss direkt overallProgress aus der API sein, nicht Frontend-berechnet.

„Aufmerksamkeit nötig" Label
Guter Punkt. Das Problem: Der StatusBadge im Accordion-Header heißt schon „Aufmerksamkeit" (von status: 'needs-attention'), und dann steht im Body nochmal „AUFMERKSAMKEIT NÖTIG" als Label für die needsAttention[]-Chips. Das ist doppelt und verwirrend.

→ Vorschlag: Das Label im Body umbenennen zu „Nachholbedarf" oder „Lücken" – das beschreibt klarer, dass das die konkreten Themen sind die hinterherhinken, ohne das Wort „Aufmerksamkeit" zu wiederholen.

„Bevorstehend" Label
Stimmt, das ist zu vage für Schüler. „Bevorstehend" sagt nicht was damit gemeint ist. Die API liefert upcoming[] – das sind die nächsten Themen im Lehrplan die noch kommen.

→ Vorschlag: „Kommt als Nächstes" oder „Nächste Themen" – das ist sofort verständlich für einen Schüler.

„12 Versuche"
Die API liefert attempts: 28 pro Topic. Das bedeutet: wie oft der Schüler dieses Thema bearbeitet hat – also wie viele Karteikarten-Sessions, Übungen, Tests etc. zu diesem Thema absolviert wurden. Aber „Versuche" klingt tatsächlich komisch, als hätte man was falsch gemacht.

→ Vorschlag: „12× geübt" oder „12 Übungen" – das ist motivierender und klarer.

Tab 3: „KI-Prognose"
„2 Dringende Aktionen"
urgentActions: 2 aus der API bedeutet: Es gibt 2 Themen wo SOFORT gehandelt werden muss – das korreliert direkt mit weaknesses.criticalCount: 2 (die 2 kritischen Schwächen). Die API sagt damit: „Von allen 8 Schwächen sind 2 so dringend, dass der Schüler jetzt handeln sollte."

→ Für den Schüler könnte das klarer formuliert werden als: „2 Themen brauchen deine Aufmerksamkeit" oder man verbindet es visuell mit den kritischen Schwächen darunter. Aktuell steht die Zahl „2" isoliert da ohne dass der Schüler versteht was genau die 2 sind.

RadarChart
Einverstanden – bleibt als Platzhalter bis eine dedizierte API existiert. (Könnte theoretisch aus Endpoint 1 subjects.*.progress berechnet werden, aber das ist kein offizieller API-Endpunkt dafür.)

Kritische Schwächen + Zukünftige Risiken
Gleiche Änderungen wie Tab 1:

Play-Icons entfernen, criticalActions nur visuell
„Trainieren" / „Vorbereiten" → „Karteikarten erstellen"
Zweiten „Karteikarten"-Button entfernen
Tab 4: „Leistung"
Sektion „Datenquellen" – Was haben wir hier gemacht?
Ganz ehrlich: Das ist komplett Frontend-erfunden. Die API für Endpoint 4 (unified-performance) erwähnt in der Beschreibung, dass sie Daten aus 4 Quellen kombiniert (Karteikarten, Prüfungssimulationen, Hausaufgaben, Chat). Aber die API liefert kein eigenes Feld mit einer Aufschlüsselung wie „18 Karteikarten-Einträge, 12 Prüfungen" etc.

Was die API tatsächlich liefert sind recentActivities mit 3 Arrays: submissions[], flashcardSessions[], examResults[]. Die Anzahl der Items in diesen Arrays wäre die echte Zahl – nicht unsere hardcoded 18/12/9/6.

→ Problem: Unsere „Datenquellen" zeigen falsche Zahlen und behaupten 4 Quellen (inkl. „Chat-Interaktionen"), aber die API liefert nur 3 Activity-Typen. Dazu gleich mehr bei deinem Aktivitätsfeed-Punkt.

BarChart „Wöchentliche Lernzeit"
Gute Frage. Das muss klar definiert werden – was zählt als Lernzeit? Optionen:

(A) App-Öffnungszeit (ungenau, Schüler kann auch nur rumklicken)
(B) Aktive Interaktionszeit (Karteikarten durchgehen, Quiz beantworten, Chat nutzen)
(C) Session-basiert (jede begonnene Lerneinheit hat eine Dauer)
→ Empfehlung: (B) – Tatsächliche Interaktionen. Wenn der Schüler 15 Min Karteikarten macht, 20 Min Quiz – das zählt. Nur App offen haben nicht. Das muss aber im Backend getrackt werden und braucht vermutlich einen eigenen Endpoint den es aktuell nicht gibt.

Sektion „Aktivitätsfeed" + Datenquellen-Zusammenhang
Du hast den Kern des Problems erkannt. Lass mich das klar aufschlüsseln:

Element	Echte API-Quelle	Problem
KPI „45 Aktivitäten"	✅ summary.totalActivities	Korrekt, kommt von API
Aktivitätsfeed (Items)	✅ recentActivities.*	Korrekt, 3 Arrays aus API
Datenquellen-Grid	❌ Frontend-erfunden	Zeigt falsche Zahlen
Die „Datenquellen" so wie sie jetzt sind, sind irreführend – sie tun so als wären sie eine Aufschlüsselung der API-Quellen, sind aber hardcoded.

→ Lösung: Wir haben zwei Optionen:

(A) Datenquellen-Sektion entfernen – weil die Info nicht von der API kommt und falsche Zahlen zeigt.

(B) Datenquellen-Sektion umbauen zu „Aktivitäten nach Typ" – und die echten Counts aus recentActivities nehmen:

Karteikarten: flashcardSessions.length
Prüfungen: examResults.length
Abgaben: submissions.length
Das wäre dann konsistent mit dem Aktivitätsfeed und der API. „Chat-Interaktionen" müssten raus, weil die API das nicht als separaten Activity-Typ liefert.

Sektion „Querschnittanalyse" – Text
Der aktuelle Text ist: „Basierend auf Querschnittanalyse aller Datenquellen"

Das ist grammatisch tatsächlich korrekt – „Querschnittanalyse aller Datenquellen" ist ein zusammenhängender Begriff (= „die Analyse QUER über alle Datenquellen"). Mit „und" dazwischen würde es heißen „Querschnittanalyse UND aller Datenquellen", was zwei getrennte Dinge wären und keinen Sinn ergibt.

→ Aber: Wenn es sich für dich holprig liest, können wir es umformulieren zu: „Basierend auf der Analyse aller Datenquellen" – einfacher, klarer, gleiche Bedeutung.

Zusammenfassung: Was muss ich jetzt im Code ändern?
Sofort umsetzbar:

✅ Play-Icons bei criticalActions entfernen → nur visuelle Tags
✅ „Trainieren" / „Vorbereiten" → „Karteikarten erstellen"
✅ Zweite „Karteikarten"-Buttons überall entfernen
✅ „Aufmerksamkeit nötig" → „Nachholbedarf" (oder Alternative)
✅ „Bevorstehend" → „Nächste Themen"
✅ „X Versuche" → „X× geübt"
✅ Querschnittanalyse-Text anpassen
Braucht deine Entscheidung:

Datenquellen-Sektion: Entfernen (A) oder zu „Aktivitäten nach Typ" umbauen (B)?
„2 Dringende Aktionen": Umformulieren zu „2 Themen brauchen deine Aufmerksamkeit"?
Sag mir wie du dich entscheidest, dann setze ich alles auf einmal um.