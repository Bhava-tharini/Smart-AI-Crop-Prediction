from flask import Flask, render_template, request, jsonify
import numpy as np
import tensorflow as tf
from PIL import Image

app = Flask(__name__)

# Load model
MODEL_PATH = "model/crop_disease_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

# Classes
CLASS_NAMES = [
    "Potato Early Blight",
    "Potato Healthy",
    "Tomato Early Blight",
    "Tomato Healthy",
    "Tomato Late Blight"
]

# Treatment base
TREATMENT = {
    "Potato Early Blight": "Use fungicide (Mancozeb). Remove infected leaves and avoid overhead watering.",
    "Potato Healthy": "Plant is healthy. Continue regular watering and sunlight.",
    "Tomato Early Blight": "Use neem oil or copper fungicide. Ensure good air circulation.",
    "Tomato Healthy": "Healthy plant. Maintain soil nutrients and proper watering.",
    "Tomato Late Blight": "Remove infected plants immediately. Use fungicide and avoid wet leaves."
}

# Chatbot brain
def chatbot_reply(disease, user_message):
    user_message = user_message.lower()

    if "fertilizer" in user_message:
        return f"For {disease}, use organic compost and potassium-rich fertilizer."

    elif "water" in user_message or "irrigation" in user_message:
        return f"Water {disease} plants early in the morning. Avoid wetting the leaves."

    elif "pesticide" in user_message or "spray" in user_message:
        return f"For {disease}, neem oil or copper fungicide works well."

    elif "weather" in user_message:
        return "Avoid spraying during rainy or very hot weather."

    else:
        return f"I can help you with fertilizer, watering, pesticide, or weather tips for {disease}."

# Image preprocess
def preprocess_image(image):
    img = image.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

# MAIN PAGE
@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

# API ENDPOINT (THIS IS WHAT UI CALLS)
@app.route("/api/predict", methods=["POST"])
def api_predict():
    file = request.files["image"]
    message = request.form.get("message", "")

    image = Image.open(file.stream).convert("RGB")
    processed = preprocess_image(image)
    prediction = model.predict(processed)

    class_index = np.argmax(prediction)
    result = CLASS_NAMES[class_index]
    confidence = round(float(np.max(prediction)) * 100, 2)
    treatment = TREATMENT[result]

    chat_response = chatbot_reply(result, message) if message else ""

    return jsonify({
        "disease": result,
        "confidence": confidence,
        "treatment": treatment,
        "assistant": chat_response
    })

# RUN SERVER (ALWAYS LAST)
if __name__ == "__main__":
    app.run(debug=True)

