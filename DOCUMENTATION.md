# CropAI – Smart Crop Disease Predictor

A production-grade SaaS application for crop disease detection using AI. Early detection of potato and tomato leaf diseases with real-time predictions, treatment recommendations, and farmer-friendly guidance.

## 🌟 Features

✅ **User Authentication**
- JWT-based authentication with bcrypt password hashing  
- Secure signup and login
- Protected routes and API endpoints
- 7-day token expiry

✅ **Disease Prediction**
- Real-time crop disease detection using TensorFlow/MobileNetV2
- Confidence scores and treatment recommendations
- Supports: Tomato Early Blight, Tomato Healthy, Tomato Late Blight, Potato Early Blight, Potato Healthy
- Image preprocessing and model inference

✅ **Scan History**
- Track all previous predictions with timestamps
- View results by date and disease type
- Confidence percentages and treatments stored

✅ **Knowledge Base**
- 12+ farming tips and best practices
- Disease prevention techniques  
- Category-based learning resources
- Tomato care, Potato care, Disease info, Prevention tips

✅ **AI Assistant**
- Rule-based chatbot for farming queries
- Speech-to-text input (browser-supported)
- Tamil language text-to-speech output
- Floating chat widget for quick access

✅ **Professional UI**
- Green agriculture theme with modern design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and loading states
- Empty states and error handling

## 🏗️ Tech Stack

**Backend:**
- Flask 3.1.2 REST API
- SQLAlchemy 3.1.1 ORM
- PyJWT 2.11.0 for authentication
- bcrypt 4.1.2 for password hashing
- SQLite database
- TensorFlow/Keras for ML

**Frontend:**
- React 18 with Vite
- Tailwind CSS 3 for styling
- React Router 6 for navigation
- Context API for state management
- Web Speech API for voice features

**ML:**
- TensorFlow MobileNetV2 (224x224 inputs)
- 5-class classifier pre-trained on crop datasets
- Model inference: ~300-500ms per image

## 📁 Project Structure

```
crop-disease-predictor/
├── app.py                          # Flask app entry point
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (backend)
├── cropai.db                      # SQLite database (auto-created)
├── model/
│   └── crop_disease_model.h5      # Trained ML model (224x224 MobileNetV2)
├── backend/
│   ├── database/
│   │   ├── db.py                 # SQLAlchemy models: User, Prediction
│   │   └── __init__.py
│   ├── services/
│   │   ├── auth_service.py       # JWT tokens, bcrypt hashing, decorators
│   │   ├── model_service.py      # ML inference, preprocessing
│   │   └── __init__.py
│   ├── routes/
│   │   ├── auth.py               # /auth/register, /auth/login, /auth/me
│   │   ├── history.py            # /history (GET user predictions)
│   │   ├── tips.py               # /tips (GET farming knowledge)
│   │   ├── chat.py               # /chat (POST chatbot queries)
│   │   └── __init__.py
│   └── __init__.py
├── frontend/
│   └── cropai-ui/
│       ├── src/
│       │   ├── pages/
│       │   │   ├── Login.jsx      # Signup/Login with form validation
│       │   │   ├── Dashboard.jsx  # Home with quick actions
│       │   │   ├── Predict.jsx    # Image upload & disease detection
│       │   │   ├── History.jsx    # View all scans with filters
│       │   │   ├── Tips.jsx       # Knowledge base with categories
│       │   │   ├── Assistant.jsx  # Full chat interface
│       │   │   └── Navbar.jsx     # Top navigation bar
│       │   ├── components/
│       │   │   ├── ProtectedRoute.jsx  # Auth-based route protection
│       │   │   └── Chatbot.jsx        # Floating chat widget
│       │   ├── context/
│       │   │   └── AuthContext.jsx    # Global auth state + localStorage
│       │   ├── App.jsx                # Main app with routing
│       │   └── main.jsx
│       ├── vite.config.js        # API proxy config
│       ├── .env                  # Frontend env variables
│       └── package.json
└── dataset/
    ├── train/                      # Training data (organized by disease)
    └── test/                       # Test data (organized by disease)
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (tested on 3.12.9)
- Node.js 14.0+ (tested on current LTS)
- pip and npm

### Installation & Setup

1. **Extract and navigate to project**
   ```bash
   cd crop-disease-predictor
   ```

2. **Create and activate Python virtual environment**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Setup frontend dependencies**
   ```bash
   cd frontend/cropai-ui
   npm install
   cd ../..
   ```

5. **Configure environment files**
   
   **Backend (.env in root):**
   ```env
   FLASK_ENV=development
   HOST=0.0.0.0
   PORT=5000
   DATABASE_URL=sqlite:///cropai.db
   JWT_SECRET_KEY=your-secret-key-change-in-production
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend (.env in frontend/cropai-ui):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Development Servers

