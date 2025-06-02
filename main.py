from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de la base de datos
db_config = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "db": os.getenv("DB_NAME", ""),
    "charset": "utf8mb4"
}

class Query(BaseModel):
    question: str

def get_db_connection():
    try:
        connection = pymysql.connect(**db_config)
        return connection
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/api/query")
async def execute_query(query: Query):
    try:
        # Por ahora, manejaremos consultas básicas
        # Aquí podrías integrar un modelo de NLP para procesar la pregunta
        question = query.question.lower()
        
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Ejemplo básico de mapeo de preguntas a consultas SQL
        if "usuarios" in question or "users" in question:
            sql = "SELECT * FROM usuarios LIMIT 5"
        elif "proyectos" in question or "projects" in question:
            sql = "SELECT * FROM proyectos ORDER BY fecha_inicio DESC LIMIT 3"
        elif "cuántos" in question or "cantidad" in question:
            sql = "SELECT COUNT(*) as total FROM usuarios"
        else:
            sql = "SHOW TABLES"
        
        cursor.execute(sql)
        results = cursor.fetchall()
        
        return {
            "success": True,
            "sql_query": sql,
            "results": results,
            "results_count": len(results),
            "response": f"Se encontraron {len(results)} resultados"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        if 'conn' in locals():
            conn.close()

@app.get("/api/stats")
async def get_stats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        
        # Obtener estadísticas de la base de datos
        stats = {
            "tables": 0,
            "total_records": 0,
            "database_size": 0
        }
        
        # Contar tablas
        cursor.execute("SHOW TABLES")
        stats["tables"] = len(cursor.fetchall())
        
        # Obtener tamaño de la base de datos
        cursor.execute(f"""
            SELECT 
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size 
            FROM information_schema.tables 
            WHERE table_schema = '{db_config['db']}'
        """)
        result = cursor.fetchone()
        stats["database_size"] = result["size"] if result["size"] else 0
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if 'conn' in locals():
            conn.close()

@app.post("/api/test-connection")
async def test_connection():
    try:
        conn = get_db_connection()
        conn.close()
        return {"success": True, "message": "Connection successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))