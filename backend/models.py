from sqlalchemy  import create_engine, JSON, Table, Column, ForeignKey
from sqlalchemy.orm import Session,Mapped, mapped_column, relationship,DeclarativeBase
from typing import List
import enum
from sqlalchemy import Enum as SqlEnum


engine = create_engine('sqlite:///database.db')

class Base(DeclarativeBase):
    pass

class TipoUsuarioEnum(enum.Enum):
    comum = "comum"
    premium = "premium"
    admin = "admin"


class Usuario(Base):
    __tablename__ = 'usuarios'
    usu_id:Mapped[int] = mapped_column(primary_key=True)
    usu_nome:Mapped[str]
    usu_email:Mapped[str] = mapped_column(unique=True)
    usu_senha:Mapped[str]
    usu_tipo: Mapped[TipoUsuarioEnum] = mapped_column(SqlEnum(TipoUsuarioEnum, name="tipo_usuario_enum"),default=TipoUsuarioEnum.comum,nullable=False)




simulado_questoes = Table(
    "simulado_questoes",
    Base.metadata,
    Column("simulado_id", ForeignKey("simulados.sim_id"), primary_key=True),
    Column("questao_id", ForeignKey("questoes.qst_id"), primary_key=True),
)

class Questao(Base):
    __tablename__ = 'questoes'

    qst_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    qst_title: Mapped[str] = mapped_column(nullable=True)
    qst_index: Mapped[int] = mapped_column(nullable=True)
    qst_language: Mapped[str] = mapped_column(nullable=True)
    qst_discipline: Mapped[str] = mapped_column(nullable=True)
    qst_year: Mapped[int] = mapped_column(nullable=True)
    qst_context: Mapped[str] = mapped_column(nullable=True)
    qst_question: Mapped[str] = mapped_column(nullable=True)
    qst_alternatives: Mapped[list] = mapped_column(JSON)
    qst_correct_alternative: Mapped[str] = mapped_column(nullable=True)
    qst_file_url: Mapped[list] = mapped_column(JSON, nullable=True)

    simulados: Mapped[List["Simulado"]] = relationship(
        secondary="simulado_questoes",
        back_populates="sim_questoes"
    )



class Simulado(Base):
    __tablename__ = 'simulados'

    sim_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    sim_nome: Mapped[str] = mapped_column(nullable=False)
    sim_discipline: Mapped[str] = mapped_column(nullable=False)
    sim_completed: Mapped[bool] = mapped_column(default=False)
    sim_questoes: Mapped[List["Questao"]] = relationship(
        secondary="simulado_questoes",
        back_populates="simulados"
    )