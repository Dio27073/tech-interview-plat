import React, { useState, useEffect, useCallback, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { Clock, Play, Check, X, ChevronDown, ChevronUp, Code2, Timer } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'java';

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

const SUPPORTED_LANGUAGES: Record<SupportedLanguage, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  java: 'Java'
};

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  typescript: `function twoSum(nums: number[], target: number): number[] {
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
}`,
  javascript: `function twoSum(nums, target) {
    // Write your solution here
}`,
  python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`
};

const testCases: TestCase[] = [
  { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
  { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
  { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
];

const CodeEditor = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('typescript');
  const [code, setCode] = useState(DEFAULT_CODE[language]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const startTimer = useCallback(() => {
    setIsTimerActive(true);
    setTimeElapsed(0);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      setIsTimerActive(false);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage]);
    setTestResults([]);
    setError(null);
  };

  const runTests = useCallback(() => {
    if (!isTimerActive) {
      startTimer();
    }
    setIsRunning(true);
    setError(null);
    setTestResults([]);

    try {
      const results = testCases.map((testCase, index) => {
        try {
          const start = performance.now();
          // Create a safe execution context
          const testFunction = new Function('nums', 'target', 
            `${code}\nreturn ${language === 'java' ? 'new Solution().twoSum' : 'twoSum'}(nums, target);`
          );
          const result = testFunction(testCase.input.nums, testCase.input.target);
          const end = performance.now();
          
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
      
      if (results.every(r => r.passed)) {
        stopTimer();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  }, [code, language, isTimerActive, startTimer, stopTimer]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        runTests();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [runTests]);

  return (
    <div className="w-full h-screen flex">
      {/* Problem Description Panel */}
      <div className="w-1/3 p-4 bg-gray-50 overflow-y-auto border-r">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Problem: Two Sum</h2>
          {isTimerActive && (
            <div className="flex items-center text-gray-600">
              <Timer className="w-4 h-4 mr-1" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
          )}
        </div>

        <div className="prose">
          <p className="text-gray-700">
            Given an array of integers nums and an integer target, return indices of the two numbers 
            such that they add up to target.
          </p>
          
          <div className="my-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Constraints:</h3>
            <ul className="list-disc pl-4 text-sm text-blue-700">
              <li>2 ≤ nums.length ≤ 10^4</li>
              <li>-10^9 ≤ nums[i] ≤ 10^9</li>
              <li>-10^9 ≤ target ≤ 10^9</li>
              <li>Only one valid answer exists</li>
            </ul>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">Example:</h3>
          <pre className="bg-gray-100 p-2 rounded">
            Input: nums = [2,7,11,15], target = 9
            Output: [0,1]
            Explanation: Because nums[0] + nums[1] == 9
          </pre>
          
          <div className="mt-4">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
              {showHints ? 'Hide Hints' : 'Show Hints'}
            </button>
            
            {showHints && (
              <div className="mt-2 space-y-2 text-gray-700">
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
        {/* Language Selector and Controls */}
        <div className="bg-gray-100 border-b flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            <Code2 className="w-4 h-4 text-gray-600" />
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-white border rounded px-2 py-1 text-sm"
            >
              {Object.entries(SUPPORTED_LANGUAGES).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              className={`px-4 py-1 rounded text-sm flex items-center ${
                isRunning 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={runTests}
              disabled={isRunning}
            >
              {isRunning ? (
                <>⌛ Running...</>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  Run Tests
                </>
              )}
            </button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="h-3/5 w-full relative">
          <Editor
            height="100%"
            language={language}
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
              padding: { top: 10 },
              suggestOnTriggerCharacters: true,
              quickSuggestions: true
            }}
          />
        </div>
        
        {/* Output */}
        <div className="h-2/5 bg-gray-800 text-white overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
          </div>

          <div className="p-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
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
                  {result.passed ? (
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                  ) : (
                    <X className="w-4 h-4 text-red-500 mr-2" />
                  )}
                  <h4 className="font-medium">Test Case {result.testCase}</h4>
                  {result.executionTime && (
                    <span className="ml-auto text-sm text-gray-400 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {result.executionTime}ms
                    </span>
                  )}
                </div>

                <div className="font-mono text-sm space-y-1">
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