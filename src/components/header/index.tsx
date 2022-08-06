
import React, { useState, useEffect, useRef } from 'react'
import { Layout, Row, Col, Button, Dropdown, Menu } from 'antd'
import { HomeOutlined, ReadOutlined, UserOutlined, GlobalOutlined, } from '@ant-design/icons'
import { Link } from "react-router-dom"
import config from '../../config/config'
import { setLocalHtmlLang } from '../../utils/userAgent'
import { AntdColPropObj } from '../../types/index'
import headerStyle from './index.module.css'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { changeLocalLanguage } from '../../features/language/languageSlice'
import { ZH_LANGUAGE, JA_LANGUAGE, EN_LANGUAGE } from '../../config/constant'

const { Header } = Layout

const BlogHeader: React.FC<{}> = () => {
    const hideHeaderOverScrollTop = 100
    const toggleHeaderMinScrollTop = 30
    const firstPageUrl = "/list?page=1"
    const [scrolledTop, setScrolledTop] = useState(0)
    const [showHeader, setShowHeader] = useState(true)
    const scrolledTopRef = useRef(scrolledTop) // to solve the re-render delay issue. 
    scrolledTopRef.current = scrolledTop
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()

    const setSelectedLanguage = (newLang: string) => {
        dispatch(changeLocalLanguage(newLang))
    }

    const scrollHandler = () => {
        const newScrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (newScrollTop >= hideHeaderOverScrollTop) {
            if (scrolledTopRef.current + toggleHeaderMinScrollTop <= newScrollTop) {
                /* hide header if scroll down */
                setShowHeader(false)
            }
            else if (scrolledTopRef.current > newScrollTop + toggleHeaderMinScrollTop) {
                /* show header if scroll up a little distance even the scroll top is over hideHeaderOverScrollTop */
                setShowHeader(true)
            }
        }
        setScrolledTop(newScrollTop)
    }

    const blogsClickHandler = () => {
        if (document.location.href.indexOf(firstPageUrl) > 0) {
            scrollToTop()
        }
    }

    const scrollToTop = () => {
        window.scroll(0, 0)
    }


    const menuTabNameMap = new Map<string, Array<string>>()
    menuTabNameMap.set(EN_LANGUAGE.key, ['Home', 'Post', 'About'])
    menuTabNameMap.set(ZH_LANGUAGE.key, ['主页', '文章', '关于'])
    menuTabNameMap.set(JA_LANGUAGE.key, ['トップ', '投稿', 'その他'])
    const [menuTabNames, setMenuTabNames] = useState(menuTabNameMap.get(selectedLanguage))
    useEffect(() => {
        setMenuTabNames(menuTabNameMap.get(selectedLanguage))
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => {
            window.removeEventListener('scroll', scrollHandler)
        }
        /* eslint-disable-next-line */
    }, [])

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
        <Menu selectedKeys={[selectedLanguage]}
            onClick={e => {
                if (selectedLanguage !== e.key) {
                    setSelectedLanguage(e.key)
                }
                setLocalHtmlLang(e.key)
            }}
            items={config.languageProps}
        />
    return (
        <Header
            className={
                scrolledTop < hideHeaderOverScrollTop || showHeader ? headerStyle.show : headerStyle.hide
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
                    <Link to="/"><Button type="primary" icon={<HomeOutlined />}>{menuTabNames && menuTabNames[0]}</Button></Link>
                </Col>
                <Col {...spanPropObj}>
                    <Link to={firstPageUrl}> <Button type="primary" icon={<ReadOutlined />} onClick={blogsClickHandler}>{menuTabNames && menuTabNames[1]}</Button></Link>
                </Col>
                <Col {...spanPropObj}>
                    <Link to="/about"><Button type="primary" icon={<UserOutlined />} onClick={scrollToTop}>{menuTabNames && menuTabNames[2]}</Button></Link>
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
export default BlogHeader
