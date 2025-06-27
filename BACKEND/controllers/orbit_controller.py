import subprocess
import platform
import json
from flask import request, jsonify
from flasgger import swag_from
from utils.swagger_loader import load_yaml

@swag_from(load_yaml('orbita', 'primera_formula.yml'))
def primera_formula():
    # Verificar que la request tenga JSON
    if not request.is_json:
        return jsonify({"error": "Content-Type debe ser application/json"}), 415
    
    data = request.get_json()
    
    # Verificar que data no sea None
    if data is None:
        return jsonify({"error": "Body debe contener JSON válido"}), 400

    campos = ['a', 'e', 'i', 'omega', 'w', 'theta', 'nrev']
    if not all(k in data for k in campos):
        campos_faltantes = [k for k in campos if k not in data]
        return jsonify({
            "error": "Faltan parámetros", 
            "campos_faltantes": campos_faltantes
        }), 400

    # Convertir parámetros a lista de strings (argumentos separados)
    params = [
        str(data['a']), 
        str(data['e']), 
        str(data['i']), 
        str(data['omega']), 
        str(data['w']), 
        str(data['theta']), 
        str(data['nrev'])
    ]
    
    exe = "orbit-k1.exe" if platform.system() == "Windows" else "./orbit-k1"

    try:
        # Pasar argumentos separados, no como un string único
        result = subprocess.run(
            [exe] + params,  # ✅ Corregido: argumentos separados
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=30  # Agregar timeout por seguridad
        )

        lines = result.stdout.splitlines()
        json_data = []

        for line in lines:
            line = line.strip()
            if line.startswith('{') and line.endswith('}'):
                try:
                    parsed = json.loads(line)
                    json_data.append(parsed)
                except json.JSONDecodeError:
                    continue

        return jsonify({
            "codigo_salida": result.returncode,
            "data": json_data,
            "errores": result.stderr
        })

    except subprocess.TimeoutExpired:
        return jsonify({"error": "Timeout ejecutando simulación"}), 500
    except FileNotFoundError:
        return jsonify({"error": f"No se encontró el ejecutable {exe}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500