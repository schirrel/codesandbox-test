import * as d3 from 'd3'
import history from './history'
import error from '@/helpers/error'
import { mountTree } from '@/helpers/convertJsonToD3Model'
import { orientationTree, nodesType, nodeTypes, nodesTypeName, actionsType, convertTypeToString, colors } from './D3Tree/constants'

export { nodesType, nodesTypeName, actionsType }

const DEFAULT = {
  name: '',
  description: '',
  class: '',
  resource: '',
  unit: '',
  category: '',
  duration: '',
  factor: '',
  circleSize: 26,
  nodeh: 60,
  nodew: 80,
  orientationTree: 'top'
}

class D3Tree {
  constructor () {
    this.data = null
    this.root = null
    this.circleSize = DEFAULT.circleSize
    this.nodeh = DEFAULT.nodeh
    this.nodew = DEFAULT.nodew
    this.selectedOrientationTree = DEFAULT.orientationTree
    this.counterBalanceClick = 0
    this.counterBalance = 1
    this.balanceClicked = {
      id: -1,
      d: null
    }
    this.sizeLabel = 5
    this.orientation = orientationTree[this.selectedOrientationTree]
    this.optionSelect = {}
    this.modal = false
    this.json = null
  }

  /**
   * Retorna um json com o estado atual da árvore
   */
  getJsonData () {
    return JSON.stringify(this.data)
  }

  /**
   * Salva uma copia do json recebido da plataforma P+P
   */
  setJsonFromPP (json) {
    this.json = json
  }

  /**
   * Configura função que vai apresentar os erros na tela
   */
  setHandleError (error) {
    this.error = error
  }

  /**
   * Configura função que vai ser executada quando o usuário clicar em um nó
   */
  setHandleClickFunction (click) {
    this.handleClickFunction = click
  }

  /**
   * Configura função que vai ser executada quando o usuário clicar em um nó
   */
  setModalstate (state) {
    this.modal = state
  }

  /**
   * Muda a orientação da arvore
   */
  changeOrientationTree (newOrientation) {
    console.log('Muda a orientação da arvore')
    console.log(newOrientation)
    this.selectedOrientationTree = newOrientation
    this.orientation = orientationTree[this.selectedOrientationTree]
    this.redrawTree(true)
  }

  /**
   * Muda nodeh que afeta a distância entre os nós irmãos
   */
  changeNodeh (newValue) {
    this.nodeh = newValue
    this.redrawTree(true)
  }

  /**
   * Muda nodew que afeta a distância entre pai e filho
   */
  changeNodew (newValue) {
    this.nodew = newValue
    this.redrawTree(true)
  }

  /**
   * Configura os atributos para edição e as cores das classes
   */
  setAttributesSelectAndColor (attributes) {
    this.optionSelect = attributes
    DEFAULT.class = this.optionSelect.class[0].text
    DEFAULT.resource = this.optionSelect.resource[0].text
    DEFAULT.unit = this.optionSelect.resource[0].unit
    DEFAULT.category = this.optionSelect.resource[0].category
    DEFAULT.duration = this.optionSelect.duration[0].text
    DEFAULT.factor = this.optionSelect.factor[0].text
  }

  /**
   * Prepara os dados utilizados para desenhar a árvore, caso tenha algo salvo
   * no localstorage esse dado sera carregado
   */
  async inicializeData (reset) {
    this.data = {
      name: 'A1',
      description: DEFAULT.description,
      value: 1, //
      class: DEFAULT.class,
      resource: DEFAULT.resource,
      unit: DEFAULT.unit,
      category: DEFAULT.category,
      duration: DEFAULT.duration,
      factor: DEFAULT.factor,
      children: [
        {
          name: 'B1',
          description: DEFAULT.description,
          value: 1,
          class: DEFAULT.class,
          resource: DEFAULT.resource,
          unit: DEFAULT.unit,
          category: DEFAULT.category,
          duration: DEFAULT.duration,
          factor: DEFAULT.factor,
          children: []
        }
      ]
    }

    // TODO validar esse código
    // if (reset === false && this.json.simulationData.graph.root[0] === "n") {
    //   console.log("Json novo");
    //   this.readJsonPP(this.json);
    // } else {
    //   throw error.enums.oldJson
    // this.load()
    // }

    // this.readJsonPP(this.json)
    this.data = await mountTree(this.json)
    history.saveState(this.data)
  }

