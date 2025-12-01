import React from "react";
import "./ModalPremium.css";

function ModalPremium({ setMostrarPremium }) {
  return (
    <div className="modalPremium-overlay">
      <div className="modalPremium-container">

        {/* Ícone */}
        <div className="premium-icon">⭐</div>

        {/* Título */}
        <h2 className="premium-title">
          Descubra sua nota e treine pelas<br />
          competências do ENEM
        </h2>

        {/* Texto secundário */}
        <p className="premium-subtext">
          Assine o respostaCerta Premium e tenha acesso a essa e outras funcionalidades.
        </p>

        {/* Botões */}
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
