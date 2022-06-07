import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { BlogListFooterProps } from '../../types'
import { Pagination, Layout } from 'antd'
import config from '../../config/config'

const BlogListFooterComp: React.FC<BlogListFooterProps> = (props) => {
    const [current, setCurrent] = useState(1)
    const navigate = useNavigate()
    const navigateToBlogsPage = (page: number) => navigate('/blogs/' + page)
    const location = useLocation()

    useEffect(() => {
        const matchStr = location.pathname.match(/blogs\/\d/g)
        if (matchStr) {
            setCurrent(parseInt(matchStr[0].slice(6)))
        }
    }, [location])

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
                showTotal={() => <span style={{ color: config.antdProps.paginationTextColor }}>Total {props.total} blogs</span>}
                onChange={(number) => {
                    navigateToBlogsPage(number)
                    setCurrent(number)
                    props.changeHandler(number)
                }}
            />
        </Layout>
    )
}

export default BlogListFooterComp