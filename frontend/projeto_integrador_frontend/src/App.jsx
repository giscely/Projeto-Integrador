import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz"
import Sobre from "./pages/Sobre"
import Perfil from "./pages/Perfil"
import "./App.css"
import Cadastro from "./pages/Cadastro";

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/sobre" element={<Sobre/>} />
        <Route path="/perfil" element={<Perfil/>} />
      </Routes>
    </BrowserRouter>
  );

}
