
import { Component } from 'react'
import { Layout, Menu } from 'antd';
const { Header } = Layout;

export default class BlogHeader extends Component {
    render() {
        return (
            <Header>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                </Menu>
            </Header>
        )
    }
}
