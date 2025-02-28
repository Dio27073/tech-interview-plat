// src/lib/topic-content.ts

// Define types for various content blocks
export type CodeExample = {
  language: string;
  code: string;
  description?: string;
};

export type ImageContent = {
  src: string;
  alt: string;
  caption?: string;
};

export type ContentSection = {
  type: 'paragraph' | 'code' | 'list' | 'image' | 'callout';
  title?: string;
  content: string | string[] | CodeExample | ImageContent;
};

export type TopicContent = {
  id: string;
  title: string;
  introduction: string;
  learningObjectives: string[];
  sections: ContentSection[];
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  };
  relatedResources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'practice' | 'documentation';
  }[];
  nextTopic?: {
    id: string;
    title: string;
  };
  previousTopic?: {
    id: string;
    title: string;
  };
  chapterId?: string; // Added to store the chapter this topic belongs to
};

// Initially empty content registry - will be populated from the database
export const topicContentRegistry: Record<string, TopicContent> = {};

// Import API functions
import { fetchTopicById } from '@/lib/api';

// Function to get topic content by ID with API integration
export async function getTopicContentFromAPI(topicId: string): Promise<TopicContent | null> {
  try {
    // Try to get from API first
    const apiContent = await fetchTopicById(topicId);
    if (apiContent) {
      return apiContent;
    }
    
    // Fall back to local storage
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
    
    // Finally fall back to the registry
    return topicContentRegistry[topicId] || null;
  } catch (error) {
    console.error('Error fetching topic content:', error);
    
    // Fall back to local storage and registry on API error
    if (typeof window !== 'undefined') {
      try {
        const localContent = localStorage.getItem(`topic-content-${topicId}`);
        if (localContent) {
          return JSON.parse(localContent);
        }
      } catch (storageError) {
        console.error('Error retrieving content from local storage:', storageError);
      }
    }
    
    return topicContentRegistry[topicId] || null;
  }
}

// Keep the sync version for backward compatibility
export function getTopicContent(topicId: string): TopicContent | null {
  // Try to get from local storage first (client-side only)
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