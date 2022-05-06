import { Component } from 'react'
import { Layout } from 'antd'
import { Routes, Route, Navigate } from "react-router-dom"
import Home from '../../pages/home'
import Blogs from '../../pages/blogs'
import About from '../../pages/about'
import Blog from '../../pages/blog'

export default class BlogBody extends Component {
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
