"use client"

import type React from "react"
import { useState } from "react"
import { BookOpen, Target, Code, CheckCircle, Play, Clock } from "lucide-react"
import type { TopicContent as TopicContentInterface } from "@/lib/topic-content"
import ContentSectionRenderer from "./ContentSectionRenderer"
import QuizSection from "./QuizSection"
import InteractiveExamplesContainer from "./InteractiveExamplesContainer"
import PracticeProblemsSection from "./PracticeProblemsSection"
import { RichTextDisplay } from "@/components/RichTextEditor"

interface TopicContentProps {
  content: TopicContentInterface
}

const TopicContent: React.FC<TopicContentProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<"content" | "practice">("content")

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 mb-8 border border-emerald-100">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              Chapter Content
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              {content.title}
            </h1>
          </div>
        </div>

        {/* Learning Objectives */}
        {content.learningObjectives && content.learningObjectives.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Learning Objectives</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {content.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "content"
                  ? "bg-white text-emerald-600 border-b-2 border-emerald-500 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Content & Theory
            </button>
            <button
              onClick={() => setActiveTab("practice")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 font-semibold transition-all duration-200 ${
                activeTab === "practice"
                  ? "bg-white text-emerald-600 border-b-2 border-emerald-500 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Code className="w-5 h-5" />
              Practice Problems
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="space-y-8">
              {/* Introduction Section */}
              {content.introduction && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
                  </div>
                  <div className="prose prose-blue max-w-none">
                    <RichTextDisplay content={content.introduction} />
                  </div>
                </div>
              )}

              {/* Dynamic Content Sections */}
              <div className="space-y-6">
                {content.sections?.map((section, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <ContentSectionRenderer section={section} isEditing={false} onUpdate={() => {}} index={index} />
                  </div>
                ))}
              </div>

              {/* Quiz Section */}
              {content.quiz && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Knowledge Check</h2>
                  </div>
                  <QuizSection quiz={content.quiz} />
                </div>
              )}

              {/* Interactive Examples */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Interactive Examples</h2>
                </div>
                <InteractiveExamplesContainer topicTitle={content.title} topicId={content.id} />
              </div>
            </div>
          )}

          {/* Practice Problems Tab */}
          {activeTab === "practice" && (
            <div className="space-y-6">
              {/* Practice Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Code className="w-4 h-4" />
                  Hands-on Practice
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Problems</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Apply what you&apos;ve learned with these carefully crafted problems. Start with easier problems and work
                  your way up to more challenging ones.
                </p>
              </div>

              {/* Practice Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Easy</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700 mt-1">
                    {content.practiceProblems?.filter((p) => p.difficulty?.toLowerCase() === "easy").length || 0}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Medium</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-700 mt-1">
                    {content.practiceProblems?.filter((p) => p.difficulty?.toLowerCase() === "medium").length || 0}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Hard</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700 mt-1">
                    {content.practiceProblems?.filter((p) => p.difficulty?.toLowerCase() === "hard").length || 0}
                  </div>
                </div>
              </div>

              {/* Practice Problems Component */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <PracticeProblemsSection topicId={content.id} problems={content.practiceProblems || []} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Footer */}
    </div>
  )
}

export default TopicContent