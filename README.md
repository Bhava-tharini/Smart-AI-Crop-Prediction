CropAI — AI Crop Disease Detector

Overview
- Backend: Flask API (no HTML templates) - exposes JSON endpoints under /api
- Frontend: React (Vite) - single-page UI at `frontend/cropai-ui`
- Model: TensorFlow/Keras model at `model/crop_disease_model.h5`

Key endpoints
- POST /api/predict: multipart/form-data with field `image` → returns JSON { disease, confidence, treatment }
- POST /api/chat: JSON { disease, message } → returns JSON { reply }

Run (development)
1) Start backend (Terminal A):
   python app.py

2) Start frontend (Terminal B):
   cd frontend/cropai-ui
   npm install
   npm run dev

Notes
- Vite dev server proxies `/api` to `http://127.0.0.1:5000` (see `vite.config.js`)
- The Flask server returns only JSON (no HTML templates)
- If the model is missing, `/api/health` will report model_loaded: false

License
MIT
