import request from '../util/request'

export function reqBannerList() {
    return request.get('/banner?type=1')
}
