from fastapi import APIRouter, Depends
from dependencies import SessionDep, verificar_token
from models import Questao, Simulado, simulado_questoes, Usuario, ResultadoSimulado
import random
from schemas import SimuladoSchema, ResultadoSimuladoSchema
from fastapi import HTTPException
import datetime

simulated_router = APIRouter(prefix="/simulados", tags=["simulados"])



@simulated_router.post("/simulados/{disciplina}")
async def criar_simulado(session: SessionDep, disciplina: str, quantidade_questoes: int, usuario: Usuario = Depends(verificar_token)):
    # Busca questões já usadas
    questoes_usadas = (
    session.query(simulado_questoes.c.questao_id)
        .join(Simulado, Simulado.sim_id == simulado_questoes.c.simulado_id)
        .filter(Simulado.sim_usuario_id == usuario.usu_id)
        .all()
    )
    questoes_usadas_ids = {q[0] for q in questoes_usadas}

    # Busca questões da disciplina que ainda NÃO foram usadas
    questoes_disponiveis = (
        session.query(Questao)
        .filter(Questao.qst_discipline == disciplina)
        .filter(Questao.qst_id.notin_(questoes_usadas_ids))
        .all()
    )

    sim_id = session.query(Simulado).filter(Simulado.sim_usuario_id == usuario.usu_id).count() + 1

    # usuário COMUM
    if usuario.usu_tipo.value != "premium":
        date = datetime.date.today()
        simulados_today = (
            session.query(Simulado)
                .filter(Simulado.sim_usuario_id == usuario.usu_id)
                .filter(Simulado.sim_data_criacao == date)
                .count()
        )

        if simulados_today >= 2:
            return {"mensagem": "Limite diário de simulados atingido para usuários comuns. Torne-se premium para criar mais simulados."}
        if quantidade_questoes > 10:
            return {"mensagem": "Usuários comuns só podem criar simulados com até 10 questões. Torne-se premium para mais opções."}
        if quantidade_questoes == 5:
            if len(questoes_disponiveis) < 5:
                return {"mensagem": "Não há questões suficientes disponíveis para criar um novo simulado nesta disciplina."}
            # Escolhe 5 aleatórias
            selecionadas = random.sample(questoes_disponiveis, 5)
            
        else:
            if len(questoes_disponiveis) < 10:
                return {"mensagem": "Não há questões suficientes disponíveis para criar um novo simulado nesta disciplina."}
            selecionadas = random.sample(questoes_disponiveis, 10)

        # Cria o simulado
        nome = f"simulado_{disciplina}_{sim_id}"
        simulado = Simulado(
            sim_nome=nome,
            sim_discipline=disciplina,
            sim_completed=False,
            sim_usuario_id=usuario.usu_id,
            sim_questoes=selecionadas
        )

        session.add(simulado)
        session.commit()
        session.refresh(simulado)
        return simulado
    
    
    # user PREMIUM
    if quantidade_questoes == 20:
        if len(questoes_disponiveis) < 20:
            return {"mensagem": "Não há questões suficientes disponíveis para criar um novo simulado nesta disciplina."}
        # Escolhe 20 aleatórias
        selecionadas = random.sample(questoes_disponiveis, 20)

    elif quantidade_questoes == 10:
        if len(questoes_disponiveis) < 10:
            return {"mensagem": "Não há questões suficientes disponíveis para criar um novo simulado nesta disciplina."}
        # Escolhe 10 aleatórias
        selecionadas = random.sample(questoes_disponiveis, 10)
    else:
        if len(questoes_disponiveis) < 5:
                return {"mensagem": "Não há questões suficientes disponíveis para criar um novo simulado nesta disciplina."}
        # Escolhe 5 aleatórias
        selecionadas = random.sample(questoes_disponiveis, 5)

    nome = f"simulado_{disciplina}_{sim_id}"
    # Cria o simulado
    simulado = Simulado(
        sim_nome=nome,
        sim_discipline=disciplina,
        sim_completed=False,
        sim_usuario_id=usuario.usu_id,
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


@simulated_router.get("/")
async def listar_simulados(session: SessionDep, usuario: Usuario = Depends(verificar_token)):
    simulados = session.query(Simulado).filter(Simulado.sim_usuario_id == usuario.usu_id).all()
    return simulados


@simulated_router.post("/{sim_id}/resultado", response_model=ResultadoSimuladoSchema)
async def resultado_simulado(sim_id: int, respostas: dict, session: SessionDep, usuario: Usuario = Depends(verificar_token)):

    simulado = (
        session.query(Simulado)
        .filter(
            Simulado.sim_id == sim_id,
            Simulado.sim_usuario_id == usuario.usu_id
        )
        .first()
    )
    
    if not simulado:
        raise HTTPException(status_code=404, detail="Simulado não encontrado")

    if simulado.sim_completed:
        raise HTTPException(status_code=400, detail="Simulado já foi concluído")

    
    questoes = simulado.sim_questoes
    total_questoes = len(questoes)
    acertos = 0

    for questao in questoes:
        qid = str(questao.qst_id)

        resposta_usuario = respostas.get(qid)

        if resposta_usuario and resposta_usuario == questao.qst_correct_alternative:
            acertos += 1

    simulado.sim_completed = True
    session.commit()

    resultado_simulado = ResultadoSimulado(
        res_simulado_id=simulado.sim_id,
        res_usuario_id=usuario.usu_id,
        res_respostas=respostas,
        res_score=acertos
    )

    session.add(resultado_simulado)
    session.commit()

    return {
        "simulado_id": simulado.sim_id,
        "total_questoes": total_questoes,
        "acertos": acertos,
        "mensagem": f"Você acertou {acertos} de {total_questoes} questões."
    }
