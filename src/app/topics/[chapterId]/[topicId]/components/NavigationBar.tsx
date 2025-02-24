import React from 'react';
import Link from 'next/link';
import { type Chapter } from '@/lib/curriculum-data';

interface NavigationBarProps {
  chapter: Chapter;
  categoryId: string;
  categoryTitle: string;
  topicName: string;
  onEdit: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ 
  chapter, 
  categoryId, 
  categoryTitle, 
  topicName,
  onEdit
}) => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <div className="breadcrumbs text-sm text-gray-600">
            <Link href="/curriculum" className="hover:text-blue-600">Curriculum</Link>
            <span className="mx-2">›</span>
            <Link href={`/curriculum/${categoryId}`} className="hover:text-blue-600">{categoryTitle}</Link>
            <span className="mx-2">›</span>
            <Link href={`/chapters/${chapter.id}`} className="hover:text-blue-600">{chapter.title}</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{topicName}</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onEdit}
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
  );
};

export default NavigationBar;