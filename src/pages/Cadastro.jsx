import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Background from '../components/Background'

export default function Cadastro() {
  const navigate = useNavigate()
  const { updateUser } = useUser()
  const [name, setName] = useState('')
  const [turma, setTurma] = useState('')

  function handleCadastro() {
    if (name.trim()) updateUser({ name: name.trim(), turma })
    navigate('/mapa')
  }

  return (
    <>
      <Background />
      <div style={wrap}>
        <Logo />
        <div style={card}>
          <h1 style={h1}>Crie sua conta</h1>
          <p style={sub}>Comece a dominar as ligações iônicas</p>
          <Field icon="user" placeholder="Nome completo" type="text" onChange={e => setName(e.target.value)} />
          <Field icon="email" placeholder="E-mail" type="email" />
          <Field icon="lock" placeholder="Senha" type="password" />
          <Field icon="lock" placeholder="Confirmar senha" type="password" />
          <div style={fieldWrap}>
            <span style={iconWrap}><SchoolIcon /></span>
            <select style={sel} value={turma} onChange={e => setTurma(e.target.value)}>
              <option value="" disabled>Selecione sua turma</option>
              <option>1º Ano — Ensino Médio</option>
              <option>2º Ano — Ensino Médio</option>
              <option>3º Ano — Ensino Médio</option>
            </select>
          </div>
          <button style={btnMain} onClick={handleCadastro}>
            Criar conta <Arrow />
          </button>
          <div style={footer}>
            Já tem uma conta? <a style={link} onClick={() => navigate('/login')}>Entrar</a>
          </div>
        </div>
      </div>
    </>
  )
}

function Logo() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'2rem', zIndex:1 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:'var(--teal-dim)', border:'1px solid var(--teal-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ecdc4" strokeWidth="2">
          <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
          <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
        </svg>
      </div>
      <span style={{ fontSize:22, fontWeight:700 }}>Ion<b style={{ color:'var(--teal)' }}>Lab</b></span>
    </div>
  )
}

function Field({ icon, placeholder, type, onChange }) {
  const icons = {
    email: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>,
    lock:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    user:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  }
  return (
    <div style={{ display:'flex', alignItems:'center', background:'var(--card2)', border:'1px solid var(--border)', borderRadius:12, padding:'0 14px', marginBottom:14 }}>
      <span style={{ opacity:0.45, marginRight:10, display:'flex' }}>{icons[icon]}</span>
      <input type={type} placeholder={placeholder} onChange={onChange} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:15, padding:'14px 0' }} />
    </div>
  )
}

function SchoolIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:16,height:16,opacity:0.45}}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> }
function Arrow() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg> }

const wrap = { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', padding:'2rem', position:'relative' }
const card = { background:'var(--card)', border:'1px solid var(--border2)', borderRadius:20, padding:'2.5rem 2rem', width:'100%', maxWidth:440, zIndex:1 }
const h1 = { fontSize:26, fontWeight:700, marginBottom:6 }
const sub = { color:'var(--text2)', fontSize:14, marginBottom:'2rem' }
const btnMain = { width:'100%', padding:15, background:'var(--teal)', color:'#0a1628', fontSize:16, fontWeight:700, border:'none', borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:8 }
const footer = { textAlign:'center', marginTop:'1.2rem', fontSize:14, color:'var(--text2)' }
const link = { color:'var(--teal)', cursor:'pointer', fontWeight:600 }
const fieldWrap = { display:'flex', alignItems:'center', background:'var(--card2)', border:'1px solid var(--border)', borderRadius:12, padding:'0 14px', marginBottom:14 }
const iconWrap = { opacity:0.45, marginRight:10, display:'flex' }
const sel = { flex:1, background:'transparent', border:'none', outline:'none', color:'var(--text2)', fontSize:15, padding:'14px 0', cursor:'pointer', appearance:'none' }
