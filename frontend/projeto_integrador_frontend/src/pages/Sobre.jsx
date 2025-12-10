import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_XPENEM.png";
import "./Sobre.css";
import "./Inicio.css";
import Login from "./Login";
import { useUser } from "../context/UserContext";

export default function Sobre() {
  const [logado, setLogado] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const { emojiPerfil } = useUser();

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

        {/* === HEADER === */}
        <header>
          <div className="img-logo">
            <img src={logo} alt="logo XPEnem" />
          </div>

          <nav>
            <Link to="/" className="button-menu">Início</Link>
            <Link to="/quiz" className="button-menu">Simulado</Link>
            <Link to="/sobre" className="button-menu menu-select">Sobre</Link>

            {logado ? (
              <button className="bt-login" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
            )}

            <Link to="/perfil" className="icon-perfil">
              <span style={{ fontSize: "24px" }}>{emojiPerfil}</span>
            </Link>
          </nav>
        </header>

        {/* === CONTEÚDO SOBRE === */}
        <section>
          <div className="sobre-container">

            {/* Card 1 — Sobre nós */}
            <div className="sobre-card">
              <h2 className="sobre-titulo">🧭 Sobre Nós</h2>
              <p className="sobre-texto">
                Bem-vindo ao <strong>XPEnem</strong>, uma plataforma criada para transformar a forma 
                como os estudantes se preparam para o ENEM e vestibulares! 🚀  
                Nosso objetivo é tornar o aprendizado mais leve, eficiente e personalizado, 
                ajudando cada aluno a entender seus pontos fortes e onde pode melhorar.
                <br /><br />
                Desde 2023, reunimos uma equipe apaixonada por educação, tecnologia e design para 
                criar ferramentas interativas, simulados inteligentes e dashboards de desempenho 
                que ajudam você a evoluir de verdade.
              </p>
            </div>

            {/* Card 2 — Equipe */}
            <div className="sobre-card">
              <h3 className="sobre-subtitulo">👥 Nossa Equipe</h3>
              <p className="sobre-texto">
                Somos um grupo de estudantes de Informática que acredita que aprender pode — e deve — ser divertido.
              </p>

    
            </div>

          </div>
        </section>
      </div>

      {/* === MODAL LOGIN === */}
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
