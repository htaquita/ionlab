import React from 'react'

export default function PopupAviso({ onCancel, onConfirm }) {
  return (
    <div style={overlay}>
      <div style={box}>
        <div style={icon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8935a" strokeWidth="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Sair do exercício?</h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Você está no meio de um exercício. Se voltar agora, seu progresso nesta sessão será perdido e o exercício será reiniciado.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button style={btnCancel} onClick={onCancel}>Continuar exercício</button>
          <button style={btnConfirm} onClick={onConfirm}>Sair mesmo assim</button>
        </div>
      </div>
    </div>
  )
}

const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }
const box = { background: 'var(--card)', border: '1px solid var(--border2)', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '100%', textAlign: 'center', animation: 'popIn 0.2s ease' }
const icon = { width: 52, height: 52, borderRadius: '50%', background: 'var(--orange-dim)', border: '1px solid var(--orange-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }
const btnCancel = { padding: '11px 24px', background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: 14, fontWeight: 600, borderRadius: 11, cursor: 'pointer' }
const btnConfirm = { padding: '11px 24px', background: 'var(--orange)', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', borderRadius: 11, cursor: 'pointer' }
