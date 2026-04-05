🔵 Tab 1: „Übersicht" → Endpoint 2 (profile-overview)
Hero-Card (Status Snapshot)
Element	Quelle	Detail
Grünes Gradient-Icon (TrendingUp)	🟠 Frontend	Statisches Icon
„Gesamttrend: Aufsteigend"	🟠 Frontend	Hardcoded Text
„+7% in den letzten 4 Wochen"	🟠 Frontend	Hardcoded Text
71% Gesamt-KPI	🟠 Frontend	Berechnet: Durchschnitt aller MOCK_SUBJECTS.progress
Label „Gesamt"	🟠 Frontend	Statisches Label
2 Kritisch-KPI	🟠 Frontend	Berechnet: .filter(severity === 'critical').length
Label „Kritisch"	🟠 Frontend	Statisches Label
„Gut" Datenqualität-Wert	✅ API	dataQuality.label (bzw. dataQuality.status → gemappt)
Farbe der Datenqualität (grün/gelb/rot)	✅ API	Abgeleitet von dataQuality.status
„Datenqualität (4 Quellen)"	🟠 Frontend	Label statisch, 4 kommt aus dataQuality.sources → ✅ API
Zap-Icon	🟠 Frontend	Statisches Icon
„Jetzt Schwächen trainieren" Button	🟠 Frontend	Statischer CTA-Button, keine API-Daten
Sektion „Top Schwächen"
Element	Quelle	Detail
AlertTriangle-Icon	🟠 Frontend	Statisches Icon
„TOP SCHWÄCHEN" Section-Titel	🟠 Frontend	Statisches Label
„Quadratische Funktionen" Topic-Name	✅ API	topWeaknesses[].topic
SeverityBadge „Kritisch"/„Achtung"/„Mittel"	✅ API	topWeaknesses[].severity
„Mathematik" Fach-Subtitle	🟠 Frontend	subject – existiert NICHT in API-Response
ScoreRing 28	✅ API	topWeaknesses[].score
AlertTriangle + „Dringend Handlung erforderlich"	🟠 Frontend	Statischer Text, wird gezeigt wenn severity === 'critical'
„Scheitelpunktform und Nullstellen..." Empfehlung	✅ API	topWeaknesses[].recommendation
„EMPFOHLENE AKTIONEN" Label	🟠 Frontend	Statisches Label
Play-Icon vor jeder Aktion	🟠 Frontend	Statisches Icon
„Grundlagen-Quiz wiederholen" Action-Text	✅ API	topWeaknesses[].criticalActions[0]
„Übungsblatt Scheitelpunktform" Action-Text	✅ API	topWeaknesses[].criticalActions[1]
„Trainieren" Button	🟠 Frontend	Statischer Button, keine API-Daten
„Karteikarten" Button	🟠 Frontend	Statischer Button, keine API-Daten
Sektion „Stärken"
Element	Quelle	Detail
Award-Icon	🟠 Frontend	Statisches Icon
„STÄRKEN" Section-Titel	🟠 Frontend	Statisches Label
„Lineare Gleichungen" Topic-Name	✅ API	topStrengths[].topic (Struktur angenommen)
„Mathematik" Fach-Subtitle	⚠️ Unklar	API gibt topStrengths: [] – Felder unbekannt
ScoreRing 94	✅ API	topStrengths[].score (Struktur angenommen)
🟢 Tab 2: „Lernfortschritt" → Endpoint 1 (learning-progress)
Gesamtfortschritt-Card
Element	Quelle	Detail
„Gesamtfortschritt" Titel	🟠 Frontend	Statisches Label
TrendingUp-Icon + „+5%"	🟠 Frontend	Hardcoded Trend-Badge
Gradient-Progressbar Breite	✅ API	overallProgress (aktuell Frontend-berechnet aus Subjects)
„71% abgeschlossen"	✅ API	overallProgress
AreaChart (KW 5 – KW 10)	🟠 Frontend	TREND_DATA – kein API-Endpoint liefert wöchentliche History
Chart X-Achse Labels (KW 5, KW 6...)	🟠 Frontend	Hardcoded
Chart Y-Werte (58, 61, 59, 65, 68, 72)	🟠 Frontend	Hardcoded
Chart Tooltip Styling	🟠 Frontend	Statisches Styling
Sektion „Fächerübersicht" – Accordion Headers
Element	Quelle	Detail
BookOpen-Icon	🟠 Frontend	Statisches Icon
„FÄCHERÜBERSICHT" Section-Titel	🟠 Frontend	Statisches Label
„Mathematik" Fach-Name	✅ API	subjects Object-Key
StatusBadge „Auf Kurs"/„Aufmerksamkeit"/„Gefährdet"	✅ API	subjects.*.curriculumProgress.status
„Fortschritt 68%"	✅ API	subjects.*.progress
• Trennpunkt	🟠 Frontend	Statisch
„Abdeckung 72%"	✅ API	subjects.*.curriculumProgress.coveragePercent
ScoreRing 68 (Mini)	✅ API	subjects.*.progress
ChevronDown-Icon (Expand/Collapse)	🟠 Frontend	UI-Interaktion
Fächerübersicht – Accordion Body (expanded)
Element	Quelle	Detail
„AUFMERKSAMKEIT NÖTIG" Label	🟠 Frontend	Statisches Label
„Quadratische Fkt." gelber Chip	✅ API	subjects.*.curriculumProgress.needsAttention[]
„Stochastik" gelber Chip	✅ API	subjects.*.curriculumProgress.needsAttention[]
„Trigonometrie" gelber Chip	✅ API	subjects.*.curriculumProgress.needsAttention[]
„BEVORSTEHEND" Label	🟠 Frontend	Statisches Label
„Integralrechnung" grauer Chip	✅ API	subjects.*.curriculumProgress.upcoming[]
„Vektoren" grauer Chip	✅ API	subjects.*.curriculumProgress.upcoming[]
„Matrizenrechnung" grauer Chip	✅ API	subjects.*.curriculumProgress.upcoming[]
ScoreRing 94 (Topic-Score)	✅ API	subjects.*.topics.*.averageScore
„Lineare Gleichungen" Topic-Name	✅ API	subjects.*.topics Object-Key
„12 Versuche"	✅ API	subjects.*.topics.*.attempts
TrendIcon ↑	✅ API	subjects.*.topics.*.trend
„Versuche" Text-Suffix	🟠 Frontend	Statisches Label
„Üben" Button	🟠 Frontend	Statischer Button
🟣 Tab 3: „KI-Prognose" → Endpoint 3 (profile-prognosis)
Prognose Überblick Card
Element	Quelle	Detail
Lila Gradient-Icon (Brain)	🟠 Frontend	Statisches Icon
„KI-Analyse" Titel	🟠 Frontend	Statisches Label
„Basierend auf deinen Lernmustern" Subtitle	🟠 Frontend	Statischer Text
TrendIcon (dynamisch ↑/→/↓)	✅ API	overallSummary.trend
„Aufsteigend" Trend-Label	✅ API	Gemappt aus overallSummary.trend
Trend-Farbe (grün/gelb/rot)	✅ API	Abgeleitet von overallSummary.trend
„Gesamttrend" Label	🟠 Frontend	Statisches Label
„2" Dringende Aktionen Zahl	✅ API	overallSummary.urgentActions
„Dringende Aktionen" Label	🟠 Frontend	Statisches Label
„8" Schwächen-Zahl	✅ API	weaknesses.totalCount
„Schwächen" Label	🟠 Frontend	Statisches Label
„2 kritisch" Subtext	✅ API	weaknesses.criticalCount
„5" Stärken-Zahl	✅ API	strengths.totalCount
„Stärken" Label	🟠 Frontend	Statisches Label
„3" Risiken-Zahl	✅ API	futureRisks.totalCount
„Risiken" Label	🟠 Frontend	Statisches Label
„1 kritisch" Subtext	✅ API	futureRisks.criticalCount
RadarChart (Fächerprofil)
Element	Quelle	Detail
„Fächerprofil" Titel	🟠 Frontend	Statisches Label
RadarChart komplett	🟠 Frontend	RADAR_DATA – kein API-Endpoint
Achsen-Labels (Mathe, Deutsch...)	🟠 Frontend	Hardcoded
Score-Werte (68, 74, 82...)	🟠 Frontend	Hardcoded (könnte aus Endpoint 1 subjects.*.progress berechnet werden)
Sektion „Kritische Schwächen"
Element	Quelle	Detail
AlertTriangle-Icon	🟠 Frontend	Statisches Icon
„KRITISCHE SCHWÄCHEN" Section-Titel	🟠 Frontend	Statisches Label
Topic, Score, Severity, Recommendation, criticalActions	✅ API	weaknesses.items[] (gleiche Felder wie Endpoint 2)
AlertTriangle + „Dringend Handlung erforderlich"	🟠 Frontend	Statischer Text bei severity === 'critical'
„EMPFOHLENE AKTIONEN" Label	🟠 Frontend	Statisches Label
Play-Icon	🟠 Frontend	Statisches Icon
Action-Texte	✅ API	weaknesses.items[].criticalActions[]
„Mathematik" Fach-Subtitle	🟠 Frontend	subject nicht in API
„Trainieren" / „Karteikarten" Buttons	🟠 Frontend	Statische Buttons
Sektion „Zukünftige Risiken"
Element	Quelle	Detail
Flame-Icon	🟠 Frontend	Statisches Icon
„ZUKÜNFTIGE RISIKEN (3)" – die 3	✅ API	futureRisks.totalCount
„Stochastik" Topic-Name	✅ API	futureRisks.items[].topic
RiskBadge „Hoch"/„Mittel"/„Gering"	✅ API	futureRisks.items[].risk
„Mathematik" Fach-Subtitle	🟠 Frontend	subject nicht in API
„Klausur in 2 Wochen, Score..." Reason	✅ API	futureRisks.items[].reason
„Vorbereiten" Button	🟠 Frontend	Statischer Button
„Karteikarten" Button	🟠 Frontend	Statischer Button
🟡 Tab 4: „Leistung" → Endpoint 4 (unified-performance)
KPI-Grid (4 Cards)
Element	Quelle	Detail
Activity-Icon (lila)	🟠 Frontend	Statisches Icon
„45" Aktivitäten	✅ API	summary.totalActivities
„Aktivitäten" Label	🟠 Frontend	Statisches Label
Target-Icon (grün)	🟠 Frontend	Statisches Icon
„72%" Ø Leistung	✅ API	summary.averagePerformance
„Ø Leistung" Label	🟠 Frontend	Statisches Label
Award-Icon (gelb)	🟠 Frontend	Statisches Icon
„Englisch" Stärkstes Fach	✅ API	summary.strongestSubject
„Stärkstes Fach" Label	🟠 Frontend	Statisches Label
AlertTriangle-Icon (rot)	🟠 Frontend	Statisches Icon
„Biologie" Schwächstes Fach	✅ API	summary.weakestSubject
„Schwächstes Fach" Label	🟠 Frontend	Statisches Label
Leistungstrend-Card
Element	Quelle	Detail
TrendIcon (dynamisch)	✅ API	summary.trend
Icon-Hintergrundfarbe	✅ API	Abgeleitet von summary.trend
„Leistungstrend" Titel	🟠 Frontend	Statisches Label
„Über alle Datenquellen hinweg" Subtitle	🟠 Frontend	Statischer Text
„Aufsteigend" Trend-Label	✅ API	Gemappt aus summary.trend
Label-Farbe (grün/gelb/rot)	✅ API	Abgeleitet von summary.trend
Sektion „Datenquellen"
Element	Quelle	Detail
Database-Icon	🟠 Frontend	Statisches Icon
„DATENQUELLEN" Section-Titel	🟠 Frontend	Statisches Label
Grid komplett (4 Karten)	🟠 Frontend	dataSources – API erwähnt Quellen nur in Beschreibung, liefert kein Feld
Icons pro Quelle (Layers/Target/FileText/MessageSquare)	🟠 Frontend	Statische Icon-Map
„Karteikarten" / „Prüfungssimulationen" etc.	🟠 Frontend	Hardcoded Labels
„18 Einträge" / „12 Einträge" etc.	🟠 Frontend	Hardcoded Zahlen
BarChart „Wöchentliche Lernzeit"
Element	Quelle	Detail
„Wöchentliche Lernzeit" Titel	🟠 Frontend	Statisches Label
BarChart komplett	🟠 Frontend	WEEKLY_ACTIVITY_DATA – kein API-Endpoint
X-Achse (Mo–So)	🟠 Frontend	Hardcoded
Y-Werte (45, 30, 60...)	🟠 Frontend	Hardcoded
Tooltip „X Min Lernzeit"	🟠 Frontend	Statisches Format
Sektion „Aktivitätsfeed"
Element	Quelle	Detail
Clock-Icon	🟠 Frontend	Statisches Icon
„AKTIVITÄTSFEED" Section-Titel	🟠 Frontend	Statisches Label
Farbiges Icon (grün/orange/lila) pro Typ	🟠 Frontend	Statische Icon-Map basierend auf type
„Lineare Gleichungen" Activity-Titel	✅ API	recentActivities.*.title (Feldname angenommen)
„Mathematik" Fach	✅ API	recentActivities.*.subject (Feldname angenommen)
• Trennpunkte	🟠 Frontend	Statisch
„2026-03-02" Datum	✅ API	recentActivities.*.date (Feldname angenommen)
„15 Min" Dauer	✅ API	recentActivities.*.duration (Feldname angenommen)
ScoreRing 94	✅ API	recentActivities.*.score (Feldname angenommen)
Sektion „Querschnittanalyse"
Element	Quelle	Detail
Lightbulb-Icon	🟠 Frontend	Statisches Icon
„QUERSCHNITTANALYSE" Section-Titel	🟠 Frontend	Statisches Label
„Konstante Schwächen" Label	🟠 Frontend	Statisches Label
„Quadratische Funktionen" roter Chip	✅ API	crossSourceAnalysis.consistentWeaknesses[]
„Zellatmung" roter Chip	✅ API	crossSourceAnalysis.consistentWeaknesses[]
„Passé Composé" roter Chip	✅ API	crossSourceAnalysis.consistentWeaknesses[]
„Konstante Stärken" Label	🟠 Frontend	Statisches Label
„Lineare Gleichungen" grüner Chip	✅ API	crossSourceAnalysis.consistentStrengths[]
„Vokabular B2" grüner Chip	✅ API	crossSourceAnalysis.consistentStrengths[]
„Erörterung" grüner Chip	✅ API	crossSourceAnalysis.consistentStrengths[]
Brain-Icon (lila)	🟠 Frontend	Statisches Icon
„Ausgewogener Lernstil"	✅ API	crossSourceAnalysis.learningStyle
„Basierend auf Querschnittanalyse aller Datenquellen"	🟠 Frontend	Statischer Text
🔘 Globale UI-Elemente (Tab-übergreifend)
Element	Quelle	Detail
ArrowLeft-Icon (Zurück-Button)	🟠 Frontend	Navigation
„Lernanalyse" Header-Titel	🟠 Frontend	Statisch
Tab-Bar (Übersicht/Lernfortschritt/KI-Prognose/Leistung)	🟠 Frontend	Statische Labels + Icons
Tab-Icons (Layers/BarChart3/Brain/Activity)	🟠 Frontend	Statische Icons
Active-Tab Styling (weiß vs. grau)	🟠 Frontend	UI-State
Skeleton Loading (3 Cards)	🟠 Frontend	Statische Platzhalter
Slide-In/Out Animation	🟠 Frontend	CSS Keyframes
z-[60] / Backdrop	🟠 Frontend	Layout
Das ist jetzt wirklich jedes einzelne Element – vom kleinsten Trennpunkt bis zum CTA-Button.