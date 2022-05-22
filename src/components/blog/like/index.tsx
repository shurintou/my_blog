import { useState, useEffect } from 'react'
import { LikeCompProps, BlogLikeReactionResByGraphQl, BlogLikeReactionByGraphQl } from '../../../types/index'
import { Layout } from 'antd'
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons'
import { getReactionsByGraphQl, postLike, deleteLike } from '../../../api/like'
import { getLocalUser } from '../../../utils/authentication'

function LikeCompo<T>(props: LikeCompProps<T>) {
    const [userLikeId, setUserLikeId] = useState(0)
    const [clickable, setClickable] = useState(false)
    const reactionType = 'heart'
    const getReactionsReq = {
        issue_number: props.number,
        content: reactionType,
        per_page: 100,
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setClickable(false)
            getReactionsByGraphQl(getReactionsReq)
                .then(getReactionsHandler)
                .then(() => clearInterval(intervalId))
                .catch(() => setClickable(true))
        }, 1000)
        return () => clearInterval(intervalId)
        /* eslint-disable-next-line */
    }, [])

    const getReactionsHandler = (res: BlogLikeReactionResByGraphQl) => {
        setClickable(true)
        const likeReactions = res.data.repository.issue.reactions.edges
        const likeNum = likeReactions.length
        props.likeHandler(likeNum)
        if (likeNum > 0) {
            const userLikeReaction: BlogLikeReactionByGraphQl | undefined = likeReactions.find(reaction => reaction.node.user.databaseId === getLocalUser().id && reaction.node.user.login === getLocalUser().login)
            if (userLikeReaction !== undefined) {
                setUserLikeId(userLikeReaction.node.databaseId)
            }
            else {
                setUserLikeId(0)
            }
        }
        else {
            setUserLikeId(0)
        }
    }


    const successHandler = () => {
        getReactionsByGraphQl(getReactionsReq)
            .then(getReactionsHandler)
    }

    function likeClickHandler() {
        if (!clickable) {
            return
        }
        setClickable(false)
        if (userLikeId !== 0) {
            deleteLike({ number: props.number, id: userLikeId })
                .then(successHandler)
        } else {
            postLike({ number: props.number, content: reactionType })
                .then(successHandler)
        }
    }

    return (
        <Layout style={{ cursor: 'pointer' }} onClick={likeClickHandler}>
            {userLikeId !== 0 ? <HeartTwoTone /> : <HeartOutlined />}
        </Layout>
    )
}

export default LikeCompo

