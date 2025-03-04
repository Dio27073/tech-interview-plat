import React, { useState, useEffect } from 'react';
import { getInteractiveExamples, InteractiveExample as ExampleType } from '@/lib/interactive-examples-data';
import InteractiveExample from './InteractiveExample';

interface InteractiveExamplesContainerProps {
  topicId?: string;
  topicTitle: string;
}

const InteractiveExamplesContainer: React.FC<InteractiveExamplesContainerProps> = ({ 
  topicId, 
  topicTitle 
}) => {
  const [examples, setExamples] = useState<ExampleType[]>(getInteractiveExamples(topicId || ''));
  const [activeExampleId, setActiveExampleId] = useState<string>('');
  const [activeExample, setActiveExample] = useState<ExampleType | null>(null);
  const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);

  useEffect(() => {
    // Get examples when topicId changes
    console.log(`InteractiveExamplesContainer: Loading examples for topicId "${topicId}"`);
    const loadedExamples = getInteractiveExamples(topicId || '');
    setExamples(loadedExamples);
    
    // Set the first example as active by default
    if (loadedExamples.length > 0) {
      setActiveExampleId(loadedExamples[0].id);
      setActiveExample(loadedExamples[0]);
    }
  }, [topicId]);

  // Update active example when tab changes
  useEffect(() => {
    const example = examples.find(ex => ex.id === activeExampleId);
    if (example) {
      setActiveExample(example);
    }
  }, [activeExampleId, examples]);

  const handleTabChange = (exampleId: string) => {
    setActiveExampleId(exampleId);
  };

  if (examples.length === 0 || !activeExample) {
    return null;
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Interactive Examples</h2>
      <p className="text-gray-700 mb-6">
        Try out these interactive examples to see how {topicTitle} work in practice.
        You can modify the code, run it, and see the results in real-time.
      </p>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => handleTabChange(example.id)}
              className={`${
                activeExampleId === example.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>
      
      
      {/* Active Example */}
      {activeExample && (
        <InteractiveExample example={activeExample} />
      )}
    </div>
  );
};

export default InteractiveExamplesContainer;