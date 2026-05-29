Redesign: Referral-System und "Mein Tarif" von Gratis-Monate auf KI-Credits umbauen
Betroffene Screens:

Profil → Mein Tarif (kompletter Umbau)
Home-Screen (Referral-Bereich ersetzen)


KONTEXT: Das neue Credit-System
Die Plattform wird auf ein KI-Credit-System umgestellt. Jede Nutzung von KI-Funktionen verbraucht Credits. Nutzer erhalten Credits durch ihren gewählten Abo-Plan und können zusätzlich kostenlose Credits verdienen – durch Referrals und durch Interaktion mit Aufgaben auf der Plattform. Es gibt KEINE kostenlosen Monate mehr. Alles basiert auf Credits.

SCREEN 1: Profil → "Mein Tarif" (kompletter Umbau)
Der gesamte Screen "Mein Tarif" muss neu strukturiert werden. Folgende Bereiche von oben nach unten:

Bereich 1: Mein Plan (ersetzt "KI-Funktionen")
Zeigt den aktuell gewählten Abo-Plan des Nutzers an.
Inhalte:

Name des Plans (z.B. "Pro Plan", "Max Plan") als Titel
Badge "Aktiv" in Grün (wie bisher)
Kurzbeschreibung was der Plan beinhaltet (z.B. "500 KI-Credits / Monat")
Link "Plan verwalten →" zum Wechseln oder Kündigen des Plans


Bereich 2: Meine KI-Credits (NEU – zentraler Bereich)
Zeigt dem Nutzer auf einen Blick wie viele Credits er insgesamt hat und wie sich diese zusammensetzen.
Inhalte:

Große Zahl: Gesamte verfügbare Credits (z.B. "743 Credits verfügbar")
Fortschrittsbalken oder visuelle Anzeige: Wie viele von den monatlichen Plan-Credits bereits verbraucht sind (z.B. "257 / 500 Plan-Credits diesen Monat verbraucht")
Darunter eine Aufschlüsselung der Credit-Quellen als kleine Auflistung:

"Plan-Credits: 243 übrig (von 500 diesen Monat)"
"Referral-Credits: 300 (kostenlos verdient)"
"Aktivitäts-Credits: 200 (durch Aufgaben verdient)"



Wichtiger Hinweis im UI:
Ein kleiner Info-Text oder Tooltip: "Deine kostenlosen Credits (Referral + Aktivitäten) verfallen nicht und bleiben erhalten. Bei deiner nächsten Zahlung kommen deine monatlichen Plan-Credits oben drauf – deine gesammelten Gratis-Credits gehen nicht verloren."

Bereich 3: Freunde einladen – Credits verdienen (ersetzt das alte Referral)
Gleiche Card-Struktur wie bisher, aber komplett auf Credits umgestellt.
Inhalte:

Überschrift: "Freunde einladen" mit Untertitel "Gratis Credits verdienen"
Text: "Lade 3 Freunde ein und erhalte [X] Credits kostenlos." (wobei [X] ein Platzhalterwert ist, z.B. 100)
Fortschrittsanzeige: "Einladungen 2 / 3" mit Fortschrittsbalken (wie bisher)
Hinweis: "Einladungen zählen erst, wenn sich deine Freunde registrieren." (wie bisher)
Buttons: "Einladen" und "Link" (wie bisher, gleicher Stil)


Bereich 4: Verdiente Gratis-Credits (ersetzt "Kostenlose Monate")
Zeigt dem Nutzer eine Übersicht aller kostenlos verdienten Credits und deren Herkunft.
Inhalte:

Überschrift: "Verdiente Gratis-Credits"
Gesamtzahl groß angezeigt (z.B. "500 Credits verdient")
Darunter aufgeteilt in zwei Kategorien mit Icons:
Kategorie A: Durch Referrals

Anzahl Credits die durch Einladungen verdient wurden
Zeitraum wann diese verdient wurden (z.B. "300 Credits · seit Oktober 2025")

Kategorie B: Durch Aktivitäten

Anzahl Credits die durch Interaktion mit Aufgaben auf der Plattform verdient wurden
Zeitraum wann diese verdient wurden (z.B. "200 Credits · seit November 2025")




Bereich 5: Abo Status (überarbeitet)
Inhalte:

"Nächste Zahlung:" mit Datum (z.B. "10.04.2026")
"Preis:" mit Betrag (z.B. "4,99 € / Monat")
"Nächste Credits:" mit Menge (z.B. "+500 Plan-Credits am 10.04.2026")
Info-Text: "Bei der nächsten Zahlung werden deine monatlichen Plan-Credits aufgeladen. Deine gesammelten Gratis-Credits bleiben bestehen und werden nicht zurückgesetzt."

ENTFERNEN: Den alten Text "Deine gesammelten Gratis-Monate werden automatisch nach Ablauf des aktuellen Abrechnungszeitraums als Gutschrift angewendet" – dieser existiert nicht mehr.

SCREEN 2: Home-Screen – Referral-Bereich ersetzen
Auf dem Home-Screen gibt es aktuell einen Bereich "Freunde einladen" mit der Anzeige gesammelter Gratis-Monate und den Buttons "Einladen" und "Link". Dieser muss umgebaut werden.
Altes Design entfernen:

"Kostenlose Monate" mit den Kreis-Indikatoren (2 Monate gesammelt, maximal 12) → KOMPLETT ENTFERNEN

Neues Design:
Card 1: Freunde einladen (überarbeitet)

Überschrift: "Freunde einladen" mit Untertitel "Gratis Credits verdienen"
Text: "Lade 3 Freunde ein und erhalte [X] Credits kostenlos."
Fortschrittsanzeige: "Einladungen 2 / 3" mit Fortschrittsbalken
Hinweis: "Einladungen zählen erst, wenn sich deine Freunde registrieren."
Buttons: "Einladen" und "Link" (gleicher Stil wie bisher)

Card 2: Meine Credits (Kurzübersicht für Home)

Kompakte Anzeige: "[X] Credits verfügbar" als prominente Zahl
Kleiner Fortschrittsbalken der zeigt wie viele Plan-Credits diesen Monat noch übrig sind
Link: "Details anzeigen →" der zu Profil → Mein Tarif navigiert


ZUSAMMENFASSUNG – Was entfernt wird:
AltNeu"KI-Funktionen: Aktiv""Mein Plan: [Planname] – Aktiv"Referral gibt Gratis-MonateReferral gibt Gratis-Credits"Kostenlose Monate: 2 gesammelt, max 12""Verdiente Gratis-Credits: [X] – aufgeteilt nach Referral und Aktivitäten"12 Kreis-Indikatoren für MonateEntfällt komplettAbo-Status mit Gratis-Monate-Gutschrift-TextAbo-Status mit nächsten Plan-Credits und Hinweis dass Gratis-Credits bestehen bleibenHome: Kostenlose-Monate-CardHome: Meine-Credits-Kurzübersicht
Was gleich bleibt:

"Einladen" und "Link" Buttons (gleicher Stil)
Fortschrittsbalken für Einladungen (gleicher Stil)
Gesamtes visuelles Design-System (Farben, Typografie, Card-Styles, Dark Theme)