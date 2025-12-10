import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // usa o mesmo CSS do login

import imagemEstudantes from "../assets/xpenem_img_login.png";

export default function Cadastro({ fecharModal, abrirLogin, onLogin }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const enviarDados = async (e) => {
    e.preventDefault();

    const dados = { nome, email, senha };

    try {
      const response = await fetch("http://127.0.0.1:8080/auth/cadastro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });

      const data = await response.json();
      console.log("Resposta da API:", data);

      setMensagem(data.mensagem);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        onLogin();
        fecharModal();
        navigate("/");
      }
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }

    setNome("");
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
          
          {/* LADO ESQUERDO - IMAGEM COM OVERLAY */}
          <div className="login_lado_esquerdo">
            <img
              src={imagemEstudantes}
              alt="Estudantes"
              className="login_imagem_fundo"
            />
            <div className="login_overlay_texto">
              <h1>Crie sua conta no XpENEM!</h1>
              <p>Comece agora sua jornada rumo ao ENEM</p>
            </div>
          </div>

          {/* LADO DIREITO - FORMULÁRIO */}
          <div className="login_lado_direito">
            <h2 className="login_titulo">CADASTRO</h2>

            <form className="forms-login" onSubmit={enviarDados}>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

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
                Cadastrar
              </button>
            </form>

            <p className="cadastro_link">
              Já tem uma conta?{" "}
              <span className="link_fake" onClick={abrirLogin}>
                Entrar
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
