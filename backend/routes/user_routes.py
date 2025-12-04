from fastapi import APIRouter, Depends
from models import Usuario
from dependencies import verificar_token


user_router = APIRouter(prefix="/user", tags=["users"])

@user_router.get("/perfil")
async def perfil_usuario(usuario:Usuario = Depends(verificar_token)):
    return {
        "id": usuario.usu_id,
        "nome": usuario.usu_nome,
        "email": usuario.usu_email,
        "tipo": usuario.usu_tipo
    }