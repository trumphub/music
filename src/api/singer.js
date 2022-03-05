import request from '@/util/request'

export function reqSingers() {
    return request.get('/top/artists?limit=100')
}

export function reqSingerDetail(id) {
    return request.get(
        '/artists',
        {
            params: { id }
        }
    )
}