// src/components/RichTextEditor.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  EditorState,
} from 'lexical';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HeadingNode } from '@lexical/rich-text';
import { $getNearestNodeOfType } from '@lexical/utils';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import parse from 'html-react-parser';

// Define the nodes that will be used
const editorConfig = {
  namespace: 'MyRichTextEditor',
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      highlight: 'bg-yellow-200',
    },
    list: {
      ol: 'list-decimal pl-5 my-2',
      ul: 'list-disc pl-5 my-2',
      listitem: 'ml-2',
    },
  },
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [ListNode, ListItemNode, HeadingNode],
};

// Simple functional error boundary
function LexicalErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError] = useState(false);
  
  if (hasError) {
    return <div className="text-red-500 p-4">Something went wrong with the editor.</div>;
  }
  
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

type ToolbarProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
};

function Toolbar({ editor }: ToolbarProps) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);

  // Update active formatting states based on selection
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsUnderline(selection.hasFormat('underline'));
        setIsHighlighted(selection.hasFormat('highlight'));
        
        // Check if selection has a list parent
        const anchorNode = selection.anchor.getNode();
        const listNode = $getNearestNodeOfType(anchorNode, ListNode);
        
        setIsBulletList(!!listNode && listNode.getListType() === 'bullet');
        setIsNumberedList(!!listNode && listNode.getListType() === 'number');
      });
    });
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatHighlight = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border border-gray-300 mb-1 rounded bg-gray-50">
      <button
        type="button"
        className={`p-1 rounded ${isBold ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatBold}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      
      <button
        type="button"
        className={`p-1 rounded ${isItalic ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatItalic}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      
      <button
        type="button"
        className={`p-1 rounded ${isUnderline ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatUnderline}
        title="Underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
          <line x1="4" y1="21" x2="20" y2="21"></line>
        </svg>
      </button>
      
      <button
        type="button"
        className={`p-1 rounded ${isHighlighted ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatHighlight}
        title="Highlight"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"></path>
        </svg>
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      
      <button
        type="button"
        className={`p-1 rounded ${isBulletList ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatBulletList}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      
      <button
        type="button"
        className={`p-1 rounded ${isNumberedList ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
        onClick={formatNumberedList}
        title="Numbered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
      </button>
    </div>
  );
}

// Editor component with toolbar
function Editor({ initialContent, onChange }: { initialContent: string, onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  // Initialize editor with content
  useEffect(() => {
    if (initialContent && initialContent.trim() !== '') {
      editor.update(() => {
        // Create at least one paragraph node to hold our content
        const root = $getRoot();
        root.clear();
        
        // Safer approach - create a paragraph node first
        const paragraphNode = $createParagraphNode();
        root.append(paragraphNode);
        
        try {
          // Then try to parse HTML and add content
          const parser = new DOMParser();
          const dom = parser.parseFromString(initialContent, 'text/html');
          
          // The rest of your code to add content
          if (dom.body.firstChild) {
            const nodes = $generateNodesFromDOM(editor, dom);
            if (nodes.length > 0) {
              // Clear the empty paragraph we created
              root.clear();
              
              // Add all nodes to root
              nodes.forEach(node => {
                // Only append element or decorator nodes to root
                if (node.getType() !== 'text') {
                  root.append(node);
                } else {
                  // If it's a text node, wrap it in a paragraph
                  const paragraph = $createParagraphNode();
                  paragraph.append(node);
                  root.append(paragraph);
                }
              });
            }
          }
        } catch (error) {
          console.error('Error parsing HTML content:', error);
        }
      });
    }
  }, [editor, initialContent]);

  // Handle content changes
  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        // Generate cleaner HTML without pre-wrap styles and unnecessary tags
        const htmlString = $generateHtmlFromNodes(editor, null);
        
        // Process the HTML to remove unwanted style attributes and classes
        const cleanedHtml = cleanHtml(htmlString);
        onChange(cleanedHtml);
      });
    },
    [editor, onChange]
  );
  
  // Helper function to clean HTML
  const cleanHtml = (html: string): string => {
    // Create a temporary DOM element to manipulate the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove dir="ltr" attributes
    const elementsWithDir = tempDiv.querySelectorAll('[dir]');
    elementsWithDir.forEach(el => el.removeAttribute('dir'));
    
    // Remove white-space: pre-wrap styles
    const elementsWithStyle = tempDiv.querySelectorAll('[style*="white-space: pre-wrap"]');
    elementsWithStyle.forEach(el => {
      // Remove only the white-space property while keeping other styles
      const style = el.getAttribute('style');
      if (style) {
        const newStyle = style.replace(/white-space:\s*pre-wrap;?/g, '').trim();
        if (newStyle) {
          el.setAttribute('style', newStyle);
        } else {
          el.removeAttribute('style');
        }
      }
    });
    
    // Simplify formatting tags (keep only one level of formatting)
    const bTags = tempDiv.querySelectorAll('b, strong');
    bTags.forEach(el => {
      if (el.innerHTML.includes('<strong') || el.innerHTML.includes('<b')) {
        el.innerHTML = el.textContent || '';
      }
    });
    
    const iTags = tempDiv.querySelectorAll('i, em');
    iTags.forEach(el => {
      if (el.innerHTML.includes('<em') || el.innerHTML.includes('<i')) {
        el.innerHTML = el.textContent || '';
      }
    });
    
    // Get the cleaned HTML
    return tempDiv.innerHTML;
  };

  return (
    <>
      <Toolbar editor={editor} />
      <div className="relative min-h-32 border border-gray-300 rounded-md p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-32 outline-none" />
          }
          placeholder={
            <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
              Enter content here...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </>
  );
}

interface RichTextEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Editor initialContent={initialContent} onChange={onChange} />
    </LexicalComposer>
  );
}

// Component to render HTML content with proper formatting
export function RichTextDisplay({ content }: { content: string }) {
  // Parse the content and apply any additional processing if needed
  return (
    <div className="rich-text-content">
      {parse(content)}
    </div>
  );
}