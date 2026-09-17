from fastapi import FastAPI, status, HTTPException, Response
from sqlmodel import Session, SQLModel, create_engine, select
from .models import User, Post, UserCreate, PostCreate

sqlite_url = "sqlite:///posts.db"
engine = create_engine(sqlite_url)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "API funcionando con SQLite y SQLModel"}


@app.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate):
    with Session(engine) as session:
        db_user = User.model_validate(user_in) 
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return {"data": db_user}

@app.get("/users")
def get_users():
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        return {"users": users}


@app.post("/posts", status_code=status.HTTP_201_CREATED)
def create_posts(post_in: PostCreate):
    with Session(engine) as session:
        if post_in.user_id is not None:
            user_exists = session.get(User, post_in.user_id)
            if not user_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"El usuario con id {post_in.user_id} no existe."
                )
        
        db_post = Post.model_validate(post_in)
        session.add(db_post)
        session.commit()
        session.refresh(db_post)
        return {"data": db_post}

@app.get("/posts")
def get_posts():
    with Session(engine) as session:
        posts = session.exec(select(Post)).all()
        return {"posts": posts}

@app.get("/posts/latest")
def latest_post():
    with Session(engine) as session:
        post = session.exec(select(Post).order_by(Post.id.desc()).limit(1)).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No hay posts disponibles")
        return {"latest_post": post}

@app.get("/posts/{id}")
def get_post(id: int):
    with Session(engine) as session:
        post = session.get(Post, id)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post con id {id} no encontrado")
        return {"post": post}

@app.delete("/posts/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(id: int):
    with Session(engine) as session:
        post = session.get(Post, id)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post con id {id} no encontrado")
        
        session.delete(post)
        session.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)

@app.put("/posts/{id}")
def update_post(id: int, post_update: PostCreate):
    with Session(engine) as session:
        db_post = session.get(Post, id)
        if not db_post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Post con id {id} no encontrado")
        
        if post_update.user_id is not None:
            user_exists = session.get(User, post_update.user_id)
            if not user_exists:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail=f"El usuario con id {post_update.user_id} no existe."
                )

        db_post.name = post_update.name
        db_post.content = post_update.content
        db_post.published = post_update.published
        db_post.user_id = post_update.user_id
        
        session.add(db_post)
        session.commit()
        session.refresh(db_post)
        return {"data": db_post}