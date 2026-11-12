FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    FLASK_ENV=production \
    PORT=5000

# gfortran para compilar/ejecutar los programas orbit-k1 / orbit-k2
# curl para el healthcheck de Coolify
RUN apt-get update \
    && apt-get install -y --no-install-recommends gfortran curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

COPY . .

# Compila los binarios Linux (el código los llama como ./orbit-k1 y ./orbit-k2)
RUN gfortran -o orbit-k1 orbit-k1.f \
    && gfortran -o orbit-k2 orbit-k2.f \
    && chmod +x orbit-k1 orbit-k2

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:${PORT}/ || exit 1

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT} --workers 2 --timeout 180"]
