import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Background from '../../components/Background'
import Navbar from '../../components/Navbar'
import { atomSVG } from '../../utils/drawAtom'

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

// Átomos para o explorador do Passo 2
const SHELL_ATOMS = [
  { sym:'Na', z:11, layers:[2,8,1],   type:'metal',    name:'Sódio',    grupo:'IA',   val:1, ion:'Na⁺', perde:true,
    desc:'O sódio (Grupo IA) tem 1 elétron na camada de valência. Ao perdê-lo, a camada anterior (com 8 e⁻) torna-se a nova camada de valência, formando Na⁺ com configuração eletrônica estável.' },
  { sym:'Cl', z:17, layers:[2,8,7],   type:'nonmetal', name:'Cloro',    grupo:'VIIA', val:7, ion:'Cl⁻', perde:false,
    desc:'O cloro (Grupo VIIA) tem 7 elétrons na camada de valência — falta apenas 1 para completar o octeto. Ao ganhar 1 e⁻, atinge a configuração estável de 8 elétrons e forma o ânion Cl⁻.' },
  { sym:'Ca', z:20, layers:[2,8,8,2], type:'metal',    name:'Cálcio',   grupo:'IIA',  val:2, ion:'Ca²⁺', perde:true,
    desc:'O cálcio (Grupo IIA) tem 2 elétrons na camada de valência. Ao perdê-los, a camada anterior (com 8 e⁻) torna-se a nova camada de valência, estabilizando o átomo como Ca²⁺.' },
  { sym:'O',  z:8,  layers:[2,6],     type:'nonmetal', name:'Oxigênio', grupo:'VIA',  val:6, ion:'O²⁻', perde:false,
    desc:'O oxigênio (Grupo VIA) tem 6 elétrons na camada de valência e precisa de 2 para completar o octeto. Ao ganhar 2 e⁻, forma o ânion O²⁻ com configuração eletrônica estável.' },
  { sym:'Mg', z:12, layers:[2,8,2],   type:'metal',    name:'Magnésio', grupo:'IIA',  val:2, ion:'Mg²⁺', perde:true,
    desc:'O magnésio (Grupo IIA) tem 2 elétrons na camada de valência. Com essa configuração, perde ambos facilmente, expondo a camada anterior completa com 8 e⁻ e formando o cátion Mg²⁺.' },
  { sym:'F',  z:9,  layers:[2,7],     type:'nonmetal', name:'Flúor',    grupo:'VIIA', val:7, ion:'F⁻', perde:false,
    desc:'O flúor é o elemento mais eletronegativo da tabela periódica (Grupo VIIA). Com 7 elétrons na camada de valência, precisa de apenas 1 para atingir o octeto. Forma o ânion F⁻ com facilidade.' },
]

// Exemplo interativo de distribuição — o aluno escolhe o elemento
const DISTRIB_EXAMPLES = [
  { sym:'Na', z:11, layers:[2,8,1],  type:'metal',    name:'Sódio',
    steps:['Z = 11 → 11 elétrons para distribuir','Camada K: comporta até 2 → coloca 2 (restam 9)','Camada L: comporta até 8 → coloca 8 (resta 1)','Camada M: coloca o 1 restante','Resultado: [2, 8, 1] → valência = 1 e⁻'] },
  { sym:'Cl', z:17, layers:[2,8,7],  type:'nonmetal', name:'Cloro',
    steps:['Z = 17 → 17 elétrons para distribuir','Camada K: comporta até 2 → coloca 2 (restam 15)','Camada L: comporta até 8 → coloca 8 (restam 7)','Camada M: coloca os 7 restantes','Resultado: [2, 8, 7] → valência = 7 e⁻'] },
  { sym:'Ca', z:20, layers:[2,8,8,2],type:'metal',    name:'Cálcio',
    steps:['Z = 20 → 20 elétrons para distribuir','Camada K: comporta até 2 → coloca 2 (restam 18)','Camada L: comporta até 8 → coloca 8 (restam 10)','Camada M: comporta até 8 → coloca 8 (restam 2)','Camada N: coloca os 2 restantes','Resultado: [2, 8, 8, 2] → valência = 2 e⁻'] },
  { sym:'O',  z:8,  layers:[2,6],    type:'nonmetal', name:'Oxigênio',
    steps:['Z = 8 → 8 elétrons para distribuir','Camada K: comporta até 2 → coloca 2 (restam 6)','Camada L: coloca os 6 restantes','Resultado: [2, 6] → valência = 6 e⁻'] },
  { sym:'Mg', z:12, layers:[2,8,2],  type:'metal',    name:'Magnésio',
    steps:['Z = 12 → 12 elétrons para distribuir','Camada K: comporta até 2 → coloca 2 (restam 10)','Camada L: comporta até 8 → coloca 8 (restam 2)','Camada M: coloca os 2 restantes','Resultado: [2, 8, 2] → valência = 2 e⁻'] },
]

