import { useState, useEffect } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Layout, BackTop } from 'antd'
import BlogListPagination from './pagination'
import { searchBlogs } from '../../../api/blogs'
import { debounce } from '../../../utils/common'
import { BlogsItemRes, BlogsListItem, BlogSearchResponse, BlogSearchRequestParam } from '../../../types/index'
import ListItem from './item'
import FilterBar from './filterBar'
import { parseISODate, parseISODateStr, getDateFromNow, transferLabelWithSpaceByURLEncode } from '../../../utils/formatter'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME } from '../../../config/constant'

const BlogList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<Array<BlogsListItem>>([])
    const [totalBlogsNum, setTotalBlogsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const [itemClickable, setItemClickable] = useState(true)
    const [loading, setLoading] = useState(true)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)

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
        const languageQueryStr: string = 'label:language:' + languageQuery
        let categoryQueryStr: string = ''
        selectedFilterLabel.forEach(category => categoryQueryStr += '+label:' + transferLabelWithSpaceByURLEncode(category.name))
        searchBlogs({ page: searchBlogListParams.page, per_page: blogListItemCountPerPage, query: languageQueryStr + categoryQueryStr })
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
                        clickable: itemClickable,
                    })
                    return newData
                })
                setData(newDataList)
                setLoading(false)
            })
            .catch(() => { })
    }

    const setItemClickableRef = (flg: boolean) => {
        setTimeout(() => {
            setItemClickable(flg)
            const newDataList = data
            newDataList.forEach(item => item.clickable = flg)
            setData(newDataList)
        }, 200) // 200 delay to avoid the click action still work even the clickable flg turn to be false.
    }

    useEffect(() => {
        loadBlogListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1") })
        /* eslint-disable-next-line */
    }, [searchParams])

    useEffect(() => {
        loadBlogListData({ page: 1 })
        setSearchParams({ [ROUTER_NAME.props.page]: "1" })
        /* eslint-disable-next-line */
    }, [selectedLanguage, selectedFilterLabel])

    useEffect(() => {
        window.scroll(0, 0)
    }, [data])

    return (
        <Layout>
            <FilterBar isLoading={loading} renderMode={pcRenderMode} itemClickableHandler={setItemClickableRef}></FilterBar>
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