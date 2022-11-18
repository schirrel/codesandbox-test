import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  release: process.env.VUE_APP_VERSION.split('-')[0],
  environment: process.env.VUE_APP_STAGE,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', window.location.hostname, /^\//]
    })
  ],
  tracesSampleRate: 1.0
})

export const useSentry = (router) => {
  const props = {
    tracingOrigins: ['localhost', window.location.hostname, /^\//]
  }

  if (router) {
    props.routingInstrumentation = Sentry.vueRouterInstrumentation(router)
  }

  // Sentry.init({
  //   Vue,
  //   dsn: process.env.VUE_APP_SENTRY_DSN,
  //   release: process.env.VUE_APP_VERSION.split('-')[0],
  //   environment: process.env.VUE_APP_STAGE,
  //   integrations: [
  //     new BrowserTracing(props)
  //   ],
  //   tracesSampleRate: 1.0
  // })
}
