import { useState } from 'react'

import './App.css'
import Index from './componentes/Index'
import Inicio from './componentes/Inicio'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Index/> */}
      <Inicio/>
    </>
  )
}

export default App
