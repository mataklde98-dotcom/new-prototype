Tab 1: "Übersicht"
1. 71% Gesamt-KPI -> denke ich sollte eigentlich von der API kommen aus overallProgress.. oder ? Der Overall Progress ist das nicht der Gesamtfortschritt basierend auf alles was die API vorsieht ?

GET
/v1/curriculum/learning-progress/:userId
Auth

"success": true,
"userId": "user
123"
_
,
"overallProgress": 65,
"subjects": {
"Mathematik": {
"progress": 70,
"curriculumProgress": {
"coveragePercent": 45,
"status": "developing"
,
"needsAttention": ["Quadratische Gleichungen"],
"upcoming": ["Trigonometrie"]
},
"topics": {
"Algebra
_
Gleichungen": {
"averageScore": 72,
"attempts": 28,
"trend": "improving"
}
}
}
}
}

Sektion "Top Schwächen":
1. Das SeverityBadge also die severity kommt ja von der API, das ist ja auch korrekt so. Du hast dir dann wahrscheinlich Namen dafür ausgedacht wie Kritisch, Achtung usw. korrekt ? Dann passt das ja und kann unverändert bleiben.


2. Mathematik Subtitel existiert nicht in der API sagst du, das wäre aber wichtig, damit wir auch immer wissen zu welchem Fach das gehört richtig ? Statt dass dies der Frontend macht, sollte ja diese Info aus der API kommen?

3. Das Play-Icon können wir entfernen und die sollen nicht anklickbar sein nur visuell angezeigt

4. Trainieren Button kann zu "Karteikarten erstellen" geändert werden, und das zweite Karteikarten Button kann man entfernen.

Sektion Stärken:
1. Dann muss der KI Entwickler hier auch den jeweiligen Stärken ein Fachnamen vergeben richtig?


Tab 2: "Lernfortschritt"
Gesamtfortschritt muss halt auch wie bei Tab 1 wohl aus overallProgress entnommen werden, denke ich, sind ja die selben.

Fächerübersicht - Accordion Body:
Das Label "Aufmerksamkeit" nötig, passt das da rein? Weil es gibt auch das Status "Aufmerksamkeit, Auf Kurs, Gefährdet" usw. und bei allen steht immer Aufmerksamkeit nötig, aber es gibt bereits ein Titel mit "Aufmerksamkeit", sollten wir nicht ein anderes Label nehmen statt "Aufmerksamkeit notwendig" oder denkst du nein es passt schon so gut.

Wir haben ein Label namens "Bevorstehend" aber passt das auch zu unserem Konzept kann der schüler mit dem Begriff bevorstehend etwas anfangen oder sollten wir dafür ein zielorientierteres begriff nehmen? Weil ich könnte mit dem Begriff als schüler nichts anfangen

12 Versuche -> Was hat er versucht in der API Dokumentation damit zu sagen ? Was sollte das heißen, mit dieser Begrifflichkeit kann der Schüler nichts anfangen


Tab 3: "KI-Prognose"
"2" Dringende Aktionen Zahl kommt von der API, aber was kann der Schüler an dieser Stelle mit der Begrifflichkeit denn anfangen ? Was kann er sich daraus ableiten worauf ist das bezogen? Ist das auf die kritischen Schwächen bezogen ?

RadarChart (Fächerprofil):
Hier fehlt noch die komplette API, das behalten wir erstmal nur als Platzhalter

Sektion "Kritische Schwächen":
Auch hier kann das Play Button entfernt werden und die Felder nicht anklickbar sein nur visuell angezeigt werden...

Auch hier den Button "Trainieren" zu "Karteikarten erstellen" umändern und das zweite Karteikarten Button entfernen

Sektion "Zukünftige Risiken"
Auch hier "Vorbereiten" mit "Karteikarten erstellen" ersetzen und den zweiten "Karteikarten" Button entfernen

Tab 4: Sektion "Datenquellen":
Grid komplett (4 Karten), hier sagst du dataSources API Frontend erwähnt Quellen nur in Beschreibung, liefert kein Feld... Was soll das bedeuten also was haben wir hier gemacht? Auch bei Karteikarten / Prüfungssimulationen etc. was haben wir hier gemacht und auch 18 Einträge, 12 Einträge diese Zahlen die wir Hardcoded gemacht haben im Frontend.. Ich finde das eine super Idee mit Datenquellen, aber in wie fern stimmt das jetzt mit den Aktivitäten überein die durch die API kommen? Lies weiter in unseren Notizen bei "Sektion Aktivitätsfeed":" da gehe ich näher auf diese Sache ein

BarChart "Wöchentliche Lernzeit":
Das können wir ja easy mit Frontend trocken, wichtig ist nur zu wissen "was" genau soll als Lernzeit getrackt werden? Das bloße öffnen der App wie lange die App offen war oder tatsächliche Interaktionen?

Sektion "Aktivitätsfeed":
Ich denke diese hängen mit den Aktivitäten die der API vorgesehen hat zusammen, aber das passt ja nicht mehr mit unseren Datenquellen dann zusammen die wir nur mit unserem Frontend trocken.. Wie ich verstehe gibt es hier oben die Gesamtaktivitäten anzeige der mit dem Aktivitätsfeed zusammenhängt was durch die API vorgesehen ist, aber die Datenquellen die wir nutzen sind nicht die tatsächlichen Datenquellen wie ich verstanden habe.. Falls das korrekt ist, brauchen wir für die Datenquellen einfach nur einen anderen Titel wie Interaktionen oder sowas ?

Sektion "Querschnittanalyse":
Der Statische Text Querschnittanalyse aller Datenquellen fehlt da nicht ein "und" dazwischen ? Also Basierend auf Querschnittanalyse und aller Datenquellen ?
