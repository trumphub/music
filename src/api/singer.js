import request from '@/util/request'

export function reqSingers() {
    return request.get('/top/artists?limit=100')
}