// Cards clicáveis do Passo 1
const INFO_CARDS = [
  {
    id:'z',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    label:'Número Atômico (Z)',
    shortText:'Identifica o elemento e define sua estrutura eletrônica.',
    color:'var(--text2)', borderColor:'var(--border2)', bgActive:'rgba(255,255,255,0.05)',
    detail:{
      title:'O que é o Número Atômico?',
      text:'O número atômico (Z) indica a quantidade de prótons no núcleo do átomo. Em um átomo neutro, Z também corresponde ao número de elétrons. É o número que aparece no canto superior esquerdo de cada elemento na tabela periódica.',
      where:'O número atômico fica no canto superior esquerdo da célula de cada elemento na tabela periódica. Quanto maior o Z, mais prótons no núcleo e mais elétrons o átomo possui.',
      exampleLabel:'Exemplo: Sódio (Na)', exLayers:[2,8,1], exType:'metal', exSym:'Na',
      lines:['Z = 11 → 11 prótons no núcleo','11 elétrons no átomo neutro','Distribuição: K=2, L=8, M=1','Camada de valência: 1 elétron'],
    }
  },
  {
    id:'cat',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    label:'Cátions (+)',
    shortText:'Metais que perdem elétrons e ficam com carga positiva.',
    color:'var(--orange)', borderColor:'var(--orange-border)', bgActive:'var(--orange-dim)',
    detail:{
      title:'O que é um Cátion?',
      text:'Um cátion é um íon com carga elétrica positiva. Ele se forma quando um átomo perde um ou mais elétrons, ficando com mais prótons do que elétrons. Os principais formadores de cátions são os metais dos Grupos IA, IIA e IIIA da tabela periódica.',
      where:'Na tabela periódica, os metais ficam no lado esquerdo. Os Grupos IA (alcalinos) e IIA (alcalino-terrosos) são os que mais facilmente perdem elétrons e formam cátions.',
      exampleLabel:'Exemplo: Na → Na⁺', exLayers:[2,8], exType:'metal', exSym:'Na⁺',
      lines:['Na tem Z=11 → 11 prótons e 11 elétrons','Perde 1 elétron da camada de valência','Fica com 11 prótons e 10 elétrons','Carga resultante: +1 → cátion Na⁺'],
    }
  },
  {
    id:'ani',
    icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    label:'Ânions (−)',
    shortText:'Ametais que ganham elétrons e ficam com carga negativa.',
    color:'var(--blue)', borderColor:'var(--blue-border)', bgActive:'var(--blue-dim)',
    detail:{
      title:'O que é um Ânion?',
      text:'Um ânion é um íon com carga elétrica negativa. Ele se forma quando um átomo ganha um ou mais elétrons, ficando com mais elétrons do que prótons. Os principais formadores de ânions são os ametais dos Grupos VA, VIA e VIIA da tabela periódica.',
      where:'Na tabela periódica, os ametais ficam no lado direito. Os Grupos VIA e VIIA são os que mais facilmente ganham elétrons para completar o octeto e formam ânions.',
      exampleLabel:'Exemplo: Cl → Cl⁻', exLayers:[2,8,8], exType:'nonmetal', exSym:'Cl⁻',
      lines:['Cl tem Z=17 → 17 prótons e 17 elétrons','Ganha 1 elétron para completar o octeto','Fica com 17 prótons e 18 elétrons','Carga resultante: −1 → ânion Cl⁻'],
    }
  },
]

