import request from '../utils/request'
import { UpdateBlogView } from '../types/index'
import conf from '../config/config'
import { getGitAccessToken } from '../utils/authentication'

const auth = {
    username: conf.gitProps.clientID,
    password: conf.gitProps.clientSecret,
}

const baseURL = 'https://api.github.com'
const blogViewIssueNumber = 6

export function getBlogView() {
    return request({
        url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + blogViewIssueNumber,
        method: 'get',
        auth: auth,
        headers: {
            accept: 'application/vnd.github.v3+json',
        }
    })
}

export function updateBlogView(data: UpdateBlogView) {
    if (getGitAccessToken()) {
        return request({
            url: baseURL + '/repos/' + conf.gitProps.owner + '/' + conf.gitProps.repo + '/issues/' + blogViewIssueNumber,
            method: 'post',
            auth: auth,
            data: {
                body: data.pvStr
            },
            headers: {
                accept: 'application/vnd.github.v3+json',
                Authorization: 'token ' + getGitAccessToken(),
            }
        })
    }
    return Promise.reject()
}