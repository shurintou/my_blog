import { Component } from 'react'
import { Layout } from 'antd'
const { Footer } = Layout

export default class BlogFooter extends Component {
    render() {
        return (
            <Footer style={{ textAlign: 'center' }}>Copyright ©{new Date().getFullYear()} Shurintou All Rights Reserved</Footer>
        )
    }
}