function AtomDiagram({ sym, layers, type, size=140 }) {
  const ref = useRef(null)
  useEffect(() => { if (ref.current) ref.current.innerHTML = atomSVG(sym, layers, type, size, size) }, [sym, layers, type, size])
  return <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} />
}

function Tooltip({ elem, pos }) {
  if (!elem) return null
  const color = elem.type==='metal'?'var(--orange)':elem.type==='nonmetal'?'var(--blue)':'var(--text3)'
  const tagBg = elem.type==='metal'?'var(--orange-dim)':elem.type==='nonmetal'?'var(--blue-dim)':'rgba(255,255,255,0.06)'
  const typeLabel = {metal:'Metal',nonmetal:'Ametal',dim:'Outro',lan:''}[elem.type]||''
  return (
    <div style={{position:'fixed',left:pos.x+14,top:pos.y-10,background:'#1e2d45',border:'1px solid var(--border2)',borderRadius:10,padding:'9px 12px',fontSize:12,zIndex:1000,pointerEvents:'none',minWidth:140,animation:'popIn 0.1s ease'}}>
      <div style={{fontSize:17,fontWeight:800,color}}>{elem.sym}</div>
      <div style={{color:'var(--text2)',fontSize:11,marginBottom:typeLabel?3:0}}>{elem.name} · Z={elem.z}</div>
      {typeLabel&&<span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:5,background:tagBg,color}}>{typeLabel}</span>}
    </div>
  )
}

function PeriodicTable() {
  const [tooltip, setTooltip] = useState(null)
  const [pos, setPos] = useState({x:0,y:0})
  const cells = {}
  PERIODIC.forEach(e => { cells[`${e.row}-${e.col}`] = e })
  const typeStyle = {
    metal:    {background:'var(--orange-dim)',borderColor:'var(--orange-border)'},
    nonmetal: {background:'var(--blue-dim)',  borderColor:'var(--blue-border)'},
    dim:      {background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.07)'},
    lan:      {background:'rgba(167,139,250,0.08)',borderColor:'rgba(167,139,250,0.18)'},
  }
  const symColor = {metal:'var(--orange)',nonmetal:'var(--blue)',dim:'var(--text3)',lan:'rgba(167,139,250,0.5)'}
  const grid = []
  for (let r=1;r<=7;r++) for (let c=1;c<=18;c++) {
    const e = cells[`${r}-${c}`]
    grid.push(
      <div key={`${r}-${c}`}
        style={{aspectRatio:'1',borderRadius:4,border:'1px solid transparent',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:e?.z?'pointer':'default',transition:'transform 0.1s,opacity 0.1s',...(e?typeStyle[e.type]||typeStyle.dim:{})}}
        onMouseEnter={e?.z?ev=>{setTooltip(e);setPos({x:ev.clientX,y:ev.clientY});ev.currentTarget.style.transform='scale(1.3)';ev.currentTarget.style.zIndex='10';ev.currentTarget.style.opacity='0.85'}:undefined}
        onMouseLeave={e?.z?ev=>{setTooltip(null);ev.currentTarget.style.transform='scale(1)';ev.currentTarget.style.zIndex='1';ev.currentTarget.style.opacity='1'}:undefined}
        onMouseMove={e?.z?ev=>setPos({x:ev.clientX,y:ev.clientY}):undefined}
      >
        {e&&<>
          <span style={{fontSize:6,color:'var(--text3)',lineHeight:1,alignSelf:'flex-start',padding:'2px 2px 0'}}>{e.z||''}</span>
          <span style={{fontSize:11,fontWeight:700,lineHeight:1.1,color:symColor[e.type]||'var(--text3)'}}>{e.sym}</span>
        </>}
      </div>
    )
  }
  return (
    <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1rem',marginBottom:'1.2rem',overflowX:'auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(18,1fr)',gap:2,minWidth:560}}>{grid}</div>
      <div style={{display:'flex',gap:'1.2rem',flexWrap:'wrap',marginTop:'1rem'}}>
        {[['var(--orange)','Metais (Grupos IA, IIA, IIIA) — formam cátions (+)'],['var(--blue)','Ametais (Grupos VA, VIA, VIIA) — formam ânions (−)'],['var(--text3)','Semimetais / Gases nobres / Outros']].map(([color,label],i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'var(--text2)'}}>
            <div style={{width:9,height:9,borderRadius:2,background:color,opacity:0.7,flexShrink:0}}/>{label}
          </div>
        ))}
      </div>
      <Tooltip elem={tooltip} pos={pos}/>
    </div>
  )
}

