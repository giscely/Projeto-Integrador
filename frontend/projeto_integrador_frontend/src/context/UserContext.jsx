import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [emojiPerfil, setEmojiPerfil] = useState("😎");

  // Carregar emoji do localStorage ao iniciar
  useEffect(() => {
    const savedEmoji = localStorage.getItem("perfil_emoji");
    if (savedEmoji) setEmojiPerfil(savedEmoji);
  }, []);

  // Atualizar localStorage quando o emoji mudar
  const updateEmoji = (novoEmoji) => {
    setEmojiPerfil(novoEmoji);
    localStorage.setItem("perfil_emoji", novoEmoji);
  };

  return (
    <UserContext.Provider value={{ emojiPerfil, updateEmoji }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}