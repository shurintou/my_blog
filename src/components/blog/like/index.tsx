import { useState, useEffect } from 'react'
import { LikeCompProps, BlogLikeReactionRes } from '../../../types/index'
import { Layout, message } from 'antd'
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons'
import { getReactions, postLike, deleteLike } from '../../../api/blogs'
import { getLocalUser } from '../../../utils/authentication'

function LikeCompo<T>(props: LikeCompProps<T>) {
    const [userLikeId, setUserLikeId] = useState(0)
    const reactionType = '+1'

    useEffect(() => {
        getReactions({
            issue_number: props.number,
            content: reactionType,
            per_page: 100,
        }).then((res: Array<BlogLikeReactionRes>) => {
            if (res.length > 0) {
                const userLikeReaction = res.find(reaction => reaction.content === reactionType && reaction.user.id === getLocalUser().id && reaction.user.login === getLocalUser().login)
                if (userLikeReaction !== undefined) {
                    setUserLikeId(userLikeReaction.id)
                }
            }
        })
        /* eslint-disable-next-line */
    }, [])

    const errorHandler = () => {
        message.warning('Please login your github account first.')
    }

    function likeClickHandler() {
        if (userLikeId !== 0) {
            deleteLike({ number: props.number, id: userLikeId })
                .then(() => {
                    setUserLikeId(0)
                    props.handlerClick(0)
                })
                .catch(errorHandler)
        } else {
            postLike({ number: props.number, content: reactionType })
                .then((res: BlogLikeReactionRes) => {
                    setUserLikeId(res.id)
                    props.handlerClick(1)
                })
                .catch(errorHandler)
        }
    }

    return (
        <Layout style={{ cursor: 'pointer' }} onClick={likeClickHandler}>
            {userLikeId !== 0 ? <LikeTwoTone /> : <LikeOutlined />}
        </Layout>
    )
}

export default LikeCompo

