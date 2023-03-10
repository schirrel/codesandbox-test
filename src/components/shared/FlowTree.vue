<template>
  <section>
    <TreeMenu
      :TypeOfActionSelectedNow="TypeOfActionSelectedNow"
      :mini="mini"
      @setTypeClickTree="setTypeClickTree"
      @executeModelCommand="executeModelCommand"
    />
    <v-container fluid>
      <div class="fluxograma" ref="fluxograma"></div>

      <TreeModal
        :modal="modal"
        :optionSelect="optionSelect"
        :selectedNode="selectedNode"
        @confirmEditNode="confirmEditNode"
        @saveChangesInput="saveChangesInput"
      />

      <TreeConfig :config="config" @executeModelCommand="executeModelCommand" />

      <TreeChildren
        :children="children"
        :TypeOfActionSelectedNow="TypeOfActionSelectedNow"
        @setTypeClickTree="setTypeClickTree"
        @confirmEditNode="confirmEditNode"
      />
      <JsonViewer v-if="false" :json="json" />
    </v-container>
  </section>
</template>

<script>

import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
// import { useSentry } from '@/plugins/sentry'

import uuid from '@/library/uuid'
import jsonExampleLoadFluxograma from '@/jsons/jsonFluxograma.json'
// import jsonExampleIgnoreSimulationData from '@/jsons/jsonPlataforma.json'
// import jsonFernando from '@/jsons/jsonFernando.json'
import TreeMenu from '@/components/TreeMenu'
import TreeModal from '@/components/TreeModal'
import TreeConfig from '@/components/TreeConfig'
import TreeChildren from '@/components/TreeChildren'
import JsonViewer from '@/components/JsonViewer'

import D3TreeClass, { actionsType, nodesType, nodesTypeName } from '@/library/NewD3Tree'

const tree = new D3TreeClass()
Vue.use(VueSweetalert2)

