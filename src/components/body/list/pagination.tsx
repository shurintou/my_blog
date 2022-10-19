import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from "react-router-dom"
import { BlogListPaginationrProps } from '../../../types'
import { Pagination, Layout } from 'antd'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { JA_LANGUAGE, ZH_LANGUAGE, ROUTER_NAME } from '../../../config/constant'

const BlogListPaginationComp: React.FC<BlogListPaginationrProps> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [current, setCurrent] = useState(1)
    const navigateToBlogsPage = (page: number) => { setSearchParams({ [ROUTER_NAME.props.page]: page.toString() }) }
    const selectedLanguage = useAppSelector((state) => state.language.value)

    useEffect(() => {
        setCurrent(parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"))
        /* eslint-disable-next-line */
    }, [searchParams])

    const paginationDescription = useMemo(() => {
        const perPageCount = config.blogProps.blogListItemCountPerPage
        const totalCount = props.total
        let max = current * perPageCount
        let min = (current - 1) * perPageCount + 1
        let description = ''
        if (max > totalCount) {
            max = totalCount
        }
        if (max === min) {
            description = max.toString()
        }
        else {
            description = min.toString() + '~' + max.toString()
        }
        switch (selectedLanguage) {
            case ZH_LANGUAGE.key:
                return '第' + description + '条, 共' + totalCount.toString() + '条'
            case JA_LANGUAGE.key:
                return description + '件目, 全' + totalCount.toString() + '件'
            default:
                return description + ' of total ' + totalCount.toString()
        }
    }, [current, props.total, selectedLanguage])

    return (
        <Layout style={{
            textAlign: 'center',
            background: config.antdProps.themeColor,
            padding: '0.5em',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: config.antdProps.themeColor,
            borderRadius: props.renderMode ? '5px' : '0px',
        }}>
            <Pagination
                style={{
                    display: 'inline-block !important',
                    verticalAlign: 'middle',
                }}
                defaultCurrent={1}
                current={current}
                total={props.total}
                showSizeChanger={false}
                responsive={true}
                pageSize={config.blogProps.blogListItemCountPerPage}
                showTotal={() => <span lang={selectedLanguage} style={{ color: config.antdProps.paginationTextColor }}>{paginationDescription}</span>}
                onChange={(number) => {
                    navigateToBlogsPage(number)
                    setCurrent(number)
                }}
            />
        </Layout>
    )
}

export default BlogListPaginationComp