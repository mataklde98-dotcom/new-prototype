1. Tab 2: "Lernfortschritt"
→ Vorschlag: Das Label im Body umbenennen zu „Nachholbedarf" oder „Lücken" – das beschreibt klarer, dass das die konkreten Themen sind die hinterherhinken, ohne das Wort „Aufmerksamkeit" zu wiederholen.  <- Hier nehmen wir dann das Label "Lücken" das klingt gut!


2. „Bevorstehend" Label
Stimmt, das ist zu vage für Schüler. „Bevorstehend" sagt nicht was damit gemeint ist. Die API liefert upcoming[] – das sind die nächsten Themen im Lehrplan die noch kommen.
→ Vorschlag: „Kommt als Nächstes" oder „Nächste Themen" – das ist sofort verständlich für einen Schüler.  <- Hier können wir "Nächste relevante Themen" nehmen, falls das sinn macht?

3. „12 Versuche"
Die API liefert attempts: 28 pro Topic. Das bedeutet: wie oft der Schüler dieses Thema bearbeitet hat – also wie viele Karteikarten-Sessions, Übungen, Tests etc. zu diesem Thema absolviert wurden. Aber „Versuche" klingt tatsächlich komisch, als hätte man was falsch gemacht.
→ Vorschlag: „12× geübt" oder „12 Übungen" – das ist motivierender und klarer.  <- Hier würde ich tatsächlich die Variante "12x geübt" bevorzugen, versteht man sofort

4. Tab 3: „KI-Prognose"
„2 Dringende Aktionen"
urgentActions: 2 aus der API bedeutet: Es gibt 2 Themen wo SOFORT gehandelt werden muss – das korreliert direkt mit weaknesses.criticalCount: 2 (die 2 kritischen Schwächen). Die API sagt damit: „Von allen 8 Schwächen sind 2 so dringend, dass der Schüler jetzt handeln sollte."
→ Für den Schüler könnte das klarer formuliert werden als: „2 Themen brauchen deine Aufmerksamkeit" oder man verbindet es visuell mit den kritischen Schwächen darunter. Aktuell steht die Zahl „2" isoliert da ohne dass der Schüler versteht was genau die 2 sind. <- Welche Variante macht mehr Sinn hier ? Lass uns die nehmen die mehr Sinn macht

5. Tab 4: „Leistung"
Sektion „Datenquellen" – Was haben wir hier gemacht?
Ganz ehrlich: Das ist komplett Frontend-erfunden. Die API für Endpoint 4 (unified-performance) erwähnt in der Beschreibung, dass sie Daten aus 4 Quellen kombiniert (Karteikarten, Prüfungssimulationen, Hausaufgaben, Chat). Aber die API liefert kein eigenes Feld mit einer Aufschlüsselung wie „18 Karteikarten-Einträge, 12 Prüfungen" etc.
Was die API tatsächlich liefert sind recentActivities mit 3 Arrays: submissions[], flashcardSessions[], examResults[]. Die Anzahl der Items in diesen Arrays wäre die echte Zahl – nicht unsere hardcoded 18/12/9/6.
→ Problem: Unsere „Datenquellen" zeigen falsche Zahlen und behaupten 4 Quellen (inkl. „Chat-Interaktionen"), aber die API liefert nur 3 Activity-Typen. Dazu gleich mehr bei deinem Aktivitätsfeed-Punkt.  <- Dann lass uns die 3 tatsächlichen aus der API doch nutzen... Also wir nehmen Option B -> Aktivitätsfeed (Items)	✅ recentActivities.*	Korrekt, 3 Arrays aus API
Datenquellen-Grid	❌ Frontend-erfunden	Zeigt falsche Zahlen
Die „Datenquellen" so wie sie jetzt sind, sind irreführend – sie tun so als wären sie eine Aufschlüsselung der API-Quellen, sind aber hardcoded.

→ Lösung: Wir haben zwei Optionen:

(A) Datenquellen-Sektion entfernen – weil die Info nicht von der API kommt und falsche Zahlen zeigt.

(B) Datenquellen-Sektion umbauen zu „Aktivitäten nach Typ" – und die echten Counts aus recentActivities nehmen:

Karteikarten: flashcardSessions.length
Prüfungen: examResults.length
Abgaben: submissions.length

6. Sektion „Querschnittanalyse" – Text
Der aktuelle Text ist: „Basierend auf Querschnittanalyse aller Datenquellen"

Das ist grammatisch tatsächlich korrekt – „Querschnittanalyse aller Datenquellen" ist ein zusammenhängender Begriff (= „die Analyse QUER über alle Datenquellen"). Mit „und" dazwischen würde es heißen „Querschnittanalyse UND aller Datenquellen", was zwei getrennte Dinge wären und keinen Sinn ergibt.

→ Aber: Wenn es sich für dich holprig liest, können wir es umformulieren zu: „Basierend auf der Analyse aller Datenquellen" – einfacher, klarer, gleiche Bedeutung. <- Ich würde hier tatsächlich Basierend auf der Analyse aller Datenquellen nehmen