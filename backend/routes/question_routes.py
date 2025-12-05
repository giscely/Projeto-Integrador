from fastapi import APIRouter, Depends
from dependencies import SessionDep, verificar_token
import requests
from models import Questao



question_router = APIRouter(prefix="/questoes", tags=["questoes"])

anos = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

async def armazenar_questoes(session: SessionDep, year: int):
    limit = 50
    offset = 0
    total_adicionadas = 0

    URI = "https://api.enem.dev/v1/exams/{year}/questions?limit={limit}&offset={offset}"

    while True:
        # Busca um lote de até 50 questões
        r = requests.get(URI.format(year=year, limit=limit, offset=offset))
        dados = r.json()

        questoes = dados.get("questions", [])

        # Se vier vazio, terminou
        if not questoes:
            break

        # Salvar no banco
        for item in questoes:

            questao = Questao(
                qst_title=item["title"],
                qst_index=item["index"],
                qst_language=item.get("language"),
                qst_discipline=item["discipline"],
                qst_year=item["year"],
                qst_context=item["context"],
                qst_question=item["alternativesIntroduction"],
                qst_alternatives=item["alternatives"],
                qst_correct_alternative=item["correctAlternative"],
                qst_file_url=item.get("files")
            )

            session.add(questao)

        session.commit()
        total_adicionadas += len(questoes)

        # Atualiza o offset para o próximo bloco
        offset += limit + 1

    return {"mensagem": f"{total_adicionadas} questões adicionadas do ENEM {year}."}


@question_router.post("/carregar-todas-as-questoes")
async def carregar_todos_os_dados(session: SessionDep, usuario = Depends(verificar_token)):
    if usuario.usu_tipo != "admin":
        return {"mensagem": "Acesso negado. Apenas administradores podem executar esta ação."}
    resultados = []

    for ano in anos:
        resultado = await armazenar_questoes(session, ano)
        resultados.append(resultado)

    return {
        "status": "concluído",
        "anos_processados": anos,
        "detalhes": resultados
    }




@question_router.get("/listar-questoes/{disciplina}")
async def listar_questoes(session: SessionDep, disciplina: str):
    questoes = session.query(Questao).filter(Questao.qst_discipline == disciplina).limit(10).all()
    return questoes