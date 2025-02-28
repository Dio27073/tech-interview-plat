import React from 'react';

interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'practice' | 'documentation' | 'other';
}

interface RelatedResourcesProps {
  resources?: Resource[]; // Make resources optional
}

const RelatedResources: React.FC<RelatedResourcesProps> = ({ resources = [] }) => {
  // Default to empty array if resources is undefined
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Related Resources</h2>
      <ul className="space-y-3">
        {resources.map((resource, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={resource.type === 'video' 
                    ? "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    : resource.type === 'article'
                    ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    : resource.type === 'practice'
                    ? "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    : resource.type === 'documentation'
                    ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    : "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                } />
            </svg>
            <a href={resource.url} className="text-blue-600 hover:underline">{resource.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedResources;