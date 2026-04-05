/**
 * 🧪 TEST-HELPER FÜR AI-GENERIERUNG
 * 
 * Diese Datei hilft beim schnellen Testen verschiedener Szenarien.
 * 
 * VERWENDUNG IN DER APP:
 * =====================
 * Gib einfach folgende Keywords im Eingabefeld ein:
 * 
 * ✅ "neue kategorie" → Erstellt: KATEGORIE + Thema + Unterthemen (alle MIT ⭐)
 * ✅ "neue themen" → Erstellt: Thema + Unterthemen zu bestehender Kategorie (Kategorie OHNE ⭐, Rest MIT ⭐)
 * ✅ "neue unterthemen" → Erstellt: Nur Unterthemen zu bestehendem Thema (nur Unterthemen MIT ⭐)
 * 
 * ODER über Browser Console:
 * ===========================
 * 1. Öffne Browser Console (F12)
 * 2. Rufe window.testAI('scenario-name') auf
 * 3. Sieh dir die Logs an
 */

import { generateAIContentHierarchically } from './aiContentHierarchy';

// Mock-Szenarien für schnelles Testen
export const TEST_SCENARIOS = {
  // ✅ SZENARIO 1: Neue Kategorie + Thema + Unterthemen
  'new-category': {
    input: 'neue kategorie',
    subjectId: 'math',
    description: '✅ SZENARIO 1: Erstellt KATEGORIE + Thema + Unterthemen (alle MIT ⭐)'
  },
  
  // ✅ SZENARIO 2: Neue Themen zu bestehender Kategorie
  'new-topic': {
    input: 'neue themen',
    subjectId: 'math',
    description: '✅ SZENARIO 2: Erstellt Thema + Unterthemen (Kategorie OHNE ⭐, Rest MIT ⭐)'
  },
  
  // ✅ SZENARIO 3: Neue Unterthemen zu bestehendem Thema
  'new-subtopics': {
    input: 'neue unterthemen',
    subjectId: 'math',
    description: '✅ SZENARIO 3: Erstellt nur Unterthemen (nur Unterthemen MIT ⭐)'
  },
  
  // Alternative Namen für dieselben Tests
  'kategorie': {
    input: 'neue kategorie',
    subjectId: 'math',
    description: 'Alias für new-category'
  },
  
  'themen': {
    input: 'neue themen',
    subjectId: 'math',
    description: 'Alias für new-topic'
  },
  
  'unterthemen': {
    input: 'neue unterthemen',
    subjectId: 'math',
    description: 'Alias für new-subtopics'
  }
};

// Globale Test-Funktion
export function setupTestHelper() {
  // Mache testAI() global verfügbar
  (window as any).testAI = async (scenarioName: string) => {
    const scenario = TEST_SCENARIOS[scenarioName as keyof typeof TEST_SCENARIOS];
    
    if (!scenario) {
      console.error('❌ Unbekanntes Szenario! Verfügbare Szenarien:');
      Object.entries(TEST_SCENARIOS).forEach(([name, s]) => {
        console.log(`  - ${name}: ${s.description}`);
      });
      return;
    }
    
    console.log('\n🧪 TEST-SZENARIO:', scenarioName);
    console.log('📝 Beschreibung:', scenario.description);
    console.log('📥 Input:', scenario.input);
    console.log('📊 Subject:', scenario.subjectId);
    console.log('\n🚀 Starte AI-Generierung...\n');
    
    try {
      const result = await generateAIContentHierarchically(
        scenario.input,
        scenario.subjectId
      );
      
      console.log('\n✅ ERGEBNIS:\n', result);
      console.log('\n📋 Zusammenfassung:');
      console.log(`  - Type: ${result.type}`);
      console.log(`  - Kategorie: ${result.category.name} ${result.category.isNew ? '(NEU ⚡)' : '(BESTEHEND)'}`);
      if (result.topic) {
        console.log(`  - Topic: ${result.topic.name} ${result.topic.isNew ? '(NEU ⚡)' : '(BESTEHEND)'}`);
      }
      console.log(`  - Subtopics: ${result.subtopics.length} erstellt`);
      
    } catch (error) {
      console.error('❌ FEHLER:', error);
    }
  };
  
  // Zeige verfügbare Szenarien in Console
  (window as any).showTestScenarios = () => {
    console.log('\n🧪 VERFÜGBARE TEST-SZENARIEN:\n');
    Object.entries(TEST_SCENARIOS).forEach(([name, scenario]) => {
      console.log(`📝 ${name}`);
      console.log(`   ${scenario.description}`);
      console.log(`   Input: "${scenario.input}" (${scenario.subjectId})\n`);
    });
    console.log('💡 VERWENDUNG: testAI("scenario-name")');
    console.log('💡 Beispiel: testAI("algebra")\n');
  };
  
  console.log('\n🧪 TEST-HELPER GELADEN!');
  console.log('💡 Tippe "showTestScenarios()" um alle Szenarien zu sehen');
  console.log('💡 Tippe "testAI(\'algebra\')" um ein Szenario zu testen\n');
}