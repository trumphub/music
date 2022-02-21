import axios from "axios"

const cancelList = []

axios.interceptors.request.use(config => {
    config.cancelToken = new axios.CancelToken(
        cancel => {
            cancelList.push(cancel)
        }
    )
    return config
}, error => Promise.reject(error))

axios.interceptors.response.use(response => {
    const res = response.data
    if (res.code !== 200) {
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        return res
    }
}, error => {
    if (axios.isCancel(error)) {
        console.log(error.message);
        return new Promise(() => { })
    } else {
        return Promise.reject(error)
    }
})

export { cancelList }

export default axios
