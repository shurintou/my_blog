import { Component } from 'react'
import { Layout } from 'antd'
import BlogsList from '../../components/blogList'

export default class Blogs extends Component {
    render() {
        return (
            <Layout>
                <BlogsList></BlogsList>
            </Layout>
        )
    }
}
