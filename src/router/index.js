import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const options = [
  { path: '/', component: 'FlowTree', name: 'Fluxograma', props: false },
  { path: '/about', component: 'AboutProject', name: 'Sobre', props: false },
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

export default router
