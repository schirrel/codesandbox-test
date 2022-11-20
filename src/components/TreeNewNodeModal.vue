<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          <span> Primeiramente é necessário criar um
        <strong>código identificador</strong> para o nó. </span>
        </v-card-title>
        <v-card-text>
              <v-form v-model="valid" ref="form" @submit.prevent="submit">
          <v-text-field
            label="code"
            v-model="newNode.code"
            :rules="[rules.required, rules.counter, rules.min,  rules.alphanumericUnderscore, rules.notExisists]"
          />
              </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="cancel">
            Cancelar
          </v-btn>
          <v-btn color="green darken-1" text @click="submit">
            Criar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  data () {
    return {
      valid: false,
      dialog: false,
      newNode: {
        code: ''
      },
      rules: {
        required: value => !!value || 'Obrigatorio.',
        counter: value => value.length <= 6 || 'Máximo de 6 digitos',
        min: value => value.length > 2 || 'Mínimo de 3 digitos',
        alphanumericUnderscore: value => {
          const pattern = /^\w+$/
          return pattern.test(value) || 'Somente números e letras.'
        },
        notExisists: value => {
          const currentJson = localStorage.json ? JSON.parse(localStorage.json)?.node?.map(node => node.code) : []
          return !currentJson.some(current => current === value) || 'Code existente'
        }
      }
    }
  },
  methods: {
    open () {
      this.dialog = true
      this.newNode = {
        code: ''
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    submit () {
      const validate = this.$refs.form.validate()
      if (validate) {
        this.resolve(this.newNode.code)
        this.dialog = false
      }
    },
    cancel () {
      this.reject(false)
      this.dialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
strong {
  word-break: normal;
}
</style>
