from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship

class UsuarioBase(SQLModel):
    name: str
    email: str = Field(unique=True, index=True)

class UsuarioCreate(UsuarioBase):
    password: str

class UsuarioLogin(SQLModel):
    email: str
    password: str

class Usuario(UsuarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    password_hash: str
    videos: List["Video"] = Relationship(back_populates="usuario")
    comentarios: List["Comentario"] = Relationship(back_populates="usuario")

class VideoBase(SQLModel):
    title: str
    description: str
    video_url: str
    thumbnail_url: str
    views: int = Field(default=0)
    user_id: int = Field(foreign_key="usuario.id")

class VideoCreate(VideoBase):
    pass

class VideoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None

class Video(VideoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    usuario: Optional[Usuario] = Relationship(back_populates="videos")
    comentarios: List["Comentario"] = Relationship(back_populates="video", cascade_delete=True)

class ComentarioBase(SQLModel):
    content: str
    user_id: int = Field(foreign_key="usuario.id")
    video_id: int = Field(foreign_key="video.id")

class ComentarioCreate(ComentarioBase):
    pass

class Comentario(ComentarioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    usuario: Optional[Usuario] = Relationship(back_populates="comentarios")
    video: Optional[Video] = Relationship(back_populates="comentarios")