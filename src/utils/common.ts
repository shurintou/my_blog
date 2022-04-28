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

export const isSameObjectSimple = function (obj1: Object, obj2: Object) {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
}
