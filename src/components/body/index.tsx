import React, { Suspense, lazy, useEffect } from 'react'
import { Layout, message, Skeleton } from 'antd'
import { Routes, Route, Navigate } from "react-router-dom"
import { getGitUserInfo } from '../../api/user'
import { setLocalUser } from '../../utils/authentication'
import { GitUser } from '../../types/index'
import { ROUTER_NAME } from '../../config/constant'
import { useAppSelector, } from '../../redux/hooks'
import { ZH_LANGUAGE, JA_LANGUAGE, EN_LANGUAGE, } from '../../config/constant'
const Home = lazy(() => import(/* webpackChunkName: 'Home'*/ '../../pages' + ROUTER_NAME.home))
const List = lazy(() => import(/* webpackChunkName: 'List'*/ '../../pages' + ROUTER_NAME.list))
const About = lazy(() => import(/* webpackChunkName: 'About'*/ '../../pages' + ROUTER_NAME.about))
const Post = lazy(() => import(/* webpackChunkName: 'Post'*/ '../../pages' + ROUTER_NAME.post))

const BlogBody: React.FC<{}> = () => {
    const selectedLanguage = useAppSelector((state) => state.language.value)

    const unhandledrejectionFunc = function (event: PromiseRejectionEvent | null) {
        const res = event?.reason?.response
        if (res?.status === 401) {
            switch (selectedLanguage) {
                case ZH_LANGUAGE.key:
                    message.warning(ZH_LANGUAGE.loginMessage)
                    break
                case JA_LANGUAGE.key:
                    message.warning(JA_LANGUAGE.loginMessage)
                    break
                default:
                    message.warning(EN_LANGUAGE.loginMessage)
            }
        }
    }

    useEffect(() => {
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
        window.addEventListener('unhandledrejection', unhandledrejectionFunc)

        return () => {
            window.removeEventListener('unhandledrejection', unhandledrejectionFunc)
        }
        /* eslint-disable-next-line */
    }, [])

    return (
        <Layout style={{ margin: '2em 0em' }}>
            <Suspense fallback={<Skeleton active />}>
                <Routes>
                    <Route path={ROUTER_NAME.home} element={<Home />}></Route>
                    <Route path={ROUTER_NAME.post} element={<Post />}></Route>
                    <Route path={ROUTER_NAME.list} element={<List />}></Route>
                    <Route path={ROUTER_NAME.about} element={<About />}></Route>
                    <Route path='/*' element={<Navigate to={ROUTER_NAME.home} />}></Route>
                </Routes>
            </Suspense>
        </Layout>
    )
}

export default BlogBody