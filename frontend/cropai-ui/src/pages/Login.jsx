import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  const { login, register, error, loading } = useAuth()
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [localError, setLocalError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password) {
      setLocalError("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate("/home")
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters")
      return
    }

    const success = await register(email, password)
    if (success) {
      setLocalError("")
      // Auto-login after signup
      const loginSuccess = await login(email, password)
      if (loginSuccess) {
        navigate("/home")
      }
    }
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen grid grid-cols-2">
      {/* LEFT SIDE FORM */}
      <div className="flex items-center justify-center p-16 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-10">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🌱</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Crop AI</h1>
              <p className="text-gray-500">Smart Crop Disease Predictor</p>
            </div>

            {displayError && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {displayError}
              </div>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setLocalError("")
                  setEmail("")
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="text-green-600 font-semibold hover:underline cursor-pointer"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE HERO */}
      <div className="bg-green-700 text-white flex flex-col justify-center px-20">
        <h2 className="text-5xl font-bold leading-tight mb-6">
          Protect Your Crops with AI
        </h2>

        <p className="text-lg text-green-100 mb-8">
          Early detection of crop diseases using machine learning.
          Keep your harvest healthy and maximize yield.
        </p>

        <div className="space-y-4 text-green-100">
          <p className="flex items-center">
            <span className="mr-3">●</span> Instant Disease Analysis
          </p>
          <p className="flex items-center">
            <span className="mr-3">●</span> Treatment Recommendations
          </p>
          <p className="flex items-center">
            <span className="mr-3">●</span> Track Crop Health
          </p>
          <p className="flex items-center">
            <span className="mr-3">●</span> AI Chat Support
          </p>
        </div>
      </div>
    </div>
  )
}
