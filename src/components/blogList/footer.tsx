import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useLocation } from "react-router-dom"
import { BlogListFooterProps } from '../../types'
import { Pagination, Layout } from 'antd'
import config from '../../config/config'

const BlogListFooterComp: React.FC<BlogListFooterProps> = (props) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [current, setCurrent] = useState(1)
    const navigateToBlogsPage = (page: number) => { setSearchParams({ page: page.toString() }) }
    const location = useLocation()

    useEffect(() => {
        if (location.pathname.indexOf('list') > 0) {
            setCurrent(parseInt(searchParams.get('page') || "1"))
        }
        /* eslint-disable-next-line */
    }, [location])

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
        return description + ' of total ' + totalCount.toString()
    }, [current, props.total])

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
                showTotal={() => <span style={{ color: config.antdProps.paginationTextColor }}>{paginationDescription}</span>}
                onChange={(number) => {
                    navigateToBlogsPage(number)
                    setCurrent(number)
                }}
            />
        </Layout>
    )
}

export default BlogListFooterComp