import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Layout, Empty, Typography, Tag, Row, Col, BackTop, Space, Divider } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import CommentComp from '../../components/blog/comment'
import { getBlogInfo } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem } from '../../types/index'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import Markdown from '../../components/others/markdown'
import Gitalk from '../../components//others/gitalk'
import DateComp from '../../components/blog/date'
import config from '../../config/config'
import Like from '../../components/blog/like'


const { Title, Paragraph } = Typography

const Blog = () => {
    const blogIdStr = useParams().blogId
    const [hasData, setHasData] = useState(false)
    const [blogContent, setBlogContent] = useState<BlogsListItem>()
    const [commentCntCorrection, setCommentCntCorrection] = useState(0)

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
            })
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
                                    backgroundColor: window.innerWidth >= 768 ? config.antdProps.titleBackgroundColor : 'null',
                                    border: window.innerWidth >= 768 ? '2px solid' : 'null',
                                    borderColor: config.antdProps.borderColor,
                                    borderRadius: window.innerWidth >= 768 ? '6px 6px 0px 0px' : '0px',
                                    marginBottom: '0em',
                                    paddingLeft: window.innerWidth >= 768 ? '0.5em' : '0em',
                                }}
                            >{blogContent?.title}</Title>
                            <Layout
                                style={{
                                    padding: window.innerWidth >= 768 ? '1em' : '0em',
                                    border: window.innerWidth >= 768 ? '2px solid' : 'null',
                                    borderColor: config.antdProps.borderColor,
                                    borderRadius: '0px 0px 6px 6px',
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
                                <Paragraph>
                                    {blogContent?.labels.map(label => {
                                        return <Tag key={label.name} color={'#' + label.color}>{label.name}</Tag>
                                    })}
                                </Paragraph>
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
                                            <Like number={blogContent ? blogContent?.number : 0} handlerClick={setCommentCntCorrection}></Like>
                                        }
                                        text={blogContent && (blogContent?.reactions['+1'] + blogContent?.reactions.heart + blogContent?.reactions.laugh + commentCntCorrection)}
                                    />
                                    <CommentComp
                                        title='Read'
                                        slot={<EyeOutlined />}
                                        text={blogContent?.comments}
                                    />
                                </Space>
                            </Layout>
                        </Layout>
                        :
                        <Empty></Empty>
                    }
                    {blogIdStr && <Gitalk blogId={parseInt(blogIdStr)} />}
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