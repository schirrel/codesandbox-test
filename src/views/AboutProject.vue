<template>
  <v-app light>
    <nav>
      <v-app-bar clipped-left dark color="green lighten-1">
        <v-btn icon @click.native="cancel">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title v-text="$route.name" />
      </v-app-bar>
    </nav>

    <v-main>
      <v-container fluid>
        <v-row wrap>
          <v-col cols="12" xs="12">
            <p class="text-center my-2">
              <img src="@/assets/stamp.png">
            </p>
          </v-col>

          <v-col cols="12" xs="12" sm="12" md="10" offset-md="1" lg="8" offset-lg="2" xl="6" offset-xl="3">
            <v-card outlined>
              <v-card-text>
                <p>
                  Este aplicativo é parte integrante do projeto <strong>%GENESIS_PROJECT_NAME%</strong> e foi desenvolvido pela
                  <a href="https://www.embrapa.br/gado-de-corte" target="_blank" rel="noopener">Embrapa Gado de Corte</a>, em Campo Grande - MS, e a
                  <a href="https://www.embrapa.br/florestas" target="_blank" rel="noopener">Embrapa Florestas</a>, em Colombo - PR. Seu
                  desenvolvimento contou com o apoio da
                  <a href="https://facom.ufms.br" target="_blank" rel="noopener">Faculdade de Computação - FACOM</a> da
                  <a href="https://www.ufms.br" target="_blank" rel="noopener">Universidade Federal de Mato Grosso do Sul - UFMS</a>, em Campo Grande
                  - MS.
                </p>
                <p>
                  Encontrou algum problema? Por favor, nos avise informando o número da versão abaixo, a mensagem de erro e o modelo do seu
                  <em>smartphone</em> por um dos nossos canais de comunicação:
                </p>
              </v-card-text>
              <v-card-text>
                <v-row align="center" justify="center">
                  <v-btn-toggle multiple class="mb-4">
                    <v-btn
                      :href="'mailto: ' + settings.email + '?subject=Problemas%20na%20vers%C3%A3o%20' + version + '%20do%20aplicativo%20%GENESIS_PROJECT_UNIX%'"
                      x-large
                      color="primary"
                      class="white--text"
                    >
                      <v-icon class="mr-2 white--text" dark>
                        mdi-email
                      </v-icon>
                      e-Mail
                    </v-btn>

                    <v-btn
                      :href="'https://api.whatsapp.com/send?phone=' + settings.whats"
                      x-large
                      color="green"
                      class="white--text"
                    >
                      <v-icon class="mr-2 white--text" dark>
                        mdi-whatsapp
                      </v-icon>
                      Whatsapp
                    </v-btn>
                  </v-btn-toggle>
                </v-row>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-chip label color="teal" text-color="white">
                  <v-icon class="mr-1">
                    mdi-update
                  </v-icon>
                  Versão {{ version }}
                </v-chip>
                <v-spacer />
                <v-btn color="orange lighten-1" text @click="beta = !beta">
                  Beta Program
                  <v-icon color="orange lighten-1">
                    {{ beta ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                  </v-icon>
                </v-btn>
              </v-card-actions>
              <v-expand-transition>
                <div v-show="beta">
                  <v-divider />
                  <v-card-text class="mb-0 pb-0">
                    <p>
                      Você pode ter <strong>acesso antecipado</strong> a funcionalidades do aplicativo que ainda estão em desenvolvimento.
                      Com isso, poderá ajudar a equipe da Embrapa reportando erros e fazendo sugestões de ajustes.
                      É preciso estar ciente, no entanto, que <u>estas funcionalidades podem tornar o aplicativo instável</u>.
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-row align="center" justify="center">
                      <v-switch
                        v-model="participate"
                        label="Participar do Programa"
                        inset
                        @change="setBeta()"
                      />
                    </v-row>
                  </v-card-actions>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      version: process.env.VUE_APP_VERSION,
      settings: {
        email: process.env.VUE_APP_EMAIL,
        whats: process.env.VUE_APP_WHATSAPP
      },
      beta: false,
      participate: false
    }
  },
  beforeMount () {
    this.participate = this.$localStorage.get('beta')
  },
  methods: {
    cancel () {
      this.$router.push('/')
    },
    setBeta () {
      this.$localStorage.set('beta', this.participate)
    }
  }
}
</script>
