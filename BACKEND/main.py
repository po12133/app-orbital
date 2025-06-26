import subprocess
import platform
import json
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/primera-formula', methods=['POST'])
def primera_formula():
    data = request.get_json()

    campos = ['a', 'e', 'i', 'omega', 'w', 'theta', 'nrev']
    if not all(k in data for k in campos):
        return jsonify({"error": "Faltan parámetros"}), 400

    params = f"{data['a']} {data['e']} {data['i']} {data['omega']} {data['w']} {data['theta']} {data['nrev']}"
    exe = "orbit-k1.exe" if platform.system() == "Windows" else "./orbit-k1"

    try:
        result = subprocess.run(
            [exe, params],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        lines = result.stdout.splitlines()
        json_data = []

        for line in lines:
            line = line.strip()
            if line.startswith('{') and line.endswith('}'):
                try:
                    parsed = json.loads(line)
                    json_data.append(parsed)
                except json.JSONDecodeError as e:
                    print("Línea no válida:", line)
                    continue

        return jsonify({
            "codigo_salida": result.returncode,
            "data": json_data,
            "errores": result.stderr
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
