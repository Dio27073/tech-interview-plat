// src/lib/practice-problems-data.ts
import { PracticeProblem } from './topic-content';

// Map of topicId to an array of practice problems
const practiceProblemsMap: Record<string, PracticeProblem[]> = {
  // For loops topic
  'for-loops': [
    {
      id: 'for-loop-basic',
      title: 'Print Numbers 1-10',
      description: 'Write a for loop that prints numbers from 1 to 10.',
      difficulty: 'easy',
      language: 'python',
      starterCode: '# Write your code here\n',
      solution: 'for i in range(1, 11):\n    print(i)',
      solutionExplanation: 'This solution uses the range() function to create a sequence from 1 to 10 (inclusive). The range(1, 11) generates numbers starting from 1 and up to but not including 11.',
      solutionKeywords: 'for i in range(1, 11)',
      hints: [
        'In Python, you can use the range() function to generate a sequence of numbers',
        'Remember that range(start, end) goes up to but not including the end value',
        'Use print() to display each number'
      ],
      examples: [
        'Output:\n1\n2\n3\n...\n10'
      ]
    },
    {
      id: 'for-loop-sum',
      title: 'Sum List Elements',
      description: 'Write a for loop that calculates the sum of all numbers in the given list.',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'def sum_list(numbers):\n    # Write your code here\n    \n    return 0  # Replace with your answer\n\n# Example usage:\n# sum_list([1, 2, 3, 4, 5]) should return 15',
      solution: 'def sum_list(numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total',
      solutionExplanation: 'We initialize a total variable to 0, then iterate directly through each element of the list, adding it to the total. Finally, we return the total sum.',
      solutionKeywords: 'total += num',
      hints: [
        'Initialize a variable to hold the sum',
        'Use a for loop to iterate through each element in the list',
        'Add each element to your sum variable'
      ],
      examples: [
        'sum_list([1, 2, 3, 4, 5]) → 15',
        'sum_list([10, 20, 30]) → 60',
        'sum_list([-1, 1]) → 0'
      ]
    },
    {
      id: 'for-loop-reverse',
      title: 'Reverse List Without Built-ins',
      description: 'Write a function to reverse a list without using built-in methods like reversed() or list slicing with [::-1]. Use a for loop to implement your solution.',
      difficulty: 'medium',
      language: 'python',
      starterCode: 'def reverse_list(items):\n    # Write your code here\n    \n    return []  # Replace with your reversed list\n\n# Example:\n# reverse_list([1, 2, 3, 4, 5]) should return [5, 4, 3, 2, 1]',
      solution: 'def reverse_list(items):\n    reversed_items = []\n    for i in range(len(items) - 1, -1, -1):\n        reversed_items.append(items[i])\n    return reversed_items',
      solutionExplanation: 'We create a new list and iterate through the original list in reverse order using range(len(items)-1, -1, -1), which starts at the last index and goes down to 0. We append each element to our new list.',
      solutionKeywords: 'range(len(items) - 1, -1, -1)',
      hints: [
        'Use range() with a negative step to iterate from the end to the beginning',
        'You can use range(start, stop, step) where step can be negative',
        'Create a new list and append elements in reverse order'
      ],
      examples: [
        'reverse_list([1, 2, 3, 4, 5]) → [5, 4, 3, 2, 1]',
        'reverse_list(["a", "b", "c"]) → ["c", "b", "a"]'
      ]
    },
    {
      id: 'for-loop-nested',
      title: 'Print Multiplication Table',
      description: 'Write a function that prints a multiplication table for numbers 1 through 5 using nested for loops.',
      difficulty: 'medium',
      language: 'python',
      starterCode: 'def print_multiplication_table():\n    # Write your code here\n    pass\n\n# Expected output should be something like:\n# 1 2 3 4 5\n# 2 4 6 8 10\n# 3 6 9 12 15\n# 4 8 12 16 20\n# 5 10 15 20 25',
      solution: 'def print_multiplication_table():\n    for i in range(1, 6):\n        row = ""\n        for j in range(1, 6):\n            row += str(i * j) + " "\n        print(row.strip())',
      solutionExplanation: 'We use nested for loops: the outer loop iterates through rows (1-5), and the inner loop iterates through columns (1-5). For each cell, we multiply the row number by the column number.',
      solutionKeywords: 'for i in range(1, 6):\n    for j in range(1, 6)',
      hints: [
        'Use one loop for rows and another loop for columns',
        'The value at each position is row × column',
        'Build each row as a string, then print it'
      ],
      examples: [
        'Output:\n1 2 3 4 5\n2 4 6 8 10\n3 6 9 12 15\n4 8 12 16 20\n5 10 15 20 25'
      ]
    }
  ],
  
  // Arrays topic 
  'arrays': [
    {
      id: 'array-find-max',
      title: 'Find Maximum Value',
      description: 'Write a function that finds the maximum value in a list of numbers.',
      difficulty: 'easy',
      language: 'python',
      starterCode: 'def find_max(numbers):\n    # Write your code here\n    \n    return 0  # Replace with your answer\n\n# Example usage:\n# find_max([3, 7, 2, 8, 1]) should return 8',
      solution: 'def find_max(numbers):\n    max_val = numbers[0]\n    for num in numbers[1:]:\n        if num > max_val:\n            max_val = num\n    return max_val',
      solutionExplanation: 'We start by assuming the first element is the maximum. Then we iterate through the rest of the list, updating our max_val variable whenever we find a larger value.',
      solutionKeywords: 'if num > max_val',
      hints: [
        'Initialize a variable to the first element of the list',
        'Loop through the remaining elements',
        'Compare each element to your current maximum'
      ],
      examples: [
        'find_max([3, 7, 2, 8, 1]) → 8',
        'find_max([-5, -2, -10]) → -2',
        'find_max([42]) → 42'
      ]
    }
  ],
  
  // Recursion topic
  'recursion': [
    {
      id: 'recursion-factorial',
      title: 'Calculate Factorial',
      description: 'Implement a recursive function to calculate the factorial of a number n. The factorial of n (written as n!) is the product of all positive integers less than or equal to n.',
      difficulty: 'medium',
      language: 'python',
      starterCode: 'def factorial(n):\n    # Write your recursive solution here\n    \n    return 0  # Replace with your answer\n\n# Examples:\n# factorial(5) should return 120',
      solution: 'def factorial(n):\n    # Base case\n    if n == 0 or n == 1:\n        return 1\n    \n    # Recursive case\n    return n * factorial(n - 1)',
      solutionExplanation: 'The factorial function uses recursion by calling itself with a smaller input (n-1) until it reaches the base case of 0 or 1.',
      solutionKeywords: 'return n * factorial(n - 1)',
      hints: [
        'Define your base case first (when should the recursion stop?)',
        'For factorial, the base case is when n equals 0 or 1',
        'For the recursive case, remember that n! = n × (n-1)!'
      ],
      examples: [
        'factorial(0) → 1',
        'factorial(1) → 1',
        'factorial(5) → 120 (because 5! = 5 × 4 × 3 × 2 × 1)'
      ]
    }
  ]
};

/**
 * Get practice problems for a specific topic
 * @param topicId - The ID of the topic
 * @returns Array of practice problems or empty array if none exist
 */
export function getPracticeProblems(topicId: string): PracticeProblem[] {
  console.log(`Getting practice problems for topicId: "${topicId}"`);
  return practiceProblemsMap[topicId] || [];
}

/**
 * Get a specific practice problem by ID
 * @param problemId - The ID of the practice problem
 * @returns The practice problem or null if not found
 */
export function getPracticeProblemById(problemId: string): PracticeProblem | null {
  for (const problems of Object.values(practiceProblemsMap)) {
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      return problem;
    }
  }
  return null;
}