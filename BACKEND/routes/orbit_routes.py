from flask import Blueprint
from controllers.orbit_controller import primera_formula, segunda_formula

orbit_bp = Blueprint('orbit', __name__)

# Rutas
orbit_bp.route('/primera-formula', methods=['POST'])(primera_formula)
orbit_bp.route('/segunda-formula', methods=['POST'])(segunda_formula)