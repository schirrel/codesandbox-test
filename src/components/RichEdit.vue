<template>
  <v-input v-bind:value="value" :rules="rules" :label="label" class="richedit">
    <VueEditor v-model="text" class="mt-2" />
  </v-input>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor },
  props: ['value', 'rules', 'label'],
  watch: {
    text (v) {
      this.$emit('input', v)
    },
    value (v) {
      this.text = v
    }
  },
  data () {
    return {
      text: ''
    }
  },
  created () {
    this.text = this.value
  }
}
</script>

<style>
.richedit div div {
  display: block;
}
</style>
