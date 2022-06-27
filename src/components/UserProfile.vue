<template>
  <v-list style="background-color: transparent;">
    <v-btn
      text
      color="white"
      to="/login"
      block
      v-if="!user || !user.authenticated"
    >
      <v-icon left>
        mdi-account
      </v-icon>Login
    </v-btn>
    <v-list-item
      v-if="user && user.authenticated"
      style="background-color: rgba(255, 255, 255, 0.1);"
    >
      <v-list-item-avatar>
        <v-img :src="user.picture !== '' ? user.picture : require('@/assets/user.png')" :alt="user.name" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title v-html="user.name.trim() !== '' ? user.name : user.email" />
        <v-list-item-subtitle v-if="user.name.trim() !== ''">
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item @click="profile = true">
              <v-list-item-icon class="mr-2">
                <v-icon>mdi-clipboard-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                Dados Pessoais
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="logoff()">
              <v-list-item-icon class="mr-2">
                <v-icon>mdi-power</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                Sair
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-list-item-icon>
    </v-list-item>
    <v-dialog v-model="profile" width="540px" persistent :fullscreen="$vuetify.breakpoint.xsOnly">
      <v-card>
        <v-card-title>
          <v-spacer />
          <v-btn icon @click="cancel()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div class="mx-auto text-center">
          <v-avatar size="128" class="mt-0 mb-2">
            <v-img :src="user.picture !== '' ? user.picture : require('@/assets/user.png')" />
          </v-avatar>
        </div>
        <v-card-text class="text-center">
          Para definir ou alterar sua imagem de perfil, utilize o serviço <a href="https://gravatar.com" target="_blank">Gravatar</a>.<br>
          <strong>Atenção!</strong> A Embrapa e seus parceiros <u>NÃO</u> armazenam sua foto.
        </v-card-text>
        <v-alert type="error" icon="mdi-alert" :value="error" transition="scale-transition" class="mx-2 my-0" v-if="!remove">
          {{ message }}
        </v-alert>
        <v-card-text class="text-center">
          <v-text-field
            label="e-Mail"
            v-model="user.email"
            outlined
            append-icon="mdi-email"
            disabled
          />

          <v-text-field
            label="Nome (opcional)"
            v-model="name"
            outlined
            append-icon="mdi-pencil"
            hint="Seu nome, apelido ou como quer ser chamado."
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            text
            @click="remove = !remove"
          >
            Apagar Perfil
            <v-icon color="orange lighten-1">
              {{ remove ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>

          <v-spacer />

          <v-btn
            color="success white--text"
            depressed
            large
            @click="save()"
            :loading="loading"
          >
            Salvar
            <v-icon class="ml-1">
              mdi-check
            </v-icon>
          </v-btn>
        </v-card-actions>
        <v-expand-transition>
          <div v-show="remove">
            <v-divider />
            <v-card-text class="mb-0 pb-0 text-justify">
              <p>
                Você pode <strong>apagar completamente seu perfil de usuário</strong> a qualquer monento.
                Isto removerá todas as suas informações dos nossos servidores remotos, tal como seus dados pessoais, de fazendas e os utilizados nas simulações.
                Esteja ciente, no entanto, que esta é uma <u>ação irreversível</u>, ou seja, seus dados e histórico de acesso serão <u>permanentemente apagados</u>
                sem qualquer possibilidade de recuperação.
              </p>
            </v-card-text>
            <v-alert type="error" icon="mdi-alert" :value="error" transition="scale-transition" class="mx-2 my-0" v-if="remove">
              {{ message }}
            </v-alert>
            <v-window v-model="step">
              <v-window-item>
                <v-card-actions>
                  <v-switch
                    v-model="aware"
                    label="Estou ciente e quero continuar."
                    inset
                    class="ml-2"
                  />

                  <v-spacer />

                  <v-btn
                    color="primary white--text"
                    text
                    large
                    @click="sendRemovePin()"
                    :disabled="!aware"
                    :loading="loading"
                  >
                    Prosseguir
                    <v-icon class="ml-1">
                      mdi-arrow-right
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-window-item>
              <v-window-item>
                <v-card-text class="text-justify red darken-2 white--text">
                  Um número de 6 dígitos foi enviado para o e-mail <strong>{{ user.email }}</strong>. Se tiver realmente certeza de que quer continuar, insira-o abaixo:
                </v-card-text>
                <div class="input-wrapper my-5" style="width: 280px; margin: 0 auto;">
                  <v-otp-input v-model="pin" :length="6" />
                </div>
                <v-card-actions>
                  <v-btn
                    color="error"
                    text
                    @click="cancel()"
                  >
                    Cancelar
                  </v-btn>

                  <v-spacer />

                  <v-btn
                    color="warning"
                    depressed
                    :disabled="pin.length !== 6"
                    large
                    @click="removeAccount()"
                    :loading="loading"
                  >
                    Remover Conta
                    <v-icon class="ml-1">
                      mdi-check
                    </v-icon>
                  </v-btn>
                </v-card-actions>
              </v-window-item>
            </v-window>
          </div>
        </v-expand-transition>
      </v-card>

      <message-wrapper ref="message" />
    </v-dialog>

    <confirm-wrapper ref="confirm" />
  </v-list>
</template>

<script>
import axios from 'axios'
import ErrorHelper from '@/helpers/error'

import MessageWrapper from '@/components/MessageSnack.vue'
import ConfirmWrapper from '@/components/ConfirmDialog.vue'

export default {
  mixins: [
    ErrorHelper
  ],
  components: {
    MessageWrapper,
    ConfirmWrapper
  },
  data () {
    return {
      user: {
        name: '',
        email: '',
        picture: ''
      },
      name: '',
      profile: false,
      remove: false,
      aware: false,
      step: 0,
      pin: '',
      loading: false,
      error: false,
      message: ''
    }
  },
  mounted () {
    if (this.$localStorage.get('user').authenticated) {
      this.user = this.$localStorage.get('user')
      this.name = this.user.name
    }
  },
  methods: {
    cancel () {
      if (this.user) {
        this.name = this.user.name
      } else {
        this.name = ''
      }

      this.remove = false
      this.aware = false
      this.step = 0
      this.pin = ''
      this.loading = false

      this.profile = false
    },
    sendRemovePin () {
      this.error = false

      if (!navigator.onLine) {
        this.message = 'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.'

        this.error = true

        return
      }

      const err = error => {
        this.loading = false

        this.message = this.errorMessage(error)

        this.error = true
      }

      this.loading = true

      const api = process.env.VUE_APP_API

      axios.get(api + '/status', { timeout: 2000 }).then(response => {
        axios.post(api + '/user/remove/pin', { email: this.email }, { headers: { Authorization: 'Bearer ' + this.user.token } }).then(response => {
          this.loading = false

          this.step++
        }).catch(err)
      }).catch(err)
    },
    removeAccount () {
      this.error = false

      if (!navigator.onLine) {
        this.message = 'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.'

        this.error = true

        return
      }

      const err = error => {
        this.loading = false

        this.message = this.errorMessage(error)

        this.error = true
      }

      this.loading = true

      const api = process.env.VUE_APP_API

      axios.get(api + '/status', { timeout: 2000 }).then(response => {
        axios.post(api + '/user/remove/confirm', { pin: this.pin }, { headers: { Authorization: 'Bearer ' + this.user.token } }).then(response => {
          this.$refs.message.open(
            'Todos os seus dados na nuvem foram completamente apagados!',
            'success'
          )

          this.cleanup()

          this.cancel()

          this.$refs.confirm.open(
            'Limpar Dados Locais',
            'Os seus dados na nuvem foram completamente apagados, bem como suas informações de login neste dispositivo. Deseja apagar também os dados locais de fazendas e simulações? Você pode continuar utilizando o aplicativo sem se identificar e/ou sincronizar dados com a nuvem.',
            { color: 'warning' }).then((confirm) => {
            if (confirm) {
              this.$db.simulation.clear()
              this.$db.farm.clear()
            }

            window.location.reload()
          })
        }).catch(err)
      }).catch(err)
    },
    save () {
      this.error = false

      if (!navigator.onLine) {
        this.message = 'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.'

        this.error = true

        return
      }

      const err = error => {
        this.loading = false

        this.message = this.errorMessage(error)

        this.error = true
      }

      this.loading = true

      const api = process.env.VUE_APP_API

      axios.get(api + '/status', { timeout: 2000 }).then(response => {
        axios.post(api + '/user/name', { name: this.name }, { headers: { Authorization: 'Bearer ' + this.user.token } }).then(response => {
          this.user.name = this.name

          this.$localStorage.set('user', this.user)

          this.$refs.message.open(
            'Seu nome foi alterado com sucesso!',
            'success'
          )

          this.loading = false
        }).catch(err)
      }).catch(err)
    },
    cleanup () {
      this.user = {
        authenticated: false,
        name: '',
        email: '',
        picture: '',
        token: ''
      }

      this.$localStorage.set('user', this.user)

      this.$localStorage.set('synchronized', 0)

      this.$localStorage.set('reliable', false)

      this.$localStorage.set('email', '')

      this.$root.$data.trySync = true
    },
    logoff () {
      this.$refs.confirm.open(
        'Sair',
        'Deseja realmente sair/deslogar do aplicativo? Atenção! Todos os dados NÃO SINCRONIZADOS serão PERMANENTE PERDIDOS.',
        { color: 'error' }).then((confirm) => {
        if (confirm) {
          this.cleanup()

          this.$db.simulation.clear()
          this.$db.farm.clear()

          window.location.reload()
        }
      })
    }
  }
}
</script>
