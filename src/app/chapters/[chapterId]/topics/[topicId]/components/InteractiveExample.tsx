import React from 'react';

interface InteractiveExampleProps {
  topicTitle: string;
}

const InteractiveExample: React.FC<InteractiveExampleProps> = ({ topicTitle }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Interactive Example</h2>
      <p className="text-gray-700 mb-4">
        Try modifying the code below to see how {topicTitle} work in practice.
      </p>
      <div className="bg-white border border-gray-300 rounded-md p-4 h-40 flex items-center justify-center">
        <p className="text-gray-500">Interactive code editor would be implemented here.</p>
      </div>
    </div>
  );
};

export default InteractiveExample;