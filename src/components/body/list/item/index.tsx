import React, { useState, useEffect } from 'react'
import { Divider, Typography, Layout, Space } from 'antd'
import { HeartOutlined, CommentOutlined } from '@ant-design/icons'
import { I18NObjectKey, PostListItem } from '../../../../types/index'
import { useNavigate } from "react-router-dom"
import DateComp from '../../post/date/'
import CommentComp from '../../post/comment/'
import LabelsComp from '../../../common/labels'
import Markdown from '../../../common/markdown'
import { getLocalHtmlLang } from '../../../../utils/userAgent'
import config from '../../../../config/config'
import { getDateFromNowText } from '../../../../utils/formatter'
import { useAppSelector } from '../../../../redux/hooks'
import { ROUTER_NAME, I18N } from '../../../../config/constant'


const { Title, Text } = Typography

const PostListItemComp: React.FC<PostListItem> = (props) => {
    const navigate = useNavigate()
    const navigateToPost = () => {
        if (props.clickable) { // if the search bar is opening, the item will not be clickable.
            const historyBackPath = document.location.pathname + document.location.search
            navigate(`${ROUTER_NAME.post}?id=${props.number}`, { state: { historyBackPath: historyBackPath } })
        }
    }
    const mouseBlurStyle = { cursor: 'pointer' }
    const [postLang, setPostLang] = useState(getLocalHtmlLang())



    const selectedLanguage = useAppSelector((state) => state.language.value)
    const [createText, setCreateText] = useState(getDateFromNowText(selectedLanguage, true))
    useEffect(() => {
        setCreateText(getDateFromNowText(selectedLanguage, true))
        setReadmoreText(getReadmoreText(selectedLanguage))
        setLikeText(getLikeCommentText(selectedLanguage)[0])
        setCommentText(getLikeCommentText(selectedLanguage)[1])
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    const getReadmoreText = (lang: string) => { return I18N[lang as I18NObjectKey].readmoreText }
    const [readmoreText, setReadmoreText] = useState(getReadmoreText(selectedLanguage))


    const getLikeCommentText = (lang: string) => { return I18N[lang as I18NObjectKey].commentText }
    const [likeText, setLikeText] = useState(getLikeCommentText(selectedLanguage)[0])
    const [commentText, setCommentText] = useState(getLikeCommentText(selectedLanguage)[1])

    const listItemBackgroundCssObj = { backgroundColor: config.antdProps.listItemBackgroundColor }
    return (
        <li lang={postLang} style={{ ...listItemBackgroundCssObj, ...props.layoutStyle }}>
            <Title level={3} onClick={navigateToPost} style={{ padding: '16px 24px 0px 24px' }}><Text style={{ ...mouseBlurStyle, color: config.antdProps.themeColor }} >{props.title}</Text></Title>
            <Layout style={{ padding: '0px 24px 16px 24px', ...listItemBackgroundCssObj }} >
                <DateComp
                    dateFromNow={props.created_from_now}
                    dateLocal={props.created_at_local}
                    text={createText}
                />
                <LabelsComp labelList={props.labels} setPostLanguage={setPostLang} layoutStyle={{ ...listItemBackgroundCssObj }}></LabelsComp>
                <Divider style={{ marginTop: '0' }} />
                <div
                    onClick={navigateToPost}
                    style={mouseBlurStyle}
                >
                    <Layout
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            lineHeight: '2em',
                            wordWrap: 'break-word',
                        }}>
                        <Markdown postText={props.body} layoutStyle={listItemBackgroundCssObj}></Markdown>
                    </Layout>
                </div>
                <Layout style={{ marginBottom: '1em', ...listItemBackgroundCssObj }} >
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
                            layoutStyle={listItemBackgroundCssObj}
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
                            layoutStyle={listItemBackgroundCssObj}
                            title={commentText}
                            slot={<CommentOutlined onClick={navigateToPost} />}
                            text={<Text>{props.comments
                            }
                            </Text>} />
                    </Space>
                </Layout>
            </Layout>
        </li>
    )
}

const listItemModule = (props: PostListItem) => <PostListItemComp {...props} />

export default listItemModule