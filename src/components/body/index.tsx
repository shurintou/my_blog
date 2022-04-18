import { Component } from 'react'
import { Layout } from 'antd';
import { Routes, Route, Navigate } from "react-router-dom"
import Home from '../../pages/home';
import Blogs from '../../pages/blogs'
import About from '../../pages/about'

export default class BlogBody extends Component {
    render() {
        return (
            <Layout style={{ margin: '2em 1em' }}>
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/blogs' element={<Blogs />}></Route>
                    <Route path='/about' element={<About />}></Route>
                    <Route path='/*' element={<Navigate to='/' />}></Route>
                </Routes>
            </Layout>
        )
    }
}
