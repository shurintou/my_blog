import { GitUser } from '../types/index'

let localUser: GitUser = { id: 0, login: '' }

export function getGitAccessToken() { // this func use the same token stored by gitalk in localstorage
    return window.localStorage.getItem('GT_ACCESS_TOKEN')
}

export function setLocalUser(newUser: GitUser) {
    if (newUser) {
        localUser.id = newUser.id
        localUser.login = newUser.login
    }
}

export function getLocalUser() {
    return localUser
}