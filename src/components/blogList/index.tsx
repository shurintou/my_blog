import { useState, useEffect } from 'react'
import { List, Skeleton, Divider, } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { getBlogsList } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem } from '../../types/index'
import ListItem from './item'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import config from '../../config/config'

const InfiniteBlogsList = () => {
    const [loading, setLoading] = useState(false)
    const [hasmore, setHasMore] = useState(true)
    const [data, setData] = useState<Array<BlogsListItem>>([])
    const [page, setPage] = useState(1)
    const { blogProps: { blogListItemCountPerPage } } = config

    const loadMoreData = () => {
        if (loading) {
            return
        }
        setPage(page + 1)
        setLoading(true)
        getBlogsList({ page: page, per_page: blogListItemCountPerPage })
            .then((res: Array<BlogsItemRes>) => {
                const newListLength = data.length + res.length - 1
                let newData: Array<BlogsListItem> = res.map((resItem: BlogsItemRes, index: number) => {
                    let newData: BlogsListItem = Object.assign(resItem, {
                        index: data.length + index,
                        listLength: newListLength,
                        created_at_local: parseISODateStr(resItem.created_at),
                        updated_at_local: '', //blogListItem doesn't use this value so set it ''.
                        created_from_now: getDateFromNow(parseISODate(resItem.created_at)),
                        updated_from_now: '', //blogListItem doesn't use this value so set it ''.,
                    })
                    return newData
                })
                data.forEach(item => { //reset the listLengh prop of each item in data lists. 
                    item.listLength = newListLength
                })
                setHasMore(newData.length >= blogListItemCountPerPage)
                setData([...data, ...newData])
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        loadMoreData()
        /* eslint-disable-next-line */
    }, [])

    return (
        <InfiniteScroll
            dataLength={data.length}
            next={loadMoreData}
            hasMore={hasmore}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={data.length > blogListItemCountPerPage && <Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget="scrollableDiv"
        >
            <List
                itemLayout="vertical"
                size="large"
                dataSource={data}
                style={{ border: window.innerWidth >= 768 ? '2px solid' : 'null', borderColor: config.antdProps.borderColor, borderRadius: '6px' }}
                renderItem={(item: BlogsListItem) => (
                    <List.Item
                        key={item.id}
                    >
                        <ListItem {...item}></ListItem>
                    </List.Item>
                )}
            />
        </InfiniteScroll>
    )
}

const infiniteBlogsListModule = () => <InfiniteBlogsList />
export default infiniteBlogsListModule