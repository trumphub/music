const phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
const passwordReg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{8,20}$/;
const nickNameReg = /^[\u4E00-\u9FA5A-Za-z0-9_-]{4,30}$/;

export function validatePhone(phone) {
    if (!phone || !phone.trim()) {
        return false
    }
    return phoneReg.test(phone)
}

export function validatePassword(password) {
    if (!password || !password.trim()) {
        return false
    }
    return passwordReg.test(password)
}

export function validateNickName(nickName) {
    if (!nickName || !nickName.trim()) {
        return false
    }
    return nickNameReg.test(nickName)
}

export function validateCode(code) {
    if (!code || !code.trim()) {
        return false
    }
    return /^\d{4}$/.test(code);
}