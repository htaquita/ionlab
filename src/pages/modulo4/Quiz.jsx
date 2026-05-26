import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { supabase } from '../../lib/supabase'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import FeedbackBar from '../../components/FeedbackBar'
import { fetchQuestoes } from '../../lib/questoesService'

// Fases do quiz — temas 8, 9, 10
const FASES = [
  { fase:1, temaId:8,  label:'Fase 1 — Identificação', total:3, minDnd:1, cor:'#fb923c', bg:'rgba(251,146,60,0.1)',  border:'rgba(251,146,60,0.3)'  },
  { fase:2, temaId:9,  label:'Fase 2 — Ligações',       total:3, minDnd:1, cor:'#38bdf8', bg:'rgba(56,189,248,0.1)',  border:'rgba(56,189,248,0.28)' },
  { fase:3, temaId:10, label:'Fase 3 — Boss ⚡',         total:4, minDnd:1, cor:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.28)'},
]

function DnDQuestion({ q, onAnswer, answered }) {
  const [placed, setPlaced] = useState({ cation:[], anion:[] })
  const dragging = useRef(null)
  const elems = q.elemento_dnd || []
  const allPlaced = placed.cation.length + placed.anion.length === elems.length

  useEffect(() => { if (allPlaced && !answered) onAnswer(placed) }, [placed])

  function drop(zone) {
    const id = dragging.current
    if (!id || placed.cation.includes(id) || placed.anion.includes(id)) return
    setPlaced(p => ({ ...p, [zone]: [...p[zone], id] }))
    dragging.current = null
  }

  return (
    <div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1rem', minHeight:52 }}>
        {elems.map(e => {
          const used = placed.cation.includes(e.id) || placed.anion.includes(e.id)
          return (
            <div key={e.id} draggable={!used && !answered} onDragStart={() => { dragging.current = e.id }}
              style={{ background:'#0d1525', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 16px', cursor:used?'default':'grab', opacity:used?0.2:1, display:'flex', flexDirection:'column', alignItems:'center', userSelect:'none' }}>
              <span style={{ fontSize:18, fontWeight:800 }}>{e.simbolo}</span>
              <span style={{ fontSize:10, color:'#64748b', marginTop:2 }}>{e.nome}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {[
          { zone:'cation', label:'Cátion (+)', bc:'rgba(251,146,60,0.3)', bg:'rgba(251,146,60,0.06)', color:'#fb923c' },
          { zone:'anion',  label:'Ânion (−)',  bc:'rgba(56,189,248,0.28)',bg:'rgba(56,189,248,0.06)',  color:'#38bdf8' },
        ].map(({ zone, label, bc, bg, color }) => (
          <div key={zone} onDragOver={e=>e.preventDefault()} onDrop={()=>drop(zone)}
            onDragEnter={e=>e.currentTarget.style.background='rgba(59,130,246,0.06)'}
            onDragLeave={e=>e.currentTarget.style.background='transparent'}
            style={{ border:`2px dashed ${bc}`, borderRadius:12, padding:'1rem', minHeight:80 }}>
            <div style={{ fontSize:12, fontWeight:700, color, marginBottom:8 }}>{label}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {placed[zone].map(id => {
                const e = elems.find(x => x.id === id)
                return <div key={id} style={{ padding:'5px 12px', borderRadius:8, fontSize:13, fontWeight:700, background:bg, color, border:`1px solid ${bc}`, animation:'popIn 0.15s ease' }}>{e?.simbolo}</div>
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Quiz() {
  const navigate = useNavigate()
  const { user, addXP, setProgress } = useUser()

  const [questoes, setQuestoes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [curQ, setCurQ]           = useState(0)
  const [faseAtual, setFaseAtual] = useState(0)
  const [score, setScore]         = useState(0)
  const [bonusXP, setBonusXP]     = useState(0)
  const [totalXP, setTotalXP]     = useState(0)
  const [timeLeft, setTimeLeft]   = useState(20)
  const [answered, setAnswered]   = useState(false)
  const [selOpt, setSelOpt]       = useState(null)
  const [dndAnswer, setDndAnswer] = useState(null)
  const [feedback, setFeedback]   = useState(null)
  const [timeOut, setTimeOut]     = useState(false)
  const timerRef  = useRef(null)
  const startTime = useRef(Date.now())
  const quizStart = useRef(Date.now())

  // Carregar questões de todas as fases
  useEffect(() => {
    async function load() {
      try {
        const all = []
        for (const f of FASES) {
          const qs = await fetchQuestoes([f.temaId], f.total, f.minDnd)
          all.push(...qs.map(q => ({ ...q, _fase: f.fase })))
        }
        setQuestoes(all)
      } catch(e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const q = questoes[curQ]

  // Determinar fase atual
  useEffect(() => {
    if (!q) return
    const f = FASES.findIndex(f => f.fase === q?._fase)
    if (f >= 0) setFaseAtual(f)
  }, [curQ, q])

  // Timer
  useEffect(() => {
    if (loading || !q) return
    setTimeLeft(20)
    startTime.current = Date.now()
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleTimeOut()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [curQ, loading])

  function handleTimeOut() {
    setAnswered(true)
    setTimeOut(true)
    setFeedback({ type:'er', msg:`⏱ Tempo esgotado! ${q.feedback_incorreto}` })
  }

  function calcBonus() {
    const tLeft = Math.floor((startTime.current + 20000 - Date.now()) / 1000)
    return tLeft >= 15 ? 20 : tLeft >= 10 ? 10 : 0
  }

  async function salvarResposta(acertou) {
    if (!user) return
    try {
      // Cria ou recupera sessão do quiz
      const { data: sessao } = await supabase
        .from('sessao_exercicio')
        .insert({ usuario_id:user.id, tema_id:q.tema_id, total_questoes:questoes.length, concluida:false })
        .select().single()
      if (sessao) {
        await supabase.from('resposta').insert({
          sessao_id: sessao.id,
          questao_id: q.id,
          acertou,
          tentativas: 1,
          tempo_segundos: 20 - timeLeft,
        })
      }
    } catch(e) { console.error('Erro ao salvar resposta:', e) }
  }

  function checkMC() {
    clearInterval(timerRef.current)
    const ok = selOpt === q.opcao_mc?.findIndex(o => o.is_correta)
    const bonus = ok ? calcBonus() : 0
    const xp = (FASES[faseAtual]?.fase * 10) + (ok ? 30 + bonus : 0)
    setAnswered(true)
    if (ok) { setScore(s=>s+1); setBonusXP(b=>b+bonus); setTotalXP(t=>t+xp); addXP(xp) }
    setFeedback({ type:ok?'ok':'er', msg: ok ? `${q.feedback_correto}${bonus>0?` · Bônus: +${bonus} XP`:''}` : q.feedback_incorreto })
    salvarResposta(ok)
  }

  function checkDnD() {
    clearInterval(timerRef.current)
    const elems = q.elemento_dnd || []
    const ok = elems.every(e => {
      const zone = dndAnswer?.cation?.includes(e.id) ? 'cation' : 'anion'
      return zone === e.categoria_correta
    })
    const bonus = ok ? calcBonus() : 0
    const xp = (FASES[faseAtual]?.fase * 10) + (ok ? 40 + bonus : 0)
    setAnswered(true)
    if (ok) { setScore(s=>s+1); setBonusXP(b=>b+bonus); setTotalXP(t=>t+xp); addXP(xp) }
    setFeedback({ type:ok?'ok':'er', msg: ok ? `${q.feedback_correto}${bonus>0?` · Bônus: +${bonus} XP`:''}` : q.feedback_incorreto })
    salvarResposta(ok)
  }

  function nextQuestion() {
    if (curQ >= questoes.length - 1) {
      setProgress('m4', 100)
      const elapsed = Math.floor((Date.now() - quizStart.current) / 1000)
      navigate('/modulo4/resultado', {
        state: { score, total:questoes.length, time:elapsed, bonusXP, totalXP }
      })
      return
    }
    setCurQ(c => c + 1)
    setAnswered(false)
    setTimeOut(false)
    setSelOpt(null)
    setDndAnswer(null)
    setFeedback(null)
  }

  function optStyle(i) {
    if (!answered) return selOpt===i ? { background:'rgba(59,130,246,0.12)', borderColor:'rgba(59,130,246,0.4)' } : {}
    const correta = q.opcao_mc?.findIndex(o => o.is_correta)
    if (i === correta) return { background:'rgba(134,239,172,0.1)', borderColor:'rgba(134,239,172,0.35)', color:'#86efac' }
    if (i === selOpt)  return { background:'rgba(252,165,165,0.08)', borderColor:'rgba(252,165,165,0.3)', color:'#fca5a5' }
    return {}
  }

  if (loading) return (
    <><Background/><Navbar/>
      <div style={{ paddingTop:56, display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', flexDirection:'column', gap:16, position:'relative', zIndex:1 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid rgba(59,130,246,0.2)', borderTopColor:'#3b82f6', animation:'spin 0.8s linear infinite' }}/>
        <p style={{ color:'#64748b', fontSize:14 }}>Preparando o desafio...</p>
      </div>
    </>
  )

  if (!q) return null
  const fase = FASES[faseAtual]
  const canVerify = q.tipo==='mc' ? selOpt!==null&&!answered : dndAnswer!==null&&!answered

  return (
    <><Background/><Navbar/>
      <div style={{ paddingTop:56, display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* Header */}
        <div style={{ padding:'1.2rem 2rem 0', display:'flex', flexDirection:'column', alignItems:'center', gap:10, width:'100%', maxWidth:700 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, width:'100%' }}>
            <span style={{ fontSize:13, fontWeight:700, color:'#94a3b8', whiteSpace:'nowrap' }}>{curQ+1} / {questoes.length}</span>
            <div style={{ flex:1, height:8, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#3b82f6', borderRadius:99, width:`${((curQ+1)/questoes.length)*100}%`, transition:'width 0.4s ease' }}/>
            </div>
            <span style={{ padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', background:fase.bg, border:`1px solid ${fase.border}`, color:fase.cor }}>
              {fase.label}
            </span>
          </div>

          {/* Timer */}
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:18, fontWeight:800, color: timeLeft<=5?'#fca5a5':'#f59e0b', animation:timeLeft<=5?'pulse 0.5s infinite':'none' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            {timeLeft}s
          </div>
        </div>

        {/* Card da questão */}
        <div style={{ background:'#111c30', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'2rem', margin:'1rem auto 0.8rem', width:'100%', maxWidth:700 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#475569', marginBottom:10 }}>
            {q.tipo==='dnd' ? 'Arrastar e soltar' : 'Múltipla escolha'}
          </div>
          <h2 style={{ fontSize:18, fontWeight:700, marginBottom:6, lineHeight:1.4, color:'#e2e8f8' }}>{q.enunciado}</h2>
          <p style={{ fontSize:13, color:'#64748b', marginBottom:'1.5rem', lineHeight:1.5 }}>{q.dica}</p>

          {q.tipo==='mc' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.opcao_mc?.map((opt,i) => (
                <button key={opt.id} disabled={answered} onClick={()=>setSelOpt(i)}
                  style={{ padding:'13px 18px', background:'#0d1525', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:12, color:'#e2e8f8', fontSize:14, textAlign:'left', cursor:answered?'default':'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s', ...optStyle(i) }}>
                  <span style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, color:'#64748b' }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  {opt.texto}
                </button>
              ))}
            </div>
          )}

          {q.tipo==='dnd' && (
            <DnDQuestion q={q} onAnswer={setDndAnswer} answered={answered}/>
          )}
        </div>

        {feedback && (
          <div style={{ width:'100%', maxWidth:700, margin:'0 auto 0.8rem' }}>
            <FeedbackBar type={feedback.type} message={feedback.msg}/>
          </div>
        )}

        <div style={{ display:'flex', justifyContent:'center', gap:12, padding:'0.8rem 0 2rem' }}>
          {!answered
            ? <button disabled={!canVerify} onClick={q.tipo==='mc'?checkMC:checkDnD}
                style={{ padding:'13px 36px', background:'#3b82f6', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer', opacity:canVerify?1:0.4 }}>
                Verificar
              </button>
            : <button onClick={nextQuestion}
                style={{ padding:'13px 36px', background:'#3b82f6', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' }}>
                {curQ < questoes.length-1 ? 'Próxima →' : 'Ver Resultado →'}
              </button>
          }
        </div>

      </div>
    </>
  )
}
