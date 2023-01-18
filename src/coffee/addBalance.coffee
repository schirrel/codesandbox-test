# Use https://marketplace.visualstudio.com/items?itemName=drewbarrett.vscode-coffeescript-preview

# Procura e retorna o primeiro Nó (node) do Sistema com um Código (code) dado.
# @Alan: adicionada funcao que busca node por codigo
nodeWithCode = (code, inThisSystemCopy) -> inThisSystemCopy.node.find (n) -> n.code is code

# @Alan: Variavel faltando
PRODUCAO = 'Produção'

# Cria novo Código de Nó a cada chamada.
#  @Alan, tive que remover o seu loop yield pois ele gerava um  while (true) e nunca retornava nada
nCode = 0
newNodeCode = () -> return "_#{nCode++}"; 

# Transforma o Fluxo acima de um Terminal t em Fluxo pai de um Balanço acima de uma Estação n, excluindo o Terminal. Cria o Balanço se não existir.
# O Terminal corresponde ao Vértice Terminal do primeiro clique, e a Estação n corresponde ao Vértice Não Terminal do segundo clique.
# @Alan faltava o =
addBalance = (t, n, inThisSystem) ->

  # Se a Estação n tem um Balanço associado (i.e., acima dela), usa este Balanço:
  # @Alan em nenhum outro trecho de código existe atribuição da propriedade balance, ficou faltando?
  if n.balance?
    b = n.balance

  # Senão, acrescenta e usa um Nó de Balanço, tendo como único atributo um Código único gerado automaticamente:
  else
    seq = inThisSystem.node.push
      code: newNodeCode()
    b = inThisSystem.node[seq-1]

   #@FD Associa o Nó não Terminal n a este novo Balanço.
    nNode = nodeWithCode(n.code,inThisSystem )
    nNode.balance = b
    # Redireciona o Fluxo acima da Estação n para este novo Balanço:
    if n.flow.type is PRODUCAO then n.flow.nodeOut = b.code else n.flow.nodeIn = b.code

    # Acrescenta um Fluxo entre o Balanço e a Estação, de mesmo Tipo e Recurso do Fluxo acima da Estação, mas sem Fluxo de Etapa associado:
    seq = inThisSystem.flow.push
      nodeIn: if n.flow.type is PRODUCAO then b.code else n.code
      nodeOut: if n.flow.type isnt PRODUCAO then b.code else n.code
      resource: n.flow.resource
      type: n.flow.type

    # @Alan esse f não é usado em lugar nenhum  
    # @FD e nem precisa, mesmo: f = inThisSystem.flow[seq-1]

  # Redireciona o Fluxo de Referência de t para o Balanço.
  # @Alan estava nodeOut em ambos, acredito que deva ser apenas o primeiro não?
  # @FD Isso mesmo. Correção logo em seguida.
  # if t.flow.type is PRODUCAO then t.flow.nodeOut = b.code else t.flow.nodeOut = b.code
  if t.flow.type is PRODUCAO then t.flow.nodeOut = b.code else t.flow.nodeIn = b.code

  # Exclui o Nó Terminal t.
  # @Alan o objeto que vem pelo d (pelo click) não é o mesmo do data por isso o indexOf não acha corretamente.
  # @Alan mudei para usar a abordagem de usar a funcao de array filter de array, que retorna array sem o objeto filtrado
  # @FD Olhei a minha versão original e de fato tinha um erro bobo (primeira linha). Avalie minha correção (segunda linha),
  # @FD mas use a minha ou sua correção, a que achar melhor.
  # inThisSystem.node.splice(0, system.node.indexOf(t))
  # inThisSystem.node.splice(0, inThisSystem.node.indexOf(t))
  inThisSystem.node = inThisSystem.node.filter (currentNode) -> currentNode.code isnt t.code 

  # @Alan adicionei o retorno da array alterada
  # @FD Precisa mesmo, já que o objeto está sendo alterado? Fique à vontade.
  return inThisSystem

# @Alan: adicionei a exportação pra poder usar a funcao no outro arquivo.
# @FD E as outras funções auxiliares usadas por addBalance e addChildrenToNode? Não precisam ser exportadas?
module.exports = { addBalance }
