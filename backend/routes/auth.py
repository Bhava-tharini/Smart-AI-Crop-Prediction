from flask import Blueprint, request, jsonify
from backend.services.auth_service import AuthService, token_required
from backend.database.db import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    Expects: { "email": "...", "password": "..." }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON body provided."}), 400
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    user, error = AuthService.register_user(email, password)
    
    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({
        "message": "User registered successfully.",
        "user": user
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user and return JWT token.
    Expects: { "email": "...", "password": "..." }
    """
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No JSON body provided."}), 400
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    token, user, error = AuthService.login_user(email, password)
    
    if error:
        return jsonify({"error": error}), 401
    
    return jsonify({
        "message": "Login successful.",
        "token": token,
        "user": user
    }), 200


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user):
    """
    Get current authenticated user.
    Requires: Authorization header with Bearer token
    """
    return jsonify({
        "user": user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout(user):
    """
    Logout endpoint (mainly for frontend cleanup).
    Token is invalidated on frontend by removing localStorage.
    """
    return jsonify({
        "message": "Logout successful."
    }), 200
