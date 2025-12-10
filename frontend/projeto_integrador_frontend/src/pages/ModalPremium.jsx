import React from "react";
import "./ModalPremium.css";

function ModalPremium({ setMostrarPremium }) {
  return (
    <div className="modalPremium-overlay">
      <div className="modalPremium-container">

        <div className="premium-icon">⭐</div>

        <h2 className="premium-title">
          Responda simulados completos e ilimitados para o ENEM
        </h2>

        <p className="premium-subtext">
          Tenha acesso a simulados extensos, sem limites por dia, e treine como no dia da prova para aumentar seu desempenho e sua confiança.
        </p>

        <button className="btn-primary">
          Ver planos
        </button>

        <button className="btn-secondary" onClick={() => setMostrarPremium(false)}>
          Não tenho interesse
        </button>

      </div>
    </div>
  );
}

export default ModalPremium;
