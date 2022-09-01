import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import vuetify from './plugins/vuetify'
import storage from 'vue-localstorage'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'

import router from './router'
import db from './db'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

Vue.config.productionTip = false

console.log('mais-precoce / plugin-flow @ ' + process.env.VUE_APP_STAGE)
console.log('Version: ' + process.env.VUE_APP_VERSION)

if (process.env.VUE_APP_STAGE !== 'development') {
  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    release: process.env.VUE_APP_VERSION.split('-')[0],
    environment: process.env.VUE_APP_STAGE,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', window.location.hostname, /^\//]
      })
    ],
    tracesSampleRate: 1.0
  })
}

Vue.use(VueLodash, { name: 'custom', lodash: lodash })

Vue.use(VueSweetalert2)
Vue.use(storage)
Vue.use(storage, {
  name: 'ls',
  bind: true
})

Vue.prototype.$db = db

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) },
  data: {
    trySync: true
  }
}).$mount('#app')
