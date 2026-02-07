from flask import Blueprint, request, jsonify
from backend.services.auth_service import token_required

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')


def chatbot_reply(disease, user_message):
    """
    Simple rule-based chatbot response for farming queries.
    Expands on the basic queries with more detailed information.
    """
    user_message = (user_message or "").lower()
    
    if any(word in user_message for word in ["fertilizer", "nutrient", "feed", "compost"]):
        return f"For {disease}, use organic compost and potassium-rich fertilizer. Apply every 2-3 weeks during growing season. NPK ratios like 10-10-10 work well. Also consider adding calcium to prevent deficiencies."
    
    if any(word in user_message for word in ["water", "irrigation", "watering", "moisture"]):
        return f"Water {disease} plants early in the morning. Avoid wetting the leaves. Give 1-2 inches per week based on rainfall. Use drip irrigation for best results to reduce disease spread."
    
    if any(word in user_message for word in ["pesticide", "spray", "fungicide", "neem", "copper"]):
        return f"For {disease}, neem oil or copper fungicide works well. Spray in late afternoon to avoid leaf burn. Mix according to package directions. Repeat every 7-10 days if needed."
    
    if any(word in user_message for word in ["weather", "rain", "humidity", "warm", "temperature"]):
        return "Avoid spraying during rainy or very hot weather. Best spray times are early morning or late afternoon when temperatures are 50-85°F. High humidity increases disease risk."
    
    if any(word in user_message for word in ["prevention", "prevent", "resistant", "resistance", "varieties"]):
        return f"To prevent {disease}: use resistant varieties, ensure good air circulation, remove infected leaves promptly, rotate crops annually, and monitor plants daily for early signs of disease."
    
    if any(word in user_message for word in ["soil", "ground", "compost", "organic", "matter"]):
        return f"For {disease}, improve soil health with compost and organic matter. Maintain proper drainage and avoid waterlogging. Add mulch to retain moisture and regulate soil temperature."
    
    if any(word in user_message for word in ["treatment", "cure", "fix", "save", "recover"]):
        return f"Once {disease} is confirmed, remove infected plants immediately. Treat remaining plants with fungicide every 7-10 days. Improve cultural practices like watering and spacing to prevent spread."
    
    # Default response
    return f"I can help you with {disease}! Ask me about fertilizer, watering, pesticides, weather, prevention, soil, or treatment recommendations."


@chat_bp.route('', methods=['POST'])
@chat_bp.route('/', methods=['POST'])
@token_required
def chat(user):
    """
    Chat with AI crop assistant.
    Expects: { "disease": "...", "message": "..." }
    Returns: { "reply": "..." }
    """
    data = request.get_json() or {}
    
    disease = data.get("disease", "your crop").strip()
    message = data.get("message", "").strip()
    
    if not message:
        return jsonify({"error": "Please provide a message."}), 400
    
    try:
        reply = chatbot_reply(disease, message)
        return jsonify({
            "reply": reply
        }), 200
    except Exception as e:
        return jsonify({"error": f"Chatbot error: {str(e)}"}), 500
