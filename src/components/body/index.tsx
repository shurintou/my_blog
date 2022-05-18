import React from 'react'
import { Layout, message } from 'antd'
import { Routes, Route, Navigate } from "react-router-dom"
import { getGitUserInfo } from '../../api/user'
import { setLocalUser } from '../../utils/authentication'
import Home from '../../pages/home'
import Blogs from '../../pages/blogs'
import About from '../../pages/about'
import Blog from '../../pages/blog'

export default class BlogBody extends React.Component<{}, { [key: string]: any }> {
    constructor(props: Object) {
        super(props)
        this.state = {
            /* handler the 'Bad credentials' error that be thrown from gitalk but not be caught */
            unhandledrejectionFunc: function (event: PromiseRejectionEvent | null) {
                const res = event?.reason.response
                if (res?.status === 401) {
                    message.warning('Please login your github account first.')
                }
            }
        }
    }

    componentDidMount() {
        getGitUserInfo()
            .then(res => {
                setLocalUser(res.data)
            })
        window.addEventListener('unhandledrejection', this.state.unhandledrejectionFunc)
    }
    componentWillUnmount() {
        window.removeEventListener('unhandledrejection', this.state.unhandledrejectionFunc)
    }

    render() {
        return (
            <Layout style={{ margin: '2em 1em' }}>
                <Routes>
                    <Route path='/home' element={<Home />}></Route>
                    <Route path='/blog/:blogId' element={<Blog />}></Route>
                    <Route path='/blogs' element={<Blogs />}></Route>
                    <Route path='/about' element={<About />}></Route>
                    <Route path='/*' element={<Navigate to='/home' />}></Route>
                </Routes>
            </Layout>
        )
    }
}
