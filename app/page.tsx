'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Settings, Users, Zap } from 'lucide-react'
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              AAC Connect
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Empowering communication through adaptive technology. 
            A personalized AAC board that learns and grows with you.
          </p>
        </header>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-300">
            <CardContent className="p-8 text-center">
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-colors">
                <MessageSquare className="h-10 w-10 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                AAC Communication Board
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access your personalized communication board with adaptive tiles 
                and AI-powered assistance for enhanced expression.
              </p>
              <Link href="/aac">
                <Button 
                  size="lg" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl"
                >
                  Go to AAC Board
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-300">
            <CardContent className="p-8 text-center">
              <div className="bg-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-200 transition-colors">
                <Settings className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Parental Dashboard
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Customize communication boards, monitor usage, and manage 
                profiles for personalized AAC experiences.
              </p>
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-semibold py-4 rounded-xl"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Why Choose AAC Connect?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Adaptive Learning</h4>
              <p className="text-gray-600">
                Tiles adapt based on usage patterns and context for faster communication.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Assistant</h4>
              <p className="text-gray-600">
                Integrated chatbot for complex conversations and learning support.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Family Friendly</h4>
              <p className="text-gray-600">
                Easy customization and monitoring tools for caregivers and families.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
