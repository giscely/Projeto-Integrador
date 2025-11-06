import { useState } from "react";
import "./Login.css";

export default function Login({ fecharModal }) {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const submitUser = (e) => {
    e.preventDefault();
    console.log({ nome, email, senha });
  };

  return (
    <>
      <div className="overlay_click" onClick={fecharModal}></div>
      <div className="login_modal" onClick={(e) => e.stopPropagation()}>
        <button className="btn_fechar" onClick={fecharModal}>
          &times;
        </button>

        <h2>LOGIN</h2>
        <form className="forms-login" onSubmit={submitUser}>
          <label>Nome do Usuário:</label>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)}/>

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

          <button className="bt_enviar" type="submit">Entrar</button>
        </form>
        <p className="cadastro_link">
          Ainda não tem uma conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </div>
    </>
  );
}
