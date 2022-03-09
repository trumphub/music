import request from '@/util/request'

/**
 * 获取音乐 url
 * @param {*} id 
 * @returns 
 */
export function reqSongUrl(id) {
    return request.get(
        '/song/url',
        {
            params: { id, realIP: '116.25.146.177' }
        }
    )
}

/**
 * 获取歌词
 * @param {*} id 
 * @returns 
 */
export function reqSongLyric(id) {
    return request.get(
        '/lyric',
        {
            params: { id, realIP: '116.25.146.177' }
        }
    )
}
