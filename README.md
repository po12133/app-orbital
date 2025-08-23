# Orbit API - Simulacion de orbitas Satelitales

Este proyecto es una API REST en Flask que ejecuta una simulacion orbital basada en elementos keplerianos utilizando un binario externo (`orbit-k1`). Esta estructurado bajo el patron MVC y documentado con Swagger.

---

## Estructura del Proyecto

```
BACKEND/
├── app.py                     # Punto de entrada
├── config.py                  # Configuracion por entorno
├── .env                       # Variables de entorno
├── controllers/               # Logica de control (Controladores)
│   └── orbit_controller.py
├── routes/                    # Definicion de rutas (Vistas)
│   └── orbit_routes.py
├── models/                    # Modelos (si se requieren en el futuro)
├── docs/                      # Documentacion Swagger por endpoint
│   └── primera_formula.yml
├── static/                    # Archivos estaticos (no usado aun)
├── templates/                 # Plantillas HTML (no usado aun)
└── requirements.txt
```

---

## Requisitos

- Python 3.8+
- pip
- `orbit-k1.exe` (Windows) o `orbit-k1` (Linux/Mac) compilado y ubicado en la raiz del proyecto o en el PATH.

---

## Instalacion

```bash
git clone https://github.com/tu-usuario/orbit-api.git
cd orbit-api
python -m venv venv
source venv/bin/activate  # En Windows: venv\\Scripts\\activate
pip install -r requirements.txt
```

---

## Configuracion

Crea un archivo `.env` en la raiz del proyecto con este contenido:

```env
FLASK_ENV=development
SECRET_KEY=clave_super_secreta
```

Los entornos disponibles son:

- `development` (por defecto)
- `production`
- `testing`

---

## Levantar el servicio

```bash
python app.py
```

La API estara disponible en:

```
http://localhost:5000/
```

Swagger UI estara disponible en:

```
http://localhost:5000/apidocs/
```

---

## Endpoint principal

### POST `/primera-formula`

Ejecuta el binario `orbit-k1` con parametros orbitales keplerianos.

#### Body (JSON):

```json
{
      "a": 7000,
      "e": 0.001,
      "i": 98.7,
      "omega": 120.0,
      "w": 87.0,
      "theta": 0.0,
      "nrev": 20
    
    }
```
    
#### Respuesta:

```json
{
      "codigo_salida": 0,
      "data": [ ... ],
      "errores": ""
    }
```

Documentacion completa en: [`docs/primera_formula.yml`](docs/primera_formula.yml)

---

## Variables clave

| Variable         | Descripcion                                  |
|------------------|----------------------------------------------|
| `SECRET_KEY`     | Clave secreta Flask                          |
| `FLASK_ENV`      | Entorno (`development`, `production`, `testing`) |
| `ORBIT_EXECUTABLE` | Ejecutable usado (se autodetecta por sistema operativo) |

---

## Comandos utiles

| Accion               | Comando                                      |
|----------------------|----------------------------------------------|
| Crear entorno virtual| `python -m venv venv`                        |
| Activar entorno      | `source venv/bin/activate`                   |
| Instalar dependencias| `pip install -r requirements.txt`            |
| Ejecutar app         | `python app.py`                              |

---

## Contribuciones

1. Crea un fork
2. Crea una rama `feature/nueva-funcionalidad`
3. Realiza tus cambios
4. Abre un Pull Request 

---
