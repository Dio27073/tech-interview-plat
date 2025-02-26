'use client';

import React from 'react';
import { type TopicContent as TopicContentInterface } from '@/lib/topic-content';
import ContentSectionRenderer from './ContentSectionRenderer';
import QuizSection from './QuizSection';
import InteractiveExample from './InteractiveExample';
import { FormattedText, TextWithFormatting } from './FormattedText';

export default function TopicContentDisplay({ content }: { content: TopicContentInterface }) {
  if (!content) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
        No content found for this topic
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      
      {/* Introduction */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Introduction</h2>
        <div className="text-gray-700 mb-4">
          <TextWithFormatting text={content.introduction} />
        </div>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="text-sm text-blue-700">
            <strong>Learning Objectives:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-700 mt-2">
            {content.learningObjectives?.map((objective, index) => (
              <li key={index}>
                <FormattedText text={objective} />
              </li>
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
    </div>
  );
}