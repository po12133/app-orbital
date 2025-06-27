import subprocess
import platform
import json
from flask import request, jsonify
from flasgger import swag_from
from utils.swagger_loader import load_yaml

@swag_from(load_yaml('orbita', 'primera_formula.yml'))
def primera_formula():
    data = request.get_json()

    campos = ['a', 'e', 'i', 'omega', 'w', 'theta', 'nrev']
    if not all(k in data for k in campos):
        return jsonify({"error": "Faltan parámetros"}), 400

    params = f"{data['a']} {data['e']} {data['i']} {data['omega']} {data['w']} {data['theta']} {data['nrev']}"
    if platform.system() == "Windows":
        exe = "orbit-k1.exe"
    else:
        exe = "./orbit-k1"

    try:
        result = subprocess.run(
            [exe, params],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        lines = result.stdout.splitlines()
        raw_data = []

        for line in lines:
            line = line.strip()
            if line.startswith('[') and line.endswith(']'):
                raw_data.append(line)
        print("Borrame:", len(raw_data[0]))
        return jsonify({
            "codigo_salida": result.returncode,
            "data": raw_data,  # ← aquí las listas en string sin tocar
            "errores": result.stderr
        })


    except Exception as e:
        return jsonify({"error": str(e)}), 500