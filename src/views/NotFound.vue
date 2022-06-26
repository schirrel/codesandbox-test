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
        <v-row wrap class="mt-4">
          <v-col cols="12" xs="12" sm="12" md="10" offset-md="1" lg="8" offset-lg="2" xl="6" offset-xl="3">
            <v-card color="red darken-3" dark>
              <v-card-title>Ops! Algo deu errado...</v-card-title>
              <v-card-subtitle>A página que você está tentando acessar não existe.</v-card-subtitle>
              <v-card-text>
                <p>
                  Isto é um problema? Por favor, nos avise informando o número da versão abaixo, a mensagem de erro e o modelo do seu
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
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      version: process.env.VUE_APP_VERSION,
      settings: {
        email: process.env.VUE_APP_EMAIL,
        whats: process.env.VUE_APP_WHATSAPP
      }
    }
  },
  methods: {
    cancel () {
      this.$router.push('/')
    }
  }
}
</script>
