// src/app/api-test/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { testApiConnection, fetchTopic, testApiSpecificEndpoint } from '@/lib/api-service';
import { forLoopsContent } from '@/lib/topic-content';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<string>('Not tested');
  const [topicResult, setTopicResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    try {
      const result = await testApiConnection();
      setTestResult(result ? 'Connection successful!' : 'Connection failed');
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForLoopsTopic = async () => {
    setIsLoading(true);
    try {
      const result = await fetchTopic('for-loops');
      setTopicResult(result);
    } catch (error) {
      setTopicResult(null);
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const seedForLoopsTopic = async () => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://a3ggswwdr9.execute-api.us-east-2.amazonaws.com/dev';
      const response = await fetch(`${apiUrl}/topics/for-loops`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forLoopsContent)
      });
      
      if (response.ok) {
        setTestResult('Topic seeded successfully!');
      } else {
        setTestResult(`Seeding failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runSpecificTest = async () => {
    setIsLoading(true);
    try {
      const result = await testApiSpecificEndpoint();
      setTestResult(result ? 'Endpoint accessible!' : 'Endpoint test failed');
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <div className="space-y-8">
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'https://a3ggswwdr9.execute-api.us-east-2.amazonaws.com/dev'}</p>
          <p><strong>Test Result:</strong> {testResult}</p>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={runConnectionTest}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test API Connection
          </button>
          
          <button 
            onClick={fetchForLoopsTopic}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Fetch For Loops Topic
          </button>
          
          <button 
            onClick={seedForLoopsTopic}
            disabled={isLoading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Seed For Loops Topic
          </button>

        <button 
            onClick={runSpecificTest}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
            Test Specific Endpoint
        </button>
        
        </div>
        
        {topicResult && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Topic Data:</h2>
            <div className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-96">
              <pre>{JSON.stringify(topicResult, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}