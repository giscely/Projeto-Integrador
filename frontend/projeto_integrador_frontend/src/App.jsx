import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import "./App.css"
import Cadastro from "./pages/Cadastro";

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/cadastro" element={<Cadastro/>} />
      </Routes>
    </BrowserRouter>
  );

}
