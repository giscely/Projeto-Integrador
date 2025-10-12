import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css"

export default function Login() {
    const [dados, setDados] = useState(null)
    useEffect(() => {
        fetch("http://127.0.0.1:5000") 
            .then((response) => response.json())
            .then((data) => setDados(data))
            .catch((err) => console.error("Erro:", err));
        }, []);


    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    
    const handleNome = (e) => {
        setNome(e.target.value)

    }
    const handleEmail = (e) => {
        setEmail(e.target.value)

    }
    const handleSenha = (e) => {
        setSenha(e.target.value)

    }

    const submitUser = (e) => {
        e.preventDefault()
            if (!user){
                return
        }

        const User = {
            // id: Math.floor(Math.random()*10000), 
            nome: nome,
            email: email,
            senha: senha
        }

    }
    
    return (
    <>
        <div className="main_login">   
            
            <div className="login_page">
                <span><Link className="bt_sair" to="/">x</Link></span>
                <h2>L O G I N</h2>

                <form>
                    
                    <span>Nome do Usuário:</span>
                    <input onChange={handleNome} type="text" placeholder="Nome" value={nome}></input>

                    <span>Email:</span>
                    <input onChange={handleEmail} type="email" placeholder="Email" value={email}></input>

                    <span>Senha:</span>
                    <input onChange={handleSenha} type="password" placeholder="Senha" value={senha}></input>

                    <input className="bt_enviar" onClick={submitUser} type="submit" value='Enviar' />
                
                    <p>Fazer cadastro</p>
                </form>

            </div>

        </div>
    
    </>
    );
}