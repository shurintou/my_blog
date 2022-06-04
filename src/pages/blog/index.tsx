import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Layout, Empty, Typography, Row, Col, BackTop, Space, Divider, Spin } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import CommentComp from '../../components/blog/comment'
import { getBlogInfo } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem, } from '../../types/index'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import Markdown from '../../components/others/markdown'
import Gitalk from '../../components//others/gitalk'
import DateComp from '../../components/blog/date'
import LabelsComp from '../../components/others/labels'
import config from '../../config/config'
import Like from '../../components/blog/like'
import { getLocalUser } from '../../utils/authentication'


const { Title, Text } = Typography

const Blog = () => {
    const blogIdStr = useParams().blogId
    const [hasData, setHasData] = useState(false)
    const [blogContent, setBlogContent] = useState<BlogsListItem>()
    const [likeCnt, setlikeCnt] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)

    useEffect(() => {
        if (blogIdStr) {
            const blogId = parseInt(blogIdStr)
            getBlogInfo({ number: blogId }).then((res: BlogsItemRes) => {
                setBlogContent(Object.assign(res, {
                    created_at_local: parseISODateStr(res.created_at),
                    updated_at_local: parseISODateStr(res.updated_at),
                    created_from_now: getDateFromNow(parseISODate(res.created_at)),
                    updated_from_now: getDateFromNow(parseISODate(res.updated_at)),
                }))
                setHasData(true)
                const parentEl = document.head
                let busuanziScriptSrc = ''
                const scriptElementArray: Array<HTMLScriptElement> = Array.from(document.getElementsByTagName('script'))
                scriptElementArray.forEach((script, index) => {
                    if (script.id === 'busuanzi-script') {
                        busuanziScriptSrc = script.src
                    }
                    if (index > 0) {
                        parentEl.removeChild(script)
                    }
                })
                // to make busuanzi script to support SPA application. remove/add it every single popstate of route .
                const newScriptEl = document.createElement('script')
                newScriptEl.setAttribute('type', 'text/javascript')
                document.head.appendChild(newScriptEl)
                newScriptEl.setAttribute('src', busuanziScriptSrc)
                newScriptEl.setAttribute('async', 'true')
                newScriptEl.setAttribute('id', 'busuanzi-script')
            })
        }

        function windowResizeFunc() {
            setPcRenderMode(window.innerWidth >= 768)
        }
        windowResizeFunc()
        window.addEventListener('resize', windowResizeFunc)
        return () => {
            window.removeEventListener('resize', windowResizeFunc)
        }
        /* eslint-disable-next-line */
    }, [])

    return (
        <Layout>
            <Row>
                <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    {hasData
                        ?
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
                            >{blogContent?.title}</Title>
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
                                            text={'Created'}
                                        />
                                    </Col>
                                    <Col span={1} offset={7}>
                                    </Col>
                                </Row>
                                {blogContent && <LabelsComp labelList={blogContent?.labels}></LabelsComp>}
                                <Divider style={{ margin: '0em 0em 1em 0em' }} />
                                <Markdown blogText={blogContent?.body} />
                                {
                                    blogContent?.updated_at !== blogContent?.created_at &&
                                    <DateComp
                                        dateFromNow={blogContent ? blogContent.updated_from_now : ''}
                                        dateLocal={blogContent ? blogContent.updated_at_local : ''}
                                        text={'Updated'}
                                    />
                                }
                                <Space size="small" split={<Divider type="vertical" style={{ borderLeftColor: 'rgba(0,0,0,0.6)' }} />}>
                                    <CommentComp
                                        title='Like'
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
                                        title='View'
                                        slot={<EyeOutlined />}
                                        text={<Text id="busuanzi_value_page_pv"><Spin /></Text>}
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