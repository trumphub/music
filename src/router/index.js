import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '../layout'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                component: () => import('../views/home')
            }
        ]
    },
    {
        path: '/rank',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('../views/rank')
            }
        ]
    },
    {
        path: '/singer',
        component: Layout,
        children: [
            {
                path: '',
                component: () => import('../views/singer')
            }
        ]
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router
