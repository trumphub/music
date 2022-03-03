import request from '../util/request'

export function reqBannerList() {
    return request.get('/banner?type=1')
}

export function reqIconList() {
    return request.get('/homepage/dragon/ball')
}

export function reqPersonalized() {
    return request.get('/personalized')
}

/**
 * 获取歌单详情
 * @param {*} id 
 * @returns 
 */
export function reqPlaylistDetail(id) {
    return request.get('/playlist/detail', {
        params: { id }
    })
}

/**
 * 获取歌单所有歌曲
 */
export function reqPlaylist(id) {
    return request.get('/playlist/track/all', {
        params: { id }
    })
}
