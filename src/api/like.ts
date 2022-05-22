import request from '../utils/request'
import { BlogPostLikeData, BlogGetLikeData, DeleteBlogReactionData } from '../types/index'
import conf from '../config/config'
import { getGitAccessToken } from '../utils/authentication'

const baseURL = 'https://api.github.com'

export function getReactionsByGraphQl(data: BlogGetLikeData) {
    if (getGitAccessToken()) {
        return request({
            url: baseURL + '/graphql',
            method: 'post',
            data: {
                operationName: "getReactions",
                query: `
                query getReactions {
                    repository(owner:"${conf.gitProps.owner}", name:"${conf.gitProps.repo}") {
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