import request from '../utils/request'
import { BlogRequestParam, BlogInfoRequestParam, } from '../types/index'
import conf from '../config/config'

const auth = {
    username: conf.gitProps.clientID,
    password: conf.gitProps.clientSecret,
}

const baseURL = 'https://api.github.com'

export function getRepoInfo() {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo,
        method: 'get',
        auth: auth
    })
}

export function getBlogsList(params: BlogRequestParam) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues',
        method: 'get',
        params: params,
        auth: auth
    })
}

export function getBlogInfo(params: BlogInfoRequestParam) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + params.number,
        method: 'get',
        auth: auth
    })
}