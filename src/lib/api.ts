/**
 * API client for interacting with AWS backend
 */

import type { TopicContent } from '@/lib/topic-content';

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://m8d4jj30wa.execute-api.us-east-2.amazonaws.com/dev';
const DEBUG = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

/**
 * Fetch a topic by ID from the AWS API
 */
export async function fetchTopicById(topicId: string) {
  if (!topicId) {
    throw new Error('Topic ID is required');
  }

  try {
    if (DEBUG) console.log(`Fetching topic: ${topicId}`);
    
    // Make sure we're using the correct API URL
    const url = `${API_URL}/topics/${topicId}`;
    if (DEBUG) console.log(`API URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 404) {
        if (DEBUG) console.log(`Topic not found: ${topicId}`);
        return null;
      }
      
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (DEBUG) console.log('Topic data received:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching topic:', error);
    throw error;
  }
}

/**
 * Update a topic in the AWS API
 */
export async function updateTopic(topicId: string, topicData: TopicContent) {
  if (!topicId) {
    throw new Error('Topic ID is required');
  }

  try {
    if (DEBUG) console.log(`Updating topic: ${topicId}`, topicData);
    
    // Make sure we're using the correct API URL
    const url = `${API_URL}/topics/${topicId}`;
    if (DEBUG) console.log(`API URL: ${url}`);
    
    // Ensure topicData has the correct ID
    const dataToSend = {
      ...topicData,
      id: topicId,
      updatedAt: new Date().toISOString()
    };
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (DEBUG) console.log('Topic updated:', data);
    
    return data;
  } catch (error) {
    console.error('Error updating topic:', error);
    throw error;
  }
}

/**
 * Delete a topic from the AWS API
 */
export async function deleteTopic(topicId: string) {
  if (!topicId) {
    throw new Error('Topic ID is required');
  }

  try {
    if (DEBUG) console.log(`Deleting topic: ${topicId}`);
    
    const response = await fetch(`${API_URL}/topics/${topicId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (DEBUG) console.log('Topic deleted:', data);
    
    return data;
  } catch (error) {
    console.error('Error deleting topic:', error);
    throw error;
  }
}