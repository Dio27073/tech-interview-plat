//chapters/[chapterId]/topics/[topicId]/page.tsx
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
  loadTopicContent 
} from './helpers/topic-helpers';

// Import components
import NavigationBar from './components/NavigationBar';
import TopicContent from './components/TopicContent';
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

  // Create memoized params to use in dependency array
  const unwrappedParams = use(params as any) as { chapterId: string; topicId: string };
  const chapterId = unwrappedParams.chapterId;
  const topicId = unwrappedParams.topicId;
  
  // Load chapter and topic data
  useEffect(() => {
    console.log("Loading data for:", chapterId, topicId);
    
    // Find the chapter by ID
    const loadedChapterInfo = findChapterById(chapterId);
    console.log("Chapter info:", loadedChapterInfo);
    setChapterInfo(loadedChapterInfo);
    
    if (loadedChapterInfo) {
      const loadedCategory = curriculumData.find(cat => cat.id === loadedChapterInfo.categoryId);
      console.log("Category:", loadedCategory);
      setCategory(loadedCategory);
      
      const loadedTopicName = findTopicByIdInChapter(loadedChapterInfo.chapter, topicId);
      console.log("Topic name:", loadedTopicName);
      setTopicName(loadedTopicName);
      
      // Get the content
      const topicContent = loadTopicContent(topicId, loadedTopicName || 'Unknown Topic');
      console.log("Topic content:", topicContent);
      setCurrentContent(topicContent);
      setIsLoading(false);
    }
  }, [chapterId, topicId]);

  // Handle 404 cases when data loads
  useEffect(() => {
    if (!isLoading) {
      if (!chapterInfo || !topicName) {
        notFound();
      }
    }
  }, [isLoading, chapterInfo, topicName]);

  const handleSaveContent = (updatedContent: TopicContentType) => {
    // Save to local storage
    saveTopicContent(updatedContent);
    setCurrentContent(updatedContent);
    setIsEditing(false);
    
    // Show success message
    alert('Content updated successfully! Your changes have been saved.');
  };

  const handleResetContent = () => {
    if (confirm('Are you sure you want to reset this topic to its original content? All your changes will be lost.')) {
      resetTopicContent(topicId);
      
      // Reload the original content
      const originalContent = loadTopicContent(topicId, topicName || 'Unknown Topic');
      setCurrentContent(originalContent);
      setIsEditing(false);
      alert('Content has been reset to the original version.');
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
        <TopicContent content={currentContent} />

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