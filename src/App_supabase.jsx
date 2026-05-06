import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'

import Landing    from './pages/Landing'
import Login      from './pages/Login'
import Cadastro   from './pages/Cadastro'
import Mapa       from './pages/Mapa'
import Perfil     from './pages/Perfil'

import TeoriaM1   from './pages/modulo1/Teoria'
import ExerciciosM1 from './pages/modulo1/Exercicios'
import ResultadoM1  from './pages/modulo1/Resultado'

import TeoriaM2   from './pages/modulo2/Teoria'
import ExerciciosM2 from './pages/modulo2/Exercicios'
import ResultadoM2  from './pages/modulo2/Resultado'

import TeoriaM3   from './pages/modulo3/Teoria'
import ExerciciosM3 from './pages/modulo3/Exercicios'
import ResultadoM3  from './pages/modulo3/Resultado'

import IntroM4    from './pages/modulo4/Intro'
import QuizM4     from './pages/modulo4/Quiz'
import ResultadoM4  from './pages/modulo4/Resultado'

// Rota protegida — redireciona para /login se não autenticado
function PrivateRoute({ children }) {
  const { user, loading } = useUser()
  if (loading) return <div style={{ minHeight:'100vh', background:'#09090f' }}/>
  return user ? children : <Navigate to="/login" replace/>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"        element={<Landing/>}/>
      <Route path="/login"   element={<Login/>}/>
      <Route path="/cadastro" element={<Cadastro/>}/>

      <Route path="/mapa"    element={<PrivateRoute><Mapa/></PrivateRoute>}/>
      <Route path="/perfil"  element={<PrivateRoute><Perfil/></PrivateRoute>}/>

      <Route path="/modulo1/teoria"     element={<PrivateRoute><TeoriaM1/></PrivateRoute>}/>
      <Route path="/modulo1/exercicios" element={<PrivateRoute><ExerciciosM1/></PrivateRoute>}/>
      <Route path="/modulo1/resultado"  element={<PrivateRoute><ResultadoM1/></PrivateRoute>}/>

      <Route path="/modulo2/teoria"     element={<PrivateRoute><TeoriaM2/></PrivateRoute>}/>
      <Route path="/modulo2/exercicios" element={<PrivateRoute><ExerciciosM2/></PrivateRoute>}/>
      <Route path="/modulo2/resultado"  element={<PrivateRoute><ResultadoM2/></PrivateRoute>}/>

      <Route path="/modulo3/teoria"     element={<PrivateRoute><TeoriaM3/></PrivateRoute>}/>
      <Route path="/modulo3/exercicios" element={<PrivateRoute><ExerciciosM3/></PrivateRoute>}/>
      <Route path="/modulo3/resultado"  element={<PrivateRoute><ResultadoM3/></PrivateRoute>}/>

      <Route path="/modulo4"            element={<PrivateRoute><IntroM4/></PrivateRoute>}/>
      <Route path="/modulo4/quiz"       element={<PrivateRoute><QuizM4/></PrivateRoute>}/>
      <Route path="/modulo4/resultado"  element={<PrivateRoute><ResultadoM4/></PrivateRoute>}/>

      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes/>
      </UserProvider>
    </BrowserRouter>
  )
}
