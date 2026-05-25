import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'

// ── Camadas com valores CORRETOS ──────────────────────────────────────────────
// K=2, L=8, M=18, N=32, O=32, P=18, Q=8
const CAMADAS = [
  { letra:'K', max:2,  cor:'#f87171', n:'1ª camada' },
  { letra:'L', max:8,  cor:'#fb923c', n:'2ª camada' },
  { letra:'M', max:18, cor:'#facc15', n:'3ª camada' },
  { letra:'N', max:32, cor:'#4ade80', n:'4ª camada' },
  { letra:'O', max:32, cor:'#34d399', n:'5ª camada' },
  { letra:'P', max:18, cor:'#60a5fa', n:'6ª camada' },
  { letra:'Q', max:8,  cor:'#a78bfa', n:'7ª camada' },
]

const PERIODIC = [
  {sym:'H', z:1,  name:'Hidrogênio', type:'dim',     col:1,  row:1},
  {sym:'He',z:2,  name:'Hélio',      type:'dim',     col:18, row:1},
  {sym:'Li',z:3,  name:'Lítio',      type:'metal',   col:1,  row:2},
  {sym:'Be',z:4,  name:'Berílio',    type:'metal',   col:2,  row:2},
  {sym:'B', z:5,  name:'Boro',       type:'dim',     col:13, row:2},
  {sym:'C', z:6,  name:'Carbono',    type:'nonmetal',col:14, row:2},
  {sym:'N', z:7,  name:'Nitrogênio', type:'nonmetal',col:15, row:2},
  {sym:'O', z:8,  name:'Oxigênio',   type:'nonmetal',col:16, row:2},
  {sym:'F', z:9,  name:'Flúor',      type:'nonmetal',col:17, row:2},
  {sym:'Ne',z:10, name:'Neônio',     type:'dim',     col:18, row:2},
  {sym:'Na',z:11, name:'Sódio',      type:'metal',   col:1,  row:3},
  {sym:'Mg',z:12, name:'Magnésio',   type:'metal',   col:2,  row:3},
  {sym:'Al',z:13, name:'Alumínio',   type:'metal',   col:13, row:3},
  {sym:'Si',z:14, name:'Silício',    type:'dim',     col:14, row:3},
  {sym:'P', z:15, name:'Fósforo',    type:'nonmetal',col:15, row:3},
  {sym:'S', z:16, name:'Enxofre',    type:'nonmetal',col:16, row:3},
  {sym:'Cl',z:17, name:'Cloro',      type:'nonmetal',col:17, row:3},
  {sym:'Ar',z:18, name:'Argônio',    type:'dim',     col:18, row:3},
  {sym:'K', z:19, name:'Potássio',   type:'metal',   col:1,  row:4},
  {sym:'Ca',z:20, name:'Cálcio',     type:'metal',   col:2,  row:4},
  {sym:'Sc',z:21, name:'Escândio',   type:'metal',   col:3,  row:4},
  {sym:'Ti',z:22, name:'Titânio',    type:'metal',   col:4,  row:4},
  {sym:'V', z:23, name:'Vanádio',    type:'metal',   col:5,  row:4},
  {sym:'Cr',z:24, name:'Crômio',     type:'metal',   col:6,  row:4},
  {sym:'Mn',z:25, name:'Manganês',   type:'metal',   col:7,  row:4},
  {sym:'Fe',z:26, name:'Ferro',      type:'metal',   col:8,  row:4},
  {sym:'Co',z:27, name:'Cobalto',    type:'metal',   col:9,  row:4},
  {sym:'Ni',z:28, name:'Níquel',     type:'metal',   col:10, row:4},
  {sym:'Cu',z:29, name:'Cobre',      type:'metal',   col:11, row:4},
  {sym:'Zn',z:30, name:'Zinco',      type:'metal',   col:12, row:4},
  {sym:'Ga',z:31, name:'Gálio',      type:'metal',   col:13, row:4},
  {sym:'Ge',z:32, name:'Germânio',   type:'dim',     col:14, row:4},
  {sym:'As',z:33, name:'Arsênio',    type:'dim',     col:15, row:4},
  {sym:'Se',z:34, name:'Selênio',    type:'nonmetal',col:16, row:4},
  {sym:'Br',z:35, name:'Bromo',      type:'nonmetal',col:17, row:4},
  {sym:'Kr',z:36, name:'Criptônio',  type:'dim',     col:18, row:4},
  {sym:'Rb',z:37, name:'Rubídio',    type:'metal',   col:1,  row:5},
  {sym:'Sr',z:38, name:'Estrôncio',  type:'metal',   col:2,  row:5},
  {sym:'Y', z:39, name:'Ítrio',      type:'metal',   col:3,  row:5},
  {sym:'Zr',z:40, name:'Zircônio',   type:'metal',   col:4,  row:5},
  {sym:'Nb',z:41, name:'Nióbio',     type:'metal',   col:5,  row:5},
  {sym:'Mo',z:42, name:'Molibdênio', type:'metal',   col:6,  row:5},
  {sym:'Tc',z:43, name:'Tecnécio',   type:'metal',   col:7,  row:5},
  {sym:'Ru',z:44, name:'Rutênio',    type:'metal',   col:8,  row:5},
  {sym:'Rh',z:45, name:'Ródio',      type:'metal',   col:9,  row:5},
  {sym:'Pd',z:46, name:'Paládio',    type:'metal',   col:10, row:5},
  {sym:'Ag',z:47, name:'Prata',      type:'metal',   col:11, row:5},
  {sym:'Cd',z:48, name:'Cádmio',     type:'metal',   col:12, row:5},
  {sym:'In',z:49, name:'Índio',      type:'metal',   col:13, row:5},
  {sym:'Sn',z:50, name:'Estanho',    type:'metal',   col:14, row:5},
  {sym:'Sb',z:51, name:'Antimônio',  type:'dim',     col:15, row:5},
  {sym:'Te',z:52, name:'Telúrio',    type:'dim',     col:16, row:5},
  {sym:'I', z:53, name:'Iodo',       type:'nonmetal',col:17, row:5},
  {sym:'Xe',z:54, name:'Xenônio',    type:'dim',     col:18, row:5},
  {sym:'Cs',z:55, name:'Césio',      type:'metal',   col:1,  row:6},
  {sym:'Ba',z:56, name:'Bário',      type:'metal',   col:2,  row:6},
  {sym:'*', z:null,name:'Lantanídeos',type:'lan',    col:3,  row:6},
  {sym:'Hf',z:72, name:'Háfnio',     type:'metal',   col:4,  row:6},
  {sym:'Ta',z:73, name:'Tântalo',    type:'metal',   col:5,  row:6},
  {sym:'W', z:74, name:'Tungstênio', type:'metal',   col:6,  row:6},
  {sym:'Re',z:75, name:'Rênio',      type:'metal',   col:7,  row:6},
  {sym:'Os',z:76, name:'Ósmio',      type:'metal',   col:8,  row:6},
  {sym:'Ir',z:77, name:'Irídio',     type:'metal',   col:9,  row:6},
  {sym:'Pt',z:78, name:'Platina',    type:'metal',   col:10, row:6},
  {sym:'Au',z:79, name:'Ouro',       type:'metal',   col:11, row:6},
  {sym:'Hg',z:80, name:'Mercúrio',   type:'metal',   col:12, row:6},
  {sym:'Tl',z:81, name:'Tálio',      type:'metal',   col:13, row:6},
  {sym:'Pb',z:82, name:'Chumbo',     type:'metal',   col:14, row:6},
  {sym:'Bi',z:83, name:'Bismuto',    type:'metal',   col:15, row:6},
  {sym:'Po',z:84, name:'Polônio',    type:'dim',     col:16, row:6},
  {sym:'At',z:85, name:'Astato',     type:'dim',     col:17, row:6},
  {sym:'Rn',z:86, name:'Radônio',    type:'dim',     col:18, row:6},
  {sym:'Fr',z:87, name:'Frâncio',    type:'metal',   col:1,  row:7},
  {sym:'Ra',z:88, name:'Rádio',      type:'metal',   col:2,  row:7},
  {sym:'**',z:null,name:'Actinídeos',type:'lan',     col:3,  row:7},
  {sym:'Rf',z:104,name:'Rutherfórdio',type:'dim',    col:4,  row:7},
  {sym:'Db',z:105,name:'Dúbnio',     type:'dim',     col:5,  row:7},
  {sym:'Sg',z:106,name:'Seabórgio',  type:'dim',     col:6,  row:7},
  {sym:'Bh',z:107,name:'Bóhrio',     type:'dim',     col:7,  row:7},
  {sym:'Hs',z:108,name:'Hássio',     type:'dim',     col:8,  row:7},
  {sym:'Mt',z:109,name:'Meitnério',  type:'dim',     col:9,  row:7},
  {sym:'Ds',z:110,name:'Darmstádtio',type:'dim',     col:10, row:7},
  {sym:'Rg',z:111,name:'Roentgênio', type:'dim',     col:11, row:7},
  {sym:'Cn',z:112,name:'Copernício', type:'dim',     col:12, row:7},
  {sym:'Nh',z:113,name:'Nihônio',    type:'dim',     col:13, row:7},
  {sym:'Fl',z:114,name:'Fleróvio',   type:'dim',     col:14, row:7},
  {sym:'Mc',z:115,name:'Moscóvio',   type:'dim',     col:15, row:7},
  {sym:'Lv',z:116,name:'Livermório', type:'dim',     col:16, row:7},
  {sym:'Ts',z:117,name:'Tenessino',  type:'dim',     col:17, row:7},
  {sym:'Og',z:118,name:'Oganessônio',type:'dim',     col:18, row:7},
]

