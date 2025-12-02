from fastapi import APIRouter, Depends, Request
from models import Usuario
from schemas import SignUp, SignIn
from database import get_session
from typing import Annotated
from sqlalchemy.orm import Session
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash

SessionDep = Annotated[Session, Depends(get_session)]

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.post("/cadastro")
async def cadastrar_usuario(user: SignUp, session: SessionDep):
    query = select(Usuario).where(Usuario.usu_email == user.email)
    # Verifica se o email já existe
    email_existente = session.execute(query).scalar_one_or_none()

    if email_existente:
        return {"mensagem": "E-mail já cadastrado."}

    # Cria o novo usuário
    novo_usuario = Usuario(
        usu_nome=user.nome,
        usu_email=user.email,
        usu_senha=generate_password_hash(user.senha)
    )

    session.add(novo_usuario)
    session.commit()

    return {
        "mensagem": "Usuário cadastrado com sucesso!",
        "usuario": {
            "id": novo_usuario.usu_id,
            "nome": novo_usuario.usu_nome,
            "email": novo_usuario.usu_email
        }
    }


@auth_router.post("/login")
async def autenticacao_usuario(user: SignIn, session: SessionDep):
    query = select(Usuario).where(Usuario.usu_email == user.email)
    usuario = session.execute(query).scalar_one_or_none()
    # Verifica se o email tá correto
    if usuario:
        # Verifica se a senha tá correta
        if check_password_hash(usuario.usu_senha, user.senha):
            return {"mensagem": "Login realizado com sucesso!", "usuario": usuario}
        
        return {"mensagem": "E-mail ou senha incorretos."}
    
    return {"mensagem": "E-mail ou senha incorretos."}