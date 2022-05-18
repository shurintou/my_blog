import { useState, useEffect } from 'react'
import { LikeCompProps, BlogLikeReactionRes } from '../../../types/index'
import { Layout } from 'antd'
import { LikeOutlined, LikeTwoTone } from '@ant-design/icons'
import { getReactions, postLike, deleteLike } from '../../../api/blogs'
import { getLocalUser } from '../../../utils/authentication'

function LikeCompo<T>(props: LikeCompProps<T>) {
    const [userLikeId, setUserLikeId] = useState(0)

    useEffect(() => {
        getReactions({
            issue_number: props.number,
            content: '+1',
            per_page: 100,
        }).then((res: Array<BlogLikeReactionRes>) => {
            const userLikeReaction = res.find(item => item.user.id === getLocalUser().id && item.user.login === getLocalUser().login)
            userLikeReaction && setUserLikeId(userLikeReaction.id)
        })
        /* eslint-disable-next-line */
    }, [])

    function likeClickHandler() {
        if (userLikeId !== 0) {
            deleteLike({ number: props.number, id: userLikeId })
                .then(() => {
                    setUserLikeId(0)
                    props.handlerClick(-1)
                })
        } else {
            postLike({ number: props.number, content: '+1' })
                .then((res: BlogLikeReactionRes) => {
                    setUserLikeId(res.id)
                    props.handlerClick(1)
                })
        }
    }

    return (
        <Layout style={{ cursor: 'pointer' }} onClick={likeClickHandler}>
            {userLikeId ? <LikeTwoTone /> : <LikeOutlined />}
        </Layout>
    )
}

export default LikeCompo

