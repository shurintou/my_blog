import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Layout, Empty, Typography, Tag } from 'antd'
import { getBlogInfo } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem } from '../../types/index'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import Markdown from '../../components/others/markdown'
import Gitalk from '../../components//others/gitalk'
import DateComp from '../../components/blog/date'


const { Title, Paragraph } = Typography

const Blog = () => {
    const blogIdStr = useParams().blogId
    const [hasData, setHasData] = useState(false)
    const [blogContent, setBlogContent] = useState<BlogsListItem>()

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
            {hasData
                ? <Layout>
                    <Title level={3}>{blogContent?.title}</Title>
                    <DateComp
                        dateFromNow={blogContent ? blogContent.created_from_now : ''}
                        dateLocal={blogContent ? blogContent.created_at_local : ''}
                        text={'Created'}
                    />
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
                </Layout>
                : <Empty></Empty>
            }
            {blogIdStr && <Gitalk blogId={parseInt(blogIdStr)} />}
        </Layout>
    )
}

const BlogModule = () => <Blog></Blog>

export default BlogModule