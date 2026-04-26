import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Mapa from './pages/Mapa'
import Perfil from './pages/Perfil'
import M1Teoria from './pages/modulo1/Teoria'
import M1Exercicios from './pages/modulo1/Exercicios'
import M1Resultado from './pages/modulo1/Resultado'
import M2Teoria from './pages/modulo2/Teoria'
import M2Exercicios from './pages/modulo2/Exercicios'
import M2Resultado from './pages/modulo2/Resultado'
import M3Teoria from './pages/modulo3/Teoria'
import M3Exercicios from './pages/modulo3/Exercicios'
import M3Resultado from './pages/modulo3/Resultado'
import M4Intro from './pages/modulo4/Intro'
import M4Quiz from './pages/modulo4/Quiz'
import M4Resultado from './pages/modulo4/Resultado'

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/modulo1/teoria" element={<M1Teoria />} />
          <Route path="/modulo1/exercicios" element={<M1Exercicios />} />
          <Route path="/modulo1/resultado" element={<M1Resultado />} />
          <Route path="/modulo2/teoria" element={<M2Teoria />} />
          <Route path="/modulo2/exercicios" element={<M2Exercicios />} />
          <Route path="/modulo2/resultado" element={<M2Resultado />} />
          <Route path="/modulo3/teoria" element={<M3Teoria />} />
          <Route path="/modulo3/exercicios" element={<M3Exercicios />} />
          <Route path="/modulo3/resultado" element={<M3Resultado />} />
          <Route path="/modulo4" element={<M4Intro />} />
          <Route path="/modulo4/quiz" element={<M4Quiz />} />
          <Route path="/modulo4/resultado" element={<M4Resultado />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}
