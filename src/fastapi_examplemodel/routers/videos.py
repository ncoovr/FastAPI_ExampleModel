import os
import uuid
import boto3
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Depends
from sqlmodel import select

load_dotenv()

from src.fastapi_examplemodel.models import Video, VideoCreate
from src.fastapi_examplemodel.database import SessionDep

router = APIRouter(prefix="/videos", tags=["Videos"])

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "us-east-1"),
    verify=False
)
VIDEO_BUCKET = os.getenv("AWS_VIDEO_BUCKET")
THUMBNAIL_BUCKET = os.getenv("AWS_THUMBNAIL_BUCKET")
REGION = os.getenv("AWS_REGION", "us-east-1")

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_video(
    session: SessionDep,
    title: str = Form(...),
    description: str = Form(...),
    user_id: int = Form(...),
    video: UploadFile = File(...),
    thumbnail: UploadFile = File(...)
):
    try:
        thumb_extension = thumbnail.filename.split(".")[-1]
        thumb_key = f"thumbnails/{uuid.uuid4()}.{thumb_extension}"
        
        s3_client.upload_fileobj(
            thumbnail.file, 
            THUMBNAIL_BUCKET, 
            thumb_key,
            ExtraArgs={'ContentType': thumbnail.content_type}
        )
        thumb_url = f"https://{THUMBNAIL_BUCKET}.s3.{REGION}.amazonaws.com/{thumb_key}"

        video_extension = video.filename.split(".")[-1]
        video_key = f"videos/{uuid.uuid4()}.{video_extension}"
        
        s3_client.upload_fileobj(
            video.file, 
            VIDEO_BUCKET, 
            video_key,
            ExtraArgs={'ContentType': video.content_type}
        )
        video_url = f"https://{VIDEO_BUCKET}.s3.{REGION}.amazonaws.com/{video_key}"

        db_video = Video(
            title=title,
            description=description,
            video_url=video_url,
            thumbnail_url=thumb_url,
            views=0,
            user_id=user_id
        )
        
        session.add(db_video)
        session.commit()
        session.refresh(db_video)
        
        return db_video

    except Exception as e:
        print(f"🔥 ERROR DETALLADO DE AWS: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al subir: {str(e)}")

@router.get("/")
def get_videos(session: SessionDep):
    return session.exec(select(Video)).all()

@router.get("/{id}")
def get_video(id: int, session: SessionDep):
    video = session.get(Video, id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return video