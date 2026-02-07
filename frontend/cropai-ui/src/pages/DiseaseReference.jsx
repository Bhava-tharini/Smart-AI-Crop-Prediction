import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"

export default function DiseaseReference() {
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedDisease, setSelectedDisease] = useState(null)
  const [cropFilter, setCropFilter] = useState("all")

  useEffect(() => {
    fetchDiseases()
  }, [])

  const fetchDiseases = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (res.ok) {
        setDiseases(data.diseases || [])
      } else {
        setError(data.error || "Failed to load disease reference")
      }
    } catch (err) {
      console.error("Error fetching diseases:", err)
      setError("Failed to connect to server")
    } finally {
      setLoading(false)
    }
  }

  const filteredDiseases = cropFilter === "all" 
    ? diseases 
    : diseases.filter(d => d.crop === cropFilter)

  const crops = ["all", ...new Set(diseases.map(d => d.crop))]

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12 flex items-center justify-center">
          <p className="text-gray-600 text-lg">Loading disease reference...</p>
        </div>
      </>
    )
  }

  if (error && diseases.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button 
              onClick={fetchDiseases}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🦠 Disease Reference Guide</h1>
          <p className="text-gray-600 mb-8">Learn about common potato and tomato diseases, their symptoms, causes, and prevention methods</p>

          {/* Crop Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {crops.map(crop => (
              <button
                key={crop}
                onClick={() => setCropFilter(crop)}
                className={`px-4 py-2 rounded-full font-medium transition ${
                  cropFilter === crop
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-green-600"
                }`}
              >
                {crop === "all" ? "All Diseases" : crop}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filteredDiseases.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No diseases found for selected filter</p>
            </div>
          ) : (
            /* Disease Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredDiseases.map((disease) => (
                <div 
                  key={disease.id} 
                  onClick={() => setSelectedDisease(selectedDisease?.id === disease.id ? null : disease)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 text-white">
                    <h3 className="text-xl font-bold">{disease.name}</h3>
                    <p className="text-green-100 text-sm">{disease.crop}</p>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Symptoms</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{disease.symptoms}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Cause</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{disease.cause}</p>
                    </div>

                    {selectedDisease?.id === disease.id && (
                      <>
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Treatment</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{disease.treatment}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Prevention</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{disease.prevention}</p>
                        </div>
                      </>
                    )}

                    {selectedDisease?.id !== disease.id && (
                      <button className="text-green-600 font-semibold text-sm hover:text-green-700">
                        View Details →
                      </button>
                    )}

                    {selectedDisease?.id === disease.id && (
                      <button className="text-green-600 font-semibold text-sm hover:text-green-700">
                        Hide Details ↑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
