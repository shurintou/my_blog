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

export function getReactionsByGraphQl(data: BlogGetLikeData) {
    return request({
        url: baseURL + '/graphql',
        method: 'post',
        data: {
            operationName: "getReactions",
            query: `
                query getReactions {
                    repository(owner:${conf.gitProps.owner}, name:${conf.gitProps.repo}) {
                        issue(number:${data.issue_number}) {
                            reactions(last: ${data.per_page}, content: HEART) {
                                edges {
                                    node {
                                        databaseId
                                        content
                                        user {
                                            databaseId
                                            login
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `
        },
        headers: {
            Authorization: 'bearer ' + getGitAccessToken(),
        }
    })
}

export function postLike(data: BlogPostLikeData) {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + data.number + '/reactions',
        method: 'post',
        headers: {
            Authorization: 'token ' + getGitAccessToken(),
            Accept: 'application/vnd.github.v3+json'
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
            Accept: 'application/vnd.github.v3+json'
        }
    })
}