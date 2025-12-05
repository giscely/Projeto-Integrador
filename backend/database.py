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
                usu_tipo=TipoUsuarioEnum.admin,
                usu_badge=BadgesEnum.iniciantes.value
            )
            session.add(novo_admin)
            session.commit()



