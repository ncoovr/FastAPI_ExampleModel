from typing import Optional
from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True)

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    content: str
    published: bool = Field(default=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")

class UserCreate(SQLModel):
    username: str
    email: str

class PostCreate(SQLModel):
    name: str
    content: str
    published: bool = True
    user_id: Optional[int] = None