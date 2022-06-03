import { PendingRequest } from '../types/index'

export const isSameRequest = function (req1: PendingRequest, req2: PendingRequest) {
    if (req1.url !== req2.url) {
        return false
    }
    if (req1.method !== req2.method) {
        return false
    }
    if (req1.params && req2.params) {
        return isSameObjectSimple(req1.params, req2.params)
    }
    if (req1.data && req2.data) {
        return isSameObjectSimple(req1.data, req2.data)
    }
    return false
}

export const isSameObjectSimple = function (req1: any, req2: any) {
    let str1
    let str2
    if (typeof req1 === 'object') {
        str1 = JSON.stringify(req1)
    }
    else {
        str1 = req1
    }
    if (typeof req2 === 'object') {
        str2 = JSON.stringify(req2)
    }
    else {
        str2 = req2
    }
    return str1 === str2
}

export function lightOrDark(bg2Color: string) {
    return (parseInt(bg2Color.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff'
}