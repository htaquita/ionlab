# IonLab — Plataforma de Exercícios de Química

Plataforma gamificada de exercícios sobre **Ligações Iônicas** para o 1º ano do Ensino Médio (BNCC EM13CNT201).

## Instalação

```bash
npm install
npm run dev
```

## Estrutura do Projeto

```
src/
├── main.jsx               # Entrada da aplicação
├── App.jsx                # Roteamento principal
├── context/
│   └── UserContext.jsx    # Estado global do usuário (XP, progresso, badges)
├── styles/
│   └── globals.css        # Variáveis CSS e animações globais
├── data/
│   └── elements.js        # Dados dos elementos, íons, compostos e questões do quiz
├── utils/
│   └── drawAtom.js        # Gerador de SVG para diagramas de elétrons
├── components/
│   ├── Background.jsx     # Partículas decorativas de fundo
│   ├── Navbar.jsx         # Barra de navegação com lógica de popup
│   ├── PopupAviso.jsx     # Popup de confirmação ao sair de exercício
│   ├── FeedbackBar.jsx    # Barra de feedback (acerto/erro)
│   ├── ProgressDots.jsx   # Indicador de progresso dos exercícios
│   └── ResultadoBase.jsx  # Tela de resultado reutilizável
└── pages/
    ├── Login.jsx
    ├── Cadastro.jsx
    ├── Mapa.jsx           # Mapa de módulos com progresso
    ├── Perfil.jsx         # Perfil do aluno com stats e badges
    ├── modulo1/
    │   ├── Teoria.jsx     # Tabela periódica + explicação de íons
    │   ├── Exercicios.jsx # Drag & drop + múltipla escolha
    │   └── Resultado.jsx
    ├── modulo2/
    │   ├── Teoria.jsx     # Camadas eletrônicas + animação de transferência
    │   ├── Exercicios.jsx # Arrastar elétron + múltipla escolha
    │   └── Resultado.jsx
    ├── modulo3/
    │   ├── Teoria.jsx     # Combinador de fórmulas + nomenclatura
    │   ├── Exercicios.jsx # Montar fórmula + nomear composto
    │   └── Resultado.jsx
    └── modulo4/
        ├── Intro.jsx      # Tela de introdução do desafio final
        ├── Quiz.jsx       # Quiz com 10 questões, 3 fases e timer
        └── Resultado.jsx
```

## Módulos de Conteúdo

| Módulo | Tema | Exercícios |
|--------|------|------------|
| 1 | Identificação de Íons | Drag & drop na tabela periódica, classificação cátion/ânion |
| 2 | Ligações Iônicas | Arrastar elétron, transferência visual, múltipla escolha |
| 3 | Fórmulas e Nomenclatura | Combinar íons, balancear cargas, nomear composto |
| 4 | Desafio Final | Quiz com 10 questões, timer de 20s, bônus de velocidade |

## Gamificação

- **XP** acumulado por acertos e bônus de velocidade
- **Sequência (streak)** de dias consecutivos
- **Badges** desbloqueados ao completar módulos
- **Progresso** salvo no contexto global (adaptar para localStorage ou backend)
- **Timer** de 20s por questão no Módulo 4

## Tecnologias

- React 18 + Vite
- React Router DOM v6
- CSS custom properties (sem Tailwind — estilos inline + globals.css)
- Context API para estado global

## Próximos passos (VSCode)

1. Implementar `Teoria.jsx`, `Exercicios.jsx` e `Resultado.jsx` de cada módulo usando os protótipos HTML gerados como referência
2. Conectar `addXP()` e `setProgress()` do UserContext ao completar exercícios
3. Adicionar persistência com `localStorage` ou backend (ex: Supabase)
4. Corrigir animação de transferência de elétrons no Módulo 2
