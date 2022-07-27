
import React from 'react'
import { Layout, Row, Col, Button, Dropdown, Menu } from 'antd'
import { HomeOutlined, ReadOutlined, UserOutlined, GlobalOutlined, } from '@ant-design/icons'
import { Link } from "react-router-dom"
import config from '../../config/config'
import { getLocalHtmlLang, setLocalHtmlLang } from '../../utils/userAgent'
import { AntdColPropObj } from '../../types/index'
import headerStyle from './index.module.css'
const { Header } = Layout

export default class BlogHeader extends React.Component<{}, { [key: string]: any }> {
    static hideHeaderOverScrollTop = 100
    static toggleHeaderMinScrollTop = 30
    static firstPageUrl = "/list?page=1"
    constructor(props: Object) {
        super(props)
        this.state = {
            scrolledTop: 0,
            showHeader: true,
            selectedLanguage: getLocalHtmlLang(),
            scrollHandler: () => {
                const newScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
                if (newScrollTop >= BlogHeader.hideHeaderOverScrollTop) {
                    if (this.state.scrolledTop + BlogHeader.toggleHeaderMinScrollTop <= newScrollTop) {
                        /* hide header if scroll down */
                        this.setState({ showHeader: false })
                    }
                    else if (this.state.scrolledTop > newScrollTop + BlogHeader.toggleHeaderMinScrollTop) {
                        /* show header if scroll up a little distance even the scroll top is over hideHeaderOverScrollTop */
                        this.setState({ showHeader: true })
                    }
                }
                this.setState({ scrolledTop: newScrollTop })
            }
        }
    }

    blogsClickHandler() {
        if (document.location.href.indexOf(BlogHeader.firstPageUrl) > 0) {
            window.scroll(0, 0)
        }
    }

    scrollToTop() {
        window.scroll(0, 0)
    }

    componentDidMount() {
        window.addEventListener('scroll', this.state.scrollHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.state.scrollHandler)
    }


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
        const languageSpanPropObj: AntdColPropObj = {
            'xs': { span: 2 },
            'sm': { span: 2 },
            'md': { span: 2 },
            'lg': { span: 1 },
            'xl': { span: 1 },
        }
        const languageOffsetPropObj: AntdColPropObj = {
            'xs': { offset: 4 },
            'sm': { offset: 6 },
            'md': { offset: 8 },
            'lg': { offset: 11 },
            'xl': { offset: 13 },
        }
        const menu =
            <Menu selectedKeys={[this.state.selectedLanguage]}
                onClick={e => {
                    if (this.state.selectedLanguage !== e.key) {
                        this.setState({ selectedLanguage: e.key })
                    }
                    setLocalHtmlLang(e.key)
                }}
                items={config.languageProps}
            />
        return (
            <Header
                className={
                    this.state.scrolledTop < BlogHeader.hideHeaderOverScrollTop || this.state.showHeader ? headerStyle.show : headerStyle.hide
                }
                style={{
                    'padding': '0 1em',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%'
                }}>
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
                        <Link to={BlogHeader.firstPageUrl}> <Button type="primary" icon={<ReadOutlined />} onClick={this.blogsClickHandler}>Blog</Button></Link>
                    </Col>
                    <Col {...spanPropObj}>
                        <Link to="/about"><Button type="primary" icon={<UserOutlined />} onClick={this.scrollToTop}>About</Button></Link>
                    </Col>
                    <Col
                        {

                        ...Object.assign({},
                            Object.fromEntries(Object.keys(languageSpanPropObj).map(
                                key =>
                                    [
                                        key,
                                        Object.assign({},
                                            languageSpanPropObj[key as keyof AntdColPropObj],
                                            languageOffsetPropObj[key as keyof AntdColPropObj])
                                    ]
                            ))
                        )
                        }
                    >
                        <Dropdown overlay={menu} placement="bottomRight">
                            <Button type="primary" icon={<GlobalOutlined />}></Button>
                        </Dropdown>
                    </Col>
                </Row>
            </Header>
        )
    }
}
