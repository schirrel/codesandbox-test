import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMatomo from 'vue-matomo'

Vue.use(VueRouter)

const options = [
  { path: '/', component: 'ListFarms', name: 'Propriedades', props: false },
  { path: '/login', component: 'UserLogin', name: 'Login', props: false },
  { path: '/settings', component: 'AdjustSettings', name: 'Configurações', props: false },
  { path: '/about', component: 'AboutProject', name: 'Sobre', props: false },
  { path: '/simulation/:code', component: 'EditSimulation', name: 'Formulário Simulação', props: true },
  { path: '/report/:code', component: 'ViewReport', name: 'Diagnóstico', props: true },
  { path: '*', component: 'NotFound', name: 'Página Não Encontrada', props: false }
]

const routes = options.map(route => {
  return {
    path: route.path,
    component: () => import(`@/views/${route.component}.vue`),
    name: route.name,
    props: route.props
  }
})

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  routes
})

Vue.use(VueMatomo, {
  host: 'https://hit.embrapa.io',
  siteId: process.env.VUE_APP_MATOMO_ID,
  router: router,
  preInitActions: [
    ['setCustomDimension', 1, process.env.VUE_APP_STAGE],
    ['setCustomDimension', 2, process.env.VUE_APP_VERSION]
  ]
})

export default router
