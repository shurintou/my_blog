import axios, { Canceler } from 'axios'
import { message } from 'antd'
import { isSameRequest } from './common'
import { PendingRequest } from '../types/index'

const CancelToken = axios.CancelToken
let cancel: Canceler


declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}

let pendingRequestList = new Array<PendingRequest>()

const request = axios.create({ //create an instance using interceptors
    baseURL: '',
    timeout: 15000, // ms, 0 is infinite
    headers: {}
})
request.interceptors.request.use(
    config => {
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c
        })
        let newRequest: PendingRequest = {
            url: config.url,
            method: config.method,
            data: config.data,
            params: config.params,
        }
        // if a same request already exists, cancel the new one.
        if (pendingRequestList.some(pendingRequest => isSameRequest(pendingRequest, newRequest))) {
            cancel("duplicated request!")
            return config
        }
        pendingRequestList.push(newRequest)
        return config
    },
    error => {
        if (error.message) {
            message.error(error.message)
        }
    }
)

request.interceptors.response.use(
    res => {
        let newResponse: PendingRequest = {
            url: res.config.url,
            method: res.config.method,
            data: res.config.data,
            params: res.config.params,
        }
        let sameRequestIndex = pendingRequestList.findIndex(pendingRequest => isSameRequest(pendingRequest, newResponse))
        if (sameRequestIndex !== -1) {
            //remove the exactly same request from the list
            pendingRequestList.splice(sameRequestIndex, 1)
        }
        return res.data
    },
    error => {
        message.error(error.message)
    }
)

export default request