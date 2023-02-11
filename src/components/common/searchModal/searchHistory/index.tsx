import React, { useState, useEffect } from 'react'
import { useAppDispatch } from '../../../../redux/hooks'
import { Space, Tag, Typography } from 'antd'
import { changeSearchKeyword } from '../../../../features/searchKeyword/searchKeywordSlice'
import { STORAGE_KEY } from '../../../../config/constant'

const { Text } = Typography

const SearchHistory: React.FC = () => {
    const dispatch = useAppDispatch()
    const [searchHistory, setSearchHistory] = useState<Array<string>>()

    useEffect(() => {
        const localStoragedSearchHistory = localStorage.getItem(STORAGE_KEY.searchHistory)
        if (localStoragedSearchHistory) {
            const localSearchHistory: Array<string> = JSON.parse(localStoragedSearchHistory)
            setSearchHistory(localSearchHistory)
        }
    }, [])

    const removeSearchHistory = (keyword: string) => {
        const keywordRemovedSearchHistory = searchHistory?.filter(item => item !== keyword)
        setSearchHistory(keywordRemovedSearchHistory)
        localStorage.setItem(STORAGE_KEY.searchHistory, JSON.stringify(keywordRemovedSearchHistory))
    }

    const clickSearchHistory = (keyword: string) => {
        dispatch(changeSearchKeyword(keyword))
    }

    return (
        <Space size={'small'} wrap>
            {searchHistory?.map(keyword => {
                return <Tag
                    key={keyword}
                    style={{ cursor: 'pointer' }}
                    closable
                    onClose={() => removeSearchHistory(keyword)}
                    onClick={() => clickSearchHistory(keyword)}
                    color={'green'}
                >
                    <Text style={{ fontSize: '1.5em' }}>{keyword}</Text>
                </Tag>
            })}
        </Space>
    )
}

const SearchHistoryCompo = () => SearchHistory({})
export default SearchHistoryCompo
