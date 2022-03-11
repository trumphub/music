import request from '@/util/request'

export function reqSearch(keywords, pageNow) {
    return request.get('/cloudsearch', {
        params: {
            keywords,
            offset: (pageNow - 1) * 30,
        }
    })
}
