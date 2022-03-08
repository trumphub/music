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
            params: { id }
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
            params: { id }
        }
    )
}
