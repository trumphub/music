import Vue from 'vue'
import Vuex from 'vuex'

import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'

Vue.use(Vuex)

const state = {
    token: localStorage.getItem('user-token'), // 网易云音乐用户 id
    info: null
}
const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
    },
    SET_INFO(state, info) {
        state.info = info
    }
}
const actions = {
    async getUserInfo({ commit, state }) {
        try {
            const { profile: { nickname, avatarUrl, backgroundUrl } } = await reqUserInfo(state.token)
            commit('SET_INFO', { nickname, avatarUrl, backgroundUrl })
        } catch (error) {
            commit('SET_TOKEN', null)
            localStorage.removeItem('user-token')
            throw new Error(error)
        }
    },
    logout({ commit }) {
        return new Promise((resolve, reject) => {
            reqLogout().then(() => {
                commit('SET_TOKEN', null)
                commit('SET_INFO', null)
                localStorage.removeItem('user-token')
                resolve()
            }).catch(reject)
        })
    },
    async login({ commit }, { phone, password }) {
        try {
            const { account: { id } } = await reqLogin({ phone, password })
            commit('SET_TOKEN', id)
            localStorage.setItem('user-token', id)
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
})
