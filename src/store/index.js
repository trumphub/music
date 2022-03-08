import Vue from 'vue'
import Vuex from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import { reqSongUrl, reqSongLyric } from '@/api/song'

Vue.use(Vuex)

const state = {
    token: localStorage.getItem('user-token'), // 网易云音乐用户 id
    info: null,
    playList: []
}

const getters = {
    currentPlayingSong(state) {
        return state.playList.find(item => (item.status === 'playing') || (item.status === 'paused'))
    }
}

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
    },
    SET_INFO(state, info) {
        state.info = info
    },
    SET_PLAYLIST(state, newList) {
        state.playList = newList
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
    },
    async getSongDetail(ctx, id) {
        const { data: [{ url }] } = await reqSongUrl(id)
        const { lrc: { lyric } } = await reqSongLyric(id)
        return { url, lyric }
    },
    async addToPlayList({ commit, state, getters, dispatch }, { list, song }) {
        // 将列表放入播放队列
        const filterList = list.filter(item => {
            if (state.playList.length > 0) {
                return state.playList.every(({ id }) => id !== item.id)
            } else {
                return true
            }
        })
        const newList = [...cloneDeep(state.playList), ...filterList]
        // 当前是否有歌曲正在播放
        if (getters.currentPlayingSong) {
            // 将要播放的是否为同一首
            if (getters.currentPlayingSong.id === song.id) {
                commit('SET_PLAYLIST', newList)
            } else {
                // 修改播放状态
                let currentSong
                newList.forEach(item => {
                    if (item.id === getters.currentPlayingSong.id) {
                        item.status = 'stoped'
                    } else if (item.id === song.id) {
                        item.status = 'playing'
                        currentSong = item
                    }
                })
                if (!currentSong.url) {
                    dispatch('getSongDetail', song.id).then(({ url, lyric }) => {
                        currentSong.url = url
                        currentSong.lyric = lyric
                        commit('SET_PLAYLIST', newList)
                    })
                } else {
                    commit('SET_PLAYLIST', newList)
                }
            }
        } else {
            // 修改播放状态 
            newList.forEach(item => {
                if (item.id === song.id) {
                    item.status = 'playing'
                    dispatch('getSongDetail', song.id).then(({ url, lyric }) => {
                        item.url = url
                        item.lyric = lyric
                        commit('SET_PLAYLIST', newList)
                    })
                }
            })
        }
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
