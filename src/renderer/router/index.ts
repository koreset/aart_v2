import { ErrorScreen } from '@/renderer/screens'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from '../App.vue'
import AppLogin from '../AppLogin.vue'
import AppSetup from '../AppSetup.vue'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/app',
      name: 'App',
      component: App
    },
    {
      path: '/login',
      name: 'AppLogin',
      component: AppLogin
    },
    {
      path: '/setup',
      name: 'setup',
      component: AppSetup
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../screens/Dashboard.vue'),
      meta: {
        titleKey: 'title.dashboard'
      }
    },
    {
      path: '/product-setup',
      name: 'product-setup',
      component: () => import('../screens/ProductConfiguration.vue'),
      meta: {
        titleKey: 'title.productSetup'
      }
    },
    {
      path: '/global-tables',
      name: 'global-tables',
      component: () => import('../screens/GlobalTables.vue'),
      meta: {
        titleKey: 'title.globalTables'
      }
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('../screens/ProductDetail.vue')
    },

    {
      path: '/product-comparison',
      name: 'product-comparison',
      component: () => import('../screens/ProductComparison.vue'),
      meta: {
        titleKey: 'title.globalTables'
      }
    },

    {
      path: '/error',
      component: ErrorScreen,
      meta: {
        titleKey: 'title.error'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})
