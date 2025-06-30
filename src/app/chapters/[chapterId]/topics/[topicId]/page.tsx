// chapters/[chapterId]/topics/[topicId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { curriculumData, type Chapter, type CurriculumCategory } from '@/lib/curriculum-data';
import { 
  type TopicContent as TopicContentType,
} from '@/lib/topic-content';

// Import our custom hook
import { useTopicData } from '@/hooks/useTopicData';

// Import helper functions
import { 
  findChapterById, 
  findTopicByIdInChapter
} from './helpers/topic-helpers';

// Import components
import NavigationBar from './components/NavigationBar';
import TopicContent from './components/TopicContent';
import TopicContentEditor from './components/TopicContentEditor';
import NavigationButtons from './components/NavigationButtons';
import RelatedResources from './components/RelatedResources';

export default function TopicPage({ params }: { params: Promise<{ chapterId: string; topicId: string }> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [chapterInfo, setChapterInfo] = useState<{ chapter: Chapter; categoryId: string } | null>(null);
  const [category, setCategory] = useState<CurriculumCategory | null>(null);
  const [topicName, setTopicName] = useState<string | undefined>(undefined);

  // Create memoized params to use in dependency array
  const unwrappedParams = use(params) as { chapterId: string; topicId: string };
  const chapterId = unwrappedParams.chapterId;
  const topicId = unwrappedParams.topicId;
  
  // Use our custom hook to fetch topic data from API
  const { 
    topicContent, 
    isLoading: isTopicLoading, 
    error: topicError,
    saveContent,
    resetContent
  } = useTopicData(topicId);
  
  // Load chapter and topic metadata
  useEffect(() => {
    console.log("Loading metadata for:", chapterId, topicId);
    
    // Find the chapter by ID
    const loadedChapterInfo = findChapterById(chapterId);
    console.log("Chapter info:", loadedChapterInfo);
    setChapterInfo(loadedChapterInfo);
    
    if (loadedChapterInfo) {
      const loadedCategory = curriculumData.find(cat => cat.id === loadedChapterInfo.categoryId) || null;
      console.log("Category:", loadedCategory);
      setCategory(loadedCategory);
      
      const loadedTopicName = findTopicByIdInChapter(loadedChapterInfo.chapter, topicId);
      console.log("Topic name:", loadedTopicName);
      setTopicName(loadedTopicName);
    }
  }, [chapterId, topicId]);

  // Handle 404 cases when data loads
  useEffect(() => {
    if (!isTopicLoading) {
      if (!chapterInfo) {
        notFound();
      }
    }
  }, [isTopicLoading, chapterInfo]);

  const handleSaveContent = async (updatedContent: TopicContentType) => {
    try {
      // Add chapter ID to the content before saving
      const contentWithChapter = {
        ...updatedContent,
        chapterId: chapterId
      };
      
      // Save via our custom hook (which handles API and local storage)
      await saveContent(contentWithChapter);
      setIsEditing(false);
      
      // Show success message
      alert('Content updated successfully! Your changes have been saved.');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content. Please try again.');
    }
  };

  const handleResetContent = () => {
    if (confirm('Are you sure you want to reset this topic to its original content? All your changes will be lost.')) {
      resetContent();
      setIsEditing(false);
      alert('Content has been reset to the original version.');
    }
  };

  // Show loading state
  const isLoading = isTopicLoading || !chapterInfo;
  if (isLoading || !topicContent || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state
  if (topicError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading topic content: {topicError.message}
              </p>
              <p className="mt-2 text-sm text-red-700">
                <button 
                  onClick={() => window.location.reload()} 
                  className="underline"
                >
                  Reload page
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Editor modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-5xl w-full max-h-screen overflow-y-auto">
            <TopicContentEditor 
              content={topicContent}
              onSave={handleSaveContent}
              onCancel={() => setIsEditing(false)}
              onReset={handleResetContent}
            />
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <NavigationBar 
        chapter={chapterInfo.chapter}
        categoryId={chapterInfo.categoryId}
        categoryTitle={category.title}
        topicName={topicName || 'Unknown Topic'}
        onEdit={() => setIsEditing(true)}
      />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <TopicContent content={topicContent} />

          {/* Navigation buttons */}
          <NavigationButtons 
            chapterId={chapterId}
            previousTopic={topicContent.previousTopic}
            nextTopic={topicContent.nextTopic}
          />

          {/* Related resources */}
          <RelatedResources resources={topicContent.relatedResources} />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} DS&A Study Platform. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:text-white transition duration-200">About</Link>
              <Link href="/privacy" className="hover:text-white transition duration-200">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition duration-200">Terms</Link>
              <Link href="/contact" className="hover:text-white transition duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}