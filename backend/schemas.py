from pydantic import BaseModel
from typing import List, Optional

class SignUp(BaseModel):
    nome: str
    email: str
    senha: str

class SignIn(BaseModel):
    email: str
    senha: str

class AlternativaSchema(BaseModel):
    letter: str
    text: str | None
    file: str | None
    isCorrect: bool

    class Config:
        from_attributes = True

class QuestaoSchema(BaseModel):
    qst_id: int
    qst_title: Optional[str]
    qst_index: Optional[int]
    qst_language: Optional[str]
    qst_discipline: Optional[str]
    qst_year: Optional[int]
    qst_context: Optional[str]
    qst_question: Optional[str]
    qst_alternatives: List[AlternativaSchema]
    qst_correct_alternative: Optional[str]
    qst_file_url: Optional[List[str]]

    class Config:
        from_attributes = True


class SimuladoSchema(BaseModel):
    sim_id: int
    sim_nome: str
    sim_discipline: str
    sim_completed: bool
    sim_questoes: List[QuestaoSchema]

    class Config:
        from_attributes = True

class ResultadoSimuladoSchema(BaseModel):
    res_id: int
    res_simulado_id: int
    res_usuario_id: int
    res_respostas: dict
    res_score: int

    class Config:
        from_attributes = True