function SidebarStep({num,label,current,onClick}) {
  const active=current===num, done=current>num
  return (
    <div onClick={onClick} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,cursor:'pointer',marginBottom:4,border:`1px solid ${active?'var(--teal-border)':'transparent'}`,background:active?'var(--teal-dim)':'transparent',opacity:done?0.7:1}}>
      <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0,border:`1.5px solid ${active?'var(--teal)':done?'var(--teal-border)':'var(--border2)'}`,background:active?'var(--teal)':done?'rgba(78,205,196,0.2)':'transparent',color:active?'#0a1628':done?'var(--teal)':'var(--text2)'}}>
        {done?'✓':num}
      </div>
      <span style={{fontSize:13,color:active?'var(--text)':'var(--text2)',fontWeight:active?600:400}}>{label}</span>
    </div>
  )
}

// ── Componente de distribuição eletrônica (teórico + visual) ─────────────────
function DistribuicaoCamadas({ selAtom, setSelAtom }) {
  const CAMADAS = [
    { letra:'K', max:2,  cor:'#f87171', desc:'1ª camada — mais próxima do núcleo' },
    { letra:'L', max:8,  cor:'#fb923c', desc:'2ª camada' },
    { letra:'M', max:18, cor:'#facc15', desc:'3ª camada — máx. 18 elétrons' },
    { letra:'N', max:18, cor:'#4ade80', desc:'4ª camada — máx. 18 elétrons' },
    { letra:'O', max:8,  cor:'#34d399', desc:'5ª camada — máx. 8 elétrons' },
    { letra:'P', max:6,  cor:'#60a5fa', desc:'6ª camada — máx. 6 elétrons' },
    { letra:'Q', max:2,  cor:'#a78bfa', desc:'7ª camada — máx. 2 elétrons' },
  ]

  const filled = selAtom.layers

  return (
    <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>

      {/* Seletor */}
      <div style={{display:'flex',gap:8,marginBottom:'1.2rem',flexWrap:'wrap'}}>
        {DISTRIB_EXAMPLES.map(a=>(
          <button key={a.sym} onClick={()=>setSelAtom(a)}
            style={{padding:'6px 16px',borderRadius:8,border:`1px solid ${selAtom.sym===a.sym?(a.type==='metal'?'var(--orange-border)':'var(--blue-border)'):'var(--border2)'}`,background:selAtom.sym===a.sym?(a.type==='metal'?'var(--orange-dim)':'var(--blue-dim)'):'var(--card2)',color:selAtom.sym===a.sym?(a.type==='metal'?'var(--orange)':'var(--blue)'):'var(--text2)',fontSize:13,fontWeight:600,cursor:'pointer',transition:'all 0.15s'}}>
            {a.sym} (Z={a.z})
          </button>
        ))}
      </div>

      <div style={{display:'flex',gap:'2rem',flexWrap:'wrap',alignItems:'flex-start'}} key={selAtom.sym}>

        {/* LADO TEÓRICO */}
        <div style={{flex:1,minWidth:240}}>
          <div style={{fontSize:13,fontWeight:700,color:'var(--teal)',marginBottom:'1rem',letterSpacing:0.5}}>
            Distribuição passo a passo — {selAtom.name} (Z={selAtom.z})
          </div>

          {/* Tabela de camadas */}
          <div style={{background:'var(--card2)',borderRadius:12,overflow:'hidden',marginBottom:'1rem'}}>
            <div style={{display:'grid',gridTemplateColumns:'40px 80px 80px 1fr',fontSize:11,fontWeight:700,color:'var(--text3)',padding:'8px 14px',borderBottom:'1px solid var(--border)',textTransform:'uppercase',letterSpacing:1}}>
              <span>Cam.</span><span>Letra</span><span>Máx.</span><span>Regra (EM)</span>
            </div>
            {CAMADAS.map((c,i)=>(
              <div key={c.letra} style={{display:'grid',gridTemplateColumns:'40px 80px 80px 1fr',padding:'8px 14px',borderBottom:i<CAMADAS.length-1?'1px solid var(--border)':'none',background:filled[i]!=null?'rgba(255,255,255,0.02)':'transparent',opacity:filled[i]!=null?1:0.35}}>
                <span style={{fontSize:13,fontWeight:700,color:c.cor}}>{i+1}ª</span>
                <span style={{fontSize:13,fontWeight:700,color:c.cor}}>{c.letra}</span>
                <span style={{fontSize:13,color:'var(--text2)'}}>{c.max} e⁻</span>
                <span style={{fontSize:12,color:'var(--text3)'}}>{c.desc}</span>
              </div>
            ))}
          </div>

          {/* Passos */}
          <div style={{fontSize:12,fontWeight:700,color:'var(--text3)',letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Como distribuir</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {selAtom.steps.map((s,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',animation:`fadeIn 0.2s ease ${i*0.05}s both`}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:'var(--teal-dim)',border:'1px solid var(--teal-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:'var(--teal)',flexShrink:0,marginTop:1}}>{i+1}</div>
                <span style={{fontSize:13,color:i===selAtom.steps.length-1?'var(--text)':'var(--text2)',lineHeight:1.5,fontWeight:i===selAtom.steps.length-1?700:400}}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LADO VISUAL */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'var(--text3)',letterSpacing:1,textTransform:'uppercase'}}>Diagrama</div>
          <AtomDiagram sym={selAtom.sym} layers={selAtom.layers} type={selAtom.type} size={180}/>

          {/* Legenda das camadas */}
          <div style={{display:'flex',flexDirection:'column',gap:6,width:'100%'}}>
            {filled.map((n,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:12,height:12,borderRadius:'50%',background:CAMADAS[i]?.cor||'var(--teal)',flexShrink:0}}/>
                <span style={{fontSize:12,color:'var(--text2)'}}>Camada {CAMADAS[i]?.letra||'?'}: <strong style={{color:'var(--text)'}}>{n} e⁻</strong></span>
                {i===filled.length-1 && <span style={{fontSize:10,fontWeight:700,padding:'1px 7px',borderRadius:5,background:selAtom.type==='metal'?'var(--orange-dim)':'var(--blue-dim)',color:selAtom.type==='metal'?'var(--orange)':'var(--blue)',border:`1px solid ${selAtom.type==='metal'?'var(--orange-border)':'var(--blue-border)'}`}}>valência</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Teoria() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [activeCard, setActiveCard] = useState(null)
  const [selAtom, setSelAtom] = useState(DISTRIB_EXAMPLES[0])
  const [selExplorer, setSelExplorer] = useState(SHELL_ATOMS[0])

  const openCard = INFO_CARDS.find(c => c.id === activeCard)

  return (
    <>
      <Background />
      <Navbar />
      <div style={{display:'flex',paddingTop:56,minHeight:'100vh',position:'relative',zIndex:1}}>

        <aside style={{width:220,flexShrink:0,padding:'2rem 1rem',borderRight:'1px solid var(--border)',position:'sticky',top:56,height:'calc(100vh - 56px)',overflowY:'auto'}}>
          <div style={{fontSize:10,letterSpacing:'1.5px',fontWeight:700,color:'var(--text3)',textTransform:'uppercase',marginBottom:'1rem'}}>Progresso</div>
          <SidebarStep num={1} label="Tabela Periódica"        current={step} onClick={()=>setStep(1)}/>
          <SidebarStep num={2} label="Distribuição Eletrônica" current={step} onClick={()=>setStep(2)}/>
        </aside>

        <main style={{flex:1,padding:'2.5rem 2rem',maxWidth:900,overflowY:'auto'}}>

          {/* ── PASSO 1: Tabela Periódica + cards clicáveis ── */}
          {step===1&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 1 de 2</div>
              <h1 style={h1}>Tabela Periódica</h1>
              <p style={intro}>
                A posição de um elemento na tabela periódica determina seu comportamento nas ligações iônicas.
                <strong style={{color:'var(--orange)'}}> Metais</strong> (esquerda) tendem a perder elétrons e
                <strong style={{color:'var(--blue)'}}> ametais</strong> (direita) tendem a ganhar.
                Passe o mouse sobre qualquer elemento para ver sua classificação.
              </p>

              <PeriodicTable/>

              {/* Cards clicáveis */}
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:openCard?0:'1.5rem'}}>
                {INFO_CARDS.map(card=>{
                  const isActive = activeCard===card.id
                  return (
                    <button key={card.id} onClick={()=>setActiveCard(prev=>prev===card.id?null:card.id)}
                      style={{background:isActive?card.bgActive:'var(--card)',border:`1px solid ${isActive?card.borderColor:'var(--border2)'}`,borderRadius:isActive?'14px 14px 0 0':14,padding:'1.1rem',cursor:'pointer',textAlign:'left',transition:'all 0.2s',outline:'none',position:'relative'}}
                      onMouseEnter={e=>{if(!isActive){e.currentTarget.style.borderColor=card.borderColor;e.currentTarget.style.background=card.bgActive}}}
                      onMouseLeave={e=>{if(!isActive){e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.background='var(--card)'}}}
                    >
                      <div style={{width:34,height:34,borderRadius:9,background:isActive?'rgba(255,255,255,0.1)':'rgba(255,255,255,0.05)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10,color:isActive?card.color:'var(--text3)'}}>
                        {card.icon}
                      </div>
                      <div style={{fontSize:14,fontWeight:700,color:isActive?card.color:'var(--text)',marginBottom:5}}>{card.label}</div>
                      <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.5}}>{card.shortText}</div>
                      <div style={{position:'absolute',bottom:10,right:12,fontSize:16,color:isActive?card.color:'var(--text3)',transition:'transform 0.2s',transform:isActive?'rotate(180deg)':'rotate(0deg)'}}>⌄</div>
                    </button>
                  )
                })}
              </div>

              {/* Painel expandido */}
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
                <strong style={{color:'var(--teal)'}}>Atenção:</strong> existem exceções. O ferro (Fe) pode formar Fe²⁺ ou Fe³⁺ dependendo da ligação. Nesses casos usa-se algarismos romanos: <strong>cloreto de ferro (II)</strong> para FeCl₂ e <strong>cloreto de ferro (III)</strong> para FeCl₃.
              </div>

              <button style={btnC} onClick={()=>setStep(2)}>Próximo →</button>
            </div>
          )}

          {/* ── PASSO 2: Distribuição Eletrônica ── */}
          {step===2&&(
            <div style={{animation:'fadeIn 0.3s ease'}}>
              <div style={si}>Passo 2 de 2</div>
              <h1 style={h1}>Distribuição Eletrônica</h1>
              <p style={intro}>
                Os elétrons de um átomo se organizam em <strong>camadas</strong> ao redor do núcleo, preenchidas da mais interna para a mais externa.
                Cada camada comporta um número máximo de elétrons. A <strong>camada de valência</strong> — a última a ser preenchida — é a que determina o comportamento do elemento nas ligações iônicas.
              </p>

              {/* Regra geral — tabela + explicação */}
              <div style={{background:'var(--card)',border:'1px solid var(--border2)',borderRadius:16,padding:'1.5rem',marginBottom:'1.5rem'}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Regra de distribuição (Ensino Médio)</div>
                <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:'1rem'}}>
                  Os elétrons preenchem as camadas em ordem, da mais interna para a mais externa, respeitando o número máximo de cada uma. No nível do Ensino Médio, usamos a seguinte simplificação para os primeiros elementos:
                </p>
                <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:8,marginBottom:'1rem'}}>
                  {[{letra:'K',max:2,cor:'#f87171',n:'1ª camada'},{letra:'L',max:8,cor:'#fb923c',n:'2ª camada'},{letra:'M',max:18,cor:'#facc15',n:'3ª camada'},{letra:'N',max:18,cor:'#4ade80',n:'4ª camada'},{letra:'O',max:8,cor:'#34d399',n:'5ª camada'},{letra:'P',max:6,cor:'#60a5fa',n:'6ª camada'},{letra:'Q',max:2,cor:'#a78bfa',n:'7ª camada'}].map(c=>(
                    <div key={c.letra} style={{background:'var(--card2)',border:'1px solid var(--border2)',borderRadius:12,padding:'1rem',textAlign:'center'}}>
                      <div style={{fontSize:26,fontWeight:800,color:c.cor,marginBottom:4}}>{c.letra}</div>
                      <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>máx. {c.max} e⁻</div>
                      <div style={{fontSize:11,color:'var(--text3)'}}>{c.n}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:'var(--card2)',borderRadius:10,padding:'10px 14px',fontSize:13,color:'var(--text2)',lineHeight:1.7,marginBottom:8}}>
                  <strong style={{color:'var(--teal)'}}>Como distribuir:</strong> preencha as camadas em ordem (K → L → M → ...) até os elétrons acabarem. O que sobrar na última camada são os <strong>elétrons de valência</strong>.
                </div>
                <div style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'var(--text2)',lineHeight:1.6}}>
                  <strong style={{color:'#a78bfa'}}>Observação:</strong> para os elementos estudados neste módulo (Z ≤ 20), as camadas usadas vão até no máximo a <strong>N</strong>. As camadas O, P e Q aparecem apenas em elementos mais pesados da tabela periódica.
                </div>
              </div>

              {/* Teórico + Visual interativo */}
              <div style={{fontSize:14,fontWeight:700,color:'var(--text2)',marginBottom:'0.8rem'}}>
                Experimente — selecione um elemento e veja a distribuição passo a passo:
              </div>
              <DistribuicaoCamadas selAtom={selAtom} setSelAtom={setSelAtom}/>

              {/* Cards de regra metal/ametal */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:'1.5rem'}}>
                <div style={ruleCard}>
                  <h4 style={{fontSize:14,fontWeight:700,marginBottom:8}}><span style={tagM}>Metais — Grupos IA, IIA, IIIA</span></h4>
                  <p style={ruleText}>Têm 1, 2 ou 3 elétrons na camada de valência. É mais fácil <strong>perder</strong> esses poucos elétrons do que ganhar muitos para completar 8 (regra do octeto).</p>
                </div>
                <div style={ruleCard}>
                  <h4 style={{fontSize:14,fontWeight:700,marginBottom:8}}><span style={tagN}>Ametais — Grupos VA, VIA, VIIA</span></h4>
                  <p style={ruleText}>Têm 5, 6 ou 7 elétrons na camada de valência. É mais fácil <strong>ganhar</strong> os elétrons que faltam para completar 8 (regra do octeto).</p>
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

const si       = {fontSize:13,color:'var(--text2)',marginBottom:8}
const h1       = {fontSize:26,fontWeight:800,marginBottom:'1rem'}
const intro    = {fontSize:14,color:'var(--text2)',lineHeight:1.7,marginBottom:'1.2rem'}
const ruleCard = {background:'var(--card)',border:'1px solid var(--border2)',borderRadius:14,padding:'1.2rem'}
const ruleText = {fontSize:13,color:'var(--text2)',lineHeight:1.6}
const tagM     = {fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:5,background:'var(--orange-dim)',color:'var(--orange)',marginRight:8}
const tagN     = {fontSize:11,fontWeight:700,padding:'2px 8px',borderRadius:5,background:'var(--blue-dim)',color:'var(--blue)',marginRight:8}
const btnC     = {display:'flex',alignItems:'center',gap:8,padding:'13px 28px',background:'var(--teal)',color:'#0a1628',fontSize:15,fontWeight:700,border:'none',borderRadius:12,cursor:'pointer'}
const btnV     = {padding:'10px 20px',background:'transparent',border:'1px solid var(--border2)',color:'var(--text2)',fontSize:14,fontWeight:600,borderRadius:10,cursor:'pointer'}
