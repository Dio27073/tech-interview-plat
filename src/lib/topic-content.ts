// src/lib/topic-content.ts

// Import Amplify auth functions
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Import our API service
import { fetchTopic, saveTopic, deleteTopic } from './api-service';

// Type definitions unchanged...
export type CodeExample = {
  language: string;
  code: string;
  description?: string;
};

export type ImageContent = {
  src: string;
  alt: string;
  caption?: string;
};

export type ContentSection = {
  type: 'paragraph' | 'code' | 'list' | 'image' | 'callout';
  title?: string;
  content: string | string[] | CodeExample | ImageContent;
};

export type TopicContent = {
  id: string;
  title: string;
  introduction: string;
  learningObjectives: string[];
  sections: ContentSection[];
  quiz?: {
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  };
  relatedResources: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'practice' | 'documentation';
  }[];
  nextTopic?: {
    id: string;
    title: string;
  };
  previousTopic?: {
    id: string;
    title: string;
  };
  lastUpdated?: number; // Timestamp for tracking updates
  userId?: string; // To track which user made the update
  chapterId?: string; // Add chapterId to track which chapter this topic belongs to
};

// Sample content for "For Loops" topic
export const forLoopsContent: TopicContent = {
  id: 'for-loops',
  title: 'For Loops',
  introduction: 'For loops are one of the most common control structures in programming, allowing you to execute a block of code repeatedly for a specific number of iterations.',
  learningObjectives: [
    'Understand the basic structure of for loops',
    'Learn how to use for loops to iterate over arrays and collections',
    'Master common for loop patterns and best practices',
    'Avoid common pitfalls like off-by-one errors'
  ],
    sections: [
      {
        type: 'paragraph',
        title: 'Basic Structure',
        content: 'A for loop consists of three main parts: initialization, condition, and iteration. The initialization happens once at the beginning, the condition is checked before each iteration, and the iteration statement runs after each loop cycle.'
      },
      {
        type: 'code',
        title: 'Standard For Loop Syntax',
        content: {
          language: 'javascript',
          code: `// Basic for loop structure
  for (let i = 0; i < 5; i++) {
    console.log("Iteration number " + i);
  }
  
  // This will output:
  // Iteration number 0
  // Iteration number 1
  // Iteration number 2
  // Iteration number 3
  // Iteration number 4`,
          description: 'A basic for loop that iterates 5 times, from 0 to 4.'
        }
      },
      {
        type: 'list',
        title: 'Core Components',
        content: [
          'Initialization (let i = 0): Runs once before the loop starts',
          'Condition (i < 5): Checked before each iteration; loop continues while true',
          'Iteration (i++): Executes after each iteration',
          'Loop body: The code that runs during each iteration'
        ]
      },
      {
        type: 'paragraph',
        title: 'Iterating Over Arrays',
        content: 'One of the most common uses of for loops is to iterate over elements in an array. You can access each element using its index.'
      },
      {
        type: 'code',
        title: 'Array Iteration Example',
        content: {
          language: 'javascript',
          code: `const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  
  // Iterating over array elements
  for (let i = 0; i < fruits.length; i++) {
    console.log(\`Fruit at index \${i}: \${fruits[i]}\`);
  }`,
          description: 'Using a for loop to iterate through each element in an array.'
        }
      },
      {
        type: 'callout',
        title: 'Common Pitfalls',
        content: 'When working with for loops, be careful of these common mistakes:\n- Off-by-one errors (forgetting that arrays are 0-indexed)\n- Infinite loops (forgetting to increment the counter)\n- Modifying the array while iterating it'
      },
      {
        type: 'paragraph',
        title: 'Modern Alternatives',
        content: 'Modern JavaScript provides alternatives to traditional for loops that can be more readable and less error-prone for certain tasks.'
      },
      {
        type: 'code',
        title: 'Modern Iteration Methods',
        content: {
          language: 'javascript',
          code: `const numbers = [1, 2, 3, 4, 5];
  
  // forEach method
  numbers.forEach((number, index) => {
    console.log(\`Number at index \${index}: \${number}\`);
  });
  
  // map method (creates a new array)
  const doubled = numbers.map(number => number * 2);
  console.log(doubled); // [2, 4, 6, 8, 10]
  
  // for...of loop (ES6)
  for (const number of numbers) {
    console.log(number);
  }`,
          description: 'Modern JavaScript provides several cleaner ways to iterate over collections.'
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What will be the output of this code?\n\nfor (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
          options: [
            '0, 1, 2',
            '1, 2, 3',
            '1, 2, 3, 4',
            'The loop will run infinitely'
          ],
          correctAnswer: 1,
          explanation: 'The loop starts with i=1, and continues as long as i <= 3, so it will print 1, 2, and 3.'
        },
        {
          question: 'Which component of a for loop runs only once at the beginning?',
          options: [
            'Condition',
            'Initialization',
            'Iteration',
            'Loop body'
          ],
          correctAnswer: 1,
          explanation: 'The initialization statement (like let i = 0) only runs once at the beginning of the loop.'
        }
      ]
    },
    relatedResources: [
      {
        title: 'Advanced Loop Techniques',
        url: '/articles/advanced-loops',
        type: 'article'
      },
      {
        title: 'For Loop vs. While Loop: Which to Use?',
        url: '/videos/loop-comparisons',
        type: 'video'
      },
      {
        title: 'Loop Challenge Exercises',
        url: '/practice/loops',
        type: 'practice'
      }
    ],
    nextTopic: {
      id: 'while-loops',
      title: 'While Loops'
    },
    previousTopic: {
      id: 'conditionals',
      title: 'Conditional Statements'
    }
  };
  
  // Sample content for "While Loops" topic
  export const whileLoopsContent: TopicContent = {
    id: 'while-loops',
    title: 'While Loops',
    introduction: 'While loops are used when you need to execute a block of code repeatedly as long as a specific condition remains true, but you might not know in advance how many iterations will be needed.',
    learningObjectives: [
      'Understand the structure and purpose of while loops',
      'Learn when to use while loops instead of for loops',
      'Master techniques for ensuring your while loops terminate properly',
      'Understand the difference between while and do-while loops'
    ],
    sections: [
      {
        type: 'paragraph',
        title: 'Basic Structure',
        content: 'A while loop consists of a condition and a block of code. As long as the condition evaluates to true, the code block will continue to execute. Unlike for loops, while loops don\'t have built-in initialization or iteration statements.'
      },
      {
        type: 'code',
        title: 'Standard While Loop Syntax',
        content: {
          language: 'javascript',
          code: `// Basic while loop structure
  let count = 0;
  while (count < 5) {
    console.log(\`Count: \${count}\`);
    count++; // Important: without this, the loop would run forever!
  }`,
          description: 'A basic while loop that iterates 5 times.'
        }
      },
      {
        type: 'paragraph',
        title: 'Use Cases for While Loops',
        content: 'While loops are particularly useful when you don\'t know in advance how many iterations you\'ll need. They\'re commonly used for things like reading input until a certain condition is met, or processing data until it\'s in a certain state.'
      },
      {
        type: 'code',
        title: 'Example: Processing Until Condition Met',
        content: {
          language: 'javascript',
          code: `// Finding the first power of 2 greater than 1000
  let num = 1;
  while (num <= 1000) {
    num *= 2;
  }
  console.log(\`First power of 2 greater than 1000: \${num}\`); // 1024`,
          description: 'This while loop continues doubling a number until it exceeds 1000.'
        }
      },
      {
        type: 'callout',
        title: 'Preventing Infinite Loops',
        content: 'Be extremely careful to ensure your while loop\'s condition will eventually become false. Always make sure the condition is being properly updated within the loop body, or you\'ll create an infinite loop that will crash your program.'
      },
      {
        type: 'paragraph',
        title: 'Do-While Loops',
        content: 'A variation of the while loop is the do-while loop, which guarantees that the loop body executes at least once before checking the condition.'
      },
      {
        type: 'code',
        title: 'Do-While Loop Syntax',
        content: {
          language: 'javascript',
          code: `// do-while loop
  let i = 0;
  do {
    console.log(\`Do-while iteration: \${i}\`);
    i++;
  } while (i < 3);
  
  // Even with a false condition initially, the body executes once
  let j = 10;
  do {
    console.log("This will execute once even though the condition is false");
  } while (j < 5);`,
          description: 'Do-while loops check the condition after executing the loop body.'
        }
      }
    ],
    quiz: {
      questions: [
        {
          question: 'What is the key difference between a while loop and a for loop?',
          options: [
            'While loops are faster than for loops',
            'While loops cannot be used to iterate over arrays',
            'While loops don\'t have built-in initialization and iteration components',
            'While loops always execute at least once'
          ],
          correctAnswer: 2,
          explanation: 'While loops require you to handle initialization before the loop and iteration inside the loop, whereas for loops include these components in their syntax.'
        },
        {
          question: 'What will happen if you forget to update the condition variable inside a while loop?',
          options: [
            'The loop will exit immediately',
            'The loop will run exactly once',
            'The loop will run an unpredictable number of times',
            'The loop will run infinitely (until the program crashes)'
          ],
          correctAnswer: 3,
          explanation: 'If the condition variable is never updated to make the condition false, the loop will run infinitely, potentially causing your program to crash.'
        }
      ]
    },
    relatedResources: [
      {
        title: 'Loop Control Statements: Break and Continue',
        url: '/articles/loop-control',
        type: 'article'
      },
      {
        title: 'Implementing Game Loops with While',
        url: '/videos/game-loops',
        type: 'video'
      },
      {
        title: 'While Loop Challenge Problems',
        url: '/practice/while-loops',
        type: 'practice'
      }
    ],
    nextTopic: {
      id: 'nested-iterations',
      title: 'Nested Iterations'
    },
    previousTopic: {
      id: 'for-loops',
      title: 'For Loops'
    }
  };
  
  export const topicContentRegistry: Record<string, TopicContent> = {
    'for-loops': forLoopsContent,
    'while-loops': whileLoopsContent,
    // Add more topics as needed
  };
  
  /**
   * Fetch topic content from the API
   * Falls back to registry data if server fetch fails or if running on server
   */
  export async function getTopicContent(topicId: string, chapterId?: string): Promise<TopicContent | null> {
    // First try local storage for immediate rendering with cached data
    if (typeof window !== 'undefined') {
      try {
        const localContent = localStorage.getItem(`topic-content-${topicId}`);
        if (localContent) {
          // Parse and use local storage data for immediate display
          const parsedContent = JSON.parse(localContent) as TopicContent;
          
          // Fetch from API in the background to get the latest version
          fetchFromApiInBackground(topicId, chapterId);
          
          return parsedContent;
        }
      } catch (error) {
        console.error('Error retrieving content from local storage:', error);
      }
    }
    
    // Try to get from API
    try {
      // Use our API service to fetch data
      const content = await fetchTopic(topicId, chapterId);
      if (content) {
        // If successful, also cache in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(`topic-content-${topicId}`, JSON.stringify(content));
        }
        return content;
      }
    } catch (error) {
      console.error('Error fetching content from API:', error);
      // Failed to fetch from API, fall back to registry
    }
    
    // Fall back to the registry
    return topicContentRegistry[topicId] || null;
  }
  
  /**
   * Fetch from API in the background without blocking rendering
   */
  function fetchFromApiInBackground(topicId: string, chapterId?: string): void {
    (async () => {
      try {
        // Use the API service
        const content = await fetchTopic(topicId, chapterId);
        if (content && typeof window !== 'undefined') {
          localStorage.setItem(`topic-content-${topicId}`, JSON.stringify(content));
        }
      } catch (error) {
        console.error('Background fetch error:', error);
      }
    })();
  }
  
  async function getCurrentUserId(): Promise<string | undefined> {
    if (typeof window !== 'undefined') {
      try {
        // Get the current authenticated user from Cognito using Amplify v6
        const currentUser = await getCurrentUser();
        return currentUser.userId;
      } catch (error) {
        console.error('Error getting user ID from Cognito:', error);
        return undefined;
      }
    }
    return undefined;
  }
  
  export async function saveTopicContent(content: TopicContent): Promise<boolean> {
    // First save to localStorage as a backup
    if (typeof window !== 'undefined') {
      try {
        // Get user ID asynchronously
        const userId = await getCurrentUserId();
        
        // Add timestamp and user ID
        const updatedContent = {
          ...content,
          lastUpdated: Date.now(),
          userId
        };
        
        localStorage.setItem(`topic-content-${content.id}`, JSON.stringify(updatedContent));
        
        // Then save to API using our API service
        const success = await saveTopic(updatedContent);
        return success;
      } catch (error) {
        console.error('Error saving content:', error);
        return false;
      }
    }
    return false;
  }
  
  export async function resetTopicContent(topicId: string): Promise<boolean> {
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`topic-content-${topicId}`);
      } catch (error) {
        console.error('Error removing content from local storage:', error);
      }
    }
    
    // Reset on the server by sending the original content
    const originalContent = topicContentRegistry[topicId];
    if (originalContent) {
      try {
        // Get user ID asynchronously
        const userId = await getCurrentUserId();
        
        // Use our API service
        const success = await saveTopic({
          ...originalContent,
          lastUpdated: Date.now(),
          userId
        });
        return success;
      } catch (error) {
        console.error('Error resetting content on server:', error);
        return false;
      }
    }
    
    return false;
  }