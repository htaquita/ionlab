import React from 'react'

export default function ProgressDots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: 28, height: 8, borderRadius: 99,
          background: i < current ? 'rgba(78,205,196,0.4)' : i === current ? 'var(--teal)' : 'var(--border2)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}
