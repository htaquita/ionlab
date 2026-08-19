import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Ouvir mudanças de autenticação
  useEffect(() => {
    // Sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user.id)
      else setLoading(false)
    })

    // Mudanças futuras (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUser(session.user.id)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUser(authId) {
    const { data, error } = await supabase
      .from('usuario')
      .select('*, turma(nome)')
      .eq('id', authId)
      .single()

    if (data) {
      // Carregar progresso dos módulos
      const { data: progressos } = await supabase
        .from('progresso_modulo')
        .select('modulo_id, percentual')
        .eq('usuario_id', authId)

      const progress = {}
      progressos?.forEach(p => { progress[`m${p.modulo_id}`] = p.percentual })

      // Carregar badges
      const { data: badgesData } = await supabase
        .from('badge_usuario')
        .select('badge_id, badge(nome, icone)')
        .eq('usuario_id', authId)

      setUser({
        id:       data.id,
        name:     data.nome,
        email:    data.email,
        turma:    data.turma?.nome || data.turma_id || '',
        xp:       data.xp_total,
        streak:   data.streak_atual,
        progress,
        badges:   badgesData?.map(b => b.badge) || [],
      })
    }
    setLoading(false)
  }

  async function addXP(qtd) {
    if (!user) return
    const novoXP = user.xp + qtd
    setUser(u => ({ ...u, xp: novoXP }))
    await supabase.from('usuario').update({ xp_total: novoXP }).eq('id', user.id)
  }

  async function setProgress(moduleKey, pct) {
    if (!user) return
    setUser(u => ({ ...u, progress: { ...u.progress, [moduleKey]: pct } }))
    const moduleNum = parseInt(moduleKey.replace('m', ''))
    await supabase.from('progresso_modulo').upsert({
      usuario_id: user.id,
      modulo_id: moduleNum,
      percentual: pct,
      concluido_em: pct >= 100 ? new Date().toISOString() : null,
    }, { onConflict: 'usuario_id,modulo_id' })
  }

  async function unlockBadge(badgeId) {
    if (!user) return
    await supabase.from('badge_usuario').upsert({
      usuario_id: user.id,
      badge_id: badgeId,
    }, { onConflict: 'usuario_id,badge_id' })
    await loadUser(user.id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, addXP, setProgress, unlockBadge, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
