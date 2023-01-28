import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Layout, BackTop, Result } from 'antd'
import PostListPagination from './pagination/'
import { searchPosts } from '../../../api/post'
import { debounce } from '../../../utils/common'
import { PostsItemRes, PostListItem, PostSearchResponse, PostSearchRequestParam, Label } from '../../../types/index'
import ListItem from './item/'
import FilterBar from './filterBar/'
import { parseISODate, parseISODateStr, getDateFromNow, transferSelectedFilterLabelToQueryString, transferSearchParamsStr, transferContentLanguageToQueryString } from '../../../utils/formatter'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { getLocalHtmlLang } from '../../../utils/userAgent'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME, SYMBOL, STORAGE_KEY } from '../../../config/constant'
import { AxiosError } from 'axios'

const PostList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [data, setData] = useState<Array<PostListItem>>([])
    const [totalPostsNum, setTotalPostsNum] = useState(0)
    const [pcRenderMode, setPcRenderMode] = useState(true)
    const itemClickableRef = useRef(true)
    const [loading, setLoading] = useState(true)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)
    const checkedContentLanguage = useAppSelector((state) => state.contentLanguage.value)
    const [showError, setShowError] = useState(false)
    const [responseStatus, setResponseStatus] = useState(200)

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
        searchPosts({ page: searchPostListParams.page, per_page: postListItemCountPerPage, query: searchPostListParams.query })
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
                setShowError(false)
            })
            .catch((e: AxiosError) => {
                setShowError(true)
                setResponseStatus(e?.request?.status)
            })
            .finally(() => { setLoading(false) })
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
        const labelIds = searchParams.get(ROUTER_NAME.props.label)?.split(SYMBOL.searchParamsSpliter)
        const contentLanguageKeys = searchParams.get(ROUTER_NAME.props.language)?.split(SYMBOL.searchParamsSpliter)
        if (!contentLanguageKeys) return // to fix the duplicated request when redirect to the list page.
        let contentLanguageQuery = ''
        if (contentLanguageKeys && contentLanguageKeys.length > 0) {
            contentLanguageQuery = transferContentLanguageToQueryString(contentLanguageKeys)
        }
        else if (checkedContentLanguage.length > 0) {
            contentLanguageQuery = transferContentLanguageToQueryString(checkedContentLanguage)
        }
        else {
            const localStorageContentLanguageListStr = localStorage.getItem(STORAGE_KEY.contentLanguageList)
            if (localStorageContentLanguageListStr) {
                contentLanguageQuery = transferContentLanguageToQueryString(JSON.parse(localStorageContentLanguageListStr))
            }
            else {
                contentLanguageQuery = transferContentLanguageToQueryString([getLocalHtmlLang()])
            }
        }
        if (labelIds) {
            const filterLabelListStr = sessionStorage.getItem(STORAGE_KEY.filterLabelList)
            if (filterLabelListStr) {
                const filterLabelList = JSON.parse(filterLabelListStr)
                const labelList = filterLabelList.filter((label: Label) => labelIds.some(labelId => parseInt(labelId) === label.id))
                loadPostListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"), query: contentLanguageQuery + transferSelectedFilterLabelToQueryString(labelList) })

            }
        }
        else {
            loadPostListData({ page: parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"), query: contentLanguageQuery })
        }
        /* eslint-disable-next-line */
    }, [searchParams])

    useEffect(() => {
        const labelIds = searchParams.get(ROUTER_NAME.props.label)?.split(SYMBOL.searchParamsSpliter)
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
            const selectedFilterLabelStr = transferSearchParamsStr(selectedFilterLabel.map(label => label.id))
            if (selectedFilterLabelStr.length > 0) {
                routerObj[ROUTER_NAME.props.label] = selectedFilterLabelStr // if there arent' any label being selected, not show label prop in url.
            }
            const contentLanguageKeys = searchParams.get(ROUTER_NAME.props.language)?.split(SYMBOL.searchParamsSpliter)
            if (contentLanguageKeys) {
                const checkedContentLanguageStr = transferSearchParamsStr(contentLanguageKeys)
                routerObj[ROUTER_NAME.props.language] = checkedContentLanguageStr
            }
            setSearchParams(routerObj)
        }
        /* eslint-disable-next-line */
    }, [selectedLanguage, selectedFilterLabel])

    useEffect(() => {
        const languages = searchParams.get(ROUTER_NAME.props.language)?.split(SYMBOL.searchParamsSpliter)
        /* to fix the bug that backToPostList() always move to page 1 even the historyBackPath save the page data. */
        if (languages?.length !== checkedContentLanguage.length || languages.filter(language => !checkedContentLanguage.includes(language)).length > 0) {
            const checkedContentLanguageStr = transferSearchParamsStr(checkedContentLanguage)
            const selectedFilterLabelStr = transferSearchParamsStr(selectedFilterLabel.map(label => label.id))
            let routerObj = { [ROUTER_NAME.props.page]: "1" }
            let shouldSetSearchParams = false
            if (selectedFilterLabelStr.length > 0) {
                shouldSetSearchParams = true
                routerObj[ROUTER_NAME.props.label] = selectedFilterLabelStr // if there arent' any label being selected, not show label prop in url.
            }
            if (checkedContentLanguageStr.length > 0) {
                shouldSetSearchParams = true
                routerObj[ROUTER_NAME.props.language] = checkedContentLanguageStr // if there arent' any label being selected, not show label prop in url.
            }
            if (shouldSetSearchParams) {
                setSearchParams(routerObj)
            }
        }
        /* eslint-disable-next-line */
    }, [checkedContentLanguage])


    useEffect(() => {
        window.scroll(0, 0)
    }, [data])

    return (
        <Layout>
            <FilterBar isLoading={loading} renderMode={pcRenderMode} itemClickableHandler={setItemClickableRef}></FilterBar>
            {showError ? <Result
                status="error"
                title={responseStatus}
                subTitle={selectedLanguage === ZH_LANGUAGE.key ?
                    ZH_LANGUAGE.errorMessage
                    :
                    selectedLanguage === JA_LANGUAGE.key ?
                        JA_LANGUAGE.errorMessage :
                        EN_LANGUAGE.errorMessage}
            /> :
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
            }
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