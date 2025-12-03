from sqlalchemy  import create_engine, JSON
from sqlalchemy.orm import Session,Mapped, mapped_column, relationship,DeclarativeBase
from typing import List


engine = create_engine('sqlite:///database.db')

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = 'usuarios'
    usu_id:Mapped[int] = mapped_column(primary_key=True)
    usu_nome:Mapped[str]
    usu_email:Mapped[str] = mapped_column(unique=True)
    usu_senha:Mapped[str]


class Questao(Base):
    __tablename__ = 'questoes'

    qst_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    qst_title: Mapped[str] 
    qst_index: Mapped[int] 
    qst_language: Mapped[str] = mapped_column(nullable=True)
    qst_discipline: Mapped[str]
    qst_year: Mapped[int]
    qst_context: Mapped[str]
    qst_question: Mapped[str]
    qst_alternatives: Mapped[list] = mapped_column(JSON)
    qst_correct_alternative: Mapped[str]
    qst_file_url: Mapped[list] = mapped_column(JSON, nullable=True)