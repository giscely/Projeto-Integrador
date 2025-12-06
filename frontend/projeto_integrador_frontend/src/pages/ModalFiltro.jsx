import React from "react";
import "./ModalFiltro.css";


function ModalFiltro({ setMostrarFiltro, setMostrarPremium, setQuantQuestoes, setQuiz }) {

    const handleQuestoes = (quant) => {

      setQuantQuestoes(quant)
      setMostrarFiltro(false)
      setQuiz(true)
    }

    const handlePremium = () => {
      setMostrarPremium(true)
      setMostrarFiltro(false)
    }


  return (
    <>
    
    <div className="modalBackground">
      <div className="modalContainer">
        <h2 className="modal-title">Como você quer treinar?</h2>

        <div className="options">
          <button className="option-card" onClick={() => handleQuestoes(5)}>
            <img src="/img/icon_bloco.png" alt="Icone bloco" className="option-icon" />
            <div>
              <h3>Bloco de 5</h3>
              <p>
                Pratique com um bloco de 5 questões, com questões reais do ENEM!
              </p>
            </div>
          </button>

          <button className="option-card" onClick={() => handleQuestoes(10)}>
            <img src="/img/icon_bloco.png" alt="Icone bloco" className="option-icon" />
            <div>
              <h3>Bloco de 10</h3>
              <p>
                Pratique com um bloco de 10 questões, com questões reais do ENEM!
              </p>
            </div>
          </button>

          <button className="option-card" onClick={() => handlePremium()}>
            <img src="/img/icon_simulado.png" alt="Icone simulado" className="option-icon" />
            <div>
              <h3>Simulado</h3>
              <p>
                Simule o dia da prova e veja seu desempenho com estatísticas detalhadas.
              </p>
            </div>
          </button>
        </div>

        <button className="close-modal" onClick={() => setMostrarFiltro(false)}>
          Fechar
        </button>
      </div>
    </div>


    </>
  );
}

export default ModalFiltro;
