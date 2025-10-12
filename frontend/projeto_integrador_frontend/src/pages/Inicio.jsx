import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Inicio.css"
import logo from '../assets/logo_XPENEM.png'
import intro_logo from '../assets/intro_XPENEM.png'
import img_intro from '../assets/img_intro_XPENEM.png'
import icon_alvo from '../assets/icon_alvo.png'
import icon_cronometro from '../assets/icon_cronometro.png'
import icon_grafico from '../assets/icon_grafico.png'
import icon_trofeu from '../assets/icon_trofeu.png'

export default function Inicio() {
    const [dados, setDados] = useState(null)
    useEffect(() => {
        fetch("http://127.0.0.1:8000") 
            .then((response) => response.json())
            .then((data) => setDados(data))
            .catch((err) => console.error("Erro:", err));
        }, []);

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
                    <button><Link to="/login">Login</Link></button>
                    <div>icon</div>
                </nav>
            </header>
            <section>
                <div className="intro">
                    <div className="div_info_intro">
                        <img src={intro_logo} alt="" />
                        <p> 
                            Vamos juntos transformar a forma de se preparar para o ENEM!
                        </p>
                        <button>começar agora</button>
                    </div>
                    <div className="div_img_intro">
                        <img src={img_intro} alt="" />
                    </div>
                </div>

                <div className="info">

                    <div>
                        <span><img src={icon_alvo} alt="" /></span>
                        <p>Questoes no estilo enem</p>
                    </div>
                    <div>
                        <span><img src={icon_cronometro} alt="" /></span>
                        <p>Estude no seu ritmo</p>
                    </div>
                    <div>
                        <span><img src={icon_grafico} alt="" /></span>
                        <p>Relatorios de desempenho</p>
                    </div>
                    <div>
                        <span><img src={icon_trofeu} alt="" /></span>
                        <p>Ganhe trofeus e recompensas</p>
                    </div>

                </div>

                <div className="description">

                    
                </div>
            </section>

        </div>
    
    </>
    );
}
