import { curriculumData, type Chapter } from '@/lib/curriculum-data';
import { 
  type TopicContent,
  getTopicContent
} from '@/lib/topic-content';

// Find a chapter by ID
export const findChapterById = (chapterId: string): { chapter: Chapter; categoryId: string } | null => {
  for (const category of curriculumData) {
    const chapter = category.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      return { chapter, categoryId: category.id };
    }
  }
  return null;
};

// Find a topic by ID within a chapter
export const findTopicByIdInChapter = (chapter: Chapter, topicId: string) => {
  return chapter.topics.find(topic => 
    topic.toLowerCase().replace(/\s+/g, '-') === topicId
  );
};

// Create fallback content if the detailed content isn't available
export const createFallbackContent = (topicId: string, topicName: string): TopicContent => {
  console.log('Creating fallback content for ID:', topicId);
  return {
    id: topicId, // Ensure ID is set explicitly
    title: topicName || "Unknown Topic",
    introduction: `Learn about ${topicName} in this comprehensive lesson.`,
    learningObjectives: [`Understand and apply ${topicName} concepts`],
    sections: [{
      type: 'paragraph' as const,
      content: `${topicName} are important concepts in programming. This section will be expanded with detailed content in the future.`
    }],
    relatedResources: [],
    quiz: undefined,
    nextTopic: undefined,
    previousTopic: undefined
  };
};

// Load topic content with fallback - async to work with the API
export const loadTopicContent = async (topicId: string, topicName: string): Promise<TopicContent> => {
  console.log('Loading topic content for ID:', topicId);
  
  try {
    // Try to get content from API/storage
    const topicContent = await getTopicContent(topicId);
    
    // If content exists, return it (ensuring ID is set), otherwise use the fallback
    if (topicContent) {
      // Ensure ID is always set correctly, even if API returned a different or missing ID
      return {
        ...topicContent,
        id: topicId // Force the ID to be the one requested
      };
    }
    
    return createFallbackContent(topicId, topicName);
  } catch (error) {
    console.error('Error loading topic content:', error);
    // Return fallback content in case of error
    return createFallbackContent(topicId, topicName);
  }
};

// Synchronous version for immediate results
export const loadTopicContentSync = (topicId: string, topicName: string): TopicContent => {
  console.log('Loading topic content synchronously for ID:', topicId);
  
  try {
    // For sync loading, we always use fallback since we can't make API calls
    return createFallbackContent(topicId, topicName);
  } catch (error) {
    console.error('Error loading topic content synchronously:', error);
    return createFallbackContent(topicId, topicName);
  }
};