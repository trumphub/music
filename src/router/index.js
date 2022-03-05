import Vue from 'vue'
import VueRouter from 'vue-router'

import { cancelList } from '../util/request'
import Layout from '../layout'
import store from '@/store'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function (location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject)
    }
    return originalPush.call(this, location).catch((err) => {
        if (VueRouter.isNavigationFailure(err)) {
            return err
        }
        return Promise.reject(err)
    })
}

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function (location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalReplace.call(this, location, onResolve, onReject)
    }
    return originalReplace.call(this, location).catch((err) => {
        if (VueRouter.isNavigationFailure(err)) {
            return err
        }
        return Promise.reject(err)
    })
}

const routes = [
    {
        path: '/',
        component: Layout,
        redirect: '/home',
        children: [
            {
                path: 'home',
                component: () => import('../views/home'),
                children: [
                    {
                        path: '/personalized/:id',
                        name: "Personalized",
                        component: () => import('@/views/personalized'),
                        props: true
                    }
                ]
            },
            {
                path: 'rank',
                component: () => import('../views/rank'),
                children: [
                    {
                        path: ':id',
                        name: "RankList",
                        component: () => import('@/views/rank-list'),
                        props: true
                    }
                ]
            },
            {
                path: 'singer',
                component: () => import('../views/singer'),
                children: [
                    {
                        path: ':id',
                        name: 'SingerDetail',
                        component: () => import('@/views/singer-detail'),
                        props: true
                    }
                ]
            },
            {
                path: 'play-list/:id',
                name: 'PlayList',
                component: () => import('@/views/play-list'),
                props: true
            }
        ]
    },
    {
        path: "/login",
        component: () => import('../views/login')
    },
    {
        path: '*',
        redirect: '/'
    }
]

const router = new VueRouter({
    routes,
    mode: 'history'
})

router.beforeEach(function (to, from, next) {
    while (cancelList.length > 0) {
        cancelList.shift()('取消未完成的请求')
    }
    const token = store.state.token
    if (token) {
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if (store.state.info) {
                next()
            } else {
                store.dispatch('getUserInfo').then(() => {
                    next()
                }).catch(() => {
                    next({ path: '/login', query: { redirect: to.fullPath } })
                })
            }
        }
    } else {
        if (to.meta.isAuth) {
            next({ path: '/login', query: { redirect: to.fullPath } })
        } else {
            next()
        }
    }
    next()
})

export default router
