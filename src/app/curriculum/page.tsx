import Link from "next/link"
import { Clock, ChevronRight, BookOpen, ArrowRight, Target } from "lucide-react"
import { curriculumData, type Chapter } from "@/lib/curriculum-data"

// Enhanced Badge component for difficulty levels
const DifficultyBadge = ({ level }: { level: Chapter["difficultyLevel"] }) => {
  const styles = {
    Beginner: "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
    Intermediate: "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200",
    Advanced: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${styles[level]}`}>
      {level}
    </span>
  )
}

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Comprehensive Learning Path
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Master Every Concept
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Our carefully structured curriculum takes you from fundamentals to advanced topics, with hands-on practice
              and real-world applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth?mode=signup"
                className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#fundamentals"
                className="group bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Explore Curriculum
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Navigation */}
      <section className="bg-white/95 backdrop-blur-md border-b border-gray-200 py-6 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap gap-2 justify-center">
            {curriculumData.map((category) => (
              <Link
                key={category.id}
                href={`/curriculum/${category.id}`}
                className="px-4 py-2 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium border border-transparent hover:border-emerald-200"
              >
                {category.title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Curriculum Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {curriculumData.map((category, index) => (
            <div key={category.id} id={category.id} className="mb-20 scroll-mt-24">
              <div className="max-w-6xl mx-auto">
                {/* Category Header */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    Learning Path {index + 1}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{category.title}</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">{category.description}</p>

                  <Link
                    href={`/curriculum/${category.id}`}
                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    View All {category.chapters.length} Chapters
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Chapters Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  {category.chapters.slice(0, 2).map((chapter) => (
                    <div
                      key={chapter.id}
                      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
                    >
                      <div className="p-8">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                              {chapter.title}
                            </h3>
                          </div>
                          <DifficultyBadge level={chapter.difficultyLevel} />
                        </div>

                        <p className="text-gray-600 mb-6 leading-relaxed">{chapter.description}</p>

                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Topics:</h4>
                          <div className="flex flex-wrap gap-2">
                            {chapter.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="bg-gray-100 text-gray-700 px-3 py-1 text-sm rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">{chapter.estimatedCompletionTime}</span>
                          </div>

                          <Link
                            href={`/chapters/${chapter.id}`}
                            className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-100 transition-all duration-200 border border-emerald-200"
                          >
                            Start Chapter
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {category.chapters.length > 2 && (
                  <div className="text-center">
                    <Link
                      href={`/curriculum/${category.id}`}
                      className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-100 transition-all duration-200 border border-emerald-200"
                    >
                      See All {category.chapters.length} Chapters in {category.title}
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Level Up?</h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Join thousands of developers who have mastered data structures and algorithms. Start your journey today
              with our comprehensive curriculum.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth?mode=signup"
                className="group bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/dashboard"
                className="group bg-transparent border-2 border-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2"
              >
                View Dashboard
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Codementa</h3>
              <p className="text-sm leading-relaxed">
                The most comprehensive platform for mastering data structures and algorithms through interactive
                learning.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/curriculum" className="hover:text-white transition-colors">
                    Curriculum
                  </Link>
                </li>
                <li>
                  <Link href="/practice" className="hover:text-white transition-colors">
                    Practice
                  </Link>
                </li>
                <li>
                  <Link href="/analytics" className="hover:text-white transition-colors">
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">&copy; {new Date().getFullYear()} Codementa. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <span>Made with ❤️ for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
