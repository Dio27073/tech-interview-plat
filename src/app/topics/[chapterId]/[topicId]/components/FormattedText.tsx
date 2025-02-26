import React from 'react';

/**
 * Text formatter that renders bold text using font-weight CSS classes
 */
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  
  // Process the text to handle bold markers
  const boldRegex = /\*\*(.*?)\*\*|__(.*?)__/g;
  
  // If there are no bold markers, return the text as is
  if (!boldRegex.test(text)) {
    return <span>{text}</span>;
  }
  
  // Reset regex lastIndex
  boldRegex.lastIndex = 0;
  
  // Find all matches
  let match;
  let lastIndex = 0;
  const elements = [];
  
  while ((match = boldRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      elements.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>
      );
    }
    
    // Add the bold text
    const content = match[1] || match[2]; // match[1] is from ** pattern, match[2] from __ pattern
    elements.push(
      <span key={`bold-${match.index}`} style={{fontWeight: 700}}>{content}</span>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    elements.push(
      <span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>
    );
  }
  
  return <>{elements}</>;
};

/**
 * Component that formats text with bullet points and applies formatting
 */
const TextWithFormatting: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  
  // Split by lines
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, idx) => {
        // Check if line is a bullet point
        if (line.trim().startsWith('*') || line.trim().startsWith('-')) {
          const bulletContent = line.trim().substring(1).trim();
          return (
            <li key={idx} className="ml-5 list-disc">
              <FormattedText text={bulletContent} />
            </li>
          );
        }
        
        // Regular paragraph
        return (
          <p key={idx} className="mb-2">
            <FormattedText text={line} />
          </p>
        );
      })}
    </>
  );
};

export { FormattedText, TextWithFormatting };