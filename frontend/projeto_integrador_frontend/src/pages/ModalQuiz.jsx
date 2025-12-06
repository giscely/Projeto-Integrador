import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import "./Inicio.css";
import "./ModalQuiz.css"
import logo from '../assets/logo_XPENEM.png';

function ModalQuiz({ setMostrarQuiz, questoesQuiz, area, quantQuestoes}) {
    const navigate = useNavigate();

    const [mostrarComecar, setMostrarComecar] = useState(true);
    const [confirmarSaida, setConfirmarSaida] = useState(false);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [acertouQuestao, setAcertouQuestao] = useState(false);


    const [confirmarSaidaHeader, setConfirmarSaidaHeader] = useState(false);
    const [rotaDestino, setRotaDestino] = useState("");  // nova rota escolhida

    const [alternativaSelecionada, setAlternativaSelecionada] = useState("");

    // === TIMER ===
    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        if (mostrarComecar || mostrarFeedback) return;

        const interval = setInterval(() => {
            setSegundos((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [mostrarComecar, mostrarFeedback]);

    const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
    const secs = String(segundos % 60).padStart(2, "0");

    // === OBJETO RESULTADO ===
    const [resultadoQuiz, setResultadoQuiz] = useState({
        area: area,
        acertos: 0,
        totalQuestoes: quantQuestoes,
        tempos: [],
    });

    const [questaoAtual, setQuestaoAtual] = useState(0);

    useEffect(() => {
    // Se chegou na última questão
    if (questaoAtual === quantQuestoes) {
      alert("🎉 Parabéns! Você terminou o quiz!");
    }
    }, [questaoAtual]);


    const respostaCerta = "B";

    // === RESPONDER ===
    const handleResponder = (e) => {
        e.preventDefault();

        if (!alternativaSelecionada) {
            alert("Escolha uma alternativa!");
            return;
        }
        
        // const acertou = alternativaSelecionada === dados[questao_atual][resposta]
        const acertou = alternativaSelecionada === respostaCerta;

        setResultadoQuiz((prev) => ({
            ...prev,
            acertos: prev.acertos + (acertou ? 1 : 0),
            tempos: [...prev.tempos, segundos],
        }));

        setQuestaoAtual(prev => prev + 1);

        setAcertouQuestao(acertou);
        setMostrarFeedback(true);

        // reset
        setAlternativaSelecionada("");
        setSegundos(0);
    };


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
        {/* === MODAL DE FEEDBACK === */}
            {mostrarFeedback && (
                <div className="quizComecar-overlay">
                    <div className="quizComecar-card">
                        <h2>{acertouQuestao ? "✔ Você acertou!" : "✖ Você errou!"}</h2>

                        <button
                            className="quizComecar-btn"
                            onClick={() => setMostrarFeedback(false)}
                        >
                            CONTINUAR
                        </button>
                    </div>
                </div>
            )}

        {confirmarSaida && (
            <div className="quizComecar-overlay">
                <div className="quizComecar-card">
                    <h2>Tem certeza que deseja sair?</h2>
                    <p style={{ marginBottom: "15px" }}>
                        Seu progresso no quiz será perdido.
                    </p>

                    <button
                        className="quizComecar-btn"
                        style={{ backgroundColor: "#d9534f" }}
                        onClick={() => setMostrarQuiz(false)}
                    >
                        Sair do Quiz
                    </button>

                    <button
                        className="quizComecar-btn"
                        style={{ backgroundColor: "#5bc0de", marginTop: "10px" }}
                        onClick={() => setConfirmarSaida(false)}
                    >
                        Continuar
                    </button>
                </div>
            </div>
        )}

        {confirmarSaidaHeader && (
            <div className="quizComecar-overlay">
                <div className="quizComecar-card">
                    <h2>Tem certeza que deseja sair do quiz?</h2>
                    <p style={{ marginBottom: "15px" }}>
                        Você perderá seu progresso atual.
                    </p>

                    <button
                        className="quizComecar-btn"
                        style={{ backgroundColor: "#d9534f" }}
                        onClick={() => navigate(rotaDestino)}
                    >
                        Sair
                    </button>

                    <button
                        className="quizComecar-btn"
                        style={{ backgroundColor: "#5bc0de", marginTop: "10px" }}
                        onClick={() => setConfirmarSaidaHeader(false)}
                    >
                        Continuar no quiz
                    </button>
                </div>
            </div>
        )}

        <header>
            <div className="img-logo">
            <img src={logo} alt="logo" />
            </div>
            <nav>
                <button className="button-menu" onClick={() => { setRotaDestino("/"); setConfirmarSaidaHeader(true); }}>Inicio</button>

                <button className="button-menu menu-select" >Quiz</button>

                <button className="button-menu" onClick={() => { setRotaDestino("/sobre"); setConfirmarSaidaHeader(true); }}>Sobre</button>

                <button>Login</button>

                <button className="icon-perfil" onClick={() => { setRotaDestino("/perfil"); setConfirmarSaidaHeader(true); }}>icon</button>
            </nav>
        </header>

        <div className="modalQuiz-card">
            <button className="modalQuiz-close" onClick={() => setConfirmarSaida(true)}>
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
                        checked={alternativaSelecionada === alt.letra}
                        onChange={(e) => setAlternativaSelecionada(e.target.value)}
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
        {questaoAtual} / {quantQuestoes}
    </div>

      </div>
    </div>
  );
}

export default ModalQuiz;