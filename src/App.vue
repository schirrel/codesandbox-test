<template>
  <v-app>
    <router-view />
    <update-wrapper />
  </v-app>
</template>

<script>
import UpdateWrapper from './components/UpdateAlert.vue'

export default {
  components: {
    UpdateWrapper
  },
  data () {
    return {}
  },
  localStorage: {
    email: {
      type: String,
      default: ''
    },
    user: {
      type: Object,
      default: {
        authenticated: false,
        name: '',
        email: '',
        picture: '',
        token: ''
      }
    },
    synchronized: {
      type: Number,
      default: 0
    },
    notShowTutorial: {
      type: Boolean,
      default: false
    },
    beta: {
      type: Boolean,
      default: false
    },
    reliable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
