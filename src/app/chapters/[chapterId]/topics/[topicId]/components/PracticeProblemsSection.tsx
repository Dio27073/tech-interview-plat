// src/app/chapters/[chapterId]/topics/[topicId]/components/PracticeProblemsSection.tsx
import React, { useState, useEffect } from 'react';
import { PracticeProblem } from '@/lib/topic-content';
import PracticeProblemItem from './PracticeProblemItem';
import { getPracticeProblems } from '@/lib/practice-problems-data';

interface PracticeProblemsSectionProps {
  topicId: string;
  problems?: PracticeProblem[]; // Now optional since we'll load from frontend data
}

const PracticeProblemsSection: React.FC<PracticeProblemsSectionProps> = ({ 
  topicId, 
  problems: propProblems 
}) => {
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("PracticeProblemsSection - topicId:", topicId);
  console.log("PracticeProblemsSection - propProblems:", propProblems);

  // Load practice problems from our frontend data
  useEffect(() => {
    // First check if problems were passed as props (for future database integration)
    if (propProblems && propProblems.length > 0) {
      console.log("Using problems from props:", propProblems);
      setProblems(propProblems);
    } else {
      // Otherwise, load from our frontend data store
      console.log("Fetching problems for topicId:", topicId);
      const loadedProblems = getPracticeProblems(topicId);
      console.log("Loaded problems:", loadedProblems);
      setProblems(loadedProblems);
    }
    
    setIsLoading(false);
  }, [topicId, propProblems]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading practice problems...</p>
      </div>
    );
  }

  // If no problems exist yet
  if (!problems || problems.length === 0) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-semibold mb-4">Practice Problems</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-700">
            No practice problems have been added for this topic yet. Check back later!
          </p>
          
          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-100 rounded text-xs font-mono">
            <p>Debug Info:</p>
            <p>Topic ID: {topicId}</p>
            <p>Problems from props: {propProblems ? propProblems.length : 0}</p>
            <p>Problems from data store: {problems ? problems.length : 0}</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleProblem = (problemId: string) => {
    if (expandedProblemId === problemId) {
      setExpandedProblemId(null);
    } else {
      setExpandedProblemId(problemId);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Practice Problems</h2>
      <p className="text-gray-600 mb-6">
        Apply what you've learned by solving these practice problems. 
        Click on each problem to expand it and see the description, hints, and solution.
      </p>
      
      <div className="space-y-6">
        {problems.map((problem) => (
          <PracticeProblemItem
            key={problem.id}
            problem={problem}
            isExpanded={expandedProblemId === problem.id}
            onToggle={() => toggleProblem(problem.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default PracticeProblemsSection;