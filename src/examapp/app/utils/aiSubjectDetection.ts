/**
 * KI-gestützte Fach-Erkennung
 * Erkennt automatisch das richtige Fach basierend auf User-Input
 */

type SubjectId = 'math' | 'german' | 'biology' | 'history' | 'english' | 'chemistry' | 'french';

type SubjectKeywords = {
  [key in SubjectId]: {
    name: string;
    keywords: string[];
    phrases: string[];
  };
};

const subjectKeywords: SubjectKeywords = {
  math: {
    name: 'Mathematik',
    keywords: [
      'mathe', 'mathematik', 'rechnen', 'zahl', 'gleichung', 'formel',
      'prozent', 'bruch', 'wurzel', 'integral', 'ableitung', 'funktion',
      'grenzwert', 'differenzial', 'algebra', 'geometrie', 'trigonometrie',
      'statistik', 'wahrscheinlichkeit', 'vektor', 'matrix', 'logarithmus'
    ],
    phrases: [
      'quadratische gleichung', 'lineare funktion', 'binomische formel',
      'satz des pythagoras', 'dreisatz', 'prozentrechnung'
    ]
  },
  german: {
    name: 'Deutsch',
    keywords: [
      'deutsch', 'literatur', 'gedicht', 'roman', 'novelle', 'drama',
      'kurzgeschichte', 'interpretation', 'erörterung', 'aufsatz',
      'rechtschreibung', 'grammatik', 'satzbau', 'autor', 'erzählung',
      'ballade', 'fabel', 'märchen', 'lyrik', 'epik', 'sprache',
      'wortarten', 'satzglieder', 'komma', 'dass', 'das',
      'zeitformen', 'konjunktiv', 'adjektiv', 'verb', 'substantiv'
    ],
    phrases: [
      'kreatives schreiben', 'textanalyse', 'literarische epoche',
      'metapher', 'personifikation', 'stilmittel', 'das oder dass',
      'dass oder das', 'kommasetzung', 'groß- und kleinschreibung',
      'der die das', 'artikel', 'das dass'
    ]
  },
  biology: {
    name: 'Biologie',
    keywords: [
      'biologie', 'bio', 'zelle', 'organismus', 'evolution', 'genetik',
      'dna', 'photosynthese', 'ökologie', 'ökosystem', 'biodiversität',
      'botanik', 'zoologie', 'mikrobiologie', 'enzyme', 'protein',
      'mitochondrien', 'chloroplast', 'membran', 'stoffwechsel', 'atmung'
    ],
    phrases: [
      'natürliche selektion', 'mendelschen regeln', 'zellteilung',
      'citrat-zyklus', 'food chain', 'ökologische nische'
    ]
  },
  history: {
    name: 'Geschichte',
    keywords: [
      'geschichte', 'historisch', 'antike', 'mittelalter', 'neuzeit',
      'krieg', 'revolution', 'kaiser', 'könig', 'reich', 'imperium',
      'demokratie', 'diktatur', 'kolonialismus', 'industrialisierung',
      'reformation', 'aufklärung', 'renaissance', 'rom', 'griechenland',
      'ägypten', 'babylon', 'alexander', 'caesar', 'napoleon', 'hitler'
    ],
    phrases: [
      'erster weltkrieg', 'zweiter weltkrieg', 'weimarer republik',
      'französische revolution', 'römisches reich', 'kalter krieg'
    ]
  },
  english: {
    name: 'Englisch',
    keywords: [
      'english', 'englisch', 'shakespeare', 'grammar', 'vocabulary',
      'tense', 'past', 'present', 'future', 'perfect', 'continuous',
      'adjective', 'adverb', 'noun', 'verb', 'preposition',
      'reading', 'writing', 'listening', 'speaking', 'pronunciation'
    ],
    phrases: [
      'present perfect', 'past continuous', 'future perfect',
      'conditional sentence', 'reported speech', 'passive voice'
    ]
  },
  chemistry: {
    name: 'Chemie',
    keywords: [
      'chemie', 'chemistry', 'atom', 'molekül', 'element', 'verbindung',
      'reaktion', 'oxidation', 'reduktion', 'säure', 'base', 'ion',
      'elektron', 'proton', 'neutron', 'periodensystem', 'bindung',
      'katalysator', 'konzentration', 'ph-wert', 'gleichgewicht'
    ],
    phrases: [
      'chemische reaktion', 'organische chemie', 'anorganische chemie',
      'redoxreaktion', 'säure-base-reaktion', 'periodensystem der elemente'
    ]
  },
  french: {
    name: 'Französisch',
    keywords: [
      'französisch', 'french', 'français', 'grammaire', 'vocabulaire',
      'conjugaison', 'molière', 'voltaire', 'hugo', 'verbe',
      'passé', 'futur', 'présent', 'subjonctif', 'imparfait',
      'littérature', 'poème', 'roman', 'conversation'
    ],
    phrases: [
      'passé composé', 'imparfait', 'futur simple',
      'subjonctif présent', 'littérature française'
    ]
  }
};

