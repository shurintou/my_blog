
import React from 'react'
import { Layout, Row, Col } from 'antd';
import { HomeOutlined, ReadOutlined, UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { Link } from "react-router-dom";
const { Header } = Layout;

interface antdColPropObj {
    xs: antdColSubPropObj,
    sm: antdColSubPropObj,
    md: antdColSubPropObj,
    lg: antdColSubPropObj,
    xl: antdColSubPropObj,
}

interface antdColSubPropObj {
    span?: number,
    offset?: number,
}

export default class BlogHeader extends React.Component<{}, { [key: string]: any }> {

    render() {
        const spanPropObj: antdColPropObj = {
            'xs': { span: 6 },
            'sm': { span: 5 },
            'md': { span: 4 },
            'lg': { span: 3 },
            'xl': { span: 2 },
        }
        const offsetPropObj: antdColPropObj = {
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
                                            spanPropObj[key as keyof antdColPropObj],
                                            offsetPropObj[key as keyof antdColPropObj])
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
