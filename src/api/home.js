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
