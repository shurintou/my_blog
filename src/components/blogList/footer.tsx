import React, { useState } from 'react'
import { BlogListFooterProps } from '../../types'
import { Pagination, Layout } from 'antd'
import config from '../../config/config'

const BlogListFooterComp: React.FC<BlogListFooterProps> = (props) => {
    const [current, setCurrent] = useState(1)

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
                    setCurrent(number)
                    props.changeHandler(number)
                }}
            />
        </Layout>
    )
}

export default BlogListFooterComp