import request from '../utils/request'
import conf from '../config/config'

const auth = {
    username: conf.gitProps.clientID,
    password: conf.gitProps.clientSecret,
}

const baseURL = 'https://api.github.com'

const params = {
    per_page: 100,
    page: 1,
}


export function getAllLabels() {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/labels',
        method: 'get',
        auth: auth,
        params: params
    })
}