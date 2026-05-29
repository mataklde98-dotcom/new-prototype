// ==================== FALLBACK QUESTIONS ====================
// Diese Fragen sind aktuell nur Platzhalter-Daten zur Demonstration
// In der finalen Version kommen ALLE Daten von der Backend-API:
// - Frage-ID, Punkte, Thema, Fragetext, Antwortmöglichkeiten
// - Fragetyp: 'multipleChoice', 'multipleChoiceMultiple', 'fillInTheBlank', 
//             'fillInTheBlankChoice', 'shortAnswer'
// - correctAnswer und solution werden NUR noch von der KI-API bewertet
// - Die API muss flexibel ALLE Fragetypen unterstützen können

import type { Question } from '../types/api-types';

export const FALLBACK_QUESTIONS: Question[] = [
    {
      id: '1',
      points: 0.5,
      topic: 'Undertopic Example:',
      question: '"Wie wirkt sich regelmäßige körperliche Bewegung auf die geistige Gesundheit aus?"',
      choices: [
        'Sie hat keine Auswirkung',
        'Sie verschlechtert die Stimmung',
        'Sie verbessert die mentale Gesundheit',
        'Sie erhöht nur das Stresslevel'
      ],
      correctAnswer: 2,
      solution: 'Regelmäßige körperliche Bewegung hat nachweislich positive Auswirkungen auf die geistige Gesundheit. Sie setzt Endorphine frei, die als natürliche Stimmungsaufheller wirken, reduziert Stress und Angstzustände und verbessert die allgemeine mentale Gesundheit.'
    },
    {
      id: '2',
      points: 1.0,
      topic: 'Schlaf:',
      question: '"Welche langfristigen gesundheitlichen Auswirkungen kann chronischer Schlafmangel über mehrere Monate oder Jahre haben und welche physiologischen Prozesse werden dabei besonders beeinträchtigt?"',
      choices: [
        'Nur leichte Müdigkeit am Tag',
        'Erhöhtes Risiko für Herz-Kreislauf-Erkrankungen, Diabetes, geschwächtes Immunsystem, beeinträchtigte kognitive Funktionen und erhöhtes Risiko für Depression',
        'Verbesserte Konzentration',
        'Keine nennenswerten Auswirkungen auf die Gesundheit'
      ],
      correctAnswer: 1,
      solution: 'Chronischer Schlafmangel hat weitreichende negative Auswirkungen auf die Gesundheit. Gesundheitsexperten empfehlen für Erwachsene 7-9 Stunden Schlaf pro Nacht. Diese Schlafdauer ermöglicht dem Körper ausreichende Erholung und Regeneration für optimale körperliche und geistige Leistungsfähigkeit. Bei anhaltendem Schlafmangel werden wichtige regenerative Prozesse gestört: Das Immunsystem wird geschwächt, wodurch die Anfälligkeit für Infektionen steigt. Der Stoffwechsel wird beeinträchtigt, was das Risiko für Typ-2-Diabetes erhöht. Das Herz-Kreislauf-System leidet unter erhöhtem Blutdruck und Entzündungsreaktionen. Kognitive Funktionen wie Gedächtnis, Konzentration und Entscheidungsfindung werden nachweislich beeinträchtigt. Langfristig erhöht sich auch das Risiko für psychische Erkrankungen wie Depression und Angststörungen.'
    },
    {
      id: '3',
      points: 0.5,
      topic: 'Stress:',
      question: '"In stressigen Situationen im beruflichen Alltag oder bei persönlichen Herausforderungen: Welche wissenschaftlich fundierte Methode hat sich als besonders wirksam zur nachhaltigen Stressreduktion erwiesen?"',
      choices: [
        'Erhöhter Kaffeekonsum von mehr als 5 Tassen pro Tag zur Steigerung der Leistungsfähigkeit',
        'Regelmäßige Meditation, kontrollierte Atemübungen nach der 4-7-8-Methode und progressive Muskelentspannung',
        'Schlafzeit auf unter 5 Stunden reduzieren um mehr zu schaffen',
        'Permanente Social-Media-Nutzung'
      ],
      correctAnswer: 1,
      solution: 'Meditation und Atemübungen sind wissenschaftlich fundierte und hochwirksame Methoden zur nachhaltigen Stressreduktion. Sie aktivieren das parasympathische Nervensystem, welches für Entspannung und Regeneration zuständig ist, und senken nachweislich den Cortisol-Spiegel im Körper. Die 4-7-8-Atemmethode beispielsweise (4 Sekunden einatmen, 7 Sekunden halten, 8 Sekunden ausatmen) beruhigt das zentrale Nervensystem bereits nach wenigen Zyklen. Progressive Muskelentspannung nach Jacobson reduziert körperliche Anspannung systematisch. Regelmäßige Meditation verändert sogar die Gehirnstruktur positiv: Studien zeigen, dass bereits 8 Wochen täglicher Meditation die Dichte grauer Substanz in Bereichen erhöhen, die mit Selbstwahrnehmung und Mitgefühl assoziiert sind. Gleichzeitig wird die Amygdala, unser Angstzentrum, weniger reaktiv. Diese Praktiken fördern einen dauerhaften Zustand innerer Ruhe und Gelassenheit.'
    },
    {
      id: '4',
      type: 'fillInTheBlank',
      points: 1.0,
      topic: 'Bewegung:',
      question: 'Man sollte pro Woche ______ Mal Sport treiben.',
      correctAnswer: '3-5',
      acceptedAnswers: ['3-5', '3 bis 5', '3 - 5', 'drei bis fünf', '3-5 mal', '3 bis 5 mal', '3-5x', '3-5 x'],
      solution: 'Experten empfehlen 3-5 Mal pro Woche Sport zu treiben. Diese Häufigkeit bietet ein optimales Gleichgewicht zwischen Training und Erholung, fördert die kardiovaskuläre Gesundheit und beugt Übertraining vor.'
    },
    {
      id: '5',
      type: 'fillInTheBlankChoice',
      points: 0.5,
      topic: 'Gesundheit:',
      question: '"Was ist der Body-Mass-Index (BMI)?"',
      textBefore: 'Der BMI ist ein Maß für',
      textAfter: 'und gibt einen ersten Anhaltspunkt zur Beurteilung des Körpergewichts.',
      choices: [
        'Körpergröße',
        'Körpergewicht im Verhältnis zur Größe',
        'Muskelanteil',
        'Wasseranteil'
      ],
      correctAnswer: 1,
      solution: 'Der BMI ist ein Maß für Körpergewicht im Verhältnis zur Körpergröße. Er wird berechnet durch: Gewicht (kg) / Größe² (m²). Der BMI gibt einen ersten Anhaltspunkt zur Beurteilung des Körpergewichts, sollte aber nicht als alleiniger Indikator verwendet werden.'
    },
    {
      id: '6',
      type: 'shortAnswer',
      points: 1.0,
      topic: 'Prävention:',
      question: '"Welche Maßnahmen beugen Herz-Kreislauf-Erkrankungen vor?"',
      correctAnswer: 'Regelmäßige Bewegung und gesunde Ernährung',
      acceptedAnswers: [
        'regelmäßige bewegung und gesunde ernährung',
        'bewegung und ernährung',
        'sport und gesunde ernährung',
        'regelmäßige bewegung',
        'gesunde ernährung und bewegung',
        'bewegung und gesunde ernährung',
        'sport und ernährung',
        'bewegung',
        'ernährung',
        'sport',
        'ernährung und bewegung',
        'gesunde ernährung und regelmäßige bewegung',
        'ernährung und regelmäßige bewegung',
        'ernährung und sport',
        'gesunde ernährung'
      ],
      solution: 'Regelmäßige Bewegung und gesunde Ernährung sind die wichtigsten Präventionsmaßnahmen gegen Herz-Kreislauf-Erkrankungen. Sie senken Blutdruck, verbessern Cholesterinwerte, stärken das Herz und reduzieren das Risiko für Herzinfarkt und Schlaganfall erheblich.'
    },
    {
      id: '7',
      type: 'multipleChoiceMultiple',
      points: 0.5,
      topic: 'Hydration:',
      question: '"Welche Aussagen über Wasser sind richtig?"',
      choices: [
        'Wasser ist für alle Körperfunktionen essentiell',
        'Man sollte nur trinken wenn man durstig ist',
        'Kaffee kann zur täglichen Flüssigkeitszufuhr beitragen',
        'Wasser ist unwichtig für den Stoffwechsel'
      ],
      correctAnswer: [0, 2],
      solution: 'Wasser ist für alle Körperfunktionen essentiell und wichtig für den Stoffwechsel. Kaffee kann tatsächlich zur täglichen Flüssigkeitszufuhr beitragen, auch wenn er leicht harntreibend wirkt. Man sollte nicht nur bei Durst trinken, da Durst bereits ein Zeichen von Dehydration ist.'
    },
    {
      id: '8',
      type: 'fillInTheBlank',
      points: 1.0,
      topic: 'Ernährung:',
      question: 'Die empfohlene tägliche Proteinzufuhr liegt bei etwa ______ Gramm pro Kilogramm Körpergewicht.',
      correctAnswer: '0.8-1.2',
      acceptedAnswers: ['0.8-1.2', '0,8-1,2', '0.8 bis 1.2', '0,8 bis 1,2', '1', '0.8', '1.2', 'ein'],
      solution: 'Die empfohlene tägliche Proteinzufuhr liegt bei etwa 0.8-1.2 Gramm pro Kilogramm Körpergewicht, abhängig von Aktivitätslevel und Zielen. Sportler benötigen oft mehr Protein für Muskelaufbau und Regeneration.'
    },
    {
      id: '9',
      points: 0.5,
      topic: 'Fitness:',
      question: '"Was ist beim Krafttraining wichtig?"',
      choices: [
        'Nur schwere Gewichte',
        'Korrekte Form und progressive Überlastung',
        'Täglich trainieren ohne Pause',
        'Nur Cardio'
      ],
      correctAnswer: 1,
      solution: 'Beim Krafttraining ist die korrekte Ausführung (Form) entscheidend, um Verletzungen zu vermeiden. Progressive Überlastung bedeutet, die Belastung schrittweise zu steigern. Regenerationsphasen sind essentiell für Muskelwachstum.'
    },
    {
      id: '10',
      type: 'shortAnswer',
      points: 1.0,
      topic: 'Bewegung:',
      question: '"Welche Sportart ist besonders gut für das Herz-Kreislauf-System?"',
      correctAnswer: 'Laufen, Schwimmen oder Radfahren',
      acceptedAnswers: [
        'laufen',
        'schwimmen',
        'radfahren',
        'joggen',
        'laufen schwimmen radfahren',
        'ausdauersport',
        'cardio',
        'radfahren schwimmen laufen',
        'schwimmen laufen',
        'laufen radfahren',
        'schwimmen radfahren'
      ],
      solution: 'Ausdauersportarten wie Laufen, Schwimmen oder Radfahren sind besonders gut für das Herz-Kreislauf-System. Sie stärken das Herz, verbessern die Durchblutung, senken den Blutdruck und erhöhen die Ausdauer.'
    },
    {
      id: '11',
      type: 'multipleChoiceMultiple',
      points: 0.5,
      topic: 'Ernährung:',
      question: '"Welche Nährstoffe gehören zu einer ausgewogenen Ernährung?"',
      choices: [
        'Proteine',
        'Kohlenhydrate',
        'Fette',
        'Alkohol'
      ],
      correctAnswer: [0, 1, 2],
      solution: 'Eine ausgewogene Ernährung besteht aus Proteinen, Kohlenhydraten und gesunden Fetten. Diese drei Makronährstoffe sind essentiell für verschiedene Körperfunktionen. Alkohol gehört nicht zu einer ausgewogenen Ernährung.'
    },
    {
      id: '12',
      points: 1.0,
      topic: 'Mentale Gesundheit:',
      question: '"Wie wirkt sich soziale Interaktion auf die Gesundheit aus?"',
      choices: [
        'Hat keinen Einfluss',
        'Nur negative Auswirkungen',
        'Positive Effekte auf mentale und physische Gesundheit',
        'Nur bei jungen Menschen wichtig'
      ],
      correctAnswer: 2,
      solution: 'Soziale Interaktion hat nachweislich positive Effekte auf die mentale und physische Gesundheit. Sie reduziert Stress, stärkt das Immunsystem, verbessert die Stimmung und kann sogar die Lebenserwartung erhöhen.'
    },
    {
      id: '13',
      type: 'fillInTheBlankChoice',
      points: 0.5,
      topic: 'Training:',
      question: '"Was bedeutet HIIT?"',
      textBefore: 'HIIT steht für',
      textAfter: 'und ist eine sehr effektive Trainingsmethode.',
      choices: [
        'High Intensity Interval Training',
        'Heavy Iron Impact Training',
        'Healthy Input Integration Therapy',
        'Horizontal Incline Indoor Training'
      ],
      correctAnswer: 0,
      solution: 'HIIT steht für High Intensity Interval Training - eine Trainingsmethode mit kurzen, intensiven Belastungsphasen gefolgt von Erholungsphasen. Diese Methode ist sehr effektiv für Fettverbrennung und kardiovaskuläre Fitness.'
    },
    {
      id: '14',
      points: 1.0,
      topic: 'Ernährung:',
      question: '"Was sind Antioxidantien?"',
      choices: [
        'Schädliche Substanzen',
        'Stoffe die freie Radikale neutralisieren',
        'Nur in Nahrungsergänzungsmitteln',
        'Konservierungsstoffe'
      ],
      correctAnswer: 1,
      solution: 'Antioxidantien sind Stoffe, die freie Radikale neutralisieren und so Zellen vor oxidativem Stress schützen. Sie kommen natürlich in vielen Obst- und Gemüsesorten vor und spielen eine wichtige Rolle für die Gesundheit.'
    },
    {
      id: '15',
      type: 'multipleChoiceMultiple',
      points: 0.5,
      topic: 'Regeneration:',
      question: '"Warum sind Ruhephasen beim Training wichtig?"',
      choices: [
        'Für Muskelwachstum',
        'Zur Vermeidung von Übertraining',
        'Zur Reparatur von Mikroverletzungen',
        'Sie sind nicht wichtig'
      ],
      correctAnswer: [0, 1, 2],
      solution: 'Ruhephasen sind essentiell, da Muskeln während der Erholung wachsen und sich reparieren. Sie helfen Übertraining zu vermeiden und ermöglichen die Heilung von Mikroverletzungen im Muskelgewebe. Ohne ausreichende Regeneration riskiert man Leistungsabfall und Verletzungen.'
    }
  ];
