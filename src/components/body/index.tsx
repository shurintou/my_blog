import { Component } from 'react'
import { Layout } from 'antd';
import Home from '../../pages/home';

export default class BlogBody extends Component {
    render() {
        return (
            <Layout style={{ margin: '2em 1em' }}>
                <Home></Home>
            </Layout>
        )
    }
}
