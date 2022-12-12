import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Layout, BackTop } from 'antd'
import PostListPagination from './pagination'
import { searchPosts } from '../../../api/post'
import { debounce } from '../../../utils/common'
import { PostsItemRes, PostListItem, PostSearchResponse, PostSearchRequestParam, Label } from '../../../types/index'
import ListItem from './item'
import FilterBar from './filterBar'
import { parseISODate, parseISODateStr, getDateFromNow, transferSelectedFilterLabelToQueryString, transferSelectedFilterLabelId } from '../../../utils/formatter'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME, SYMBOL, STORAGE_KEY } from '../../../config/constant'

const PostList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<Array<PostListItem>>([])
    const [totalPostsNum, setTotalPostsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const itemClickableRef = useRef(true)
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

    const { postProps: { postListItemCountPerPage } } = config
    const loadPostListData = (searchPostListParams: PostSearchRequestParam) => {
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
        searchPosts({ page: searchPostListParams.page, per_page: postListItemCountPerPage, query: languageQueryStr + searchPostListParams.query })
            .then((res: PostSearchResponse) => {
                const resItemList = res.items
                const newDataListLength = resItemList.length
                setTotalPostsNum(res.total_count)
                let newDataList: Array<PostListItem> = resItemList.map((resItem: PostsItemRes, index: number) => {
                    let newData: PostListItem = Object.assign(resItem, {
                        index: index + 1,
                        listLength: newDataListLength,
                        created_at_local: parseISODateStr(resItem.created_at),
                        updated_at_local: '', //postListItem doesn't use this value so set it ''.
                        created_from_now: getDateFromNow(parseISODate(resItem.created_at), selectedLanguage),
                        updated_from_now: '', //postListItem doesn't use this value so set it ''.,
                        clickable: itemClickableRef.current, // use Ref to avoid clickable to be set as false initially. 
                    })
                    return newData
                })
                setData(newDataList)
                setLoading(false)
            })
            .catch(() => { })
    }

    itemClickableRef.current = true
    const setItemClickableRef = (flg: boolean) => {
        setTimeout(() => {
            itemClickableRef.current = flg
            const newDataList = data.filter(() => true) //create a new Array otherwise the React will not re-render.
            newDataList.forEach(item => item.clickable = flg)
            setData(newDataList)
        }, 200) // 200 delay to avoid the click action still work even the clickable flg turn to be false.
    }

    useEffect(() => {
        const labelIds = searchParams.get(ROUTER_NAME.props.label)?.split(SYMBOL.labelIdSpliter)
        if (labelIds) {
            const filterLabelListStr = sessionStorage.getItem(STORAGE_KEY.filterLabelList)
            if (filterLabelListStr) {
                const filterLabelList = JSON.parse(filterLabelListStr)
                const labelList = filterLabelList.filter((label: Label) => labelIds.some(labelId => parseInt(labelId) === label.id))
                loadPostListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"), query: transferSelectedFilterLabelToQueryString(labelList) })

            }
        }
        else {
            loadPostListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"), query: '' })
        }
        /* eslint-disable-next-line */
    }, [searchParams])

    useEffect(() => {
        const labelIds = searchParams.get(ROUTER_NAME.props.label)?.split(SYMBOL.labelIdSpliter)
        // to solve the router push state twice issue, check the selectedFilterLabel and searchParams, if they have the same labels, not to setSearchParams
        if (
            (labelIds === undefined && selectedFilterLabel.length !== 0)
            ||
            (labelIds && labelIds.length !== selectedFilterLabel.length)
            ||
            (labelIds && labelIds.some(labelId => !selectedFilterLabel.some(selectedLabel => selectedLabel.id === parseInt(labelId))))
            ||
            selectedFilterLabel.some(selectedLabel => !(labelIds && labelIds.some(labelId => selectedLabel.id === parseInt(labelId))))
        ) {
            let routerObj = { [ROUTER_NAME.props.page]: "1" }
            const selectedFilterLabelStr = transferSelectedFilterLabelId(selectedFilterLabel)
            if (selectedFilterLabelStr.length > 0) {
                routerObj[ROUTER_NAME.props.label] = selectedFilterLabelStr // if there arent' any label being selected, not show label prop in url.
            }
            setSearchParams(routerObj)
        }
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
                    minHeight: '60vh',/* to solve the issue that select bar's drop down cannot be pulled up by clicking somewhere on mobile end*/
                }}
                renderItem={(item: PostListItem) => (
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
                locale={{
                    emptyText: selectedLanguage === ZH_LANGUAGE.key ?
                        ZH_LANGUAGE.emptyText
                        :
                        selectedLanguage === JA_LANGUAGE.key ?
                            JA_LANGUAGE.emptyText :
                            EN_LANGUAGE.emptyText
                }}
            >
            </List>
            <Layout style={{
                marginTop: '1em',
                position: 'sticky',
                bottom: 0,
            }}>
                <PostListPagination total={totalPostsNum} renderMode={pcRenderMode}></PostListPagination>
            </Layout>
            <BackTop target={() => document} />{/* default target value '()=> window' is not work. */}
        </Layout>

    )
}

const PostListCompo = () => <PostList />
export default PostListCompo