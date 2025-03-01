// src/app/chapters/[chapterId]/topics/[topicId]/components/TopicContent.tsx
import React, { useState } from 'react';
import { type TopicContent as TopicContentInterface } from '@/lib/topic-content';
import ContentSectionRenderer from './ContentSectionRenderer';
import QuizSection from './QuizSection';
import InteractiveExample from './InteractiveExample';
import PracticeProblemsSection from './PracticeProblemsSection';

interface TopicContentProps {
  content: TopicContentInterface;
}

const TopicContent: React.FC<TopicContentProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'practice'>('content');

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('content')}
            className={`${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`${
              activeTab === 'practice'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Practice Problems
          </button>
        </nav>
      </div>
      
      {/* Content Tab */}
      {activeTab === 'content' && (
        <>
          {/* Introduction */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">{content.introduction}</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-700">
                <strong>Learning Objectives:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 mt-2">
                {content.learningObjectives?.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Dynamic Content Sections */}
          {content.sections?.map((section, index) => (
            <ContentSectionRenderer 
              key={index} 
              section={section} 
              isEditing={false}
              onUpdate={() => {}}
              index={index}
            />
          ))}
          
          {/* Quiz Section (if available) */}
          {content.quiz && <QuizSection quiz={content.quiz} />}
          
          {/* Interactive example */}
          <InteractiveExample topicTitle={content.title} />
        </>
      )}
      
      {/* Practice Problems Tab */}
      {activeTab === 'practice' && (
        <PracticeProblemsSection 
          topicId={content.id}
          // Ensure problems is an array, even if practiceProblems is undefined
          problems={content.practiceProblems || []} 
        />
      )}
    </div>
  );
};

export default TopicContent;