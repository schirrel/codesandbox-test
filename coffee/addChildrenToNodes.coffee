# Use https://marketplace.visualstudio.com/items?itemName=drewbarrett.vscode-coffeescript-preview

# Constante para teste do tipo do Fluxo:
PRODUCTION = 0

#---------------------

# Sugestão de como copiar (deepcopy) objeto Sistema em objeto data para um objeto "inThisSystemCopyCopy".
inThisSystemCopy = JSON.parse JSON.stringify data.system

convertFlowType = (type) ->
  if type == 'Tratamento'
    1
  else
    0

#---------------------

# Procura e retorna o primeiro Nó (node) do Sistema com um Código (code) dado.
nodeWithCode = (code, inThisSystemCopy) -> inThisSystemCopy.node.find (n) -> n.code is code

# Encontra o Nó "Pai" do Fluxo (flow) a partir do Tipo do Fluxo e dos Códigos dos dois Nós do Fluxo neste Sistema (inThisSystemCopy).
parentOf = (flow, inThisSystemCopy) -> if convertFlowType flow.type is PRODUCTION then nodeWithCode flow.nodeIn, inThisSystemCopy else nodeWithCode flow.nodeOut, inThisSystemCopy

# Encontra o Nó "Filho" do Fluxo flow a partir do Tipo do Fluxo e dos Códigos dos dois Nós do Fluxo neste Sistema (inThisSystemCopy).
childOf = (flow, inThisSystemCopy) -> if convertFlowType flow.type isnt PRODUCTION then nodeWithCode flow.nodeIn, inThisSystemCopy else nodeWithCode flow.nodeOut, inThisSystemCopy

# Um Nó é Balanço no Sistema se tiver apenas um Fluxo do qual o Nó é pai.
isBalanceCode = (nodeCode, inThisSystemCopy) ->
  # Obtém o Nó cujo Código foi informado.
  n = nodeWithCode nodeCode, inThisSystemCopy
  # Retorna verdadeiro se este Nó é Pai de apenas 1 Fluxo. 
  return (f for f in inThisSystemCopy.flow when n is parentOf f, inThisSystemCopy).length is 1 
  
#---------------------

# Adiciona lista de Filhos (children) cada Nó do Sistema (system.node), com um elemento para cada Fluxo (flow) do qual o Nó é Pai (parent). 
addChildrenToNodes = (inThisSystemCopy) ->

  # Para cada Fluxo neste Sistema, na ordem com que foram incluídos: 
  for f in inThisSystemCopy.flow

    # Encontra o Nó "Filho" deste Fluxo.
    c = childOf f, inThisSystemCopy

    # Acrescenta atributo indicando o Fluxo do qual o Nó é Filho.
    c.flow = f

    # Acrescenta atributo indicando que o Nó tem Pai (para facilitar a localização futura do Nó Raiz, que não tem Pai).
    c.hasParent = true

    # Encontra o Nó "Pai" deste mesmo Fluxo.
    n = parentOf f, inThisSystemCopy

    # Se o Nó Pai deste Fluxo é Balanço: 
    if isBalanceCode n, inThisSystemCopy
      # Procura o primeiro Fluxo do Sistema do qual o Balanço é Filho:
      for f1 in inThisSystemCopy.flow then break if n is childOf f1, inThisSystemCopy
      # O Código do Balanço é salvo na Estação Filha do Balanço, para uso futuro.
      c.balanceCode = n
      # A Estação Pai do Balanço será assumida como Pai da Estação Filha do Balanço (i.e., Balanço não terá "children"):
      n = parentOf f1, inThisSystemCopy
    
    # Se O Nó n já tiver "children", utiliza, senão instancia como "array" vazio.
    n.children = n.children or []

    # Acrescenta o Nó filho à lista "children" do Nó n.
    n.children.push c

  # Retorna o Nó Raiz, isto é, aquele que não tem Pai. 
  inThisSystemCopy.node.find (n) -> !n.hasParent
  # aqui precisa ser undefined mas o coffeescript converte undefined para `void 0;` que o jvascript nao aceita.
