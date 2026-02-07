import { useState, useRef, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function Chatbot({ disease }) {
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 I'm your Crop Assistant. Ask me about treatment, fertilizer, watering or prevention." }
  ])

  const bottomRef = useRef(null)

  // auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ================= VOICE LISTEN =================
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.start()

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript
      setInput(text)
    }
  }

  // ================= TRANSLATE TO TAMIL =================
  async function translateToTamil(text) {
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(text)}`
      )
      const data = await res.json()
      return data[0].map(t => t[0]).join("")
    } catch {
      return text
    }
  }

  // ================= SPEAK TAMIL =================
  function speakTamil(text) {

  function speakNow() {
    const utterance = new SpeechSynthesisUtterance(text)

    const voices = speechSynthesis.getVoices()

    // prefer Tamil → Indian English → default
    const tamilVoice =
      voices.find(v => v.lang === "ta-IN") ||
      voices.find(v => v.lang.includes("ta")) ||
      voices.find(v => v.lang === "en-IN")

    if (tamilVoice) utterance.voice = tamilVoice

    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    speechSynthesis.speak(utterance)
  }

  // voices may not be loaded yet
  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = speakNow
  } else {
    speakNow()
  }
}

  // ================= SEND MESSAGE =================
  async function sendMessage() {
    if (!input.trim()) return

    const userMsg = { sender: "user", text: input }
    setMessages(prev => [...prev, userMsg])

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          disease: disease || "plant"
        })
      })

      const data = await res.json()
      const reply = data.reply || "No response from assistant"

      // show english text
      setMessages(prev => [...prev, { sender: "bot", text: reply }])

      // translate + speak tamil
      const tamil = await translateToTamil(reply)
      speakTamil(tamil)

    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Backend not running 😅" }
      ])
    }

    setInput("")
  }

  return (
    <>
      {/* FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 bg-green-700 text-white w-14 h-14 rounded-full shadow-xl text-2xl hover:scale-110 transition"
      >
        💬
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-28 right-8 w-80 glass rounded-2xl soft-shadow overflow-hidden">


          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 text-white p-3 font-bold">
            🌿 CropAI Assistant
          </div>

          {/* MESSAGES */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl max-w-[85%] ${
                  msg.sender === "bot"
                    ? "bg-gradient-to-br from-green-100 to-green-200 text-left"
                    : "bg-gradient-to-br from-green-600 to-emerald-700 text-white ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          {/* INPUT */}
          <div className="flex border-t items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask treatment or prevention..."
              className="flex-1 p-2 outline-none"
            />

            {/* MIC */}
            <button
              onClick={startListening}
              className="px-3 text-xl hover:scale-110"
            >
              🎤
            </button>

            {/* SEND */}
            <button
              onClick={sendMessage}
              className="bg-green-700 text-white px-4"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}

