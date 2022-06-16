import React from 'react'
import { Layout, message } from 'antd'
import { Routes, Route, Navigate } from "react-router-dom"
import { getGitUserInfo } from '../../api/user'
import { setLocalUser } from '../../utils/authentication'
import Home from '../../pages/home'
import Blogs from '../../pages/blogs'
import About from '../../pages/about'
import Blog from '../../pages/blog'
import { GitUser } from '../../types/index'

export default class BlogBody extends React.Component<{}, { [key: string]: any }> {
    constructor(props: Object) {
        super(props)
        this.state = {
            /* handler the 'Bad credentials' error that be thrown from gitalk but not be caught */
            unhandledrejectionFunc: function (event: PromiseRejectionEvent | null) {
                const res = event?.reason?.response
                if (res?.status === 401) {
                    message.warning('Please login your github account first.')
                }
            }
        }
    }

    componentDidMount() {
        let failTolerantTime = 15
        let intervalId: NodeJS.Timeout
        if (process.env.NODE_ENV === 'production') {
            intervalId = setInterval(() => {
                failTolerantTime--
                getGitUserInfo().then((res: GitUser) => {
                    /* clear the interval only if the local storage 'getGitAccessToken' is not null */
                    if (res.id) {
                        setLocalUser(res)
                        clearInterval(intervalId)
                    }
                })
                if (failTolerantTime <= 0) {
                    clearInterval(intervalId)
                }
            }, 1000)
        }
        window.addEventListener('unhandledrejection', this.state.unhandledrejectionFunc)
    }
    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.state.unhandledrejectionFunc)
    }

    render() {
        return (
            <Layout style={{ margin: '2em 0em' }}>
                <Routes>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/blog/:blogId' element={<Blog />}></Route>
                    <Route path='/list' element={<Blogs />}></Route>
                    <Route path='/about' element={<About />}></Route>
                    <Route path='/*' element={<Navigate to='/home' />}></Route>
                </Routes>
            </Layout>
        )
    }
}
