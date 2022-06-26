<template>
  <v-slide-group show-arrows>
    <v-slide-item v-for="s in simulations" :key="s.code">
      <simulation-card :simulation="s" width="400" v-on="$listeners" />
    </v-slide-item>
  </v-slide-group>
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
    simulations: []
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
    }
  }
}
</script>
