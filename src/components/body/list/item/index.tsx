import React, { useState, useEffect } from 'react'
import { Divider, Typography, Layout, Space } from 'antd'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import { PostListItem } from '../../../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../../post/date/'
import CommentComp from '../../post/comment/'
import LabelsComp from '../../../common/labels'
import Markdown from '../../../common/markdown'
import { getLocalHtmlLang } from '../../../../utils/userAgent'
import config from '../../../../config/config'
import { getDateFromNowText } from '../../../../utils/formatter'
import { useAppSelector } from '../../../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME, STORAGE_KEY } from '../../../../config/constant'


const { Title, Text } = Typography

const PostListItemComp: React.FC<PostListItem> = (props) => {
    const navigate = useNavigate()
    const navigateToPost = () => {
        if (props.clickable) { // if the search bar is opening, the item will not be clickable.
            const backSearchParams = document.location.search
            navigate(`${ROUTER_NAME.post}?id=${props.number}`, { state: { backSearchParams: backSearchParams } })
            /* to fix the bug that when redirected after github login, the back button in post title not work */
            sessionStorage.setItem(STORAGE_KEY.backSearchParams, backSearchParams)
        }
    }
    const mouseBlurStyle = { cursor: 'pointer' }
    const [isLastItem, setIsLastItem] = useState(false)
    const [postLang, setPostLang] = useState(getLocalHtmlLang())

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
        <li lang={postLang}>
            <Title level={3} onClick={navigateToPost} style={{ padding: '16px 24px 0px 24px', }}><Text style={mouseBlurStyle} >{props.title}</Text></Title>
            <Layout style={{ padding: '0px 24px 16px 24px' }} >
                <DateComp
                    dateFromNow={props.created_from_now}
                    dateLocal={props.created_at_local}
                    text={createText}
                />
                <LabelsComp labelList={props.labels} setPostLanguage={setPostLang}></LabelsComp>
                <Divider style={{ marginTop: '0' }} />
                <div
                    onClick={navigateToPost}
                    style={mouseBlurStyle}
                >
                    <Layout
                        style={{
                            WebkitLineClamp: config.postProps.previewLine,
                            lineClamp: config.postProps.previewLine,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: '2em',
                            maxHeight: 5 * (config.postProps.previewLine) + 'em',
                            wordWrap: 'break-word',
                        }}>
                        <Markdown postText={props.body}></Markdown>
                    </Layout>
                </div>
                <Layout style={{ marginBottom: '1em' }} >
                    <Text
                        onClick={navigateToPost}
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
                            slot={<HeartOutlined onClick={navigateToPost} />}
                            text={<Text>{
                                props.reactions['+1']
                                + props.reactions.hooray
                                + props.reactions.laugh
                                + props.reactions.rocket
                                + props.reactions.heart}
                            </Text>} />
                        <CommentComp
                            title={commentText}
                            slot={<CommentOutlined onClick={navigateToPost} />}
                            text={<Text>{props.comments
                            }
                            </Text>} />
                    </Space>
                </Layout>
            </Layout>
            {!isLastItem && <Divider style={{ borderTopColor: 'rgba(0,0,0,0.2)', margin: 0 }} />}
        </li>
    )
}

const listItemModule = (props: PostListItem) => <PostListItemComp {...props} />

export default listItemModule