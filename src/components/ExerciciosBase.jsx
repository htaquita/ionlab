import React, { useState, useRef } from 'react'
import FeedbackBar from '../components/FeedbackBar'

// ── Exercício de Múltipla Escolha ─────────────────────────────
export function ExercicioMC({ questao, nextLabel, onNext }) {
  const [sel, setSel]           = useState(null)
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [acertou, setAcertou]   = useState(false)

  const correta = questao.opcao_mc?.findIndex(o => o.is_correta)

  function verify() {
    const ok = sel === correta
    setVerified(true)
    setAcertou(ok)
    setFeedback({
      type: ok ? 'ok' : 'er',
      msg:  ok
        ? `${questao.feedback_correto} +10 XP`
        : questao.feedback_incorreto,
    })
  }

  function optStyle(i) {
    if (!verified) return sel === i
      ? { background:'rgba(59,130,246,0.12)', borderColor:'rgba(59,130,246,0.4)' }
      : {}
    if (i === correta) return { background:'rgba(134,239,172,0.1)', borderColor:'rgba(134,239,172,0.35)', color:'#86efac' }
    if (i === sel)     return { background:'rgba(252,165,165,0.08)', borderColor:'rgba(252,165,165,0.3)', color:'#fca5a5' }
    return {}
  }

  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#475569', marginBottom:8 }}>
        Múltipla escolha
      </div>
      <h2 style={{ fontSize:17, fontWeight:700, color:'#e2e8f8', marginBottom:6, lineHeight:1.4 }}>{questao.enunciado}</h2>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:'1.5rem', lineHeight:1.6 }}>{questao.dica}</p>

      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:'1rem' }}>
        {questao.opcao_mc?.map((opt, i) => (
          <button key={opt.id} disabled={verified} onClick={() => setSel(i)}
            style={{ padding:'13px 16px', background:'#0d1525', border:'1.5px solid rgba(255,255,255,0.08)', borderRadius:11, color:'#e2e8f8', fontSize:13, textAlign:'left', cursor: verified?'default':'pointer', display:'flex', alignItems:'center', gap:12, transition:'all 0.15s', ...optStyle(i) }}>
            <span style={{ width:26, height:26, borderRadius:'50%', border:'1.5px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, color:'#94a3b8' }}>
              {String.fromCharCode(65 + i)}
            </span>
            {opt.texto}
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

// ── Exercício de Drag & Drop ───────────────────────────────────
export function ExercicioDnD({ questao, nextLabel, onNext }) {
  const [placed, setPlaced]     = useState({ cation:[], anion:[] })
  const [verified, setVerified] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [acertou, setAcertou]   = useState(false)
  const dragging = useRef(null)

  const elems = questao.elemento_dnd || []
  const allPlaced = placed.cation.length + placed.anion.length === elems.length

  function onDrop(zone) {
    const id = dragging.current
    if (!id) return
    if (placed.cation.includes(id) || placed.anion.includes(id)) return
    setPlaced(p => ({ ...p, [zone]: [...p[zone], id] }))
    dragging.current = null
  }

  function remove(id, zone) {
    if (verified) return
    setPlaced(p => ({ ...p, [zone]: p[zone].filter(x => x !== id) }))
    setFeedback(null)
  }

  function verify() {
    let corretos = 0
    elems.forEach(e => {
      const zone = placed.cation.includes(e.id) ? 'cation' : 'anion'
      if (zone === e.categoria_correta) corretos++
    })
    const ok = corretos === elems.length
    setVerified(true)
    setAcertou(ok)
    setFeedback({
      type: ok ? 'ok' : 'er',
      msg:  ok
        ? `${questao.feedback_correto} +10 XP`
        : questao.feedback_incorreto,
    })
  }

  function itemStyle(id) {
    if (!verified) return {}
    const zone = placed.cation.includes(id) ? 'cation' : 'anion'
    const elem = elems.find(e => e.id === id)
    const ok   = zone === elem?.categoria_correta
    return ok
      ? { background:'rgba(134,239,172,0.1)', color:'#86efac', borderColor:'rgba(134,239,172,0.35)' }
      : { background:'rgba(252,165,165,0.08)', color:'#fca5a5', borderColor:'rgba(252,165,165,0.3)', animation:'shake 0.3s ease' }
  }

  return (
    <div>
      <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'#475569', marginBottom:8 }}>
        Arrastar e soltar
      </div>
      <h2 style={{ fontSize:17, fontWeight:700, color:'#e2e8f8', marginBottom:6, lineHeight:1.4 }}>{questao.enunciado}</h2>
      <p style={{ fontSize:13, color:'#64748b', marginBottom:'1.2rem', lineHeight:1.6 }}>{questao.dica}</p>

      {/* Elementos para arrastar */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:'1.2rem', minHeight:52 }}>
        {elems.map(e => {
          const used = placed.cation.includes(e.id) || placed.anion.includes(e.id)
          return (
            <div key={e.id} draggable={!used && !verified}
              onDragStart={() => { dragging.current = e.id }}
              style={{ background:'#0d1525', border:'1.5px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px', cursor: used?'default':'grab', opacity: used?0.2:1, display:'flex', flexDirection:'column', alignItems:'center', userSelect:'none', transition:'opacity 0.2s' }}>
              <span style={{ fontSize:18, fontWeight:800, color:'#e2e8f8' }}>{e.simbolo}</span>
              <span style={{ fontSize:10, color:'#64748b', marginTop:2 }}>{e.nome}</span>
            </div>
          )
        })}
      </div>

      {/* Zonas de soltar */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:'1rem' }}>
        {[
          { zone:'cation', label:'Cátion (+)', bc:'rgba(251,146,60,0.3)',  bg:'rgba(251,146,60,0.06)',  color:'#fb923c' },
          { zone:'anion',  label:'Ânion (−)',  bc:'rgba(56,189,248,0.28)', bg:'rgba(56,189,248,0.06)',  color:'#38bdf8' },
        ].map(({ zone, label, bc, bg, color }) => (
          <div key={zone}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(zone)}
            onDragEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.06)'}
            onDragLeave={e => e.currentTarget.style.background='transparent'}
            style={{ border:`2px dashed ${bc}`, borderRadius:12, padding:'1rem', minHeight:90, transition:'background 0.2s' }}>
            <div style={{ fontSize:12, fontWeight:700, color, marginBottom:8 }}>{label}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', minHeight:32 }}>
              {placed[zone].map(id => {
                const e = elems.find(x => x.id === id)
                return (
                  <div key={id} onClick={() => remove(id, zone)}
                    style={{ padding:'5px 12px', borderRadius:8, fontSize:13, fontWeight:700, cursor: verified?'default':'pointer', border:'1px solid', background:bg, color, borderColor:bc, animation:'popIn 0.2s ease', ...itemStyle(id) }}>
                    {e?.simbolo} {!verified && <span style={{ opacity:0.5, fontSize:10 }}>✕</span>}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <FeedbackBar type={feedback?.type} message={feedback?.msg} />

      <div style={{ display:'flex', justifyContent:'center', marginTop:'1rem' }}>
        {!verified
          ? <button style={{ ...s.btnCheck, opacity: allPlaced ? 1 : 0.4 }} disabled={!allPlaced} onClick={verify}>
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

const s = {
  btnCheck: { padding:'13px 36px', background:'#3b82f6', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' },
  btnNext:  { padding:'13px 36px', background:'#3b82f6', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer' },
}