const DISTRIB_EXAMPLES = [
  { sym:'Na', z:11, layers:[2,8,1],   type:'metal',    name:'Sódio',
    steps:['Z = 11 → 11 elétrons para distribuir','K (máx. 2) → coloca 2 (restam 9)','L (máx. 8) → coloca 8 (resta 1)','M → coloca o 1 restante','Resultado: [2, 8, 1] → valência = 1 e⁻'] },
  { sym:'Cl', z:17, layers:[2,8,7],   type:'nonmetal', name:'Cloro',
    steps:['Z = 17 → 17 elétrons para distribuir','K (máx. 2) → coloca 2 (restam 15)','L (máx. 8) → coloca 8 (restam 7)','M → coloca os 7 restantes','Resultado: [2, 8, 7] → valência = 7 e⁻'] },
  { sym:'Ca', z:20, layers:[2,8,8,2], type:'metal',    name:'Cálcio',
    steps:['Z = 20 → 20 elétrons para distribuir','K (máx. 2) → coloca 2 (restam 18)','L (máx. 8) → coloca 8 (restam 10)','M (máx. 18) → coloca 8* (restam 2)','N → coloca os 2 restantes','Resultado: [2, 8, 8, 2] → valência = 2 e⁻','* No EM, M recebe máx. 8 antes de abrir nova camada'] },
  { sym:'O',  z:8,  layers:[2,6],     type:'nonmetal', name:'Oxigênio',
    steps:['Z = 8 → 8 elétrons para distribuir','K (máx. 2) → coloca 2 (restam 6)','L → coloca os 6 restantes','Resultado: [2, 6] → valência = 6 e⁻'] },
  { sym:'Mg', z:12, layers:[2,8,2],   type:'metal',    name:'Magnésio',
    steps:['Z = 12 → 12 elétrons para distribuir','K (máx. 2) → coloca 2 (restam 10)','L (máx. 8) → coloca 8 (restam 2)','M → coloca os 2 restantes','Resultado: [2, 8, 2] → valência = 2 e⁻'] },
]

