from fastapi import FastAPI, Depends, Request
from models import Usuario
from sqlmodel import Session
from database import get_session, create_db_and_tables
from typing import Annotated
from contextlib import asynccontextmanager
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from werkzeug.security import generate_password_hash, check_password_hash



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
    return {"index page"}

@app.post("/cadastro")
async def receber_dados(request: Request, session: SessionDep):
    dados = await request.json()
    novo_usuario = Usuario(
    usu_nome=dados["nome"],
    usu_email=dados["email"],
    usu_senha=generate_password_hash(dados["senha"])
)

    session.add(novo_usuario)
    session.commit()
    session.refresh(novo_usuario)

    return {"mensagem": "Usuário cadastrado com sucesso!", "usuario": novo_usuario}