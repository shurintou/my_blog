import request from '../utils/request'
import { GetRepoInfoParam, BlogRequestParam, BlogInfoRequestParam, BlogPostLikeData, BlogGetLikeData, DeleteBlogReactionData } from '../types/index'
import conf from '../config/config'
import { getGitAccessToken } from '../utils/authentication'

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

export function getReactions(params: BlogGetLikeData) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + params.issue_number + '/reactions',
        method: 'get',
        auth: auth
    })
}

export function postLike(data: BlogPostLikeData) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + data.number + '/reactions',
        method: 'post',
        headers: {
            Authorization: 'token ' + getGitAccessToken(),
            Accept: 'application/vnd.github.squirrel-girl-preview'
        },
        data: { content: data.content }
    })
}

export function deleteLike(data: DeleteBlogReactionData) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + data.number + '/reactions/' + data.id,
        method: 'delete',
        headers: {
            Authorization: 'token ' + getGitAccessToken(),
            Accept: 'application/vnd.github.squirrel-girl-preview'
        }
    })
}