<template>
  <v-card :width="width" elevation="2" class="ma-3">
    <v-card-title>
      <v-chip class="font-weight-bold" label color="teal" text-color="white">
        {{ simulation.type }}
      </v-chip>
      <v-spacer />
      <v-icon color="grey lighten-2" v-html="simulation.validated ? (simulation.changed.getTime() < $localStorage.get('synchronized') * 1000 ? 'mdi-cloud-check' : 'mdi-cloud-upload') : 'mdi-pencil'" />
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
          <v-list-item @click="copy(simulation)">
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-content-copy</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              Duplicar
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="remove(simulation)">
            <v-list-item-icon class="mr-2">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              Apagar
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-title :class="simulation.certified === null || simulation.certified === undefined ? 'grey lighten-4' : (simulation.certified ? 'green lighten-5' : 'red lighten-5')">
      <span class="headline" style="overflow: hidden;">{{ simulation.name }}</span>
      <v-spacer />
      <v-icon v-if="simulation.certified !== null && simulation.certified !== undefined" :color="simulation.certified ? 'success' : 'error'" v-html="simulation.certified ? 'mdi-check-decagram' : 'mdi-alert-decagram'" />
    </v-card-title>
    <v-card-text class="mt-3" style="height: 100px;">
      Área de {{ simulation.area || 'N/A' }} ha com rebanho de {{ simulation.animal_category || 'N/A' }} da raça {{ simulation.animal_race || 'N/A' }}, em pastagem
      {{ simulation.pastagem_species || 'N/A' }} (desde {{ simulation.pastagem_anoDeFormacao || 'N/A' }}) e com
      {{ simulation.arvores_type || 'N/A' }} em arranjo de {{ simulation.arvores_numeroDeFileiras || 'N/A' }} fileira(s) no renque.
    </v-card-text>
    <v-card-actions>
      <v-row wrap class="pb-3" v-if="$vuetify.breakpoint.smAndDown">
        <v-col cols="12" class="py-1">
          <v-btn color="warning" class="white--text ma-0" style="min-width: 60px;" @click="report(simulation)" block large depressed :disabled="!simulation.validated">
            <v-icon dark class="mr-2">
              mdi-file-chart
            </v-icon> Diagnóstico
          </v-btn>
        </v-col>
        <v-col cols="12" class="py-1">
          <v-btn color="primary" class="white--text ma-0" style="min-width: 60px;" @click="edit(simulation)" block large depressed>
            <v-icon dark class="mr-2">
              mdi-pencil
            </v-icon> Editar
          </v-btn>
        </v-col>
      </v-row>
      <v-row wrap class="pb-3" v-else>
        <v-col cols="6" class="py-1 pr-1">
          <v-btn color="warning" class="white--text ma-0" style="min-width: 60px;" @click="report(simulation)" block large depressed :disabled="!simulation.validated">
            <v-icon dark class="mr-2">
              mdi-file-chart
            </v-icon> Diagnóstico
          </v-btn>
        </v-col>
        <v-col cols="6" class="py-1 pl-1">
          <v-btn color="primary" class="white--text ma-0" style="min-width: 60px;" @click="edit(simulation)" block large depressed>
            <v-icon dark class="mr-2">
              mdi-pencil
            </v-icon> Editar
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>

    <simulation-copy-wrapper v-on="$listeners" ref="copy" />

    <confirm-wrapper ref="confirm" />

    <message-wrapper ref="message" />
  </v-card>
</template>

<script>
import SimulationCopyWrapper from './SimulationCopy'
import ConfirmWrapper from './ConfirmDialog'
import MessageWrapper from './MessageSnack'

export default {
  components: {
    SimulationCopyWrapper,
    ConfirmWrapper,
    MessageWrapper
  },
  props: {
    simulation: {
      type: Object,
      require: true,
      default: () => {
        return {}
      }
    },
    width: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
  }),
  methods: {
    edit (s) {
      this.$router.push({
        path: '/simulation/' + s.code
      })
    },
    report (s) {
      if (s.validated) {
        this.$router.push({
          path: '/report/' + s.code
        })
      }
    },
    copy (simulation) {
      this.$refs.copy.open(simulation)
    },
    remove (simulation) {
      this.$refs.confirm
        .open(
          'Apagar Simulação',
          'Tem certeza de que deseja apagar a simulação "' + simulation.name + '"? Esta ação é irreversível!', { color: 'red' }
        )
        .then(confirm => {
          if (confirm) {
            simulation.active = false
            simulation.changed = new Date()

            this.$db.simulation
              .where('code')
              .equals(simulation.code)
              .modify(simulation)
              .then(() => {
                this.$emit('refresh')

                this.$emit('message', 'Simulação apagada com sucesso!')
              })
          }
        })
    }
  }
}
</script>
