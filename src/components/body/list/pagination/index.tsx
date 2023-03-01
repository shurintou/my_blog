import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from "react-router-dom"
import { I18NObjectKey, PostListPaginationrProps } from '../../../../types'
import { Pagination, Layout } from 'antd'
import config from '../../../../config/config'
import { useAppSelector } from '../../../../redux/hooks'
import { ROUTER_NAME, I18N } from '../../../../config/constant'
import { transferSearchParamsStr } from '../../../../utils/formatter'

const PostListPaginationComp = (props: PostListPaginationrProps) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [current, setCurrent] = useState(1)
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)
    const checkedContentLanguage = useAppSelector((state) => state.contentLanguage.value)
    const navigateToPostsPage = (page: number) => {
        let routerObj = { [ROUTER_NAME.props.page]: page.toString() }
        const selectedFilterLabelStr = transferSearchParamsStr(selectedFilterLabel.map(label => label.id))
        if (selectedFilterLabelStr.length > 0) {
            routerObj[ROUTER_NAME.props.label] = selectedFilterLabelStr // if there arent' any label being selected, not show label prop in url.
        }
        const checkedContentLanguageStr = transferSearchParamsStr(checkedContentLanguage)
        if (checkedContentLanguageStr.length > 0) {
            routerObj[ROUTER_NAME.props.language] = checkedContentLanguageStr
        }
        setSearchParams(routerObj)
    }
    const selectedLanguage = useAppSelector((state) => state.language.value)

    useEffect(() => {
        setCurrent(parseInt(searchParams.get(ROUTER_NAME.props.page) || "1"))
        /* eslint-disable-next-line */
    }, [searchParams])

    const paginationDescription = useMemo(() => {
        const perPageCount = config.postProps.postListItemCountPerPage
        const totalCount = props.total
        if (totalCount > 0) {
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
            return I18N[selectedLanguage as I18NObjectKey].pagination(description, totalCount)
        }
        return ''
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
                pageSize={config.postProps.postListItemCountPerPage}
                showTotal={() => <span lang={selectedLanguage} style={{ color: config.antdProps.paginationTextColor }}>{paginationDescription}</span>}
                onChange={(number) => {
                    navigateToPostsPage(number)
                    setCurrent(number)
                }}
            />
        </Layout>
    )
}

export default PostListPaginationComp