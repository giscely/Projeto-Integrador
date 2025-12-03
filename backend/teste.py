import requests
from models import Questao
from dependencies import SessionDep, get_session
from sqlalchemy.orm import Session

URI = "https://api.enem.dev/v1/exams/{year}/questions?limit=50&offset={index}"


def adicionar_questoes_db(year, offset):

    session = SessionDep

    r = requests.get(URI.format(year=year, index=offset))
    dados = r.json()

    for item in dados["questions"]:

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
    session.close()

    print(f"{len(dados['questions'])} questões adicionadas ao banco.")

adicionar_questoes_db(2022, 0)