const INFO_CARDS = [
  {
    id:'z', color:'var(--text2)', borderColor:'var(--border2)', bgActive:'rgba(255,255,255,0.05)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    label:'Número Atômico (Z)', shortText:'Identifica o elemento e define sua estrutura eletrônica.',
    detail:{ title:'O que é o Número Atômico?', text:'O número atômico (Z) indica a quantidade de prótons no núcleo. Em um átomo neutro, Z também é o número de elétrons. Aparece no canto superior esquerdo de cada elemento na tabela.', where:'Canto superior esquerdo da célula de cada elemento na tabela periódica.', exampleLabel:'Exemplo: Sódio (Na)', exLayers:[2,8,1], exType:'metal', exSym:'Na', lines:['Z = 11 → 11 prótons no núcleo','11 elétrons no átomo neutro','Distribuição: K=2, L=8, M=1','Camada de valência: 1 elétron'] }
  },
  {
    id:'cat', color:'var(--orange)', borderColor:'var(--orange-border)', bgActive:'var(--orange-dim)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    label:'Cátions (+)', shortText:'Metais que perdem elétrons e ficam com carga positiva.',
    detail:{ title:'O que é um Cátion?', text:'Um cátion é um íon com carga positiva. Forma-se quando um átomo perde elétrons, ficando com mais prótons do que elétrons. Metais dos Grupos IA, IIA e IIIA são os principais formadores.', where:'Lado esquerdo da tabela periódica — Grupos IA (alcalinos) e IIA (alcalino-terrosos).', exampleLabel:'Exemplo: Na → Na⁺', exLayers:[2,8], exType:'metal', exSym:'Na⁺', lines:['Na tem Z=11 → 11 prótons e 11 elétrons','Perde 1 elétron da camada de valência','Fica com 11 prótons e 10 elétrons','Carga resultante: +1 → cátion Na⁺'] }
  },
  {
    id:'ani', color:'var(--blue)', borderColor:'var(--blue-border)', bgActive:'var(--blue-dim)',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    label:'Ânions (−)', shortText:'Ametais que ganham elétrons e ficam com carga negativa.',
    detail:{ title:'O que é um Ânion?', text:'Um ânion é um íon com carga negativa. Forma-se quando um átomo ganha elétrons, ficando com mais elétrons do que prótons. Ametais dos Grupos VA, VIA e VIIA são os principais formadores.', where:'Lado direito da tabela periódica — Grupos VIA e VIIA ganham elétrons mais facilmente.', exampleLabel:'Exemplo: Cl → Cl⁻', exLayers:[2,8,8], exType:'nonmetal', exSym:'Cl⁻', lines:['Cl tem Z=17 → 17 prótons e 17 elétrons','Ganha 1 elétron para completar o octeto','Fica com 17 prótons e 18 elétrons','Carga resultante: −1 → ânion Cl⁻'] }
  },
]

