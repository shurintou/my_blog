import { Component } from 'react'
import { Layout, Row, Col } from 'antd'
import BlogsList from '../../components/body/list'

export default class Blogs extends Component {
    render() {
        return (
            <Layout>
                <Row>
                    <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                    </Col>
                    <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                        <BlogsList></BlogsList>
                    </Col>
                    <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                    </Col>
                </Row>
            </Layout>
        )
    }
}
