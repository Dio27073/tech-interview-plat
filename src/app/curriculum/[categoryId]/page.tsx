// src/app/curriculum/[categoryId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { curriculumData, type Chapter } from '@/lib/curriculum-data';

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

// Generate static params for all categories
export function generateStaticParams(): { categoryId: string }[] {
  return curriculumData.map(category => ({
    categoryId: category.id,
  }));
}

// Page component - now with async
export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  // Extract categoryId from params - now with await
  const { categoryId } = await params;
  
  // Find the category by ID
  const category = curriculumData.find(cat => cat.id === categoryId);
  
  // Return 404 if category not found
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link 
              href="/curriculum" 
              className="inline-flex items-center text-blue-200 hover:text-white mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Curriculum
            </Link>
            <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
            <p className="text-xl mb-8">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Chapters Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Chapters in this Category</h2>
            
            <div className="grid gap-6">
              {category.chapters.map(chapter => (
                <div 
                  key={chapter.id} 
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold">{chapter.title}</h3>
                      <DifficultyBadge level={chapter.difficultyLevel} />
                    </div>
                    <p className="text-gray-600 mb-4">{chapter.description}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Topics Covered:</h4>
                      <div className="flex flex-wrap gap-2">
                        {chapter.topics.map((topic, index) => (
                          <span 
                            key={index} 
                            className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {chapter.estimatedCompletionTime}
                      </span>
                      <Link 
                        href={`/chapters/${chapter.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Start Chapter
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your free account to track your progress, save notes, and master these concepts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth?mode=signup" 
              className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Create Free Account
            </Link>
            <Link 
              href="/curriculum" 
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
            >
              Explore More Categories
            </Link>
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