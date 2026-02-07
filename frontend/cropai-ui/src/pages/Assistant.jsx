import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"
import { FiMic, FiMicOff, FiRefreshCw, FiVolume2 } from 'react-icons/fi'

export default function Assistant() {
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Hello! 👋 I'm your AI crop assistant. Ask me about disease prevention, watering tips, fertilizers, pesticides, or anything about farming. How can I help you today?"
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [micState, setMicState] = useState('idle') // idle, listening, processing, speaking
  const recognitionRef = useRef(null)
  const lastSpokenRef = useRef('')

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: input
    }
    setMessages([...messages, userMessage])
    setInput("")
    setLoading(true)

    try {
      setMicState('processing')
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      if (res.ok) {
        const botMessage = {
          id: messages.length + 2,
          type: "bot",
          text: data.reply
        }
        setMessages(prev => [...prev, botMessage])
        // Speak reply in Tamil
        speakTamil(data.reply)
      } else {
        const errorMessage = {
          id: messages.length + 2,
          type: "bot",
          text: data.error || "Sorry, I couldn't process your request. Please try again."
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (err) {
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        text: "Connection error. Please try again."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      setMicState('idle')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // --- Speech Recognition ---
  const initRecognition = () => {
    if (recognitionRef.current) return recognitionRef.current

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return null

    const recog = new SpeechRecognition()
    recog.lang = 'ta-IN'
    recog.continuous = false
    recog.interimResults = false

    recog.onstart = () => {
      setMicState('listening')
    }

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recog.onerror = (event) => {
      console.error('SpeechRecognition error', event)
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        // show permission toast
        alert('Allow microphone access')
      }
      setMicState('idle')
    }

    recog.onend = () => {
      // recognition finished; if we have text, send it
      setMicState('processing')
      if (input && input.trim()) {
        handleSendMessage()
      } else {
        setMicState('idle')
      }
    }

    recognitionRef.current = recog
    return recog
  }

  const startListening = () => {
    const recog = initRecognition()
    if (!recog) {
      alert('SpeechRecognition API not supported in this browser')
      return
    }

    try {
      recog.start()
    } catch (e) {
      // start called multiple times
      console.warn(e)
    }
  }

  // --- Text to Speech (Tamil) ---
  const speakTamil = (text) => {
    if (!window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'ta-IN'

    const voices = window.speechSynthesis.getVoices()
    // Try to find a tamil voice
    const tamilVoice = voices.find(v => v.lang && v.lang.startsWith('ta')) || voices.find(v => v.lang && v.lang.includes('IN'))
    if (tamilVoice) utter.voice = tamilVoice

    utter.onstart = () => setMicState('speaking')
    utter.onend = () => setMicState('idle')

    lastSpokenRef.current = text
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const replayLastSpeech = () => {
    if (lastSpokenRef.current) speakTamil(lastSpokenRef.current)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🤖 AI Crop Assistant</h1>
          <p className="text-gray-600 mb-8">Chat with our AI for personalized farming advice</p>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-screen-half md:h-96">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm px-4 py-3 rounded-lg ${
                      msg.type === "user"
                        ? "bg-green-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <p className="text-sm md:text-base">{msg.text}</p>
                      {msg.type === 'bot' && (
                        <button
                          onClick={() => speakTamil(msg.text)}
                          className="ml-2 inline-flex items-center text-gray-600 hover:text-green-700"
                          aria-label="Play reply"
                        >
                          <FiVolume2 />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your crops..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                />

                {/* Mic Button */}
                <button
                  onClick={() => {
                    if (micState === 'listening') {
                      // stop if listening
                      try { recognitionRef.current && recognitionRef.current.stop() } catch(e){}
                      setMicState('idle')
                    } else {
                      startListening()
                    }
                  }}
                  className={`p-3 rounded-lg border ${micState === 'listening' ? 'bg-red-100 border-red-300 text-red-600' : 'bg-white border-gray-300 text-gray-700'} hover:bg-green-50`}
                  aria-label="Start voice input"
                >
                  {micState === 'listening' ? <FiMicOff /> : <FiMic />}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Send
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-xs text-gray-500">Press Enter or click Send to submit your question</p>
                <div className="ml-auto text-xs text-gray-600">
                  {micState === 'listening' && <span className="text-red-600">Listening…</span>}
                  {micState === 'processing' && <span>Processing…</span>}
                  {micState === 'speaking' && <span>Speaking…</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="mt-8">
            <p className="text-gray-700 font-semibold mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "Tell me about fertilizers",
                "How to prevent blight?",
                "Best watering schedule",
                "Pest management tips"
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q)
                    setTimeout(() => {
                      const textarea = document.querySelector("input[type='text']")
                      if (textarea) textarea.focus()
                    }, 0)
                  }}
                  className="p-3 bg-white border border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-sm text-gray-700 font-medium"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
