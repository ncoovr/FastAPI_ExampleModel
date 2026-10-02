from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
import bcrypt

from src.fastapi_examplemodel.models import Usuario, UsuarioCreate, UsuarioLogin
from src.fastapi_examplemodel.database import SessionDep

router = APIRouter(tags=["Users"])

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user_in: UsuarioCreate, session: SessionDep):
    user_exists = session.exec(select(Usuario).where(Usuario.email == user_in.email)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    hashed_password = hash_password(user_in.password)
    db_user = Usuario(name=user_in.name, email=user_in.email, password_hash=hashed_password)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return {"id": db_user.id, "name": db_user.name, "email": db_user.email}

@router.post("/login")
def login(user_credentials: UsuarioLogin, session: SessionDep):
    user = session.exec(select(Usuario).where(Usuario.email == user_credentials.email)).first()
    
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    return {"message": "Login exitoso", "user_id": user.id}

@router.get("/users/{id}")
def get_user(id: int, session: SessionDep):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"id": user.id, "name": user.name, "email": user.email, "videos": user.videos}