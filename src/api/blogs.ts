import request from '../utils/request'
import { GetRepoInfoParam } from '../types/index'
import conf from '../config/config'

const auth = {
    username: conf.gitProps.clientID,
    password: conf.gitProps.clientSecret,
}

const baseURL = 'https://api.github.com'

export function getRepoInfo(params: GetRepoInfoParam) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo,
        method: 'get',
        params: params,
        auth: auth
    })
}