**Open two terminals in project root:**

**Terminal 1 - Backend (Flask):**
```bash
python app.py
```
Starts at: `http://localhost:5000`
API docs: `http://localhost:5000/api/health`

**Terminal 2 - Frontend (React):**
```bash
cd frontend/cropai-ui
npm run dev
```
Starts at: `http://localhost:5173`

### First Use

1. Navigate to `http://localhost:5173`
2. **Click "Sign Up"** and create account:
   - Email: `farmer@example.com`
   - Password: minimum 6 characters
3. **Log in** with credentials
4. **Dashboard** appears with navigation menu
5. **Upload leaf image** in Predict page
6. **View results** with disease name and treatment
7. Check **History** for all scans
8. Browse **Tips** for farming knowledge
9. Chat with **Assistant** for advice

## 🔌 API Endpoints

All endpoints (except `/api/health`) require `Authorization: Bearer <token>` header

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login (returns JWT token) |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/auth/logout` | Logout (frontend clears token) |

**Register/Login Body:**
```json
{
  "email": "farmer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "farmer@example.com",
    "created_at": "2026-02-06T10:30:00"
  }
}
```

### Disease Prediction

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Predict disease from image |
| GET | `/api/history` | Get user's prediction history |

**Predict Request:**
```
Content-Type: multipart/form-data
Field: image (file)
```

**Predict Response:**
```json
{
  "disease": "Tomato Early Blight",
  "confidence": 94.5,
  "treatment": "Use neem oil or copper fungicide. Ensure good air circulation."
}
```

**History Response:**
```json
{
  "history": [
    {
      "id": 1,
      "user_id": 1,
      "predicted_disease": "Tomato Early Blight",
      "confidence": 94.5,
      "treatment": "...",
      "timestamp": "2026-02-06T10:35:00"
    }
  ]
}
```

### Knowledge Base

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tips` | Get all farming tips |
| GET | `/api/tips/<category>` | Get tips by category |

**Tips Response:**
```json
{
  "tips": [
    {
      "id": 1,
      "category": "Tomato Care",
      "title": "Proper Watering Techniques",
      "description": "..."
    }
  ]
}
```

### Chatbot

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Chat with AI assistant |

**Request:**
```json
{
  "disease": "Tomato Early Blight",
  "message": "How to prevent this?"
}
```

**Response:**
```json
{
  "reply": "To prevent Tomato Early Blight: use resistant varieties, ensure good air circulation..."
}
```

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check API status |

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

## 🔐 Authentication Flow

```
User Signs Up
    ↓
Password hashed with bcrypt (10 rounds)
    ↓
User created in database
    ↓
User can Login
    ↓
JWT token generated (7-day expiry)
    ↓
Token stored in browser localStorage
    ↓
All API requests include: "Authorization: Bearer <token>"
    ↓
Backend validates token with @token_required decorator
    ↓
If valid → execute route
If invalid/expired → return 401 Unauthorized
```

## 🗄️ Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Predictions Table:**
```sql
CREATE TABLE predictions (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL FOREIGN KEY,
  image_path VARCHAR(255) NOT NULL,
  predicted_disease VARCHAR(100) NOT NULL,
  confidence FLOAT NOT NULL,
  treatment TEXT NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 🌍 Deployment

### Deploy Backend (Heroku/Railway)

1. **Push code to repository**
   ```bash
   git init
   git add .
   git commit -m "CropAI production ready"
   ```

2. **Create Procfile** in root:
   ```
   web: gunicorn -w 4 -b 0.0.0.0:$PORT app:app
   ```

3. **Create runtime.txt**:
   ```
   python-3.12.9
   ```

4. **Install gunicorn**:
   ```bash
   pip install gunicorn
   pip freeze > requirements.txt
   ```

5. **Set environment variables** on hosting platform:
   - `DATABASE_URL`: PostgreSQL connection string
   - `JWT_SECRET_KEY`: Generate random 32+ char string
   - `FLASK_ENV`: production
   - `FRONTEND_URL`: Your frontend domain

6. **Deploy to Heroku**:
   ```bash
   heroku create cropai-production
   heroku config:set JWT_SECRET_KEY=<generated-key>
   git push heroku main
   ```

### Deploy Frontend (Vercel/Netlify)

1. **Build for production**:
   ```bash
   cd frontend/cropai-ui
   npm run build
   ```

2. **Deploy using Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set environment variables in Vercel**:
   - `VITE_API_URL`: Your backend API URL (e.g., https://cropai-api.herokuapp.com/api)

### Production Checklist

- [ ] Change `JWT_SECRET_KEY` to cryptographically secure value
  ```bash
  python -c "import secrets; print(secrets.token_hex(32))"
  ```
- [ ] Migrate to PostgreSQL or MySQL (SQLite not recommended for production)
- [ ] Set `FLASK_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain only
- [ ] Setup database backups (daily minimum)
- [ ] Setup error logging (Sentry/DataDog)
- [ ] Configure caching headers for static assets
- [ ] Test complete authentication flow end-to-end
- [ ] Test all API endpoints with curl/Postman
- [ ] Setup monitoring and uptime alerts
- [ ] Document API for future developers
- [ ] Rate limiting on auth endpoints

## 🔧 Configuration

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | development | Environment: development/production |
| `HOST` | 0.0.0.0 | Server host address |
| `PORT` | 5000 | Server port |
| `DATABASE_URL` | sqlite:///cropai.db | DB connection (SQLite/PostgreSQL) |
| `JWT_SECRET_KEY` | (insecure) | Secret key for JWT signing |
| `FRONTEND_URL` | http://localhost:5173 | Frontend URL for CORS |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:5000/api | Backend API URL |

## 📊 Model Information

- **Architecture**: Keras Sequential with MobileNetV2 backbone + Dense layers
- **Input**: 224x224 RGB images (normalized 0-1)
- **Output**: 5 classes (probability distribution)
- **Training**: 10 epochs, batch size 32
- **Classes**:
  1. Potato Early Blight
  2. Potato Healthy
  3. Tomato Early Blight
  4. Tomato Healthy
  5. Tomato Late Blight

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get current user (use token from login response)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_token>"
```

### Test Prediction
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer <your_token>" \
  -F "image=@path/to/image.jpg"
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Model not loading | Ensure `model/crop_disease_model.h5` exists and has correct permissions |
| CORS errors | Check `FRONTEND_URL` in `.env` matches your frontend address |
| Authentication failing | Clear browser localStorage, try registering new account |
| Database locked | Delete `cropai.db`, restart backend (auto-creates new DB) |
| Frontend can't reach API | Check Vite proxy in `vite.config.js` and backend is running |
| "Token expired" errors | Token expires after 7 days, user must login again |
| Image prediction fails | Ensure image is valid JPG/PNG, less than 5MB |

## 📈 Future Enhancements

- [ ] Multi-crop support (rice, wheat, corn, etc.)
- [ ] Real-time model fine-tuning
- [ ] Crop yield prediction models
- [ ] Weather integration API
- [ ] Multi-language support (10+ languages)
- [ ] Cloud image storage (AWS S3, Firebase)
- [ ] Advanced analytics dashboard
- [ ] Farmer community forum
- [ ] Mobile apps (React Native, Flutter)
- [ ] Payment integration (Stripe, Razorpay)
- [ ] SMS/Email notifications
- [ ] Video call support with agronomists
- [ ] Crop calendar and planning tools
- [ ] Price tracking for crops

## 📄 License

MIT License - See LICENSE file for details

## 💬 Support & Contact

For issues, questions, or feature requests:
- Open an issue on GitHub
- Email: support@cropai.com
- Documentation: [Full API Docs]

---

**CropAI - Protecting Crops with Artificial Intelligence 🌱✨**
