from sqlmodel import SQLModel, Field, Relationship

class Area_Conhecimento(SQLModel, table=True):
    id: int = Field(primary_key=True)
    nome: str = Field(index=False)
    tipo: str = Field(index=False)
    questoes: list["Questao"] = Relationship(back_populates="area_conhecimento")

class Questao(SQLModel, table=True):
    id: int = Field(primary_key=True)
    descricao: str = Field(index=False)
    dificuldade: str = Field(index=False)
    assunto: str = Field(index=False)
    area_conhecimento_id: int = Field(foreign_key="area_conhecimento.id")
    area_conhecimento: "Area_Conhecimento" = Relationship(back_populates="questoes")