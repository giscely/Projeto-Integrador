import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css";
import { useUser } from "../context/UserContext"; // <-- ADICIONAR IMPORT

import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
// npm install recharts

import logo from '../assets/logo_XPENEM.png';
import icon_alvo from '../assets/icon_alvo.png';
import icon_cronometro from '../assets/icon_cronometro.png';
import icon_grafico from '../assets/icon_grafico.png';
import icon_trofeu from '../assets/icon_trofeu.png';
import img_premium from '../assets/img_premium_inicio.jpeg';
import Login from "./Login";
import Cadastro from "./Cadastro";
import ModalPremium from "./ModalPremium";

export default function Inicio() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [logado, setLogado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [mostrarMsgLogin, setMostrarMsgLogin] = useState(false);

  const [questoesResolvidas, setQuestoesResolvidas] = useState({
    linguagens: 0,
    ciencias_humanas: 0,
    matematica: 0,
    ciencias_natureza: 0
  });

  // USAR O CONTEXTO PARA OBTER O EMOJI
  const { emojiPerfil } = useUser();

  // Mensagem de login
  useEffect(() => {
    setTimeout(() => setMostrarMsgLogin(false), 4000);
  }, [mostrarMsgLogin]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const jaVisitou = sessionStorage.getItem("ja_visitou");
    setLogado(!!token);

    // Mostrar modal inicial apenas na primeira visita na aba e se não estiver logado
    if (!jaVisitou && !token) {
      setMostrarLogin(true);
      sessionStorage.setItem("ja_visitou", "true");
    }

    // CONTADOR REGRESSIVO DO ENEM
    const dataEnem = new Date("2026-11-09");
    const hoje = new Date();
    const diff = Math.ceil((dataEnem - hoje) / (1000 * 60 * 60 * 24));
    setDiasRestantes(diff);
  }, []);

  useEffect(() => {
    async function PegarPontuacao() {
      const token = localStorage.getItem("token");

      if (!token) {
        setPontuacao(0);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8080/user/scores", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        if (!response.ok) {
          console.error("Erro na API:", response.status, response.statusText);
          return;
        }

        const data = await response.json();
        setPontuacao(data.total_score || 0);

      } catch (error) {
        console.error("Erro ao calcular pontuacao:", error);
      }
    }

    PegarPontuacao();
  }, [logado]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setLogado(false);
    setMostrarMsgLogin(true);
  }

  useEffect(() => {
    const BuscarQuestoesResolvidas = async () => {
      try {
        const token = localStorage.getItem("token");
        const resposta = await fetch(
          `http://127.0.0.1:8080/user/questoes_resolvidas_por_disciplina`,
          {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token,
              "Content-Type": "application/json"
            }
          }
        );

        const dados = await resposta.json();

        setQuestoesResolvidas({
          linguagens: dados.linguagens ?? 0,
          ciencias_humanas: dados.ciencias_humanas ?? 0,
          matematica: dados.matematica ?? 0,
          ciencias_natureza: dados.ciencias_natureza ?? 0
        });

      } catch (erro) {
        console.error("Erro ao buscar questões resolvidas:", erro);
      }
    };

    BuscarQuestoesResolvidas();
  }, []);

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
            {/* <Link to="/sobre" className="button-menu">Sobre</Link> */}

            {logado ? (
              <button className="bt-login" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
            )}

            {/* ÍCONE DO PERFIL AGORA VEM DO CONTEXTO */}
            <Link to="/perfil" className="icon-perfil">
              <span style={{ fontSize: "24px" }}>{emojiPerfil}</span>
            </Link>
          </nav>
        </header>

        <section>
          {mostrarMsgLogin && (
            logado ? (
              <div className="alert-sucesso">
                Login realizado com sucesso!
              </div>
            ) : (
              <div className="alert-sucesso">
                Logout realizado com sucesso!
              </div>
            )
          )}
          
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
            {/* 🏆 Ranking de Disciplinas */}
            <div className="home-ranking-card">
              <h2>Ranking de Disciplinas</h2>
              <p className="ranking-subtitle">Quantidade de questões respondidas por disciplina</p>

              <div className="ranking-grafico-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={[
                    { nome: "Linguagens", valor: questoesResolvidas.linguagens },
                    { nome: "Humanas", valor: questoesResolvidas.ciencias_humanas },
                    { nome: "Matemática", valor: questoesResolvidas.matematica },
                    { nome: "Natureza", valor: questoesResolvidas.ciencias_natureza }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#4e9ee4ff" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ESTATÍSTICAS */}
            <div className="home-stats-container">
              <div className="home-stat-card">
                <h3>⭐ Seus pontos</h3>
                <p className="home-stat-number">{pontuacao} XP</p>
                <p>Quanto mais pontos mais conquistas!</p>
              </div>

              <div className="home-stat-card">
                <h3>🎯 Total de questões</h3>
                <p className="home-stat-number">{questoesResolvidas.linguagens + questoesResolvidas.ciencias_humanas + questoesResolvidas.matematica + questoesResolvidas.ciencias_natureza}</p>
                <p>Mantenha seu ritmo para subir de nível!</p>
              </div>
            </div>

            {/* PREMIUM */}
            <div className="home-premium-card">
              <div className="premium-info">
                <h2>XP Premium</h2>
                <p>Desbloqueie recursos exclusivos e acelere sua evolução.</p>

                <ul>
                  <li>✨ Questões exclusivas por habilidade</li>
                  <li>📊 Estatísticas avançadas detalhadas</li>
                  <li>📘 Simulados ilimitados</li>
                  <li>🧠 Análises inteligentes por competências</li>
                </ul>

                <button className="premium-btn" onClick={() => setMostrarPremium(true)}>Conhecer o Premium</button>
              </div>

              <div className="premium-img">
                <img src={img_premium} alt="Descrição da imagem" />
              </div>
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
            setMostrarMsgLogin(true);
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
            setMostrarMsgLogin(true);
          }}
        />
      )}

      {/* MOSTRAR MODAL DE PREMIUM O QUIZ */}
      {mostrarPremium && <ModalPremium setMostrarPremium={setMostrarPremium}/>}
    </>
  );
}