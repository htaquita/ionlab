import React, { useMemo } from 'react'

export default function Background() {
  const dots = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    opacity: Math.random() * 0.08 + 0.03,
  })), [])
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {dots.map(d => (
        <div key={d.id} style={{ position: 'absolute', borderRadius: '50%', background: 'var(--teal)', width: d.size, height: d.size, left: `${d.left}%`, top: `${d.top}%`, opacity: d.opacity }} />
      ))}
    </div>
  )
}
