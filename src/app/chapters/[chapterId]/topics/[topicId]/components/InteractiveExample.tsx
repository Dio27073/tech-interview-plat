import React, { useState, useEffect } from 'react';
import CodeEditor from '@/components/CodeEditor';
import { executePythonCode } from '@/lib/python-executor';
import { InteractiveExample as ExampleType } from '@/lib/interactive-examples-data';

interface InteractiveExampleProps {
  example: ExampleType;
}

const InteractiveExample: React.FC<InteractiveExampleProps> = ({ example }) => {
  const [code, setCode] = useState<string>(example.code);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showExpectedOutput, setShowExpectedOutput] = useState<boolean>(false);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);

  // Reset state when example changes
  useEffect(() => {
    setCode(example.code);
    setOutput('');
    setError(null);
    setShowExpectedOutput(false);
  }, [example]);

  useEffect(() => {
    // Check if Pyodide is loaded or not
    const checkPyodideStatus = async () => {
      try {
        // We can run a simple Python command to see if Pyodide is ready
        await executePythonCode('print("Pyodide check")', 2000);
        setIsPyodideReady(true);
      } catch (_error) {
        console.log('Pyodide not ready yet, will retry');
        setTimeout(checkPyodideStatus, 1000);
      }
    };
    
    if (!isPyodideReady) {
      checkPyodideStatus();
    }
  }, [isPyodideReady]);

  const handleRunCode = async () => {
    setIsExecuting(true);
    setOutput('');
    setError(null);
    
    try {
      const result = await executePythonCode(code);
      
      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error || 'An error occurred during execution');
        setOutput(result.output);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleResetCode = () => {
    setCode(example.code);
    setOutput('');
    setError(null);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg">
      <p className="text-gray-700 mb-4">{example.description}</p>
      
      <div className="mb-4">
        <CodeEditor 
          code={code} 
          onChange={handleCodeChange} 
          language="python" 
          height="200px"
          theme="vs-dark"
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleRunCode}
          disabled={!isPyodideReady || isExecuting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isExecuting ? 'Running...' : 'Run Code'}
        </button>
        
        <button
          onClick={handleResetCode}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Reset Code
        </button>
        
        {example.expectedOutput && (
          <button
            onClick={() => setShowExpectedOutput(!showExpectedOutput)}
            className="text-blue-600 hover:text-blue-800 px-4 py-2 ml-auto"
          >
            {showExpectedOutput ? 'Hide Expected Output' : 'Show Expected Output'}
          </button>
        )}
      </div>
      
      {showExpectedOutput && example.expectedOutput && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Expected Output:</h3>
          <div className="bg-gray-800 text-white p-3 rounded font-mono whitespace-pre-wrap">
            {example.expectedOutput}
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-md font-medium mb-2">Output:</h3>
        <div className="bg-gray-800 text-white p-3 rounded font-mono h-40 overflow-y-auto whitespace-pre-wrap">
          {error ? (
            <span className="text-red-400">{error}</span>
          ) : output ? (
            output
          ) : (
            <span className="text-gray-400">Run the code to see the output</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveExample;