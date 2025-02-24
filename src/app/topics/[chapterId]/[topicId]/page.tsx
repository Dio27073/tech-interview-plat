// src/app/topics/[chapterId]/[topicId]/page.tsx
'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { curriculumData, type Chapter } from '@/lib/curriculum-data';
import { getTopicContent, type ContentSection, type CodeExample, type TopicContent } from '@/lib/topic-content';

// Find a chapter by ID
const findChapterById = (chapterId: string): { chapter: Chapter; categoryId: string } | null => {
  for (const category of curriculumData) {
    const chapter = category.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      return { chapter, categoryId: category.id };
    }
  }
  return null;
};

// Find a topic by ID within a chapter
const findTopicByIdInChapter = (chapter: Chapter, topicId: string) => {
  return chapter.topics.find(topic => 
    topic.toLowerCase().replace(/\s+/g, '-') === topicId
  );
};

// Component to render a content section based on its type
const ContentSectionRenderer = ({ 
  section, 
  isEditing, 
  onUpdate,
  index
}: { 
  section: ContentSection; 
  isEditing: boolean; 
  onUpdate: (index: number, updatedSection: ContentSection) => void;
  index: number;
}) => {
  const handleContentChange = (content: string | string[] | CodeExample | ImageContent) => {
    onUpdate(index, {
      ...section,
      content
    });
  };

  const handleTitleChange = (title: string) => {
    onUpdate(index, {
      ...section,
      title
    });
  };

  switch (section.type) {
    case 'paragraph':
      return (
        <div className="mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Section Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-xl font-semibold"
              />
              <textarea
                value={section.content as string}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-32"
                placeholder="Enter content here..."
              />
            </>
          ) : (
            <>
              {section.title && <h3 className="text-xl font-semibold mb-3">{section.title}</h3>}
              <p className="text-gray-700">{section.content as string}</p>
            </>
          )}
        </div>
      );
      
    case 'code':
      const codeExample = section.content as CodeExample;
      return (
        <div className="mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Section Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-xl font-semibold"
              />
              <input
                type="text"
                value={codeExample.language}
                onChange={(e) => {
                  const updatedExample = { ...codeExample, language: e.target.value };
                  handleContentChange(updatedExample);
                }}
                placeholder="Language (e.g., javascript, python)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              />
              <textarea
                value={codeExample.code}
                onChange={(e) => {
                  const updatedExample = { ...codeExample, code: e.target.value };
                  handleContentChange(updatedExample);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm min-h-48 mb-2"
                placeholder="// Enter code here"
              />
              <input
                type="text"
                value={codeExample.description || ''}
                onChange={(e) => {
                  const updatedExample = { ...codeExample, description: e.target.value };
                  handleContentChange(updatedExample);
                }}
                placeholder="Description (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </>
          ) : (
            <>
              {section.title && <h3 className="text-xl font-semibold mb-3">{section.title}</h3>}
              <div className="bg-gray-800 text-white p-4 rounded-md my-4 overflow-x-auto">
                <pre className="text-sm">
                  <code>{codeExample.code}</code>
                </pre>
              </div>
              {codeExample.description && (
                <p className="text-sm text-gray-600 mt-2">{codeExample.description}</p>
              )}
            </>
          )}
        </div>
      );
      
    case 'list':
      return (
        <div className="mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Section Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-xl font-semibold"
              />
              <textarea
                value={(section.content as string[]).join('\n')}
                onChange={(e) => {
                  const items = e.target.value.split('\n').filter(item => item.trim() !== '');
                  handleContentChange(items);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-32"
                placeholder="Enter list items, one per line"
              />
            </>
          ) : (
            <>
              {section.title && <h3 className="text-xl font-semibold mb-3">{section.title}</h3>}
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(section.content as string[]).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      );
      
    case 'callout':
      return (
        <div className="mb-6">
          {isEditing ? (
            <>
              <input
                type="text"
                value={section.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Callout Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-xl font-semibold"
              />
              <textarea
                value={section.content as string}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-32"
                placeholder="Enter callout content here..."
              />
            </>
          ) : (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              {section.title && <h3 className="text-lg font-semibold mb-2 text-blue-800">{section.title}</h3>}
              <p className="text-blue-700 whitespace-pre-line">{section.content as string}</p>
            </div>
          )}
        </div>
      );
      
    default:
      return null;
  }
};

interface TopicContentEditorProps {
  content: TopicContent;
  onSave: (updatedContent: TopicContent) => void;
  onCancel: () => void;
}

const TopicContentEditor: React.FC<TopicContentEditorProps> = ({ content, onSave, onCancel }) => {
  const [editedContent, setEditedContent] = useState<TopicContent>({...content});

  const handleSectionUpdate = (index: number, updatedSection: ContentSection) => {
    const newSections = [...editedContent.sections];
    newSections[index] = updatedSection;
    setEditedContent({
      ...editedContent,
      sections: newSections
    });
  };

  const handleAddSection = (type: ContentSection['type']) => {
    let newSection: ContentSection;
    
    switch(type) {
      case 'paragraph':
        newSection = { type, content: 'New paragraph content' };
        break;
      case 'code':
        newSection = { 
          type, 
          content: { 
            language: 'javascript', 
            code: '// Add your code here',
            description: 'Code description'
          } 
        };
        break;
      case 'list':
        newSection = { type, content: ['Item 1', 'Item 2', 'Item 3'] };
        break;
      case 'callout':
        newSection = { type, title: 'Note', content: 'Important information goes here' };
        break;
      default:
        newSection = { type: 'paragraph', content: 'New content' };
    }
    
    setEditedContent({
      ...editedContent,
      sections: [...editedContent.sections, newSection]
    });
  };

  const handleRemoveSection = (index: number) => {
    const newSections = [...editedContent.sections];
    newSections.splice(index, 1);
    setEditedContent({
      ...editedContent,
      sections: newSections
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Topic Content</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Title</label>
        <input 
          type="text" 
          value={editedContent.title} 
          onChange={(e) => setEditedContent({...editedContent, title: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Introduction</label>
        <textarea 
          value={editedContent.introduction} 
          onChange={(e) => setEditedContent({...editedContent, introduction: e.target.value})}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Learning Objectives</label>
        <textarea 
          value={editedContent.learningObjectives.join('\n')} 
          onChange={(e) => {
            const objectives = e.target.value.split('\n').filter(item => item.trim() !== '');
            setEditedContent({...editedContent, learningObjectives: objectives});
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
          placeholder="Enter learning objectives, one per line"
        />
      </div>
      
      <h3 className="text-xl font-semibold mb-3">Content Sections</h3>
      
      {editedContent.sections.map((section, index) => (
        <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Section {index + 1}: {section.type}</h4>
            <button 
              onClick={() => handleRemoveSection(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
          <ContentSectionRenderer 
            section={section} 
            isEditing={true} 
            onUpdate={handleSectionUpdate}
            index={index}
          />
        </div>
      ))}
      
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Add New Section</h4>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleAddSection('paragraph')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Add Paragraph
          </button>
          <button 
            onClick={() => handleAddSection('code')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Add Code Example
          </button>
          <button 
            onClick={() => handleAddSection('list')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Add List
          </button>
          <button 
            onClick={() => handleAddSection('callout')}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Add Callout
          </button>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={() => onSave(editedContent)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default function TopicPage({ params }: { params: { chapterId: string; topicId: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentContent, setCurrentContent] = useState<TopicContent | null>(null);

  // Find the chapter by ID
  const chapterInfo = findChapterById(params.chapterId);
  
  // Return 404 if chapter not found
  if (!chapterInfo) {
    notFound();
  }
  
  const { chapter, categoryId } = chapterInfo;
  const category = curriculumData.find(cat => cat.id === categoryId)!;
  
  // Find the topic within the chapter
  const topicName = findTopicByIdInChapter(chapter, params.topicId);
  
  // Return 404 if topic not found
  if (!topicName) {
    notFound();
  }
  
  // Get the detailed topic content
  const initialTopicContent = getTopicContent(params.topicId);
  
  // Fallback content if the detailed content isn't available - match TopicContent structure
  const fallbackContent: TopicContent = {
    id: params.topicId,
    title: topicName,
    introduction: `Learn about ${topicName} in this comprehensive lesson.`,
    learningObjectives: [`Understand and apply ${topicName} concepts`],
    sections: [{
      type: 'paragraph' as const,
      content: `${topicName} are important concepts in programming. This section will be expanded with detailed content in the future.`
    }],
    relatedResources: [],
    // Add empty optional properties to match the TopicContent type
    quiz: undefined,
    nextTopic: undefined,
    previousTopic: undefined
  };
  
  // Use state to track content
  if (!currentContent) {
    setCurrentContent(initialTopicContent || fallbackContent);
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  const handleSaveContent = (updatedContent: TopicContent) => {
    // In a real application, you would save this to your backend
    console.log('Saving updated content:', updatedContent);
    setCurrentContent(updatedContent);
    setIsEditing(false);
    
    // Here you would typically make an API call to save the changes
    alert('Content updated successfully! In a real application, this would be saved to your backend.');
  };

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
            />
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="breadcrumbs text-sm text-gray-600">
              <Link href="/curriculum" className="hover:text-blue-600">Curriculum</Link>
              <span className="mx-2">›</span>
              <Link href={`/curriculum/${categoryId}`} className="hover:text-blue-600">{category.title}</Link>
              <span className="mx-2">›</span>
              <Link href={`/chapters/${chapter.id}`} className="hover:text-blue-600">{chapter.title}</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">{topicName}</span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Content
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
            <h1 className="text-3xl font-bold mb-6">{currentContent.title}</h1>
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">{currentContent.introduction}</p>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <p className="text-sm text-blue-700">
                  <strong>Learning Objectives:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 mt-2">
                  {currentContent.learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Dynamic Content Sections */}
            {currentContent.sections.map((section, index) => (
              <ContentSectionRenderer 
                key={index} 
                section={section} 
                isEditing={false}
                onUpdate={() => {}}
                index={index}
              />
            ))}
            
            {/* Quiz Section (if available) */}
            {currentContent.quiz && (
              <div className="bg-indigo-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">Knowledge Check</h2>
                <p className="text-gray-700 mb-4">
                  Test your understanding with these questions:
                </p>
                <div className="space-y-6">
                  {currentContent.quiz.questions.map((question, qIndex: number) => (
                    <div key={qIndex} className="bg-white border border-indigo-100 rounded-md p-4">
                      <p className="font-medium mb-3 whitespace-pre-line">{qIndex + 1}. {question.question}</p>
                      <div className="space-y-2 mb-2">
                        {question.options.map((option: string, oIndex: number) => (
                          <div key={oIndex} className="flex items-start">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 text-xs ${oIndex === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                              {String.fromCharCode(65 + oIndex)}
                            </div>
                            <p>{option}</p>
                          </div>
                        ))}
                      </div>
                      <details className="mt-2">
                        <summary className="text-blue-600 cursor-pointer text-sm font-medium">Show explanation</summary>
                        <p className="text-gray-700 mt-2 text-sm bg-blue-50 p-3 rounded">{question.explanation}</p>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Interactive element (placeholder) */}
            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">Interactive Example</h2>
              <p className="text-gray-700 mb-4">
                Try modifying the code below to see how {currentContent.title} work in practice.
              </p>
              <div className="bg-white border border-gray-300 rounded-md p-4 h-40 flex items-center justify-center">
                <p className="text-gray-500">Interactive code editor would be implemented here.</p>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mb-8">
            {currentContent.previousTopic ? (
              <Link 
                href={`/topics/${params.chapterId}/${currentContent.previousTopic.id}`}
                className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {currentContent.previousTopic.title}
              </Link>
            ) : (
              <Link 
                href={`/chapters/${params.chapterId}`}
                className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Chapter
              </Link>
            )}
            
            {currentContent.nextTopic ? (
              <Link 
                href={`/topics/${params.chapterId}/${currentContent.nextTopic.id}`}
                className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
              >
                {currentContent.nextTopic.title}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <Link 
                href={`/chapters/${params.chapterId}`}
                className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
              >
                Complete Chapter
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </Link>
            )}
          </div>

          {/* Related resources */}
          {currentContent.relatedResources.length > 0 && (
            <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
              <ul className="space-y-3">
                {currentContent.relatedResources.map((resource, index) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d={resource.type === 'video' 
                            ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            : resource.type === 'article'
                            ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            : resource.type === 'practice'
                            ? "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            : "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      } />
                    </svg>
                    <a href={resource.url} className="text-blue-600 hover:underline">{resource.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
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