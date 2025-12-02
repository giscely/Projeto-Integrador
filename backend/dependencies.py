from database import get_session
from main import ALGORITHM, SECRET_KEY, oauth2_schema
from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException
from models import Usuario
from jose import jwt, JWTError




SessionDep = Annotated[Session, Depends(get_session)]



def verificar_token( session: SessionDep, token:str = Depends(oauth2_schema)):
    try:
        dic_info_decode = jwt.decode(token, SECRET_KEY, ALGORITHM)
        user_sub = int(dic_info_decode["sub"])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado.")

    usuario = session.query(Usuario).filter(Usuario.usu_id == user_sub).first()
    if not usuario:
        raise HTTPException(status_code=401, detail="Acesso inválido.")
    return usuario
    