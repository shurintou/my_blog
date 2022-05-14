import React, { useState, useEffect } from 'react'
import { Divider, Typography, Tag, Layout, } from 'antd'
import { BlogsListItem } from '../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../blog/date'
import Markdown from '../others/markdown/'
import config from '../../config/config'

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
                <Layout
                    style={{
                        WebkitLineClamp: config.blogProps.previewLine,
                        lineClamp: config.blogProps.previewLine,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: '2em',
                        maxHeight: 5 * (config.blogProps.previewLine) + 'em',
                        wordWrap: 'break-word',
                    }}>
                    <Markdown blogText={props.body}></Markdown>
                </Layout>
            </Paragraph>
            <Paragraph>
                <Text
                    onClick={navigateToBlog}
                    style={{
                        cursor: 'pointer',
                        color: config.antdProps.themeColor
                    }}
                    underline
                >Read more
                </Text>
            </Paragraph>
            {!isLastItem && <Divider style={{ borderTopColor: 'rgba(0,0,0,0.2)' }} />}
        </Typography>
    )
}

const listItemModule = (props: BlogsListItem) => <BlogsListItemComp {...props} />

export default listItemModule