export default {
  components: {
    TreeMenu,
    TreeModal,
    TreeConfig,
    TreeChildren,
    JsonViewer
  },
  props: {
    simulation: {
      type: Object,
      default: () => jsonExampleLoadFluxograma
    }
  },
  data () {
    return {
      optionSelect: {
        class: [],
        resource: [],
        duration: [],
        factor: []
      },
      selectedNode: null,
      selectedIndex: null,
      nodeTypeChildren: null,
      modal: false,
      config: false,
      children: false,
      mini: false,
      TypeOfActionSelectedNow: actionsType.edit,
      json: {}
    }
  },
  watch: {
    simulation () {
      this.json = this.simulation
    }
  },
  mounted: function () {
    if(this.simulation)
    this.json = this.simulation
    
    // useSentry()
    // Carrega os dados dos atributos(class,resource,duration,factor) do backend
    this.loadAtributesBackend()
    // Configura qual fun????o ser?? acionada para mostrar os erros na tela
    document.addEventListener('tree-update', (e) => {
      const data = e.detail
      if (this.json.data.system) {
        this.json.data.system.node = data.node
        this.json.data.system.flow = data.flow
        }
    })

    tree.setHandleError(this.$swal)
    // Configura qual fun????o ser?? acionada ao clicar em um n?? da ??rvore
    tree.setHandleClickFunction(this.handleOnclickFunction)
    // Ajusta a ??rvore para utilizar os atributos do select fornecido pelo backend
    // E configura qual cor vai representar cada classe
    // tree.setAttributesSelectAndColor(this.optionSelect)
    // Constroi a ??rvore na div fluxograma
    tree.build()
  },
  methods: {
    saveChangesInput (value) {
      tree.editNode(value)
    },
    /**
     * Executa o tipo de clique escolhido no menu no n?? selecionado
     * @param selected representa os dados do n?? selecionado
     * @param index representa a identica????o do n?? selecionado
     */
    handleOnclickFunction (selected, index) {
      switch (this.TypeOfActionSelectedNow) {
        case actionsType.addIn:
          tree.addChildrenNode(selected, index, nodesTypeName.in, uuid())

          break
        case actionsType.addOut:
          tree.addChildrenNode(selected, index, nodesTypeName.out, uuid())

          break
        case actionsType.remove:
          tree.removeChildrenNode(selected, index)
          break
        case actionsType.addBalance:
          tree.changeNodeTypeToBalance(selected, index)
          break
        case actionsType.removeBalance:
          tree.removeNodeTypeToBalance(selected, index)
          break
        case actionsType.edit:
          this.selectedNode = selected
          this.modal = true
          // N??o limpa o n?? selecionado caso o modal esteja aberto
          tree.setModalstate(true)
          break
        case actionsType.children:
          this.selectedNode = selected
          this.treeChildren = tree
          this.childrens = !this.childrens
          break

        default:
          tree.addChildrenNode(selected, index, nodesType.in)
      }
    },

    /**
     * Evento acionado pelo componente treeMenu
     * Seleciona o tipo de clique que ser?? executado ao clicar no n?? e remove
     * qualquer n?? selecionado anteriormente
     * @param type identifica o tipo de clique selecionado
     */
    setTypeClickTree (type) {
      this.TypeOfActionSelectedNow = type
      tree.resetNodeSelected(true)
    },

    /**
     * Evento acionado pelo componente treeMenu
     * Executa um comando de modifica????o na ??rvore (redo, undo, save, reset)
     * @param command identifica o tipo de commando executado
     */
    executeModelCommand (command, param) {
      console.log(`comando=${command} -> ${param}`)
      switch (command) {
        case actionsType.undo:
          tree.undo()
          break
        case actionsType.redo:
          tree.redo()
          break
        case actionsType.save:
          this.saveTreeBackend()
          break
        case actionsType.reset:
          this.removeTreeBackend()
          break
        case actionsType.config:
          this.config = !this.config
          break
        case actionsType.mini:
          this.mini = !this.mini
          break
        case actionsType.orientation:
          tree.changeOrientationTree(param)
          break
        case actionsType.nodeh:
          tree.changeNodeh(param)
          break
        case actionsType.nodew:
          tree.changeNodew(param)
          break
      }
    },

    /**
     * Evento acionado pelo componente treeModal
     * Redesenha a ??rvore e fecha o modal ap??s a edi????o do n??
     * @param isNotModified n??o salva o hist??rico de modifica????o caso seja true
     */
    confirmEditNode (isNotModified) {
      tree.redrawTree(isNotModified)
      this.modal = false
      this.children = false
      tree.setModalstate(false)
    },

    /**
     * Busca no backend as op????es de atribuitos dispon??veis para os selects do
     * modal e repassa essas informa????es para o component TreeModal via props
     */
    loadAtributesBackend () {
      /*************************************************************************
       * //TODO: Adicionar aqui no futuro c??digo para carregar json do backend
       ************************************************************************/
      // const json = jsonExampleIgnoreSimulationData
      const json = this.simulation
      this.json = this.simulation
      // const json = jsonFernando
      /************************************************************************/

      /**
       * Fornece para lib que constroi o fluxograma o json para alterar apenas simulationData
       *
       * 1 - Caso o JSON tenha o formato antigo da plataforma o simulationData ?? ignorado
       * mas as op????es de atributos s??o carregados do json e o fluxograma iniciara com
       * o json carregado do localstorage, caso o localstorage esteja vazio ser?? iniciado
       * uma simula????o padr??o com os dois n??s iniciais
       * Exemplo de json -> jsonExampleIgnoreSimulationData
       *
       * 2 - Caso o JSON tenha o formato novo definido pela Fernando no documento de requisito
       * conforme o algoritmo no topico de "Detalhamento do Processo do Menu Salvar" pg. 28
       * na qual as chaves dos n??s devem come??am com os caracteres "d_" ou "s_" ou "b_".
       * O fluxograma ira carregar os dados do simulationData e gerar fluxograma salvo.
       * Exemplo de json -> jsonExampleLoadFluxograma
       */
      tree.setJsonFromPP(json.data.system)

      this.optionSelect.class = json.data.stage.map(stage => {
        return {
          color: stage.color.name,
          text: stage.name
        }
      })

      this.optionSelect.resource = json.data.resource.map(resource => {
        return {
          unit: resource.unit,
          category: resource.resourceCategory,
          text: resource.name
        }
      })
    },

    /**
     * Carrega as op????es de fatores e dura????o do json recebido pela plataforma
     */
    loadVectorFromJson (from, to) {
      from.forEach((element) => {
        to.push({
          text: element
        })
      })
      to.sort((a, b) => (a.text > b.text ? 1 : -1))
    },

    /**
     * Carrega as op????es de classes do json recebido pela plataforma
     */
    loadClassFromJson (from, to) {
      for (const item in from) {
        to.push({
          color: from[item].color,
          text: item
        })
      }
      to.sort((a, b) => (a.text > b.text ? 1 : -1))
    },

    /**
     * Carrega as op????es de recursos do json recebido pela plataforma
     */
    loadResourceFromJson (from, to) {
      for (const item in from) {
        to.push({
          unit: from[item].unit,
          category: from[item].category,
          text: item
        })
      }
      to.sort((a, b) => (a.text > b.text ? 1 : -1))
    },

    /**
     * Salva no backend da aplica????o o estado atual ??rvore construida
     */
    saveTreeBackend () {
      /*************************************************************************
       * //TODO: Adicionar aqui no futuro c??digo para salvar ??rvore no backend
       ************************************************************************/

      // Por enquanto esta apenas salvando no localstorage
      tree.save()

      // Pega o json convertido no formato P+P para enviar para a plataforma
      // const jsonPP = tree.generateJsonPP()
      console.log('Saving data => json', this.json)

      this.$emit('saveChanges', {
        system: this.json.data.system,
        onlyFlow: {
          node: this.json.data.system.node,
          flow: this.json.data.system.flow,
          parameter: this.json.data.system.parameter
        }})
    },

    /**
     * Destroy no backend da aplica????o o estado atual ??rvore construida
     */
    removeTreeBackend () {
      /*************************************************************************
       * //TODO: Adicionar aqui no futuro c??digo para exluir ??rvore no backend
       ************************************************************************/

      // Por enquanto esta apenas removendo do localstorage
      tree.clean()
    }
  }
}
</script>

<style scoped>
.fluxograma {
  /* border: solid; */
  padding: 0;
  margin: 0;
  font-family: "PT Mono", monospace;
}

::v-deep .link {
  fill: none;
  /* stroke: #ccc; */
  stroke-width: 3px;
}

section {
  z-index: 1;
  position: relative;
}

::v-deep circle {
  cursor: pointer;
}
</style>
