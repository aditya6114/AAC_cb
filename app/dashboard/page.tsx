'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAAC, UserProfile, AACTile } from '@/contexts/aac-context'
import ChatBot from '@/components/chat-bot'
import { Home, Plus, Edit, Trash2, User, BarChart3, MessageSquare, Clock } from 'lucide-react'
import Link from 'next/link'

// Icon options for tiles
const iconOptions = [
  '👋', '🙏', '✅', '❌', '🆘', '🍽️', '🥤', '😊', '😢', '😴', '🎮', '🏠',
  '🚗', '📚', '🎵', '🌟', '❤️', '🔥', '💧', '🌈', '🎈', '🎂', '🎁', '⚽',
  '🏀', '🎾', '🏊', '🚴', '🎨', '📱', '💻', '📺', '🎬', '📷', '🎪', '🎭'
]

const categoryOptions = [
  'greetings', 'politeness', 'responses', 'needs', 'emotions', 'activities', 
  'food', 'drinks', 'places', 'people', 'objects', 'colors', 'numbers'
]

export default function Dashboard() {
  const { state, dispatch } = useAAC()
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(state.currentProfile)
  const [isAddingTile, setIsAddingTile] = useState(false)
  const [isEditingTile, setIsEditingTile] = useState<AACTile | null>(null)
  const [isAddingProfile, setIsAddingProfile] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [tileForm, setTileForm] = useState({
    text: '',
    icon: '😊',
    category: 'emotions'
  })

  // Calculate usage statistics
  const usageStats = {
    totalTaps: state.usageStats.totalTaps,
    topTiles: selectedProfile?.tiles
      .filter(tile => tile.usageCount > 0)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 5) || [],
    chatInteractions: state.usageStats.chatInteractions,
    totalTiles: selectedProfile?.tiles.length || 0,
  }

  const handleAddProfile = () => {
    if (!newProfileName.trim()) return
    
    const newProfile: UserProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      tiles: [...state.profiles[0].tiles], // Copy default tiles
      createdAt: new Date(),
    }
    
    dispatch({ type: 'ADD_PROFILE', payload: newProfile })
    setNewProfileName('')
    setIsAddingProfile(false)
    setSelectedProfile(newProfile)
  }

  const handleAddTile = () => {
    if (!tileForm.text.trim() || !selectedProfile) return
    
    const newTile: AACTile = {
      id: Date.now().toString(),
      text: tileForm.text,
      icon: tileForm.icon,
      category: tileForm.category,
      usageCount: 0,
      lastUsed: null,
      position: selectedProfile.tiles.length,
    }
    
    dispatch({ type: 'ADD_TILE', payload: newTile })
    setTileForm({ text: '', icon: '😊', category: 'emotions' })
    setIsAddingTile(false)
  }

  const handleEditTile = () => {
    if (!isEditingTile || !tileForm.text.trim()) return
    
    const updatedTile: AACTile = {
      ...isEditingTile,
      text: tileForm.text,
      icon: tileForm.icon,
      category: tileForm.category,
    }
    
    dispatch({ type: 'UPDATE_TILE', payload: updatedTile })
    setIsEditingTile(null)
    setTileForm({ text: '', icon: '😊', category: 'emotions' })
  }

  const handleDeleteTile = (tileId: string) => {
    dispatch({ type: 'DELETE_TILE', payload: tileId })
  }

  const openEditDialog = (tile: AACTile) => {
    setIsEditingTile(tile)
    setTileForm({
      text: tile.text,
      icon: tile.icon,
      category: tile.category,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Parental Dashboard</h1>
          </div>
          <Link href="/aac">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Go to AAC Board
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Management */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Profiles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {state.profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedProfile?.id === profile.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => setSelectedProfile(profile)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">{profile.name}</h3>
                          <p className="text-sm text-gray-600">
                            {profile.tiles.length} tiles
                          </p>
                        </div>
                        {selectedProfile?.id === profile.id && (
                          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Dialog open={isAddingProfile} onOpenChange={setIsAddingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="profileName">Profile Name</Label>
                        <Input
                          id="profileName"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          placeholder="Enter profile name"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleAddProfile} className="flex-1">
                          Add Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingProfile(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Total Taps</span>
                    <span className="text-lg font-bold text-blue-600">
                      {usageStats.totalTaps}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">Chat Messages</span>
                    <span className="text-lg font-bold text-green-600">
                      {usageStats.chatInteractions}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">Total Tiles</span>
                    <span className="text-lg font-bold text-purple-600">
                      {usageStats.totalTiles}
                    </span>
                  </div>

                  {usageStats.topTiles.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Most Used Tiles</h4>
                      <div className="space-y-2">
                        {usageStats.topTiles.map((tile, index) => (
                          <div key={tile.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">{tile.icon}</span>
                              <span>{tile.text}</span>
                            </div>
                            <span className="font-medium text-gray-600">
                              {tile.usageCount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Board Customization */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit className="h-5 w-5 mr-2" />
                    Board Customization
                  </div>
                  <Dialog open={isAddingTile} onOpenChange={setIsAddingTile}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Tile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Tile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tileText">Tile Text</Label>
                          <Input
                            id="tileText"
                            value={tileForm.text}
                            onChange={(e) => setTileForm({ ...tileForm, text: e.target.value })}
                            placeholder="Enter tile text"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tileIcon">Icon</Label>
                          <Select
                            value={tileForm.icon}
                            onValueChange={(value) => setTileForm({ ...tileForm, icon: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  <span className="text-lg mr-2">{icon}</span>
                                  {icon}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tileCategory">Category</Label>
                          <Select
                            value={tileForm.category}
                            onValueChange={(value) => setTileForm({ ...tileForm, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category.charAt(0).toUpperCase() + category.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button onClick={handleAddTile} className="flex-1">
                            Add Tile
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddingTile(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProfile ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedProfile.tiles.map((tile) => (
                      <div
                        key={tile.id}
                        className="relative group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-emerald-300 transition-colors"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">{tile.icon}</div>
                          <div className="text-sm font-medium text-gray-800 mb-1">
                            {tile.text}
                          </div>
                          <div className="text-xs text-gray-500">
                            Used {tile.usageCount} times
                          </div>
                          {tile.lastUsed && (
                            <div className="text-xs text-gray-400 flex items-center justify-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(tile.lastUsed).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => openEditDialog(tile)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteTile(tile.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a profile to customize their AAC board</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Edit Tile Dialog */}
        <Dialog open={!!isEditingTile} onOpenChange={() => setIsEditingTile(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editTileText">Tile Text</Label>
                <Input
                  id="editTileText"
                  value={tileForm.text}
                  onChange={(e) => setTileForm({ ...tileForm, text: e.target.value })}
                  placeholder="Enter tile text"
                />
              </div>
              
              <div>
                <Label htmlFor="editTileIcon">Icon</Label>
                <Select
                  value={tileForm.icon}
                  onValueChange={(value) => setTileForm({ ...tileForm, icon: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <span className="text-lg mr-2">{icon}</span>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="editTileCategory">Category</Label>
                <Select
                  value={tileForm.category}
                  onValueChange={(value) => setTileForm({ ...tileForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleEditTile} className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingTile(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
