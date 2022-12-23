import request from '../utils/request'
import { PostPostLikeData, PostGetLikeData, DeletePostReactionData } from '../types/index'
import conf from '../config/authentication'
import { getGitAccessToken } from '../utils/authentication'

const baseURL = 'https://api.github.com'

export function getReactionsByGraphQl(data: PostGetLikeData) {
    if (getGitAccessToken()) {
        return request({
            url: baseURL + '/graphql',
            method: 'post',
            data: {
                operationName: "getReactions",
                query: `
                query getReactions {
                    repository(owner:"${conf.owner}", name:"${conf.repo}") {
                        issue(number:${data.issue_number}) {
                            reactions(last: ${data.per_page}, content: ${data.content.toUpperCase()}) {
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
    return Promise.reject()
}

export function postLike(data: PostPostLikeData) {
    return request({
        url: baseURL + '/repos/' + conf.owner + '/' + conf.repo + '/issues/' + data.number + '/reactions',
        method: 'post',
        headers: {
            Authorization: 'token ' + getGitAccessToken(),
            Accept: 'application/vnd.github.v3+json'
        },
        data: { content: data.content }
    })
}

export function deleteLike(data: DeletePostReactionData) {
    return request({
        url: baseURL + '/repos/' + conf.owner + '/' + conf.repo + '/issues/' + data.number + '/reactions/' + data.id,
        method: 'delete',
        headers: {
            Authorization: 'token ' + getGitAccessToken(),
            Accept: 'application/vnd.github.v3+json'
        }
    })
}