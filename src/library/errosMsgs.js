const error = {
  cannotRemoveDefault: 'Não é possível excluir os dois primeiros vértices.',
  cannotRemoveLastChild:
    'Não é possível excluir o último filho de mesmo tipo enquanto houver outro de tipo oposto.',
  cannotRemoveIfHaveChildrens: 'Não é possível excluir vértice com filhos.',
  cannotInclude: 'Não é possível adicionar vértice na raiz.',
  mustIsEqualFather:
    'O primeiro filho adicionado deve ser de mesmo tipo do pai.',
  cannotHaveChildren: 'Primeiro nó balanço não pode ter filhos.',
  mustHaveChildren:
    'Não é possível adicionar balanço se o segundo vértice não tiver filhos.',
  cannotStartBalanceWithBalance:
    'O balanço deve sempre começar de um nó não balanço.',
  cannotRemoveFatherBalanceBigger2:
    'Não pode remover nó pai de um balanço composto por mais de 2 nós.',
  cannotAddBalanceInDefaultNodes:
    'Não é possível adicionar balanço aos dois primeiros vértices.',
  cannotAddBalanceBetweenParentAndChildren:
    'Não é possível adicionar balanço entre pai e filho.',
  mustRemoveBalanceBefore:
    'Não é possível excluir vértice associado a balanço.',
  cannotCreateBalanceIfIsAlready:
    'Não é possível adicionar um vértice que já pertence ao balanço.',
  isNotBalance: 'Não é possível excluir balanço de vértice que não é balanço.',
  cannotAddNodeInBalanceChildren:
    'Não é possível adicionar vértice a terminal de balanço.'
}

export default error
