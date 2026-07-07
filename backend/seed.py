from sqlalchemy.orm import Session
from main import engine, CharacterDB, Base

# Datos de prueba con enlaces de imágenes (placeholders estéticos)
personajes_prueba = [
    {
        "id": "adan",
        "name": "Adán",
        "era": "Inicios",
        "portrait_url": "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&q=80",
        "cover_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
        "books_referenced": ["Génesis"],
        "roles": ["Primer Hombre"],
        "key_verses": [{"reference": "Génesis 2:15", "text": "Tomó, pues, Jehová Dios al hombre, y lo puso en el huerto de Edén..."}],
        "story_sections": [
            {"heading": "La Creación", "content": "Adán fue el primer ser humano creado por Dios a partir del polvo de la tierra. Su historia marca el comienzo de la humanidad y la responsabilidad del libre albedrío."}
        ],
        "related_characters": ["Eva"]
    },
    {
        "id": "noe",
        "name": "Noé",
        "era": "Mundo Antiguo",
        "portrait_url": "https://images.unsplash.com/photo-1544365558-35aa4afcf11f?w=400&q=80",
        "cover_url": "https://images.unsplash.com/photo-1518182170546-076616fdcb7a?w=1200&q=80",
        "books_referenced": ["Génesis", "Hebreos"],
        "roles": ["Patriarca", "Constructor"],
        "key_verses": [{"reference": "Génesis 6:9", "text": "Noé, varón justo, era perfecto en sus generaciones; con Dios caminó Noé."}],
        "story_sections": [
            {"heading": "El Diluvio", "content": "En una época de gran corrupción, Noé halló gracia. Construyó un arca para salvar a su familia y a las especies animales de un diluvio global."}
        ],
        "related_characters": ["Sem", "Cam", "Jafet"]
    },
    {
        "id": "abraham",
        "name": "Abraham",
        "era": "Patriarcas",
        "portrait_url": "https://images.unsplash.com/photo-1506869640319-ce1a188fb809?w=400&q=80",
        "cover_url": "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=1200&q=80",
        "books_referenced": ["Génesis", "Romanos", "Hebreos"],
        "roles": ["Padre de la Fe", "Profeta"],
        "key_verses": [{"reference": "Génesis 15:6", "text": "Y creyó a Jehová, y le fue contado por justicia."}],
        "story_sections": [
            {"heading": "El Llamado", "content": "Llamado a dejar su tierra en Ur, Abraham emprendió un viaje basado en una promesa divina de que su descendencia sería tan numerosa como las estrellas."}
        ],
        "related_characters": ["Sara", "Isaac", "Lot"]
    }
]

def seed_db():
    print("Iniciando inyección de datos...")
    # Crea la tabla si por alguna razón no existe
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        for char_data in personajes_prueba:
            # Verifica si el personaje ya existe para no duplicarlo
            existing = db.query(CharacterDB).filter(CharacterDB.id == char_data["id"]).first()
            if not existing:
                new_char = CharacterDB(**char_data)
                db.add(new_char)
                print(f"✅ Insertado: {char_data['name']}")
            else:
                print(f"⚠️ Ya existe: {char_data['name']}")
        
        db.commit()
        print("¡Proceso completado exitosamente!")

if __name__ == "__main__":
    seed_db()