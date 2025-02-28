import React from 'react';
import Link from 'next/link';

interface NavigationButtonsProps {
  chapterId: string;
  previousTopic?: {
    id: string;
    title: string;
  };
  nextTopic?: {
    id: string;
    title: string;
  };
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({ 
  chapterId, 
  previousTopic, 
  nextTopic 
}) => {
  return (
    <div className="flex justify-between mb-8">
      {previousTopic ? (
        <Link 
          href={`/chapters/${chapterId}/topics/${previousTopic.id}`}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {previousTopic.title}
        </Link>
      ) : (
        <Link 
          href={`/chapters/${chapterId}`}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Chapter
        </Link>
      )}
      
      {nextTopic ? (
        <Link 
          href={`/chapters/${chapterId}/topics/${nextTopic.id}`}
          className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
        >
          {nextTopic.title}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <Link 
          href={`/chapters/${chapterId}`}
          className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
        >
          Complete Chapter
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default NavigationButtons;