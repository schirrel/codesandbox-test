<template>
  <v-snackbar :timeout="timeout" :color="type" :multi-line="true" :vertical="false" v-model="snackbar">
    {{ message }}
    <template v-slot:action="{ attrs }">
      <v-btn
        color="white"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Fechar
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      snackbar: false,
      message: null,
      type: 'success',
      timeout: 2000
    }
  },
  methods: {
    open (message, type, timeout) {
      this.snackbar = true
      this.message = message

      if (type) this.type = type

      if (timeout) this.timeout = timeout
    }
  }
}
</script>
