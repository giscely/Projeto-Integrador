from models import *
from sqlalchemy.orm import Session, sessionmaker
from werkzeug.security import generate_password_hash
import os
import requests


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables():
    Base.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

def create_user_admin():
    with SessionLocal() as session:
        query = session.query(Usuario).filter(Usuario.usu_tipo == "admin")
        admin_existente = session.execute(query).scalar_one_or_none()

        if not admin_existente:
            novo_admin = Usuario(
                usu_nome=os.getenv("ADMIN_NAME"),
                usu_email=os.getenv("ADMIN_EMAIL"),
                usu_senha=generate_password_hash(os.getenv("ADMIN_PASSWORD")),
                usu_tipo=TipoUsuarioEnum.admin
            )
            session.add(novo_admin)
            session.commit()


anos = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]


async def armazenar_questoes(session,year: int):
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


async def carregar_todos_os_dados():
    with SessionLocal() as session:
        resultados = []

        for ano in anos:
            resultado = await armazenar_questoes(session, ano)
            resultados.append(resultado)

        return {
            "status": "concluído",
            "anos_processados": anos,
            "detalhes": resultados
        }
