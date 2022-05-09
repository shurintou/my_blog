import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { Layout, Empty, Typography, Tag } from 'antd'
import { getBlogInfo } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem } from '../../types/index'
import { parseISODate } from '../../utils/formatter'
import Markdown from '../../components/others/markdown'
import Gitalk from '../../components//others/gitalk'

const { Title, Paragraph, Text } = Typography

const Blog = () => {
    const blogIdStr = useParams().blogId
    const [hasData, setHasData] = useState(false)
    const [blogContent, setBlogContent] = useState<BlogsListItem>()

    useEffect(() => {

        if (blogIdStr) {
            const blogId = parseInt(blogIdStr)
            getBlogInfo({ number: blogId }).then((res: BlogsItemRes) => {
                setBlogContent(Object.assign(res, { created_at_local: parseISODate(res.created_at) }))
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
                    <Paragraph>
                        <Text type="secondary">{blogContent?.created_at_local}</Text>
                    </Paragraph>
                    <Paragraph>
                        {blogContent?.labels.map(label => {
                            return <Tag key={label.name} color={'#' + label.color}>{label.name}</Tag>
                        })}
                    </Paragraph>
                    <Markdown blogText={blogContent?.body} />
                </Layout>
                : <Empty></Empty>
            }
            {blogIdStr && <Gitalk blogId={parseInt(blogIdStr)} />}
        </Layout>
    )
}

const BlogModule = () => <Blog></Blog>

export default BlogModule