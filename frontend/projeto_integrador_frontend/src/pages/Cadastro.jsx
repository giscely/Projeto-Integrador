import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const enviarDados = async (e) => {
    e.preventDefault();

    const dados = { nome, email, senha,};

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
    } catch (error) {
      console.error("Erro ao enviar:", error);
    }

    setNome("");
    setEmail("");
    setSenha("");
  };

  return (
    <>
      <div className="overlay_click"></div>
      <div className="login_modal" onClick={(e) => e.stopPropagation()}>
        <Link className="btn_fechar" to="/">
          &times;
        </Link>

        <h2>CADASTRO</h2>
        <form className="forms-login" onSubmit={enviarDados}>
          <label>Nome do Usuário:</label>
          <input
            onChange={(e) => setNome(e.target.value)}
            type="text"
            placeholder="Nome"
            value={nome}
            required
          />

          <label>Email:</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            value={email}
            required
          />

          <label>Senha:</label>
          <input
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Senha"
            value={senha}
            required
          />

          <button className="bt_enviar" type="submit">
            Cadastrar
          </button>
        </form>

        {mensagem && <p>{mensagem}</p>}
        <p className="cadastro_link">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </>
  );
}
