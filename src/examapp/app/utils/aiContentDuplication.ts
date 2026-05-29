import { getAICategories, getAITopics, getAISubtopics } from './aiContentStorage';
import { categories as standardCategories } from '../data/categories';
import { topics as standardTopics } from '../data/topics';
import { allSubtopics as standardSubtopics } from '../data/subtopics';

/**
 * Normalize text for comparison (lowercase, remove special chars, trim whitespace)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9äöüß\s]/gi, '')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate similarity between two strings (simple word overlap)
 */
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = normalizeText(text1).split(' ');
  const words2 = normalizeText(text2).split(' ');
  
  const overlap = words1.filter(word => words2.includes(word)).length;
  const maxLength = Math.max(words1.length, words2.length);
  
  return overlap / maxLength;
}

/**
 * Find similar category by name (>70% similarity)
 */
export function findSimilarCategory(categoryName: string, subjectId: string): { id: string; name: string } | null {
  const threshold = 0.7;
  
  // Check standard categories
  const stdCategory = standardCategories
    .filter(c => c.subjectId === subjectId)
    .find(c => calculateSimilarity(c.name, categoryName) >= threshold);
  
  if (stdCategory) {
    return { id: stdCategory.id, name: stdCategory.name };
  }
  
  // Check AI categories
  const aiCategory = getAICategories()
    .filter(c => c.subjectId === subjectId)
    .find(c => calculateSimilarity(c.name, categoryName) >= threshold);
  
  if (aiCategory) {
    return { id: aiCategory.id, name: aiCategory.name };
  }
  
  return null;
}

/**
 * Find similar topic by name (>70% similarity)
 */
export function findSimilarTopic(topicName: string, categoryId: string): { id: string; name: string } | null {
  const threshold = 0.7;
  
  // Check standard topics
  const stdTopic = standardTopics
    .filter(t => t.categoryId === categoryId)
    .find(t => calculateSimilarity(t.name, topicName) >= threshold);
  
  if (stdTopic) {
    return { id: stdTopic.id, name: stdTopic.name };
  }
  
  // Check AI topics
  const aiTopic = getAITopics()
    .filter(t => t.categoryId === categoryId)
    .find(t => calculateSimilarity(t.name, topicName) >= threshold);
  
  if (aiTopic) {
    return { id: aiTopic.id, name: aiTopic.name };
  }
  
  return null;
}

/**
 * Find similar subtopic by name (>70% similarity)
 */
export function findSimilarSubtopic(subtopicName: string, topicId: string): { id: string; name: string } | null {
  const threshold = 0.7;
  
  // Check standard subtopics
  const stdSubtopic = standardSubtopics
    .filter(s => s.topicId === topicId)
    .find(s => calculateSimilarity(s.name, subtopicName) >= threshold);
  
  if (stdSubtopic) {
    return { id: stdSubtopic.id, name: stdSubtopic.name };
  }
  
  // Check AI subtopics
  const aiSubtopic = getAISubtopics()
    .filter(s => s.topicId === topicId)
    .find(s => calculateSimilarity(s.name, subtopicName) >= threshold);
  
  if (aiSubtopic) {
    return { id: aiSubtopic.id, name: aiSubtopic.name };
  }
  
  return null;
}

/**
 * Check if content already exists based on user input
 * Returns detailed info about where the content exists
 */
export function checkIfContentExists(
  userInput: string,
  subjectId: string,
  currentCategoryId?: string,
  currentTopicId?: string
): {
  exists: boolean;
  categoryName?: string;
  topicName?: string;
  subtopicName?: string;
} {
  // If we're on subtopic level (have topicId), check for subtopic
  if (currentTopicId) {
    const existingSubtopic = findSimilarSubtopic(userInput, currentTopicId);
    if (existingSubtopic) {
      // Find topic and category names
      const topic = [...standardTopics, ...getAITopics()].find(t => t.id === currentTopicId);
      const category = topic ? [...standardCategories, ...getAICategories()].find(c => c.id === topic.categoryId) : null;
      
      return {
        exists: true,
        categoryName: category?.name || '',
        topicName: topic?.name || '',
        subtopicName: existingSubtopic.name
      };
    }
  }
  
  // If we're on topic level (have categoryId), check for topic
  if (currentCategoryId) {
    const existingTopic = findSimilarTopic(userInput, currentCategoryId);
    if (existingTopic) {
      const category = [...standardCategories, ...getAICategories()].find(c => c.id === currentCategoryId);
      
      return {
        exists: true,
        categoryName: category?.name || '',
        topicName: existingTopic.name
      };
    }
  }
  
  // Check for category
  const existingCategory = findSimilarCategory(userInput, subjectId);
  if (existingCategory) {
    return {
      exists: true,
      categoryName: existingCategory.name
    };
  }
  
  return { exists: false };
}
