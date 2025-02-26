// src/lib/dynamodb-service.ts

import { fetchAuthSession } from 'aws-amplify/auth';
import { TopicContent } from './topic-content';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://a3ggswwdr9.execute-api.us-east-2.amazonaws.com/dev';

// Debug mode for logging
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

// Helper to log in debug mode
const debugLog = (...args: any[]) => {
  if (DEBUG) {
    console.log('[DynamoDB Service]', ...args);
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
    const session = await fetchAuthSession();
    // Get the ID token
    const idToken = session.tokens?.idToken?.toString();
    
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }
    
    return headers;
  } catch (error) {
    debugLog('Error getting auth token:', error);
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
    debugLog(`Fetching topic: ${topicId}, chapter: ${chapterId || 'N/A'}`);
    
    // Get auth headers
    const headers = await getAuthHeaders();
    
    // Build API path
    const apiPath = chapterId 
      ? `/topics/${chapterId}/${topicId}` 
      : `/topics/${topicId}`;
    
    const url = `${API_BASE_URL}${apiPath}`;
    debugLog(`Fetching from URL: ${url}`);
    
    // Make the fetch call
    const response = await fetch(url, {
      method: 'GET',
      headers
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    debugLog('API response:', data);
    return data as TopicContent;
  } catch (error) {
    debugLog('Error fetching topic:', error);
    return null;
  }
}

/**
 * Save a topic to DynamoDB via the API Gateway
 */
export async function saveTopic(content: TopicContent): Promise<boolean> {
  try {
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
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    debugLog('Save response:', data);
    return true;
  } catch (error) {
    console.error('Error saving topic:', error);
    return false;
  }
}

/**
 * Delete a topic from DynamoDB via the API Gateway
 */
export async function deleteTopic(topicId: string, chapterId?: string): Promise<boolean> {
  try {
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
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    debugLog('Delete response:', data);
    return true;
  } catch (error) {
    console.error('Error deleting topic:', error);
    return false;
  }
}