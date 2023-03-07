import request from '../utils/request'
import { PostInfoRequestParam, PostSearchRequestParam } from '../types/index'
import conf from '../config/authentication'

const auth = {
    username: conf.clientID,
    password: conf.clientSecret,
}

const baseURL = 'https://api.github.com'

export function getPostInfo(params: PostInfoRequestParam) {
    return request({
        url: baseURL + '/repos/' + conf.owner + '/' + conf.repo + '/issues/' + params.number,
        method: 'get',
        auth: auth
    })
}

export function searchPosts(params: PostSearchRequestParam) {
    const baseSearchQuery: { [key: string]: any } = {
        author: 'shurintou',
        repo: 'shurintou/shurintou.github.io',
        is: 'open',
    }
    if (process.env.NODE_ENV === 'development') { delete baseSearchQuery.is } // get all posts at development mode.
    let comBinequery: string = ''
    Object.getOwnPropertyNames(baseSearchQuery).forEach((key: string) => {
        comBinequery += key + ':' + baseSearchQuery[key] + '+'
    })
    comBinequery += params.query

    return request({
        url: baseURL + '/search/issues?q=' + comBinequery,
        method: 'get',
        headers: {
            accept: params.textMatch ? 'application/vnd.github.text-match+json' : 'application/vnd.github.v3+json',
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