from fastapi import APIRouter, Depends
from models import Usuario, Premium, Simulado, ResultadoSimulado
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
        "badge": usuario.usu_badge.value,
        "simulados": simulados
    }

@user_router.get("/scores")
async def user_scores(session: SessionDep, usuario: Usuario = Depends(verificar_token)):
    user = session.get(Usuario, usuario.usu_id)
    resultados = (
        session.query(ResultadoSimulado)
        .join(Simulado, ResultadoSimulado.res_simulado_id == Simulado.sim_id)
        .filter(Simulado.sim_usuario_id == usuario.usu_id)
        .all()
    )

    total_score = sum(r.res_score for r in resultados)
    if total_score >= 200:
        user.usu_badge.value = "Desafiante de Questões"
    if total_score >= 1000:
        user.usu_badge.value = "Mestre do Conhecimento"
    return {
        "total_score": total_score,
    }

@user_router.get('/questoes_resolvidas_por_disciplina')
async def questoes_por_disciplina(session: SessionDep,usuario: Usuario = Depends(verificar_token)):
    
    simulados = session.query(Simulado).filter(Simulado.sim_usuario_id == usuario.usu_id).all()

    if not simulados:
        return {}

    resultado = {}

    for sim in simulados:
        disciplina = sim.sim_discipline
        
        qtd = len(sim.sim_questoes)

        if disciplina not in resultado:
            resultado[disciplina] = 0

        resultado[disciplina] += qtd
        
    return resultado




@user_router.put('/premium')
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
    