// src/lib/topic-content-service.ts
import { TopicContent, topicContentRegistry } from './topic-content';

// Function to get topic content by ID with local storage override
export function getTopicContent(topicId: string): TopicContent | null {
  // Try to get from local storage first
  if (typeof window !== 'undefined') {
    try {
      const localContent = localStorage.getItem(`topic-content-${topicId}`);
      if (localContent) {
        return JSON.parse(localContent);
      }
    } catch (error) {
      console.error('Error retrieving content from local storage:', error);
    }
  }
  
  // Fall back to the registry
  return topicContentRegistry[topicId] || null;
}

// Function to save topic content to local storage
export function saveTopicContent(content: TopicContent): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`topic-content-${content.id}`, JSON.stringify(content));
    } catch (error) {
      console.error('Error saving content to local storage:', error);
    }
  }
}

// Function to reset topic content to original
export function resetTopicContent(topicId: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(`topic-content-${topicId}`);
    } catch (error) {
      console.error('Error removing content from local storage:', error);
    }
  }
}