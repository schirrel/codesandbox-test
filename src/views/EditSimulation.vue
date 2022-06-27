<template>
  <v-app light>
    <nav>
      <v-app-bar color="green lighten-1" dark clipped-left fixed>
        <v-btn icon @click.native="cancel()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title class="ml-2">
          {{ simulation.name }} ({{ simulation.area }} ha)
        </v-toolbar-title>

        <v-spacer />

        <v-btn
          @click="adjust()"
          class="mr-3 hidden-sm-and-down"
          color="warning"
        >
          <v-icon class="mr-1">
            mdi-tune
          </v-icon>
          Ajustes
        </v-btn>
        <v-btn icon class="hidden-md-and-up" @click.native="adjust()">
          <v-icon>mdi-tune</v-icon>
        </v-btn>

        <v-btn
          color="primary"
          class="hidden-sm-and-down"
          @click.native="save()"
        >
          <v-icon left>
            mdi-content-save
          </v-icon>Salvar
        </v-btn>
        <v-btn icon class="hidden-md-and-up" @click.native="save()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </v-app-bar>
    </nav>

    <v-main class="mt-10 pt-6">
      <confirm-wrapper ref="confirm" />
      <message-wrapper ref="message" />
    </v-main>

    <simulation-edit-wrapper @message="message" ref="adjust" />
  </v-app>
</template>

<script>
import SimulationEditWrapper from '@/components/SimulationEdit'
import ConfirmWrapper from '@/components/ConfirmDialog'
import MessageWrapper from '@/components/MessageSnack'

export default {
  components: {
    SimulationEditWrapper,
    ConfirmWrapper,
    MessageWrapper
  },
  data: () => ({
    simulation: {}
  }),
  beforeCreate () {
    this.$db.simulation.get(this.$route.params.code, (s) => {
      this.simulation = s
    })
  },
  methods: {
    save () {
    },
    async cancel () {
      this.$router.push({ path: '/' })
    },
    message (text, type, time) {
      this.$refs.message.open(text, type, time)
    },
    adjust () {
      this.$refs.adjust.open(this.simulation)
    }
  }
}
</script>
