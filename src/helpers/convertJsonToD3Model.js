import { nodeTypes } from '../library/D3Tree/constants'

// procura e retorna o nó baseado em seu code
const getNode = (code, data) => {
  return data.node.find(node => node.code === code)
}

/*
Essa função apenas cria uma listagem de children dentro de cada node
*/
const gerarListagemDeChildren = (data) => {
  /*
  Percorre cada item de flow
  */
  data.flow.forEach(flow => {
    // Encontra quem é o nó "pai"/superior a partir do code e do tipo do nó
    const parent = getNode(nodeTypes.isProducaoSaida(flow.type) ? flow.nodeIn : flow.nodeOut, data)
    // Se já tiver uma propriedade children utiliza, senão a instancia como uma array vazia
    parent.children = parent.children || []

    // Encontra quem é o nó "filho"/inferior a partir do code e do tipo do nó
    const child = getNode(nodeTypes.isProducaoSaida(flow.type) ? flow.nodeOut : flow.nodeIn, data)

    // seta hasParente = true, pois um nó sem pais é o primeiro da lista
    child.hasParent = true

    // adiciona o nó filho encontrado a listagem de filhos do nó pai
    const node = child
    node.flow = flow
    parent.children.push(node)
  })

  localStorage.data = JSON.stringify(data)
  console.log(data)
  // retorna a mesma listagem, agora com as propriedades children nos nós
  return data
}

export const convertJsonToTree = (data) => {
  // gera listagem de children dentro de cada nó para formar a arvore
  data = gerarListagemDeChildren(data)
  // retorna primeiro nó, quem não tem pai
  return data.node.find(node => !node.hasParent)
}
