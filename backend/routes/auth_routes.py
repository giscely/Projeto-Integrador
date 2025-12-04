from fastapi import APIRouter, Depends
from main import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY
from dependencies import verificar_token, SessionDep
from models import Usuario
from schemas import SignUp, SignIn
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm



auth_router = APIRouter(prefix="/auth", tags=["auth"])



# Função para criar um token JWT
def criar_token(id_usuario, duracao_token=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    data_expiracao = datetime.now(timezone.utc) + duracao_token
    dic_info_token = {"sub": str(id_usuario), "exp": data_expiracao}
    jwt_token = jwt.encode(dic_info_token, SECRET_KEY, ALGORITHM)
    return jwt_token




@auth_router.post("/cadastro")
async def cadastrar_usuario(user: SignUp, session: SessionDep):
    query = select(Usuario).where(Usuario.usu_email == user.email)
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
            access_token = criar_token(usuario.usu_id)
            refresh_token = criar_token(usuario.usu_id, duracao_token=timedelta(days=7))
            return {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_type": "bearer"
            }
        
        return {"mensagem": "E-mail ou senha incorretos."}
    
    return {"mensagem": "E-mail ou senha incorretos."}



@auth_router.post("/login-form")
async def autenticacao_usuario_form(session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()):
    query = select(Usuario).where(Usuario.usu_email == form_data.username)
    usuario = session.execute(query).scalar_one_or_none()
    # Verifica se o email tá correto
    if usuario:
        # Verifica se a senha tá correta
        if check_password_hash(usuario.usu_senha, form_data.password):
            access_token = criar_token(usuario.usu_id)
            return {
                "access_token": access_token,
                "token_type": "bearer"
            }
        
        return {"mensagem": "E-mail ou senha incorretos."}
    
    return {"mensagem": "E-mail ou senha incorretos."}


@auth_router.get("/refresh")
async def use_refresh_token(usuario:Usuario = Depends(verificar_token)):
    access_token = criar_token(usuario.usu_id)
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
