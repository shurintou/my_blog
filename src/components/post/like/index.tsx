import { useState, useEffect } from 'react'
import { LikeCompProps, BlogLikeReactionResByGraphQl, BlogLikeReactionByGraphQl } from '../../../types/index'
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons'
import { getReactionsByGraphQl, postLike, deleteLike } from '../../../api/like'
import { getLocalUser } from '../../../utils/authentication'

function LikeCompo<T>(props: LikeCompProps<T>) {
    const [userLikeId, setUserLikeId] = useState(0)
    const reactionType = 'heart'
    const getReactionsReq = {
        issue_number: props.number,
        content: reactionType,
        per_page: 100,
    }

    useEffect(() => {
        let failTolerantTime = 15
        let intervalId: NodeJS.Timeout
        if (process.env.NODE_ENV === 'production') {
            intervalId = setInterval(() => {
                failTolerantTime--
                getReactionsByGraphQl(getReactionsReq)
                    .then(getReactionsHandler)
                    .then(() => clearInterval(intervalId))
                    .catch(e => { })
                if (failTolerantTime <= 0) {
                    clearInterval(intervalId)
                }
            }, 1000)
        }
        return () => clearInterval(intervalId)
        /* eslint-disable-next-line */
    }, [])

    const getReactionsHandler = (res: BlogLikeReactionResByGraphQl) => {
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
        if (userLikeId !== 0) {
            deleteLike({ number: props.number, id: userLikeId })
                .then(successHandler)
        } else {
            postLike({ number: props.number, content: reactionType })
                .then(successHandler)
        }
    }

    return (
        <span style={{ cursor: 'pointer' }} onClick={likeClickHandler}>
            {userLikeId !== 0 ? <HeartTwoTone /> : <HeartOutlined />}
        </span>
    )
}

export default LikeCompo

