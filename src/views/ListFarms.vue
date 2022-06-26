<template>
  <v-app>
    <nav>
      <v-app-bar color="green lighten-1" dark clipped-left fixed>
        <v-icon color="white" class="mr-3">
          mdi-leaf
        </v-icon>

        <v-toolbar-title v-text="manifest.short_name" />

        <v-spacer />

        <!-- Large Display -->
        <v-btn text color="white" class="mr-3 ml-0 hidden-sm-and-down" @click="$router.push('/about')">
          <v-icon left>
            mdi-information-outline
          </v-icon> Sobre
        </v-btn>
        <v-btn outlined color="white" class="mr-3 ml-0 hidden-sm-and-down" v-if="user && user.authenticated" @click="sync()">
          <v-icon left>
            mdi-sync
          </v-icon> Sincronizar
        </v-btn>
        <div class="d-flex align-center mr-3" style="margin-left: auto">
          <user-wrapper class="hidden-xs-only" />
        </div>
        <v-btn dark color="purple" depressed @click.stop="showWizard()" large class="hidden-sm-and-down" v-if="farms && farms.length > 0">
          <v-icon left>
            mdi-plus
          </v-icon> Nova Simulação
        </v-btn>

        <!-- Small Display -->
        <v-btn icon class="hidden-md-and-up" @click="$router.push('/about')">
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
        <v-btn icon class="hidden-md-and-up" @click="$router.push('/login')" v-if="!user || !user.authenticated">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn icon class="hidden-md-and-up" v-if="user && user.authenticated" @click="sync()">
          <v-icon>mdi-sync</v-icon>
        </v-btn>
      </v-app-bar>
    </nav>
    <v-main class="mt-12">
      <v-container fluid grid-list-lg>
        <v-card outlined v-if="user && user.authenticated" class="mt-4 hidden-sm-and-up">
          <user-wrapper />
        </v-card>

        <welcome-wrapper @wizard="showWizard" v-if="!farms || farms.length === 0" />
        <v-row class="pt-4" v-else>
          <v-col cols="12" class="hidden-sm-and-up">
            <v-btn dark block color="purple" @click.stop="showWizard()" x-large>
              <v-icon left>
                mdi-plus
              </v-icon> Nova Simulação
            </v-btn>
          </v-col>
          <v-col cols="12" class="px-2" v-for="f in farms" :key="f.code">
            <v-card outlined class="mx-1" color="blue-grey lighten-5">
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title>
                    {{ f.name }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ f.city || 'N/A' }} - {{ f.state || 'N/A' }}
                  </v-card-subtitle>
                </div>

                <div class="mr-4 mt-6">
                  <v-btn color="primary" icon depressed @click="edit(f)">
                    <v-icon>
                      mdi-tune
                    </v-icon>
                  </v-btn>
                </div>
              </div>
              <v-divider />

              <simulations-small-wrapper :farm="f.code" @refresh="refresh" @message="message" v-if="$vuetify.breakpoint.xsOnly" />
              <simulations-large-wrapper :farm="f.code" @refresh="refresh" @message="message" v-else />
            </v-card>
          </v-col>
        </v-row>

        <v-dialog v-model="wizard" width="500px" :fullscreen="$vuetify.breakpoint.xsOnly" persistent>
          <wizard-wrapper @close="hideWizard" @refresh="refresh" />
        </v-dialog>

        <farm-edit-wrapper @message="message" @refresh="refresh" ref="edit" />

        <confirm-wrapper ref="confirm" />

        <message-wrapper ref="message" />

        <progress-wrapper
          message="Sincronizando... Por favor, aguarde!"
          color="teal"
          :size="50"
          ref="progress"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import manifest from '../../public/manifest.json'
import brazil from '@/assets/brazil.json'
import moment from 'moment'
import axios from 'axios'
import timestamp from 'unix-timestamp'

import UserWrapper from '@/components/UserProfile.vue'
import ConfirmWrapper from '@/components/ConfirmDialog.vue'
import MessageWrapper from '@/components/MessageSnack.vue'
import ProgressWrapper from '@/components/ProgressBar.vue'
import SimulationsLargeWrapper from '@/components/SimulationsLarge.vue'
import SimulationsSmallWrapper from '@/components/SimulationsSmall.vue'
import WelcomeWrapper from '@/components/WelcomeMessage.vue'
import WizardWrapper from '@/components/SimulationWizard.vue'
import FarmEditWrapper from '@/components/FarmEdit.vue'

