from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from src.fastapi_examplemodel.models import Comentario, ComentarioCreate, Video, Usuario
from src.fastapi_examplemodel.database import SessionDep

router = APIRouter(prefix="/videos", tags=["Comentarios"])

@router.post("/{id}/comments", status_code=status.HTTP_201_CREATED)
def create_comment(id: int, comment_in: ComentarioCreate, session: SessionDep):
    if id != comment_in.video_id:
        raise HTTPException(status_code=400, detail="El ID del video no coincide")
    
    if not session.get(Video, id) or not session.get(Usuario, comment_in.user_id):
        raise HTTPException(status_code=404, detail="Video o Usuario no encontrado")
        
    db_comment = Comentario.model_validate(comment_in)
    session.add(db_comment)
    session.commit()
    session.refresh(db_comment)
    return db_comment

@router.get("/{id}/comments")
def get_comments(id: int, session: SessionDep):
    if not session.get(Video, id):
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return session.exec(select(Comentario).where(Comentario.video_id == id)).all()