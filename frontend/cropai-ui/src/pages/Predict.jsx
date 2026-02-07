import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "./Navbar"
import Chatbot from "../components/Chatbot"

export default function Predict() {
  const { token } = useAuth()
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // cleanup preview memory
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleFile(e) {
    const img = e.target.files[0]
    if (!img) return

    // Validate file type
    if (!img.type.startsWith('image/')) {
      setError("Please upload a valid image file")
      return
    }

    setFile(img)
    setPreview(URL.createObjectURL(img))
    setResult(null)
    setError("")
  }

  async function analyzeCrop() {
    if (!file) {
      setError("Upload leaf image first")
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Prediction failed")
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err.message || "Backend not running")
    }

    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
            🌱 Crop Disease Detection
          </h1>
          <p className="text-gray-600 mb-12 text-lg">Upload a leaf image and get instant disease detection with treatment recommendations</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT SIDE - INFO */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight text-gray-800 mb-6">
                  Detect crop diseases instantly
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Our AI model analyzes leaf images to detect diseases with high accuracy
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🌿</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Tomato & Potato Support</h3>
                    <p className="text-gray-600">Detects multiple disease types for both crops</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Real-time Analysis</h3>
                    <p className="text-gray-600">Get results in seconds with AI processing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🧠</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">AI Trained Model</h3>
                    <p className="text-gray-600">Trained on thousands of verified leaf images</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - UPLOAD & RESULT */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Upload Area */}
              <div className="mb-6">
                <label className="border-3 border-dashed border-green-400 rounded-2xl p-12 block text-center cursor-pointer hover:border-green-600 hover:bg-green-50 transition">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFile}
                    disabled={loading}
                  />
                  <div className="text-4xl mb-3">📸</div>
                  <p className="font-semibold text-green-700 text-lg mb-2">
                    {preview ? "Change Image" : "Click to Upload Leaf Image"}
                  </p>
                  <p className="text-sm text-gray-500">or drag and drop</p>

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="mt-6 mx-auto rounded-xl max-h-64 w-full object-cover"
                    />
                  )}
                </label>
              </div>

              {/* Analyze Button */}
              <button
                onClick={analyzeCrop}
                disabled={!file || loading}
                className="w-full py-3 px-6 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition mb-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Crop"
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Detection Results</h3>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Disease Detected</p>
                    <p className="text-2xl font-bold text-green-700">{result.disease}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Confidence</p>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-green-600 h-full transition-all duration-500"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{result.confidence.toFixed(1)}% confidence</p>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Recommended Treatment</p>
                    <p className="text-gray-800 leading-relaxed">{result.treatment}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chatbot Section */}
          {result && <Chatbot disease={result.disease} />}
        </div>
      </div>
    </>
  )
}

