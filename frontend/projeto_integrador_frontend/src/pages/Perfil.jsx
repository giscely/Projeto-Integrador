import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";
import logo from '../assets/logo_XPENEM.png';
import Login from "./Login";

export default function Perfil() {
  const [logado, setLogado] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Simulação de dados do usuário (você depois puxa da API)
  const usuario = {
    nome: "Ylanne K.",
    email: "ylanne@example.com",
    codinome: "MESTRE",
    foto: "https://i.imgur.com/1Q9Z1ZQ.png",
    pontuacao: 1250,
    simuladosFeitos: 8,
    questoesRespondidas: 642,
    desafiosCompletos: 12
  };

  useEffect(() => {
      const token = localStorage.getItem("token");
      setLogado(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setLogado(false);
  }

  return (
    <>
      <div className="main_page">
        {/* HEADER MANTIDO */}
        <header>
          <div className="img-logo">
            <img src={logo} alt="logo" />
          </div>
          <nav>
            <Link to="/" className="button-menu">Inicio</Link>
            <Link to="/quiz" className="button-menu">Simulado</Link>
            <Link to="/sobre" className="button-menu">Sobre</Link>

            {logado ? (
              <button className="bt-login" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
            )}

            <Link to="/perfil" className="icon-perfil">icon</Link>
          </nav>
        </header>

        {/* LAYOUT PRINCIPAL */}
        <div className="perfil-container">

          {/* ⬅️ ASIDE – Informações do usuário */}
          <aside className="perfil-aside">
            <div className="foto-wrapper">
              <img src={usuario.foto} alt="Foto perfil" className="foto-perfil" />
            </div>

            <h2 className="perfil-nome">{usuario.nome}</h2>
            <p className="perfil-email">{usuario.email}</p>
            <p className="perfil-codinome">{usuario.codinome}</p>

            <hr />

            <ul className="menu-perfil">
              <li>Editar Perfil</li>
            </ul>
          </aside>

          {/* ➡️ SECTION – Estatísticas do usuário */}
          <section className="perfil-section">
            <h1>Seu Desempenho</h1>

            <div className="grid-infos">

              <div className="card-info">
                <span className="emoji-card">⭐</span>
                <h3>Pontuação</h3>
                <span>{usuario.pontuacao}</span>
              </div>

              <div className="card-info">
                <span className="emoji-card">🧠</span>
                <h3>Simulados Feitos</h3>
                <span>{usuario.simuladosFeitos}</span>
              </div>

              <div className="card-info">
                <span className="emoji-card">📚</span>
                <h3>Questões Respondidas</h3>
                <span>{usuario.questoesRespondidas}</span>
              </div>

              <div className="card-info">
                <span className="emoji-card">🔥</span>
                <h3>Desafios Concluídos</h3>
                <span>{usuario.desafiosCompletos}</span>
              </div>

            </div>
          </section>


        </div>
      </div>

      {/* MODAL LOGIN */}
      {mostrarLogin && (
        <Login
          fecharModal={() => setMostrarLogin(false)}
          onLogin={() => {
            setLogado(true);
            setMostrarLogin(false);
          }}
        />
      )}
    </>
  );
}
