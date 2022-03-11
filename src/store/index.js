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
        return state.playList.find(item => (item.status === 'playing') || (item.status === 'paused')) || {}
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
    async getSongDetail({ state, commit }, id) {
        const { data: [{ url }] } = await reqSongUrl(id)
        const { lrc: { lyric } } = await reqSongLyric(id)
        const newList = [...state.playList]
        newList.forEach(item => {
            if (item.id === id) {
                item.url = url
                item.lyric = lyric
            }
        })
        commit('SET_PLAYLIST', newList)
        return url
    },
    async addToPlayList({ commit, state, getters }, { list, song }) {
        // 将列表放入播放队列
        const filterList = cloneDeep(list).filter(item => {
            if (state.playList.length > 0) {
                return state.playList.every(({ id }) => id !== item.id)
            } else {
                return true
            }
        })
        const newList = [...state.playList, ...filterList]
        // 当前是否有歌曲正在播放
        if (getters.currentPlayingSong.status) {
            // 将要播放的是否为同一首
            if (getters.currentPlayingSong.id === song.id) {
                commit('SET_PLAYLIST', newList)
            } else {
                // 修改播放状态
                let prevId = getters.currentPlayingSong.id
                newList.forEach(item => {
                    if (item.id === prevId) {
                        item.status = 'stoped'
                    }
                    if (item.id === song.id) {
                        item.status = 'playing'
                    }
                })
                commit('SET_PLAYLIST', newList)
            }
        } else {
            // 修改播放状态 
            newList.forEach(item => {
                if (item.id === song.id) {
                    item.status = 'playing'
                }
            })
            commit('SET_PLAYLIST', newList)
        }
    },
    updateSongStatus({ state, commit }) {
        let status
        const newList = [...state.playList]
        newList.forEach(song => {
            if (song.status === 'playing') {
                song.status = 'paused'
                status = 'paused'
            } else if (song.status === 'paused') {
                song.status = 'playing'
                status = 'playing'
            }
        })
        commit('SET_PLAYLIST', newList)
        return status
    },
    nextSong({ state, commit, dispatch }, flag) {
        dispatch('pausedCurrentSong')
        const newList = [...state.playList]
        // 上一首
        const idx = newList.findIndex(song => song.status === 'paused')
        // 当前
        let index
        if (flag === 'next') {
            index = idx + 1
            if (index >= newList.length) {
                index = 0
            }
        }
        if (flag === 'prev') {
            index = idx - 1
            if (index < 0) {
                index = newList.length - 1
            }
        }
        newList.forEach((song, i) => {
            if (i === idx) {
                song.status = 'stoped'
            } else if (i === index) {
                song.status = 'playing'
            }
        })
        commit('SET_PLAYLIST', newList)
    },
    pausedCurrentSong({ state, commit }) {
        const newList = [...state.playList]
        newList.forEach((song) => {
            if (song.status === 'playing') {
                song.status = 'paused'
                commit('SET_PLAYLIST', newList)
            }
        })
    },
    playcurrentSong({ state, commit, getters }, nextSong) {
        const newList = [...state.playList]
        const nextSongId = nextSong.id
        const prevSongId = getters.currentPlayingSong.id
        newList.forEach(item => {
            if (item.id === nextSongId) {
                item.status = 'playing'
            } else if (item.id === prevSongId) {
                item.status = "stoped"
            }
        })
        commit('SET_PLAYLIST', newList)
    },
    delSong({ state, commit, getters }, song) {
        let newList = [...state.playList]
        if (getters.currentPlayingSong.id === song.id) {
            let idx = newList.findIndex((item) => item.id === song.id)
            let nextIdx = idx + 1
            if (nextIdx === newList.length) {
                nextIdx -= 2
            }
            newList.forEach((item, index) => {
                if (index === nextIdx) {
                    item.status = 'playing'
                }
            })
            newList.splice(idx, 1)
            commit('SET_PLAYLIST', newList)
        } else {
            commit('SET_PLAYLIST', newList.filter(item => item.id !== song.id))
        }
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})
