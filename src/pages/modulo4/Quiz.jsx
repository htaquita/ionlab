import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import FeedbackBar from '../../components/FeedbackBar'
import { QUIZ_QUESTIONS } from '../../data/elements'

const PHASE_LABELS = ['Fase 1 — Identificação', 'Fase 2 — Ligações', 'Fase 3 — Boss ⚡']
const PHASE_CLASSES = [
  { bg:'var(--orange-dim)', border:'var(--orange-border)', color:'var(--orange)' },
  { bg:'var(--blue-dim)',   border:'var(--blue-border)',   color:'var(--blue)'   },
  { bg:'var(--purple-dim)', border:'var(--purple-border)', color:'var(--purple)' },
]

// ── Drag & Drop question ────────────────────────────────────────────────────
function DnDQuestion({ q, onAnswer }) {
  const [placed, setPlaced] = useState({ cat:[], ani:[] })
  const dragging = useRef(null)

  const allPlaced = placed.cat.length + placed.ani.length === q.elems.length

  function drop(zone) {
    const sym = dragging.current
    if (!sym) return
    if (placed.cat.includes(sym) || placed.ani.includes(sym)) return
    setPlaced(p => ({ ...p, [zone]: [...p[zone], sym] }))
    dragging.current = null
  }

  function remove(sym, zone) {
    setPlaced(p => ({ ...p, [zone]: p[zone].filter(s => s !== sym) }))
  }

  useEffect(() => {
    if (allPlaced) onAnswer(placed)
  }, [placed])

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1rem', minHeight:50 }}>
        {q.elems.map(e => {
          const used = placed.cat.includes(e) || placed.ani.includes(e)
          return (
            <div key={e} draggable={!used} onDragStart={() => { dragging.current = e }}
              style={{ background:'var(--card2)', border:'1.5px solid var(--border2)', borderRadius:9, padding:'8px 14px', cursor: used?'default':'grab', fontSize:14, fontWeight:700, opacity: used?0.2:1, userSelect:'none', transition:'opacity 0.2s' }}>
              {e}
            </div>
          )
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {[{ zone:'cat', label:'Cátion (+)', border:'var(--orange-border)', color:'var(--orange)', bg:'var(--orange-dim)' },
          { zone:'ani', label:'Ânion (−)',  border:'var(--blue-border)',   color:'var(--blue)',   bg:'var(--blue-dim)'   }].map(({ zone, label, border, color, bg }) => (
          <div key={zone}
            onDragOver={e => e.preventDefault()}
            onDrop={() => drop(zone)}
            onDragEnter={e => e.currentTarget.style.background = 'rgba(78,205,196,0.06)'}
            onDragLeave={e => e.currentTarget.style.background = 'transparent'}
            style={{ border:`2px dashed ${border}`, borderRadius:12, padding:'1rem', minHeight:80, transition:'background 0.2s' }}>
            <div style={{ fontSize:12, fontWeight:700, color, marginBottom:8 }}>{label}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', minHeight:32 }}>
              {placed[zone].map(sym => (
                <div key={sym} onClick={() => remove(sym, zone)}
                  style={{ padding:'5px 12px', borderRadius:7, fontSize:13, fontWeight:700, cursor:'pointer', background:bg, color, border:`1px solid ${border}`, animation:'popIn 0.15s ease' }}>
                  {sym} <span style={{ opacity:0.5, fontSize:11 }}>✕</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function Quiz() {
  const navigate = useNavigate()
  const { addXP, setProgress } = useUser()

  const [curQ, setCurQ]         = useState(0)
  const [score, setScore]       = useState(0)
  const [bonusXP, setBonusXP]   = useState(0)
  const [totalXP, setTotalXP]   = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [answered, setAnswered] = useState(false)
  const [selOpt, setSelOpt]     = useState(null)
  const [dndAnswer, setDndAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [autoFailed, setAutoFailed] = useState(false)

  const timerRef  = useRef(null)
  const startTime = useRef(Date.now())
  const quizStart = useRef(Date.now())

  const q = QUIZ_QUESTIONS[curQ]
  const phaseIdx = q.phase - 1
  const phaseStyle = PHASE_CLASSES[phaseIdx]

  // Timer
  useEffect(() => {
    setTimeLeft(20)
    startTime.current = Date.now()
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleAutoFail()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [curQ])

  function handleAutoFail() {
    setAnswered(true)
    setAutoFailed(true)
    setFeedback({ type:'er', msg:`⏱ Tempo esgotado! ${q.explanation}` })
  }

  function checkMC() {
    clearInterval(timerRef.current)
    setAnswered(true)
    const ok = selOpt === q.correct
    const tLeft = Math.floor((startTime.current + 20000 - Date.now()) / 1000)
    const bonus = tLeft >= 15 ? 20 : tLeft >= 10 ? 10 : 0
    const earned = 30 + (q.phase * 10) + (ok ? bonus : 0)
    if (ok) {
      setScore(s => s + 1)
      setBonusXP(b => b + bonus)
      setTotalXP(t => t + earned)
      addXP(earned)
    }
    setFeedback({ type: ok?'ok':'er', msg: ok ? `✓ ${q.explanation}${bonus>0?' · Bônus de velocidade: +'+bonus+' XP':''}` : `✗ ${q.explanation}` })
  }

  function checkDnD() {
    clearInterval(timerRef.current)
    setAnswered(true)
    let allOk = true
    q.elems.forEach(e => {
      const inCat = dndAnswer?.cat?.includes(e)
      if (q.answers[e] !== (inCat ? 'cat' : 'ani')) allOk = false
    })
    const tLeft = Math.floor((startTime.current + 20000 - Date.now()) / 1000)
    const bonus = tLeft >= 15 ? 20 : tLeft >= 10 ? 10 : 0
    const earned = 40 + (allOk ? bonus : 0)
    if (allOk) {
      setScore(s => s + 1)
      setBonusXP(b => b + bonus)
      setTotalXP(t => t + earned)
      addXP(earned)
    }
    setFeedback({ type: allOk?'ok':'er', msg: allOk ? `✓ ${q.explanation}${bonus>0?' · Bônus: +'+bonus+' XP':''}` : `✗ ${q.explanation}` })
  }

  function nextQuestion() {
    if (curQ >= QUIZ_QUESTIONS.length - 1) {
      setProgress('m4', 100)
      const elapsed = Math.floor((Date.now() - quizStart.current) / 1000)
      navigate('/modulo4/resultado', {
        state: { score: score + (!answered || autoFailed ? 0 : selOpt === q.correct || dndAnswer ? 1 : 0), total: QUIZ_QUESTIONS.length, time: elapsed, bonusXP, totalXP }
      })
      return
    }
    setCurQ(c => c + 1)
    setAnswered(false)
    setAutoFailed(false)
    setSelOpt(null)
    setDndAnswer(null)
    setFeedback(null)
  }

  function optStyle(i) {
    if (!answered) return selOpt === i ? { background:'var(--purple-dim)', borderColor:'var(--purple-border)' } : {}
    if (i === q.correct) return { background:'rgba(94,234,212,0.12)', borderColor:'rgba(94,234,212,0.3)', color:'var(--green)' }
    if (i === selOpt)    return { background:'rgba(248,113,113,0.1)',  borderColor:'rgba(248,113,113,0.3)', color:'var(--red)' }
    return {}
  }

  const canVerifyMC  = selOpt !== null && !answered
  const canVerifyDnD = dndAnswer !== null && !answered

  return (
    <>
      <Background />
      <Navbar />
      <div style={{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ padding:'1.2rem 2rem 0', display:'flex', flexDirection:'column', alignItems:'center', gap:10, width:'100%', maxWidth:700 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'var(--text2)', whiteSpace:'nowrap' }}>{curQ + 1} / {QUIZ_QUESTIONS.length}</span>
            <div style={{ flex:1, height:8, background:'var(--border2)', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'var(--purple)', borderRadius:99, width:`${((curQ + 1) / QUIZ_QUESTIONS.length) * 100}%`, transition:'width 0.4s ease' }} />
            </div>
            <span style={{ padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', background:phaseStyle.bg, border:`1px solid ${phaseStyle.border}`, color:phaseStyle.color }}>
              {PHASE_LABELS[phaseIdx]}
            </span>
          </div>

          {/* Timer */}
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:15, fontWeight:700 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            <span style={{ fontSize:18, fontWeight:800, minWidth:40, textAlign:'center', color: timeLeft <= 5 ? 'var(--red)' : 'var(--gold)', animation: timeLeft <= 5 ? 'pulse 0.5s infinite' : 'none' }}>
              {timeLeft}
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border2)', borderRadius:20, padding:'2rem', margin:'1rem auto 0.8rem', width:'100%', maxWidth:700 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'var(--text3)', marginBottom:10 }}>
            {q.type === 'dnd' ? 'Arrastar e soltar' : 'Múltipla escolha'}
          </div>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:6, lineHeight:1.4 }}>{q.text}</h2>
          <p style={{ fontSize:13, color:'var(--text2)', marginBottom:'1.5rem', lineHeight:1.5 }}>{q.hint}</p>

          {q.type === 'mc' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.opts.map((opt, i) => (
                <button key={i} disabled={answered}
                  onClick={() => setSelOpt(i)}
                  style={{ padding:'13px 18px', background:'var(--card2)', border:'1.5px solid var(--border2)', borderRadius:12, color:'var(--text)', fontSize:14, textAlign:'left', cursor: answered?'default':'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s', ...optStyle(i) }}>
                  <span style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid var(--border2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {q.type === 'dnd' && (
            <DnDQuestion q={q} onAnswer={setDndAnswer} />
          )}
        </div>

        {feedback && (
          <div style={{ width:'100%', maxWidth:700, margin:'0 auto 0.8rem' }}>
            <FeedbackBar type={feedback.type} message={feedback.msg} />
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'center', gap:12, padding:'0.8rem 0 2rem' }}>
          {!answered ? (
            <button
              disabled={q.type === 'mc' ? !canVerifyMC : !canVerifyDnD}
              onClick={q.type === 'mc' ? checkMC : checkDnD}
              style={{ padding:'13px 36px', background:'var(--teal)', color:'#0a1628', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer', opacity: (q.type==='mc'?canVerifyMC:canVerifyDnD) ? 1 : 0.4 }}>
              Verificar
            </button>
          ) : (
            <button onClick={nextQuestion}
              style={{ padding:'13px 36px', background:'var(--teal)', color:'#0a1628', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }}>
              {curQ < QUIZ_QUESTIONS.length - 1 ? 'Próxima →' : 'Ver Resultado →'}
            </button>
          )}
        </div>

      </div>
    </>
  )
}
