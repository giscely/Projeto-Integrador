import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo_XPENEM.png';
import "./Sobre.css";
import Login from "./Login";


export default function Sobre() {
    const [logado, setLogado] = useState(false);
    const [mostrarLogin, setMostrarLogin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLogado(!!token);
    }, []);

    function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setLogado(false);
    }

return (
    <>
    <div className="main_page">
        <header>
            <div className="img-logo">
                <img src={logo} alt="logo" />
            </div>
            <nav>
                <Link to="/" className="button-menu">Inicio</Link>
                <Link to="/quiz" className="button-menu">Simulado</Link>
                <Link to="/sobre" className="button-menu menu-select">Sobre</Link>
                {logado ? (
                    <button className="bt-login" onClick={handleLogout}>Logout</button>
                ) : (
                    <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
                )}

                <Link to="/perfil" className="icon-perfil">icon</Link>
            </nav>
        </header>
        <section>
            <h2>🧭 Sobre Nós: Bem-vindo ao XPEnem, uma plataforma criada para transformar a forma como os estudantes se preparam para o ENEM e vestibulares! 🚀 Nosso objetivo é tornar o aprendizado mais leve, eficiente e personalizado, ajudando cada aluno a entender seus pontos fortes e onde pode melhorar. Desde 2023, reunimos uma equipe apaixonada por educação, tecnologia e design para criar ferramentas interativas, simulados inteligentes e dashboards de desempenho que ajudam você a evoluir de verdade.</h2>
            <h3>
                👥 Nossa Equipe

                Somos um grupo de alunos de Informática e que assim como os alunos, acreditam que aprender pode (e deve!) ser divertido.

                📍 Curiosidades Aleatórias

                A ideia do XPEnem veio de uma conversa de bar sobre como a preparação para o ENEM poderia ser menos estressante. Assim, juntamos nosso conhecimento em tecnologia e educação para criar algo inovador.

                Nosso mascote se chama Pixel, e ele nasceu de um erro de código que virou piada interna. 😅

                Já ajudamos mais de 50 mil estudantes a simularem suas notas no ENEM.
                </h3>
        </section>
    </div>
    {mostrarLogin && (
        <Login
        fecharModal={() => setMostrarLogin(false)}
        onLogin={() => {
            setLogado(true);      // muda o botão
            setMostrarLogin(false); // fecha o modal
        }}
        />
    )}
    </>
)
}

