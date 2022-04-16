import request from '../utils/request'

export function getProfileInfo(params: Object) {
    return request({
        url: 'https://api.github.com/users/shurintou',
        method: 'get',
        params: params
    })
}