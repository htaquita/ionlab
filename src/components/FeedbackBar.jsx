import React from 'react'

export default function FeedbackBar({ type, message }) {
  if (!message) return null
  const isOk = type === 'ok'
  return (
    <div style={{
      borderRadius: 12,
      padding: '13px 16px',
      fontSize: 14,
      fontWeight: 600,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      lineHeight: 1.5,
      marginTop: 4,
      animation: 'fadeIn 0.2s ease',
      background: isOk ? 'rgba(62,232,196,0.1)'  : 'rgba(248,113,113,0.1)',
      border:     `1px solid ${isOk ? 'rgba(62,232,196,0.28)' : 'rgba(248,113,113,0.28)'}`,
      color:      isOk ? '#3ee8c4' : '#f87171',
    }}>
      {/* Ícone */}
      <div style={{ flexShrink:0, marginTop:1 }}>
        {isOk
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        }
      </div>
      <span>{message}</span>
    </div>
  )
}
