import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"

export default function History() {
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok) {
        setPredictions(data.history || [])
      } else {
        setError(data.error || "Failed to load history")
      }
    } catch (err) {
      setError("Failed to fetch history")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Scan History</h1>
          <p className="text-gray-600 mb-8">View all your previous crop disease scans and results</p>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : predictions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600 text-lg mb-2">No scans yet</p>
              <p className="text-gray-500">Start by uploading a leaf image to analyze</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">{prediction.predicted_disease}</h3>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {prediction.confidence.toFixed(1)}%
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Last analyzed</p>
                    <p className="text-sm text-gray-600">
                      {new Date(prediction.timestamp).toLocaleDateString()} {new Date(prediction.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Treatment</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{prediction.treatment}</p>
                  </div>

                  <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
