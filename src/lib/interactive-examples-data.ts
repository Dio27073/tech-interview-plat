// src/lib/interactive-examples-data.ts

export interface InteractiveExample {
    id: string;
    title: string;
    description: string;
    code: string;
    expectedOutput?: string;
  }
  
  // Map of topicId to an array of interactive examples
  const interactiveExamplesMap: Record<string, InteractiveExample[]> = {
    // For loops topic
    'for-loops': [
      {
        id: "for-loop-basic",
        title: 'Basic For Loop',
        description: 'This example shows how to use a for loop to iterate through a range of numbers.',
        code: `# A simple for loop that prints numbers from 1 to 5
  for i in range(1, 6):
      print(i)`,
        expectedOutput: '1\n2\n3\n4\n5'
      },
      {
        id: "for-loop-iterating-list", 
        title: 'Iterating Through a List',
        description: 'For loops are commonly used to iterate through lists.',
        code: `# Iterate through a list
  fruits = ["apple", "banana", "cherry", "orange"]
  for fruit in fruits:
      print(f"I like {fruit}s")`,
        expectedOutput: 'I like apples\nI like bananas\nI like cherrys\nI like oranges'
      },
      {
        id: "for-loop-enumerate",
        title: 'Using enumerate()',
        description: 'The enumerate() function adds a counter to an iterable, giving you both the index and value.',
        code: `# Using enumerate to get index and value
  fruits = ["apple", "banana", "cherry", "orange"]
  for index, fruit in enumerate(fruits):
      print(f"Item {index}: {fruit}")`,
        expectedOutput: 'Item 0: apple\nItem 1: banana\nItem 2: cherry\nItem 3: orange'
      }
    ],
    
    // Arrays topic
    'arrays': [
      {
        id: "array-basics",
        title: 'Python List Operations',
        description: 'This example demonstrates basic list operations in Python.',
        code: `# Creating and manipulating a list in Python
  numbers = [1, 2, 3, 4, 5]
  print("Original list:", numbers)
  
  # Adding elements
  numbers.append(6)
  print("After append:", numbers)
  
  # Accessing elements
  print("First element:", numbers[0])
  print("Last element:", numbers[-1])
  
  # Slicing
  print("First three elements:", numbers[:3])`,
        expectedOutput: 'Original list: [1, 2, 3, 4, 5]\nAfter append: [1, 2, 3, 4, 5, 6]\nFirst element: 1\nLast element: 6\nFirst three elements: [1, 2, 3]'
      },
      {
        id: "array-comprehension",
        title: 'List Comprehensions',
        description: 'List comprehensions provide a concise way to create lists based on existing lists.',
        code: `# Basic list comprehension
  numbers = [1, 2, 3, 4, 5]
  
  # Create a new list with squares of each number
  squares = [num**2 for num in numbers]
  print("Original numbers:", numbers)
  print("Squares:", squares)
  
  # List comprehension with condition
  even_squares = [num**2 for num in numbers if num % 2 == 0]
  print("Even squares:", even_squares)
  
  # More complex example: create a list of tuples
  pairs = [(x, y) for x in range(1, 4) for y in range(1, 3)]
  print("Pairs:", pairs)`,
        expectedOutput: 'Original numbers: [1, 2, 3, 4, 5]\nSquares: [1, 4, 9, 16, 25]\nEven squares: [4, 16]\nPairs: [(1, 1), (1, 2), (2, 1), (2, 2), (3, 1), (3, 2)]'
      }
    ],
    
    // Recursion topic
    'recursion': [
      {
        id: "recursion-factorial",
        title: 'Recursive Function',
        description: 'This example shows a simple recursive function to calculate factorial.',
        code: `# Recursive function to calculate factorial
  def factorial(n):
      # Base case
      if n == 0 or n == 1:
          return 1
      
      # Recursive case
      return n * factorial(n - 1)
  
  # Test the function
  for i in range(6):
      print(f"{i}! = {factorial(i)}")`,
        expectedOutput: '0! = 1\n1! = 1\n2! = 2\n3! = 6\n4! = 24\n5! = 120'
      },
      {
        id: "recursion-fibonacci",
        title: 'Fibonacci Sequence',
        description: 'This example uses recursion to calculate Fibonacci numbers.',
        code: `# Recursive function to calculate Fibonacci numbers
  def fibonacci(n):
      # Base cases
      if n <= 0:
          return 0
      elif n == 1:
          return 1
      
      # Recursive case
      return fibonacci(n-1) + fibonacci(n-2)
  
  # Print the first 10 Fibonacci numbers
  for i in range(10):
      print(f"fibonacci({i}) = {fibonacci(i)}")`,
        expectedOutput: 'fibonacci(0) = 0\nfibonacci(1) = 1\nfibonacci(2) = 1\nfibonacci(3) = 2\nfibonacci(4) = 3\nfibonacci(5) = 5\nfibonacci(6) = 8\nfibonacci(7) = 13\nfibonacci(8) = 21\nfibonacci(9) = 34'
      }
    ]
  };
  
  // Default example
  const defaultExample: InteractiveExample = {
    id: "default",
    title: 'Code Example',
    description: 'Try modifying this code example to explore this concept.',
    code: `# Your code here
  print("Hello, world!")`
  };
  
  /**
   * Get all interactive examples for a specific topic
   * @param topicId - The ID of the topic
   * @returns Array of interactive examples or default examples if none exist
   */
  export function getInteractiveExamples(topicId: string): InteractiveExample[] {
    console.log(`Getting interactive examples for topicId: "${topicId}"`);
    
    // Check if we have examples for this topic
    if (topicId && interactiveExamplesMap[topicId] && interactiveExamplesMap[topicId].length > 0) {
      return interactiveExamplesMap[topicId];
    }
    
    // Return array with default if no matching examples were found
    console.log('No matching examples found, returning default');
    return [defaultExample];
  }
  
  /**
   * Get a single interactive example for a topic 
   * (for backward compatibility)
   */
  export function getInteractiveExample(topicId: string): InteractiveExample {
    const examples = getInteractiveExamples(topicId);
    return examples[0];
  }