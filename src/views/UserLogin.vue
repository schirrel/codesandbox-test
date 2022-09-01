<template>
  <v-app>
    <nav>
      <v-app-bar color="green lighten-1" dark clipped-left fixed>
        <v-btn icon @click.native="$router.push({ path: '/' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-app-bar-title v-text="$route.name" />

        <v-spacer />

        <beta />
      </v-app-bar>
    </nav>

    <v-main class="mt-12 pt-12">
      <v-container fluid>
        <v-row wrap>
          <v-col xs="12" sm="12" md="10" offset-md="1" lg="8" offset-lg="2" xl="6" offset-xl="3" cols="12">
            <v-card>
              <v-card-text>
                <p>
                  Você pode efetuar <strong>login</strong> para ter mais benefícios. Usuários autenticados podem sincronizar seus dados com a
                  <a href="https://embrapa.br" target="_blank" rel="noopener">Embrapa</a>, de forma a <strong>recuperá-los em caso de perda ou troca do dispositivo</strong>
                  (computador, celular, tablet, etc).
                </p>
                <p>
                  <strong>Dispositivos autenticados que utilizem o mesmo e-mail compartilham dados entre si.</strong> Desta forma, as fazendas e
                  simulações criadas ou editadas neste dispositivo podem ser acessadas, p.e., em um computador ou vice-versa.
                </p>
                <p>
                  Além disso, seus dados poderão ser utilizados, <u>sempre de forma anônima</u>, em futuras pesquisas científicas para criação de tecnologias inovadoras para a agropecuária.
                </p>
              </v-card-text>
              <v-alert type="error" icon="mdi-alert" :value="error" transition="scale-transition" class="mx-2 my-0">
                {{ message }}
              </v-alert>
              <v-window v-model="step">
                <v-window-item class="px-3">
                  <v-btn large color="purple" class="white--text" block @click="showPrivacy">
                    <v-icon dark left>
                      mdi-gavel
                    </v-icon>Política de Privacidade
                  </v-btn>
                  <v-row wrap class="py-6">
                    <v-col xs="12" sm="6" md="6" lg="6" xl="6" class="px-3 py-0" style="text-align: left;">
                      <v-switch label="Li e aceito os termos." v-model="agree" class="mt-3 ml-3" />
                    </v-col>
                    <v-col xs="12" sm="6" md="6" lg="6" xl="6" class="px-3 py-0" style="text-align: right;">
                      <v-btn color="success" large :disabled="!agree" @click="step++" :block="$vuetify.breakpoint.xsOnly">
                        Prosseguir
                        <v-icon class="ml-2">
                          mdi-arrow-right
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-window-item>

                <v-divider v-if="step > 0 && !error" />

                <v-window-item>
                  <v-card-title>
                    Informe seu e-Mail
                  </v-card-title>
                  <v-form ref="form" lazy-validation>
                    <v-row wrap class="px-5">
                      <v-col
                        xs="12"
                        sm="12"
                        md="8"
                        offset-md="2"
                        lg="6"
                        offset-lg="3"
                        xl="6"
                        offset-xl="3"
                        cols="12"
                        class="px-1 pb-0"
                        style="text-align: center;"
                      >
                        <v-text-field
                          v-model="email"
                          append-icon="mdi-email"
                          outlined
                          clearable
                          label="e-Mail"
                          type="text"
                          :rules="rules"
                        />
                      </v-col>
                      <v-col xs="12" sm="12" md="8" offset-md="2" lg="6" offset-lg="3" xl="6" offset-xl="3" cols="12" class="px-1 pt-0">
                        <v-radio-group v-model="reliable" :row="!$vuetify.breakpoint.xsOnly" class="py-0 my-0">
                          <template v-slot:label>
                            <div>Este dispositivo é <strong>confiável</strong>?</div>
                          </template>
                          <v-radio
                            label="Sim"
                            :value="true"
                          />
                          <v-radio
                            label="Não"
                            :value="false"
                          />
                          <template v-slot:append>
                            <v-btn text icon @click="reliableInfo()" small>
                              <v-icon>mdi-help-circle</v-icon>
                            </v-btn>
                          </template>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                  </v-form>
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
                      color="success"
                      depressed
                      :disabled="!validate()"
                      large
                      @click="sendPin()"
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
                  <v-card-title>
                    Insira o PIN
                  </v-card-title>
                  <v-card-text>
                    Um número de 6 dígitos foi enviado para o e-mail <strong>{{ email }}</strong>. Por favor, insira-o abaixo para continuar:
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
                      color="success"
                      depressed
                      :disabled="pin.length !== 6"
                      large
                      @click="authenticate()"
                      :loading="loading"
                    >
                      Autenticar
                      <v-icon class="ml-1">
                        mdi-check
                      </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
          <v-col xs="12" cols="12">
            <p class="text-center my-4">
              <img src="@/assets/embrapa.png" style="width: 150px;">
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <dialog-wrapper @consent="agree = true" @dissent="agree = false" ref="dPrivacy" />
    <dialog-wrapper ref="dReliable" />
    <progress-wrapper message="Autenticando... por favor, aguarde!" :size="70" color="purple lighten-2" ref="progress" />
  </v-app>
