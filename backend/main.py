import os
import logging

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, func, case, or_, cast, text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.exc import OperationalError, IntegrityError
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bioscripture")

# --- 1. CONFIGURACIÓN DE BASE DE DATOS ---
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:kjuliox@localhost:5432/historias_biblia",
)
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
MAX_PAGE_LIMIT = 200

# Orden cronológico de las épocas para la Línea de Tiempo (no alfabético)
ERA_ORDER = [
    "Inicios",
    "Mundo Antiguo",
    "Patriarcas",
    "Éxodo",
    "Jueces",
    "Reyes y Profetas",
    "Nuevo Testamento",
]

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # descarta conexiones muertas antes de usarlas (evita cortes intermitentes)
    pool_recycle=1800,    # recicla conexiones antes de que Postgres las cierre por inactividad
    pool_size=10,
    max_overflow=20,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. MODELO DE DATOS (SQLAlchemy) ---
class CharacterDB(Base):
    __tablename__ = "characters"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    era = Column(String, nullable=False)
    portrait_url = Column(String, nullable=True)
    cover_url = Column(String, nullable=True)
    books_referenced = Column(JSONB, default=list)
    roles = Column(JSONB, default=list)
    key_verses = Column(JSONB, default=list)
    story_sections = Column(JSONB, default=list)
    related_characters = Column(JSONB, default=list) # Conexiones generales
    locations = Column(JSONB, default=list)

    # NUEVOS CAMPOS: Estructura para el Árbol Genealógico
    parents = Column(JSONB, default=list)            # Padres
    spouses = Column(JSONB, default=list)            # Cónyuges
    children = Column(JSONB, default=list)           # Hijos
    siblings = Column(JSONB, default=list)          # Hermanos

# --- 3. ESQUEMAS DE VALIDACIÓN (Pydantic) ---
class CharacterSchema(BaseModel):
    id: str
    name: str
    era: str
    portrait_url: Optional[str] = None
    cover_url: Optional[str] = None
    books_referenced: List[str] = []
    roles: List[str] = []
    key_verses: List[dict] = []
    story_sections: List[dict] = []
    related_characters: List[str] = []
    locations: List[dict] = []

    # NUEVOS CAMPOS EN EL ESQUEMA
    parents: List[str] = []
    spouses: List[str] = []
    children: List[str] = []
    siblings: List[str] = []

    class Config:
        from_attributes = True

# --- 4. CONFIGURACIÓN DE FASTAPI ---
app = FastAPI(title="API Personajes Bíblicos")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    except OperationalError:
        logger.exception("No se pudo conectar a la base de datos")
        raise HTTPException(status_code=503, detail="Base de datos no disponible")
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    with engine.begin() as conn:
        # Permite que la búsqueda ignore tildes/acentos (José === Jose)
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent"))

@app.get("/")
def health_check():
    return {"status": "ok", "service": "API Personajes Bíblicos"}

# --- 5. ENDPOINTS ---

@app.post("/characters/", response_model=CharacterSchema, status_code=201)
def create_character(character: CharacterSchema, db: Session = Depends(get_db)):
    db_char = db.query(CharacterDB).filter(CharacterDB.id == character.id).first()
    if db_char:
        raise HTTPException(status_code=400, detail="El personaje ya existe")

    new_char = CharacterDB(**character.model_dump())
    db.add(new_char)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="No se pudo guardar el personaje (datos inválidos)")
    db.refresh(new_char)
    return new_char

@app.post("/characters/bulk/", response_model=List[CharacterSchema])
def create_characters_bulk(characters: List[CharacterSchema], db: Session = Depends(get_db)):
    if not characters:
        raise HTTPException(status_code=400, detail="La lista de personajes está vacía")

    processed_characters = []

    for char_data in characters:
        db_char = db.query(CharacterDB).filter(CharacterDB.id == char_data.id).first()

        if db_char:
            # Soporte de Upsert: Sobreescribe los datos si el personaje ya existe
            for key, value in char_data.model_dump().items():
                setattr(db_char, key, value)
            processed_characters.append(db_char)
        else:
            new_char = CharacterDB(**char_data.model_dump())
            db.add(new_char)
            processed_characters.append(new_char)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="No se pudo guardar el bloque de personajes (datos inválidos o IDs duplicados)")

    for char in processed_characters:
        db.refresh(char)

    return processed_characters

@app.get("/characters/", response_model=List[CharacterSchema])
def read_characters(
    search: Optional[str] = None,
    era: Optional[str] = None,
    role: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    limit = max(1, min(limit, MAX_PAGE_LIMIT))
    skip = max(0, skip)

    query = db.query(CharacterDB)
    if search:
        like = f"%{search}%"

        def unaccent_ilike(column):
            return func.unaccent(column).ilike(func.unaccent(like))

        # Busca por nombre y también dentro de la historia, roles y conexiones,
        # ignorando tildes/acentos en ambos lados (José === Jose)
        query = query.filter(or_(
            unaccent_ilike(CharacterDB.name),
            unaccent_ilike(cast(CharacterDB.story_sections, String)),
            unaccent_ilike(cast(CharacterDB.roles, String)),
            unaccent_ilike(cast(CharacterDB.related_characters, String)),
        ))
    if era:
        query = query.filter(CharacterDB.era == era)
    if role:
        query = query.filter(cast(CharacterDB.roles, String).ilike(f'%"{role}"%'))

    era_rank = case(
        {era_name: idx for idx, era_name in enumerate(ERA_ORDER)},
        value=CharacterDB.era,
        else_=len(ERA_ORDER),
    )
    return query.order_by(era_rank, CharacterDB.name).offset(skip).limit(limit).all()

@app.get("/characters/eras/", response_model=List[str])
def read_eras(db: Session = Depends(get_db)):
    rows = db.query(CharacterDB.era).distinct().all()
    present = {row[0] for row in rows}
    ordered = [era for era in ERA_ORDER if era in present]
    extra = sorted(present - set(ERA_ORDER))  # épocas nuevas no contempladas en ERA_ORDER
    return ordered + extra

@app.get("/characters/roles/", response_model=List[str])
def read_roles(db: Session = Depends(get_db)):
    rows = db.query(CharacterDB.roles).all()
    counts: dict = {}
    for row in rows:
        for r in (row[0] or []):
            counts[r] = counts.get(r, 0) + 1
    # Solo roles compartidos por 2+ personajes, para que el filtro sea útil (no un rol único por persona)
    shared = [r for r, n in counts.items() if n >= 2]
    return sorted(shared, key=lambda r: (-counts[r], r))

@app.get("/characters/names/")
def read_names(db: Session = Depends(get_db)):
    rows = db.query(CharacterDB.id, CharacterDB.name).all()
    return [{"id": r[0], "name": r[1]} for r in rows]

@app.get("/characters/summary/")
def read_summary(db: Session = Depends(get_db)):
    """Datos livianos (sin historias completas) para autoenlazado de texto y trivia."""
    rows = db.query(
        CharacterDB.id, CharacterDB.name, CharacterDB.era, CharacterDB.roles,
        CharacterDB.related_characters, CharacterDB.parents, CharacterDB.spouses,
        CharacterDB.children, CharacterDB.siblings,
    ).all()
    return [
        {
            "id": r[0], "name": r[1], "era": r[2], "roles": r[3] or [],
            "related_characters": r[4] or [], "parents": r[5] or [],
            "spouses": r[6] or [], "children": r[7] or [], "siblings": r[8] or [],
        }
        for r in rows
    ]

@app.get("/characters/random/", response_model=CharacterSchema)
def read_random_character(exclude: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(CharacterDB)
    if exclude:
        query = query.filter(CharacterDB.id != exclude)
    db_char = query.order_by(func.random()).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="No hay personajes registrados")
    return db_char

@app.get("/characters/{char_id}", response_model=CharacterSchema)
def read_character(char_id: str, db: Session = Depends(get_db)):
    db_char = db.query(CharacterDB).filter(CharacterDB.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return db_char

@app.put("/characters/{char_id}", response_model=CharacterSchema)
def update_character(char_id: str, character: CharacterSchema, db: Session = Depends(get_db)):
    db_char = db.query(CharacterDB).filter(CharacterDB.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")

    for key, value in character.model_dump().items():
        setattr(db_char, key, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="No se pudo actualizar el personaje (datos inválidos)")
    db.refresh(db_char)
    return db_char

@app.delete("/characters/{char_id}", status_code=204)
def delete_character(char_id: str, db: Session = Depends(get_db)):
    db_char = db.query(CharacterDB).filter(CharacterDB.id == char_id).first()
    if not db_char:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")

    db.delete(db_char)
    db.commit()
    return None
