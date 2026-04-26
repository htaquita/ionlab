/**
 * Generates SVG inner HTML for an atom diagram.
 * @param {string} sym - Element symbol
 * @param {number[]} layers - Electron count per layer e.g. [2,8,1]
 * @param {'metal'|'nonmetal'} type
 * @param {number} w - SVG width
 * @param {number} h - SVG height
 */
export function atomSVG(sym, layers, type, w = 200, h = 200) {
  const cx = w / 2, cy = h / 2, r0 = w * 0.13
  const maxR = Math.min(w, h) / 2 - 6
  const step = (maxR - r0) / Math.max(layers.length, 1)
  const color = type === 'metal' ? '#e8935a' : '#64a0dc'
  let html = `<circle cx="${cx}" cy="${cy}" r="${r0}" fill="${color}20" stroke="${color}" stroke-width="1.5"/>
    <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="${Math.round(r0 * 0.75)}" font-weight="800" fill="${color}" font-family="Segoe UI,sans-serif">${sym}</text>`
  layers.forEach((n, i) => {
    const r = r0 + step * (i + 1)
    html += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`
    for (let j = 0; j < n; j++) {
      const a = (j / n) * 2 * Math.PI - Math.PI / 2
      const ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a)
      const isLast = i === layers.length - 1
      html += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${isLast ? 4 : 3}" fill="${isLast ? color : 'rgba(255,255,255,0.45)'}" opacity="${isLast ? 1 : 0.6}"/>`
    }
  })
  return html
}
