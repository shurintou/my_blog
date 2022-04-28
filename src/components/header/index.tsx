
import React from 'react'
import { Layout, Row, Col, Button } from 'antd'
import { HomeOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from "react-router-dom"
import { AntdColPropObj } from '../../types/index'
const { Header } = Layout

export default class BlogHeader extends React.Component<{}, { [key: string]: any }> {

    render() {
        const spanPropObj: AntdColPropObj = {
            'xs': { span: 6 },
            'sm': { span: 5 },
            'md': { span: 4 },
            'lg': { span: 3 },
            'xl': { span: 2 },
        }
        const offsetPropObj: AntdColPropObj = {
            'xs': { offset: 0 },
            'sm': { offset: 1 },
            'md': { offset: 2 },
            'lg': { offset: 3 },
            'xl': { offset: 4 },
        }
        return (
            <Header style={{ 'padding': '0 1em' }}>
                <Row>
                    <Col
                        {   /* return a new object that has xs,sm,md,lg,xl properties, 
                                in which containing both span and offset properties copied from spanPropObj and offsetPropObj.
                            */
                        ...Object.assign({},
                            Object.fromEntries(Object.keys(spanPropObj).map(
                                key =>
                                    [
                                        key,
                                        Object.assign({},
                                            spanPropObj[key as keyof AntdColPropObj],
                                            offsetPropObj[key as keyof AntdColPropObj])
                                    ]
                            ))
                        )
                        }
                    >
                        <Link to="/"><Button type="primary" icon={<HomeOutlined />}>Home</Button></Link>
                    </Col>
                    <Col {...spanPropObj}>
                        <Link to="/blogs"> <Button type="primary" icon={<ReadOutlined />}>Blogs</Button></Link>
                    </Col>
                    <Col {...spanPropObj}>
                        <Link to="/about"><Button type="primary" icon={<UserOutlined />}>About</Button></Link>
                    </Col>
                </Row>
            </Header>
        )
    }
}
