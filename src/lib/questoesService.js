import { supabase } from './supabase'

/**
 * Busca questões aleatórias do banco para uma lista de temas.
 * Garante pelo menos `minDnd` questões do tipo drag & drop.
 */
export async function fetchQuestoes(temaIds, total = 5, minDnd = 1) {
  const { data: dndAll, error: e1 } = await supabase
    .from('questao')
    .select('*, elemento_dnd(*)')
    .in('tema_id', temaIds)
    .eq('tipo', 'dnd')
    .eq('ativo', true)

  if (e1) throw e1

  const { data: mcAll, error: e2 } = await supabase
    .from('questao')
    .select('*, opcao_mc(*)')
    .in('tema_id', temaIds)
    .eq('tipo', 'mc')
    .eq('ativo', true)

  if (e2) throw e2

  const shuffle = arr => [...(arr || [])].sort(() => Math.random() - 0.5)

  const mcFormatado = (mcAll || []).map(q => ({
    ...q,
    opcao_mc: [...(q.opcao_mc || [])].sort((a, b) => a.ordem - b.ordem),
  }))

  const dndPick = shuffle(dndAll).slice(0, minDnd)
  const mcPick  = shuffle(mcFormatado).slice(0, total - dndPick.length)

  return shuffle([...dndPick, ...mcPick])
}

/**
 * Salva uma sessão de exercício e suas respostas no banco.
 */
export async function salvarSessao(usuarioId, temaId, questoes, respostas) {
  try {
    const score    = respostas.filter(r => r.acertou).length
    const xpGanho  = score * 10

    const { data: sessao, error: e1 } = await supabase
      .from('sessao_exercicio')
      .insert({
        usuario_id:     usuarioId,
        tema_id:        temaId,
        total_questoes: questoes.length,
        score,
        xp_ganho:       xpGanho,
        concluida:       true,
        finalizada_em:  new Date().toISOString(),
      })
      .select()
      .single()

    if (e1) throw e1

    // Inserir quais questões foram sorteadas
    await supabase.from('questao_sessao').insert(
      questoes.map((q, i) => ({
        sessao_id:  sessao.id,
        questao_id: q.id,
        ordem:      i + 1,
      }))
    )

    // Inserir respostas individuais
    await supabase.from('resposta').insert(
      respostas.map(r => ({
        sessao_id:      sessao.id,
        questao_id:     r.questaoId,
        acertou:        r.acertou,
        tentativas:     1,
        tempo_segundos: r.tempo || null,
      }))
    )

    return sessao
  } catch (e) {
    console.error('Erro ao salvar sessão:', e)
    return null
  }
}