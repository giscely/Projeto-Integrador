from pydantic import BaseModel

class SignUp(BaseModel):
    nome: str
    email: str
    senha: str

class SignIn(BaseModel):
    email: str
    senha: str