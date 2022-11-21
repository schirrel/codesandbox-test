<template>
  <v-navigation-drawer clipped stateless v-model="drawer" absolute :mini-variant="mini" >
    <v-list dense>
      <v-subheader class="mt-2 grey--text text--darken-1"> {{ mini ? '': 'Fluxos'}} </v-subheader>

      <v-list-item
        v-for="item in menuFlow"
        :key="item.value"
        @click="setTypeOfClick(item.value)"
        :class="isActive(item.value)"
        :ripple="true"
      >
        <v-list-item-action>
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
          <img class="svg-custom-icon" v-else-if="item.iconSvg" :src="item.iconSvg"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-subheader class="mt-2 grey--text text--darken-1"> {{ mini ? '': 'Balanços'}} </v-subheader>

      <v-list-item
        v-for="item in menuBalance"
        :key="item.value"
        @click="setTypeOfClick(item.value)"
        :class="isActive(item.value)"
        :disabled="item.disabled"
        :ripple="true"
      >
        <v-list-item-action :disabled="item.disabled">
          <v-icon :disabled="item.disabled" v-if="item.icon">{{ item.icon }}</v-icon>
          <img class="svg-custom-icon" v-else-if="item.iconSvg" :src="item.iconSvg"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
          <small>  Desabilitado </small>
        </v-list-item-content>
      </v-list-item>

      <v-subheader class="mt-2 grey--text text--darken-1"> {{ mini ? '': 'Estações'}} </v-subheader>

      <v-list-item
        v-for="item in menuStation"
        :key="item.value"
        @click="setTypeOfClick(item.value)"
        :class="isActive(item.value)"
        :disabled="item.disabled"
        :ripple="true"
      >
        <v-list-item-action :disabled="item.disabled">
          <v-icon :disabled="item.disabled" v-if="item.icon">{{ item.icon }}</v-icon>
          <img class="svg-custom-icon" v-else-if="item.iconSvg" :src="item.iconSvg"/>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
          <small>  Desabilitado </small>
        </v-list-item-content>
      </v-list-item>

      <v-subheader class="mt-2 grey--text text--darken-1"> {{ mini ? '': 'Modelo'}} </v-subheader>

      <v-list-item
        v-for="item in menuModel"
        :key="item.value"
        @click="executeModelCommand(item.value)"
        :ripple="true"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { actionsType } from '../library/D3Tree'
import tripOrigin from '@/assets/icons/trip_origin.svg'
export default {
  props: ['TypeOfActionSelectedNow', 'mini'],
  data () {
    return {
      /**
       * Variável boleana usada para controlar a abertura do menu
       * true(abre) - false(fecha)
       */
      drawer: true,
      // mini: false,
      /**
       * Vetor usado para construir o submenu de Fluxos
       * {
       *  text: Nome que será apresentado no menu,
       *  icon: Imagem que será apresentada no menu,
       *  value: Valor usado para represetar a ação acionada ao clique
       * }
       */
      menuFlow: [
        {
          text: 'Atributos',
          icon: 'mdi-text-box-multiple',
          value: actionsType.edit
        },
        {
          text: 'Entrada',
          icon: 'mdi-arrow-up',
          value: actionsType.addIn
        },
        {
          text: 'Saída',
          icon: 'mdi-arrow-down',
          value: actionsType.addOut
        },
        {
          text: 'Excluir',
          icon: 'mdi-close',
          value: actionsType.remove
        }
      ],
      /**
       * Vetor usado para construir o submenu de Balanço
       */
      menuBalance: [
        {
          text: 'Adicionar',
          iconSvg: tripOrigin,
          value: actionsType.addBalance,
          disabled: true
        },
        {
          text: 'Excluir',
          icon: 'mdi-close-circle',
          value: actionsType.removeBalance,
          disabled: true
        }
      ],
      /**
       * Vetor usado para construir o submenu de Balanço
       */
      menuStation: [
        {
          text: 'Adicionar',
          iconSvg: tripOrigin,
          value: actionsType.addStation,
          disabled: true
        },
        {
          text: 'Excluir',
          icon: 'mdi-close-circle',
          value: actionsType.removeStation,
          disabled: true
        }
      ],
      /**
       * Vetor usado para construir o submenu de Modelo
       */
      menuModel: [
        {
          text: 'Desfazer',
          icon: 'mdi-undo',
          value: actionsType.undo
        },
        {
          text: 'Refazer',
          icon: 'mdi-redo',
          value: actionsType.redo
        },
        {
          text: 'Salvar',
          icon: 'mdi-content-save',
          value: actionsType.save
        },
        {
          text: 'Reset',
          icon: 'mdi-refresh',
          value: actionsType.reset
        },
        {
          text: 'Configurações',
          icon: 'mdi-cog',
          value: actionsType.config
        }
      ]
    }
  },
  methods: {
    /**
     * Emiti um evento que seleciona o tipo de clique no componente Tree
     * Tipos de Cliques:
     *  - Adiciona nó entrada
     *  - Adiciona nó saída
     *  - Remove nó
     *  - Adiciona balanço
     *  - Remove balanço
     *  - Editar propriedades do nó
     **/
    setTypeOfClick (type) {
      this.$emit('setTypeClickTree', type)
    },
    /**
     * Emiti um evento que executa o tipo de comando selecionado no componente Tree
     * Tipos de Commando:
     *  - Desfazer
     *  - Refazer
     *  - Salvar
     *  - Resetar
     **/
    executeModelCommand (type) {
      this.$emit('executeModelCommand', type)
    },
    /**
     * Aplica a classe 'active' caso seja a opção selecionada no menu
     */
    isActive (itemValue) {
      if (this.TypeOfActionSelectedNow === itemValue) return 'active'
      else return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  background-color: #f5f5f5;
}

.svg-custom-icon {
  height: 24px;
  width: 24px;
}
[disabled] .svg-custom-icon {
  opacity: .8;
}

</style>
