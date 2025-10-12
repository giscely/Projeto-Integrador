import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import "./App.css"

export default function App() {
  return (
<<<<<<< Updated upstream
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
=======
    <>

      {/* <Index/> */}
      <Inicio/>
    </>
  )
>>>>>>> Stashed changes
}
