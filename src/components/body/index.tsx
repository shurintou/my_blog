import React, { Suspense, lazy } from 'react'
import { Layout, message, Skeleton } from 'antd'
import { Routes, Route, Navigate } from "react-router-dom"
import { getGitUserInfo } from '../../api/user'
import { setLocalUser } from '../../utils/authentication'
import { GitUser } from '../../types/index'
import { ROUTER_NAME } from '../../config/constant'
const Home = lazy(() => import(/* webpackChunkName: 'Home'*/ '../../pages/home'))
const List = lazy(() => import(/* webpackChunkName: 'List'*/ '../../pages/blogs'))
const About = lazy(() => import(/* webpackChunkName: 'About'*/ '../../pages/about'))
const Blog = lazy(() => import(/* webpackChunkName: 'Blog'*/ '../../pages/blog'))

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
                <Suspense fallback={<Skeleton active />}>
                    <Routes>
                        <Route path={ROUTER_NAME.home} element={<Home />}></Route>
                        <Route path={ROUTER_NAME.post} element={<Blog />}></Route>
                        <Route path={ROUTER_NAME.list} element={<List />}></Route>
                        <Route path={ROUTER_NAME.about} element={<About />}></Route>
                        <Route path='/*' element={<Navigate to={ROUTER_NAME.home} />}></Route>
                    </Routes>
                </Suspense>
            </Layout>
        )
    }
}
