import React from 'react';
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from 'monaco-editor';

// Types for supported languages with Python as a priority
export type SupportedLanguage = 'python' | 'javascript' | 'typescript' | 'java' | 'c' | 'cpp';

// Python-specific editor settings using the correct type
const PYTHON_EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: 'on',
  padding: { top: 10 },
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
};

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  theme?: string;
  placeholder?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language = 'python',
  height = "400px",
  readOnly = false,
  theme = "vs-dark",
}) => {
  // Map common language names to Monaco editor language IDs
  const getMonacoLanguage = (lang: string): string => {
    const langMap: Record<string, string> = {
      'python': 'python',
      'py': 'python',
      'javascript': 'javascript',
      'js': 'javascript',
      'typescript': 'typescript',
      'ts': 'typescript',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'c++': 'cpp'
    };
    
    return langMap[lang.toLowerCase()] || 'python'; // Default to Python if not found
  };

  // Determine indentation for the language
  const getEditorOptions = (lang: string): editor.IStandaloneEditorConstructionOptions => {
    const baseOptions: editor.IStandaloneEditorConstructionOptions = {
      ...PYTHON_EDITOR_OPTIONS,
      readOnly
    };
    
    // JavaScript and TypeScript typically use 2 spaces
    if (lang === 'javascript' || lang === 'typescript') {
      return {
        ...baseOptions,
        tabSize: 2
      };
    }
    
    return baseOptions;
  };

  return (
    <div style={{ height, width: '100%' }}>
      <Editor
        height="100%"
        language={getMonacoLanguage(language)}
        value={code}
        onChange={(value) => onChange(value || '')}
        theme={theme}
        options={getEditorOptions(getMonacoLanguage(language))}
        beforeMount={(monaco: Monaco) => {
          // Set Python-specific features
          monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model, position) => {
              const wordInfo = model.getWordUntilPosition(position);
              const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordInfo.startColumn,
                endColumn: wordInfo.endColumn
              };
              
              // Add some Python-specific suggestions
              return {
                suggestions: [
                  {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'for ${1:item} in ${2:items}:\n\t${0}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range
                  },
                  {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'if ${1:condition}:\n\t${0}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range
                  },
                  {
                    label: 'def',
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: 'def ${1:function_name}(${2:parameters}):\n\t${0}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range
                  },
                  {
                    label: 'print',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'print(${0})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range
                  },
                  {
                    label: 'range',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'range(${1:start}, ${2:end}, ${3:step})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range
                  }
                ]
              };
            }
          });
        }}
      />
    </div>
  );
};

export default CodeEditor;