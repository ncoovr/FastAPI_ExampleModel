from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

# RUTAS ABSOLUTAS:
from src.fastapi_examplemodel.models import Video, VideoCreate, VideoUpdate
from src.fastapi_examplemodel.database import SessionDep

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_video(video_in: VideoCreate, session: SessionDep):
    db_video = Video.model_validate(video_in)
    session.add(db_video)
    session.commit()
    session.refresh(db_video)
    return db_video

@router.get("/")
def get_videos(session: SessionDep):
    return session.exec(select(Video)).all()

@router.get("/{id}")
def get_video(id: int, session: SessionDep):
    video = session.get(Video, id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    
    # Sumar una vista automáticamente antes de devolver el video
    video.views += 1
    session.add(video)
    session.commit()
    session.refresh(video)
    
    return video

@router.put("/{id}")
def update_video(id: int, video_update: VideoUpdate, session: SessionDep):
    db_video = session.get(Video, id)
    if not db_video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    
    if video_update.title: db_video.title = video_update.title
    if video_update.description: db_video.description = video_update.description
    
    session.add(db_video)
    session.commit()
    session.refresh(db_video)
    return db_video

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_video(id: int, session: SessionDep):
    video = session.get(Video, id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    session.delete(video)
    session.commit()