from fastapi import APIRouter, Depends
from dependencies import SessionDep
import requests
from models import Questao
from dependencies import verificar_token

anos = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

order_router = APIRouter(prefix="/questoes", tags=["questoes"])


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


@order_router.post("/carregar_todos_os_dados")
async def carregar_todos_os_dados(session: SessionDep):
    resultados = []

    for ano in anos:
        resultado = await armazenar_questoes(session, ano)
        resultados.append(resultado)

    return {
        "status": "concluído",
        "anos_processados": anos,
        "detalhes": resultados
    }


@order_router.get("/listar-questoes")
async def listar_questoes(session: SessionDep, year: int,usuario: str = Depends(verificar_token)):
    questoes = session.query(Questao).filter(Questao.qst_year == year).all()
    return questoes