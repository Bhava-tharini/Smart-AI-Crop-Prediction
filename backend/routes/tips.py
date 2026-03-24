from flask import Blueprint, jsonify

tips_bp = Blueprint('tips', __name__, url_prefix='/api/tips')

# Disease Reference Database
DISEASE_REFERENCE = [
    {
        "id": 1,
        "name": "Leaf Spot Disease",
        "crop": "Plant Leaf",
        "symptoms": "Small dark spots or lesions on leaf surface, often with yellow halos. Spots may merge, causing large necrotic areas.",
        "cause": "Fungal or bacterial pathogens that thrive in warm, wet conditions; spread by water splash and contaminated tools.",
        "treatment": "Remove affected leaves, apply neem oil or copper fungicide, improve airflow and avoid overhead irrigation.",
        "prevention": "Ensure proper spacing, use drip irrigation, maintain clean tools, and apply preventive sprays during humid weather."
    },
    {
        "id": 2,
        "name": "Severe Fungal Infection",
        "crop": "Plant Leaf",
        "symptoms": "Dark brown to black lesions, rapid leaf necrosis, potential stem infection and wilting.",
        "cause": "Aggressive fungal pathogens (e.g., Phytophthora), favored by cool, wet environments and poor drainage.",
        "treatment": "Apply fungicide spray, avoid wet leaves, improve airflow, remove infected plants promptly.",
        "prevention": "Use resistant varieties, avoid overhead watering, maintain clean field and proper rotation."
    },
    {
        "id": 3,
        "name": "Nutrient Deficiency",
        "crop": "Plant Leaf",
        "symptoms": "Yellowing leaves (chlorosis), stunted growth, pale veins, or overall weak plant vigor.",
        "cause": "Lack of essential nutrients (NPK, iron, magnesium) and poor soil quality.",
        "treatment": "Apply balanced fertilizer, correct pH, and add organic matter to soil.",
        "prevention": "Regular soil testing, proper fertilization schedule, and maintaining soil health."
    },
    {
        "id": 4,
        "name": "Viral Infection",
        "crop": "Plant Leaf",
        "symptoms": "Leaf curling, distortion, mosaic patterns, and stunted growth; spread via insects.",
        "cause": "Viral pathogens transmitted by insects (aphids, whiteflies) and contaminated equipment.",
        "treatment": "Remove infected plants, control insect vectors, and isolate healthy plants.",
        "prevention": "Use virus-free seed, control insects, and practice crop rotation and biological control."
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
