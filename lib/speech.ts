export const speakText = (text: string, options?: {
  rate?: number
  pitch?: number
  volume?: number
  voice?: string
}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  
  // Set options with defaults
  utterance.rate = options?.rate ?? 0.8
  utterance.pitch = options?.pitch ?? 1
  utterance.volume = options?.volume ?? 1

  // Set voice if specified
  if (options?.voice) {
    const voices = speechSynthesis.getVoices()
    const selectedVoice = voices.find(voice => voice.name === options.voice)
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
  }

  speechSynthesis.speak(utterance)
}

export const getAvailableVoices = () => {
  if (!('speechSynthesis' in window)) {
    return []
  }
  return speechSynthesis.getVoices()
}

export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel()
  }
}
