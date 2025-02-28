import { curriculumData, type Chapter } from '@/lib/curriculum-data';
import { 
  type TopicContent,
  getTopicContent,
  getTopicContentFromAPI
} from '@/lib/topic-content';

/**
 * Find a chapter by ID
 */
export const findChapterById = (chapterId: string): { chapter: Chapter; categoryId: string } | null => {
  for (const category of curriculumData) {
    const chapter = category.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      return { chapter, categoryId: category.id };
    }
  }
  return null;
};

/**
 * Find a topic by ID within a chapter
 */
export const findTopicByIdInChapter = (chapter: Chapter, topicId: string) => {
  return chapter.topics.find(topic => 
    topic.toLowerCase().replace(/\s+/g, '-') === topicId
  );
};

/**
 * Create fallback content if the detailed content isn't available
 */
export const createFallbackContent = (topicId: string, topicName: string): TopicContent => {
  return {
    id: topicId,
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

/**
 * Load topic content synchronously with fallback
 */
export const loadTopicContent = (topicId: string, topicName: string): TopicContent => {
  const topicContent = getTopicContent(topicId);
  return topicContent || createFallbackContent(topicId, topicName);
};

/**
 * Load topic content asynchronously, trying API first
 */
export const loadTopicContentAsync = async (topicId: string, topicName: string): Promise<TopicContent> => {
  try {
    // Try to get from API first
    const apiContent = await getTopicContentFromAPI(topicId);
    if (apiContent) {
      return apiContent;
    }
  } catch (error) {
    console.error('Error loading topic content from API:', error);
    // Continue to fallbacks
  }
  
  // Use the synchronous version as fallback
  return loadTopicContent(topicId, topicName);
};