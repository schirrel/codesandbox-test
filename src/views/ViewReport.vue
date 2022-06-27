<template>
  <v-app light>
    <nav>
      <v-app-bar clipped-left color="green lighten-1" dark fixed>
        <v-btn icon @click.native="back()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title v-text="$route.name" />
      </v-app-bar>
    </nav>
  </v-app>
</template>

<script>
export default {
  data: () => ({
  }),
  methods: {
    back () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
