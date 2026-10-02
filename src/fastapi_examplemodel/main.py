from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from src.fastapi_examplemodel.database import engine
from src.fastapi_examplemodel.routers import users, videos, comments

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI(title="Plataforma de Videos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(videos.router)
app.include_router(comments.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "API de Videos funcionando"}