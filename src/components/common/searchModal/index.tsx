import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from "react-router-dom"
import { List, Skeleton, Divider, Modal, Input, Typography, Result } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import { SearchOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { changeSearchModalOpen } from '../../../features/searchModalOpen/searchModalOpenSlice'
import { changeSearchKeyword } from '../../../features/searchKeyword/searchKeywordSlice'
import { ROUTER_NAME, I18N } from '../../../config/constant'
import { searchPosts } from '../../../api/post'
import { debounce } from '../../../utils/common'
import config from '../../../config/config'
import { parseISODateStr } from '../../../utils/formatter'
import { mobileAndTabletCheck } from '../../../utils/userAgent'
import { useNavigate } from "react-router-dom"
import { I18NObjectKey, KeywordSearchItemRes, KeywordSearchListItem, KeywordSearchResponse, PostSearchRequestParam, TextMatch } from '../../../types/index'
import { AxiosError } from 'axios'

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
    const [, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const loadMoreData = () => {
        const newPage = page + 1
        setPage(newPage)
        searchKeywordFunc([searchKeyword, newPage])
    }
    const [showError, setShowError] = useState(false)
    const [responseStatus, setResponseStatus] = useState(200)

    const navigateToPost = (item: KeywordSearchListItem) => {
        const historyBackPath = document.location.pathname + document.location.search
        if (window.location.href.indexOf(ROUTER_NAME.post) >= 0) {
            window.scroll(0, 0)
            setSearchParams({ [ROUTER_NAME.props.id]: item.number.toString() })
        }
        else {
            navigate(`${ROUTER_NAME.post}?id=${item.number}`, { state: { historyBackPath: historyBackPath } })
        }
        dispatch(changeSearchModalOpen(false))
    }


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
                scrollTargetDiv.scrollTo({ top: 0 })
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

    const RenderHighlightText: React.FC<{ textMatch: TextMatch }> = ({ textMatch }) => {
        const matches = textMatch.matches
        return (
            <React.Fragment>{
                matches.map((match, index) => (
                    <React.Fragment key={match.indices[0]}>
                        {index === 0 && <Text>{textMatch.fragment.substring(0, matches[index].indices[0])}</Text>}
                        <Text strong style={{ color: config.antdProps.highlightTextColor, backgroundColor: config.antdProps.highlightTextBackgroundColor }}>{textMatch.fragment.substring(matches[index].indices[0], matches[index].indices[1])}</Text>
                        {(index < matches.length - 1) ? <Text>{textMatch.fragment.substring(matches[index].indices[1], matches[index + 1].indices[0])}</Text> : <Text>{textMatch.fragment.substring(matches[index].indices[1])}</Text>}
                    </React.Fragment>
                ))
            }
            </React.Fragment>
        )
    }

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
            <Divider>{I18N[selectedLanguage as I18NObjectKey].searchResult + I18N[selectedLanguage as I18NObjectKey].searchResultCount(totalCount)}
            </Divider>
            {
                showError ? <Result
                    status="error"
                    title={responseStatus}
                    subTitle={I18N[selectedLanguage as I18NObjectKey].errorMessage}
                /> :

                    <InfiniteScroll
                        dataLength={data.length}
                        next={loadMoreData}
                        hasMore={hasmore}
                        loader={searchKeyword.length > 0 ? <Skeleton paragraph={{ rows: 3 }} active /> : <span></span>}
                        endMessage={(data.length > 0 && data.length >= totalCount) &&
                            <Divider plain>{I18N[selectedLanguage as I18NObjectKey].noMoreText}
                            </Divider>
                        }
                        height={mobileAndTabletCheck() ? '55vh' : '65vh'}
                    >
                        <List
                            itemLayout="vertical"
                            size="large"
                            dataSource={data}
                            style={{ display: firstTimeRender ? 'none' : 'block' }}
                            renderItem={(item: KeywordSearchListItem) => (
                                <List.Item key={item.id} style={{
                                    backgroundColor: config.antdProps.searchResultItemBackgroundColor,
                                    margin: '0em 1em 1.5em',
                                    borderRadius: '4px',
                                    boxShadow: '5px 5px 5px' + config.antdProps.shadowColor,
                                    cursor: 'pointer'
                                }}
                                    onClick={() => navigateToPost(item)}
                                >
                                    <Typography.Title level={5} style={{ margin: 0, color: config.antdProps.themeColor }}>{item.title}</Typography.Title>
                                    <Text type="secondary">{item.created_at.substring(0, 10)}</Text>
                                    <Divider style={{ margin: '2px' }} />
                                    {item.text_matches.some(textMatch => textMatch.property === 'body') ?
                                        item.text_matches.map((textMatch, index) =>
                                            textMatch.property === 'body' &&
                                            <React.Fragment key={item.id + 'textMatch' + index}><RenderHighlightText textMatch={textMatch} /></React.Fragment>
                                        ) : item.body.substring(0, 200)}

                                </List.Item>
                            )}
                            locale={{ emptyText: I18N[selectedLanguage as I18NObjectKey].emptyText }}
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
