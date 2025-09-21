'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAAC, AACTile, ChatMessage } from '@/contexts/aac-context'
import { Home, Volume2 } from 'lucide-react'
import ChatBot from '@/components/chat-bot'
import Link from 'next/link'

// Text-to-Speech function
const speakText = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1
    speechSynthesis.speak(utterance)
  }
}

// Contextual tiles based on selected tile
const getContextualTiles = (selectedTile: AACTile): AACTile[] => {
  const contextMap: Record<string, AACTile[]> = {
    'Eat': [
      { id: 'ctx-1', text: 'Hungry', icon: '🍽️', category: 'food', usageCount: 0, lastUsed: null, position: 0 },
      { id: 'ctx-2', text: 'Apple', icon: '🍎', category: 'food', usageCount: 0, lastUsed: null, position: 1 },
      { id: 'ctx-3', text: 'Snack', icon: '🍪', category: 'food', usageCount: 0, lastUsed: null, position: 2 },
      { id: 'ctx-4', text: 'Breakfast', icon: '🥞', category: 'food', usageCount: 0, lastUsed: null, position: 3 },
    ],
    'Drink': [
      { id: 'ctx-5', text: 'Water', icon: '💧', category: 'drinks', usageCount: 0, lastUsed: null, position: 0 },
      { id: 'ctx-6', text: 'Juice', icon: '🧃', category: 'drinks', usageCount: 0, lastUsed: null, position: 1 },
      { id: 'ctx-7', text: 'Milk', icon: '🥛', category: 'drinks', usageCount: 0, lastUsed: null, position: 2 },
      { id: 'ctx-8', text: 'Thirsty', icon: '🥤', category: 'drinks', usageCount: 0, lastUsed: null, position: 3 },
    ],
    'Play': [
      { id: 'ctx-9', text: 'Games', icon: '🎲', category: 'activities', usageCount: 0, lastUsed: null, position: 0 },
      { id: 'ctx-10', text: 'Toys', icon: '🧸', category: 'activities', usageCount: 0, lastUsed: null, position: 1 },
      { id: 'ctx-11', text: 'Outside', icon: '🌳', category: 'activities', usageCount: 0, lastUsed: null, position: 2 },
      { id: 'ctx-12', text: 'Friends', icon: '👫', category: 'activities', usageCount: 0, lastUsed: null, position: 3 },
    ],
  }
  
  return contextMap[selectedTile.text] || []
}

export default function AACBoard() {
  const { state, dispatch } = useAAC()
  const [chatInput, setChatInput] = useState('')
  const [contextualTiles, setContextualTiles] = useState<AACTile[]>([])
  const [showContextual, setShowContextual] = useState(false)

  // Sort tiles by usage and recency for adaptive behavior
  const sortedTiles = state.currentProfile?.tiles.sort((a, b) => {
    // Prioritize recently used tiles
    if (a.lastUsed && b.lastUsed) {
      // Ensure lastUsed is a Date object (handle string dates from localStorage)
      const aDate = a.lastUsed instanceof Date ? a.lastUsed : new Date(a.lastUsed)
      const bDate = b.lastUsed instanceof Date ? b.lastUsed : new Date(b.lastUsed)
      
      const timeDiff = bDate.getTime() - aDate.getTime()
      if (Math.abs(timeDiff) < 300000) { // Within 5 minutes, prioritize usage count
        return b.usageCount - a.usageCount
      }
      return timeDiff
    }
    if (a.lastUsed && !b.lastUsed) return -1
    if (!a.lastUsed && b.lastUsed) return 1
    
    // Fall back to usage count
    return b.usageCount - a.usageCount
  }) || []

  const handleTileClick = (tile: AACTile) => {
    // Speak the tile text
    speakText(tile.text)
    
    // Update usage statistics
    dispatch({ type: 'USE_TILE', payload: tile.id })
    
    // Show contextual tiles
    const contextTiles = getContextualTiles(tile)
    if (contextTiles.length > 0) {
      setContextualTiles(contextTiles)
      setShowContextual(true)
      
      // Auto-hide contextual tiles after 10 seconds
      setTimeout(() => {
        setShowContextual(false)
      }, 10000)
    }
  }

  const handleContextualTileClick = (tile: AACTile) => {
    speakText(tile.text)
    setShowContextual(false)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    }
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage })

    // Clear input
    const currentInput = chatInput
    setChatInput('')

    try {
      // Call Gemini API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        }
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage })
        
        // Speak the bot response
        speakText(data.response)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="container mx-auto px-2 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-md tracking-tight">
              {state.currentProfile?.name}'s AAC Board
            </h1>
          </div>
          <Button
            onClick={() => speakText("AAC Board is ready")}
            variant="outline"
            size="sm"
            className="backdrop-blur-md bg-white/60 border border-indigo-200 shadow-md"
          >
            <Volume2 className="h-4 w-4 mr-2" />
            Test Speech
          </Button>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-8 items-stretch w-full">
          {/* Main AAC Board */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="backdrop-blur-lg bg-white/60 border border-gray-200 shadow-xl rounded-3xl p-8 h-full flex flex-col">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center tracking-tight">Communication Board</h2>
              {/* Contextual Tiles */}
              {showContextual && (
                <div className="mb-6 p-4 bg-yellow-50/80 rounded-xl border-2 border-yellow-200 shadow-sm">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-3">Related Options:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {contextualTiles.map((tile) => (
                      <Button
                        key={tile.id}
                        onClick={() => handleContextualTileClick(tile)}
                        className="h-20 flex flex-col items-center justify-center bg-yellow-100/80 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300 rounded-xl shadow"
                        variant="outline"
                      >
                        <span className="text-2xl mb-1">{tile.icon}</span>
                        <span className="text-xs font-medium">{tile.text}</span>
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setShowContextual(false)}
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-yellow-700"
                  >
                    Hide Options
                  </Button>
                </div>
              )}
              {/* Main Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                {sortedTiles.map((tile) => (
                  <Button
                    key={tile.id}
                    onClick={() => handleTileClick(tile)}
                    className="h-24 sm:h-28 flex flex-col items-center justify-center bg-white/80 hover:bg-blue-50 text-gray-800 border-2 border-gray-200 hover:border-blue-300 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    variant="outline"
                  >
                    <span className="text-3xl sm:text-4xl mb-2">{tile.icon}</span>
                    <span className="text-sm sm:text-base font-semibold text-center leading-tight">
                      {tile.text}
                    </span>
                    {tile.usageCount > 0 && (
                      <span className="text-xs text-blue-600 mt-1">
                        Used {tile.usageCount} times
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Divider for desktop */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-indigo-200 via-indigo-300 to-indigo-100 mx-2 rounded-full" />

          {/* AI Chatbot - only the component, no extra card or header */}
          <div className="flex-1 flex flex-col justify-center items-center h-full">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  )
}
