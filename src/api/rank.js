import request from '../util/request'

export function reqRankList() {
    return request.get('/toplist')
}

export function reqPlaylist(id) {
    return request.get(`/playlist/detail`, { params: { id } })
}
