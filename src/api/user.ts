import request from '../utils/request'
import { getGitAccessToken } from '../utils/authentication'

const baseURL = 'https://api.github.com'

export function getGitUserInfo() {
    if (getGitAccessToken()) {
        return request({
            url: baseURL + '/user',
            method: 'get',
            headers: {
                Authorization: `token ${getGitAccessToken()}`
            }
        })
    }
    return Promise.resolve({})
}