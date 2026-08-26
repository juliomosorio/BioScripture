# -*- coding: utf-8 -*-
"""
Carga el archivo characters_seed.json en la base de datos de una API en ejecución
(local o desplegada), usando el endpoint /characters/bulk/.

Uso:
    python load_seed.py                                  # apunta a http://localhost:8000
    python load_seed.py https://tu-backend.onrender.com   # apunta a producción
"""
import json
import sys
import urllib.request

api_base = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
api_base = api_base.rstrip("/")


def main():
    with open("characters_seed.json", encoding="utf-8") as f:
        characters = json.load(f)

    data = json.dumps(characters).encode("utf-8")
    req = urllib.request.Request(
        f"{api_base}/characters/bulk/", data=data, method="POST",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print(f"Cargados {len(result)} personajes en {api_base}")


if __name__ == "__main__":
    main()
