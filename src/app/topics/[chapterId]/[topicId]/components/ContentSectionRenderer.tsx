import React from 'react';
import { 
  type ContentSection, 
  type CodeExample, 
  type ImageContent 
} from '@/lib/topic-content';

interface ContentSectionRendererProps {
  section: ContentSection; 
  isEditing: boolean; 
  onUpdate: (index: number, updatedSection: ContentSection) => void;
  index: number;
}

const ContentSectionRenderer: React.FC<ContentSectionRendererProps> = ({ 
  section, 
  isEditing, 
  onUpdate,
  index
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

export default ContentSectionRenderer;