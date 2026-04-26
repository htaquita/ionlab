import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import FeedbackBar from '../../components/FeedbackBar'
import ProgressDots from '../../components/ProgressDots'

const EX1_ELEMS = [
  { sym:'Na', name:'Sódio',    type:'cation' },
  { sym:'Cl', name:'Cloro',    type:'anion'  },
  { sym:'Ca', name:'Cálcio',   type:'cation' },
  { sym:'O',  name:'Oxigênio', type:'anion'  },
  { sym:'K',  name:'Potássio', type:'cation' },
  { sym:'S',  name:'Enxofre',  type:'anion'  },
]

const QUESTIONS = [
  {
    question: 'O íon Mg²⁺ é formado quando o magnésio...',
    hint: 'Magnésio é um metal do Grupo IIA com distribuição [2, 8, 2].',
    opts: ['Ganha 2 elétrons', 'Perde 2 elétrons', 'Ganha 2 prótons', 'Perde 2 prótons'],
    correct: 1,
    feedbackOk:  'Correto! Mg é metal (Grupo IIA) e perde os 2 elétrons da camada de valência, formando o cátion Mg²⁺ com carga +2.',
    feedbackErr: 'Metais perdem elétrons — não ganham. O Mg tem 2 elétrons na última camada e os perde para formar Mg²⁺ (cátion, carga positiva).',
  },
  {
    question: 'Qual dos seguintes é um ânion?',
    hint: 'Ânions têm carga negativa — são formados por ametais que ganham elétrons.',
    opts: ['Na⁺', 'Ca²⁺', 'Cl⁻', 'K⁺'],
    correct: 2,
    feedbackOk:  'Correto! Cl⁻ é o único com carga negativa. O cloro (Grupo VIIA) ganhou 1 elétron para completar o octeto, formando o ânion Cl⁻.',
    feedbackErr: 'Ânions têm carga negativa (sinal −). Na⁺, Ca²⁺ e K⁺ são cátions (carga positiva). Apenas Cl⁻ é ânion — o cloro ganhou 1 elétron.',
  },
]

