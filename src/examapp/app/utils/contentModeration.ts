// ==================== CONTENT MODERATION ====================
// Blockiert unangemessene, beleidigende und obszöne Begriffe
// Dies ist eine Client-Side-Validierung - in Production sollte zusätzlich
// eine Server-Side-Validierung mit einer professionellen Moderation-API erfolgen

type ModerationResult = {
  isAppropriate: boolean;
  isModerated: boolean;
  reason?: string;
  blockedTerms?: string[];
  message?: string;
};

// Blacklist mit unangemessenen Begriffen (Deutsch + Englisch)
// WICHTIG: Diese Liste ist nicht vollständig und sollte erweitert werden
const INAPPROPRIATE_TERMS = [
  // Obszöne/Sexuelle Begriffe
  'porno', 'pornografie', 'sex', 'xxx', 'nackt', 'nude', 'erotik', 'porn',
  'fick', 'fuck', 'pussy', 'dick', 'penis', 'vagina', 'masturbation',
  'orgasmus', 'blowjob', 'handjob', 'anal', 'oral', 'hentai', 'milf',
  
  // Gewalt & Extremismus
  'töten', 'kill', 'mord', 'murder', 'waffe', 'weapon', 'bombe', 'bomb',
  'terrorist', 'terrorismus', 'isis', 'nazi', 'hitler', 'holocaust',
  'genozid', 'genocide', 'folter', 'torture',
  
  // Hassrede & Diskriminierung
  'nigger', 'neger', 'hurensohn', 'motherfucker', 'schlampe', 'slut',
  'whore', 'hure', 'bitch', 'fotze', 'cunt', 'arschloch', 'asshole',
  'spast', 'retard', 'mongo', 'schwuchtel', 'transe',
  
  // Drogen & Substanzen (im Bildungskontext problematisch)
  'kokain', 'cocaine', 'heroin', 'meth', 'crystal', 'ecstasy',
  'drogen kaufen', 'drugs dealer', 'joint rauchen',
  
  // Weitere problematische Begriffe
  'selbstmord', 'suicide', 'suizid', 'umbringen', 'umbring dich',
  'kill yourself', 'vergewaltigung', 'rape', 'kinderpornografie',
  'child porn', 'pädophil', 'pedophile',
];

// Patterns für verdächtige Kombinationen
const SUSPICIOUS_PATTERNS = [
  /\b(wie|how)\s+(man|to)\s+(tötet|kills?|murder)/i,
  /\b(waffen|guns?|weapons?)\s+(kaufen|buy|bauen|build)/i,
  /\b(drogen|drugs)\s+(kaufen|buy|verkaufen|sell)/i,
  /\b(hack|hacken|hacking)\s+(account|passwort|password)/i,
];

/**
 * Moderiert User-Input auf unangemessene Inhalte
 * @param input - Der zu prüfende Text
 * @returns Validierungsergebnis
 */
export function moderateContent(input: string): ModerationResult {
  const normalizedInput = input.toLowerCase().trim();
  
  // Leere Eingaben sind OK
  if (!normalizedInput) {
    return { isAppropriate: true, isModerated: false };
  }
  
  // 1. Prüfe auf Blacklist-Begriffe
  const foundTerms: string[] = [];
  
  for (const term of INAPPROPRIATE_TERMS) {
    // Exakte Übereinstimmung oder als ganzes Wort
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(normalizedInput)) {
      foundTerms.push(term);
    }
  }
  
  if (foundTerms.length > 0) {
    return {
      isAppropriate: false,
      isModerated: true,
      reason: 'inappropriate_language',
      blockedTerms: foundTerms,
      message: getModerationMessage('inappropriate_language')
    };
  }
  
  // 2. Prüfe auf verdächtige Patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(normalizedInput)) {
      return {
        isAppropriate: false,
        isModerated: true,
        reason: 'suspicious_pattern',
        message: getModerationMessage('suspicious_pattern')
      };
    }
  }
  
  // 3. Prüfe auf exzessive Großbuchstaben (SPAM-Indikator)
  const uppercaseRatio = (normalizedInput.match(/[A-Z]/g) || []).length / normalizedInput.length;
  if (normalizedInput.length > 10 && uppercaseRatio > 0.7) {
    return {
      isAppropriate: false,
      isModerated: true,
      reason: 'excessive_caps',
      message: getModerationMessage('excessive_caps')
    };
  }
  
  // 4. Prüfe auf exzessive Sonderzeichen (SPAM-Indikator)
  const specialCharRatio = (normalizedInput.match(/[!@#$%^&*()]/g) || []).length / normalizedInput.length;
  if (normalizedInput.length > 10 && specialCharRatio > 0.4) {
    return {
      isAppropriate: false,
      isModerated: true,
      reason: 'excessive_special_chars',
      message: getModerationMessage('excessive_special_chars')
    };
  }
  
  // Alles OK
  return { isAppropriate: true, isModerated: false };
}

/**
 * Gibt eine benutzerfreundliche Fehlermeldung zurück
 * @param reason - Der Grund für die Ablehnung
 * @returns Fehlermeldung
 */
export function getModerationMessage(reason?: string): string {
  switch (reason) {
    case 'inappropriate_language':
      return 'Der eingegebene Text enthält unangemessene Begriffe. Bitte formuliere deine Anfrage anders.';
    case 'suspicious_pattern':
      return 'Der eingegebene Text enthält verdächtige Inhalte. Bitte formuliere deine Anfrage anders.';
    case 'excessive_caps':
      return 'Bitte vermeide die exzessive Nutzung von Großbuchstaben.';
    case 'excessive_special_chars':
      return 'Bitte vermeide die exzessive Nutzung von Sonderzeichen.';
    default:
      return 'Der eingegebene Text entspricht nicht unseren Richtlinien. Bitte formuliere deine Anfrage anders.';
  }
}