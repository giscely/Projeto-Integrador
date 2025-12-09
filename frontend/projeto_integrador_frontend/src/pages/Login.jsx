import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import imagemEstudantes from "../assets/xpenem_img_login.png";

export default function Login({ fecharModal, abrirCadastro, onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const enviarDados = async (e) => {
    e.preventDefault();
    const dados = { email, senha };

    try {
      const response = await fetch("http://127.0.0.1:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        setMensagem("Login realizado com sucesso!");
        onLogin();
        navigate("/");
      } else {
        setMensagem(data.mensagem || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setMensagem("Erro ao conectar ao servidor.");
    }

    setEmail("");
    setSenha("");
  };

  return (
    <>
      <div className="overlay_click" onClick={fecharModal}></div>
      
      <div className="login_modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Botão Fechar */}
        <button className="btn_fechar" onClick={fecharModal}>
          &times;
        </button>

        <div className="login_modal_content">
          
          {/* LADO ESQUERDO - IMAGEM */}
          <div className="login_lado_esquerdo">
            <img src={imagemEstudantes} alt="Estudantes" className="login_imagem_fundo" />
            <div className="login_overlay_texto">
              <h1>Bem-vindo ao XpENEM!</h1>
              <p>Faça login para responder questões</p>
            </div>
          </div>

          {/* LADO DIREITO - FORMULÁRIO */}
          <div className="login_lado_direito">
            <h2 className="login_titulo">LOGIN</h2>
            
            <form className="forms-login" onSubmit={enviarDados}>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              
              {mensagem && <p className="msg-erro-login">{mensagem}</p>}
              
              <button className="bt_enviar" type="submit">
                Entrar
              </button>
            </form>

            <p className="cadastro_link">
              Não tem uma conta?{" "}
              <span className="link_fake" onClick={abrirCadastro}>
                Cadastre-se
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}