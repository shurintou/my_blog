import React, { useState, useEffect } from 'react'
import { Divider, Typography, Layout, Space } from 'antd'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import { BlogsListItem } from '../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../blog/date'
import CommentComp from '../../components/blog/comment'
import LabelsComp from '../../components/others/labels'
import Markdown from '../others/markdown/'
import { getLocalHtmlLang } from '../../utils/userAgent'
import config from '../../config/config'
import { getDateFromNowText } from '../../utils/formatter'
import { useAppSelector } from '../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE } from '../../config/constant'


const { Title, Paragraph, Text } = Typography

const BlogsListItemComp: React.FC<BlogsListItem> = (props) => {
    const navigate = useNavigate()
    const navigateToBlog = () => {
        const backSearchParams = document.location.search
        navigate(`/blog?id=${props.number}`, { state: { backSearchParams: backSearchParams } })
        /* to fix the bug that when redirected after github login, the back button in blog title not work */
        sessionStorage.setItem('backSearchParams', backSearchParams)
    }
    const mouseBlurStyle = { cursor: 'pointer' }
    const [isLastItem, setIsLastItem] = useState(false)
    const [blogLang, setBlogLang] = useState(getLocalHtmlLang())

    useEffect(() => {
        setIsLastItem((props.index || 0) >= (props.listLength || 0)) //divider of which is the last item would not be shown.
    }, [props.index, props.listLength])

    const selectedLanguage = useAppSelector((state) => state.language.value)
    const [createText, setCreateText] = useState(getDateFromNowText(selectedLanguage, true))
    useEffect(() => {
        setCreateText(getDateFromNowText(selectedLanguage, true))
        setReadmoreText(getReadmoreText(selectedLanguage))
        setLikeText(getLikeCommentText(selectedLanguage)[0])
        setCommentText(getLikeCommentText(selectedLanguage)[1])
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    const getReadmoreText = (lang: string) => {
        switch (lang) {
            case ZH_LANGUAGE.key:
                return ZH_LANGUAGE.readmoreText
            case JA_LANGUAGE.key:
                return JA_LANGUAGE.readmoreText
            default:
                return EN_LANGUAGE.readmoreText
        }
    }
    const [readmoreText, setReadmoreText] = useState(getReadmoreText(selectedLanguage))


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
    const [likeText, setLikeText] = useState(getLikeCommentText(selectedLanguage)[0])
    const [commentText, setCommentText] = useState(getLikeCommentText(selectedLanguage)[1])

    return (
        <li lang={blogLang}>
            <Title level={3} onClick={navigateToBlog} style={{ padding: '16px 24px 0px 24px', }}><Text style={mouseBlurStyle} >{props.title}</Text></Title>
            <Typography style={{ padding: '0px 24px 16px 24px' }} >
                <DateComp
                    dateFromNow={props.created_from_now}
                    dateLocal={props.created_at_local}
                    text={createText}
                />
                <LabelsComp labelList={props.labels} setBlogLanguage={setBlogLang}></LabelsComp>
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
                    >
                        <span lang={selectedLanguage}>
                            {readmoreText}
                        </span>
                    </Text>
                    <Space split={<Divider type="vertical" style={{ borderLeftColor: 'rgba(0,0,0,0.6)' }} />}>
                        <CommentComp
                            title={likeText}
                            slot={<HeartOutlined onClick={navigateToBlog} />}
                            text={<Text>{
                                props.reactions['+1']
                                + props.reactions.hooray
                                + props.reactions.laugh
                                + props.reactions.rocket
                                + props.reactions.heart}
                            </Text>} />
                        <CommentComp
                            title={commentText}
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