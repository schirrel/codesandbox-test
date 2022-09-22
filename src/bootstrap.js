import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import vuetify from './plugins/shared/vuetify'
import storage from 'vue-localstorage'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

import router from './router'
import '@/plugins/sentry'
Vue.config.productionTip = false

console.log('mais-precoce / plugin-flow @ ' + process.env.VUE_APP_STAGE)
console.log('Version: ' + process.env.VUE_APP_VERSION)

Vue.use(VueLodash, { name: 'custom', lodash: lodash })

Vue.use(storage)
Vue.use(storage, {
  name: 'ls',
  bind: true
})

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) },
  data: {
    trySync: true
  }
}).$mount('#app')
