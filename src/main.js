import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import vuetify from './plugins/vuetify'

import router from './router'

Vue.config.productionTip = false

console.log('%GENESIS_PROJECT_UNIX% / %GENESIS_APP_UNIX% @ ' + process.env.VUE_APP_STAGE)
console.log('Version: ' + process.env.VUE_APP_VERSION)

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  release: '%GENESIS_PROJECT_UNIX%@' + process.env.VUE_APP_VERSION.split('-')[0],
  environment: process.env.VUE_APP_STAGE,
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['localhost', (new URL(process.env.VUE_APP_URL)).host, /^\//]
    })
  ],
  tracesSampleRate: 1.0
})

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
