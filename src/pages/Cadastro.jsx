import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Background from '../components/Background'

export default function Cadastro() {
  const navigate = useNavigate()
  const [nome, setNome]       = useState('')
  const [email, setEmail]     = useState('')
  const [senha, setSenha]     = useState('')
  const [turma, setTurma]     = useState('')
  const [erro, setErro]       = useState('')
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  async function handleCadastro(e) {
    e.preventDefault()
    setErro('')

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { data, error: authError } = await supabase.auth.signUp({ email, password: senha })

    if (authError) {
      setErro('Erro ao criar conta: ' + authError.message)
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase.from('usuario').insert({
      id: data.user.id,
      nome,
      email,
      xp_total:      0,
      streak_atual:  0,
      streak_maximo: 0,
    })

    if (dbError) {
      setErro('Erro ao salvar perfil: ' + dbError.message)
      setLoading(false)
      return
    }

    // Mostrar tela de sucesso por 1.5s e redirecionar
    setSucesso(true)
    setLoading(false)
    setTimeout(() => navigate('/mapa'), 1500)
  }

  if (sucesso) {
    return (
      <>
        <Background />
        <div style={wrap}>
          <div style={{ ...card, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(62,232,196,0.12)', border:'2px solid rgba(62,232,196,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.5rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ee8c4" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Conta criada!</h2>
            <p style={{ fontSize:14, color:'#8888aa' }}>Redirecionando para o mapa...</p>
            <div style={{ marginTop:'1.5rem', height:4, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', background:'#8b7cf8', borderRadius:99, width:'100%', transition:'width 1.5s linear', animation:'loadBar 1.5s linear forwards' }}/>
            </div>
          </div>
        </div>
        <style>{`@keyframes loadBar { from { width: 0% } to { width: 100% } }`}</style>
      </>
    )
  }

  return (
    <>
      <Background />
      <div style={wrap}>
        <div style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:'2rem' }}>
            <div style={logoMark}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b7cf8" strokeWidth="2">
                <circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="9" opacity="0.4"/>
                <line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/>
                <line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/>
              </svg>
            </div>
            <span style={{ fontSize:20, fontWeight:800 }}>Ion<b style={{ color:'#8b7cf8' }}>Lab</b></span>
          </div>

          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:6, textAlign:'center' }}>Criar conta</h1>
          <p style={{ fontSize:14, color:'#8888aa', marginBottom:'1.8rem', textAlign:'center' }}>Comece sua jornada de aprendizado</p>

          <form onSubmit={handleCadastro} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={labelS}>Nome completo</label>
              <input type="text" value={nome} onChange={e=>setNome(e.target.value)} required style={inputS} placeholder="Seu nome"/>
            </div>
            <div>
              <label style={labelS}>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required style={inputS} placeholder="seu@email.com"/>
            </div>
            <div>
              <label style={labelS}>Turma</label>
              <input type="text" value={turma} onChange={e=>setTurma(e.target.value)} style={inputS} placeholder="Ex: 1º Ano A"/>
            </div>
            <div>
              <label style={labelS}>Senha</label>
              <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} required style={inputS} placeholder="Mínimo 6 caracteres"/>
            </div>

            {erro && (
              <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:10, padding:'10px 14px', fontSize:13, color:'#f87171' }}>
                {erro}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding:'13px', background:'#8b7cf8', color:'#fff', fontSize:15, fontWeight:700, border:'none', borderRadius:12, cursor:loading?'default':'pointer', opacity:loading?0.7:1, marginTop:4 }}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'#8888aa', marginTop:'1.5rem' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color:'#8b7cf8', fontWeight:600, textDecoration:'none' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </>
  )
}

const wrap     = { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', position:'relative', zIndex:1 }
const card     = { background:'#17171f', border:'1px solid rgba(255,255,255,0.07)', borderRadius:20, padding:'2.5rem', width:'100%', maxWidth:420 }
const logoMark = { width:36, height:36, borderRadius:10, background:'rgba(139,124,248,0.12)', border:'1px solid rgba(139,124,248,0.28)', display:'flex', alignItems:'center', justifyContent:'center' }
const labelS   = { display:'block', fontSize:13, fontWeight:600, color:'#8888aa', marginBottom:6 }
const inputS   = { width:'100%', padding:'11px 14px', background:'#1d1d28', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, color:'#ededfc', fontSize:14, outline:'none', fontFamily:'inherit' }
