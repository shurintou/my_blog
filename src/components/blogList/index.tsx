import { useState, useEffect } from 'react'
import { List, Layout, BackTop } from 'antd'
import BlogListFooter from './footer'
import { searchBlogs } from '../../api/blogs'
import { BlogsItemRes, BlogsListItem, BlogSearchResponse } from '../../types/index'
import ListItem from './item'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import config from '../../config/config'

const BlogList = () => {
    const [data, setData] = useState<Array<BlogsListItem>>([])
    const [page, setPage] = useState(0)
    const [totalBlogsNum, setTotalBlogsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)

    useEffect(() => {
        setPage(1)
        function windowResizeFunc() {
            setPcRenderMode(window.innerWidth >= 768)
        }
        windowResizeFunc()
        window.addEventListener('resize', windowResizeFunc)
        return () => {
            window.removeEventListener('resize', windowResizeFunc)
        }
        /* eslint-disable-next-line */
    }, [])

    useEffect(() => {
        const { blogProps: { blogListItemCountPerPage } } = config
        const loadBlogListData = (page: number) => {
            searchBlogs({ page: page, per_page: blogListItemCountPerPage, query: '' })
                .then((res: BlogSearchResponse) => {
                    const resItemList = res.items
                    const newDataListLength = resItemList.length
                    setTotalBlogsNum(res.total_count)
                    let newDataList: Array<BlogsListItem> = resItemList.map((resItem: BlogsItemRes, index: number) => {
                        let newData: BlogsListItem = Object.assign(resItem, {
                            index: index + 1,
                            listLength: newDataListLength,
                            created_at_local: parseISODateStr(resItem.created_at),
                            updated_at_local: '', //blogListItem doesn't use this value so set it ''.
                            created_from_now: getDateFromNow(parseISODate(resItem.created_at)),
                            updated_from_now: '', //blogListItem doesn't use this value so set it ''.,
                        })
                        return newData
                    })
                    setData(newDataList)
                    window.scroll(0, 0)
                })
                .catch(() => { })
        }
        loadBlogListData(page)
    }, [page])

    return (
        <Layout>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={data}
                style={{
                    borderWidth: pcRenderMode ? '2px' : 'null',
                    borderStyle: pcRenderMode ? 'solid' : 'null',
                    borderColor: config.antdProps.borderColor,
                    borderRadius: pcRenderMode ? '6px' : '0px'
                }}
                renderItem={(item: BlogsListItem) => (
                    <ListItem key={item.id} {...item}></ListItem>
                )}
            >
            </List>
            <Layout style={{ marginTop: '1em' }}>
                <BlogListFooter total={totalBlogsNum} renderMode={pcRenderMode} changeHandler={setPage}></BlogListFooter>
            </Layout>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>

    )
}

const BlogListCompo = () => <BlogList />
export default BlogListCompo