'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getPyodide } from '@/lib/python-executor';

interface PyodideContextType {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  loadPyodide: () => Promise<void>; // Added explicit load function
}

const PyodideContext = createContext<PyodideContextType>({
  isLoading: false,
  isLoaded: false,
  error: null,
  loadPyodide: async () => {} // Default no-op implementation
});

export const usePyodide = () => useContext(PyodideContext);

export const PyodideProvider: React.FC<{
  children: React.ReactNode;
  preload?: boolean;
}> = ({ children, preload = true }) => { // Changed default to true
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a reusable loading function
  const loadPyodideInstance = async () => {
    // Don't try to load if already loading or loaded
    if (isLoading || isLoaded) return;
    
    setIsLoading(true);
    try {
      await getPyodide();
      setIsLoaded(true);
      setError(null);
      console.log('✅ Pyodide loaded successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.error('❌ Failed to load Pyodide:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Preload on mount if requested
  useEffect(() => {
    if (preload) {
      loadPyodideInstance();
    }
  }, [preload]); // Only depend on preload

  // Provide context with all needed values including the load function
  return (
    <PyodideContext.Provider
      value={{
        isLoading,
        isLoaded,
        error,
        loadPyodide: loadPyodideInstance
      }}
    >
      {children}
    </PyodideContext.Provider>
  );
};

export default PyodideProvider;