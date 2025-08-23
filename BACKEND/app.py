import os
from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from config import DevelopmentConfig, ProductionConfig, TestingConfig
from routes.orbit_routes import orbit_bp

app = Flask(__name__)

# Habilita CORS para todos los dominios
CORS(app)

# Selecciona configuración por entorno
env = os.environ.get("FLASK_ENV", "development")
if env == "production":
    app.config.from_object(ProductionConfig)
elif env == "testing":
    app.config.from_object(TestingConfig)
else:
    app.config.from_object(DevelopmentConfig)

Swagger(app)

@app.route("/")
def home():
    return "Hola, Flask está funcionando!"

# Registrar blueprint
app.register_blueprint(orbit_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)