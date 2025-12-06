import { useState } from "react";
import "./Login.css";

export default function Login({ fecharModal, onLogin }) { // <-- adicionei onLogin

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

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

        // avisa o pai que logou e fecha o modal
        if (typeof onLogin === "function") onLogin();
        if (typeof fecharModal === "function") fecharModal();
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
        <button className="btn_fechar" onClick={fecharModal}>
          &times;
        </button>

        <h2>LOGIN</h2>
        <form className="forms-login" onSubmit={enviarDados}>

          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {mensagem && <p>{mensagem}</p>}

          <button className="bt_enviar" type="submit">Entrar</button>
        </form>

        <p className="cadastro_link">
          Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </div>
    </>
  );
}
