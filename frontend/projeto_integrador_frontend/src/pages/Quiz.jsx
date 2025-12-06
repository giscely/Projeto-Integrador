import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Quiz.css";
import logo from '../assets/logo_XPENEM.png';
import Login from "./Login";

import ModalFiltro from "./ModalFiltro";
import ModalPremium from "./ModalPremium";
import ModalQuiz from "./ModalQuiz";


export default function Quiz() {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const [quiz, setQuiz] = useState(false)
  const [questoesQuiz, setQuestoesQuiz] = useState()
  const [area, setArea] = useState('');
  const [quantQuestoes, setQuantQuestoes] = useState(0);
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [mostrarPremium, setMostrarPremium] = useState(false);
  const [mostrarQuiz, setMostrarQuiz] = useState(false);

  const handleArea = (area) => {
    setArea(area)
    setMostrarFiltro(true)
  }



  useEffect(() => {
    if (quiz === true) {
      // fetch(`http://127.0.0.1:8080/questoes?area=${area}&quant=${quantQuestoes}`)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setQuestoesQuiz(data);
      //     setMostrarQuiz(true);
      //     setQuiz(false)
      //   })
      //   .catch((err) => console.error("Erro ao buscar questões:", err));
    setMostrarQuiz(true);
    setQuiz(false)
  
  }
  }, [quiz]);





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
            <Link to="/quiz" className="button-menu menu-select">Quiz</Link>
            <Link to="/sobre" className="button-menu">Sobre</Link>
            <button onClick={() => setMostrarLogin(true)}>Login</button>

            <Link to="/perfil" className="icon-perfil">icon</Link>
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

                  <span className="area_text">
                    <h2>Linguagens</h2>
                    <p>Língua Portuguesa e Estrangeira, Artes e Educação Física.</p>
                  </span>
                  <span className="area_img">
                    <img src="" alt="" />
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>0</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleArea('Linguagens')}> 
                    Praticar</button>
                </div>

              </div>

              <div className="div_areas">

                <div className="div_area">

                  <span className="area_text">
                    <h2>Ciências Humanas</h2>
                    <p>Filosofia, Geografia, História e Sociologia.</p>
                  </span>
                  <span className="area_img">
                    <img src="" alt="" />
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>0</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleArea('Humanas')}>Praticar</button>
                </div>

              </div>

              <div className="div_areas">

                <div className="div_area">

                  <span className="area_text">
                    <h2>Matemática</h2>
                    <p>Matemática aplicada à realidade.</p>
                  </span>
                  <span className="area_img">
                    <img src="" alt="" />
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>0</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleArea('Matematica')}>Praticar</button>
                </div>

              </div>
              
              <div className="div_areas">

                <div className="div_area">

                  <span className="area_text">
                    <h2>Ciências da Natureza</h2>
                    <p>Biologia, Física e Química.</p>
                  </span>
                  <span className="area_img">
                    <img src="" alt="" />
                  </span>

                </div>
                <div className="info_area">
                  <div className="quant_questoes_area">
                    <h4>0</h4>
                    <p>Questões feitas</p>
                  </div>
                  <button onClick={() => handleArea('Natureza')}>Praticar</button>
                </div>

              </div>
            
            </div>
          </div> 

        </section>
      </div>

        {/* MOSTRAR O MODAL */}
        {mostrarLogin && (
            <Login fecharModal={() => setMostrarLogin(false)} />
        )}

        {/* MOSTRAR MODAL DE FILTRAR O QUIZ */}
        {mostrarFiltro && <ModalFiltro setMostrarFiltro={setMostrarFiltro} setMostrarPremium={setMostrarPremium} setQuantQuestoes={setQuantQuestoes} setQuiz={setQuiz}/>}

        {/* MOSTRAR MODAL DE PREMIUM O QUIZ */}
        {mostrarPremium && <ModalPremium setMostrarPremium={setMostrarPremium}/>}


        {/* MOSTRAR MODAL DE QUESTÕES DO QUIZ */}
        {mostrarQuiz && <ModalQuiz setMostrarQuiz={setMostrarQuiz} questoesQuiz={questoesQuiz} area={area} quantQuestoes={quantQuestoes}/>}

    </>
  );
}