import { useState, useEffect } from 'react';
import { fetchTopicById, updateTopic } from '@/lib/api';
import { getTopicContent, saveTopicContent, resetTopicContent, type TopicContent } from '@/lib/topic-content';

interface UseTopicDataReturn {
  topicContent: TopicContent | null;
  isLoading: boolean;
  error: Error | null;
  saveContent: (content: TopicContent) => Promise<void>;
  resetContent: () => void;
}

/**
 * Custom hook to fetch and manage topic data
 * Tries AWS API first, falls back to local content if API fails
 */
export function useTopicData(topicId: string): UseTopicDataReturn {
  const [topicContent, setTopicContent] = useState<TopicContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch topic data when component mounts or topicId changes
  useEffect(() => {
    let isMounted = true;
    
    async function fetchTopicData() {
      if (!topicId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to get from AWS API
        const apiData = await fetchTopicById(topicId);
        
        if (apiData && isMounted) {
          console.log('Retrieved topic from API:', apiData);
          setTopicContent(apiData);
          // Save to local storage as backup
          saveTopicContent(apiData);
          setIsLoading(false);
          return;
        }
        
        // Fall back to local content
        console.log('API data not found, checking local storage');
        const localContent = getTopicContent(topicId);
        
        if (localContent && isMounted) {
          console.log('Retrieved topic from local storage:', localContent);
          setTopicContent(localContent);
          setIsLoading(false);
          return;
        }
        
        // If we reach here, create default content with basic structure
        if (isMounted) {
          console.log('No content found, creating default structure');
          // Create minimal default content
          const defaultContent = {
            id: topicId,
            title: topicId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            introduction: "This topic content is being created. Check back soon for updates.",
            learningObjectives: ["Understand the basics"],
            sections: [{
              type: 'paragraph',
              content: "Content for this topic is under development."
            }],
            relatedResources: [],
            chapterId: ""
          };
          
          setTopicContent(defaultContent as TopicContent);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading topic data:', err);
          setError(err instanceof Error ? err : new Error(String(err)));
          
          // Fall back to local content on error
          console.log('Error occurred, trying local storage fallback');
          const localContent = getTopicContent(topicId);
          if (localContent) {
            console.log('Retrieved topic from local storage after API error');
            setTopicContent(localContent);
          }
          setIsLoading(false);
        }
      }
    }
    
    fetchTopicData();
    
    return () => {
      isMounted = false;
    };
  }, [topicId]);

  // Function to save content to AWS and local storage
  const saveContent = async (content: TopicContent): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Ensure ID and chapterId are set
      const finalContent = {
        ...content,
        id: topicId,
        updatedAt: new Date().toISOString()
      };
      
      console.log('Saving content:', finalContent);
      
      // First save to local storage as backup
      saveTopicContent(finalContent);
      
      // Then try to update in AWS
      try {
        const response = await updateTopic(finalContent.id, finalContent);
        console.log('AWS update response:', response);
      } catch (err) {
        console.warn('Failed to update topic in AWS, saved locally only:', err);
        // Continue with local state update even if AWS update fails
      }
      
      // Update local state
      setTopicContent(finalContent);
      
      // Don't return anything (void)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('Error in saveContent:', error);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset content to original
  const resetContent = () => {
    setIsLoading(true);
    
    // Clear local storage first
    resetTopicContent(topicId);
    
    // Then try to fetch from API
    fetchTopicById(topicId)
      .then(apiData => {
        if (apiData) {
          console.log('Reset to API content');
          setTopicContent(apiData);
        } else {
          // If API doesn't have the content, use default
          console.warn('Topic not found in API after reset, using default');
          const defaultContent = {
            id: topicId,
            title: topicId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            introduction: "Content has been reset to default.",
            learningObjectives: ["Understand the basics"],
            sections: [{
              type: 'paragraph',
              content: "This topic has been reset to default content."
            }],
            relatedResources: [],
            chapterId: ""
          };
          setTopicContent(defaultContent as TopicContent);
        }
      })
      .catch(err => {
        console.error('Error resetting topic:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    topicContent,
    isLoading,
    error,
    saveContent,
    resetContent
  };
}