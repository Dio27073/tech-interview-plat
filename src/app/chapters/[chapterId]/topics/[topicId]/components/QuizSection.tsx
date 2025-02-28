import React from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizProps {
  quiz: {
    questions: QuizQuestion[];
  };
}

const QuizSection: React.FC<QuizProps> = ({ quiz }) => {
  return (
    <div className="bg-indigo-50 p-6 rounded-lg mb-8">
      <h2 className="text-xl font-semibold mb-4">Knowledge Check</h2>
      <p className="text-gray-700 mb-4">
        Test your understanding with these questions:
      </p>
      <div className="space-y-6">
        {quiz.questions.map((question, qIndex) => (
          <div key={qIndex} className="bg-white border border-indigo-100 rounded-md p-4">
            <p className="font-medium mb-3 whitespace-pre-line">{qIndex + 1}. {question.question}</p>
            <div className="space-y-2 mb-2">
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-start">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 mr-2 text-xs ${oIndex === question.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {String.fromCharCode(65 + oIndex)}
                  </div>
                  <p>{option}</p>
                </div>
              ))}
            </div>
            <details className="mt-2">
              <summary className="text-blue-600 cursor-pointer text-sm font-medium">Show explanation</summary>
              <p className="text-gray-700 mt-2 text-sm bg-blue-50 p-3 rounded">{question.explanation}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSection;