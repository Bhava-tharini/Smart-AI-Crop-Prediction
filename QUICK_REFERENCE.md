# CropAI - Quick Reference

## 🚀 Start Development
```bash
# Backend (Terminal 1)
python app.py           # Starts on http://localhost:5000

# Frontend (Terminal 2)
cd frontend/cropai-ui
npm run dev             # Starts on http://localhost:5173
```

## 🔐 Default Test Account
```
Email: test@example.com
Password: password123
```
(Or create your own on signup page)

## 📂 Important Files

### Backend
- `app.py` - Flask application entry point
- `backend/routes/auth.py` - Authentication endpoints
- `backend/routes/predict.py` - Disease detection
- `backend/database/db.py` - Database models
- `backend/services/auth_service.py` - JWT & bcrypt
- `.env` - Backend configuration

### Frontend
- `frontend/cropai-ui/src/App.jsx` - Main app with routing
- `frontend/cropai-ui/src/context/AuthContext.jsx` - Auth state
- `frontend/cropai-ui/src/pages/` - All pages
- `frontend/cropai-ui/.env` - Frontend config

## 🔌 API Testing (cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
# Returns: { "token": "...", "user": {...} }
```

### Predict (use token from login)
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/leaf.jpg"
```

### Get History
```bash
curl -X GET http://localhost:5000/api/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Tips
```bash
curl -X GET http://localhost:5000/api/tips \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Chat
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"disease":"Tomato Early Blight","message":"How to treat?"}'
```

## 🗂️ Folder Navigation

```
Root
├─ backend/           (Flask API code)
├─ frontend/cropai-ui/ (React app code)
├─ model/             (TensorFlow model)
├─ dataset/           (Training/test data)
├─ app.py             (Start here!)
├─ requirements.txt   (Python packages)
└─ .env               (Configuration)
```

## 🎯 URL Quick Links

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React Vite app |
| Backend | http://localhost:5000 | Flask API |
| Health | http://localhost:5000/api/health | API status |

## 📝 Database

SQLite database automatically created at `cropai.db`

**Reset database:**
```bash
# Delete the database file
rm cropai.db  (Linux/Mac)
del cropai.db (Windows)
# Restart backend - database will auto-recreate
```

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| Model not loading | Check `model/crop_disease_model.h5` exists |
| CORS error | Ensure VITE_API_URL in frontend/.env is correct |
| Port already in use | Change PORT in .env or kill process using port |
| Auth failing | Clear localStorage and try registering new account |
| Dependencies missing | Run `pip install -r requirements.txt` |

## 🔑 Environment Variables

**Backend (.env):**
```
FLASK_ENV=development
PORT=5000
DATABASE_URL=sqlite:///cropai.db
JWT_SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Tables

**users:**
- id (Primary Key)
- email (unique)
- password_hash (bcrypt hashed)
- created_at (timestamp)

**predictions:**
- id (Primary Key)
- user_id (Foreign Key → users.id)
- predicted_disease (string)
- confidence (float 0-100)
- treatment (text)
- timestamp (datetime)

## 🚨 Important Notes

- Passwords are hashed with bcrypt - never stored in plain text
- JWT tokens expire after 7 days - user must login again
- All API endpoints (except /health) require Authorization header
- Images are not persisted to disk yet - can be added with S3 integration
- SQLite is fine for development - use PostgreSQL for production

## 📖 Full Documentation

See `DOCUMENTATION.md` for:
- Complete API reference
- Installation instructions
- Deployment guide
- Database schema
- Architecture overview
- Troubleshooting

See `IMPLEMENTATION_SUMMARY.md` for:
- What was built
- Technology stack
- Performance metrics
- Security features
- Testing checklist

## 🎓 Learning Path

1. **Understand structure**: Read this file + IMPLEMENTATION_SUMMARY.md
2. **Start backend**: `python app.py` - See logs
3. **Test API**: Use cURL commands above
4. **Start frontend**: `npm run dev` - See React output
5. **Test UI**: Register → Login → Upload image
6. **Read source**: Look at route files for API logic
7. **Modify code**: Try adding new features
8. **Deploy**: Follow DOCUMENTATION.md deployment section

## 🎉 Next Steps

- [ ] Run the application locally
- [ ] Test user registration and login
- [ ] Upload a crop leaf image
- [ ] View prediction results
- [ ] Check scan history
- [ ] Browse farming tips
- [ ] Chat with AI assistant
- [ ] Read deployment guide
- [ ] Deploy to production

---

**Happy farming! 🌱✨**
