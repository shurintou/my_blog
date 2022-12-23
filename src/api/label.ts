import request from '../utils/request'
import conf from '../config/authentication'

const auth = {
    username: conf.clientID,
    password: conf.clientSecret,
}

const baseURL = 'https://api.github.com'

const params = {
    per_page: 100,
    page: 1,
}


export function getAllLabels() {
    return request({
        url: baseURL + '/repos/' + conf.owner + '/' + conf.repo + '/labels',
        method: 'get',
        auth: auth,
        params: params
    })
}