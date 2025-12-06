from fastapi import FastAPI
from database import create_db_and_tables, create_user_admin
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    create_user_admin()
    yield

app = FastAPI(lifespan=lifespan, title="XPENEM")


oauth2_schema = OAuth2PasswordBearer(tokenUrl="auth/login-form")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes.auth_routes import auth_router
from routes.question_routes import question_router
from routes.simulados_routes import simulated_router
from routes.user_routes import user_router


app.include_router(auth_router)
app.include_router(question_router)
app.include_router(simulated_router)
app.include_router(user_router)

