import { type Category } from '../data/categories';
import { type Topic } from '../data/topics';
import { type Subtopic } from '../data/subtopics';
import { categories } from '../data/categories';
import { topics as standardTopics } from '../data/topics';
import { allSubtopics as standardSubtopics } from '../data/subtopics';

const AI_CATEGORIES_KEY = 'exam_app_ai_categories';
const AI_TOPICS_KEY = 'exam_app_ai_topics';
const AI_SUBTOPICS_KEY = 'exam_app_ai_subtopics';

// Category Storage
export function saveAICategory(category: Category): boolean {
  const existing = getAICategories();
  
  // Check for duplicates - exact name match (case insensitive)
  const isDuplicate = existing.some(
    cat => cat.name.toLowerCase().trim() === category.name.toLowerCase().trim() && cat.subjectId === category.subjectId
  );
  
  if (isDuplicate) {
    console.warn('⚠️ Kategorie bereits vorhanden:', category.name);
    return false; // Return false to indicate duplicate
  }
  
  const updated = [...existing, category];
  localStorage.setItem(AI_CATEGORIES_KEY, JSON.stringify(updated));
  console.log('💾 AI-Kategorie gespeichert:', category);
  return true; // Return true to indicate success
}

export function getAICategories(): Category[] {
  try {
    const stored = localStorage.getItem(AI_CATEGORIES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('❌ Error loading AI categories:', error);
    return [];
  }
}

export function clearAICategories(): void {
  localStorage.removeItem(AI_CATEGORIES_KEY);
}

// Delete a specific AI category (and all its topics and subtopics)
export function deleteAICategory(categoryId: string): { deletedSubject: boolean } {
  // Get category info before deleting
  const categories = getAICategories();
  const categoryToDelete = categories.find(cat => cat.id === categoryId);
  
  if (!categoryToDelete) {
    console.warn('⚠️ Category not found:', categoryId);
    return { deletedSubject: false };
  }
  
  const subjectId = categoryToDelete.subjectId;
  
  // Delete category
  const updated = categories.filter(cat => cat.id !== categoryId);
  localStorage.setItem(AI_CATEGORIES_KEY, JSON.stringify(updated));
  console.log('🗑️ AI-Kategorie gelöscht:', categoryId);
  
  // Delete all topics belonging to this category
  const topics = getAITopics();
  const topicsToDelete = topics.filter(t => t.categoryId === categoryId);
  const remainingTopics = topics.filter(t => t.categoryId !== categoryId);
  localStorage.setItem(AI_TOPICS_KEY, JSON.stringify(remainingTopics));
  
  // Delete all subtopics belonging to those topics
  const subtopics = getAISubtopics();
  const topicIds = topicsToDelete.map(t => t.id);
  const remainingSubtopics = subtopics.filter(s => !topicIds.includes(s.topicId));
  localStorage.setItem(AI_SUBTOPICS_KEY, JSON.stringify(remainingSubtopics));
  
  console.log('🗑️ Gelöscht: 1 Kategorie, ' + topicsToDelete.length + ' Topics, ' + (subtopics.length - remainingSubtopics.length) + ' Subtopics');
  
  // Trigger storage event for UI updates
  window.dispatchEvent(new Event('storage'));
  
  // ✅ CHECK: Gibt es noch andere Kategorien in diesem Fach?
  const remainingAICategoriesInSubject = updated.filter(cat => cat.subjectId === subjectId);
  const standardCategoriesInSubject = categories.filter(cat => cat.subjectId === subjectId);
  const totalCategories = remainingAICategoriesInSubject.length + standardCategoriesInSubject.length;
  
  console.log(`📊 Subject ${subjectId}: ${totalCategories} Kategorien übrig`);
  
  return { deletedSubject: totalCategories === 0 };
}

// Check if category already exists (standard or AI-generated)
export function categoryExists(categoryName: string, subjectId: string): boolean {
  const normalizedName = categoryName.toLowerCase().trim();
  
  // Check standard categories
  const standardExists = categories.some(
    cat => cat.name.toLowerCase().trim() === normalizedName && cat.subjectId === subjectId
  );
  
  if (standardExists) return true;
  
  // Check AI categories
  const aiCategories = getAICategories();
  return aiCategories.some(
    cat => cat.name.toLowerCase().trim() === normalizedName && cat.subjectId === subjectId
  );
}

// Topic Storage
export function saveAITopic(topic: Topic): void {
  const existing = getAITopics();
  
  // Check for duplicates - exact name match (case insensitive) in same category
  const isDuplicate = existing.some(
    t => t.name.toLowerCase().trim() === topic.name.toLowerCase().trim() && t.categoryId === topic.categoryId
  );
  
  if (isDuplicate) {
    // Silent skip - Topic already exists
    return;
  }
  
  const updated = [...existing, topic];
  localStorage.setItem(AI_TOPICS_KEY, JSON.stringify(updated));
  console.log('💾 AI-Topic gespeichert:', topic);
}

export function getAITopics(): Topic[] {
  try {
    const stored = localStorage.getItem(AI_TOPICS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('❌ Error loading AI topics:', error);
    return [];
  }
}

export function clearAITopics(): void {
  localStorage.removeItem(AI_TOPICS_KEY);
}

// Delete a specific AI topic (and all its subtopics)
export function deleteAITopic(topicId: string): { deletedCategory: boolean } {
  // Get topic info before deleting (we need categoryId for cascade check)
  const topics = getAITopics();
  const topicToDelete = topics.find(t => t.id === topicId);
  
  if (!topicToDelete) {
    console.log('ℹ️ Topic already deleted or not found:', topicId, '(probably removed by CASCADE)');
    return { deletedCategory: false };
  }
  
  const categoryId = topicToDelete.categoryId;
  
  // Delete topic
  const updatedTopics = topics.filter(t => t.id !== topicId);
  localStorage.setItem(AI_TOPICS_KEY, JSON.stringify(updatedTopics));
  console.log('🗑️ AI-Topic gelöscht:', topicId);
  
  // Delete all subtopics belonging to this topic
  const subtopics = getAISubtopics();
  const remainingSubtopics = subtopics.filter(s => s.topicId !== topicId);
  const deletedCount = subtopics.length - remainingSubtopics.length;
  localStorage.setItem(AI_SUBTOPICS_KEY, JSON.stringify(remainingSubtopics));
  
  console.log('🗑️ Gelöscht: 1 Topic, ' + deletedCount + ' Subtopics');
  
  // ============================================================
  // CASCADE: Check if category is now empty → Delete category
  // WICHTIG: Prüfe ALLE Topics (Standard + AI), nicht nur AI!
  // ============================================================
  
  // Count AI topics in this category
  const remainingAITopicsInCategory = updatedTopics.filter(t => t.categoryId === categoryId);
  
  // Count standard topics in this category
  const standardTopicsInCategory = standardTopics.filter(t => t.categoryId === categoryId);
  
  const totalTopics = remainingAITopicsInCategory.length + standardTopicsInCategory.length;
  
  console.log(`🔍 Category ${categoryId}: ${remainingAITopicsInCategory.length} AI-Topics + ${standardTopicsInCategory.length} Standard-Topics = ${totalTopics} total`);
  
  if (totalTopics === 0) {
    console.log('🔗 CASCADE: Kategorie ist jetzt komplett leer → Prüfe ob es AI-Kategorie ist');
    
    // ✅ ONLY delete if it's an AI-generated category!
    // Standard categories should remain even if empty
    const aiCategories = getAICategories();
    const isAICategory = aiCategories.some(cat => cat.id === categoryId);
    
    if (isAICategory) {
      console.log('✅ Kategorie ist AI-generiert → Lösche sofort');
      const updatedCategories = aiCategories.filter(cat => cat.id !== categoryId);
      localStorage.setItem(AI_CATEGORIES_KEY, JSON.stringify(updatedCategories));
      console.log('🗑️ CASCADE: Leere AI-Kategorie gelöscht:', categoryId);
      
      // ✅ Storage Event wird am Ende der CASCADE-Chain getriggert
      window.dispatchEvent(new Event('storage'));
      
      return { deletedCategory: true }; // ✅ CASCADE happened!
    } else {
      console.log('ℹ️ Kategorie ist Standard-Kategorie → Behalte sie (auch wenn leer)');
      
      // ✅ KEIN CASCADE → Trigger Storage Event hier
      window.dispatchEvent(new Event('storage'));
      return { deletedCategory: false };
    }
  } else {
    console.log('✅ Kategorie hat noch Topics → Keine CASCADE-Löschung notwendig');
    
    // ✅ KEIN CASCADE → Trigger Storage Event hier
    window.dispatchEvent(new Event('storage'));
    return { deletedCategory: false };
  }
}

// Check if topic already exists (standard or AI-generated)
export function topicExists(topicName: string, categoryId: string): boolean {
  const normalizedName = topicName.toLowerCase().trim();
  
  // Check standard topics
  const standardExists = standardTopics.some(
    t => t.name.toLowerCase().trim() === normalizedName && t.categoryId === categoryId
  );
  
  if (standardExists) return true;
  
  // Check AI topics
  const aiTopics = getAITopics();
  return aiTopics.some(
    t => t.name.toLowerCase().trim() === normalizedName && t.categoryId === categoryId
  );
}

// Subtopic Storage
export function saveAISubtopic(subtopic: Subtopic): void {
  const existing = getAISubtopics();
  
  // Check for duplicates - exact name match (case insensitive) in same topic
  const isDuplicate = existing.some(
    s => s.name.toLowerCase().trim() === subtopic.name.toLowerCase().trim() && s.topicId === subtopic.topicId
  );
  
  if (isDuplicate) {
    // Silent skip - Subtopic already exists
    return;
  }
  
  const updated = [...existing, subtopic];
  localStorage.setItem(AI_SUBTOPICS_KEY, JSON.stringify(updated));
  console.log('💾 AI-Subtopic gespeichert:', subtopic);
}

export function getAISubtopics(): Subtopic[] {
  try {
    const stored = localStorage.getItem(AI_SUBTOPICS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('❌ Error loading AI subtopics:', error);
    return [];
  }
}

export function clearAISubtopics(): void {
  localStorage.removeItem(AI_SUBTOPICS_KEY);
}

// Delete a specific AI subtopic
export function deleteAISubtopic(subtopicId: string): { deletedTopic: boolean; deletedCategory: boolean } {
  // Get subtopic info before deleting (we need topicId for cascade check)
  const subtopics = getAISubtopics();
  const subtopicToDelete = subtopics.find(s => s.id === subtopicId);
  
  if (!subtopicToDelete) {
    console.warn('⚠️ Subtopic not found:', subtopicId);
    return { deletedTopic: false, deletedCategory: false };
  }
  
  const topicId = subtopicToDelete.topicId;
  
  // Delete subtopic
  const updatedSubtopics = subtopics.filter(s => s.id !== subtopicId);
  localStorage.setItem(AI_SUBTOPICS_KEY, JSON.stringify(updatedSubtopics));
  console.log('🗑️ AI-Subtopic gelöscht:', subtopicId);
  
  // ============================================================
  // CASCADE: Check if topic is now empty → Delete topic
  // WICHTIG: Prüfe ALLE Subtopics (Standard + AI), nicht nur AI!
  // ============================================================
  
  // Count AI subtopics for this topic
  const remainingAISubtopicsInTopic = updatedSubtopics.filter(s => s.topicId === topicId);
  
  // Count standard subtopics for this topic
  const standardSubtopicsInTopic = standardSubtopics.filter(s => s.topicId === topicId);
  
  const totalSubtopics = remainingAISubtopicsInTopic.length + standardSubtopicsInTopic.length;
  
  console.log(`🔍 Topic ${topicId}: ${remainingAISubtopicsInTopic.length} AI-Subtopics + ${standardSubtopicsInTopic.length} Standard-Subtopics = ${totalSubtopics} total`);
  
  if (totalSubtopics === 0) {
    console.log('🔗 CASCADE: Topic ist jetzt komplett leer → Prüfe ob es AI-Topic ist');
    
    // ✅ ONLY delete if it's an AI-generated topic!
    // Standard topics should remain even if empty
    const aiTopics = getAITopics();
    const isAITopic = aiTopics.some(t => t.id === topicId);
    
    if (isAITopic) {
      console.log('✅ Topic ist AI-generiert → Lösche sofort (CASCADE zu Category)');
      const cascadeResult = deleteAITopic(topicId);
      
      // ✅ Storage Event wird von deleteAITopic() getriggert (am Ende der CASCADE-Chain)
      return { deletedTopic: true, deletedCategory: cascadeResult.deletedCategory };
    } else {
      console.log('ℹ️ Topic ist Standard-Topic → Behalte es (auch wenn leer)');
      
      // ✅ KEIN CASCADE → Trigger Storage Event hier
      window.dispatchEvent(new Event('storage'));
      return { deletedTopic: false, deletedCategory: false };
    }
  } else {
    console.log('✅ Topic hat noch Subtopics → Keine CASCADE-Löschung notwendig');
    
    // ✅ KEIN CASCADE → Trigger Storage Event hier
    window.dispatchEvent(new Event('storage'));
    return { deletedTopic: false, deletedCategory: false };
  }
}

// Check if subtopic already exists (standard or AI-generated)
export function subtopicExists(subtopicName: string, topicId: string): boolean {
  const normalizedName = subtopicName.toLowerCase().trim();
  
  // Check standard subtopics
  const standardExists = standardSubtopics.some(
    s => s.name.toLowerCase().trim() === normalizedName && s.topicId === topicId
  );
  
  if (standardExists) return true;
  
  // Check AI subtopics
  const aiSubtopics = getAISubtopics();
  return aiSubtopics.some(
    s => s.name.toLowerCase().trim() === normalizedName && s.topicId === topicId
  );
}

// Clear all AI-generated content
export function clearAllAIContent(): void {
  clearAICategories();
  clearAITopics();
  clearAISubtopics();
}