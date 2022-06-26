<template>
  <v-app light>
    <v-toolbar
      app
      clipped-left
      fixed
      prominent
      color="teal"
      dark
    >
      <v-btn icon @click.native="cancel">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <img src="@/assets/logo.png" style="height: 48px; margin-right: 10px;" alt="Logo" class="hidden-lg-and-up">
      <v-toolbar-title v-text="$route.name" />
      <v-spacer />
      <div class="d-flex align-center" style="margin-left: auto">
        <user-wrapper class="hidden-sm-and-down" />
      </div>
    </v-toolbar>
    <v-main>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex
            xs12
            sm12
            md10
            offset-md1
            lg8
            offset-lg2
            xl6
            offset-xl3
            class="my-3"
          >
            <v-card class="px-3 py-2">
              <v-card-title class="headline">
                Limpar dados pessoais
                <v-spacer />
                <v-icon large>
                  supervisor_account
                </v-icon>
              </v-card-title>
              <v-card-text>
                Clique no botão abaixo para <strong>remover todas as informações do aplicativo deste dispositivo.</strong>
                Isso apagará todas as suas simulações e informações pessoais.
              </v-card-text>
              <v-card-actions class="hidden-sm-and-down">
                <v-spacer />
                <v-btn color="error" @click="cleanup">
                  <v-icon left>
                    clear
                  </v-icon>
                  Limpar Dados Pessoais
                </v-btn>
              </v-card-actions>
              <v-card-actions class="hidden-md-and-up">
                <v-btn color="error" block @click="cleanup">
                  <v-icon left>
                    clear
                  </v-icon>
                  Limpar Dados Pessoais
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex
            xs12
            sm12
            md10
            offset-md1
            lg8
            offset-lg2
            xl6
            offset-xl3
            class="my-3"
          >
            <v-card class="px-3 py-2">
              <v-card-title class="headline">
                Contato
                <v-spacer />
                <v-icon large>
                  chat
                </v-icon>
              </v-card-title>
              <v-card-text>
                Clique no botão abaixo para <strong>entrar em contato</strong> ou <strong>reportar algum problema técnico</strong>:
              </v-card-text>
              <v-card-actions class="hidden-sm-and-down">
                <v-spacer />
                <v-btn color="info" @click="email">
                  <v-icon left>
                    mail
                  </v-icon>
                  Enviar e-Mail
                </v-btn>
              </v-card-actions>
              <v-card-actions class="hidden-md-and-up">
                <v-btn color="info" block @click="email">
                  <v-icon left>
                    mail
                  </v-icon>
                  Enviar e-Mail
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>

          <v-flex
            xs12
            sm12
            md10
            offset-md1
            lg8
            offset-lg2
            xl6
            offset-xl3
            class="my-3"
          >
            <p class="body-2 text-xs-center">
              Versão {{ version }}
            </p>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>

    <confirm-wrapper ref="confirm" />

    <dialog-wrapper ref="dialog" />
  </v-app>
</template>

<script>
import ConfirmWrapper from '../components/Confirm.vue'
import DialogWrapper from '../components/Dialog.vue'
import UserWrapper from '../components/User.vue'

export default {
  components: {
    ConfirmWrapper,
    DialogWrapper,
    UserWrapper
  },
  data () {
    return {
      version: process.env.VUE_APP_VERSION
    }
  },
  beforeCreate () {
    if (!this.$localStorage.get('user').authenticated) {
      this.$router.push('/')
    }
  },
  methods: {
    cancel () {
      this.$router.push({ path: '/' })
    },
    email () {
      window.open(
        'mailto: ' + process.env.VUE_APP_EMAIL + '?subject=Problemas%20na%20vers%C3%A3o%20' + this.version + '%20do%20%GENESIS_PROJECT_UNIX%',
        '_blank'
      )
    },
    cleanup () {
      const self = this

      this.$refs.confirm
        .open(
          'Trocar Usuário',
          'Tem certeza de que deseja LIMPAR TODOS OS DADOS DO APLICATIVO NESTE DISPOSITIVO e TROCAR O USUÁRIO? Você não irá perder nenhuma simulação já sincronizada com a nuvem, podendo visualizá-las quando logar novamente neste ou em outro dispositivo. Simulações em edição (não sincronizadas) serão perdidas de forma irreversível.',
          { color: 'error' }
        )
        .then(confirm => {
          if (confirm) {
            self.$db.simulation.clear()
            self.$db.farm.clear()
            self.$localStorage.set('user', {
              authenticated: false,
              name: '',
              email: '',
              picture: '',
              token: ''
            })

            self.$localStorage.set('synchronized', 0)

            self.$router.push({ path: '/' })
          }
        })
    }
  }
}
</script>
