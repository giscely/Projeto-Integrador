import { useState } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css";
import logo from '../assets/logo_XPENEM.png';
import img_intro from '../assets/img_intro_XPENEM.png';
import icon_alvo from '../assets/icon_alvo.png';
import icon_cronometro from '../assets/icon_cronometro.png';
import icon_grafico from '../assets/icon_grafico.png';
import icon_trofeu from '../assets/icon_trofeu.png';
import Login from "./Login";

export default function Inicio() {
  const [mostrarLogin, setMostrarLogin] = useState(false);

  return (
    <>
      <div className="main_page">
        <header>
          <div>
            <img src={logo} alt="logo" />
          </div>
          <nav>
            <button>Início</button>
            <button>Quiz</button>
            <button>Sobre</button>
            <button onClick={() => setMostrarLogin(true)}>Login</button>

            <div>icon</div>
          </nav>
        </header>
        <section>
          <div className="intro">
            <div className="div_info_intro">
              <h1>Domine o Enem com confiança!</h1>
              <p>Aprenda no seu ritmo e conquiste o seu futuro.</p>
              <button>Começar agora</button>
            </div>
            <div className="div_img_intro">
              <img src={img_intro} alt="" />
            </div>
          </div>

          <div className="info">
            <div>
              <div className="info-titulo">
                <span><img src={icon_alvo} alt="" /></span>
                <h2>Questoes no estilo enem</h2>
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

          <div className="description"></div>
        </section>
      </div>

        {/* MOSTRAR O MODAL */}
        {mostrarLogin && (
            <Login fecharModal={() => setMostrarLogin(false)} />
        )}

    </>
  );
}