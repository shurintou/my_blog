import axios, { Canceler } from 'axios'
import { isSameRequest } from './common'
import { message } from 'antd'
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
        console.error(error)
    }
)

request.interceptors.response.use(
    res => {
        removeResponsedRequestHandler(res)
        return res.data
    },
    error => {
        const res = error.response
        if (res) {
            removeResponsedRequestHandler(res)
            const status = res.status
            if (process.env.NODE_ENV === 'production') {
                if (status === 401 && res.config.method !== 'get' && res.config.url.indexOf('graphql') === -1) {
                    message.warning('Please login your github account first.')
                }
            }
        }
        console.error(error)
    }
)

const removeResponsedRequestHandler = function (res: any) {
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
}

export default request