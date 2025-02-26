// src/lib/api-service.ts
import { fetchAuthSession } from 'aws-amplify/auth';
import { TopicContent } from './topic-content';

// API endpoint with fallback and debugging
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://a3ggswwdr9.execute-api.us-east-2.amazonaws.com/dev';

// Debug mode for logging
const DEBUG = true; // Force debug mode on to diagnose the issue

// Helper to log in debug mode
const debugLog = (...args: any[]) => {
  if (DEBUG) {
    console.log('[API Service]', ...args);
  }
};

/**
 * Get authentication headers for API requests
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    // Create a consistent headers object
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // Get the current session using Amplify v6 syntax
    try {
      const session = await fetchAuthSession();
      // Get the ID token
      const idToken = session.tokens?.idToken?.toString();
      
      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
        debugLog('Auth token obtained successfully');
      } else {
        debugLog('No auth token available');
      }
    } catch (authError: unknown) {
      console.error('Auth session error:', authError);
      debugLog('Proceeding without auth token');
    }
    
    return headers;
  } catch (error: unknown) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json'
    };
  }
}

/**
 * Fetch a topic from DynamoDB via the API Gateway
 */
export async function fetchTopic(topicId: string, chapterId?: string): Promise<TopicContent | null> {
  try {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined! Check your .env.local file');
      debugLog('NEXT_PUBLIC_API_URL environment variable is missing');
      return null;
    }
    
    debugLog(`Fetching topic: ${topicId}, chapter: ${chapterId || 'N/A'}`);
    
    // Get auth headers
    const headers = await getAuthHeaders();
    
    // Build API path
    const apiPath = chapterId 
      ? `/topics/${chapterId}/${topicId}` 
      : `/topics/${topicId}`;
    
    const url = `${API_BASE_URL}${apiPath}`;
    debugLog(`Fetching from URL: ${url}`);
    debugLog(`Using headers:`, headers);
    
    // Attempt fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      // Make the fetch call
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      debugLog(`Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      debugLog('API response data:', data);
      return data as TopicContent;
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      // Check if it's an AbortError
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('Request timed out after 10 seconds');
      }
      throw fetchError;
    }
  } catch (error: unknown) {
    console.error('Error fetching topic:', error);
    
    // More detailed error feedback
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.error(`
        Network error - possible causes:
        1. API Gateway URL is incorrect: ${API_BASE_URL}
        2. CORS is not configured on API Gateway
        3. API Gateway/Lambda is not deployed or is offline
        4. Network connectivity issues
      `);
    }
    
    return null;
  }
}

/**
 * Test the API connectivity
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined! Check your .env.local file');
      return false;
    }
    
    // Simple ping to the API root
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/topics/for-loops`;
    
    debugLog(`Testing API connection to: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    
    debugLog(`API test response status: ${response.status}`);
    
    return response.ok;
  } catch (error: unknown) {
    console.error('API connection test failed:', error);
    return false;
  }
}

/**
 * Save a topic to DynamoDB via the API Gateway
 */
export async function saveTopic(content: TopicContent): Promise<boolean> {
  try {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined! Check your .env.local file');
      return false;
    }
    
    debugLog(`Saving topic: ${content.id}`);
    
    if (!content.id) {
      console.error('Cannot save topic without an ID');
      return false;
    }
    
    // Get auth headers
    const headers = await getAuthHeaders();
    
    // Build API path
    const apiPath = content.chapterId 
      ? `/topics/${content.chapterId}/${content.id}` 
      : `/topics/${content.id}`;
    
    const url = `${API_BASE_URL}${apiPath}`;
    debugLog(`Saving to URL: ${url}`);
    
    // Make the fetch call
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(content)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    debugLog('Save response:', data);
    return true;
  } catch (error: unknown) {
    console.error('Error saving topic:', error);
    
    if (error instanceof Error) {
      debugLog('Error message:', error.message);
    }
    
    return false;
  }
}

/**
 * Delete a topic from DynamoDB via the API Gateway
 */
export async function deleteTopic(topicId: string, chapterId?: string): Promise<boolean> {
  try {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined! Check your .env.local file');
      return false;
    }
    
    debugLog(`Deleting topic: ${topicId}`);
    
    // Get auth headers
    const headers = await getAuthHeaders();
    
    // Build API path
    const apiPath = chapterId 
      ? `/topics/${chapterId}/${topicId}` 
      : `/topics/${topicId}`;
    
    const url = `${API_BASE_URL}${apiPath}`;
    debugLog(`Deleting from URL: ${url}`);
    
    // Make the fetch call
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    debugLog('Delete response:', data);
    return true;
  } catch (error: unknown) {
    console.error('Error deleting topic:', error);
    
    if (error instanceof Error) {
      debugLog('Error message:', error.message);
    }
    
    return false;
  }
}

// src/lib/api-service.ts - add this temporary test function
export async function testApiSpecificEndpoint(): Promise<boolean> {
  try {
    // Test a specific endpoint instead of the root
    const apiUrl = API_BASE_URL || 'https://a3ggswwdr9.execute-api.us-east-2.amazonaws.com/dev';
    const url = `${apiUrl}/topics/for-loops`;
    
    console.log(`Testing specific endpoint: ${url}`);
    
    // Just do a preflight check
    const response = await fetch(url, {
      method: 'OPTIONS'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Endpoint test failed:', error);
    return false;
  }
}