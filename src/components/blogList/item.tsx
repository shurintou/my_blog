import React, { useState, useEffect } from 'react'
import { Divider, Space, Typography, Button, Tag, Layout } from 'antd'
import { MessageOutlined, LikeOutlined } from '@ant-design/icons'
import { BlogsListItem } from '../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../blog/date'
import Markdown from '../others/markdown/'

const { Title, Paragraph, Text } = Typography

const BlogsListItemComp: React.FC<BlogsListItem> = (props) => {
    const navigate = useNavigate()
    const navigateToBlog = () => navigate('/blog/' + props.number)
    const mouseBlurStyle = { cursor: 'pointer' }
    const [isLastItem, setIsLastItem] = useState(false)

    useEffect(() => {
        setIsLastItem((props.index || 0) >= (props.listLength || 0)) //divider of which is the last item would not be shown.
    }, [props.index, props.listLength])

    return (
        <Typography>
            <Title level={3} onClick={navigateToBlog}><Text style={mouseBlurStyle} >{props.title}</Text></Title>
            <DateComp
                dateFromNow={props.created_from_now}
                dateLocal={props.created_at_local}
                text={'Created'}
            />
            {props.labels.length > 0 &&
                <Paragraph>
                    {props.labels.map(label => {
                        return <Tag key={label.name} color={'#' + label.color}>{label.name}</Tag>
                    })}
                </Paragraph>
            }
            <Paragraph
                onClick={navigateToBlog}
                style={mouseBlurStyle}
            >
                <Layout style={{
                    WebkitLineClamp: 3,
                    lineClamp: 3,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '2em',
                    maxHeight: '10em',
                    wordWrap: 'break-word',
                }}>
                    <Markdown blogText={props.body}></Markdown>
                </Layout>
            </Paragraph>
            <Space size="middle">
                <Button type="primary" size="small" icon={<LikeOutlined />}>{props.reactions['+1'] + props.reactions.heart + props.reactions.laugh}</Button>
                <Button type="primary" size="small" icon={<MessageOutlined />}>{props.comments}</Button>
            </Space>
            {!isLastItem && <Divider />}
        </Typography>
    )
}

const listItemModule = (props: BlogsListItem) => <BlogsListItemComp {...props} />

export default listItemModule