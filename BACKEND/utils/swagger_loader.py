import os

def load_yaml(*path_parts):
    """
    Construye la ruta absoluta a un archivo YAML dentro de la carpeta /docs.

    Ejemplo:
        load_yaml('orbita', 'primera_formula.yml')
        -> /ruta/absoluta/a/docs/orbita/primera_formula.yml
    """
    base_dir = os.path.dirname(os.path.abspath(__file__))           # /utils
    docs_dir = os.path.abspath(os.path.join(base_dir, '..', 'docs'))  # /docs
    return os.path.join(docs_dir, *path_parts)
