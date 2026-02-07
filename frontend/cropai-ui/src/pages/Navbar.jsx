import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600"
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/home")}>
            <span className="text-3xl mr-3">🌱</span>
            <h1 className="text-2xl font-bold text-green-700">CropAI</h1>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/home")}
              className={`pb-2 font-medium transition ${isActive("/home")}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/predict")}
              className={`pb-2 font-medium transition ${isActive("/predict")}`}
            >
              Predict
            </button>
            <button
              onClick={() => navigate("/history")}
              className={`pb-2 font-medium transition ${isActive("/history")}`}
            >
              History
            </button>
            <button
              onClick={() => navigate("/tips")}
              className={`pb-2 font-medium transition ${isActive("/tips")}`}
            >
              Tips
            </button>
            <button
              onClick={() => navigate("/assistant")}
              className={`pb-2 font-medium transition ${isActive("/assistant")}`}
            >
              Assistant
            </button>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.email || "User"}</p>
              <p className="text-xs text-gray-500">Farmer</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
