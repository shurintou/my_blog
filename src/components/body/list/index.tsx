import { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Layout, BackTop } from 'antd'
import BlogListPagination from './pagination'
import { searchBlogs } from '../../../api/blogs'
import { debounce } from '../../../utils/common'
import { BlogsItemRes, BlogsListItem, BlogSearchResponse, BlogSearchRequestParam } from '../../../types/index'
import ListItem from './item'
import { parseISODate, parseISODateStr, getDateFromNow } from '../../../utils/formatter'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME } from '../../../config/constant'

const BlogList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<Array<BlogsListItem>>([])
    const [totalBlogsNum, setTotalBlogsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const [loading, setLoading] = useState(true)
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
        setLoading(true)
        let languageQuery: string
        switch (selectedLanguage) {
            case ZH_LANGUAGE.key:
                languageQuery = ZH_LANGUAGE.upperCase
                break
            case JA_LANGUAGE.key:
                languageQuery = JA_LANGUAGE.upperCase
                break
            default:
                languageQuery = EN_LANGUAGE.upperCase
        }
        const queryStr: string = 'label:language:' + languageQuery
        searchBlogs({ page: searchBlogListParams.page, per_page: blogListItemCountPerPage, query: queryStr })
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
                setLoading(false)
            })
            .catch(() => { })
    }

    useEffect(() => {
        loadBlogListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1") })
        /* eslint-disable-next-line */
    }, [searchParams])

    useEffect(() => {
        loadBlogListData({ page: 1 })
        setSearchParams({ [ROUTER_NAME.props.page]: "1" })
        /* eslint-disable-next-line */
    }, [selectedLanguage])

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
                    borderWidth: pcRenderMode && !loading ? '2px' : 'null',
                    borderStyle: pcRenderMode && !loading ? 'solid' : 'null',
                    borderColor: config.antdProps.borderColor,
                    borderRadius: pcRenderMode && !loading ? '6px' : '0px',
                    height: loading ? '100%' : '',
                    paddingTop: loading && !loading ? '3em' : '',
                }}
                renderItem={(item: BlogsListItem) => (
                    <ListItem key={item.id} {...item}></ListItem>
                )}
                loading={{
                    spinning: loading,
                    size: 'large',
                    tip:
                        selectedLanguage === ZH_LANGUAGE.key ?
                            ZH_LANGUAGE.loading
                            :
                            selectedLanguage === JA_LANGUAGE.key ?
                                JA_LANGUAGE.loading :
                                EN_LANGUAGE.loading
                }}
            >
            </List>
            <Layout style={{
                marginTop: '1em',
                position: 'sticky',
                bottom: 0,
            }}>
                <BlogListPagination total={totalBlogsNum} renderMode={pcRenderMode}></BlogListPagination>
            </Layout>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>

    )
}

const BlogListCompo = () => <BlogList />
export default BlogListCompo