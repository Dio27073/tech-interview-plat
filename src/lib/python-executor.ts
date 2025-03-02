'use client';

// Define types for Pyodide
interface PyodideInterface {
  runPython: (code: string) => any;
  globals: any;
}

// Interface for execution result
export interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  testResults?: {
    passed: boolean;
    message: string;
    expected?: string;
    actual?: string;
  }[];
}

// Global types for Pyodide script
declare global {
  interface Window {
    loadPyodide: (options: any) => Promise<PyodideInterface>;
  }
}

// Loading state tracking
let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;
let loadingPromise: Promise<PyodideInterface> | null = null;

/**
 * Load Pyodide script from CDN
 */
const loadPyodideScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if already loaded
    if (document.querySelector('script[data-pyodide]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
    script.setAttribute('data-pyodide', 'true');
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide script'));
    document.head.appendChild(script);
  });
};

/**
 * Get or initialize Pyodide instance
 */
export async function getPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  isLoading = true;
  
  loadingPromise = (async () => {
    try {
      // Load the script
      await loadPyodideScript();
      
      // Initialize Pyodide
      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
      });

      // Configure stdout/stderr capture
      pyodide.runPython(`
        import sys
        import io
        
        class StringIORedirect:
            def __init__(self):
                self.buffer = io.StringIO()
                
            def write(self, text):
                self.buffer.write(text)
                
            def getvalue(self):
                return self.buffer.getvalue()
                
            def flush(self):
                pass

        stdout_redirect = StringIORedirect()
        stderr_redirect = StringIORedirect()
        
        sys.stdout = stdout_redirect
        sys.stderr = stderr_redirect
      `);
      
      pyodideInstance = pyodide;
      return pyodide;
    } finally {
      isLoading = false;
    }
  })();

  return loadingPromise;
}

/**
 * Clear captured output
 */
function clearOutput(pyodide: PyodideInterface): void {
  pyodide.runPython(`
    sys.stdout.buffer = io.StringIO()
    sys.stderr.buffer = io.StringIO()
  `);
}

/**
 * Get captured stdout output
 */
function getOutput(pyodide: PyodideInterface): string {
  return pyodide.runPython("sys.stdout.getvalue()");
}

/**
 * Get captured stderr output
 */
function getErrorOutput(pyodide: PyodideInterface): string {
  return pyodide.runPython("sys.stderr.getvalue()");
}

/**
 * Execute Python code with timeout
 */
export async function executePythonCode(
  code: string,
  timeoutMs: number = 5000
): Promise<ExecutionResult> {
  try {
    const pyodide = await getPyodide();
    
    // Clear previous output
    clearOutput(pyodide);
    
    // Execute with timeout
    const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
      setTimeout(() => reject(new Error("Execution timed out")), timeoutMs);
    });
    
    const executionPromise = new Promise<ExecutionResult>(async (resolve) => {
      try {
        // Execute the code
        pyodide.runPython(code);
        
        // Get output
        const output = getOutput(pyodide);
        const errorOutput = getErrorOutput(pyodide);
        
        resolve({
          success: true,
          output: output || errorOutput,
        });
      } catch (error) {
        resolve({
          success: false,
          output: getErrorOutput(pyodide),
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });
    
    // Race execution against timeout
    return await Promise.race([executionPromise, timeoutPromise]);
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Execute Python code and validate against test cases
 */
export async function validatePythonSolution(
  userCode: string,
  testCases: Array<{
    input?: any;
    expectedOutput: string;
    testCode: string;
  }>,
  timeoutMs: number = 5000
): Promise<ExecutionResult> {
  try {
    const pyodide = await getPyodide();
    clearOutput(pyodide);
    
    // Execute the user's code first to define functions
    try {
      pyodide.runPython(userCode);
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
        testResults: [
          {
            passed: false,
            message: "Your code has errors and couldn't be executed"
          }
        ]
      };
    }
    
    // Run each test case
    const testResults = [];
    let allPassed = true;
    
    for (const testCase of testCases) {
      clearOutput(pyodide);
      
      try {
        pyodide.runPython(testCase.testCode);
        const output = getOutput(pyodide).trim();
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = output === expectedOutput;
        
        testResults.push({
          passed,
          message: passed 
            ? "Test passed!"
            : "Test failed. Output doesn't match expected value.",
          expected: expectedOutput,
          actual: output
        });
        
        if (!passed) {
          allPassed = false;
        }
      } catch (error) {
        testResults.push({
          passed: false,
          message: "Test execution failed: " + String(error),
          expected: testCase.expectedOutput,
          actual: getErrorOutput(pyodide)
        });
        allPassed = false;
      }
    }
    
    return {
      success: allPassed,
      output: getOutput(pyodide),
      testResults
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error instanceof Error ? error.message : String(error),
      testResults: [
        {
          passed: false,
          message: "An error occurred while testing your code"
        }
      ]
    };
  }
}