// Diagrama com camadas coloridas
function AtomDiagram({ sym, layers, type, size=160 }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const cx=size/2, cy=size/2, r0=size*0.13, maxR=size/2-6
    const step=(maxR-r0)/Math.max(layers.length,1)
    const tc = type==='metal'?'#f0a742':'#3ee8c4'
    let html=`<circle cx="${cx}" cy="${cy}" r="${r0}" fill="${tc}20" stroke="${tc}" stroke-width="1.5"/>
      <text x="${cx}" y="${cy+5}" text-anchor="middle" font-size="${Math.round(r0*0.75)}" font-weight="800" fill="${tc}" font-family="Segoe UI,sans-serif">${sym}</text>`
    layers.forEach((n,i)=>{
      const r=r0+step*(i+1)
      const cc=CAMADAS[i]?.cor||'#8888aa'
      html+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${cc}55" stroke-width="1.5"/>`
      for(let j=0;j<n;j++){
        const a=(j/n)*2*Math.PI-Math.PI/2
        const ex=cx+r*Math.cos(a), ey=cy+r*Math.sin(a)
        const isLast=i===layers.length-1
        html+=`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${isLast?4:3}" fill="${isLast?tc:cc}" opacity="${isLast?1:0.75}"/>`
      }
    })
    ref.current.innerHTML=html
  },[sym,layers,type,size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`}/>
}

function Tooltip({elem,pos}){
  if(!elem)return null
  const color=elem.type==='metal'?'var(--orange)':elem.type==='nonmetal'?'var(--blue)':'var(--text3)'
  const tagBg=elem.type==='metal'?'var(--orange-dim)':elem.type==='nonmetal'?'var(--blue-dim)':'rgba(255,255,255,0.06)'
  const label={metal:'Metal',nonmetal:'Ametal',dim:'Outro',lan:''}[elem.type]||''
  return(
    <div style={{position:'fixed',left:pos.x+14,top:pos.y-10,background:'#1e2d45',border:'1px solid var(--border2)',borderRadius:10,padding:'9px 12px',fontSize:12,zIndex:1000,pointerEvents:'none',minWidth:140,animation:'popIn 0.1s ease'}}>
      <div style={{fontSize:17,fontWeight:800,color}}>{elem.sym}</div>
      <div style={{color:'var(--text2)',fontSize:11,marginBottom:label?3:0}}>{elem.name} · Z={elem.z}</div>
      {label&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:5,background:tagBg,color}}>{label}</span>}
    </div>
  )
}

function PeriodicTable(){
  const [tip,setTip]=useState(null)
  const [pos,setPos]=useState({x:0,y:0})
  const cells={}
  PERIODIC.forEach(e=>{cells[`${e.row}-${e.col}`]=e})
  const ts={metal:{background:'var(--orange-dim)',borderColor:'var(--orange-border)'},nonmetal:{background:'var(--blue-dim)',borderColor:'var(--blue-border)'},dim:{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.07)'},lan:{background:'rgba(167,139,250,0.08)',borderColor:'rgba(167,139,250,0.18)'}}
  const sc={metal:'var(--orange)',nonmetal:'var(--blue)',dim:'var(--text3)',lan:'rgba(167,139,250,0.5)'}
  const grid=[]
  for(let r=1;r<=7;r++) for(let c=1;c<=18;c++){
    const e=cells[`${r}-${c}`]
    grid.push(<div key={`${r}-${c}`} style={{aspectRatio:'1',borderRadius:4,border:'1px solid transparent',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:e?.z?'pointer':'default',transition:'transform 0.1s,opacity 0.1s',...(e?ts[e.type]||ts.dim:{})}} onMouseEnter={e?.z?ev=>{setTip(e);setPos({x:ev.clientX,y:ev.clientY});ev.currentTarget.style.transform='scale(1.3)';ev.currentTarget.style.zIndex='10';ev.currentTarget.style.opacity='0.85'}:undefined} onMouseLeave={e?.z?ev=>{setTip(null);ev.currentTarget.style.transform='scale(1)';ev.currentTarget.style.zIndex='1';ev.currentTarget.style.opacity='1'}:undefined} onMouseMove={e?.z?ev=>setPos({x:ev.clientX,y:ev.clientY}):undefined}>
      {e&&<><span style={{fontSize:6,color:'var(--text3)',lineHeight:1,alignSelf:'flex-start',padding:'2px 2px 0'}}>{e.z||''}</span><span style={{fontSize:11,fontWeight:700,lineHeight:1.1,color:sc[e.type]||'var(--text3)'}}>{e.sym}</span></>}
    </div>)
  }
  return(
    <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1rem',marginBottom:'1.2rem',overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(18,1fr)',gap:2,minWidth:560}}>{grid}</div>
      <div style={{display:'flex',gap:'1.2rem',flexWrap:'wrap',marginTop:'1rem'}}>
        {[['var(--orange)','Metais (Grupos IA, IIA, IIIA) — formam cátions (+)'],['var(--blue)','Ametais (Grupos VA, VIA, VIIA) — formam ânions (−)'],['var(--text3)','Semimetais / Gases nobres / Outros']].map(([color,label],i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--text2)'}}>
            <div style={{width:9,height:9,borderRadius:2,background:color,opacity:0.7,flexShrink:0}}/>{label}
          </div>
        ))}
      </div>
      {/* Nota de simplificação — pedido pelo professor */}
      <div style={{marginTop:'0.8rem',padding:'8px 12px',background:'rgba(255,255,255,0.04)',borderRadius:8,fontSize:11,color:'var(--text3)',borderLeft:'2px solid rgba(255,255,255,0.1)'}}>
        ⚠ Esta é uma representação simplificada da tabela periódica, exibindo os elementos mais relevantes para o estudo de ligações iônicas.
      </div>
      <Tooltip elem={tip} pos={pos}/>
    </div>
  )
}

function SidebarStep({num,label,current}){
  const active = current===num
  const done   = current>num
  const locked = num>current
  return(
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,marginBottom:4,cursor:locked?'default':'pointer',border:`1px solid ${active?'rgba(59,130,246,0.35)':'transparent'}`,background:active?'rgba(59,130,246,0.1)':'transparent',opacity:locked?0.4:1}}>
      <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,border:`1.5px solid ${active?'#3b82f6':done?'rgba(59,130,246,0.4)':'rgba(255,255,255,0.1)'}`,background:active?'#3b82f6':done?'rgba(59,130,246,0.15)':'transparent',color:active?'#fff':done?'#3b82f6':'#475569'}}>
        {done
          ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          : locked
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            : num
        }
      </div>
      <span style={{fontSize:13,color:active?'#e2e8f8':done?'#94a3b8':'#475569',fontWeight:active?600:400}}>{label}</span>
    </div>
  )
}

function DistribuicaoCamadas({selAtom,setSelAtom}){
  return(
    <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
      <div style={{display:'flex',gap:8,marginBottom:'1.2rem',flexWrap:'wrap'}}>
        {DISTRIB_EXAMPLES.map(a=>(
          <button key={a.sym} onClick={()=>setSelAtom(a)} style={{padding:'6px 16px',borderRadius:8,border:`1px solid ${selAtom.sym===a.sym?(a.type==='metal'?'var(--orange-border)':'var(--blue-border)'):'var(--border2)'}`,background:selAtom.sym===a.sym?(a.type==='metal'?'var(--orange-dim)':'var(--blue-dim)'):'var(--card2)',color:selAtom.sym===a.sym?(a.type==='metal'?'var(--orange)':'var(--blue)'):'var(--text2)',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>
            {a.sym} (Z={a.z})
          </button>
        ))}
      </div>
      <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',alignItems:'flex-start'}} key={selAtom.sym}>
        <div style={{flex:1,minWidth:240}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--teal)',marginBottom:'1rem'}}>{selAtom.name} (Z={selAtom.z}) — passo a passo</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {selAtom.steps.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid var(--teal-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--teal)',flexShrink:0,marginTop:1}}>{i+1}</div>
                <span style={{fontSize:13,color:i===selAtom.steps.length-1?'var(--text)':'var(--text2)',lineHeight:1.5,fontWeight:i===selAtom.steps.length-1?700:400}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
          <AtomDiagram sym={selAtom.sym} layers={selAtom.layers} type={selAtom.type} size={180}/>
          <div style={{display:'flex',flexDirection:'column',gap:5,width:'100%'}}>
            {selAtom.layers.map((n,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:CAMADAS[i]?.cor||'var(--teal)',flexShrink:0}}/>
                <span style={{fontSize:12,color:'var(--text2)'}}>Camada {CAMADAS[i]?.letra}: <strong style={{color:CAMADAS[i]?.cor||'var(--text)'}}>{n} e⁻</strong></span>
                {i===selAtom.layers.length-1&&<span style={{fontSize:10,fontWeight:700,padding:'1px 7px',borderRadius:5,background:selAtom.type==='metal'?'var(--orange-dim)':'var(--blue-dim)',color:selAtom.type==='metal'?'var(--orange)':'var(--blue)',border:`1px solid ${selAtom.type==='metal'?'var(--orange-border)':'var(--blue-border)'}`}}>valência</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Teoria(){
  const navigate=useNavigate()
  const [step,setStep]=useState(1)
  const [activeCard,setActiveCard]=useState(null)
  const [selAtom,setSelAtom]=useState(DISTRIB_EXAMPLES[0])
  const openCard=INFO_CARDS.find(c=>c.id===activeCard)

  return(
    <>
      <Background/><Navbar/>
      <div style={{display:'flex',paddingTop:56,minHeight:'100vh',position:'relative',zIndex:1}}>
        <aside style={{width:220,flexShrink:0,padding:'2rem 1rem',borderRight:'1px solid var(--border)',position:'sticky',top:56,height:'calc(100vh - 56px)',overflowY:'auto'}}>
          <div style={{fontSize:10,letterSpacing:'1.5px',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'1rem'}}>Progresso</div>
          <SidebarStep num={1} label="Tabela Periódica" current={step}/>
          <SidebarStep num={2} label="Distribuição Eletrônica" current={step}/>
        </aside>
        <main style={{flex:1,padding:'2.5rem 2rem',maxWidth:900,overflowY:'auto'}}>

          {step===1&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 1 de 2</div>
              <h1 style={h1}>Tabela Periódica</h1>
              <p style={intro}>A posição de um elemento na tabela periódica determina seu comportamento nas ligações iônicas. <strong style={{color:'var(--orange)'}}>Metais</strong> (esquerda) tendem a perder elétrons e <strong style={{color:'var(--blue)'}}>ametais</strong> (direita) tendem a ganhar. Passe o mouse sobre qualquer elemento para ver sua classificação.</p>
              <PeriodicTable/>

              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:openCard?0:'1.5rem'}}>
                {INFO_CARDS.map(card=>{
                  const isActive=activeCard===card.id
                  return(
                    <button key={card.id} onClick={()=>setActiveCard(p=>p===card.id?null:card.id)}
                      style={{background:isActive?card.bgActive:'var(--card)',border:`1px solid ${isActive?card.borderColor:'var(--border2)'}`,borderRadius:isActive?'14px 14px 0 0':14,padding:'1.1rem',cursor:'pointer',textAlign:'left',transition:'all 0.2s',outline:'none',position:'relative'}}
                      onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor=card.borderColor;e.currentTarget.style.background=card.bgActive}}}
                      onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.background='var(--card)'}}}>
                      <div style={{width:34,height:34,borderRadius:9,background:isActive?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,color:isActive?card.color:'var(--text3)'}}>{card.icon}</div>
                      <div style={{fontSize:14,fontWeight:700,color:isActive?card.color:'var(--text)',marginBottom:5}}>{card.label}</div>
                      <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}>{card.shortText}</div>
                      <div style={{position:'absolute',bottom:10,right:12,fontSize:16,color:isActive?card.color:'var(--text3)',transition:'transform 0.2s',transform:isActive?'rotate(180deg)':'rotate(0deg)'}}>⌄</div>
                    </button>
                  )
                })}
              </div>

              {openCard&&(
                <div style={{background:openCard.bgActive,border:`1px solid ${openCard.borderColor}`,borderTop:'none',borderRadius:'0 0 14px 14px',padding:'1.5rem',marginBottom:'1.5rem',animation:'fadeIn 0.2s ease'}}>
                  <h3 style={{fontSize:16,fontWeight:700,color:openCard.color,marginBottom:10}}>{openCard.detail.title}</h3>
                  <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',alignItems:'flex-start'}}>
                    <div style={{flex:1,minWidth:220}}>
                      <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:12}}>{openCard.detail.text}</p>
                      <div style={{background:'rgba(0,0,0,0.15)',borderRadius:10,padding:'10px 14px',marginBottom:12}}>
                        <div style={{fontSize:11,fontWeight:700,color:openCard.color,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>Onde fica na tabela?</div>
                        <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>{openCard.detail.where}</p>
                      </div>
                      <div style={{background:'rgba(0,0,0,0.15)',borderRadius:10,padding:'10px 14px'}}>
                        <div style={{fontSize:11,fontWeight:700,color:openCard.color,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>{openCard.detail.exampleLabel}</div>
                        {openCard.detail.lines.map((line,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                            <div style={{width:5,height:5,borderRadius:'50%',background:openCard.color,flexShrink:0}}/>
                            <span style={{fontSize:13,color:'var(--text2)'}}>{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,flexShrink:0}}>
                      <AtomDiagram sym={openCard.detail.exSym} layers={openCard.detail.exLayers} type={openCard.detail.exType} size={140}/>
                      <span style={{fontSize:12,color:'var(--text2)',textAlign:'center'}}>{openCard.detail.exampleLabel}</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{background:'var(--card2)',border:'1px solid var(--teal-border)',borderRadius:12,padding:'12px 16px',marginBottom:'1.5rem',fontSize:13,color:'var(--text2)',lineHeight:1.7}}>
                <strong style={{color:'var(--teal)'}}>Atenção:</strong> existem exceções. O ferro (Fe) pode formar Fe²⁺ ou Fe³⁺ dependendo da ligação — são os metais de transição. Usa-se algarismos romanos: <strong>cloreto de ferro (II)</strong> para FeCl₂ e <strong>cloreto de ferro (III)</strong> para FeCl₃.
              </div>
              <button style={btnC} onClick={()=>setStep(2)}>Próximo →</button>
            </div>
          )}

          {step===2&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 2 de 2</div>
              <h1 style={h1}>Distribuição Eletrônica</h1>
              <p style={intro}>Os elétrons se organizam em <strong>camadas</strong> ao redor do núcleo, preenchidas da mais interna para a mais externa. A <strong>camada de valência</strong> — a última a ser preenchida — determina o comportamento do elemento nas ligações iônicas.</p>

              <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Capacidade máxima de cada camada</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,marginBottom:'1rem'}}>
                  {CAMADAS.map(c=>(
                    <div key={c.letra} style={{background:'var(--card2)',border:`1px solid ${c.cor}44`,borderRadius:12,padding:'0.8rem',textAlign:'center'}}>
                      <div style={{fontSize:22,fontWeight:800,color:c.cor,marginBottom:4}}>{c.letra}</div>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>máx. {c.max}</div>
                      <div style={{fontSize:10,color:'var(--text3)'}}>{c.n}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'var(--card2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:8}}>
                  <strong style={{color:'var(--teal)'}}>Como distribuir:</strong> preencha as camadas em ordem (K → L → M → ...) até os elétrons acabarem. O que sobrar na última camada são os <strong>elétrons de valência</strong>.
                </div>
                <div style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'var(--text2)',lineHeight:1.6}}>
                  <strong style={{color:'#a78bfa'}}>Observação:</strong> para os elementos estudados neste módulo (Z ≤ 20), as camadas usadas vão até no máximo a <strong>N</strong>. As camadas O, P e Q aparecem apenas em elementos mais pesados.
                </div>
              </div>

              <div style={{fontSize:14,fontWeight:700,color:'var(--text2)',marginBottom:'0.8rem'}}>Selecione um elemento e veja a distribuição passo a passo:</div>
              <DistribuicaoCamadas selAtom={selAtom} setSelAtom={setSelAtom}/>

              {/* Regra do Octeto em destaque — pedido pelo professor */}
              <div style={{background:'var(--card)',border:'1px solid var(--teal-border)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <h3 style={{fontSize:16,fontWeight:800,color:'var(--teal)',marginBottom:10}}>Regra do Octeto</h3>
                <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:12}}>
                  Os átomos tendem a ganhar, perder ou compartilhar elétrons até atingir <strong style={{color:'var(--text)'}}>8 elétrons na camada de valência</strong> — a mesma configuração dos gases nobres, que são naturalmente estáveis.
                </p>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div style={{background:'var(--card2)',border:'1px solid var(--orange-border)',borderRadius:12,padding:'1rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--orange)',marginBottom:6}}>METAIS — Grupos IA, IIA, IIIA</div>
                    <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>Têm 1, 2 ou 3 elétrons na valência. <strong>Perdem</strong> esses elétrons para atingir 8 na camada anterior, formando cátions (+).</p>
                  </div>
                  <div style={{background:'var(--card2)',border:'1px solid var(--blue-border)',borderRadius:12,padding:'1rem'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'var(--blue)',marginBottom:6}}>AMETAIS — Grupos VA, VIA, VIIA</div>
                    <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>Têm 5, 6 ou 7 elétrons na valência. <strong>Ganham</strong> os que faltam para completar 8, formando ânions (−).</p>
                  </div>
                </div>
              </div>

              <div style={{display:'flex',gap:12}}>
                <button style={btnV} onClick={()=>setStep(1)}>← Voltar</button>
                <button style={btnC} onClick={()=>navigate('/modulo1/exercicios')}>Ir para os Exercícios →</button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  )
}

const si={fontSize:13,color:'var(--text2)',marginBottom:8}
const h1={fontSize:26,fontWeight:800,marginBottom:'1rem'}
const intro={fontSize:14,color:'var(--text2)',lineHeight:1.7,marginBottom:'1.2rem'}
const btnC={display:'flex',alignItems:'center',gap:8,padding:'13px 28px',background:'var(--teal)',color:'#0a1628',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
const btnV={padding:'10px 20px',background:'transparent',border:'1px solid var(--border2)',color:'var(--text2)',fontSize:14,fontWeight:600,borderRadius:10,cursor:'pointer'}
