import React, { useState, useEffect } from 'react'
import { Divider, Typography, Layout, Space } from 'antd'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import { BlogsListItem } from '../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../blog/date'
import CommentComp from '../../components/blog/comment'
import LabelsComp from '../../components/others/labels'
import Markdown from '../others/markdown/'
import config from '../../config/config'

const { Title, Paragraph, Text } = Typography

const BlogsListItemComp: React.FC<BlogsListItem> = (props) => {
    const navigate = useNavigate()
    const navigateToBlog = () => { navigate(`/blog?id=${props.number}`, { state: { backSearchParams: document.location.search } }) }
    const mouseBlurStyle = { cursor: 'pointer' }
    const [isLastItem, setIsLastItem] = useState(false)

    useEffect(() => {
        setIsLastItem((props.index || 0) >= (props.listLength || 0)) //divider of which is the last item would not be shown.
    }, [props.index, props.listLength])

    return (
        <li>
            <Title level={3} onClick={navigateToBlog} style={{ padding: '16px 24px 0px 24px', }}><Text style={mouseBlurStyle} >{props.title}</Text></Title>
            <Typography style={{ padding: '0px 24px 16px 24px' }} >
                <DateComp
                    dateFromNow={props.created_from_now}
                    dateLocal={props.created_at_local}
                    text={'Created'}
                />
                <LabelsComp labelList={props.labels}></LabelsComp>
                <Divider style={{ marginTop: '0' }} />
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
                <Layout style={{ marginBottom: '1em' }} >
                    <Text
                        onClick={navigateToBlog}
                        style={{
                            cursor: 'pointer',
                            color: config.antdProps.themeColor,
                            marginBottom: '1em',
                        }}
                        underline
                    >Read more
                    </Text>
                    <Space split={<Divider type="vertical" style={{ borderLeftColor: 'rgba(0,0,0,0.6)' }} />}>
                        <CommentComp
                            title='Like'
                            slot={<HeartOutlined onClick={navigateToBlog} />}
                            text={<Text>{
                                props.reactions['+1']
                                + props.reactions.hooray
                                + props.reactions.laugh
                                + props.reactions.rocket
                                + props.reactions.heart}
                            </Text>} />
                        <CommentComp
                            title='Comment'
                            slot={<CommentOutlined onClick={navigateToBlog} />}
                            text={<Text>{props.comments
                            }
                            </Text>} />
                    </Space>
                </Layout>
            </Typography>
            {!isLastItem && <Divider style={{ borderTopColor: 'rgba(0,0,0,0.2)', margin: 0 }} />}
        </li>
    )
}

const listItemModule = (props: BlogsListItem) => <BlogsListItemComp {...props} />

export default listItemModule