type DetectionResult = {
  detectedSubjectId: SubjectId | null;
  detectedSubjectName: string | null;
  confidence: number; // 0-100
  matches: string[]; // gefundene Keywords/Phrases
};

/**
 * Erkennt das Fach basierend auf User-Input
 */
export function detectSubjectFromInput(input: string, currentSubjectId: SubjectId): DetectionResult {
  const normalizedInput = input.toLowerCase().trim();
  
  console.log('🔬 Detection-Funktion aufgerufen:', {
    originalInput: input,
    normalizedInput: normalizedInput,
    currentSubjectId: currentSubjectId
  });
  
  // Leere Eingabe
  if (!normalizedInput) {
    return {
      detectedSubjectId: null,
      detectedSubjectName: null,
      confidence: 0,
      matches: []
    };
  }
  
  // Score für jedes Fach berechnen
  const scores: { subjectId: SubjectId; score: number; matches: string[] }[] = [];
  
  for (const [subjectId, data] of Object.entries(subjectKeywords) as [SubjectId, typeof subjectKeywords[SubjectId]][]) {
    let score = 0;
    const matches: string[] = [];
    
    // Check Phrases (höhere Gewichtung)
    for (const phrase of data.phrases) {
      if (normalizedInput.includes(phrase)) {
        score += 10;
        matches.push(phrase);
        console.log(`  ✅ Phrase-Match gefunden: "${phrase}" für ${data.name} (+10 Punkte)`);
      }
    }
    
    // Check Keywords
    for (const keyword of data.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += 5;
        matches.push(keyword);
        console.log(`  ✅ Keyword-Match gefunden: "${keyword}" für ${data.name} (+5 Punkte)`);
      }
    }
    
    // Exakter Fachname-Match (sehr hohe Gewichtung)
    if (normalizedInput.includes(data.name.toLowerCase())) {
      score += 50;
      matches.push(data.name);
      console.log(`  ✅ Fachname-Match gefunden: "${data.name}" (+50 Punkte)`);
    }
    
    if (score > 0) {
      scores.push({ subjectId, score, matches });
      console.log(`  📊 ${data.name}: ${score} Punkte (${matches.length} Matches)`);
    }
  }
  
  console.log('📊 Alle Scores:', scores);
  
  // Sortiere nach Score (höchster zuerst)
  scores.sort((a, b) => b.score - a.score);
  
  // Kein Match gefunden
  if (scores.length === 0) {
    console.log('❌ Kein Fach erkannt');
    return {
      detectedSubjectId: null,
      detectedSubjectName: null,
      confidence: 0,
      matches: []
    };
  }
  
  const bestMatch = scores[0];
  const maxScore = 15; // Realistischer: 1 Keyword = 5, 2-3 Keywords = 10-15
  const confidence = Math.min(100, (bestMatch.score / maxScore) * 100);
  
  console.log('✅ Bestes Match:', {
    subject: subjectKeywords[bestMatch.subjectId].name,
    subjectId: bestMatch.subjectId,
    score: bestMatch.score,
    confidence: Math.round(confidence),
    matches: bestMatch.matches
  });
  
  return {
    detectedSubjectId: bestMatch.subjectId,
    detectedSubjectName: subjectKeywords[bestMatch.subjectId].name,
    confidence: Math.round(confidence),
    matches: bestMatch.matches
  };
}

/**
 * Prüft ob Input zum aktuellen Fach passt
 */
export function isInputMatchingCurrentSubject(
  input: string,
  currentSubjectId: SubjectId
): boolean {
  const detection = detectSubjectFromInput(input, currentSubjectId);
  return detection.detectedSubjectId === currentSubjectId;
}