import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database and services
from backend.database.db import db
from backend.services.auth_service import token_required
from backend.services.model_service import ModelService
from backend.routes.auth import auth_bp
from backend.routes.history import history_bp
from backend.routes.tips import tips_bp
from backend.routes.stats import stats_bp
from backend.routes.chat import chat_bp
from backend.database.db import Prediction

# --------------------
# App Initialization
# --------------------
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///cropai.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')

# Initialize extensions
db.init_app(app)

# CORS Configuration
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            os.getenv('FRONTEND_URL', 'http://localhost:5173')
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(history_bp)
app.register_blueprint(tips_bp)
app.register_blueprint(stats_bp)
app.register_blueprint(chat_bp)

# Create database tables
with app.app_context():
    db.create_all()
    print("[CropAI] Database initialized.")

# Load ML model at startup
ModelService.load_model()

# --------------------
# API Endpoints
# --------------------

@app.route("/api/predict", methods=["POST"])
@token_required
def api_predict(user):
    """
    Predict disease from image and save to history.
    Protected route - requires authentication.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image provided. Please upload a file with key 'image'."}), 400

    result = ModelService.predict(request.files["image"])
    
    if result["error"]:
        return jsonify(result), 500
    
    # Save prediction to database
    try:
        prediction = Prediction(
            user_id=user.id,
            image_path="uploaded",  # We'll handle file storage later
            predicted_disease=result["disease"],
            confidence=result["confidence"],
            treatment=result["treatment"]
        )
        db.session.add(prediction)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"[CropAI] Failed to save prediction: {e}")
    
    return jsonify({
        "disease": result["disease"],
        "confidence": result["confidence"],
        "treatment": result["treatment"]
    }), 200


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": ModelService._model is not None
    }), 200


# --------------------
# Error Handlers
# --------------------

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found."}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error."}), 500


# --------------------
# Run Server
# --------------------
if __name__ == "__main__":
    # Development server - use gunicorn in production
    app.run(
        host=os.getenv('HOST', '0.0.0.0'),
        port=int(os.getenv('PORT', 5000)),
        debug=os.getenv('FLASK_ENV') == 'development'
    )

