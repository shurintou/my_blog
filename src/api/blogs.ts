import request from '../utils/request'
import { BlogInfoRequestParam, BlogSearchRequestParam } from '../types/index'
import conf from '../config/config'

const auth = {
    username: conf.gitProps.clientID,
    password: conf.gitProps.clientSecret,
}

const baseURL = 'https://api.github.com'

export function getBlogInfo(params: BlogInfoRequestParam) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + params.number,
        method: 'get',
        auth: auth
    })
}

export function searchBlogs(params: BlogSearchRequestParam) {
    const baseSearchQuery: { [key: string]: any } = {
        author: 'shurintou',
        repo: 'shurintou/shurintou.github.io',
        is: 'open',
    }
    let comBinequery: string = ''
    Object.getOwnPropertyNames(baseSearchQuery).forEach((key: string) => {
        comBinequery += key + ':' + baseSearchQuery[key] + '+'
    })
    comBinequery += params.query

    return request({
        url: baseURL + '/search/issues?q=' + comBinequery,
        method: 'get',
        headers: {
            accept: 'application/vnd.github.v3+json',
        },
        auth: auth,
        params: {
            page: params.page,
            per_page: params.per_page,
            order: params.order,
            sort: params.sort,
        }
    })
}