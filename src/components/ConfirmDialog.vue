<template>
  <v-dialog v-model="dialog" :max-width="options.width" @keydown.esc="cancel()">
    <v-toolbar dark :color="options.color" dense>
      <v-toolbar-title class="white--text">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-card tile>
      <v-card-text class="px-4 py-2" v-show="!!message" v-html="message" style="text-align: justify;" />
      <v-divider v-show="!!message" />
      <v-card-actions>
        <v-spacer />
        <v-btn text @click.native="cancel()" v-if="options.declineText">
          {{ options.declineText }}
        </v-btn>
        <v-btn :color="options.color" dark @click.native="agree()"  v-if="options.confirmText">
          {{ options.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false,
      resolve: null,
      reject: null,
      message: null,
      title: null,
      options: {
        color: 'primary',
        width: 290,
        confirmText: 'Confirmar',
        declineText: 'Cancelar'
      }
    }
  },
  methods: {
    open (title, message, options) {
      this.dialog = true
      this.title = title
      this.message = message
      this.options = Object.assign(this.options, options)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      this.resolve(true)
      this.dialog = false
      this.$emit('consent')
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
      this.$emit('dissent')
    }
  }
}
</script>
