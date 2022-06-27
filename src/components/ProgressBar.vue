<template>
  <v-dialog v-model="wait" persistent max-width="300px">
    <v-card class="pa-5">
      <v-card-text style="text-align: center;">
        <v-progress-circular :size="size" indeterminate :color="color" />
      </v-card-text>
      <v-card-title class="headline" block style="text-align: center;">
        {{ message }}
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    message: String,
    color: String,
    size: Number
  },
  data () {
    return {
      wait: false
    }
  },
  methods: {
    openProgress () {
      this.wait = true
    },
    closeProgress () {
      this.wait = false
    }
  }
}
</script>
