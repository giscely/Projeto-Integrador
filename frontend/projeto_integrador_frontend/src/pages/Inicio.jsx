import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css";

import logo from '../assets/logo_XPENEM.png';
import icon_alvo from '../assets/icon_alvo.png';
import icon_cronometro from '../assets/icon_cronometro.png';
import icon_grafico from '../assets/icon_grafico.png';
import icon_trofeu from '../assets/icon_trofeu.png';

import Login from "./Login";
import Cadastro from "./Cadastro";

export default function Inicio() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [logado, setLogado] = useState(false);

  const [diasRestantes, setDiasRestantes] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogado(!!token);

    // === CONTADOR REGRESSIVO PARA O ENEM ===
    const dataEnem = new Date("2026-11-09");
    const hoje = new Date();
    const diff = Math.ceil((dataEnem - hoje) / (1000 * 60 * 60 * 24));
    setDiasRestantes(diff);
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

        <section>
          <div className="intro">
            <div className="div_info_intro">
            <div className="home-card">
              <h2 className="home-title"> Faltam <span className="home-highlight">{diasRestantes}</span> dias para o ENEM 2026!</h2>
              <p>O tempo está passando... prepare-se diariamente e domine o ENEM com confiança!</p>
            </div>
              <Link to="/quiz" className="button-intro">Começar agora</Link>
            </div>
          </div>
          
          <div className="home-single-row">

          {/* DESAFIO DA SEMANA */}
          <div className="home-desafio-card">
            <h2>🏆 Desafio da Semana</h2>
            <p>Complete as missões e ganhe +150 XP bônus!</p>

            <ul className="home-desafio-list">
              <li>✔ Responder 100 questões</li>
              <li>✔ Responder 20 questões de Matemática</li>
              <li>✔ Finalizar 1 simulado completo</li>
            </ul>

            <button className="home-desafio-btn">Participar do desafio</button>
          </div>

          {/* ESTATÍSTICAS */}
          <div className="home-stats-container">
            <div className="home-stat-card">
              <h3>⭐ Seus pontos</h3>
              <p className="home-stat-number">420 XP</p>
              <p>Mantenha seu ritmo para subir de nível!</p>
            </div>

            <div className="home-stat-card">
              <h3>🎯 Questões hoje</h3>
              <p className="home-stat-number">18</p>
              <p>Meta diária: 20</p>
            </div>
          </div>

          {/* PREMIUM */}
          <div className="home-premium-card">
            <div className="premium-info">
              <h2>💎 XP Premium</h2>
              <p>Desbloqueie recursos exclusivos e acelere sua evolução.</p>

              <ul>
                <li>✨ Questões exclusivas por habilidade</li>
                <li>📊 Estatísticas avançadas detalhadas</li>
                <li>📘 Simulados ilimitados</li>
                <li>🧠 Análises inteligentes por competências</li>
              </ul>

              <button className="premium-btn">Conhecer o Premium</button>
            </div>

            <div className="premium-img"></div>
          </div>

        </div>

        <div className="info">
            <h1>Benefícios</h1>
            <div className="info-informs">
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
          abrirCadastro={() => {
            setMostrarCadastro(true);
            setMostrarLogin(false);
          }}
          onLogin={() => {
            setLogado(true);
            setMostrarLogin(false);
          }}
        />
      )}

      {mostrarCadastro && (
        <Cadastro
          fecharModal={() => setMostrarCadastro(false)}
          abrirLogin={() => {
            setMostrarCadastro(false);
            setMostrarLogin(true);
          }}
          onLogin={() => {
            setLogado(true);
            setMostrarCadastro(false);
          }}
        />
      )}
    </>
  );
}
