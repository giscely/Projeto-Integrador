import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css";
import "./ModalQuiz.css"
import logo from '../assets/logo_XPENEM.png';

function ModalQuiz({ setMostrarQuiz, questoesQuiz, area, quantQuestoes}) {
  
    const [mostrarComecar, setMostrarComecar] = useState(false);

    useEffect(() => {
        setMostrarComecar(true);
    }, []);

    const handleResponder = (e) => {
    e.preventDefault();
    }

    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSegundos((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
    const secs = String(segundos % 60).padStart(2, "0");

    return (
    <div className="modalQuiz-overlay">

        {/* === INÍCIO DO QUIZ === */}
        {mostrarComecar && (
        <div className="quizComecar-overlay">
            <div className="quizComecar-card">
                <h2>Boa sorte! Leia cada questão com atenção.</h2>

                <button
                    className="quizComecar-btn"
                    onClick={() => setMostrarComecar(false)}
                >
                    INICIAR
                </button>
            </div>
        </div>
        )}

        <header>
            <div className="img-logo">
            <img src={logo} alt="logo" />
            </div>
            <nav>
            <Link to="/" className="button-menu">Inicio</Link>
            <Link to="/quiz" className="button-menu">Quiz</Link>
            <Link to="/sobre" className="button-menu">Sobre</Link>
            <button>Login</button>

            <Link to="/perfil" className="icon-perfil">icon</Link>
            </nav>
        </header>

        <div className="modalQuiz-card">
            <button className="modalQuiz-close" onClick={() => setMostrarQuiz(false)}>
            ✖
            </button>
    
            <div className="modalQuiz-info">
                <h3 className="modalQuiz-examTitle">
                QUIZ - LINGUAGENS{/* {questao.ano}  {area} */}
                </h3>
                <p className="modalQuiz-subtitle">ENEM 2024</p>

                {/* Enunciado */}
                <h5 className="modalQuiz-enunciado">
                enunciado Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum, possimus quos! Dignissimos molestias temporibus vitae perferendis cum nisi tenetur ipsam expedita, delectus nam omnis blanditiis amet. Provident expedita a accusantium!
                </h5>
            </div>

            <form className="modalQuiz-form" onSubmit={handleResponder}>

                <div className="modalQuiz-alternativas">

                    {[
                    { letra: "A", texto: "WBFJBJEBFJBJFJBJEBFJBJBFJBEJFBEJBFJBJEBFJBJBFJBEJFBEJBFJBJEBFJBJBFJBEJFBEJBBFJBEJFBEJBFJEBJ" },
                    { letra: "B", texto: "WBFJBJEBFJBJBFJBEJFBEJBFJEBJ" },
                    { letra: "C", texto: "WBFJBJEBFJBJBFJBEJFBEJBFJEBJ" },
                    { letra: "D", texto: "WBFJBJEBFJBJBFJBEJFBEJBFJEBJ" },
                    { letra: "E", texto: "WBFJBJEBFJBJBFJBEJFBEJBFJEBJ" },
                    ].map((alt, index) => (
                    <label key={index} className="modalQuiz-checkboxCard">

                        <input
                        type="radio"
                        name="alternativa"
                        value={alt.letra}
                        className="modalQuiz-checkbox"
                        />

                        <span className="modalQuiz-altLetra">{alt.letra}</span>
                        <span className="modalQuiz-altTexto">{alt.texto}</span>

                    </label>
                    ))}
                </div>

                <button type="submit" className="modalQuiz-btnResponder">
                    Responder
                </button>

            </form>

        <span className="quiz-tempo">
            ⏱ {minutos}:{secs}
        </span>

        {/* Contador */}
        <div className="modalQuiz-contador">
          0  /  5{/* 0 / {quantQuestoes} */}
        </div>

      </div>
    </div>
  );
}

export default ModalQuiz;