export const COMPOUNDS = {
  'Na-Cl':{ f:'NaCl',   n:'Cloreto de sódio' },
  'Na-O': { f:'Na₂O',  n:'Óxido de sódio' },
  'Na-F': { f:'NaF',   n:'Fluoreto de sódio' },
  'Na-S': { f:'Na₂S',  n:'Sulfeto de sódio' },
  'Ca-Cl':{ f:'CaCl₂', n:'Cloreto de cálcio' },
  'Ca-O': { f:'CaO',   n:'Óxido de cálcio' },
  'Ca-F': { f:'CaF₂',  n:'Fluoreto de cálcio' },
  'Ca-S': { f:'CaS',   n:'Sulfeto de cálcio' },
  'K-Cl': { f:'KCl',   n:'Cloreto de potássio' },
  'K-O':  { f:'K₂O',   n:'Óxido de potássio' },
  'K-F':  { f:'KF',    n:'Fluoreto de potássio' },
  'K-S':  { f:'K₂S',   n:'Sulfeto de potássio' },
  'Mg-Cl':{ f:'MgCl₂', n:'Cloreto de magnésio' },
  'Mg-O': { f:'MgO',   n:'Óxido de magnésio' },
  'Mg-F': { f:'MgF₂',  n:'Fluoreto de magnésio' },
  'Mg-S': { f:'MgS',   n:'Sulfeto de magnésio' },
  'Al-Cl':{ f:'AlCl₃', n:'Cloreto de alumínio' },
  'Al-O': { f:'Al₂O₃', n:'Óxido de alumínio' },
  'Al-F': { f:'AlF₃',  n:'Fluoreto de alumínio' },
  'Al-S': { f:'Al₂S₃', n:'Sulfeto de alumínio' },
}

