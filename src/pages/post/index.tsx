import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from "react-router-dom"
import { Layout, Typography, Row, Col, BackTop, Space, Divider, Spin, Button } from 'antd'
import { CommentOutlined, LeftOutlined } from '@ant-design/icons'
import CommentComp from '../../components/body/post/comment'
import { getPostInfo } from '../../api/post'
import { PostsItemRes, PostListItem, } from '../../types/index'
import { parseISODate, parseISODateStr, getDateFromNow, getDateFromNowText } from '../../utils/formatter'
import Markdown from '../../components/common/markdown'
import Gitalk from '../../components//common/gitalk'
import DateComp from '../../components/body/post/date'
import LabelsComp from '../../components/common/labels'
import { debounce, doScrolling } from '../../utils/common'
import config from '../../config/config'
import Like from '../../components/body/post/like'
import { getLocalHtmlLang } from '../../utils/userAgent'
import { getLocalUser } from '../../utils/authentication'
import { useAppSelector } from '../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME, STORAGE_KEY } from '../../config/constant'

const { Title, Text } = Typography

const Post = () => {
    const navigate = useNavigate()
    const [searchParams,] = useSearchParams()
    const postIdStr = searchParams.get('id')
    const [hasData, setHasData] = useState(false)
    const [postContent, setPostContent] = useState<PostListItem>()
    const [likeCnt, setlikeCnt] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const [postLang, setPostLang] = useState(getLocalHtmlLang())
    const [gitalkShouldRender, setGitalkShouldRender] = useState(false)
    const backToPostList = () => {
        const backSearchParams = window.history.state?.usr?.backSearchParams || sessionStorage.getItem(STORAGE_KEY.backSearchParams)
        if (backSearchParams) {
            navigate(ROUTER_NAME.list + backSearchParams)
        }
        else {
            navigate(ROUTER_NAME.list + `?${ROUTER_NAME.props.page}=1`)
        }
    }

    const scrollToGitalk = () => {
        const gitalkEl: Element | null = document.getElementById('gitalk-container')
        if (gitalkEl) {
            doScrolling(gitalkEl, 500)
        }
    }

    const selectedLanguage = useAppSelector((state) => state.language.value)
    useEffect(() => {
        if (postIdStr) {
            const postId = parseInt(postIdStr)
            const sessionStoragePost = sessionStorage.getItem(STORAGE_KEY.postId + postId)
            setGitalkShouldRender(false)
            if (sessionStoragePost) {
                setPostContent(JSON.parse(sessionStoragePost)) // get post data from session storage if exists.
                setHasData(true)
                setGitalkShouldRender(true)
            }
            else {
                getPostInfo({ number: postId }).then((res: PostsItemRes) => {
                    const postData = Object.assign(res, {
                        created_at_local: parseISODateStr(res.created_at),
                        updated_at_local: parseISODateStr(res.updated_at),
                        created_from_now: getDateFromNow(parseISODate(res.created_at), selectedLanguage),
                        updated_from_now: getDateFromNow(parseISODate(res.updated_at), selectedLanguage),
                    })
                    setPostContent(postData)
                    setHasData(true)
                    setGitalkShouldRender(true)
                    sessionStorage.setItem(STORAGE_KEY.postId + postId, JSON.stringify(postData))
                })
            }
        }

        function windowResizeFunc() {
            setPcRenderMode(window.innerWidth >= 768)
        }
        const windowResizeDebounceFunc = debounce(windowResizeFunc, config.eventProps.resizeDebounceDelay)
        windowResizeFunc()
        window.addEventListener('resize', windowResizeDebounceFunc)
        return () => {
            window.removeEventListener('resize', windowResizeDebounceFunc)
        }
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    const [createText, setCreateText] = useState(getDateFromNowText(selectedLanguage, true))
    const [updateText, setUpdateText] = useState(getDateFromNowText(selectedLanguage, false))
    useEffect(() => {
        setCreateText(getDateFromNowText(selectedLanguage, true))
        setUpdateText(getDateFromNowText(selectedLanguage, false))
        setLikeText(getLikeCommentText(selectedLanguage)![0])
        setCommentText(getLikeCommentText(selectedLanguage)![1])
        /* eslint-disable-next-line */
    }, [selectedLanguage])

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
    const [likeText, setLikeText] = useState(getLikeCommentText(selectedLanguage)![0])
    const [commentText, setCommentText] = useState(getLikeCommentText(selectedLanguage)![1])


    return (
        <Layout lang={postLang}>
            <Row>
                <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                </Col>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                    {hasData
                        ?
                        <Layout>
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
                                >
                                    <Button
                                        style={{
                                            backgroundColor: config.antdProps.borderColor,
                                            verticalAlign: '0px'
                                        }}
                                        icon={<LeftOutlined />}
                                        onClick={backToPostList}
                                    ></Button>
                                    {postContent?.title}</Title>
                            </Layout>
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
                                            dateFromNow={postContent ? postContent.created_from_now : ''}
                                            dateLocal={postContent ? postContent.created_at_local : ''}
                                            text={createText}
                                        />
                                    </Col>
                                    <Col span={1} offset={7}>
                                    </Col>
                                </Row>
                                {postContent && <LabelsComp labelList={postContent?.labels} setPostLanguage={setPostLang}></LabelsComp>}
                                <Divider style={{ margin: '0em 0em 1em 0em' }} />
                                <Markdown postText={postContent?.body} />
                                {
                                    postContent?.updated_at !== postContent?.created_at &&
                                    <DateComp
                                        dateFromNow={postContent ? postContent.updated_from_now : ''}
                                        dateLocal={postContent ? postContent.updated_at_local : ''}
                                        text={updateText}
                                    />
                                }
                                <Space size="small" split={<Divider type="vertical" style={{ borderLeftColor: 'rgba(0,0,0,0.6)' }} />}>
                                    <CommentComp
                                        title={likeText}
                                        slot={
                                            <Like number={postContent ? postContent?.number : 0} likeHandler={setlikeCnt}></Like>
                                        }
                                        text={
                                            !postContent ? <Spin /> :
                                                <Text>
                                                    {
                                                        postContent.reactions['+1']
                                                        + postContent.reactions.hooray
                                                        + postContent.reactions.laugh
                                                        + postContent.reactions.rocket
                                                        + (getLocalUser()?.id === 0 ? postContent.reactions.heart : likeCnt)
                                                    }
                                                </Text>
                                        }
                                    />
                                    <CommentComp
                                        title={commentText}
                                        slot={<CommentOutlined onClick={scrollToGitalk} />}
                                        text={!postContent ? <Spin /> : <Text>{postContent.comments}</Text>}
                                    />
                                </Space>
                            </Layout>
                        </Layout>
                        :
                        <Layout style={{ marginTop: '5em' }}>
                            <Spin
                                size='large'
                                tip={
                                    selectedLanguage === ZH_LANGUAGE.key ?
                                        ZH_LANGUAGE.loading
                                        :
                                        selectedLanguage === JA_LANGUAGE.key ?
                                            JA_LANGUAGE.loading :
                                            EN_LANGUAGE.loading
                                }
                            />
                        </Layout>
                    }
                    <Layout style={{ padding: pcRenderMode ? '0em' : '0.5em' }}>
                        {postIdStr && <Gitalk postId={parseInt(postIdStr)} shouldRender={gitalkShouldRender} />}
                    </Layout>
                </Col>
                <Col xs={0} sm={0} md={3} lg={3} xl={3}>
                </Col>
            </Row>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>
    )
}

const PostModule = () => <Post></Post>

export default PostModule