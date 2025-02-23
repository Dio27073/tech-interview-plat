'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Editor from "@monaco-editor/react";

interface TestCase {
  input: {
    nums: number[];
    target: number;
  };
  expected: number[];
}

interface TestResult {
  testCase: number;
  input: {
    nums: number[];
    target: number;
  };
  expected: number[];
  output?: number[];
  passed: boolean;
  executionTime?: string;
  error?: string;
}

const testCases: TestCase[] = [
  { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
  { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
];

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState(`// Example solution template
function twoSum(nums: number[], target: number): number[] {
  // Write your solution here
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return []; // No solution found
}`);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);

  const runTests = useCallback(() => {
    setIsRunning(true);
    setError(null);
    setTestResults([]);

    try {
      const results = testCases.map((testCase, index) => {
        try {
          const start = performance.now();
          // Create a safe execution context
          const testFunction = new Function('nums', 'target', 
            `${code}\nreturn twoSum(nums, target);`
          );
          const result = testFunction(testCase.input.nums, testCase.input.target);
          const end = performance.now();
          
          // Compare results without sorting
          const isCorrect = Array.isArray(result) && 
                          result.length === 2 && 
                          testCase.input.nums[result[0]] + testCase.input.nums[result[1]] === testCase.input.target;

          return {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            output: result,
            passed: isCorrect,
            executionTime: (end - start).toFixed(2)
          };
        } catch (e) {
          return {
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            error: e instanceof Error ? e.message : 'Unknown error',
            passed: false
          };
        }
      });

      setTestResults(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runTests();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [runTests]);

  return (
    <div className="w-full h-screen flex">
      {/* Problem Description Panel */}
      <div className="w-1/3 p-4 bg-gray-50 overflow-y-auto border-r">
        <h2 className="text-xl font-bold mb-4">Problem: Two Sum</h2>
        <div className="prose">
          <p className="text-gray-700">
            Given an array of integers nums and an integer target, return indices of the two numbers 
            such that they add up to target.
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Example:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            Input: nums = [2,7,11,15], target = 9
            Output: [0,1]
            Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
          </pre>
          
          <div className="mt-4">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide Hints' : 'Show Hints'} ▾
            </button>
            
            {showHints && (
              <div className="mt-2 text-gray-700">
                <p>1. Consider using a hash map to store complement values</p>
                <p>2. You can solve this in a single pass through the array</p>
                <p>3. Time complexity should be O(n)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor and Output Container */}
      <div className="flex-1 flex flex-col">
        {/* Editor Container */}
        <div className="h-3/5 w-full relative">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              padding: { top: 10 }
            }}
          />
        </div>
        
        {/* Output */}
        <div className="h-2/5 bg-gray-800 text-white overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Output</h3>
            <button 
              className={`px-4 py-2 rounded ${
                isRunning 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? '⌛ Running...' : '▶ Run Tests'}
            </button>
          </div>

          <div className="p-4">
            {error && (
              <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`mb-4 p-4 rounded ${
                  result.passed 
                    ? 'bg-green-900/20 border border-green-700' 
                    : 'bg-red-900/20 border border-red-700'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="mr-2">{result.passed ? '✓' : '✗'}</span>
                  <h4 className="font-medium">Test Case {result.testCase}</h4>
                  {result.executionTime && (
                    <span className="ml-auto text-sm text-gray-400">
                      {result.executionTime}ms
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm">
                  <div>Input: nums = {JSON.stringify(result.input.nums)}, target = {result.input.target}</div>
                  <div>Expected: {JSON.stringify(result.expected)}</div>
                  {result.error ? (
                    <div className="text-red-400">Error: {result.error}</div>
                  ) : (
                    <div>Output: {JSON.stringify(result.output)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;