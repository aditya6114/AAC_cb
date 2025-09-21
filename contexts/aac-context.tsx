'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Types
export interface AACTile {
  id: string
  text: string
  icon: string
  category: string
  usageCount: number
  lastUsed: Date | null
  position: number
}

export interface UserProfile {
  id: string
  name: string
  tiles: AACTile[]
  createdAt: Date
}

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export interface UsageStats {
  totalTaps: number
  topTiles: { tile: AACTile; count: number }[]
  dailyActivity: { date: string; count: number }[]
  chatInteractions: number
}

interface AACState {
  currentProfile: UserProfile | null
  profiles: UserProfile[]
  chatHistory: ChatMessage[]
  usageStats: UsageStats
  isLoading: boolean
}

type AACAction =
  | { type: 'SET_CURRENT_PROFILE'; payload: UserProfile }
  | { type: 'ADD_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_PROFILE'; payload: UserProfile }
  | { type: 'DELETE_PROFILE'; payload: string }
  | { type: 'USE_TILE'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'ADD_TILE'; payload: AACTile }
  | { type: 'UPDATE_TILE'; payload: AACTile }
  | { type: 'DELETE_TILE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }

// Default tiles
const defaultTiles: AACTile[] = [
  { id: '1', text: 'Hello', icon: '👋', category: 'greetings', usageCount: 0, lastUsed: null, position: 0 },
  { id: '2', text: 'Please', icon: '🙏', category: 'politeness', usageCount: 0, lastUsed: null, position: 1 },
  { id: '3', text: 'Thank you', icon: '🙏', category: 'politeness', usageCount: 0, lastUsed: null, position: 2 },
  { id: '4', text: 'Yes', icon: '✅', category: 'responses', usageCount: 0, lastUsed: null, position: 3 },
  { id: '5', text: 'No', icon: '❌', category: 'responses', usageCount: 0, lastUsed: null, position: 4 },
  { id: '6', text: 'Help', icon: '🆘', category: 'needs', usageCount: 0, lastUsed: null, position: 5 },
  { id: '7', text: 'Eat', icon: '🍽️', category: 'needs', usageCount: 0, lastUsed: null, position: 6 },
  { id: '8', text: 'Drink', icon: '🥤', category: 'needs', usageCount: 0, lastUsed: null, position: 7 },
  { id: '9', text: 'Happy', icon: '😊', category: 'emotions', usageCount: 0, lastUsed: null, position: 8 },
  { id: '10', text: 'Sad', icon: '😢', category: 'emotions', usageCount: 0, lastUsed: null, position: 9 },
  { id: '11', text: 'Tired', icon: '😴', category: 'emotions', usageCount: 0, lastUsed: null, position: 10 },
  { id: '12', text: 'Play', icon: '🎮', category: 'activities', usageCount: 0, lastUsed: null, position: 11 },
]

const initialState: AACState = {
  currentProfile: {
    id: 'default',
    name: 'Default User',
    tiles: defaultTiles,
    createdAt: new Date(),
  },
  profiles: [{
    id: 'default',
    name: 'Default User',
    tiles: defaultTiles,
    createdAt: new Date(),
  }],
  chatHistory: [],
  usageStats: {
    totalTaps: 0,
    topTiles: [],
    dailyActivity: [],
    chatInteractions: 0,
  },
  isLoading: false,
}

function aacReducer(state: AACState, action: AACAction): AACState {
  switch (action.type) {
    case 'SET_CURRENT_PROFILE':
      return { ...state, currentProfile: action.payload }
    
    case 'ADD_PROFILE':
      return {
        ...state,
        profiles: [...state.profiles, action.payload],
      }
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        currentProfile: state.currentProfile?.id === action.payload.id 
          ? action.payload 
          : state.currentProfile,
      }
    
    case 'DELETE_PROFILE':
      return {
        ...state,
        profiles: state.profiles.filter(p => p.id !== action.payload),
        currentProfile: state.currentProfile?.id === action.payload 
          ? state.profiles[0] || null 
          : state.currentProfile,
      }
    
    case 'USE_TILE':
      if (!state.currentProfile) return state
      
      const updatedTiles = state.currentProfile.tiles.map(tile =>
        tile.id === action.payload
          ? { ...tile, usageCount: tile.usageCount + 1, lastUsed: new Date() }
          : tile
      )
      
      const updatedProfile = { ...state.currentProfile, tiles: updatedTiles }
      
      return {
        ...state,
        currentProfile: updatedProfile,
        profiles: state.profiles.map(p => 
          p.id === updatedProfile.id ? updatedProfile : p
        ),
        usageStats: {
          ...state.usageStats,
          totalTaps: state.usageStats.totalTaps + 1,
        },
      }
    
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
        usageStats: action.payload.isUser 
          ? state.usageStats
          : { ...state.usageStats, chatInteractions: state.usageStats.chatInteractions + 1 },
      }
    
    case 'ADD_TILE':
      if (!state.currentProfile) return state
      
      const newTiles = [...state.currentProfile.tiles, action.payload]
      const profileWithNewTile = { ...state.currentProfile, tiles: newTiles }
      
      return {
        ...state,
        currentProfile: profileWithNewTile,
        profiles: state.profiles.map(p => 
          p.id === profileWithNewTile.id ? profileWithNewTile : p
        ),
      }
    
    case 'UPDATE_TILE':
      if (!state.currentProfile) return state
      
      const tilesWithUpdate = state.currentProfile.tiles.map(tile =>
        tile.id === action.payload.id ? action.payload : tile
      )
      const profileWithUpdatedTile = { ...state.currentProfile, tiles: tilesWithUpdate }
      
      return {
        ...state,
        currentProfile: profileWithUpdatedTile,
        profiles: state.profiles.map(p => 
          p.id === profileWithUpdatedTile.id ? profileWithUpdatedTile : p
        ),
      }
    
    case 'DELETE_TILE':
      if (!state.currentProfile) return state
      
      const tilesWithoutDeleted = state.currentProfile.tiles.filter(tile => tile.id !== action.payload)
      const profileWithoutTile = { ...state.currentProfile, tiles: tilesWithoutDeleted }
      
      return {
        ...state,
        currentProfile: profileWithoutTile,
        profiles: state.profiles.map(p => 
          p.id === profileWithoutTile.id ? profileWithoutTile : p
        ),
      }
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    default:
      return state
  }
}

const AACContext = createContext<{
  state: AACState
  dispatch: React.Dispatch<AACAction>
} | null>(null)

export function AACProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aacReducer, initialState)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('aac-data')
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Restore profiles
        parsedData.profiles?.forEach((profile: UserProfile) => {
          dispatch({ type: 'ADD_PROFILE', payload: profile })
        })
        // Set current profile
        if (parsedData.currentProfile) {
          dispatch({ type: 'SET_CURRENT_PROFILE', payload: parsedData.currentProfile })
        }
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [])

  // Save data to localStorage when state changes
  useEffect(() => {
    const dataToSave = {
      profiles: state.profiles,
      currentProfile: state.currentProfile,
      chatHistory: state.chatHistory,
      usageStats: state.usageStats,
    }
    localStorage.setItem('aac-data', JSON.stringify(dataToSave))
  }, [state])

  return (
    <AACContext.Provider value={{ state, dispatch }}>
      {children}
    </AACContext.Provider>
  )
}

export function useAAC() {
  const context = useContext(AACContext)
  if (!context) {
    throw new Error('useAAC must be used within an AACProvider')
  }
  return context
}
