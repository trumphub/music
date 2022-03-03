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

/**
 * 检测手机号码是否已注册
 * @param {*} phone 
 * @returns 
 */
export function checkPhoneExistence(phone) {
    return request.get(
        '/cellphone/existence/check',
        {
            params: {
                phone
            }
        }
    )
}

/**
 * 重复昵称检测
 * @param {*} nickname 
 * @returns 
 */
export function checkNickName(nickname) {
    return request.get(
        '/nickname/check',
        {
            params: {
                nickname
            }
        }
    )
}

/**
 * 发送验证码
 * @param {*} phone 
 * @returns 
 */
export function sendCode(phone) {
    return request.get(
        '/captcha/sent',
        {
            params: {
                phone
            }
        }
    )
}

/**
 * 验证验证码
 * @param {*} phone 
 * @param {*} captcha 
 * @returns 
 */
export function verifyCode(phone, captcha) {
    return request.get(
        '/captcha/verify',
        {
            params: {
                phone,
                captcha
            }
        }
    )
}

/**
 * 注册
 * @param {*} param0 
 * @returns 
 */
export function register({ phone, password, nickname, captcha }) {
    return request.get(
        '/register/cellphone',
        {
            params: {
                phone, password, nickname, captcha, t: Date.now()
            }
        }
    )
}