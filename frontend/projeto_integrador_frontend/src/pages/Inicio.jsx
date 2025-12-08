import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css";

import logo from '../assets/logo_XPENEM.png';
import icon_alvo from '../assets/icon_alvo.png';
import icon_cronometro from '../assets/icon_cronometro.png';
import icon_grafico from '../assets/icon_grafico.png';
import icon_trofeu from '../assets/icon_trofeu.png';

import Login from "./Login";

export default function Inicio() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [logado, setLogado] = useState(false);

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
        <header>
          <div className="img-logo">
            <img src={logo} alt="logo" />
          </div>

          <nav>
            <Link to="/" className="button-menu menu-select">Inicio</Link>
            <Link to="/quiz" className="button-menu">Quiz</Link>
            <Link to="/sobre" className="button-menu">Sobre</Link>

            {logado ? (
              <button className="bt-login" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
            )}

            <Link to="/perfil" className="icon-perfil">icon</Link>
          </nav>
        </header>

        <section>
          <div className="intro">
            <div className="div_info_intro">
              <h1>Domine o Enem com confiança!</h1>
              <p>Aprenda no seu ritmo e conquiste o seu futuro.</p>
              <Link to="/quiz" className="button-intro">Começar agora</Link>
            </div>
          </div>

          <div className="info">
            <div>
              <div className="info-titulo">
                <span><img src={icon_alvo} alt="" /></span>
                <h2>Questões no estilo enem</h2>
              </div>
              <div className="info-detalhe">
                <p>Simule a prova real com perguntas de provas passadas.</p>
              </div>
            </div>

            <div>
              <div className="info-titulo">
                <span><img src={icon_cronometro} alt="" /></span>
                <h2>Estude no seu ritmo</h2>
              </div>
              <div className="info-detalhe">
                <p>Organize seu tempo e estude conforme sua rotina.</p>
              </div>
            </div>

            <div>
              <div className="info-titulo">
                <span><img src={icon_grafico} alt="" /></span>
                <h2>Veja o seu desempenho</h2>
              </div>
              <div className="info-detalhe">
                <p>Acompanhe a evolução e melhore suas áreas deficientes.</p>
              </div>
            </div>

            <div>
              <div className="info-titulo">
                <span><img src={icon_trofeu} alt="" /></span>
                <h2>Ganhe recompensas</h2>
              </div>
              <div className="info-detalhe">
                <p>Alcance suas metas e conquiste troféus.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-container">
            <p className="footer-texto">
              XPENEM — Plataforma de estudos focada no ENEM
            </p>
            <p className="footer-copy">
              © {new Date().getFullYear()} XPENEM. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>

      {mostrarLogin && (
        <Login
          fecharModal={() => setMostrarLogin(false)}
          onLogin={() => {
            setLogado(true);      // muda o botão
            setMostrarLogin(false); // fecha o modal
          }}
        />
      )}
    </>
  );
}
