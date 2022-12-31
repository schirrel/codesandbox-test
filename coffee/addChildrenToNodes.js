// Use https://marketplace.visualstudio.com/items?itemName=drewbarrett.vscode-coffeescript-preview

// Constante para teste do tipo do Fluxo:

const PRODUCTION = 0

// ---------------------

// Sugestão de como copiar (deepcopy) objeto Sistema em objeto data para um objeto "inThisSystemCopyCopy".
// inThisSystemCopy = JSON.parse(JSON.stringify(data.system))

// ---------------------

// Procura e retorna o primeiro Nó (node) do Sistema com um Código (code) dado.
const nodeWithCode = function (code, inThisSystemCopy) {
  return inThisSystemCopy.node.find(function (n) {
    return n.code === code
  })
}

// Encontra o Nó "Pai" do Fluxo (flow) a partir do Tipo do Fluxo e dos Códigos dos dois Nós do Fluxo neste Sistema (inThisSystemCopy).
const parentOf = function (flow, inThisSystemCopy) {
  if (flow.type === PRODUCTION) {
    return nodeWithCode(flow.nodeIn, inThisSystemCopy)
  } else {
    return nodeWithCode(flow.nodeOut, inThisSystemCopy)
  }
}

// Encontra o Nó "Filho" do Fluxo flow a partir do Tipo do Fluxo e dos Códigos dos dois Nós do Fluxo neste Sistema (inThisSystemCopy).
const childOf = function (flow, inThisSystemCopy) {
  if (flow.type !== PRODUCTION) {
    return nodeWithCode(flow.nodeIn, inThisSystemCopy)
  } else {
    return nodeWithCode(flow.nodeOut, inThisSystemCopy)
  }
}

// Um Nó é Balanço no Sistema se tiver apenas um Fluxo do qual o Nó é pai.
const isBalanceCode = function (nodeCode, inThisSystemCopy) {
  let f
  // Obtém o Nó cujo Código foi informado.
  const n = nodeWithCode(nodeCode, inThisSystemCopy)
  return (
    (function () {
      let i, len
      const ref = inThisSystemCopy.flow
      const results = []
      for (i = 0, len = ref.length; i < len; i++) {
        f = ref[i]
        if (n === parentOf(f, inThisSystemCopy)) {
          // Retorna verdadeiro se este Nó é Pai de apenas 1 Fluxo.
          results.push(f)
        }
      }
      return results
    })().length === 1
  )
}

// ---------------------

// Adiciona lista de Filhos (children) cada Nó do Sistema (system.node), com um elemento para cada Fluxo (flow) do qual o Nó é Pai (parent).
export const addChildrenToNodes = function (inThisSystemCopy) {
  let c, f, f1, i, j, len, len1, n, ref1
  const ref = inThisSystemCopy.flow
  // Para cada Fluxo neste Sistema, na ordem com que foram incluídos:
  for (i = 0, len = ref.length; i < len; i++) {
    f = ref[i]
    // Encontra o Nó "Filho" deste Fluxo.
    c = childOf(f, inThisSystemCopy)
    // Acrescenta atributo indicando o Fluxo do qual o Nó é Filho.
    c.flow = f
    // Acrescenta atributo indicando que o Nó tem Pai (para facilitar a localização futura do Nó Raiz, que não tem Pai).
    c.hasParent = true
    // Encontra o Nó "Pai" deste mesmo Fluxo.
    n = parentOf(f, inThisSystemCopy)
    // Se o Nó Pai deste Fluxo é Balanço:
    if (isBalanceCode(n, inThisSystemCopy)) {
      ref1 = inThisSystemCopy.flow
      // Procura o primeiro Fluxo do Sistema do qual o Balanço é Filho:
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        f1 = ref1[j]
        if (n === childOf(f1, inThisSystemCopy)) {
          break
        }
      }
      // O Código do Balanço é salvo na Estação Filha do Balanço, para uso futuro.
      c.balanceCode = n
      // A Estação Pai do Balanço será assumida como Pai da Estação Filha do Balanço (i.e., Balanço não terá "children"):
      n = parentOf(f1, inThisSystemCopy)
    }

    // Se O Nó n já tiver "children", utiliza, senão instancia como "array" vazio.
    n.children = n.children || []
    // Acrescenta o Nó filho à lista "children" do Nó n.
    n.children.push(c)
  }
  // Retorna o Nó Raiz, isto é, aquele que não tem Pai.
  return inThisSystemCopy.node.find(function (n) {
    return n.hasParent === false
  })
}
