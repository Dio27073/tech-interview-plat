// lib/curriculum-data.tsx

// Define types for our curriculum data
export type Chapter = {
    id: string;
    title: string;
    description: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedCompletionTime: string;
    topics: string[];
  };
  
  export type CurriculumCategory = {
    id: string;
    title: string;
    description: string;
    chapters: Chapter[];
  };
  
  // Sample curriculum data
  export const curriculumData: CurriculumCategory[] = [
    {
      id: 'fundamentals',
      title: 'Programming Fundamentals',
      description: 'Essential programming concepts and techniques that form the foundation for solving algorithmic problems.',
      chapters: [
        {
          id: 'loops',
          title: 'Loops and Iteration',
          description: 'Master different loop types and iteration techniques for efficient data processing.',
          difficultyLevel: 'Beginner',
          estimatedCompletionTime: '2 hours',
          topics: ['For loops', 'While loops', 'Nested iterations', 'Loop optimization']
        },
        {
          id: 'conditionals',
          title: 'Conditional Logic',
          description: 'Learn to implement decision-making structures in your algorithms.',
          difficultyLevel: 'Beginner',
          estimatedCompletionTime: '1.5 hours',
          topics: ['If-else statements', 'Switch cases', 'Boolean logic', 'Short-circuit evaluation']
        },
        {
          id: 'functions',
          title: 'Functions and Recursion',
          description: 'Understand function structure, parameters, and the power of recursive problem-solving.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '3 hours',
          topics: ['Function basics', 'Parameter passing', 'Recursion basics', 'Recursive patterns']
        }
      ]
    },
    {
      id: 'data-structures',
      title: 'Core Data Structures',
      description: 'Fundamental data structures used to organize and store data efficiently.',
      chapters: [
        {
          id: 'arrays',
          title: 'Arrays and Strings',
          description: 'Explore array operations and common string manipulation techniques.',
          difficultyLevel: 'Beginner',
          estimatedCompletionTime: '3 hours',
          topics: ['Array basics', 'Multi-dimensional arrays', 'String methods', 'Character encoding']
        },
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          description: 'Learn about singly and doubly linked lists and their operations.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '4 hours',
          topics: ['Singly linked lists', 'Doubly linked lists', 'Circular lists', 'List traversal algorithms']
        },
        {
          id: 'stacks-queues',
          title: 'Stacks and Queues',
          description: 'Understand these fundamental LIFO and FIFO data structures and their applications.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '3 hours',
          topics: ['Stack implementation', 'Queue implementation', 'Deques', 'Priority queues']
        },
        {
          id: 'hash-tables',
          title: 'Hash Tables',
          description: 'Master hash functions and collision resolution techniques for efficient data retrieval.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '4 hours',
          topics: ['Hash functions', 'Collision handling', 'Open addressing', 'Chaining']
        }
      ]
    },
    {
      id: 'advanced-structures',
      title: 'Advanced Data Structures',
      description: 'Specialized data structures for solving complex algorithmic problems.',
      chapters: [
        {
          id: 'trees',
          title: 'Trees',
          description: 'Explore various tree structures and their traversal algorithms.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '5 hours',
          topics: ['Binary trees', 'Tree traversals', 'Binary search trees', 'Balanced trees']
        },
        {
          id: 'heaps',
          title: 'Heaps',
          description: 'Learn about this specialized tree structure and its efficient implementation.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '3 hours',
          topics: ['Min heaps', 'Max heaps', 'Heap operations', 'Heapify algorithm']
        },
        {
          id: 'graphs',
          title: 'Graphs',
          description: 'Master graph representations and fundamental graph algorithms.',
          difficultyLevel: 'Advanced',
          estimatedCompletionTime: '6 hours',
          topics: ['Graph representations', 'BFS & DFS', 'Shortest path algorithms', 'Minimum spanning trees']
        },
        {
          id: 'tries',
          title: 'Tries and Advanced Trees',
          description: 'Explore specialized tree structures for efficient string and prefix operations.',
          difficultyLevel: 'Advanced',
          estimatedCompletionTime: '4 hours',
          topics: ['Trie implementation', 'Prefix trees', 'Suffix trees', 'Red-black trees']
        }
      ]
    },
    {
      id: 'algorithms',
      title: 'Algorithm Techniques',
      description: 'Essential algorithmic paradigms and techniques for solving complex problems.',
      chapters: [
        {
          id: 'sorting',
          title: 'Sorting Algorithms',
          description: 'Learn classic sorting algorithms and their performance characteristics.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '5 hours',
          topics: ['Bubble sort', 'Merge sort', 'Quick sort', 'Heap sort', 'Counting sort']
        },
        {
          id: 'searching',
          title: 'Searching Algorithms',
          description: 'Master techniques for finding elements in different data structures.',
          difficultyLevel: 'Intermediate',
          estimatedCompletionTime: '3 hours',
          topics: ['Linear search', 'Binary search', 'Depth-first search', 'Breadth-first search']
        },
        {
          id: 'dynamic-programming',
          title: 'Dynamic Programming',
          description: 'Understand this powerful technique for solving optimization problems.',
          difficultyLevel: 'Advanced',
          estimatedCompletionTime: '8 hours',
          topics: ['Memoization', 'Tabulation', 'Subproblems', 'Optimal substructure']
        },
        {
          id: 'greedy',
          title: 'Greedy Algorithms',
          description: 'Learn when and how to apply greedy strategies to algorithmic problems.',
          difficultyLevel: 'Advanced',
          estimatedCompletionTime: '4 hours',
          topics: ['Greedy choice property', 'Activity selection', 'Huffman coding', 'Minimum spanning trees']
        }
      ]
    }
  ];