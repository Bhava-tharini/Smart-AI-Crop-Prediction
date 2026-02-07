import jwt
import bcrypt
import os
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from backend.database.db import User, db

class AuthService:
    """
    Handles user authentication, JWT token generation, and password hashing.
    """
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt."""
        salt = bcrypt.gensalt(rounds=10)
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    @staticmethod
    def verify_password(stored_hash: str, password: str) -> bool:
        """Verify a password against its hash."""
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8'))
    
    @staticmethod
    def create_jwt_token(user_id: int, email: str) -> str:
        """Create a JWT token for a user."""
        payload = {
            'user_id': user_id,
            'email': email,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=7)  # 7 days expiry
        }
        token = jwt.encode(
            payload,
            current_app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production'),
            algorithm='HS256'
        )
        return token
    
    @staticmethod
    def verify_jwt_token(token: str) -> dict:
        """
        Verify and decode a JWT token.
        Returns user data on success, None on failure.
        """
        try:
            payload = jwt.decode(
                token,
                current_app.config.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production'),
                algorithms=['HS256']
            )
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    @staticmethod
    def register_user(email: str, password: str) -> tuple:
        """
        Register a new user.
        Returns (user_dict, error_message).
        If success: (user_dict, None)
        If error: (None, error_message)
        """
        # Validate inputs
        if not email or not password:
            return None, "Email and password are required."
        
        if len(password) < 6:
            return None, "Password must be at least 6 characters."
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return None, "Email already registered."
        
        # Hash password and create user
        try:
            password_hash = AuthService.hash_password(password)
            new_user = User(email=email, password_hash=password_hash)
            db.session.add(new_user)
            db.session.commit()
            return new_user.to_dict(), None
        except Exception as e:
            db.session.rollback()
            return None, f"Registration failed: {str(e)}"
    
    @staticmethod
    def login_user(email: str, password: str) -> tuple:
        """
        Authenticate a user and return JWT token.
        Returns (token, user_dict, error_message).
        If success: (token, user_dict, None)
        If error: (None, None, error_message)
        """
        if not email or not password:
            return None, None, "Email and password are required."
        
        user = User.query.filter_by(email=email).first()
        if not user:
            return None, None, "Invalid email or password."
        
        if not AuthService.verify_password(user.password_hash, password):
            return None, None, "Invalid email or password."
        
        token = AuthService.create_jwt_token(user.id, user.email)
        return token, user.to_dict(), None
    
    @staticmethod
    def get_user_from_token(token: str):
        """Get user from JWT token."""
        payload = AuthService.verify_jwt_token(token)
        if not payload:
            return None
        
        user = User.query.filter_by(id=payload['user_id']).first()
        return user


def token_required(f):
    """
    Decorator to protect routes that require authentication.
    Extracts user from JWT token in Authorization header.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                # Expected format: "Bearer <token>"
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Invalid authorization header format."}), 401
        
        if not token:
            return jsonify({"error": "Authorization token is missing."}), 401
        
        # Verify token
        payload = AuthService.verify_jwt_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token."}), 401
        
        # Get user from database
        user = User.query.filter_by(id=payload['user_id']).first()
        if not user:
            return jsonify({"error": "User not found."}), 401
        
        # Pass user to the route handler
        return f(user, *args, **kwargs)
    
    return decorated_function
