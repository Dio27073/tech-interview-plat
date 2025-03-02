// src/app/chapters/[chapterId]/topics/[topicId]/components/PracticeProblemItem.tsx
import React, { useState, useEffect } from 'react';
import { PracticeProblem } from '@/lib/topic-content';
import CodeEditor from '@/components/CodeEditor';
import { executePythonCode, validatePythonSolution, ExecutionResult } from '@/lib/python-executor';
import { usePyodide } from '@/app/providers/PyodideProvider';

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
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  
  // Get pyodide state and explicit load function
  const { isLoaded, isLoading, error: pyodideError, loadPyodide } = usePyodide();

  // Try to load Pyodide when component becomes visible
  useEffect(() => {
    if (isExpanded && !isLoaded && !isLoading) {
      console.log('Component expanded, loading Pyodide...');
      loadPyodide();
    }
  }, [isExpanded, isLoaded, isLoading, loadPyodide]);

  // Log states to help with debugging
  useEffect(() => {
    if (isExpanded) {
      console.log('Pyodide state:', { isLoaded, isLoading, pyodideError });
      console.log('Run button should be enabled:', !isRunning && !isSubmitting && isLoaded && !isLoading);
    }
  }, [isExpanded, isLoaded, isLoading, pyodideError, isRunning, isSubmitting]);

  // Generate test cases for this problem
  const generateTestCases = () => {
    // For simple problems, we can check for keywords
    if (problem.id === 'for-loop-basic') {
      return [
        {
          testCode: `
# Run the user's code
${userCode}

# Capture the expected output
expected_output = "1\\n2\\n3\\n4\\n5\\n6\\n7\\n8\\n9\\n10\\n"
          `,
          expectedOutput: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n"
        }
      ];
    }
    else if (problem.id === 'for-loop-sum') {
      return [
        {
          testCode: `
${userCode}

# Test case 1
result = sum_list([1, 2, 3, 4, 5])
print("Result:", result)  # Using same format as user code
      `,
      expectedOutput: "Result: 15"
    },
    {
      testCode: `
${userCode}

# Test case 2
result = sum_list([10, 20, 30])
print("Result:", result)
      `,
      expectedOutput: "Result: 60" 
    }
  ];
}
    // Add more problem-specific test cases here
    
    // Default test: Just run the code and capture output
    return [
      {
        testCode: userCode,
        expectedOutput: "" // This isn't used for simple execution
      }
    ];
  };

  // Run code with validation against expected output
  const handleRunCode = async () => {
    console.log('Run button clicked');
    
    if (!isLoaded) {
      setFeedback("⚠️ Python runtime is not loaded yet. Attempting to load...");
      try {
        await loadPyodide();
        setFeedback("✅ Python runtime loaded. Please try running your code again.");
        return;
      } catch (err) {
        setFeedback(`❌ Failed to load Python runtime: ${err}`);
        return;
      }
    }
    
    setIsRunning(true);
    setFeedback("⏳ Running your code...");
    setExecResult(null);
    
    try {
      // First, just execute the code to get the raw output
      const execResult = await executePythonCode(userCode);
      
      if (!execResult.success) {
        // If there's an execution error, show it
        setFeedback(`❌ Error executing code:\n${execResult.error || "Unknown error"}`);
        setExecResult(execResult);
        return;
      }
      
      // Now validate against expected output
      const testCases = generateTestCases();
      if (testCases.length === 0 || testCases[0].expectedOutput === "") {
        // If no specific test cases for validation, just show success for execution
        setFeedback(`⚠️ Code ran without errors, but couldn't validate correctness\n\nOutput:\n${execResult.output}`);
        setExecResult(execResult);
        return;
      }
      
      // Validate against test cases
      const validationResult = await validatePythonSolution(userCode, [testCases[0]]);  // Just use first test case for "Run"
      setExecResult(validationResult);
      
      if (validationResult.success) {
        setFeedback(`✅ Perfect! Your code produces the expected output.\n\nOutput:\n${execResult.output}`);
      } else {
        // Code executed but output didn't match expectations
        setFeedback(
          `⚠️ Your code ran without errors, but the output doesn't match what's expected.\n\n` +
          `Your output:\n${execResult.output}\n\n` +
          `Expected something like:\n${testCases[0].expectedOutput}`
        );
      }
    } catch (error) {
      console.error('Run code error:', error);
      setFeedback(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Run the code and validate against test cases
  const handleSubmitSolution = async () => {
    if (!isLoaded) {
      setFeedback("⚠️ Python runtime is not loaded yet. Please wait...");
      try {
        await loadPyodide();
        setFeedback("✅ Python runtime loaded. Please try submitting your code again.");
        return;
      } catch (err) {
        setFeedback(`❌ Failed to load Python runtime: ${err}`);
        return;
      }
    }
    
    setIsSubmitting(true);
    setFeedback("⏳ Validating your solution...");
    setExecResult(null);
    
    try {
      const testCases = generateTestCases();
      const result = await validatePythonSolution(userCode, testCases);
      setExecResult(result);
      
      if (result.success) {
        setFeedback("✅ Great job! All tests passed.");
      } else if (result.testResults) {
        const failedTests = result.testResults.filter(t => !t.passed);
        const passedCount = result.testResults.length - failedTests.length;
        
        setFeedback(
          `❌ ${passedCount}/${result.testResults.length} tests passed.\n\n` +
          failedTests.map((test, i) => 
            `Test ${i+1}: ${test.message}\n` + 
            (test.expected ? `Expected: ${test.expected}\n` : '') +
            (test.actual ? `Actual: ${test.actual}` : '')
          ).join('\n\n')
        );
      } else if (result.error) {
        setFeedback(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Submit solution error:', error);
      setFeedback(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSubmitting(false);
    }
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
          
          {/* Pyodide loading status */}
          {isLoading && (
            <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading Python interpreter...</span>
              </div>
            </div>
          )}
          
          {pyodideError && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
              <p className="font-medium">Failed to load Python interpreter:</p>
              <p>{pyodideError}</p>
              <button 
                onClick={() => loadPyodide()}
                className="mt-2 px-2 py-1 bg-red-100 rounded hover:bg-red-200"
              >
                Retry Loading
              </button>
            </div>
          )}
          
          {/* Code editor */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2">Your Solution</h4>
            <CodeEditor
              code={userCode}
              onChange={setUserCode}
              language={problem.language || 'python'}
              height="200px"
            />
            
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className={`px-4 py-2 ${isRunning || isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white rounded transition`}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              
              <button
                onClick={handleSubmitSolution}
                disabled={isRunning || isSubmitting}
                className={`px-4 py-2 ${isRunning || isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'} text-white rounded transition`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
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
              <div className={`mt-4 p-3 rounded whitespace-pre-line font-mono text-sm ${
                feedback.includes('✅') ? 'bg-green-50 text-green-800' : 
                feedback.includes('⏳') ? 'bg-blue-50 text-blue-800' :
                feedback.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' : 
                'bg-red-50 text-red-800'
              }`}>
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