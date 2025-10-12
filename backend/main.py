from fastapi import FastAPI, Depends, Request
from sqlmodel import Session
from database import get_session, create_db_and_tables
from typing import Annotated
from contextlib import asynccontextmanager
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware



SessionDep = Annotated[Session, Depends(get_session)]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan, title="XPENEM")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def index():
    return {"user": "Eduardo", "idade": 19}

