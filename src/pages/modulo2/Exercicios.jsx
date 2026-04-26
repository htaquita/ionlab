import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import FeedbackBar from '../../components/FeedbackBar'
import ProgressDots from '../../components/ProgressDots'
import { atomSVG } from '../../utils/drawAtom'

function AtomDiagram({ sym, layers, type, size=110 }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.innerHTML = atomSVG(sym, layers, type, size, size) }, [sym, layers, type, size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
}

const QUESTIONS = [
  {
    question: 'Na formação do CaO (óxido de cálcio), quantos elétrons o cálcio transfere para o oxigênio?',
    hint: 'Distribuição do Ca: Z=20, [2, 8, 8, 2] — quantos elétrons estão na última camada?',
    opts: ['1 elétron', '2 elétrons', '3 elétrons', '4 elétrons'],
    correct: 1,
    feedbackOk:  'Correto! O Ca tem 2 elétrons na camada de valência [2,8,8,2]. Transfere ambos para o O, formando Ca²⁺ e O²⁻, que se atraem e formam o CaO.',
    feedbackErr: 'O Ca tem distribuição [2,8,8,2] — 2 elétrons na última camada. Ele perde esses 2 para o O, formando Ca²⁺ (+2) e O²⁻ (−2).',
  },
  {
    question: 'O que ocorre na formação do KF (fluoreto de potássio)?',
    hint: 'K tem distribuição [2,8,8,1] e F tem [2,7]. Analise as camadas de valência.',
    opts: [
      'O flúor perde 1 elétron para o potássio',
      'O potássio e o flúor compartilham elétrons',
      'O potássio perde 1 elétron para o flúor, formando K⁺ e F⁻',
      'O potássio ganha 1 elétron do flúor',
    ],
    correct: 2,
    feedbackOk:  'Correto! K tem 1 elétron de valência e o transfere ao F, que precisa de 1 para completar 8. Ambos ficam estáveis: K⁺ e F⁻ formam a ligação iônica KF.',
    feedbackErr: 'K é metal (Grupo IA) — perde elétrons. F é ametal (Grupo VIIA) — ganha elétrons. O K transfere 1 e⁻ para o F, formando K⁺ e F⁻.',
  },
]

