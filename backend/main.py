from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional

# --- 1. CONFIGURACIÓN DE BASE DE DATOS ---
DATABASE_URL = "postgresql://postgres:kjuliox@localhost:5432/historias_biblia"

engine = create_engine(DATABASE_URL)
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
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- 5. ENDPOINTS ---

@app.post("/characters/", response_model=CharacterSchema)
def create_character(character: CharacterSchema, db: Session = Depends(get_db)):
    db_char = db.query(CharacterDB).filter(CharacterDB.id == character.id).first()
    if db_char:
        raise HTTPException(status_code=400, detail="El personaje ya existe")
    
    new_char = CharacterDB(**character.model_dump())
    db.add(new_char)
    db.commit()
    db.refresh(new_char)
    return new_char

@app.post("/characters/bulk/", response_model=List[CharacterSchema])
def create_characters_bulk(characters: List[CharacterSchema], db: Session = Depends(get_db)):
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
            
    db.commit()
    
    for char in processed_characters:
        db.refresh(char)
        
    return processed_characters

@app.get("/characters/", response_model=List[CharacterSchema])
def read_characters(
    search: Optional[str] = None, 
    era: Optional[str] = None,    
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    query = db.query(CharacterDB)
    if search:
        query = query.filter(CharacterDB.name.ilike(f"%{search}%"))
    if era:
        query = query.filter(CharacterDB.era == era)
    return query.offset(skip).limit(limit).all()

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
        
    db.commit()
    db.refresh(db_char)
    return db_char