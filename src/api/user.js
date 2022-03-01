import request from '@/util/request'

export function reqLogin({ phone, password }) {
    return request.get(`/login/cellphone`, {
        params: {
            phone,
            password
        }
    })
}

export function reqUserInfo(uid) {
    return request.get('/user/detail', {
        params: { uid }
    })
}

export function reqLogout() {
    return request.get('/logout')
}

export function reqUserPlayList(uid) {
    return request({
        url: '/user/playlist',
        method: 'GET',
        params: {
            uid
        }
    })
}
