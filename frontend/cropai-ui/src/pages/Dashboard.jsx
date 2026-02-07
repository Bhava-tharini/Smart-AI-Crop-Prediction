import { useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"

export default function Dashboard() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const [stats, setStats] = useState({
    total_scans: 0,
    diseased_count: 0,
    healthy_count: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok) {
        setStats(data)
      } else {
        console.error("Failed to fetch stats:", data.error)
      }
    } catch (err) {
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Welcome Back, Farmer 👋</h1>
        <p className="text-gray-600 mb-12 text-lg">Monitor and protect your crops with AI-powered disease detection</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Analyze Crop Card */}
          <div
            onClick={() => navigate("/predict")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">📸</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Analyze Crop</h2>
            <p className="text-gray-600 mb-4">Upload a leaf image and detect diseases instantly with AI</p>
            <button className="text-green-600 font-semibold hover:text-green-700">
              Start Analysis →
            </button>
          </div>

          {/* History Card */}
          <div
            onClick={() => navigate("/history")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Scan History</h2>
            <p className="text-gray-600 mb-4">View all your previous crop disease scans and results</p>
            <button className="text-green-600 font-semibold hover:text-green-700">
              View History →
            </button>
          </div>

          {/* Tips Card */}
          <div
            onClick={() => navigate("/tips")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">💡</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Farming Tips</h2>
            <p className="text-gray-600 mb-4">Learn prevention techniques and best practices for healthy crops</p>
            <button className="text-green-600 font-semibold hover:text-green-700">
              Read Tips →
            </button>
          </div>

          {/* Assistant Card */}
          <div
            onClick={() => navigate("/assistant")}
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">AI Assistant</h2>
            <p className="text-gray-600 mb-4">Chat with our AI and get personalized farming advice</p>
            <button className="text-green-600 font-semibold hover:text-green-700">
              Chat Now →
            </button>
          </div>

          {/* Disease Info Card */}
          <Link
            to="/diseases"
            className="bg-white rounded-2xl shadow-lg p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform no-underline"
          >
            <div className="text-5xl mb-4">🦠</div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Disease Reference</h2>
            <p className="text-gray-600 mb-4">Learn about common potato and tomato leaf diseases</p>
            <div className="text-green-600 font-semibold hover:text-green-700">
              Learn More →
            </div>
          </Link>

          {/* Statistics Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-white">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-3">Your Stats</h2>
            <div className="space-y-2 text-green-50">
              <p>Scans: {stats.total_scans}</p>
              <p>Detected Diseases: {stats.diseased_count}</p>
              <p>Healthy: {stats.healthy_count}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

