import { useState, useEffect, useRef } from "react";


import { useNavigate } from "react-router-dom";


import { Link } from "react-router-dom";
import "./Inicio.css";
import "./ModalQuiz.css"
import logo from '../assets/logo_XPENEM.png';


function ModalQuiz({ setMostrarQuiz, questoesQuiz, disciplina, quantQuestoes, sim_id}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const formRef = useRef(null);




    const [mostrarComecar, setMostrarComecar] = useState(true);
    const [confirmarSaida, setConfirmarSaida] = useState(false);
    const [mostrarFeedback, setMostrarFeedback] = useState(false);
    const [finalizou, setFinalizou] = useState(false);
    const [acertouQuestao, setAcertouQuestao] = useState(false);


    const [listaRespostas, setListaRespostas] = useState([])
    const [listaIdsPerguntas, setListaIdsPerguntas] = useState([]);




    const [confirmarSaidaHeader, setConfirmarSaidaHeader] = useState(false);
    const [rotaDestino, setRotaDestino] = useState("");  // nova rota escolhida


    const [alternativaSelecionada, setAlternativaSelecionada] = useState("");


    const [letraCerta, setLetraCerta] = useState("");
    const [textoCerto, setTextoCerto] = useState("");

    // === TIMER (global do simulado) ===
    const [segundos, setSegundos] = useState(0);


    const intervalRef = useRef(null);

    useEffect(() => {
        // NÃO inicia o timer enquanto estiver na tela inicial
        if (mostrarComecar) return;

        // NÃO inicia + limpa caso finalize o quiz
        if (finalizou) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }

        // Inicia o timer
        intervalRef.current = setInterval(() => {
            setSegundos(prev => prev + 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [mostrarComecar, finalizou]);


    const minutos = String(Math.floor(segundos / 60)).padStart(2, "0");
    const secs = String(segundos % 60).padStart(2, "0");




        // ===  RESULTADO ===
    const [resultadoQuiz, setResultadoQuiz] = useState({
        disciplina: disciplina,
        acertos: 0,
        totalQuestoes: quantQuestoes,
        tempo: segundos,
    });


    const [questaoAtual, setQuestaoAtual] = useState(1);

    // Agora pega a questão correta
    const questao = questoesQuiz[questaoAtual - 1] || null;


    const handleResponder = (e) => {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });



        if (!alternativaSelecionada) {
            alert("Escolha uma alternativa!");
            return;
        }


        setListaRespostas(prev => [...prev, alternativaSelecionada]);
        setListaIdsPerguntas(prev => [...prev, questao.qst_id]);


        const respostaCertatext = questao.qst_alternatives.find(a => a.isCorrect);


        setLetraCerta(respostaCertatext?.letter || "");
        setTextoCerto(respostaCertatext?.text || "");


        const acertou = alternativaSelecionada === questao.qst_correct_alternative;
        setAcertouQuestao(acertou);


        setResultadoQuiz(prev => ({
            ...prev,
            acertos: prev.acertos + (acertou ? 1 : 0),
            tempo: segundos
        }));


        // 👉 Só abre o feedback. NÃO AVANÇA AINDA.
        setMostrarFeedback(true);
    };
        
    useEffect(() => {
        const handleKeyDown = (e) => {
            // não enviar enquanto estiver no início ou no feedback
            if (mostrarComecar || mostrarFeedback || finalizou) return;

            if (e.key === "Enter") {
                e.preventDefault();

                // apenas envia se já tiver alternativa selecionada
                if (alternativaSelecionada && formRef.current) {
                    formRef.current.requestSubmit();   // ENVIA DE VERDADE
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [alternativaSelecionada, mostrarComecar, mostrarFeedback, finalizou]);


    async function enviarResultado(sim_id) {
        const respostas = { 
            questoes: listaIdsPerguntas, 
            respostas: listaRespostas
        };

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



    async function SairQuiz(sim_id) {


        try {
            const response = await fetch(`http://127.0.0.1:8080/simulados/deletar_simulado/${sim_id}`,
            {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
            });


            const data = await response.json();


        } catch (error) {
            console.error("Erro ao deletar o simulado:", error);
        }
    }


    const nomesDisciplinas = {
        "linguagens": "Linguagens",
        "ciencias-natureza": "Ciências da Natureza",
        "ciencias-humanas": "Ciências Humanas",
        "matematica": "Matemática"
    };


    const nomeDisciplina = nomesDisciplinas[disciplina] || disciplina;




    return (
    <div className="modalQuiz-body">



        <div className="modalQuiz-overlay">


            {/* === INÍCIO DO QUIZ === */}
            {mostrarComecar && (
            <div className="quizComecar-overlay">
                <div className="quizComecar-card">

                {/* Ícone */}
                <div className="quizComecar-icon">🧠</div>

                {/* Título */}
                <h2>Prepare-se para as questões!</h2>
                <p className="quizComecar-subtitle">
                    Leia com atenção, mantenha a calma e dê o seu melhor.
                </p>

                {/* Informações do Quiz */}
                <div className="quizComecar-infoBox">
                    <p><strong>Disciplina:</strong> {nomeDisciplina}</p>
                    <p><strong>Questões:</strong> {quantQuestoes}</p>
                    <p><strong>Dificuldade:</strong> Mista</p>
                </div>

                {/* Barra animada */}
                <div className="quizComecar-progress">
                    <div className="quizComecar-progressBar"></div>
                </div>

                {/* Botão */}
                <button
                    className="quizComecar-btn"
                    onClick={() => setMostrarComecar(false)}
                >
                    COMEÇAR AGORA
                </button>
                </div>
            </div>

            )}
            
            {/* === TELA FINAL === */}
            {finalizou && (
                <div className="quizFinalizar-overlay">
                    <div className="quizFinalizar-card">

                        <div className="quizFinalizar-icone">🏆</div>
                        <h2 className="quizFinalizar-titulo">Parabéns!</h2>
                        <h2 className="quizFinalizar-titulo">
                            Você concluiu o bloco de {quantQuestoes} questões!
                        </h2>

                        <div className="quizFinalizar-infoGroup">

                            <div className="quizFinalizar-info">
                                <span className="quizFinalizar-label">Acertos</span>
                                <span className="quizFinalizar-valor">
                                    {resultadoQuiz.acertos} / {quantQuestoes}
                                </span>
                            </div>

                            <div className="quizFinalizar-info">
                                <span className="quizFinalizar-label">Tempo Total</span>
                                <span className="quizFinalizar-valor">
                                    {minutos}:{secs}
                                </span>
                            </div>

                            <div className="quizFinalizar-info">
                                <span className="quizFinalizar-label">XP Ganho</span>
                                <span className="quizFinalizar-valor xp">
                                    +{resultadoQuiz.acertos * 10} XP
                                </span>
                            </div>

                        </div>

                        <div className="quizFinalizar-barraXP">
                            <div
                                className="quizFinalizar-barraXP-fill"
                                style={{
                                    width: `${(resultadoQuiz.acertos / quantQuestoes) * 100}%`
                                }}
                            ></div>
                        </div>

                        <button
                            className="quizFinalizar-btn"
                            onClick={() => setMostrarQuiz(false)}
                        >
                            Finalizar
                        </button>

                    </div>
                </div>
            )}



            {/* === MODAL DE FEEDBACK === */}
            {mostrarFeedback && (
                <div className="quizFeedback-overlay">
                    <div className="quizFeedback-card">


                        {/* Barra superior */}
                        <div className={`quizFeedback-header ${acertouQuestao ? "acerto" : "erro"}`}>
                            <span className="quizFeedback-icon">{acertouQuestao ? "✔" : "✖"}</span>


                            <h3 className="quizFeedback-title">A resposta da letra {alternativaSelecionada} {acertouQuestao ? "está correta" : "está incorreta"} </h3>
                        </div>


                        {/* Texto da resposta correta */}
                        <p className="quizFeedback-text">
                            <strong>Alternativa correta:</strong> {letraCerta} — {textoCerto}
                        </p>


                        {/* Botão continuar */}
                        <button
                        className="quizFeedback-btn"
                        onClick={() => {
                            const proxima = questaoAtual + 1;


                            if (proxima > quantQuestoes) {
                            setMostrarFeedback(false);

                            setResultadoQuiz(prev => ({
                                ...prev,
                                tempo: segundos
                            }));

                            setFinalizou(true);
                            enviarResultado(sim_id);
                            return;
                        }

                            setQuestaoAtual(proxima); // 👉 Agora avançou!
                            setAlternativaSelecionada("");
                            setMostrarFeedback(false);
                        }}
                    >
                        CONTINUAR
                    </button>
                    </div>
                </div>
            )}




            {confirmarSaida && (
                <div className="quizSaida-overlay">
                    <div className="quizSaida-card">


                        <h2 className="quizSaida-title">Tem certeza que deseja sair?</h2>
                        <p className="quizSaida-subtitle">
                            Seu progresso no quiz será perdido.
                        </p>


                        <div className="quizSaida-buttons">
                            <button
                                className="quizSaida-btn sair"
                                onClick={() => {
                                    SairQuiz(sim_id);        // DELETE no backend
                                    setMostrarQuiz(false);   // Fecha o modal
                                }}
                            >
                                Sair do Quiz
                            </button>


                            <button
                                className="quizSaida-btn continuar"
                                onClick={() => setConfirmarSaida(false)}
                            >
                                Continuar
                            </button>
                        </div>


                    </div>
                </div>
            )}






            {confirmarSaidaHeader && (
                <div className="quizSaida-overlay">
                    <div className="quizSaida-card">
                        <h2>Tem certeza que deseja sair do quiz?</h2>


                        <p>Você perderá seu progresso atual.</p>


                        <div className="quizSaida-buttons">
                            <button
                                className="quizSaida-btn sair"
                                onClick={() => navigate(rotaDestino)}
                            >
                                Sair
                            </button>


                            <button
                                className="quizSaida-btn continuar"
                                onClick={() => setConfirmarSaidaHeader(false)}
                            >
                                Continuar no quiz
                            </button>
                        </div>
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


            {/* SOMENTE EXIBE AS QUESTÕES SE NÃO FINALIZOU */}
            {!finalizou && questao && (
            <div className="modalQuiz-card">
                <button className="modalQuiz-close" onClick={() => setConfirmarSaida(true)}>
                ✖
                </button>
        
                <div className="modalQuiz-info">
                    <h3 className="modalQuiz-examTitle">
                    QUIZ - {nomeDisciplina}
                    </h3>
                    <p className="modalQuiz-subtitle">{questao.qst_title}</p>


                    {/* Enunciado */}
                    {questao.qst_context && (
                        <p className="modalQuiz-enunciado">{questao.qst_context.replace(/!\[[^\]]*\]\([^\)]+\.(png|jpg|jpeg)\)/gi, "")}</p>)}
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

                <form ref={formRef} className="modalQuiz-form" onSubmit={handleResponder}>


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
            )}
        </div>
    </div>
    );
    }


export default ModalQuiz;