// ── Ex1: Drag & Drop ─────────────────────────────────────────────────────────
function Ex1({ onNext }) {
  const [placed, setPlaced]   = useState({ cation:[], anion:[] })
  const [feedback, setFeedback] = useState(null)
  const [verified, setVerified] = useState(false)
  const [acertou, setAcertou]   = useState(false)
  const dragElem = useRef(null)
  const allPlaced = placed.cation.length + placed.anion.length === EX1_ELEMS.length

  function onDrop(zone) {
    const sym = dragElem.current
    if (!sym || placed.cation.includes(sym) || placed.anion.includes(sym)) return
    setPlaced(p => ({ ...p, [zone]: [...p[zone], sym] }))
    dragElem.current = null
  }

  function remove(sym, zone) {
    if (verified) return
    setPlaced(p => ({ ...p, [zone]: p[zone].filter(s => s !== sym) }))
    setFeedback(null)
  }

  function verify() {
    let correct = 0
    EX1_ELEMS.forEach(e => {
      if ((placed.cation.includes(e.sym) && e.type === 'cation') ||
          (placed.anion.includes(e.sym)  && e.type === 'anion')) correct++
    })
    const ok = correct === EX1_ELEMS.length
    setVerified(true)
    setAcertou(ok)
    if (ok) {
      setFeedback({ type:'ok', msg:'Perfeito! Todos classificados corretamente. Metais (Na, Ca, K) → cátions (+). Ametais (Cl, O, S) → ânions (−). +10 XP' })
    } else {
      const erros = EX1_ELEMS.filter(e => {
        const zone = placed.cation.includes(e.sym) ? 'cation' : 'anion'
        return zone !== e.type
      }).map(e => e.sym).join(', ')
      setFeedback({ type:'er', msg:`${EX1_ELEMS.length - correct} elemento(s) no lugar errado: ${erros}. Metais (lado esquerdo da tabela) formam cátions; ametais (lado direito) formam ânions.` })
    }
  }

  function getItemStyle(sym) {
    if (!verified) return {}
    const zone = placed.cation.includes(sym) ? 'cation' : 'anion'
    const ok = EX1_ELEMS.find(e => e.sym === sym)?.type === zone
    return ok
      ? { background:'rgba(62,232,196,0.12)',  color:'#3ee8c4', borderColor:'rgba(62,232,196,0.3)' }
      : { background:'rgba(248,113,113,0.12)', color:'#f87171', borderColor:'rgba(248,113,113,0.3)', animation:'shake 0.3s ease' }
  }

  return (
    <div>
      <h2 style={s.exTitle}>Classifique os Elementos</h2>
      <p style={s.exSub}>Arraste cada elemento para a coluna correta — cátion (+) ou ânion (−)</p>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:'1.5rem', minHeight:60 }}>
        {EX1_ELEMS.map(e => {
          const used = placed.cation.includes(e.sym) || placed.anion.includes(e.sym)
          return (
            <div key={e.sym} draggable={!used && !verified} onDragStart={() => { dragElem.current = e.sym }}
              style={{ background:'#1d1d28', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', cursor: used?'default':'grab', opacity: used?0.2:1, display:'flex', flexDirection:'column', alignItems:'center', userSelect:'none' }}>
              <span style={{ fontSize:20, fontWeight:800 }}>{e.sym}</span>
              <span style={{ fontSize:10, color:'#8888aa', marginTop:2 }}>{e.name}</span>
            </div>
          )
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:'1rem' }}>
        {[
          { zone:'cation', label:'Cátion (+)', bc:'rgba(240,167,66,0.28)', bg:'rgba(240,167,66,0.08)', color:'#f0a742' },
          { zone:'anion',  label:'Ânion (−)',  bc:'rgba(62,232,196,0.27)',  bg:'rgba(62,232,196,0.06)',  color:'#3ee8c4' },
        ].map(({ zone, label, bc, bg, color }) => (
          <div key={zone} onDragOver={e=>e.preventDefault()} onDrop={() => onDrop(zone)}
            style={{ border:`2px dashed ${bc}`, borderRadius:14, padding:'1.2rem', minHeight:110 }}
            onDragEnter={e => e.currentTarget.style.background='rgba(139,124,248,0.06)'}
            onDragLeave={e => e.currentTarget.style.background='transparent'}>
            <div style={{ fontSize:14, fontWeight:700, color, marginBottom:10 }}>{label}</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', minHeight:32 }}>
              {placed[zone].map(sym => (
                <div key={sym} onClick={() => remove(sym, zone)}
                  style={{ padding:'5px 12px', borderRadius:8, fontSize:14, fontWeight:700, cursor: verified?'default':'pointer', border:'1px solid', background:bg, color, borderColor:bc, animation:'popIn 0.2s ease', ...getItemStyle(sym) }}>
                  {sym} {!verified && <span style={{ opacity:0.5, fontSize:11 }}>✕</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <FeedbackBar type={feedback?.type} message={feedback?.msg} />

      <div style={{ display:'flex', justifyContent:'center', marginTop:'1rem' }}>
        {!verified
          ? <button style={{ ...s.btnCheck, opacity: allPlaced?1:0.4 }} disabled={!allPlaced} onClick={verify}>
              Verificar
            </button>
          : <button style={s.btnNext} onClick={() => onNext(acertou)}>
              Próximo Exercício →
            </button>
        }
      </div>
    </div>
  )
}

// ── ExMC: Múltipla Escolha ────────────────────────────────────────────────────
function ExMC({ q, nextLabel, onNext }) {
  const [sel, setSel]           = useState(null)
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [acertou, setAcertou]   = useState(false)

  function verify() {
    const ok = sel === q.correct
    setVerified(true)
    setAcertou(ok)
    setFeedback({
      type: ok ? 'ok' : 'er',
      msg:  ok ? `${q.feedbackOk} +10 XP` : q.feedbackErr,
    })
  }

  function optStyle(i) {
    if (!verified) return sel === i ? { background:'rgba(139,124,248,0.12)', borderColor:'rgba(139,124,248,0.28)' } : {}
    if (i === q.correct) return { background:'rgba(62,232,196,0.1)',  borderColor:'rgba(62,232,196,0.3)',  color:'#3ee8c4' }
    if (i === sel)       return { background:'rgba(248,113,113,0.08)', borderColor:'rgba(248,113,113,0.3)', color:'#f87171' }
    return {}
  }

  return (
    <div>
      <h2 style={s.exTitle}>{q.question}</h2>
      <p style={s.exSub}>{q.hint}</p>

      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:'1rem' }}>
        {q.opts.map((opt, i) => (
          <button key={i} disabled={verified} onClick={() => setSel(i)}
            style={{ padding:'13px 18px', background:'#1d1d28', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:12, color:'#ededfc', fontSize:14, textAlign:'left', cursor: verified?'default':'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s', ...optStyle(i) }}>
            <span style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}
      </div>

      <FeedbackBar type={feedback?.type} message={feedback?.msg} />

      <div style={{ display:'flex', justifyContent:'center', marginTop:'1rem' }}>
        {!verified
          ? <button style={{ ...s.btnCheck, opacity: sel !== null ? 1 : 0.4 }} disabled={sel === null} onClick={verify}>
              Verificar
            </button>
          : <button style={s.btnNext} onClick={() => onNext(acertou)}>
              {nextLabel}
            </button>
        }
      </div>
    </div>
  )
}

// ── Principal ─────────────────────────────────────────────────────────────────
export default function Exercicios() {
  const navigate   = useNavigate()
  const { addXP, setProgress } = useUser()
  const [exAtual, setExAtual]  = useState(0)
  const [score, setScore]      = useState(0)
  const startTime = useRef(Date.now())

  // chamado quando o aluno clica em "Próximo" — recebe se acertou
  function goNext(acertou) {
    if (acertou) { setScore(s => s + 1); addXP(10) }
    if (exAtual < 2) {
      setExAtual(e => e + 1)
    } else {
      setProgress('m1', 100)
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000)
      navigate('/modulo1/resultado', {
        state: { score: score + (acertou ? 1 : 0), total: 3, time: elapsed },
      })
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
        <div style={s.card}>
          {exAtual === 0 && <Ex1  onNext={goNext} />}
          {exAtual === 1 && <ExMC key="q1" q={QUESTIONS[0]} nextLabel="Próximo Exercício →" onNext={goNext} />}
          {exAtual === 2 && <ExMC key="q2" q={QUESTIONS[1]} nextLabel="Ver Resultado →"     onNext={goNext} />}
        </div>
      </div>
    </>
  )
}

const s = {
  card:     { background:'#17171f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'2rem', margin:'1rem auto 2rem', width:'100%', maxWidth:680 },
  exTitle:  { fontSize:20, fontWeight:700, marginBottom:6 },
  exSub:    { fontSize:14, color:'#8888aa', marginBottom:'1.5rem' },
  btnCheck: { padding:'13px 36px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' },
  btnNext:  { padding:'13px 36px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' },
}
