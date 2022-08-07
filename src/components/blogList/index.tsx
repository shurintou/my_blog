import { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Layout, BackTop } from 'antd'
import BlogListFooter from './footer'
import { searchBlogs } from '../../api/blogs'
import { debounce } from '../../utils/common'
import { BlogsItemRes, BlogsListItem, BlogSearchResponse, BlogSearchRequestParam } from '../../types/index'
import ListItem from './item'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../utils/formatter'
import config from '../../config/config'
import { useAppSelector } from '../../redux/hooks'

const BlogList = () => {
    const [searchParams,] = useSearchParams()
    const [data, setData] = useState<Array<BlogsListItem>>([])
    const [totalBlogsNum, setTotalBlogsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const selectedLanguage = useAppSelector((state) => state.language.value)

    useEffect(() => {
        function windowResizeFunc() {
            setPcRenderMode(window.innerWidth >= 768)
        }
        const windowResizeDebounceFunc = debounce(windowResizeFunc, config.eventProps.resizeDebounceDelay)
        windowResizeFunc()
        window.addEventListener('resize', windowResizeDebounceFunc)
        return () => {
            window.removeEventListener('resize', windowResizeDebounceFunc)
        }
    }, [])

    const { blogProps: { blogListItemCountPerPage } } = config
    const loadBlogListData = (searchBlogListParams: BlogSearchRequestParam) => {
        searchBlogs({ page: searchBlogListParams.page, per_page: blogListItemCountPerPage, query: '' })
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
                        created_from_now: getDateFromNow(parseISODate(resItem.created_at), selectedLanguage),
                        updated_from_now: '', //blogListItem doesn't use this value so set it ''.,
                    })
                    return newData
                })
                setData(newDataList)
            })
            .catch(() => { })
    }

    useEffect(() => {
        loadBlogListData({ page: parseInt(searchParams.get('page') || "1") })
        /* eslint-disable-next-line */
    }, [searchParams, selectedLanguage])

    useEffect(() => {
        window.scroll(0, 0)
    }, [data])

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
            <Layout style={{
                marginTop: '1em',
                position: 'sticky',
                bottom: 0,
            }}>
                <BlogListFooter total={totalBlogsNum} renderMode={pcRenderMode}></BlogListFooter>
            </Layout>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>

    )
}

const BlogListCompo = () => <BlogList />
export default BlogListCompo