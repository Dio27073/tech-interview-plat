// src/app/chapters/[chapterId]/topics/[topicId]/components/PracticeProblemItem.tsx
import React, { useState } from 'react';
import { PracticeProblem } from '@/lib/topic-content';
import CodeEditor from '@/components/CodeEditor';

interface PracticeProblemItemProps {
  problem: PracticeProblem;
  isExpanded: boolean;
  onToggle: () => void;
}

const PracticeProblemItem: React.FC<PracticeProblemItemProps> = ({ 
  problem, 
  isExpanded, 
  onToggle 
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState(problem.starterCode || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleRunCode = () => {
    setIsSubmitting(true);
    setFeedback(null);
    
    // Simple simulation of code execution - in a real app you'd validate against test cases
    setTimeout(() => {
      // This is just a placeholder for actual code validation logic
      const passesTests = userCode.includes(problem.solutionKeywords || '');
      
      if (passesTests) {
        setFeedback('✅ Great job! Your solution works correctly.');
      } else {
        setFeedback('❌ Your solution doesn\'t pass all test cases. Try again or check the hints.');
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Problem header - always visible */}
      <div 
        className={`px-6 py-4 flex justify-between items-center cursor-pointer ${isExpanded ? 'bg-blue-50' : 'bg-gray-50'}`}
        onClick={onToggle}
      >
        <h3 className="text-lg font-medium">
          {problem.title}
          <span className="ml-2 text-sm font-normal text-gray-500">
            {problem.difficulty === 'easy' && '(Easy)'}
            {problem.difficulty === 'medium' && '(Medium)'}
            {problem.difficulty === 'hard' && '(Hard)'}
          </span>
        </h3>
        <div>
          <svg 
            className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t">
          {/* Problem description */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Problem Description</h4>
            <div className="text-gray-700 whitespace-pre-line">
              {problem.description}
            </div>
            
            {/* Examples */}
            {problem.examples && problem.examples.length > 0 && (
              <div className="mt-4 space-y-3">
                <h5 className="font-medium">Examples:</h5>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="font-mono whitespace-pre-line">{example}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Code editor */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Your Solution</h4>
            <CodeEditor
              code={userCode}
              onChange={setUserCode}
              language={problem.language || 'javascript'}
              height="200px"
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleRunCode}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? 'Running...' : 'Run Solution'}
              </button>
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            </div>
            
            {/* Feedback message */}
            {feedback && (
              <div className={`mt-4 p-3 rounded ${feedback.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {feedback}
              </div>
            )}
          </div>
          
          {/* Hint */}
          {showHint && problem.hints && problem.hints.length > 0 && (
            <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold mb-2">Hints</h4>
              <ul className="list-disc list-inside space-y-1">
                {problem.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Solution */}
          {showSolution && problem.solution && (
            <div className="mb-6">
              <h4 className="text-md font-semibold mb-2">Solution</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {problem.solution}
                </pre>
                
                {problem.solutionExplanation && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Explanation:</h5>
                    <p className="text-gray-700">{problem.solutionExplanation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PracticeProblemItem;