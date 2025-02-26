// src/app/chapters/[chapterId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { curriculumData, type Chapter } from '@/lib/curriculum-data';

// Function to find a chapter by ID across all categories
const findChapterById = (chapterId: string): { chapter: Chapter; categoryId: string } | null => {
  for (const category of curriculumData) {
    const chapter = category.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      return { chapter, categoryId: category.id };
    }
  }
  return null;
};

// Helper function to convert a topic name to a URL-friendly format
const topicToSlug = (topic: string): string => {
  return topic.toLowerCase().replace(/\s+/g, '-');
};

// Generate static params for all chapters
export function generateStaticParams() {
  const params: { chapterId: string }[] = [];
  curriculumData.forEach(category => {
    category.chapters.forEach(chapter => {
      params.push({ chapterId: chapter.id });
    });
  });
  return params;
}

// Badge component for difficulty levels
const DifficultyBadge = ({ level }: { level: Chapter['difficultyLevel'] }) => {
  const colors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800'
  };
  
  return (
    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colors[level]}`}>
      {level}
    </span>
  );
};

// Make the component async to properly handle the params
export default async function ChapterPage({ params }: { params: { chapterId: string } }) {
  // Use await with params to fix the Next.js warning
  const { chapterId } = await params;
  
  // Find the chapter by ID
  const chapterInfo = findChapterById(chapterId);
  
  // Return 404 if chapter not found
  if (!chapterInfo) {
    notFound();
  }
  
  const { chapter, categoryId } = chapterInfo;
  const category = curriculumData.find(cat => cat.id === categoryId)!;
  
  // Mock topics data (this would come from your actual data source)
  const topicDetails = chapter.topics.map(topic => ({
    id: topicToSlug(topic),
    title: topic,
    description: `Learn all about ${topic} in this comprehensive lesson.`,
    estimatedTime: `${Math.floor(Math.random() * 30) + 15} mins` // Mock time for demonstration
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-2 mb-6">
              <Link 
                href={`/curriculum/${categoryId}`} 
                className="inline-flex items-center text-blue-200 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to {category.title}
              </Link>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{chapter.title}</h1>
              <DifficultyBadge level={chapter.difficultyLevel} />
            </div>
            
            <p className="text-xl mb-6">{chapter.description}</p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{chapter.estimatedCompletionTime}</span>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{chapter.topics.length} Topics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Topics in this Chapter</h2>
            
            <div className="grid gap-6">
              {topicDetails.map((topic, index) => (
                <div 
                  key={topic.id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 text-blue-800 h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{topic.title}</h3>
                        <p className="text-gray-600 mb-4">{topic.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {topic.estimatedTime}
                          </span>
                          <Link 
                            href={`/topics/${chapter.id}/${topic.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Start Learning
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the component remains unchanged */}
      {/* Practice Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Ready to Practice?</h2>
                  <p className="text-gray-700 mb-4">
                    Test your knowledge of {chapter.title} with our interactive coding exercises. 
                    Apply what you've learned and receive immediate feedback.
                  </p>
                  <Link 
                    href={`/practice/${chapter.id}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                  >
                    Start Coding Exercises
                  </Link>
                </div>
                <div className="md:w-1/3 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Exercise Stats</h3>
                  <ul>
                    <li className="flex justify-between py-1">
                      <span>Easy:</span>
                      <span className="font-medium">3 exercises</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>Medium:</span>
                      <span className="font-medium">2 exercises</span>
                    </li>
                    <li className="flex justify-between py-1">
                      <span>Hard:</span>
                      <span className="font-medium">1 exercise</span>
                    </li>
                    <li className="flex justify-between pt-2 border-t mt-1">
                      <span>Est. completion:</span>
                      <span className="font-medium">45 minutes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Learning CTA */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="bg-blue-700 text-white p-8 rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4">Begin Your Learning Journey</h2>
              <p className="text-xl mb-6">
                Start with the first topic "{topicDetails[0].title}" to begin mastering {chapter.title}.
              </p>
              <Link 
                href={`/topics/${chapter.id}/${topicDetails[0].id}`}
                className="inline-block bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Start First Topic
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} DS&A Study Platform. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/about" className="hover:text-white transition duration-200">About</Link>
              <Link href="/privacy" className="hover:text-white transition duration-200">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition duration-200">Terms</Link>
              <Link href="/contact" className="hover:text-white transition duration-200">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}