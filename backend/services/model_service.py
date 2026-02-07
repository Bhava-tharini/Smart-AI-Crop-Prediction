import tensorflow as tf
import numpy as np
from PIL import Image
import os

class ModelService:
    """
    Handles ML model operations for disease prediction.
    """
    
    MODEL_PATH = os.path.join("model", "crop_disease_model.h5")
    
    CLASS_NAMES = [
        "Potato Early Blight",
        "Potato Healthy",
        "Tomato Early Blight",
        "Tomato Healthy",
        "Tomato Late Blight"
    ]
    
    TREATMENT = {
        "Potato Early Blight": "Use fungicide (Mancozeb). Remove infected leaves and avoid overhead watering.",
        "Potato Healthy": "Plant is healthy. Continue regular watering and sunlight.",
        "Tomato Early Blight": "Use neem oil or copper fungicide. Ensure good air circulation.",
        "Tomato Healthy": "Healthy plant. Maintain soil nutrients and proper watering.",
        "Tomato Late Blight": "Remove infected plants immediately. Use fungicide and avoid wet leaves."
    }
    
    _model = None
    
    @classmethod
    def load_model(cls):
        """Load the ML model if not already loaded."""
        if cls._model is None:
            try:
                cls._model = tf.keras.models.load_model(cls.MODEL_PATH)
                print(f"[CropAI] Model loaded from: {cls.MODEL_PATH}")
            except Exception as e:
                print(f"[CropAI] Warning: Could not load model: {e}")
        return cls._model
    
    @staticmethod
    def preprocess_image(image):
        """Preprocess image for model prediction."""
        image = image.resize((224, 224))
        img = np.array(image).astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)
        return img
    
    @classmethod
    def predict(cls, image_file):
        """
        Predict disease from image.
        Returns dict with disease, confidence, and treatment or error message.
        """
        model = cls.load_model()
        
        if model is None:
            return {
                "error": "Model not loaded on server.",
                "disease": None,
                "confidence": None,
                "treatment": None
            }
        
        try:
            # Open and convert image
            image = Image.open(image_file.stream).convert("RGB")
            processed = cls.preprocess_image(image)
            
            # Predict
            prediction = model.predict(processed, verbose=0)
            class_index = int(np.argmax(prediction))
            disease = cls.CLASS_NAMES[class_index]
            confidence = round(float(np.max(prediction)) * 100, 2)
            treatment = cls.TREATMENT.get(disease, "No treatment available")
            
            return {
                "disease": disease,
                "confidence": confidence,
                "treatment": treatment,
                "error": None
            }
        except Exception as e:
            return {
                "error": f"Prediction failed: {str(e)}",
                "disease": None,
                "confidence": None,
                "treatment": None
            }
