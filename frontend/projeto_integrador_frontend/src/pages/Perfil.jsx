import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Perfil.css";
import logo from '../assets/logo_XPENEM.png';
import Login from "./Login";

export default function Perfil() {
  const [logado, setLogado] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [emojiPerfil, setEmojiPerfil] = useState("😎");
  const [showCustomizacao, setShowCustomizacao] = useState(false);

  // Simulação de dados do usuário
  const usuario = {
    nome: "Ylanne K.",
    email: "ylanne@example.com",
    codinome: "MESTRE",
    pontuacao: 1250,
    simuladosFeitos: 8,
    questoesRespondidas: 642,
    desafiosCompletos: 12
  };

  // Simulação de conquistas
  const conquistas = [
    { 
      id: 1, 
      nome: "Mestre da Matemática", 
      icone: "🧮", 
      descricao: "50 questões de Matemática", 
      obtida: true, 
      data: "15/03/2024" 
    },
    { 
      id: 2, 
      nome: "Primeiro Simulado", 
      icone: "🎯", 
      descricao: "Completou o primeiro simulado", 
      obtida: true,
      data: "10/03/2024"
    },
    { 
      id: 3, 
      nome: "Top 10", 
      icone: "🏆", 
      descricao: "Entre os 10 melhores do ranking", 
      obtida: false,
      progresso: "8/10"
    },
    { 
      id: 4, 
      nome: "Maratonista", 
      icone: "🏃", 
      descricao: "5 simulados em um dia", 
      obtida: false 
    },
    { 
      id: 5, 
      nome: "Leitor Ávido", 
      icone: "📚", 
      descricao: "100 questões de Português", 
      obtida: true,
      data: "05/03/2024"
    },
    { 
      id: 6, 
      nome: "Historiador", 
      icone: "🏛️", 
      descricao: "75 questões de História", 
      obtida: false,
      progresso: "45/75"
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogado(!!token);
    
    // Carregar preferência salva
    const savedEmoji = localStorage.getItem("perfil_emoji");
    if (savedEmoji) setEmojiPerfil(savedEmoji);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    setLogado(false);
  }

  const handleEmojiChange = (novoEmoji) => {
    setEmojiPerfil(novoEmoji);
    localStorage.setItem("perfil_emoji", novoEmoji);
  };

  const handleResetCustomizacao = () => {
    setEmojiPerfil("😎");
    localStorage.removeItem("perfil_emoji");
  };

  return (
    <>
      <div className="main_page">
        {/* HEADER */}
        <header>
          <div className="img-logo">
            <img src={logo} alt="logo" />
          </div>
          <nav>
            <Link to="/" className="button-menu">Inicio</Link>
            <Link to="/quiz" className="button-menu">Simulado</Link>
            <Link to="/sobre" className="button-menu">Sobre</Link>

            {logado ? (
              <button className="bt-login" onClick={handleLogout}>Logout</button>
            ) : (
              <button className="bt-login" onClick={() => setMostrarLogin(true)}>Login</button>
            )}

            {/* ÍCONE DO PERFIL */}
            <Link to="/perfil" className="icon-perfil">
              <span style={{ fontSize: "24px" }}>{emojiPerfil}</span>
            </Link>
          </nav>
        </header>

        {/* LAYOUT PRINCIPAL */}
        <div className="perfil-container-wrapper">
          <div className="perfil-container">
            {/* ASIDE – Informações do usuário */}
            <aside className="perfil-aside">
              <div className="foto-wrapper">
                <div className="emoji-perfil-grande">
                  <span style={{ fontSize: "80px" }}>{emojiPerfil}</span>
                </div>
              </div>

              <h2 className="perfil-nome">{usuario.nome}</h2>
              <p className="perfil-email">{usuario.email}</p>
              <p className="perfil-codinome">{usuario.codinome}</p>

              <hr />

              <ul className="menu-perfil">
                <li onClick={() => setShowCustomizacao(!showCustomizacao)}>
                  ✏️ Personalizar Emoji
                </li>
              </ul>

              {/* Seção de Customização */}
              {showCustomizacao && (
                <div className="customizacao-container">
                  <h3>😊 Personalizar Emoji</h3>
                  
                  <div className="customizacao-option">
                    <p>Escolha seu emoji:</p>
                    <div className="emoji-lista">
                      {["😎", "😊", "🔥", "🚀", "🎯", "🧠", "👑", "🌟", "⚡", "💎"].map((emoji) => (
                        <button
                          key={emoji}
                          className={`emoji-btn ${emojiPerfil === emoji ? 'selected' : ''}`}
                          onClick={() => handleEmojiChange(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="preview-avatar">
                    <p>Pré-visualização:</p>
                    <div className="preview-circle">
                      <span style={{ fontSize: "40px" }}>{emojiPerfil}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-reset"
                    onClick={handleResetCustomizacao}
                  >
                    🔄 Redefinir para padrão
                  </button>
                </div>
              )}
            </aside>

            {/* SECTION – Conteúdo principal */}
            <section className="perfil-section">
              {/* Estatísticas */}
              <div className="estatisticas-container">
                <h1>📊 Seu Desempenho</h1>

                <div className="grid-infos">
                  <div className="card-info">
                    <span className="emoji-card">⭐</span>
                    <h3>Pontuação</h3>
                    <span className="valor-destaque">{usuario.pontuacao}</span>
                  </div>

                  <div className="card-info">
                    <span className="emoji-card">🧠</span>
                    <h3>Simulados Feitos</h3>
                    <span className="valor-destaque">{usuario.simuladosFeitos}</span>
                  </div>

                  <div className="card-info">
                    <span className="emoji-card">📚</span>
                    <h3>Questões Respondidas</h3>
                    <span className="valor-destaque">{usuario.questoesRespondidas}</span>
                  </div>

                  <div className="card-info">
                    <span className="emoji-card">🔥</span>
                    <h3>Desafios Concluídos</h3>
                    <span className="valor-destaque">{usuario.desafiosCompletos}</span>
                  </div>
                </div>
              </div>

              {/* Conquistas */}
              <div className="conquistas-container">
                <h1>🏆 Conquistas</h1>
                <p className="subtitle">
                  {conquistas.filter(c => c.obtida).length} de {conquistas.length} conquistas desbloqueadas
                </p>
                
                <div className="conquistas-grid">
                  {conquistas.map((conquista) => (
                    <div 
                      className={`conquista-card ${conquista.obtida ? 'obtida' : 'bloqueada'}`} 
                      key={conquista.id}
                    >
                      <div className="conquista-header">
                        <div className="conquista-icone">{conquista.icone}</div>
                        {conquista.obtida && <span className="badge-obtida">✓</span>}
                      </div>
                      <h4>{conquista.nome}</h4>
                      <p className="conquista-descricao">{conquista.descricao}</p>
                      
                      {conquista.obtida && conquista.data && (
                        <span className="conquista-data">🏅 {conquista.data}</span>
                      )}
                      
                      {!conquista.obtida && conquista.progresso && (
                        <div className="progresso-container">
                          <div className="progresso-bar">
                            <div 
                              className="progresso-fill"
                              style={{ 
                                width: `${(parseInt(conquista.progresso.split('/')[0]) / parseInt(conquista.progresso.split('/')[1])) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="conquista-progresso">{conquista.progresso}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* MODAL LOGIN */}
      {mostrarLogin && (
        <Login
          fecharModal={() => setMostrarLogin(false)}
          onLogin={() => {
            setLogado(true);
            setMostrarLogin(false);
          }}
        />
      )}
    </>
  );
}