from flask import Blueprint, jsonify
from backend.services.auth_service import token_required
from backend.database.db import Prediction

history_bp = Blueprint('history', __name__, url_prefix='/api/history')

@history_bp.route('', methods=['GET'])
@token_required
def get_user_history(user):
    """
    Get all predictions for the current user.
    Returns list of predictions ordered by most recent first.
    """
    try:
        predictions = Prediction.query.filter_by(user_id=user.id).order_by(
            Prediction.timestamp.desc()
        ).all()
        
        return jsonify({
            "history": [p.to_dict() for p in predictions]
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch history: {str(e)}"}), 500