export default {
  components: {
    UserWrapper,
    ConfirmWrapper,
    MessageWrapper,
    ProgressWrapper,
    SimulationsLargeWrapper,
    SimulationsSmallWrapper,
    WelcomeWrapper,
    WizardWrapper,
    FarmEditWrapper
  },
  data () {
    return {
      wizard: false,
      farm: false,
      logged: false,
      manifest: manifest,
      sidebar: false,
      show: false,
      progress: 0,
      dialogsCreate: {
        create: false,
        delete: false
      },
      dialogsUpdate: {
        create: false,
        delete: false
      },
      valid: false,
      user: null,
      search: {
        display: false,
        text: '',
        checkbox: []
      },
      farms: [],
      farmsSearched: [],
      name: '',
      type: ''
    }
  },
  mounted () {
    if (this.$localStorage.get('user').authenticated) {
      this.user = this.$localStorage.get('user')
    }

    if (!this.$root.$data.trySync || !this.user) {
      this.refresh()
    } else {
      this.sync()
    }
  },
  methods: {
    cleanup () {
      const self = this

      this.$refs.confirm
        .open(
          'Trocar Usuário',
          'Tem certeza de que deseja LIMPAR TODOS OS DADOS DO APLICATIVO NESTE DISPOSITIVO e TROCAR O USUÁRIO? Você não irá perder nenhuma simulação já sincronizada com a nuvem, podendo visualizá-las quando logar novamente neste ou em outro dispositivo. Simulações em edição (não sincronizadas) serão perdidas de forma irreversível.',
          { color: 'error' }
        )
        .then((confirm) => {
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
            window.location.reload()
          }
        })
    },
    refresh () {
      this.$db.simulation
        .orderBy('farm')
        .and(s => s.active)
        .keys(keys => {
          this.$db.farm
            .where('code')
            .anyOf(keys)
            .sortBy('name')
            .then((farms) => {
              this.farms = farms
            })
        })
    },
    sync () {
      if (!navigator.onLine) {
        this.$refs.message.open(
          'É necessário uma conexão com a internet para prosseguir! Por favor, verifique suas configurações de rede ou tente novamente mais tarde.',
          'error'
        )

        return
      }

      this.$refs.progress.openProgress()

      const self = this

      const now = timestamp.now()

      const ts = this.$localStorage.get('synchronized')

      const lastSync = timestamp.toDate(ts)

      const err = function (error) {
        console.log(error)

        self.$refs.progress.closeProgress()

        self.refresh()

        self.$refs.message.open(
          'Atenção! Erro ao tentar sincronizar. Por favor, tente novamente mais tarde.',
          'error'
        )
      }

      const api = process.env.VUE_APP_API

      console.log('#1 - Starting sync proccess. First, will test if server its OK.')

      axios.get(api + '/status', { timeout: 2000 }).then(response => {
        console.log('#2 - Server OK. Loading farms from local DB.')

        self.$db.farm
          .where('changed')
          .above(lastSync)
          .toArray()
          .then((farms) => {
            console.log('#3 - ' + farms.length + ' farms getted from local DB. Sending to remote server.')

            const promises = []

            farms.forEach((farm) => {
              promises.push(axios.post(api + '/farm', farm, { headers: { Authorization: 'Bearer ' + self.user.token } }))
            })

            axios.all(promises).then(results => {
              console.log('#4 - Farms sended. Getting farms from remote server.')

              axios.get(api + '/farms/' + timestamp.fromDate(lastSync), { headers: { Authorization: 'Bearer ' + self.user.token } }).then(response => {
                const items = response.data

                console.log('#5 - ' + items.length + ' farms getted from remote server. Saving on local DB.')

                self.$db.transaction('rw', self.$db.farm, () => {
                  items.forEach((d) => {
                    d.created = new Date(d.created)
                    d.changed = new Date(d.changed)

                    self.$db.farm.put(d)
                  })
                }).then(() => {
                  console.log('#6 - All farms saved. Loading simulations from local DB.')

                  self.$db.simulation
                    .where('changed')
                    .above(lastSync)
                    .toArray()
                    .then((simulations) => {
                      console.log('#5 - ' + simulations.length + ' simulations getted from local DB. Sending to remote server.')

                      const promises = []

                      simulations.forEach((s) => {
                        if (s.validated) {
                          promises.push(axios.post(api + '/simulation', s, { headers: { Authorization: 'Bearer ' + self.user.token } }))
                        }
                      })

                      axios.all(promises).then(results => {
                        console.log('#6 - All simulations sended. Getting simulations from remote server.')

                        axios.get(api + '/simulations/' + ts, { headers: { Authorization: 'Bearer ' + self.user.token } }).then(response => {
                          const items = response.data

                          console.log('#7 - ' + items.length + ' simulations getted from remote server. Saving on local DB.')

                          self.$db.transaction('rw', self.$db.simulation, () => {
                            items.forEach((d) => {
                              d.created = new Date(d.created)
                              d.changed = new Date(d.changed)

                              self.$db.simulation.put(d)
                            })
                          }).then(() => {
                            console.log('#8 - All simulations saved. Deleting non-active simulations on local DB.')

                            self.$db.simulation
                              .where('active')
                              .equals(0)
                              .delete()

                            this.$root.$data.trySync = false

                            this.$localStorage.set('synchronized', now)

                            self.refresh()

                            self.$refs.progress.closeProgress()

                            self.$refs.message.open(
                              'Sincronização realizada com sucesso!',
                              'success'
                            )
                          }).catch(err)
                        }).catch(err)
                      }).catch(err)
                    })
                }).catch(err)
              }).catch(err)
            }).catch(err)
          })
      }).catch(err)
    },
    edit (farm) {
      this.$refs.edit.open(farm)
    },
    simulations (farm) {
      this.$router.push({ path: '/simulations/' + farm.code })
    },
    showWizard () {
      this.wizard = true
    },
    hideWizard () {
      this.wizard = false
    },
    message (text, type, time) {
      this.$refs.message.open(text, type, time)
    }
  },
  computed: {
    cities: function () {
      for (let i = 0; i < brazil.states.length; i++) {
        if (brazil.states[i].name === this.farm.state) {
          return brazil.states[i].cities
        }
      }
      return []
    }
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      return moment(value).format('D/M/YY HH:mm')
    }
  }
}
</script>
<style scoped lang="scss"></style>
