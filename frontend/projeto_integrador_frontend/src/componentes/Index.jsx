import { useEffect, useState } from "react";

export default function Index() {
    const [dados, setDados] = useState(null)
    useEffect(() => {
        fetch("http://127.0.0.1:8080") 
            .then((response) => response.json())
            .then((data) => setDados(data))
            .catch((err) => console.error("Erro:", err));
        }, []);

    return (
    <>
        {dados ? (
            <div>
                <p><strong>Usuário:</strong> {dados.user}</p>
                <p><strong>Idade:</strong> {dados.idade}</p>
            </div>
            ) : (
                <p>Carregando dados...</p>
        )}
    </>
    );
}
