import axios from 'axios'
import { message } from 'antd';

declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}


const request = axios.create({ //create an instance using interceptors
    baseURL: '',
    timeout: 15000, // ms, 0 is infinite
    headers: {}
})

request.interceptors.request.use(
    config => {
        return config
    },
    error => {
        message.error(error.message)
        Promise.reject(error)
    }
)

request.interceptors.response.use(
    res => {
        return res.data
    },
    error => {
        message.error(error.message)
        Promise.reject(error)
    }
)

export default request