  /**
   * Adiciona o SVG na div fluxograma e centraliza a posição da árvore e
   * habilidade a opção de zoom
   */
  createElementBaseForD3 () {
    const svg = d3
      .select('.fluxograma')
      .append('svg')
      .attr('width', '100vw')
      .attr('height', '100vh')
      .call(
        d3.zoom().on('zoom', function () {
          svg.attr('transform', d3.event.transform)
        })
      )
      .call(
        d3.zoom().transform,
        d3.zoomIdentity.translate(window.innerWidth / 2 - 16, 50).scale(1)
      )
      .append('g')
      .attr(
        'transform',
        'translate(' + (window.innerWidth / 2 - 16) + ',' + 50 + ')'
      )
    svg.append('g').attr('class', 'links')
    svg.append('g').attr('class', 'nodes')
  }

  /**
   * Cria o modelo de desenho das duas flechas no SVG (start-arrow, end-arrow)
   */
  createArrowModelToPath () {
    d3.select('svg')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25) // Distancia da seta em relação a origem
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#009933')
    d3.select('svg')
      .append('svg:defs')
      .append('svg:marker')
      .attr('id', 'start-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25) // Distancia da seta em relação a origem
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#003399')
  }

  /**
   * Constroi o modelo inicial da árvore
   */
  async build () {
    await this.inicializeData()
    this.createElementBaseForD3()
    this.createArrowModelToPath()
    this.drawTree()
  }

  /**
   * Desenha a árvore completa
   */
  drawTree () {
    const treeLayout = d3
      .tree()
      .nodeSize([this.nodeh, this.nodew])
      .separation(function (a, b) {
        return a.parent === b.parent ? 1 : 1.25
      })
    // console.log("==== New Data ====");
    // console.log(this.data);
    // console.log("==================");
    this.root = d3.hierarchy(this.data)

    // Create the event
    const event = new CustomEvent('tree-update', { detail: this.data })
    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event)

    treeLayout(this.root)
    this.drawPath()
    this.drawNodes()
    this.drawBalances()
  }

  /**
   * Destroi a árvore, removendo todos os nodes e conexões
   */
  cleanTree () {
    d3.select('svg g.nodes')
      .selectAll('circle')
      .remove()
    d3.select('svg g.links')
      .selectAll('line')
      .remove()
    d3.select('svg g.nodes')
      .selectAll('text')
      .remove()
  }

  /**
   * Seletores usados para construir e mudar elementos da árvore D3.js
   */
  selectArrowSide (d) {
    return d.target.data.flow.type === nodesTypeName.in
      ? 'url(#end-arrow)'
      : 'url(#start-arrow)'
  }

  selectStrokeColorPath (d) {
    return nodeTypes.isProducaoSaida(d.target.data.flow.type)
      ? colors.producao
      : colors.tratamento
  }

  selectX1ByType (d) {
    return d.target.data.flow.type === nodesTypeName.out
      ? this.orientation.x(d.target)
      : this.orientation.x(d.source)
  }

  selectY1ByType (d) {
    return d.target.data.flow.type === nodesTypeName.out
      ? this.orientation.y(d.target)
      : this.orientation.y(d.source)
  }

  selectX2ByType (d) {
    return d.target.data.flow.type === nodesTypeName.out
      ? this.orientation.x(d.source)
      : this.orientation.x(d.target)
  }

  selectY2ByType (d) {
    return d.target.data.flow.type === nodesTypeName.out
      ? this.orientation.y(d.source)
      : this.orientation.y(d.target)
  }

  selectCxNode (d) {
    return this.orientation.x(d)
  }

  selectCyNode (d) {
    return this.orientation.y(d)
  }

  selectColorByType (d) {
    return d.data.flow && d.data.flow.type === nodesTypeName.in
      ? colors.tratamento
      : colors.producao
  }

  /**
   * Seleciona a cor do nó de acordo com o atribuito classe
   */
  selectFillColorNodeByClass (d) {
    // let color = 'white'
    // this.optionSelect.class.forEach(function (item) {
    //   if (item.text === d.data.class) {
    //     color = item.color
    //     return true
    //   }
    // })
    // return color
    return 'white'
  };

  /**
   * Muda o preenchimento do nó quando o usuário passa o mouse sobre
   */
  mouseoverNode (node) {
    this.hoverLastColor = d3.select(node).style('stroke')
    this.hoverLastColorClass = d3.select(node).style('fill')
    d3.select(node)
      .attr('fill', 'red')
      .attr('r', this.circleSize)
      .style('stroke', 'black')
      .style('stroke-width', '2px')
      .style('stroke-dasharray', '10,4')
  };

  /**
   * Limpa o preenchimento do nó quando o usuário tira o mouse do nó
   */
  mouseoutNode (node, i, isBalance) {
    if (this.balanceClicked.id === i) return true
    if (this.modal) return true

    let circle = this.circleSize
    if (isBalance) circle = (circle * 80) / 100

    d3.select(node)
      .attr('fill', this.hoverLastColorClass)
      .attr('r', circle)
      .style('stroke', this.hoverLastColor)
      .style('stroke-width', '4px')
      .style('stroke-dasharray', '0,0')
  };

  /**
   * Defini o nome do rótulo apresentado em cada nó
   */
  selectLabelOfNode (d) {
    // if (d.data.idBalance > this.highestIdBalance) { this.highestIdBalance = d.data.idBalance }

    // if (d.data.idBalance > 0 && !d.data.name) return d.data.idBalance

    // if (d.data.idBalance > 0) { return d.data.name }

    return d.data.code
  };

  /**
   * Centraliza o rótulo no eixo X em função da quantidade de letras
   */
  selectXLabel (d) {
    let shift = 0
    if (d.data.idBalance > 0) { shift = d.data.code.length * 4 } else shift = d.data.code.length * 4

    return shift === 0
      ? this.orientation.x(d) - 5
      : this.orientation.x(d) - shift - 1
  };

  /**
   * Centraliza o rótulo no eixo Y
   */
  selectYLabel (d) {
    return this.orientation.y(d) + 5
  };

  /**
   * Seleciona o contorno do nó balanço, caso seja do tipo não balanço deixa
   * transparente
   */
  selectStrokeColorBalance (d) {
    if (d.data.idBalance > 0) { return d.value === 0 ? colors.tratamento : colors.producao } else return 'transparent'
  };

  /**
   * Desenha todas as linhas e setas da árvore que conectam os nós
   */
  drawPath () {
    this.links = d3
      .select('svg g.links')
      .selectAll('line.link')
      .data(this.root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .style('marker-end', this.selectArrowSide)
      .style('stroke', this.selectStrokeColorPath)
      // link da ideia de como adicionar largura na aresta
      // https://stackoverflow.com/questions/44441577/how-to-change-edge-thickness-in-d3-js
      // .style("stroke-width", d => Math.max(4, 1))  adicionando largura das arestas
      .attr('x1', this.selectX1ByType.bind(this))
      .attr('x2', this.selectX2ByType.bind(this))
      .attr('y1', this.selectY1ByType.bind(this))
      .attr('y2', this.selectY2ByType.bind(this))
  }

  /**
   * Desenha todos os nós da árvore
   */
  drawNodes () {
    const that = this
    const descendants = this.root.descendants()
    this.nodes = d3
      .select('svg g.nodes')
      .selectAll('circle.node')
      .data(descendants)
      .enter()
      .append('circle')
      .attr('cx', this.selectCxNode.bind(this))
      .attr('cy', this.selectCyNode.bind(this))
      .attr('r', that.circleSize)
      .style('stroke', this.selectColorByType.bind(this))
      .attr('fill', this.selectFillColorNodeByClass.bind(this))
      .style('stroke-width', '4px')
      .on('mouseover', function () {
        const node = this
        that.mouseoverNode(node)
      })
      .on('mouseout', function (_, i) {
        const node = this
        that.mouseoutNode(node, i)
      })
      .on('click', that.handleClickFunction)
  }

  /**
   * Desenha todos os nós balanços da árvore
   */
  drawBalances () {
    const that = this
    const descendants = this.root.descendants()
    this.highestIdBalance = 0

    const selectNodes = d3
      .select('svg g.nodes')
      .selectAll('circle.node')
      .data(descendants)
      .enter()

    selectNodes
      .append('text')
      .attr('font-size', '14px')
      .attr('font-family', 'PT Mono')
      .text(this.selectLabelOfNode.bind(this))
      .attr('x', this.selectXLabel.bind(this))
      .attr('y', this.selectYLabel.bind(this))
      .attr('fill', this.selectColorByType.bind(this))

    selectNodes
      .append('circle')
      .attr('cx', this.selectCxNode.bind(this))
      .attr('cy', this.selectCyNode.bind(this))
      .attr('r', (this.circleSize * 80) / 100)
      .style('stroke', this.selectStrokeColorBalance.bind(this))
      .attr('fill', 'transparent')
      .style('stroke-width', '4px')
      .on('mouseover', function () {
        const node = this
        that.mouseoverNode(node)
      })
      .on('mouseout', function (_, i) {
        const node = this
        const isBalance = true
        that.mouseoutNode(node, i, isBalance)
      })
      .on('click', that.handleClickFunction)

    this.counterBalance = this.highestIdBalance + 1
  }

  /**
   * Redesenha a árvore após alguma modificação em algum nó
   */
  redrawTree (notSaveState) {
    if (!notSaveState) {
      history.saveState(this.data)
    }
    this.cleanTree()
    this.drawTree()
  }

  /**
   * Adiciona um novo nó filho ao nó selecionado
   */
  addChildrenNode (selected, i, nodeType, add) {
    if (!this.checkIfHavePermission(selected, nodeType)) {
      return false
    }
    // saida/Produção -> nodeout (novo nó) nodein (no existente)
    // entrada/Tratamento -> nodeout (novo existente) nodein (novo nó)

    const flow = {
      type: nodeType,
      resource: selected.data.resource,
      nodeIn: nodeTypes.isProducaoSaida(nodeType) ? selected.data.code : add,
      nodeOut: nodeTypes.isProducaoSaida(nodeType) ? add : selected.data.code
    }
    console.log(flow)

    const newNodeData = {
      children: [],
      code: add,
      name: '',
      description: '',
      resource: selected.data.resource,
      flow
    }

    // Cria um novo nó com base em newNodeData usando d3.hierarchy()
    const newNode = d3.hierarchy(newNodeData)

    // Adiciona propriedades(filho, pai, altura) ao nó
    newNode.depth = selected.depth + 1
    newNode.height = selected.height - 1
    newNode.parent = selected
    newNode.id = Date.now()

    // Caso o nó selecionado não tenha filho criar os vetores para armazenar-los
    if (!selected.children) {
      selected.children = []
      selected.data.children = []
    }
    selected.children.push(newNode)
    selected.data.children.push(newNode.data)
    this.redrawTree()
  }

  /**
   * Remove o nó selecionado da árvore
   */
  removeChildrenNode (d) {
    if (d.depth === 0 || d.depth === 1) {
      this.msgAlertUser(error.enums.cannotRemoveDefault)
      return false
    }

    if (d.data.idBalance > 0) {
      this.msgAlertUser(error.enums.mustRemoveBalanceBefore)
      return false
    }

    if (this.checkIfIsCantRemoveNode(d)) {
      this.msgAlertUser(error.enums.cannotRemoveLastChild)
      return false
    }

    if (d.children) {
      this.msgAlertUser(error.enums.cannotRemoveIfHaveChildrens)
      return false
    }

    this.checkIfNeedRemoveBalance(d)

    const index = d.parent.children.indexOf(d)
    d.parent.children.splice(index, 1)
    d.parent.data.children.splice(index, 1)

    this.redrawTree()
  }

  /**
   * Verifica se tem permissão para remover o nó
   */
  checkIfNeedRemoveBalance (node) {
  }

  /**
   * Reseta a variavel responsavel por controlar qual foi o primeiro clique no
   * momento da criação do balanço
   */
  resetNodeSelected (notSaveState) {
    this.balanceClicked.id = null
    this.balanceClicked.d = null
    if (notSaveState) this.redrawTree(true)
    else this.redrawTree()
  }

  /**
   * Copia os atribuitos do segundo nó clicado para o primeiro nó no momento
   * da criação do balanço
   */
  copyBalanceData (nodeClicked1, nodeClicked2) {
  }

  /**
   * Adiciona ao nó o tipo balanço, caso as regras de negócio sejam satisfeitas
   */
  changeNodeTypeToBalance (d, id) {
  }

  /**
   * Remove o nó o tipo balanço, caso as regras de negócio sejam satisfeitas
   */
  removeNodeTypeToBalance (d) {
  }

  /**
   * Verifica se tem permissão para adicionar um novo nó
   */
  checkIfHavePermission (fatherNode, newNodeType, add) {
    const fatherType = fatherNode.data.flow.type

    // Não é possível incluir novas Arestas ao Vértice raiz
    if (fatherNode.depth === 0) {
      this.msgAlertUser(error.enums.cannotInclude)
      return false
    }

    if (!fatherNode.children && fatherType !== newNodeType) {
      this.msgAlertUser(error.enums.mustIsEqualFather)
      return false
    }

    // Não é possível incluir novas Arestas ao Vértice balanço sem filhos
    if (fatherNode.data.idBalance > 0 && !fatherNode.children) {
      this.msgAlertUser(error.enums.cannotAddNodeInBalanceChildren)
      return false
    }

    if (fatherNode.children && add) {
      this.msgAlertUser(error.cannotAddTerminal)
      this.resetNodeSelected(true)
      return false
    }

    return true
  }

  /**
   * Verifica se tem permissão para remover o nó
   */
  checkIfIsCantRemoveNode (node) {
    const qtdBrother = node.parent.children.length
    const typeFather = node.parent.data.value
    const typeNode = node.data.value
    const nodeTypeFather = node.parent.children.filter(
      n => n.data.value === typeFather
    )

    if (typeNode !== typeFather) {
      return false
    }

    if (nodeTypeFather.length === 1 && qtdBrother > 1) {
      return true
    }

    return false
  }

  /**
   * Salva o json com dados da árvore no localstorage
   */
  save () {
    this.resetNodeSelected(true)
    localStorage.data = JSON.stringify(this.data)
  }

  /**
   * Carrega o json com dados da árvore do localstorage
   */
  load () {
    if (localStorage.data) {
      this.data = JSON.parse(localStorage.data)
    }
  }

  /**
   * Remove os dados da árvore do localstorage e redesenha a árvore
   */
  clean () {
    console.log('clean')
    // if (localStorage.data) {
    console.log('remove localstorage')
    localStorage.removeItem('data')
    // }
    history.clean()
    this.counterBalance = 1
    this.inicializeData(true)
    this.redrawTree(true)
  }

  /**
   * Desfaz uma modificação realizada na árvore
   */
  undo () {
    if (history.canUndo()) history.undo()
    this.data = history.getState()
    this.redrawTree(true)
  }

  /**
   * Refaz uma modificação desfeita na árvore
   */
  redo () {
    if (history.canRedo()) history.redo()
    this.data = history.getState()
    this.redrawTree(true)
  }

  /**
   * Mensagem de alerta apresentada de acordo com as regras de negócio
   */
  msgAlertUser (msg) {
    this.error({
      type: 'warning',
      title: 'Oops...',
      text: msg
    })
  }

  /**
   * Gera uma chave para nó simples com o formato da plataforma P+P
   */
  addKeyNode (d, numVertices, nodes) {
    const chave = `n_${numVertices}_${d.data.name}_${d.data.description}`
    const newNode = {
      formula: d.data.duration,
      stages: [d.data.class],
      flows: [],
      type: convertTypeToString(d.data.value)
    }
    // chave com new node em graph.nodes
    nodes[chave] = newNode
    // Salva chave para adiconar no idFlow ao nós que formam o fluxo
    d.chave = chave
  }

  /**
   * Gera uma chave para nó balanço com o formato da plataforma P+P
   */
  addKeyBalance (d, numVertices, nodes) {
  }

  /**
   * Gera uma fluxo de conexão entre dois nós com o formato da plataforma P+P
   */
  addNewFlow (d, graph) {
    const idParent = d.source.chave
    const idChild = d.target.chave
    let idFlow = ''

    if (d.target.value === nodesType.out) idFlow = `${idParent}-${idChild}`
    else idFlow = `${idChild}-${idParent}`

    const newFlow = {
      formula: d.target.data.factor,
      resource: {
        name: d.target.data.resource,
        unit: d.target.data.unit,
        category: d.target.data.category
      }
    }

    graph.flows[idFlow] = newFlow
    graph.nodes[d.source.chave].flows.push(idFlow)
    graph.nodes[d.target.chave].flows.push(idFlow)
  }

  copyToClipboard (str) {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  isBalanceKey (key) {
  }

  /**
   * Converte o JSON da P+P para formato do D3.js
   */
  readJsonPP (json) {
    this.data = mountTree(this.json)
    this.redrawTree(true)
  }
}

export default D3Tree
