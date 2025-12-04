from fastapi import APIRouter
from dependencies import SessionDep
from models import Questao, Simulado, simulado_questoes
import random
from schemas import SimuladoSchema
from fastapi import HTTPException

simulated_router = APIRouter(prefix="/simulados", tags=["simulados"])



@simulated_router.post("/simulados/{disciplina}")
async def criar_simulado(session: SessionDep, disciplina: str):
    # Busca questões já usadas
    questoes_usadas = session.query(simulado_questoes.c.questao_id).all()
    questoes_usadas_ids = {q[0] for q in questoes_usadas}

    # Busca questões da disciplina que ainda NÃO foram usadas
    questoes_disponiveis = (
        session.query(Questao)
        .filter(Questao.qst_discipline == disciplina)
        .filter(Questao.qst_id.notin_(questoes_usadas_ids))
        .all()
    )

    if len(questoes_disponiveis) < 10:
        raise Exception("Não existem questões suficientes desta disciplina.")

    # Escolhe 10 aleatórias
    selecionadas = random.sample(questoes_disponiveis, 10)
    sim_id = session.query(Simulado).count() + 1

    nome = f"simulado_{disciplina}_{sim_id}"
    # Cria o simulado
    simulado = Simulado(
        sim_nome=nome,
        sim_discipline=disciplina,
        sim_completed=False,
        sim_questoes=selecionadas
    )

    session.add(simulado)
    session.commit()
    session.refresh(simulado)

    return simulado

@simulated_router.get("/{sim_id}", response_model=SimuladoSchema)
async def obter_simulado(sim_id: int, session: SessionDep):
    simulado = session.query(Simulado).filter(Simulado.sim_id == sim_id).first()

    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado")

    return simulado