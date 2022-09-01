<template>
  <v-app light>
    <nav>
      <v-app-bar clipped-left dark color="green lighten-1">
        <v-app-bar-title v-text="$route.name" />
      </v-app-bar>
    </nav>

    <FlowTree />
  </v-app>
</template>

<script>
import FlowTree from '../components/FlowTree'

export default {
  components: { FlowTree }
}
</script>
