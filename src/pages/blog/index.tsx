import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import { Layout, Empty, Typography, Row, Col, BackTop, Space, Divider, Spin, Button } from 'antd'
import { CommentOutlined, LeftOutlined } from '@ant-design/icons'
import CommentComp from '../../components/blog/comment'
import { getBlogInfo } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem, } from '../../types/index'
import { parseISODate, parseISODateStr, getDateFromNow, getDateFromNowText } from '../../utils/formatter'
import Markdown from '../../components/others/markdown'
import Gitalk from '../../components//others/gitalk'
import DateComp from '../../components/blog/date'
import LabelsComp from '../../components/others/labels'
import { debounce, doScrolling } from '../../utils/common'
import config from '../../config/config'
import Like from '../../components/blog/like'
import { getLocalHtmlLang } from '../../utils/userAgent'
import { getLocalUser } from '../../utils/authentication'
import { useAppSelector } from '../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE } from '../../config/constant'


const { Title, Text } = Typography

const Blog = () => {
    const navigate = useNavigate()
    const [searchParams,] = useSearchParams()
    const blogIdStr = searchParams.get('id')
    const [hasData, setHasData] = useState(false)
    const [blogContent, setBlogContent] = useState<BlogsListItem>()
    const [likeCnt, setlikeCnt] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const [blogLang, setBlogLang] = useState(getLocalHtmlLang())
    const backToBlogList = () => {
        const backSearchParams = window.history.state?.usr?.backSearchParams || sessionStorage.getItem('backSearchParams')
        if (backSearchParams) {
            navigate('/list' + backSearchParams)
        }
        else {
            navigate('/list?page=1')
        }
    }

    const scrollToGitalk = () => {
        const gitalkEl: Element | null = document.getElementById('gitalk-container')
        if (gitalkEl) {
            doScrolling(gitalkEl, 500)
        }
    }

    const selectedLanguage = useAppSelector((state) => state.language.value)
    useEffect(() => {
        if (blogIdStr) {
            const blogId = parseInt(blogIdStr)
            getBlogInfo({ number: blogId }).then((res: BlogsItemRes) => {
                setBlogContent(Object.assign(res, {
                    created_at_local: parseISODateStr(res.created_at),
                    updated_at_local: parseISODateStr(res.updated_at),
                    created_from_now: getDateFromNow(parseISODate(res.created_at), selectedLanguage),
                    updated_from_now: getDateFromNow(parseISODate(res.updated_at), selectedLanguage),
                }))
                setHasData(true)
            })
        }

        function windowResizeFunc() {
            setPcRenderMode(window.innerWidth >= 768)
        }
        const windowResizeDebounceFunc = debounce(windowResizeFunc, config.eventProps.resizeDebounceDelay)
        windowResizeFunc()
        window.addEventListener('resize', windowResizeDebounceFunc)
        return () => {
            window.removeEventListener('resize', windowResizeDebounceFunc)
        }
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    const [createText, setCreateText] = useState(getDateFromNowText(selectedLanguage, true))
    const [updateText, setUpdateText] = useState(getDateFromNowText(selectedLanguage, false))
    useEffect(() => {
        setCreateText(getDateFromNowText(selectedLanguage, true))
        setUpdateText(getDateFromNowText(selectedLanguage, false))
        setLikeText(getLikeCommentText(selectedLanguage)![0])
        setCommentText(getLikeCommentText(selectedLanguage)![1])
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    const getLikeCommentText = (lang: string) => {
        switch (lang) {
            case ZH_LANGUAGE.key:
                return [ZH_LANGUAGE.likeText, ZH_LANGUAGE.commentText]
            case JA_LANGUAGE.key:
                return [JA_LANGUAGE.likeText, JA_LANGUAGE.commentText]
            default:
                return [EN_LANGUAGE.likeText, EN_LANGUAGE.commentText]
        }
    }
    const [likeText, setLikeText] = useState(getLikeCommentText(selectedLanguage)![0])
    const [commentText, setCommentText] = useState(getLikeCommentText(selectedLanguage)![1])


    return (
        <Layout lang={blogLang}>
            <Row>
                <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    {hasData
                        ?
                        <Layout>
                            <Layout>
                                <Title
                                    level={3}
                                    style={{
                                        backgroundColor: config.antdProps.titleBackgroundColor,
                                        border: '2px solid',
                                        borderColor: config.antdProps.borderColor,
                                        borderRadius: pcRenderMode ? '6px 6px 0px 0px' : '0px',
                                        marginBottom: '0em',
                                        paddingLeft: '0.5em',
                                    }}
                                >
                                    <Button
                                        style={{
                                            backgroundColor: config.antdProps.borderColor,
                                            verticalAlign: '0px'
                                        }}
                                        icon={<LeftOutlined />}
                                        onClick={backToBlogList}
                                    ></Button>
                                    {blogContent?.title}</Title>
                            </Layout>
                            <Layout
                                style={{
                                    padding: '1em 1em',
                                    border: '2px solid',
                                    borderColor: config.antdProps.borderColor,
                                    borderRadius: pcRenderMode ? '0px 0px 6px 6px' : '0px',
                                }}
                            >
                                <Row>
                                    <Col span={16}>
                                        <DateComp
                                            dateFromNow={blogContent ? blogContent.created_from_now : ''}
                                            dateLocal={blogContent ? blogContent.created_at_local : ''}
                                            text={createText}
                                        />
                                    </Col>
                                    <Col span={1} offset={7}>
                                    </Col>
                                </Row>
                                {blogContent && <LabelsComp labelList={blogContent?.labels} setBlogLanguage={setBlogLang}></LabelsComp>}
                                <Divider style={{ margin: '0em 0em 1em 0em' }} />
                                <Markdown blogText={blogContent?.body} />
                                {
                                    blogContent?.updated_at !== blogContent?.created_at &&
                                    <DateComp
                                        dateFromNow={blogContent ? blogContent.updated_from_now : ''}
                                        dateLocal={blogContent ? blogContent.updated_at_local : ''}
                                        text={updateText}
                                    />
                                }
                                <Space size="small" split={<Divider type="vertical" style={{ borderLeftColor: 'rgba(0,0,0,0.6)' }} />}>
                                    <CommentComp
                                        title={likeText}
                                        slot={
                                            <Like number={blogContent ? blogContent?.number : 0} likeHandler={setlikeCnt}></Like>
                                        }
                                        text={
                                            !blogContent ? <Spin /> :
                                                <Text>
                                                    {
                                                        blogContent.reactions['+1']
                                                        + blogContent.reactions.hooray
                                                        + blogContent.reactions.laugh
                                                        + blogContent.reactions.rocket
                                                        + (getLocalUser()?.id === 0 ? blogContent.reactions.heart : likeCnt)
                                                    }
                                                </Text>
                                        }
                                    />
                                    <CommentComp
                                        title={commentText}
                                        slot={<CommentOutlined onClick={scrollToGitalk} />}
                                        text={!blogContent ? <Spin /> : <Text>{blogContent.comments}</Text>}
                                    />
                                </Space>
                            </Layout>
                        </Layout>
                        :
                        <Empty></Empty>
                    }
                    <Layout style={{ padding: pcRenderMode ? '0em' : '0.5em' }}>
                        {blogIdStr && <Gitalk blogId={parseInt(blogIdStr)} />}
                    </Layout>
                </Col>
                <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                </Col>
            </Row>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>
    )
}

const BlogModule = () => <Blog></Blog>

export default BlogModule