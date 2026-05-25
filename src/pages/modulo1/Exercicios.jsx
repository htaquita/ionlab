import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import ProgressDots from '../../components/ProgressDots'
import { ExercicioMC, ExercicioDnD } from '../../components/ExerciciosBase'
import { fetchQuestoes } from '../../lib/questoesService'

const TEMA_IDS = [1, 2, 3]
const TOTAL_Q  = 10
const MIN_DND  = 2

export default function Exercicios() {
  const navigate = useNavigate()
  const { addXP, setProgress } = useUser()

  const [questoes, setQuestoes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [erro, setErro]         = useState(null)
  const [atual, setAtual]       = useState(0)
  const [score, setScore]       = useState(0)
  const startTime = useRef(Date.now())

  useEffect(() => {
    fetchQuestoes(TEMA_IDS, TOTAL_Q, MIN_DND)
      .then(qs => { setQuestoes(qs); setLoading(false) })
      .catch(e  => { setErro(e.message); setLoading(false) })
  }, [])

  function goNext(acertou) {
    const novoScore = score + (acertou ? 1 : 0)
    if (acertou) { setScore(novoScore); addXP(10) }
    if (atual < questoes.length - 1) {
      setAtual(a => a + 1)
    } else {
      const aprovado = novoScore / questoes.length >= 0.8
      if (aprovado) setProgress('m1', 100)
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
      navigate('/modulo1/resultado', {
        state: { score: novoScore, total: questoes.length, time: elapsed },
      })
    }
  }

  if (loading) return (
    <><Background/><Navbar/>
      <div style={s.center}>
        <div style={s.spin}/>
        <p style={{ color:'#64748b', fontSize:14 }}>Carregando exercícios...</p>
      </div>
    </>
  )

  if (erro) return (
    <><Background/><Navbar/>
      <div style={s.center}>
        <p style={{ color:'#fca5a5', fontSize:14 }}>Erro: {erro}</p>
        <button onClick={() => window.location.reload()} style={s.btnR}>Tentar novamente</button>
      </div>
    </>
  )

  const q      = questoes[atual]
  const isLast = atual === questoes.length - 1

  return (
    <><Background/><Navbar/>
      <div style={{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
        <div style={{ padding:'1.5rem 2rem 0', display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
          <ProgressDots total={questoes.length} current={atual}/>
        </div>
        <div style={s.card}>
          {q?.tipo === 'mc'
            ? <ExercicioMC  key={q.id} questao={q} nextLabel={isLast?'Ver Resultado →':'Próximo →'} onNext={goNext}/>
            : <ExercicioDnD key={q.id} questao={q} nextLabel={isLast?'Ver Resultado →':'Próximo →'} onNext={goNext}/>
          }
        </div>
      </div>
    </>
  )
}

const s = {
  card:  { background:'#111c30', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'2rem', margin:'1rem auto 2rem', width:'100%', maxWidth:680 },
  center:{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', gap:16, position:'relative', zIndex:1 },
  spin:  { width:32, height:32, borderRadius:'50%', border:'3px solid rgba(59,130,246,0.2)', borderTopColor:'#3b82f6', animation:'spin 0.8s linear infinite' },
  btnR:  { padding:'10px 24px', background:'#3b82f6', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, fontWeight:600 },
}
