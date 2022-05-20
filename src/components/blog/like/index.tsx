import { useState, useLayoutEffect } from 'react'
import { LikeCompProps, BlogLikeReactionRes } from '../../../types/index'
import { Layout } from 'antd'
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons'
import { getReactions, postLike, deleteLike } from '../../../api/blogs'
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

    useLayoutEffect(() => {
        getReactions(getReactionsReq)
            .then(getReactionsHandler)
        /* eslint-disable-next-line */
    }, [])

    const getReactionsHandler = (res: Array<BlogLikeReactionRes>) => {
        setClickable(true)
        props.likeHandler(res.length)
        if (res.length > 0) {
            const userLikeReaction: BlogLikeReactionRes | undefined = res.find(reaction => reaction.user.id === getLocalUser().id && reaction.user.login === getLocalUser().login)
            if (userLikeReaction !== undefined) {
                setUserLikeId(userLikeReaction.id)
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
        getReactions(getReactionsReq)
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

