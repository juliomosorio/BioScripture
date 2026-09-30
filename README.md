# BioScripture

Enciclopedia web de personajes bíblicos: más de 50 fichas históricas con biografía narrativa, genealogía, versículos clave, rutas geográficas en mapa y trivia generada dinámicamente a partir de los propios datos.

**Demo en vivo:** _(pendiente — ver nota de despliegue más abajo)_

## Funcionalidades

- **Línea de tiempo y cronología visual** — todos los personajes ordenados cronológicamente por época, con una vista adicional de scroll horizontal por columnas.
- **Búsqueda flexible** — por nombre, rol, texto de la historia o referencia de versículo (ej. `Juan 3:16`); ignora tildes y, si hay un único resultado, navega directo.
- **Filtros combinables** por época y por rol (profeta, apóstol, rey, etc.).
- **Enlaces automáticos** — cuando la historia de un personaje menciona a otro, se convierte en link a su página.
- **Árbol genealógico y mapa de ruta** por personaje.
- **Trivia dinámica** — preguntas de opción múltiple generadas a partir de los datos reales del personaje (época, rol, conexiones), sin contenido escrito a mano.
- **Progreso de lectura** — marca qué personajes ya visitaste (guardado en el navegador, sin cuentas).
- **Modo oscuro** con persistencia de preferencia.
- **Compartir por WhatsApp** con vista previa (Open Graph) generada por personaje.
- **Panel de administración** protegido por contraseña para crear/editar/borrar personajes, incluyendo carga masiva vía JSON.

## Stack técnico

| | |
|---|---|
| **Backend** | Python · FastAPI · SQLAlchemy · PostgreSQL |
| **Frontend** | Vue 3 · Nuxt 4 · Tailwind CSS |
| **Generación de imágenes** | Satori + resvg (renderizado offline de tarjetas OG) |
| **Infraestructura** | Render (API) · Vercel (frontend) · Neon (Postgres serverless) |

### Arquitectura

```
Vercel (Nuxt SSR)  ──HTTP──>  Render (FastAPI)  ──SQL──>  Neon (Postgres)
```

Tres servicios independientes, cada uno en su capa gratuita, conectados por variables de entorno (ver `render.yaml` para la configuración de despliegue del backend).

## Correr el proyecto en local

**Backend**
```bash
cd backend
python -m venv venv
./venv/Scripts/activate       # Windows
pip install -r requirements.txt
cp .env.example .env          # y completa tus valores
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd biblia-frontend
npm install
cp .env.example .env          # NUXT_PUBLIC_API_BASE=http://localhost:8000
npm run dev
```

Abre `http://localhost:3000`.

## Estructura del repo

```
backend/            API FastAPI + modelo de datos + scripts de carga
biblia-frontend/     App Nuxt 4 (páginas, componentes, composables)
render.yaml          Blueprint de despliegue del backend en Render
```

## Licencia

MIT — ver [LICENSE](LICENSE).

---

*Proyecto personal desarrollado con [Claude Code](https://claude.com/claude-code) como herramienta de pair-programming.*
