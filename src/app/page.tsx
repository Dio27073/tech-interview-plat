import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Data Structures & Algorithms
            </h1>
            <p className="text-xl mb-8">
              A structured learning platform with interactive coding exercises and 
              personalized tracking to help you ace technical interviews
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth?mode=signup" 
                className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Sign Up Free
              </Link>
              <Link 
                href="/auth?mode=signin" 
                className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
              >
                Log In
              </Link>
            </div>
            <div className="mt-6">
              <Link 
                href="/curriculum" 
                className="text-white underline hover:text-blue-100 transition duration-200"
              >
                Explore Curriculum
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
              <p className="text-gray-600">
                Progress through logically organized chapters with comprehensive explanations and examples
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Coding</h3>
              <p className="text-gray-600">
                Practice with an integrated Monaco editor and get real-time feedback on your solutions
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with analytics that identify strengths and areas for improvement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  {/* Placeholder for an illustration/screenshot */}
                  <span className="text-gray-500">Chapter illustration</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">1. Study Chapter Content</h3>
                <p className="text-gray-600">
                  Each chapter provides theoretical explanations, visual illustrations, and code examples to help you understand key concepts.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  {/* Placeholder for an illustration/screenshot */}
                  <span className="text-gray-500">Coding exercise illustration</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">2. Complete Practice Exercises</h3>
                <p className="text-gray-600">
                  Test your understanding with progressive coding challenges that reinforce your learning and build practical skills.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  {/* Placeholder for an illustration/screenshot */}
                  <span className="text-gray-500">Progress dashboard illustration</span>
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-semibold mb-4">3. Track Your Progress</h3>
                <p className="text-gray-600">
                  Review your completion status, performance metrics, and personalized study recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our platform today and start mastering data structures and algorithms through structured content and hands-on practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth?mode=signup" 
              className="bg-white text-blue-800 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200"
            >
              Create Free Account
            </Link>
            <Link 
              href="/auth?mode=signin" 
              className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
            >
              Sign In
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