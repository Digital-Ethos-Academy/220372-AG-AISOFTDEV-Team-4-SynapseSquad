import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import dotenv

# Load environment variables from .env file
dotenv.load_dotenv()


app = FastAPI()

# CORS configuration for React frontend
frontend_url = os.getenv("FRONT_END_URL", "ERROR_NO_FRONTEND_URL_SET")
print("Frontend URL for CORS:", frontend_url)
origins = [
    frontend_url,
    "localhost:3000"  # Keep as fallback for local development
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Agile TaskIQ API is running."}

# Status endpoint
@app.get("/status")
def get_status():
    return {"status": "healthy", "message": "API is running.", "version": "1.0.0"}



# Import and include routers
from tasks import router as tasks_router
from ai import router as ai_router
from users import router as users_router
from task_dependencies import router as task_deps_router
from priority_scores import router as priority_scores_router
from tshirt_scores import router as tshirt_scores_router

app.include_router(tasks_router)
app.include_router(ai_router)
app.include_router(users_router)
app.include_router(task_deps_router)
app.include_router(priority_scores_router)
app.include_router(tshirt_scores_router)

# Ensure database tables are created (safe when using an existing DB)
from database import engine, Base
import models

Base.metadata.create_all(bind=engine)
