from flask import Blueprint, jsonify
from backend.services.auth_service import token_required
from backend.database.db import Prediction

stats_bp = Blueprint('stats', __name__, url_prefix='/api/stats')


@stats_bp.route('', methods=['GET'])
@stats_bp.route('/', methods=['GET'])
@token_required
def get_user_stats(user):
    """
    Get statistics for the current user.
    Returns total scans, diseased count, and healthy count.
    Protected route - requires authentication.
    """
    try:
        # Get all predictions for the user
        predictions = Prediction.query.filter_by(user_id=user.id).all()
        
        total_scans = len(predictions)
        
        # Count diseased and healthy
        diseased_count = sum(1 for p in predictions if p.predicted_disease.lower() != 'healthy')
        healthy_count = sum(1 for p in predictions if p.predicted_disease.lower() == 'healthy')
        
        return jsonify({
            "total_scans": total_scans,
            "diseased_count": diseased_count,
            "healthy_count": healthy_count
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch stats: {str(e)}"}), 500
