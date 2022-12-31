<template>
  <v-app light>
    <nav>
      <v-app-bar clipped-left dark color="green lighten-1">
        <v-app-bar-title v-text="$route.name" />
      </v-app-bar>
    </nav>

    <v-main>
      <FlowTree :simulation="simulation"/>
    </v-main>
  </v-app>
</template>

<script>
// import simulation from '@/jsons/novoJson.json'
import simulation from '@/jsons/json_teste_20221222.source.json'

import FlowTree from '@/components/shared/FlowTree'

export default {
  components: { FlowTree },
  data: () => ({ simulation })
}
</script>