</template>

<script>
import axios from 'axios'
import ProgressWrapper from '@/components/ProgressBar.vue'
import DialogWrapper from '@/components/ConfirmDialog.vue'
import Beta from '@/components/BetaRibbon'

import md5 from 'crypto-js/md5'
import ErrorHelper from '@/helpers/error'

export default {
  mixins: [
    ErrorHelper
  ],
  components: {
    ProgressWrapper,
    DialogWrapper,
    Beta
  },
  data () {
    return {
      step: 0,
      privacy: null,
      agree: false,
      email: '',
      pin: '',
      reliable: null,
      rules: [
        v => !v || /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(v) || 'O e-mail precisa ser válido!'
      ],
      loading: false,
      wait: false,
      error: false,
      message: ''
    }
  },
  mounted () {
    if (this.$localStorage.get('user').authenticated) {
      this.$router.push({ path: '/' })
    } else if (this.$localStorage.get('email').length > 0) {
      this.agree = true
      this.reliable = true
      this.email = this.$localStorage.get('email')
      this.step = 2
    }
  },
  methods: {
    showPrivacy () {
      const self = this
      axios.get('/privacy-policy.html').then(pol => {
        self.privacy = pol.data
        self.$refs.dPrivacy.open('Política de Privacidade', self.privacy, { confirmText: 'Aceito', declineText: 'Não Aceito', width: 500 })
      })
    },
    reliableInfo () {
      const text = '<p>Um <strong>dispositivo confiável</strong> é um equipamento de <u>uso não compartilhado</u> (p.e., <strong>seu celular ou computador pessoal</strong>). Neste caso você permanecerá autenticado neste dispositivo por <u>tempo indeternimado</u>.</p>' +
        '<p>Caso esteja em um equipamento de uso compartilhado, tal como o computador de um saguão de hotel, marque <strong>NÃO</strong> nesta opção! Com isso, ao fechar o navegador, seu usuário será automaticamente deslogado.</p>'

      this.$refs.dPrivacy.open('Dispositivo Confiável', text, { confirmText: 'Ok', declineText: '' })
    },
    validate () {
      return this.$refs.form && this.$refs.form.validate() && this.reliable !== null
    },
    sendPin () {
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
        axios.post(api + '/pin', { email: this.email }).then(response => {
          if (this.reliable) this.$localStorage.set('email', this.email)

          this.loading = false

          this.step++
        }).catch(err)
      }).catch(err)
    },
    authenticate () {
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
        axios.post(api + '/authenticate', { email: this.email, pin: this.pin }).then(response => {
          const token = response.data.token

          axios.get(api + '/user', { headers: { Authorization: 'Bearer ' + token } }).then(response => {
            const user = {
              authenticated: true,
              name: response.data.name,
              email: response.data.email,
              picture: '',
              token: token
            }

            const picture = 'https://www.gravatar.com/avatar/' + md5(response.data.email).toString() + '?s=200&d=404'

            axios.get(picture).then(response => {
              user.picture = picture
            }).finally(() => {
              this.$localStorage.set('user', user)
              this.$localStorage.set('reliable', this.reliable)

              this.$localStorage.set('email', '')

              this.$router.push({ path: '/' })
            })
          }).catch(err)
        }).catch(err)
      }).catch(err)
    },
    cancel () {
      this.$localStorage.set('email', '')

      this.error = false
      this.agree = false

      this.email = ''
      this.reliable = null

      this.pin = ''

      this.loading = false

      this.step = 0
    }
  }
}
</script>
