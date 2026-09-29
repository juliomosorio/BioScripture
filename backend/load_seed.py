# -*- coding: utf-8 -*-
"""
Carga el archivo characters_seed.json en la base de datos de una API en ejecución
(local o desplegada), usando el endpoint /characters/bulk/.

Requiere el token de administrador en la variable de entorno ADMIN_TOKEN
(el mismo que configuraste en Render / tu .env local).

Uso:
    ADMIN_TOKEN=tu-token python load_seed.py                                  # local
    ADMIN_TOKEN=tu-token python load_seed.py https://tu-backend.onrender.com  # producción
"""
import json
import os
import sys
import urllib.request

api_base = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
api_base = api_base.rstrip("/")
admin_token = os.environ.get("ADMIN_TOKEN", "dev-admin-local")


def main():
    with open("characters_seed.json", encoding="utf-8") as f:
        characters = json.load(f)

    data = json.dumps(characters).encode("utf-8")
    req = urllib.request.Request(
        f"{api_base}/characters/bulk/", data=data, method="POST",
        headers={"Content-Type": "application/json", "X-Admin-Token": admin_token},
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print(f"Cargados {len(result)} personajes en {api_base}")


if __name__ == "__main__":
    main()
