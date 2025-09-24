from sqlmodel import SQLModel, Field, Relationship


class Usuario(SQLModel, table=True):
    usu_id: int =  Field(default=None,primary_key=True)
    usu_nome: str = Field(index=False)
    usu_email: str = Field(index=False, unique=True)
    usu_senha: str = Field(index=False)

class Area_Conhecimento(SQLModel, table=True):
    acc_id: int = Field(default=None,primary_key=True)
    acc_nome: str = Field(index=False)
    acc_tipo: str = Field(index=False)
    questoes: list["Questao"] = Relationship(back_populates="area_conhecimento")

class Questao(SQLModel, table=True):
    qst_id: int = Field(default=None,primary_key=True)
    qst_descricao: str = Field(index=False)
    qst_dificuldade: str = Field(index=False)
    qst_assunto: str = Field(index=False)
    area_conhecimento_id: int = Field(foreign_key="area_conhecimento.acc_id")
    area_conhecimento: "Area_Conhecimento" = Relationship(back_populates="questoes")