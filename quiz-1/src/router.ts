import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
import { getCurrentUser } from './initFirebase'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'homePage',
    component: HomePage,
    beforeEnter: async (_to, _from, next) => {
      const user = await getCurrentUser()
      if (!user) return next('/login')
      return next()
    },
  },
  {
    path: '/login',
    name: 'loginPage',
    component: LoginPage,
    beforeEnter: async (_to, _from, next) => {
      const user = await getCurrentUser()
      if (user) return next('/')
      return next()
    },
  },
  {
    path: '/register',
    name: 'registerPage',
    component: RegisterPage,
    beforeEnter: async (_to, _from, next) => {
      const user = await getCurrentUser()
      if (user) return next('/')
      return next()
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
