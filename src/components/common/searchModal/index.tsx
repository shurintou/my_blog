import React, { useState, useEffect, useCallback } from 'react'
import { List, Skeleton, Divider, Modal, Input, Result, Typography } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { changeSearchModalOpen } from '../../../features/searchModalOpen/searchModalOpenSlice'
import { changeSearchKeyword } from '../../../features/searchKeyword/searchKeywordSlice'
import { I18N, STORAGE_KEY } from '../../../config/constant'
import { searchPosts } from '../../../api/post'
import { debounce } from '../../../utils/common'
import config from '../../../config/config'
import { parseISODateStr } from '../../../utils/formatter'
import { mobileAndTabletCheck } from '../../../utils/userAgent'
import { I18NObjectKey, KeywordSearchItemRes, KeywordSearchListItem, KeywordSearchResponse, PostSearchRequestParam, } from '../../../types/index'
import { AxiosError } from 'axios'
import ResultItem from './resultItem/'
import SearchHistory from './searchHistory'

const { Text } = Typography

const SearchModal = () => {
    const [data, setData] = useState<Array<KeywordSearchListItem>>([])
    const [totalCount, setTotalCount] = useState(0)
    const [hasmore, setHasmore] = useState(true)
    const [loading, setLoading] = useState(false)
    const [firstTimeRender, setFirstTimeRender] = useState(true)
    const [page, setPage] = useState(1)
    const searchModalOpen = useAppSelector((state) => state.searchModalOpen.value)
    const searchKeyword = useAppSelector((state) => state.searchKeyword.value)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()
    const { postProps: { postListItemCountPerPage } } = config
    const searchKeywordChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(changeSearchKeyword(e.target.value))
    }
    const loadMoreData = () => {
        const newPage = page + 1
        setPage(newPage)
        searchKeywordFunc([searchKeyword, newPage])
    }
    const [showError, setShowError] = useState(false)
    const [responseStatus, setResponseStatus] = useState(200)

    const loadPostListData = (searchPostListParams: PostSearchRequestParam) => {
        if (loading) {
            return
        }
        setLoading(true)
        searchPosts({ page: searchPostListParams.page, per_page: postListItemCountPerPage, query: searchPostListParams.query, textMatch: true })
            .then((res: KeywordSearchResponse) => {
                const resItemList = res.items
                const newDataListLength = resItemList.length
                let newDataList: Array<KeywordSearchListItem> = resItemList.map((resItem: KeywordSearchItemRes, index: number) => {
                    let newData: KeywordSearchListItem = Object.assign(resItem, {
                        index: index + 1,
                        listLength: newDataListLength,
                        created_at_local: parseISODateStr(resItem.created_at),
                        updated_at_local: '', //postListItem doesn't use this value so set it ''.
                        created_from_now: '', //postListItem doesn't use this value so set it ''.
                        updated_from_now: '', //postListItem doesn't use this value so set it ''.
                    })
                    return newData
                })
                setHasmore(data.length + newDataList.length < res.total_count)
                setData([...data, ...newDataList])
                setTotalCount(res.total_count)
                setShowError(false)
            })
            .catch((e: AxiosError) => {
                setShowError(true)
                setResponseStatus(e.request.status)
            })
            .finally(() => {
                setLoading(false)
                if (firstTimeRender) setFirstTimeRender(false)
            })
    }

    const searchKeyMaxLength = 50
    function searchKeywordFunc(searchKeywordArgs: [string, number]) { //debounce transfers args from type string to array 
        const trimedSearchKeywordlength = (searchKeywordArgs[0]).trim().length
        if (searchKeywordArgs.length > 1 && searchKeywordArgs[0].length > 0 && searchKeywordArgs[0].length <= searchKeyMaxLength && trimedSearchKeywordlength > 0) {
            loadPostListData({
                page: searchKeywordArgs[1],
                query: encodeURIComponent(searchKeywordArgs[0] + ' ') + 'in:title,body',
            })
            if (searchKeywordArgs[1] === 1) { // to scroll to top of the scrollBar when a new keyword be searched.
                setData([])
                const scrollTargetDiv = document.getElementsByClassName('infinite-scroll-component ')[0]
                scrollTargetDiv?.scrollTo({ top: 0 })
                const localStoragedSearchHistory = localStorage.getItem(STORAGE_KEY.searchHistory)
                if (localStoragedSearchHistory) {
                    const localSearchHistory: Array<string> = JSON.parse(localStoragedSearchHistory)
                    localSearchHistory.unshift(searchKeywordArgs[0])
                    const deduplicatedLocalSearchHistory = Array.from(new Set(localSearchHistory))
                    while (deduplicatedLocalSearchHistory.length > config.searchHistoryCount) {
                        deduplicatedLocalSearchHistory.pop()
                    }
                    localStorage.setItem(STORAGE_KEY.searchHistory, JSON.stringify(deduplicatedLocalSearchHistory))
                }
                else {
                    localStorage.setItem(STORAGE_KEY.searchHistory, JSON.stringify([searchKeywordArgs[0]]))
                }
            }
        }
    }
    /* eslint-disable-next-line */
    const memoedSearchKeywordFunc = useCallback(debounce(searchKeywordFunc, config.eventProps.searchDebounceDelay), [])

    useEffect(() => {
        setPage(1) // to fix the issue that when searchKeyword is changed, the search page is not set to be default 1. 
        memoedSearchKeywordFunc(searchKeyword, 1)
        /* eslint-disable-next-line */
    }, [searchKeyword])

    const divBoxHeight = mobileAndTabletCheck() ? '55vh' : '65vh' // to keep the search modal's height persistent during any operation

    return (
        <Modal
            centered
            visible={searchModalOpen}
            onCancel={() => dispatch(changeSearchModalOpen(false))}
            width={1000}
            bodyStyle={{
                padding: '24px 12px',
                backgroundColor: config.antdProps.modalBackgroundColor,
            }}
            footer={null}
            closable={false}
        >
            <Input
                placeholder={I18N[selectedLanguage as I18NObjectKey].searchBarPlaceHolder}
                value={searchKeyword}
                allowClear
                showCount
                maxLength={searchKeyMaxLength}
                prefix={<SearchOutlined className="site-form-item-icon" />}
                onChange={searchKeywordChangeHandler}
            />
            {data.length > 0 ?
                <Divider>{I18N[selectedLanguage as I18NObjectKey].searchResult + I18N[selectedLanguage as I18NObjectKey].searchResultCount(totalCount)}</Divider>
                :
                <Divider>{I18N[selectedLanguage as I18NObjectKey].searchHistory}</Divider>
            }
            {
                showError ?
                    <div style={{ height: divBoxHeight }}>
                        <Result
                            status="error"
                            title={responseStatus}
                            subTitle={I18N[selectedLanguage as I18NObjectKey].errorMessage}
                        />
                    </div>
                    :
                    data.length === 0 && !loading ?
                        <div style={{ height: divBoxHeight }}>
                            <SearchHistory></SearchHistory>
                            {!firstTimeRender &&
                                <div style={{ paddingTop: '5em', textAlign: 'center' }}>
                                    <Text type="secondary">{I18N[selectedLanguage as I18NObjectKey].emptyText}</Text>
                                </div>}
                        </div> :
                        <InfiniteScroll
                            dataLength={data.length}
                            next={loadMoreData}
                            hasMore={hasmore}
                            loader={searchKeyword.length > 0 ? <Skeleton paragraph={{ rows: 3 }} active /> : <span></span>}
                            endMessage={(data.length > 0 && data.length >= totalCount) &&
                                <Divider plain>{I18N[selectedLanguage as I18NObjectKey].noMoreText}
                                </Divider>
                            }
                            height={divBoxHeight}
                        >
                            <List
                                itemLayout="vertical"
                                size="large"
                                dataSource={data}
                                style={{ display: firstTimeRender ? 'none' : 'block', paddingTop: loading ? '5em' : '' }}
                                renderItem={ResultItem}
                                loading={{
                                    spinning: loading,
                                    size: 'large',
                                    tip: I18N[selectedLanguage as I18NObjectKey].searching
                                }}
                            >
                            </List>
                        </InfiniteScroll>
            }
        </Modal>
    )
}

const SearchModalCompo = () => <SearchModal />
export default SearchModalCompo
