# \ud83d\ude80 Orbit API - Simulaci\u00f3n de \u00d3rbitas Satelitales

Este proyecto es una API REST en Flask que ejecuta una simulaci\u00f3n orbital basada en elementos keplerianos utilizando un binario externo (`orbit-k1`). Est\u00e1 estructurado bajo el patr\u00f3n MVC y documentado con Swagger.

---

## \ud83d\udcc1 Estructura del Proyecto

```
BACKEND/
├── app.py                     # Punto de entrada
├── config.py                  # Configuraci\u00f3n por entorno
├── .env                       # Variables de entorno
├── controllers/               # L\u00f3gica de control (Controladores)
│   └── orbit_controller.py
├── routes/                    # Definici\u00f3n de rutas (Vistas)
│   └── orbit_routes.py
├── models/                    # Modelos (si se requieren en el futuro)
├── docs/                      # Documentaci\u00f3n Swagger por endpoint
│   └── primera_formula.yml
├── static/                    # Archivos est\u00e1ticos (no usado a\u00fan)
├── templates/                 # Plantillas HTML (no usado a\u00fan)
└── requirements.txt
```

---

## \u2699\ufe0f Requisitos

- Python 3.8+
- pip
- `orbit-k1.exe` (Windows) o `orbit-k1` (Linux/Mac) compilado y ubicado en la ra\u00edz del proyecto o en el PATH.

---

## \ud83d\ude80 Instalaci\u00f3n

```bash
git clone https://github.com/tu-usuario/orbit-api.git
cd orbit-api
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

---

## \u2699\ufe0f Configuraci\u00f3n

Crea un archivo `.env` en la ra\u00edz del proyecto con este contenido:

```env
FLASK_ENV=development
SECRET_KEY=clave_super_secreta
```

Los entornos disponibles son:

- `development` (por defecto)
- `production`
- `testing`

---

## \ud83e\uddea Levantar el servicio

```bash
python app.py
```

La API estar\u00e1 disponible en:

```
http://localhost:5000/
```

Swagger UI estar\u00e1 disponible en:

```
http://localhost:5000/apidocs/
```

---

## \ud83d\udce1 Endpoint principal

### POST `/primera-formula`

Ejecuta el binario `orbit-k1` con par\u00e1metros orbitales keplerianos.

#### Body (JSON):

```json
{
      \"a\": 7000,
      \"e\": 0.001,
      \"i\": 98.7,
      \"omega\": 120.0,
      \"w\": 87.0,
      \"theta\": 0.0,
      \"nrev\": 20
    
    }
```
    
#### Respuesta:

```json
{
      \"codigo_salida\": 0,
      \"data\": [ ... ],
      \"errores\": \"\"
    }
```

Documentaci\u00f3n completa en: [`docs/primera_formula.yml`](docs/primera_formula.yml)

---

## \ud83d\udce6 Variables clave

| Variable         | Descripci\u00f3n                                  |
|------------------|----------------------------------------------|
| `SECRET_KEY`     | Clave secreta Flask                          |
| `FLASK_ENV`      | Entorno (`development`, `production`, `testing`) |
| `ORBIT_EXECUTABLE` | Ejecutable usado (se autodetecta por sistema operativo) |

---

## \ud83d\udee0\ufe0f Comandos \u00fatiles

| Acci\u00f3n               | Comando                                      |
|----------------------|----------------------------------------------|
| Crear entorno virtual| `python -m venv venv`                        |
| Activar entorno      | `source venv/bin/activate`                   |
| Instalar dependencias| `pip install -r requirements.txt`            |
| Ejecutar app         | `python app.py`                              |

---

## \ud83d\ude4b\u200d\u2640\ufe0f Contribuciones

1. Crea un fork
2. Crea una rama `feature/nueva-funcionalidad`
3. Realiza tus cambios
4. Abre un Pull Request \ud83d\ude80

---