// ── Questões do Quiz Final (Módulo 4) ──────────────────────────────────────
// Fonte: baseadas em questões ENEM/vestibulares e literatura de ensino de química
// Referências: Toda Matéria, Só Química, Brady (2005), IUPAC recommendations
export const QUIZ_QUESTIONS = [
  // ── FASE 1: Identificação de Íons ──────────────────────────────────────
  {
    phase: 1,
    type: 'mc',
    text: 'Qual dos elementos abaixo pertence ao grupo dos metais alcalinos e, portanto, forma um CÁTION ao participar de uma ligação iônica?',
    hint: 'Metais alcalinos ficam no Grupo IA da tabela periódica e possuem apenas 1 elétron na camada de valência.',
    opts: ['Cloro (Cl) — Grupo VIIA', 'Oxigênio (O) — Grupo VIA', 'Sódio (Na) — Grupo IA', 'Enxofre (S) — Grupo VIA'],
    correct: 2,
    explanation: 'O sódio (Na) é um metal alcalino (Grupo IA). Possui 1 elétron na camada de valência, que perde facilmente, formando o cátion Na⁺.'
  },
  {
    phase: 1,
    type: 'mc',
    text: 'Um átomo de cloro (Cl) possui número atômico 17 e distribuição eletrônica [2, 8, 7]. Ao participar de uma ligação iônica, ele irá:',
    hint: 'Ametais com 7 elétrons na camada de valência estão a apenas 1 elétron de completar o octeto.',
    opts: [
      'Perder 7 elétrons, formando Cl⁷⁺',
      'Ganhar 1 elétron, formando Cl⁻',
      'Perder 1 elétron, formando Cl⁺',
      'Não sofrer alteração, pois já é estável',
    ],
    correct: 1,
    explanation: 'O cloro tem 7 elétrons na última camada. É mais fácil ganhar 1 elétron do que perder 7, completando 8 elétrons (octeto) e formando o ânion Cl⁻.'
  },
  {
    phase: 1,
    type: 'dnd',
    text: 'Classifique os elementos abaixo em Cátion (+) ou Ânion (−), com base em sua posição na tabela periódica.',
    hint: 'Metais (grupos IA, IIA, IIIA) → perdem elétrons → cátion (+). Ametais (grupos VA, VIA, VIIA) → ganham elétrons → ânion (−).',
    elems: ['K', 'F', 'Mg', 'O'],
    answers: { K: 'cat', F: 'ani', Mg: 'cat', O: 'ani' },
    explanation: 'K (Grupo IA) e Mg (Grupo IIA) são metais → formam cátions. F (Grupo VIIA) e O (Grupo VIA) são ametais → formam ânions.'
  },

  // ── FASE 2: Ligações Iônicas ────────────────────────────────────────────
  {
    phase: 2,
    type: 'mc',
    text: 'Na formação do cloreto de sódio (NaCl), o que ocorre com os elétrons entre Na e Cl?',
    hint: 'NaCl é o sal de cozinha. Na tem 1 elétron de valência; Cl precisa de 1 para completar 8.',
    opts: [
      'Na e Cl compartilham 1 elétron igualmente',
      'O Na transfere 1 elétron para o Cl, formando Na⁺ e Cl⁻',
      'O Cl transfere 1 elétron para o Na, formando Na⁻ e Cl⁺',
      'Nenhum elétron é transferido — há apenas aproximação dos átomos',
    ],
    correct: 1,
    explanation: 'Na possui 1 elétron de valência e o transfere completamente para o Cl. O Na fica com carga +1 (Na⁺) e o Cl com carga −1 (Cl⁻). A atração eletrostática entre eles forma a ligação iônica.'
  },
  {
    phase: 2,
    type: 'mc',
    text: 'O óxido de cálcio (CaO), conhecido como cal virgem, é amplamente usado na construção civil. Qual tipo de ligação está presente no CaO?',
    hint: 'Identifique os elementos: Ca é metal (Grupo IIA) e O é ametal (Grupo VIA).',
    opts: [
      'Ligação covalente — Ca e O compartilham elétrons',
      'Ligação metálica — os elétrons circulam livremente entre os Ca',
      'Ligação iônica — Ca²⁺ e O²⁻ se atraem eletrostaticamente',
      'Não há ligação química — CaO é um elemento simples',
    ],
    correct: 2,
    explanation: 'Ca (metal, Grupo IIA) perde 2 elétrons → Ca²⁺. O (ametal, Grupo VIA) ganha 2 elétrons → O²⁻. A atração eletrostática entre Ca²⁺ e O²⁻ forma a ligação iônica, característica de compostos metal-ametal.'
  },
  {
    phase: 2,
    type: 'mc',
    text: 'Por que o magnésio (Mg, Z=12) forma o íon Mg²⁺ e não Mg⁶⁺?',
    hint: 'Distribuição eletrônica do Mg: [2, 8, 2]. Pense em quantos elétrons estão na camada de valência.',
    opts: [
      'Porque o Mg tem 6 elétrons na última camada e os perde todos',
      'Porque o Mg tem 2 elétrons na última camada e é mais fácil perdê-los do que ganhar 6',
      'Porque o Mg ganha 2 elétrons de outro átomo',
      'Porque o número atômico do Mg é par',
    ],
    correct: 1,
    explanation: 'O Mg tem distribuição [2, 8, 2]. Com apenas 2 elétrons na camada de valência, é muito mais fácil perdê-los (formando Mg²⁺ com octeto na camada anterior) do que ganhar 6 elétrons para completar 8.'
  },

  // ── FASE 3 — Boss: Fórmulas e Nomenclatura ─────────────────────────────
  {
    phase: 3,
    type: 'mc',
    text: 'Qual é o nome correto do composto Al₂O₃, de acordo com a nomenclatura IUPAC para compostos iônicos?',
    hint: 'Regra IUPAC: nome do ânion (com sufixo -eto ou -ido) + "de" + nome do cátion.',
    opts: [
      'Óxido de alumínio',
      'Alumínio de óxido',
      'Trióxido de dialumínio',
      'Alumineto de oxigênio',
    ],
    correct: 0,
    explanation: 'Pela nomenclatura IUPAC para compostos iônicos: ânion primeiro (O²⁻ = óxido) + "de" + cátion (Al³⁺ = alumínio) → Óxido de alumínio. Os prefixos numéricos (di, tri) são usados na nomenclatura de compostos covalentes, não iônicos.'
  },
  {
    phase: 3,
    type: 'mc',
    text: 'Aplicando a regra do cruzamento de cargas, qual é a fórmula correta do composto formado por K⁺ e S²⁻?',
    hint: 'Cruze as cargas: o valor numérico da carga de cada íon vira o índice do outro. Simplifique se necessário.',
    opts: ['KS', 'K₂S', 'KS₂', 'K₂S₃'],
    correct: 1,
    explanation: 'K⁺ (carga +1) e S²⁻ (carga −2). Cruzando: K recebe índice 2, S recebe índice 1 → K₂S. Verificação: 2×(+1) + 1×(−2) = 0 ✓. Nome: sulfeto de potássio.'
  },
  {
    phase: 3,
    type: 'mc',
    text: 'O sal de cozinha (NaCl) dissolve-se em água e a solução resultante conduz eletricidade. Qual é a explicação correta para esse fenômeno?',
    hint: 'Pense no que acontece com os íons Na⁺ e Cl⁻ quando o NaCl é colocado em água.',
    opts: [
      'A água doa elétrons ao NaCl, tornando-o condutor',
      'A água separa os íons Na⁺ e Cl⁻, que ficam livres para conduzir corrente elétrica',
      'O NaCl se transforma em um metal ao dissolver-se',
      'A condução ocorre pelos átomos de H e O da água',
    ],
    correct: 1,
    explanation: 'A água, por ser solvente polar, envolve e separa os íons da rede cristalina do NaCl. Os íons Na⁺ e Cl⁻ ficam livres em solução e são os responsáveis por conduzir a corrente elétrica — essa propriedade é característica dos compostos iônicos dissolvidos.'
  },
  {
    phase: 3,
    type: 'mc',
    text: 'BOSS: O fosfato de cálcio Ca₃(PO₄)₂ é o principal mineral dos ossos humanos. Qual é a carga do íon fosfato (PO₄) nesse composto?',
    hint: 'Para o composto ser eletricamente neutro, a soma das cargas deve ser zero. Há 3 íons Ca²⁺.',
    opts: [
      'PO₄¹⁻ — carga −1',
      'PO₄²⁻ — carga −2',
      'PO₄³⁻ — carga −3',
      'PO₄⁴⁻ — carga −4',
    ],
    correct: 2,
    explanation: '3 íons Ca²⁺ contribuem com carga total +6. Para neutralizar, 2 íons fosfato devem contribuir com −6. Portanto: 2 × PO₄ = −6 → cada PO₄ tem carga −3. O íon fosfato é PO₄³⁻. Verificação: 3×(+2) + 2×(−3) = 6 − 6 = 0 ✓'
  },
]
