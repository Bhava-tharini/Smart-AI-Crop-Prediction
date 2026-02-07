from flask import Blueprint, jsonify

tips_bp = Blueprint('tips', __name__, url_prefix='/api/tips')

# Disease Reference Database
DISEASE_REFERENCE = [
    {
        "id": 1,
        "name": "Tomato Late Blight",
        "crop": "Tomato",
        "symptoms": "Water-soaked spots on leaves and stems that quickly turn brown. Rapid spreading in humid conditions. White mold on undersides of leaves. Can destroy entire plant in 3-5 days if untreated.",
        "cause": "Caused by Phytophthora infestans fungus. Spreads through water droplets and soil. Thrives in cool, wet conditions (55-75°F with high humidity).",
        "treatment": "Apply copper-based fungicides or fixed copper spray every 7-10 days. Remove infected leaves and plants immediately. Improve air circulation. Use resistant tomato varieties. Apply at first sign of disease.",
        "prevention": "Plant resistant varieties. Maintain proper spacing for air flow. Water at soil level only, never on leaves. Remove fallen leaves and debris. Rotate crops yearly. Use certified disease-free seed."
    },
    {
        "id": 2,
        "name": "Tomato Early Blight",
        "crop": "Tomato",
        "symptoms": "Circular brown spots with concentric rings (target-like pattern) on lower leaves. Yellow halo around spots. Spots gradually spread upward on the plant. Can cause severe defoliation.",
        "cause": "Caused by Alternaria solani fungus. Spreads through soil splashing on leaves and airborne spores. Worsened by overhead watering and poor air circulation.",
        "treatment": "Prune infected leaves and destroy them. Apply fungicide containing mancozeb or chlorothalonil every 7 days. Stake and prune plants for air circulation. Remove diseased plant material from field.",
        "prevention": "Use drip irrigation instead of overhead watering. Mulch to prevent soil splash. Maintain plant spacing. Remove lower leaves. Rotate crops. Practice good sanitation. Use resistant varieties."
    },
    {
        "id": 3,
        "name": "Potato Late Blight",
        "crop": "Potato",
        "symptoms": "Water-soaked lesions on leaves that turn brown or black. White mycelial growth on leaf undersides. Rapid defoliation. Tubers develop dark, sunken lesions that can rot completely.",
        "cause": "Caused by Phytophthora infestans. Most severe in cool, wet conditions. Spreads rapidly in rainfall. Can cause total crop failure. Historical cause of Irish Potato Famine.",
        "treatment": "Apply copper-based fungicides weekly starting at plant emergence. Use potato-specific fungicides like mancozeb or chlorothalonil. Remove affected plants immediately. Stop overhead irrigation if possible.",
        "prevention": "Plant certified disease-free seed potatoes. Use resistant varieties (Ranger Russet, Elba). Rotate crops for 3+ years. Avoid overhead watering. Hill soil around plants. Destroy volunteer potatoes and cull infected tubers."
    },
    {
        "id": 4,
        "name": "Potato Healthy",
        "crop": "Potato",
        "symptoms": "Uniform green leaves without spots or discoloration. Strong upright growth. Consistent plant color throughout. No wilting or unusual growth patterns.",
        "cause": "Good growing conditions and proper crop management lead to healthy plants. Includes proper soil preparation, adequate spacing, correct watering, and disease prevention.",
        "treatment": "Maintain excellent cultural practices. Continue monitoring for early signs of disease. Apply preventive fungicides if weather favors disease development.",
        "prevention": "Use certified disease-free seed potatoes. Practice crop rotation. Maintain well-drained soil. Provide adequate spacing for air circulation. Water at soil level. Remove weeds. Scout regularly. Follow integrated pest management."
    }
]


@tips_bp.route('', methods=['GET'])
@tips_bp.route('/', methods=['GET'])
def get_disease_reference():
    """
    Get disease reference database with detailed information.
    Returns structured data for Tomato Late Blight, Tomato Early Blight,
    Potato Late Blight, and Potato Healthy status.
    """
    try:
        return jsonify({
            "diseases": DISEASE_REFERENCE,
            "count": len(DISEASE_REFERENCE)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch disease reference: {str(e)}"}), 500


@tips_bp.route('/<disease_name>', methods=['GET'])
def get_disease_by_name(disease_name):
    """
    Get specific disease information by name.
    """
    try:
        disease = next((d for d in DISEASE_REFERENCE if d['name'].lower() == disease_name.lower()), None)
        
        if not disease:
            return jsonify({"error": "Disease not found"}), 404
        
        return jsonify(disease), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch disease info: {str(e)}"}), 500
