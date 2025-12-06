from fastapi import APIRouter, Depends
from models import Usuario, Premium, Simulado
import datetime
from dependencies import verificar_token, SessionDep


user_router = APIRouter(prefix="/user", tags=["users"])

@user_router.get("/perfil")
async def perfil_usuario(session: SessionDep, usuario:Usuario = Depends(verificar_token)):
    simulados = session.query(Simulado).filter(Simulado.sim_usuario_id == usuario.usu_id).all()
    if not simulados:
        simulados = []
    return {
        "id": usuario.usu_id,
        "nome": usuario.usu_nome,
        "email": usuario.usu_email,
        "tipo": usuario.usu_tipo.value,
        "simulados": simulados
    }



@user_router.get('/premium')
async def activated_premium(session:SessionDep ,usuario:Usuario = Depends(verificar_token)):
    usuario_in_db = session.get(Usuario, usuario.usu_id)
    if usuario_in_db.usu_tipo != "premium":
        usuario_in_db.usu_tipo = "premium"
        premium = Premium(
            pre_usuario_id=usuario.usu_id,
            pre_data_ativacao=datetime.date.today(),
            pre_data_expiracao=datetime.date.today() + datetime.timedelta(days=365)
        )
        session.add(premium)
        session.commit()
        return {"message": "Premium ativado!"}
    return {"message": "Usuário já é premium."}
    