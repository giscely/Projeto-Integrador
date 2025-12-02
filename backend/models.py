from sqlalchemy  import create_engine
from sqlalchemy.orm import Session,Mapped, mapped_column, relationship,DeclarativeBase


engine = create_engine('sqlite:///database.db')

class Base(DeclarativeBase):
    pass

class Usuario(Base):
    __tablename__ = 'usuarios'
    usu_id:Mapped[int] = mapped_column(primary_key=True)
    usu_nome:Mapped[str]
    usu_email:Mapped[str] = mapped_column(unique=True)
    usu_senha:Mapped[str]

# class Area_Conhecimento(Base):
#     __tablename__ = 'area_conhecimento'
#     acc_id:Mapped[int] = mapped_column(primary_key=True)
#     acc_nome:Mapped[str]
#     acc_tipo:Mapped[str]
#     questoes: list["Questao"] = relationship(back_populates="area_conhecimento")

# class Questao(Base):
#     __tablename__ = 'questoes'
#     qst_id:Mapped[int] = mapped_column(primary_key=True)
#     qst_descricao:Mapped[str]
#     qst_dificuldade:Mapped[str]
#     qst_assunto:Mapped[str]
#     area_conhecimento_id:Mapped[int] = mapped_column(foreign_key="area_conhecimento.acc_id")
#     area_conhecimento: "Area_Conhecimento" = relationship(back_populates="questoes")