function Ex1({ onComplete }) {
  const [dropped, setDropped] = useState(false)
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const dragging = useRef(false)

  const naLayers = dropped ? [2,8]   : [2,8,1]
  const clLayers = dropped ? [2,8,8] : [2,8,7]

  function verify() {
    setVerified(true)
    setFeedback({ type:'ok', msg:'Correto! O Na perdeu 1 elétron (formou Na⁺) e o Cl ganhou esse elétron (formou Cl⁻). A atração entre Na⁺ e Cl⁻ forma a ligação iônica do NaCl. +10 XP' })
    onComplete(true)
  }

  return (
    <div>
      <h2 style={exTitle}>Faça a Transferência</h2>
      <p style={exSub}>O sódio (Na) precisa perder 1 elétron para o cloro (Cl). Arraste o elétron da camada de valência do Na para a zona de recepção do Cl.</p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'2rem', padding:'1rem 0', flexWrap:'wrap' }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <AtomDiagram sym="Na" layers={naLayers} type="metal" size={110}/>
          <span style={{ fontSize:13, color:'#8888aa' }}>Na (11 elétrons)</span>
          {!dropped
            ? <div draggable onDragStart={()=>{dragging.current=true}} onDragEnd={()=>{dragging.current=false}}
                style={{ width:28, height:28, borderRadius:'50%', background:'#f0a742', border:'2px solid rgba(240,167,66,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#09090f', cursor:'grab', userSelect:'none' }}>e⁻</div>
            : <div style={{ width:28, height:28, borderRadius:'50%', opacity:0.2, border:'2px solid #f0a742' }}/>
          }
          {dropped && <span style={{ fontSize:15, fontWeight:800, color:'#f0a742', animation:'popIn 0.3s ease' }}>Na⁺</span>}
        </div>
        <div style={{ fontSize:28, color:'#4a4a68' }}>→</div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
          <div onDragOver={e=>e.preventDefault()} onDrop={()=>{ if(dragging.current&&!dropped){ setDropped(true); dragging.current=false }}}
            style={{ width:70, height:52, border:`2px dashed ${dropped?'rgba(62,232,196,0.4)':'rgba(62,232,196,0.3)'}`, borderRadius:12, background: dropped?'rgba(62,232,196,0.08)':'rgba(62,232,196,0.05)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
            {dropped
              ? <div style={{ width:20, height:20, borderRadius:'50%', background:'#3ee8c4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#09090f', animation:'popIn 0.2s ease' }}>e⁻</div>
              : <span style={{ fontSize:11, color:'#4a4a68', textAlign:'center' }}>solte aqui</span>
            }
          </div>
          <AtomDiagram sym="Cl" layers={clLayers} type="nonmetal" size={110}/>
          <span style={{ fontSize:13, color:'#8888aa' }}>Cl (17 elétrons)</span>
          {dropped && <span style={{ fontSize:15, fontWeight:800, color:'#3ee8c4', animation:'popIn 0.3s ease' }}>Cl⁻</span>}
        </div>
      </div>
      <FeedbackBar type={feedback?.type} message={feedback?.msg} />
      <div style={{ display:'flex', justifyContent:'center', marginTop:'1rem' }}>
        {!verified
          ? <button style={{ ...btnCheck, opacity: dropped?1:0.4 }} disabled={!dropped} onClick={verify}>Verificar</button>
          : <button style={btnNext} onClick={() => onComplete(true)}>Próximo Exercício →</button>
        }
      </div>
    </div>
  )
}

function ExMC({ q, isLast, onComplete }) {
  const [sel, setSel] = useState(null)
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)

  function verify() {
    setVerified(true)
    const ok = sel === q.correct
    setFeedback({ type: ok?'ok':'er', msg: ok ? `${q.feedbackOk} +10 XP` : q.feedbackErr })
    if (ok) onComplete(true)
  }

  function optStyle(i) {
    if (!verified) return sel===i ? { background:'rgba(139,124,248,0.12)', borderColor:'rgba(139,124,248,0.28)' } : {}
    if (i===q.correct) return { background:'rgba(62,232,196,0.1)',  borderColor:'rgba(62,232,196,0.3)',  color:'#3ee8c4' }
    if (i===sel)       return { background:'rgba(248,113,113,0.08)', borderColor:'rgba(248,113,113,0.3)', color:'#f87171' }
    return {}
  }

  return (
    <div>
      <h2 style={exTitle}>{q.question}</h2>
      <p style={exSub}>{q.hint}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:'1rem' }}>
        {q.opts.map((opt,i) => (
          <button key={i} disabled={verified} onClick={()=>setSel(i)}
            style={{ padding:'13px 18px', background:'#1d1d28', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#ededfc', fontSize:14, textAlign:'left', cursor: verified?'default':'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s', ...optStyle(i) }}>
            <span style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>{String.fromCharCode(65+i)}</span>
            {opt}
          </button>
        ))}
      </div>
      <FeedbackBar type={feedback?.type} message={feedback?.msg} />
      <div style={{ display:'flex', justifyContent:'center', marginTop:'1rem' }}>
        {!verified
          ? <button style={{ ...btnCheck, opacity: sel!==null?1:0.4 }} disabled={sel===null} onClick={verify}>Verificar</button>
          : <button style={btnNext} onClick={() => onComplete(true)}>{isLast ? 'Ver Resultado →' : 'Próximo Exercício →'}</button>
        }
      </div>
    </div>
  )
}

export default function Exercicios() {
  const navigate = useNavigate()
  const { addXP, setProgress } = useUser()
  const [exAtual, setExAtual] = useState(0)
  const [score, setScore] = useState(0)
  const startTime = useRef(Date.now())

  function goNext(acertou) {
    if (acertou) { setScore(s=>s+1); addXP(10) }
    if (exAtual < 2) setExAtual(e=>e+1)
    else {
      setProgress('m2', 100)
      const elapsed = Math.floor((Date.now()-startTime.current)/1000)
      navigate('/modulo2/resultado', { state:{ score: score+(acertou?1:0), total:3, time:elapsed } })
    }
  }

  return (
    <>
      <Background />
      <Navbar />
      <div style={{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
        <div style={{ padding:'1.5rem 2rem 0', display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
          <ProgressDots total={3} current={exAtual} />
        </div>
        <div style={card}>
          {exAtual===0 && <Ex1 onComplete={ok=>goNext(ok)} />}
          {exAtual===1 && <ExMC key="q1" q={QUESTIONS[0]} isLast={false} onComplete={ok=>goNext(ok)} />}
          {exAtual===2 && <ExMC key="q2" q={QUESTIONS[1]} isLast={true}  onComplete={ok=>goNext(ok)} />}
        </div>
      </div>
    </>
  )
}

const card    = { background:'#17171f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'2rem', margin:'1rem auto 2rem', width:'100%', maxWidth:680 }
const exTitle = { fontSize:20, fontWeight:700, marginBottom:6 }
const exSub   = { fontSize:14, color:'#8888aa', marginBottom:'1.5rem' }
const btnCheck = { padding:'13px 36px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
const btnNext  = { padding:'13px 36px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }
