import * as d3 from 'd3'
import history from './history'
import error from '@/helpers/error'
// import { convertJsonToTree } from '@/helpers/convertJsonToD3Model'
import { addChildrenToNodes } from '@/coffee/addChildrenToNodes.coffee'
import { addBalance } from '@/coffee/addBalance.coffee'
import { orientationTree, nodesType, nodeTypes, nodesTypeName, actionsType, colors } from './D3Tree/constants'
import utils from '@/helpers/util'
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
const resetData = {
  node: [
    {
      code: 'A01',
      name: 'Nó A1',
      formula: '',
      description: '',
      stage: ''
    }, {
      code: 'B01',
      name: 'Nó B1',
      formula: '',
      description: '',
      stage: ''
    }
  ],
  flow: [
    {
      type: nodesTypeName.out,
      formula: '',
      nodeIn: 'A01',
      nodeOut: 'B01',
      resource: ''
    }
  ]
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
    this.jsonData = null
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
    this.jsonData = json
    this.json = {
      node: json.node,
      flow: json.flow
    }
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
    if (reset) {
      this.json = resetData
    }

    const copyJson = utils.methods.copyObject(this.json)
    await this.mountTree(copyJson)
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
      .call(d3.zoom().on('zoom', function () { svg.attr('transform', d3.event.transform) }))
      .call(d3.zoom().transform, d3.zoomIdentity.translate(window.innerWidth / 2 - 16, 50).scale(1))
      .append('g')
      .attr('transform', 'translate(' + (window.innerWidth / 2 - 16) + ',' + 50 + ')')
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
    this.createElementBaseForD3()
    this.createArrowModelToPath()
    await this.inicializeData()
    // this.drawTree()
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

    this.root = d3.hierarchy(this.data)

    // Create the event
    const event = new CustomEvent('tree-update', { detail: this.json })
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
    if (d.data.balance) {
      return d.data.flow.type === 'Produção' ? colors.producao : colors.tratamento
    } else return 'transparent'
    // if (d.data.idBalance > 0) { return d.value === 0 ? colors.tratamento : colors.producao }
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
  redrawTree () {
    this.save()

    this.cleanTree()
    this.drawTree()
  }

  /**
   * Adiciona um novo nó filho ao nó selecionado
   */
  async addChildrenNode (selected, i, nodeType, add) {
    if (!this.checkIfHavePermission(selected, nodeType)) {
      return false
    }
    // saida/Produção -> nodeout (novo nó) nodein (no existente)
    // entrada/Tratamento -> nodeout (novo existente) nodein (novo nó)

    const flow = {
      type: nodeType,
      formula: '',
      resource: '',
      nodeIn: nodeTypes.isProducaoSaida(nodeType) ? selected.data.code : add,
      nodeOut: nodeTypes.isProducaoSaida(nodeType) ? add : selected.data.code
    }
    const newNodeData = {
      code: add,
      name: '',
      formula: '',
      description: '',
      stage: ''
    }
    this.json.node.push(newNodeData)
    this.json.flow.push(flow)

    history.saveState(this.json)
    await this.mountTree()
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

    this.json.node = this.json.node.filter(node => node.code !== d.data.code)
    this.json.flow = this.json.flow.filter(flow => flow.nodeIn !== d.data.code && flow.nodeOut !== d.data.code)
    history.saveState(this.json)
    this.mountTree()
  }

  /**
   * Verifica se tem permissão para adicionar um novo nó
   */
  checkIfHavePermission (fatherNode, newNodeType, add) {
    const fatherType = fatherNode.data?.flow?.type

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
      // this.resetNodeSelected(true)
      return false
    }

    return true
  }

  /**
   * Verifica se tem permissão para remover o nó
   */
  checkIfIsCantRemoveNode (node) {
    const qtdBrother = node.parent.children.length
    const typeFather = node.parent.data.flow.type
    const typeNode = node.data.flow.type
    const nodeTypeFather = node.parent.children.filter(n => n.data.flow.type === typeFather)

    if (typeNode !== typeFather) {
      return false
    }

    if (nodeTypeFather.length === 1 && qtdBrother > 1) {
      return true
    }

    return false
  }

  async mountTree () {
    const copyJson = { ...utils.methods.copyObject(this.json) }

    // const data2 = convertJsonToTree(copyJson)
    const data = addChildrenToNodes(copyJson)

    if (!data) {
      this.json = resetData
      return this.mountTree()
    }
    this.data = data
    this.redrawTree(true)
  }

  /**
   * Salva o json com dados da árvore no localstorage
   */
  save () {
    localStorage.json = JSON.stringify(this.json)
  }

  /**
   * Carrega o json com dados da árvore do localstorage
   */
  load () {
    if (localStorage.json) {
      this.json = JSON.parse(localStorage.json)
    }
  }

  /**
   * Remove os dados da árvore do localstorage e redesenha a árvore
   */
  async clean () {
    localStorage.removeItem('json')
    history.clean()
    this.counterBalance = 1
    await this.inicializeData(true)
    this.redrawTree(true)
  }

  /**
   * Desfaz uma modificação realizada na árvore
   */
  undo () {
    console.log('undo')
    if (history.canUndo()) history.undo()
    this.json = history.getState()
    console.log('undo', this.json)
    this.mountTree()
  }

  /**
   * Refaz uma modificação desfeita na árvore
   */
  redo () {
    if (history.canRedo()) history.redo()
    this.json = history.getState()
    console.log('redo', this.json)
    this.mountTree()
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
   * Reseta a variavel responsavel por controlar qual foi o primeiro clique no
   * momento da criação do balanço
   */
  resetNodeSelected (notSaveState) {
    this.balanceClicked.id = null
    this.balanceClicked.d = null
    if (notSaveState) this.redrawTree(true)
    else this.redrawTree()
  }

  editNode (values) {
    // { sourceNode: sourceNodeCode, edited: this.edit }
    const nodeFoundByCode = this.json.node.find(node => node.code === values.sourceNodeCode)

    const flowFoundByCodeIn = this.json.flow.filter(flow => flow.nodeIn === values.sourceNodeCode)
    const flowFoundByCodeOut = this.json.flow.filter(flow => flow.nodeOut === values.sourceNodeCode)

    // mudanças no node
    nodeFoundByCode.code = values.edited.code
    nodeFoundByCode.name = values.edited.name
    nodeFoundByCode.description = values.edited.description

    // mudanças de código nos flows
    flowFoundByCodeIn.forEach(each => {
      each.nodeIn = values.edited.code
    })
    flowFoundByCodeOut.forEach(each => {
      each.nodeOut = values.edited.code
    })

    this.mountTree()
  }

  /**
   * Adiciona ao nó o tipo balanço, caso as regras de negócio sejam satisfeitas
   */
  changeNodeTypeToBalance (d, id) {
    if (d.depth === 0 ||
      d.depth === 1) {
      this.msgAlertUser(error.enums.cannotAddBalanceInDefaultNodes)
      this.resetNodeSelected(true)
      return false
    }

    if (d.children && d.children.length > 0 && this.counterBalanceClick === 0) {
      this.msgAlertUser(error.enums.cannotHaveChildren)
      this.resetNodeSelected(true)
      return false
    }

    if (d.data.idBalance > 0) {
      this.msgAlertUser(error.enums.cannotCreateBalanceIfIsAlready)
      this.resetNodeSelected(true)
      return false
    }

    this.counterBalanceClick += 1

    if (this.counterBalanceClick === 2) {
      this.counterBalanceClick = 0

      if (d === this.balanceClicked.d) {
        this.resetNodeSelected(true)
        return false
      }

      if (d.data.resource !== this.balanceClicked.d.data.resource) {
        this.msgAlertUser(error.enums.cannotHaveBalanceWithDifferentRessources)
        this.resetNodeSelected(true)
        return false
      }

      if (d.data.idBalance > 0) {
        this.msgAlertUser(error.enums.cannotCreateBalanceIfIsAlready)
        this.resetNodeSelected(true)
        return false
      }

      if (d === this.balanceClicked.d.parent) {
        this.msgAlertUser(error.enums.cannotAddBalanceBetweenParentAndChildren)
        this.resetNodeSelected(true)
        return false
      }

      if (!this.balanceClicked.d.children) {
        if (!d.children) {
          this.msgAlertUser(error.enums.mustHaveChildren)
          this.resetNodeSelected(true)
          return false
        }
      }
      const copyJson = { ...utils.methods.copyObject(this.json) }

      const added = addBalance(this.balanceClicked.d.data, d.data, copyJson)
      this.json = added
      this.mountTree()

      // if (d.data.idBalance > 0) {
      //   this.balanceClicked.d.data.idBalance = d.data.idBalance
      // } else {
      //   d.data.idBalance = this.counterBalance
      //   this.balanceClicked.d.data.idBalance = this.counterBalance
      //   this.counterBalance += 1
      // }

      // this.copyBalanceData(this.balanceClicked.d, d)
      // this.resetNodeSelected()
    } else {
      this.balanceClicked.id = id
      this.balanceClicked.d = d
    }
  }

  /**
   * Remove o nó o tipo balanço, caso as regras de negócio sejam satisfeitas
   */
  removeNodeTypeToBalance (d) {
    if (d.data.balance.code <= 0) {
      this.msgAlertUser(error.enums.isNotBalance)
      return false
    }

    const target = d.data.balance.code
    const descendants = this.root.descendants()
    let count = 0

    descendants.filter(d => d.data.balance).forEach(function (d) {
      if (d.data.balance.code === target) count++
    })

    if (count > 2 && d.children) {
      this.msgAlertUser(error.enums.cannotRemoveFatherBalanceBigger2)
      return false
    }

    if (count > 2 && !d.children) {
      d.data.balance.code = 0
    } else {
      descendants.filter(d => d.data.balance).forEach(function (d) {
        if (d.data.balance.code === target) d.data.balance.code = 0

        // Corrigi os id após remover um balanço
        if (d.data.balance.code > target) d.data.balance.code -= 1
      })

      this.counterBalance -= 1
    }
  }
}

export default D3Tree
