<template>
  <v-snackbar v-model="hasUpdate" :multi-line="true" :timeout="60000">
    Nova versão disponível!
    <v-btn
      dark
      text
      @click="update()"
      color="info"
    >
      Atualizar
    </v-btn>
    <v-btn dark icon @click="hasUpdate = false">
      <v-icon>close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      hasUpdate: false
    }
  },
  mounted () {
    document.addEventListener(
      'hasUpdate',
      () => {
        this.hasUpdate = true
      },
      false
    )
  },
  methods: {
    update () {
      window.location.reload()
    }
  }
}
</script>
