import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Quiz.css";
import logo from '../assets/logo_XPENEM.png';
import linguagem from '../assets/icon-linguagens.svg';
import humanas from '../assets/icon-humanas.svg';
import matematica from '../assets/icon-matematica.svg';
import natureza from '../assets/icon-natureza.svg';
import Login from "./Login";
import Cadastro from "./Cadastro"
import ModalFiltro from "./ModalFiltro";
import ModalPremium from "./ModalPremium";
import ModalQuiz from "./ModalQuiz";
import { useUser } from "../context/UserContext";


export default function Quiz() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCadastro, setMostrarCadastro] = useState(false);
  const [logado, setLogado] = useState(false);
  const [mostrarMsgLogin, setMostrarMsgLogin] = useState(false);
  const [quiz, setQuiz] = useState(false)
  const [questoesQuiz, setQuestoesQuiz] = useState()
  const [disciplina, setDisciplina] = useState('');
  const [quantQuestoes, setQuantQuestoes] = useState(0);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [mostrarQuiz, setMostrarQuiz] = useState(false);
  const [simId, setSimId] = useState(0)
  const [questoesResolvidas, setQuestoesResolvidas] = useState({
    linguagens: 0,
    ciencias_humanas: 0,
    matematica: 0,
    ciencias_natureza: 0
});

  const handleDisciplina = (disciplina) => {
    const token = localStorage.getItem("token");

    // trata tokens inválidos que aparecem como strings
    if (!token || token === "undefined" || token === "null") {
      console.log("Token inválido:", token);
      setMostrarLogin(true); // abre modal de login
      return;
    }

    // usuário logado -> segue para as questões
    setDisciplina(disciplina);
    setMostrarFiltro(true);
  };

  const { emojiPerfil } = useUser();

  const token = localStorage.getItem("token");
  useEffect(() => {
    setLogado(!!token);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setLogado(false);
  }
  useEffect(() => {
    if (quiz === true) {

      const criarECarregarSimulado = async () => {
        try {
          // CRIAR O SIMULADO (post)
          const resposta = await fetch(`http://127.0.0.1:8080/simulados/${disciplina}?quantidade_questoes=${quantQuestoes}`,
            {
              method: "POST",
              headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
              }
            }
          );

          const simulado = await resposta.json();
          console.log("SIMULADO CRIADO:", simulado);

          //  ID DO SIMULADO
          const simId = simulado.sim_id;

          if (!simId) {
            console.error("Erro: sim_id não retornado pela API");
            return;
          }

          setSimId(simId);
          // BUSCAR O SIMULADO (get)
          const buscarSimulado = await fetch(`http://127.0.0.1:8080/simulados/${simId}`,
            {
              method: "GET",
              headers: {
                "Authorization": "Bearer " + token
              }
            }
          );

          const dadosSimulado = await buscarSimulado.json();
          console.log("SIMULADO OBTIDO:", dadosSimulado);

          
          setQuestoesQuiz(dadosSimulado.sim_questoes);
          setMostrarQuiz(true);
          setQuiz(false);

        } catch (erro) {
          console.error("ERRO AO CRIAR/OBTER SIMULADO:", erro);
        }
      };

      criarECarregarSimulado();
    }
  }, [quiz]);

  useEffect(() => {
    const BuscarQuestoesResolvidas = async () => {
      try {
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




  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // obrigatório para exibir o alerta
    };
    // Quando o modal abrir, ativa o alerta
    window.addEventListener("beforeunload", handleBeforeUnload);
    // Quando o modal fechar, remove o alerta
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <div className="main_page">
        <header>
          <div className="img-logo">
            <img src={logo} alt="logo" />
          </div>
          <nav>
            <Link to="/" className="button-menu">Inicio</Link>
            <Link to="/quiz" className="button-menu menu-select">Simulado</Link>
            {/* <Link to="/sobre" className="button-menu">Sobre</Link> */}
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

        <section>
          <div className="quiz_filtro">
            <div>
              <h1>Escolha a área do conhecimento e comece a praticar!</h1>
            </div>
            <div className="div_quiz_filtro">

              <div className="div_areas">

                <div className="div_area">

                  <span className="area_img">
                    <img src={linguagem} alt="" />
                  </span>
                  <span className="area_text">
                    <h2>Linguagens</h2>
                    <p>Língua Portuguesa e Estrangeira, Artes e Educação Física.</p>
                    
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>{questoesResolvidas.linguagens}</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleDisciplina('linguagens')}> 
                    Praticar</button>
                </div>

              </div>

              <div className="div_areas">

                <div className="div_area">
                  <span className="area_img">
                    <img src={humanas} alt="" />
                  </span>
                  <span className="area_text">
                    <h2>Ciências Humanas</h2>
                    <p>Filosofia, Geografia, História e Sociologia.</p>
                    <br/>
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>{questoesResolvidas.ciencias_humanas}</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleDisciplina('ciencias-humanas')}>Praticar</button>
                </div>

              </div>

              <div className="div_areas">

                <div className="div_area">
                  <span className="area_img">
                    <img src={matematica} alt="" />
                  </span>
                  <span className="area_text">
                    <h2>Matemática</h2>
                    <p>Matemática aplicada à realidade.</p>
                    <br/>
                  </span>


                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>{questoesResolvidas.matematica}</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleDisciplina('matematica')}>Praticar</button>
                </div>

              </div>
              
              <div className="div_areas">

                <div className="div_area">
                  <span className="area_img">
                    <img src={natureza} alt="" />
                  </span>
                  <span className="area_text">
                    <h2>Ciências da Natureza</h2>
                    <p>Biologia, Física e Química.</p>
                    <br/>
                  </span>


                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>{questoesResolvidas.ciencias_natureza}</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleDisciplina('ciencias-natureza')}>Praticar</button>
                </div>

              </div>
            
            </div>
          </div> 

        </section>
        <footer style={{
    position: "fixed",
    bottom: "0px",
    width: "98%",
  }} className="footer">
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
            setMostrarMsgLogin(true)
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
            setMostrarMsgLogin(true)
          }}
        />
      )}

        {/* MOSTRAR MODAL DE FILTRAR O QUIZ */}
        {mostrarFiltro && <ModalFiltro setMostrarFiltro={setMostrarFiltro} setMostrarPremium={setMostrarPremium} setQuantQuestoes={setQuantQuestoes} setQuiz={setQuiz}/>}

        {/* MOSTRAR MODAL DE PREMIUM O QUIZ */}
        {mostrarPremium && <ModalPremium setMostrarPremium={setMostrarPremium}/>}


        {/* MOSTRAR MODAL DE QUESTÕES DO QUIZ */}
        {mostrarQuiz && <ModalQuiz setMostrarQuiz={setMostrarQuiz} questoesQuiz={questoesQuiz} disciplina={disciplina} quantQuestoes={quantQuestoes} sim_id={simId} logado={logado}/>}
        
    </>
  );
}