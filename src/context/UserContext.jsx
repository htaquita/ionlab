import React, { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Aluno',
    email: 'aluno@ionlab.com',
    turma: '1º Ano — Ensino Médio',
    xp: 0,
    streak: 5,
    progress: { m1: 0, m2: 0, m3: 0, m4: 0 },
    badges: [],
  })

  const addXP = (amount) => setUser(u => ({ ...u, xp: u.xp + amount }))
  const setProgress = (mod, pct) => setUser(u => ({ ...u, progress: { ...u.progress, [mod]: pct } }))
  const unlockBadge = (badge) => setUser(u => ({ ...u, badges: [...new Set([...u.badges, badge])] }))
  const updateUser = (data) => setUser(u => ({ ...u, ...data }))

  return (
    <UserContext.Provider value={{ user, addXP, setProgress, unlockBadge, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
