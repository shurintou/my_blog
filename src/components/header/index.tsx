
import React, { useState, useEffect, useRef } from 'react'
import { Layout, Row, Col, Button, Dropdown, Menu } from 'antd'
import { HomeOutlined, ReadOutlined, UserOutlined, GlobalOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from "react-router-dom"
import config from '../../config/config'
import { setLocalHtmlLang } from '../../utils/userAgent'
import { AntdColPropObj } from '../../types/index'
import headerStyle from './index.module.css'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import { changeLocalLanguage } from '../../features/language/languageSlice'
import { changeFilterLabel } from '../../features/filterLabel/filterLabelSlice'
import { changeSearchModalOpen } from '../../features/searchModalOpen/searchModalOpenSlice'
import { ZH_LANGUAGE, JA_LANGUAGE, EN_LANGUAGE, ROUTER_NAME } from '../../config/constant'

const { Header } = Layout

const BlogHeader: React.FC<{}> = () => {
    const hideHeaderOverScrollTop = 100
    const toggleHeaderMinScrollTop = 30
    const firstPageUrl = ROUTER_NAME.list + `?${ROUTER_NAME.props.page}=1`
    const [scrolledTop, setScrolledTop] = useState(0)
    const [showHeader, setShowHeader] = useState(true)
    const scrolledTopRef = useRef(scrolledTop) // to solve the re-render delay issue. 
    scrolledTopRef.current = scrolledTop
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()
    const navigator = useNavigate()

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

    const homeClickHandler = () => {
        navigator(ROUTER_NAME.home)
        clearSelectedFilterLabel()
    }


    const aboutClickHandler = () => {
        navigator(ROUTER_NAME.about)
        scrollToTop()
        clearSelectedFilterLabel()
    }

    const clearSelectedFilterLabel = () => dispatch(changeFilterLabel([]))


    const postClickHandler = () => {
        navigator(firstPageUrl)
        clearSelectedFilterLabel() // to fix the issue that when click post button at post page, the selectedFilterLabel will remain.
        if (document.location.href.indexOf(firstPageUrl) > 0) scrollToTop()
    }

    const searchClickHandler = () => {
        dispatch(changeSearchModalOpen(true))
    }

    const scrollToTop = () => window.scroll(0, 0)


    const getMenuTextList = (lang: string) => {
        switch (lang) {
            case ZH_LANGUAGE.key:
                return ZH_LANGUAGE.menuTextList
            case JA_LANGUAGE.key:
                return JA_LANGUAGE.menuTextList
            default:
                return EN_LANGUAGE.menuTextList
        }
    }

    const [menuTabNames, setMenuTabNames] = useState(getMenuTextList(selectedLanguage))
    useEffect(() => {
        setMenuTabNames(getMenuTextList(selectedLanguage))
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
    const postPropObj: AntdColPropObj = {
        'xs': { span: selectedLanguage === ZH_LANGUAGE.key ? 6 : 5 },
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
        'xs': { span: 3 },
        'sm': { span: 2 },
        'md': { span: 2 },
        'lg': { span: 1 },
        'xl': { span: 1 },
    }
    const globalSpanPropObj: AntdColPropObj = {
        'xs': { span: 2 },
        'sm': { span: 2 },
        'md': { span: 2 },
        'lg': { span: 1 },
        'xl': { span: 1 },
    }
    const languageOffsetPropObj: AntdColPropObj = {
        'xs': { offset: selectedLanguage === ZH_LANGUAGE.key ? 1 : 2 },
        'sm': { offset: 4 },
        'md': { offset: 6 },
        'lg': { offset: 10 },
        'xl': { offset: 12 },
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
                    <Button type="primary" style={{ padding: '0px' }} icon={<HomeOutlined />} onClick={homeClickHandler}>{menuTabNames && menuTabNames[0]}</Button>
                </Col>
                <Col {...postPropObj}>
                    <Button type="primary" style={{ padding: '0px' }} icon={<ReadOutlined />} onClick={postClickHandler}>{menuTabNames && menuTabNames[1]}</Button>
                </Col>
                <Col {...spanPropObj}>
                    <Button type="primary" style={{ padding: '0px' }} icon={<UserOutlined />} onClick={aboutClickHandler}>{menuTabNames && menuTabNames[2]}</Button>
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
                    <Button type="primary" icon={<SearchOutlined />} onClick={searchClickHandler}></Button>
                </Col>
                <Col {...globalSpanPropObj}>
                    <Dropdown overlay={menu} placement="bottomRight">
                        <Button type="primary" icon={<GlobalOutlined />}></Button>
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    )

}
export default BlogHeader
