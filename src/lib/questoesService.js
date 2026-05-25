import { supabase } from './supabase'

/**
 * Busca questões aleatórias do banco para uma lista de temas
 * Garante pelo menos `minDnd` questões do tipo drag & drop
 */
export async function fetchQuestoes(temaIds, total = 5, minDnd = 1) {
  // 1. Buscar todas as questões DnD dos temas
  const { data: dndAll, error: e1 } = await supabase
    .from('questao')
    .select('*, elemento_dnd(*)')
    .in('tema_id', temaIds)
    .eq('tipo', 'dnd')
    .eq('ativo', true)

  if (e1) throw e1

  // 2. Buscar todas as questões MC dos temas
  const { data: mcAll, error: e2 } = await supabase
    .from('questao')
    .select('*, opcao_mc(*)')
    .in('tema_id', temaIds)
    .eq('tipo', 'mc')
    .eq('ativo', true)

  if (e2) throw e2

  // 3. Embaralhar
  const shuffle = arr => [...(arr || [])].sort(() => Math.random() - 0.5)

  // 4. Ordenar opções MC por `ordem`
  const mcFormatado = (mcAll || []).map(q => ({
    ...q,
    opcao_mc: [...(q.opcao_mc || [])].sort((a, b) => a.ordem - b.ordem),
  }))

  // 5. Sortear: primeiro DnDs, depois MCs para completar
  const dndPick = shuffle(dndAll).slice(0, minDnd)
  const mcPick  = shuffle(mcFormatado).slice(0, total - dndPick.length)

  // 6. Misturar e retornar
  return shuffle([...dndPick, ...mcPick])
}
