<template>
  <v-row>
    <v-col xs="12" sm="12" md="10" offset-md="1" lg="8" offset-lg="2" xl="6" offset-xl="3" class="my-6">
      <v-card :elevation="6" class="px-3 py-2">
        <v-card-title primary-title>
          <div class="headline">
            Bem vind@!
          </div>
        </v-card-title>
        <v-card-text class="body-1">
          <p>
            Este aplicativo do projeto <strong>+Precoce</strong> permite a simulação...
          </p>
          <p>
            Objetiva apoiar produtores à...
          </p>
        </v-card-text>
        <v-card-actions class="hidden-sm-and-down">
          <v-container>
            <v-row>
              <v-col class="text-right">
                <v-btn dark color="purple" @click="$emit('wizard')" x-large>
                  <v-icon left>
                    mdi-clipboard-text
                  </v-icon> Iniciar Simulação
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-actions>
        <v-card-actions class="hidden-md-and-up">
          <v-row>
            <v-col sm="12">
              <v-btn dark block color="purple" @click="$emit('wizard')" x-large>
                <v-icon left>
                  mdi-clipboard-text
                </v-icon> Iniciar Simulação
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" xs="12">
      <p class="text-center">
        <img src="@/assets/embrapa.png" style="width: 150px;">
      </p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    beta: false
  }),
  beforeMount () {
    this.beta = this.$localStorage.get('beta')
  }
}
</script>
