from fastapi import APIRouter, HTTPException, status
from sqlmodel import select
from passlib.context import CryptContext

# RUTAS ABSOLUTAS:
from src.fastapi_examplemodel.models import Usuario, UsuarioCreate, UsuarioLogin
from src.fastapi_examplemodel.database import SessionDep

router = APIRouter(tags=["Users"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user_in: UsuarioCreate, session: SessionDep):
    user_exists = session.exec(select(Usuario).where(Usuario.email == user_in.email)).first()
    if user_exists:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")
    
    hashed_password = pwd_context.hash(user_in.password)
    db_user = Usuario(name=user_in.name, email=user_in.email, password_hash=hashed_password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return {"id": db_user.id, "name": db_user.name, "email": db_user.email}

@router.post("/login")
def login(user_credentials: UsuarioLogin, session: SessionDep):
    user = session.exec(select(Usuario).where(Usuario.email == user_credentials.email)).first()
    if not user or not pwd_context.verify(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    return {"message": "Login exitoso", "user_id": user.id}

@router.get("/users/{id}")
def get_user(id: int, session: SessionDep):
    user = session.get(Usuario, id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"id": user.id, "name": user.name, "email": user.email, "videos": user.videos}