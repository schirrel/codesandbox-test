<template>
  <v-dialog content-class="rightModal" v-model="childrenModel" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Children</span>
      </v-card-title>

      <v-list-tile
          v-for="item in menuFlow"
          :key="item.value"
          @click="setTypeOfClick(item.value)"
          :class="isActive(item.value)"
          :ripple="true"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      <v-card-actions>
        <v-btn @click="cancelChangeInNode">Cancelar</v-btn>
        <v-btn @click="saveChangeInNode">Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { actionsType } from '../library/D3Tree'

export default {
  props: ['children', 'selectedNode', 'treeChildren', 'TypeOfActionSelectedNow'],
  data () {
    return {
      menuFlow: [
        {
          text: 'SS',
          icon: 'add',
          value: actionsType.addSS
        },
        {
          text: 'SE',
          icon: 'add',
          value: actionsType.addSE
        },
        {
          text: 'EE',
          icon: 'add',
          value: actionsType.addEE
        },
        {
          text: 'ES',
          icon: 'add',
          value: actionsType.addES
        }
      ],
      childrenModel: false
    }
  },
  watch: {
    children (newValue) {
      this.childrenModel = newValue
    }
  },
  methods: {
    setTypeOfClick (type) {
      this.$emit('setTypeClickTree', type)
    },
    cancelChangeInNode () {
      this.$emit('confirmEditNode', true)
    },
    saveChangeInNode () {
      this.$emit('confirmEditNode', false)
    },
    isActive (itemValue) {
      if (this.TypeOfActionSelectedNow === itemValue) return 'active'
      else return ''
    }
  }
}
</script>

<style>
@media (min-width: 600px) {
  .rightModal {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
