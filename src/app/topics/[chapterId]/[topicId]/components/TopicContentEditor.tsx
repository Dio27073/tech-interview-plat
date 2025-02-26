import React, { useState } from 'react';
import { 
  type ContentSection, 
  type TopicContent,
  saveTopicContent,
  resetTopicContent
} from '@/lib/topic-content';
import ContentSectionRenderer from './ContentSectionRenderer';
import { TextWithFormatting } from './FormattedText';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TopicContentEditorProps {
  content: TopicContent;
  onSave: (updatedContent: TopicContent) => void;
  onCancel: () => void;
  onReset: () => void;
}

const TopicContentEditor: React.FC<TopicContentEditorProps> = ({ 
  content, 
  onSave, 
  onCancel, 
  onReset 
}) => {
  const [editedContent, setEditedContent] = useState<TopicContent>({
    ...content,
    title: content.title || '',
    id: content.id,
    introduction: content.introduction || '',
    learningObjectives: content.learningObjectives || [],
    sections: content.sections || []
  });
  const [isPreviewingIntro, setIsPreviewingIntro] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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

  // Functions for moving sections up and down
  const handleMoveSectionUp = (index: number) => {
    if (index === 0) return; // Can't move up if already at top
    
    const newSections = [...editedContent.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index - 1];
    newSections[index - 1] = temp;
    
    setEditedContent({
      ...editedContent,
      sections: newSections
    });
  };

  const handleMoveSectionDown = (index: number) => {
    if (index === editedContent.sections.length - 1) return; // Can't move down if already at bottom
    
    const newSections = [...editedContent.sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + 1];
    newSections[index + 1] = temp;
    
    setEditedContent({
      ...editedContent,
      sections: newSections
    });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      // Save the content using our updated API function
      const success = await saveTopicContent(editedContent);
      
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000); // Clear success message after 3 seconds
        onSave(editedContent);
      } else {
        setSaveError('Failed to save changes. Please try again.');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveError('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetContent = async () => {
    setIsResetting(true);
    setSaveError(null);
    
    try {
      // Confirm with the user
      const confirmed = window.confirm(
        'Are you sure you want to reset this content to the default? All your changes will be lost.'
      );
      
      if (!confirmed) {
        setIsResetting(false);
        return;
      }
      
      // Reset the content using our updated API function
      const success = await resetTopicContent(editedContent.id);
      
      if (success) {
        onReset(); // Notify parent component
      } else {
        setSaveError('Failed to reset content. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting content:', error);
      setSaveError('An error occurred while resetting. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Topic Content</h2>
      
      {saveError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{saveError}</AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>Changes saved successfully!</AlertDescription>
        </Alert>
      )}
      
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
        <div className="flex justify-between items-center mb-2">
          <label className="block text-gray-700 font-medium">Introduction</label>
          <button
            type="button"
            onClick={() => setIsPreviewingIntro(!isPreviewingIntro)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isPreviewingIntro ? "Edit" : "Preview"}
          </button>
        </div>
        
        {isPreviewingIntro ? (
          <div className="w-full border border-gray-300 rounded-md p-3 min-h-24 bg-gray-50">
            <div className="text-gray-700">
              <TextWithFormatting text={editedContent.introduction} />
            </div>
          </div>
        ) : (
          <textarea 
            value={editedContent.introduction} 
            onChange={(e) => setEditedContent({...editedContent, introduction: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
            placeholder="Enter introduction content. Use * or - for bullet points, one per line. Use **text** for bold text."
          />
        )}
        <p className="text-xs text-gray-500 mt-1">
          Formatting: Use **text** to make text bold. Use * or - at the start of a line for bullet points.
        </p>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Learning Objectives</label>
        <textarea 
          value={editedContent.learningObjectives?.join('\n') || ''} 
          onChange={(e) => {
            const objectives = e.target.value.split('\n').filter(item => item.trim() !== '');
            setEditedContent({...editedContent, learningObjectives: objectives});
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-24"
          placeholder="Enter learning objectives, one per line. Use **text** for bold text."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use **text** to make text bold in your learning objectives.
        </p>
      </div>
      
      <h3 className="text-xl font-semibold mb-3">Content Sections</h3>
      
      {editedContent.sections?.map((section, index) => (
        <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-700">Section {index + 1}: {section.type}</h4>
            <div className="flex items-center gap-2">
              {/* Reordering buttons */}
              <button 
                onClick={() => handleMoveSectionUp(index)}
                disabled={index === 0}
                className={`p-1 rounded-md ${index === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                title="Move section up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button 
                onClick={() => handleMoveSectionDown(index)}
                disabled={index === editedContent.sections.length - 1}
                className={`p-1 rounded-md ${index === editedContent.sections.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:bg-blue-100'}`}
                title="Move section down"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button 
                onClick={() => handleRemoveSection(index)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1 rounded-md"
                title="Remove section"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
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
          onClick={handleResetContent}
          disabled={isResetting}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
        >
          {isResetting ? 'Resetting...' : 'Reset to Default'}
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default TopicContentEditor;