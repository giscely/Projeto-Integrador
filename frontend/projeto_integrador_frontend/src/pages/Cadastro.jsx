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

        const dados = {
        "nome": nome,
        "email": email,
        "senha": senha

        };

        try {
        const response = await fetch("http://127.0.0.1:8080/cadastro", {
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
        <div className="main_login">
        <div className="login_page">
            <span>
            <Link className="bt_sair" to="/">
                x
            </Link>
            </span>
            <h2>Cadastro</h2>

            <form onSubmit={enviarDados}>
            <span>Nome do Usuário:</span>
            <input
                onChange={(e) => setNome(e.target.value)}
                type="text"
                placeholder="Nome"
                value={nome}
                required
            />

            <span>Email:</span>
            <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                value={email}
                required
            />

            <span>Senha:</span>
            <input
                onChange={(e) => setSenha(e.target.value)}
                type="password"
                placeholder="Senha"
                value={senha}
                required
            />

            <input className="bt_enviar" type="submit" value="Enviar" />
            </form>

            {mensagem && <p>{mensagem}</p>}
        </div>
        </div>
    );
    }
