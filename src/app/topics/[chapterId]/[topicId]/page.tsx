// src/app/topics/[chapterId]/[topicId]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { curriculumData } from '@/lib/curriculum-data';
import { 
  type TopicContent as TopicContentType, 
  saveTopicContent,
  resetTopicContent
} from '@/lib/topic-content';

// Import helper functions
import { 
  findChapterById, 
  findTopicByIdInChapter, 
  loadTopicContent,
  loadTopicContentSync // New sync version for initial rendering
} from './helpers/topic-helpers';

// Import components
import NavigationBar from './components/NavigationBar';
import TopicContentDisplay from './components/TopicContent';
import TopicContentEditor from './components/TopicContentEditor';
import NavigationButtons from './components/NavigationButtons';
import RelatedResources from './components/RelatedResources';

export default function TopicPage({ params }: { params: { chapterId: string; topicId: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState<TopicContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chapterInfo, setChapterInfo] = useState<{ chapter: any; categoryId: string } | null>(null);
  const [category, setCategory] = useState<any>(null);
  const [topicName, setTopicName] = useState<string | undefined>(undefined);
  const [saveStatus, setSaveStatus] = useState<{
    isSaving: boolean;
    isError: boolean;
    message: string | null;
  }>({
    isSaving: false,
    isError: false,
    message: null
  });

  // Create memoized params to use in dependency array
  const unwrappedParams = use(params as any) as { chapterId: string; topicId: string };
  const chapterId = unwrappedParams.chapterId;
  const topicId = unwrappedParams.topicId;
  
  // Load chapter and topic data
  useEffect(() => {
    async function loadData() {
      // Find the chapter by ID
      const loadedChapterInfo = findChapterById(chapterId);
      setChapterInfo(loadedChapterInfo);
      
      if (loadedChapterInfo) {
        const loadedCategory = curriculumData.find(cat => cat.id === loadedChapterInfo.categoryId);
        setCategory(loadedCategory);
        
        const loadedTopicName = findTopicByIdInChapter(loadedChapterInfo.chapter, topicId);
        setTopicName(loadedTopicName);
        
        try {
          // Get the content using the async API function
          const topicContent = await loadTopicContent(topicId, loadedTopicName || 'Unknown Topic');
          setCurrentContent(topicContent);
        } catch (error) {
          console.error('Error loading topic content:', error);
          // Use fallback in case of error
          const fallbackContent = loadTopicContentSync(topicId, loadedTopicName || 'Unknown Topic');
          setCurrentContent(fallbackContent);
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadData();
  }, [chapterId, topicId]);

  // Handle 404 cases when data loads
  useEffect(() => {
    if (!isLoading) {
      if (!chapterInfo || !topicName) {
        notFound();
      }
    }
  }, [isLoading, chapterInfo, topicName]);

  const handleSaveContent = async (updatedContent: TopicContentType) => {
    // Set saving state
  if (!updatedContent.id && topicId) {
    updatedContent.id = topicId;
  }
  
  // Set saving state
  setSaveStatus({
    isSaving: true,
    isError: false,
    message: 'Saving changes...'
  });
  
  console.log('Saving content with ID:', updatedContent.id);
    
    try {
      // Save using the async API function
      const success = await saveTopicContent(updatedContent);
      
      if (success) {
        setCurrentContent(updatedContent);
        setIsEditing(false);
        
        setSaveStatus({
          isSaving: false,
          isError: false,
          message: 'Content updated successfully! Your changes have been saved.'
        });
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, message: null }));
        }, 3000);
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      
      setSaveStatus({
        isSaving: false,
        isError: true,
        message: 'Failed to save changes. Please try again.'
      });
    }
  };

  const handleResetContent = async () => {
    if (confirm('Are you sure you want to reset this topic to its original content? All your changes will be lost.')) {
      setSaveStatus({
        isSaving: true,
        isError: false,
        message: 'Resetting content...'
      });
      
      try {
        // Reset using the async API function
        const success = await resetTopicContent(topicId);
        
        if (success) {
          // Reload the original content
          const originalContent = await loadTopicContent(topicId, topicName || 'Unknown Topic');
          setCurrentContent(originalContent);
          setIsEditing(false);
          
          setSaveStatus({
            isSaving: false,
            isError: false,
            message: 'Content has been reset to the original version.'
          });
          
          // Clear message after 3 seconds
          setTimeout(() => {
            setSaveStatus(prev => ({ ...prev, message: null }));
          }, 3000);
        } else {
          throw new Error('Failed to reset content');
        }
      } catch (error) {
        console.error('Error resetting content:', error);
        
        setSaveStatus({
          isSaving: false,
          isError: true,
          message: 'Failed to reset content. Please try again.'
        });
      }
    }
  };

  // Show loading state
  if (isLoading || !currentContent || !chapterInfo || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status message */}
      {saveStatus.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-md ${
          saveStatus.isError 
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          <p>{saveStatus.message}</p>
        </div>
      )}
      
      {/* Editor modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="max-w-5xl w-full max-h-screen overflow-y-auto">
            <TopicContentEditor 
              content={currentContent}
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
          <TopicContentDisplay content={currentContent} />

          {/* Navigation buttons */}
          <NavigationButtons 
            chapterId={chapterId}
            previousTopic={currentContent.previousTopic}
            nextTopic={currentContent.nextTopic}
          />

          {/* Related resources */}
          <RelatedResources resources={currentContent.relatedResources} />
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