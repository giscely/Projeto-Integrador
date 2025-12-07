import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import "./Inicio.css";
import "./ModalQuiz.css"
import logo from '../assets/logo_XPENEM.png';

function ModalQuiz({ setMostrarQuiz, questoesQuiz, disciplina, quantQuestoes, sim_id}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");


    const [mostrarComecar, setMostrarComecar] = useState(true);
    const [confirmarSaida, setConfirmarSaida] = useState(false);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [finalizou, setFinalizou] = useState(false);
    const [acertouQuestao, setAcertouQuestao] = useState(false);

    const [listaRespostas, setListaRespostas] = useState([])


    const [confirmarSaidaHeader, setConfirmarSaidaHeader] = useState(false);
    const [rotaDestino, setRotaDestino] = useState("");  // nova rota escolhida

    const [alternativaSelecionada, setAlternativaSelecionada] = useState("");

    // === TIMER ===
    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        if (mostrarComecar || mostrarFeedback) return;

        const interval = setInterval(() => {setSegundos((prev) => prev + 1);}, 1000);

        return () => clearInterval(interval);
    }, [mostrarComecar, mostrarFeedback]);

    const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
    const secs = String(segundos % 60).padStart(2, "0");


    // ===  RESULTADO ===
    const [resultadoQuiz, setResultadoQuiz] = useState({
        disciplina: disciplina,
        acertos: 0,
        totalQuestoes: quantQuestoes,
        tempos: [],
    });

    const [questaoAtual, setQuestaoAtual] = useState(0);

    const questao = questoesQuiz[questaoAtual];
    if (!questao) return null;


    // === RESPONDER ===
    const handleResponder = (e) => {
        e.preventDefault();

        if (!alternativaSelecionada) {
            alert("Escolha uma alternativa!");
            return;
        }

        setListaRespostas(prev => [...prev, alternativaSelecionada]);

        const respostaCerta = questao.qst_correct_alternative;
        const acertou = alternativaSelecionada === respostaCerta;

        setResultadoQuiz((prev) => ({
            ...prev,
            acertos: prev.acertos + (acertou ? 1 : 0),
            tempos: [...prev.tempos, segundos],
        }));

        const proxima = questaoAtual + 1;

        // === FINAL DO QUIZ ===
        if (proxima === quantQuestoes) {
            setMostrarFeedback(false);   
            setFinalizou(true);
            enviarResultado(sim_id);
            return;
        }

        // === Próxima questão ===
        setQuestaoAtual(proxima);
        setAcertouQuestao(acertou);
        setMostrarFeedback(true);

        setAlternativaSelecionada("");
        setSegundos(0);
    }


    async function enviarResultado(sim_id) {
        const respostas = { respostas: listaRespostas };

        try {
            const response = await fetch(`http://127.0.0.1:8080/simulados/${sim_id}/resultado`, 
            {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(respostas)
            });

            const data = await response.json();
            console.log("Resultado enviado:", data);

        } catch (error) {
            console.error("Erro ao enviar resultado:", error);
        }
    }


    return (
    <div className="modalQuiz-body">

    
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
            
            {/* === TELA FINAL === */}
            {finalizou && (
                <div className="quizComecar-overlay">
                    <div className="quizComecar-card">
                        <h2>🎉 Parabéns! Você terminou o quiz!</h2>
                        <p>Acertos: {resultadoQuiz.acertos} / {quantQuestoes}</p>

                        <button onClick={() => setMostrarQuiz(false)}>
                            Sair
                        </button>

                        <p>Respostas: {listaRespostas.join(", ")}</p>
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
                    QUIZ - {disciplina}
                    </h3>
                    <p className="modalQuiz-subtitle">{questao.qst_title}</p>

                    {/* Enunciado */}
                    <p className="modalQuiz-enunciado">{questao.qst_context.replace(/!\[[^\]]*\]\([^\)]+\.(png|jpg|jpeg)\)/gi, "")}</p>
                    <h5 className="modalQuiz-enunciado">
                        {questao.qst_question}
                    </h5>

                    {/* Imagem da questão (se houver) */}
                    {questao.qst_file_url && questao.qst_file_url.length > 0 && (
                        <img
                        src={questao.qst_file_url[0]}
                        alt="Imagem da questão"
                        className="modalQuiz-image"
                        />
                    )}
                    
                </div>

                <form className="modalQuiz-form" onSubmit={handleResponder}>

                    <div className="modalQuiz-alternativas">

                        {questao.qst_alternatives.map((alt, index) => (
                            <label key={index} className="modalQuiz-checkboxCard">

                                <input
                                type="radio"
                                name="alternativa"
                                value={alt.letter}
                                className="modalQuiz-checkbox"
                                checked={alternativaSelecionada === alt.letter}
                                onChange={(e) => setAlternativaSelecionada(e.target.value)}
                                />

                                <span className="modalQuiz-altLetra">{alt.letter}</span>
                                <span className="modalQuiz-altTexto">{alt.text}</span>

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
    </div>
  );
}

export default ModalQuiz;

