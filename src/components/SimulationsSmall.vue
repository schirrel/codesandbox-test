<template>
  <v-card flat tile color="blue-grey lighten-5">
    <v-window v-model="onboarding" style="height: 380px;">
      <v-window-item v-for="s in simulations" :key="s.code">
        <simulation-card :simulation="s" v-on="$listeners" />
      </v-window-item>
    </v-window>

    <v-card-actions class="justify-space-between">
      <v-btn
        text
        @click="prev"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-item-group
        v-model="onboarding"
        class="text-center"
        mandatory
      >
        <v-item
          v-for="n in simulations.length"
          :key="`btn-${n}`"
          v-slot="{ active, toggle }"
        >
          <v-btn
            :input-value="active"
            icon
            @click="toggle"
          >
            <v-icon>mdi-record</v-icon>
          </v-btn>
        </v-item>
      </v-item-group>
      <v-btn
        text
        @click="next"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SimulationCard from './SimulationCard.vue'

export default {
  props: {
    farm: {
      type: String,
      require: true,
      default: ''
    }
  },
  components: {
    SimulationCard
  },
  data: () => ({
    simulations: [],
    onboarding: 0
  }),
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.$db.simulation
        .where('farm')
        .equals(this.farm)
        .and(s => s.active)
        .reverse()
        .sortBy('changed')
        .then(simulations => {
          this.simulations = simulations
        })
    },
    next () {
      this.onboarding = this.onboarding + 1 === this.simulations.length ? 0 : this.onboarding + 1
    },
    prev () {
      this.onboarding = this.onboarding - 1 < 0 ? this.length - 1 : this.onboarding - 1
    }
  }
}
</script>
