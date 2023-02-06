import React from 'react'
import { List, Divider, Typography, } from 'antd'
import config from '../../../../config/config'
import { KeywordSearchListItem, TextMatch, } from '../../../../types/index'
import { ROUTER_NAME, } from '../../../../config/constant'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from '../../../../redux/hooks'
import { changeSearchModalOpen } from '../../../../features/searchModalOpen/searchModalOpenSlice'

const { Text } = Typography

const ResultItem: React.FC<KeywordSearchListItem> = (props) => {
    const dispatch = useAppDispatch()
    const [, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

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
        <List.Item key={props.id} style={{
            backgroundColor: config.antdProps.searchResultItemBackgroundColor,
            margin: '0em 1em 1.5em',
            borderRadius: '4px',
            boxShadow: '5px 5px 5px' + config.antdProps.shadowColor,
            cursor: 'pointer'
        }}
            onClick={() => navigateToPost(props)}
        >
            <Typography.Title level={5} style={{ margin: 0, color: config.antdProps.themeColor }}>{props.title}</Typography.Title>
            <Text type="secondary">{props.created_at.substring(0, 10)}</Text>
            <Divider style={{ margin: '2px' }} />
            {props.text_matches.some(textMatch => textMatch.property === 'body') ?
                props.text_matches.map((textMatch, index) =>
                    textMatch.property === 'body' &&
                    <React.Fragment key={props.id + 'textMatch' + index}><RenderHighlightText textMatch={textMatch} /></React.Fragment>
                ) : props.body.substring(0, 200)}

        </List.Item>
    )
}

const ResultItemCompo = (props: KeywordSearchListItem) => <ResultItem {...props}></ResultItem>

export default ResultItemCompo