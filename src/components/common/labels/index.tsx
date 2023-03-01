import { useState, useEffect } from 'react'
import { Layout, Typography, Tag, Tooltip } from 'antd'
import { lightOrDark } from '../../../utils/common'
import { mobileAndTabletCheck } from '../../../utils/userAgent'
import { LabelsCompoProps, Label, I18NObjectKey } from '../../../types/index'
import config from '../../../config/config'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { changeFilterLabel } from '../../../features/filterLabel/filterLabelSlice'
import { ROUTER_NAME, I18N } from '../../../config/constant'
import { FunnelPlotOutlined } from '@ant-design/icons'

const { Text } = Typography

const LabelsCompo = (props: LabelsCompoProps) => {
    const [category, setCategory] = useState<Label>({ id: 0, name: 'undefined', description: '', color: 'cyan' })
    const [tags, setTags] = useState<Array<Label>>([])
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)
    const dispatch = useAppDispatch()
    const [tagText, setTagText] = useState(getText(selectedLanguage, 'tag'))
    const [categoryText, setCategoryText] = useState(getText(selectedLanguage, 'category'))

    function getText(lang: string, type: string) {
        if (type === 'tag' || type === 'category') {
            return I18N[lang as I18NObjectKey].tagCategoryObj[type]
        }
    }

    const routerAtListPage = window.location.href.indexOf(ROUTER_NAME.list) >= 0

    const clickLabelHandler = (clicedLabel: Label) => {
        if (routerAtListPage) { // make the label only be clicked at the list page would do the logic below
            if (selectedFilterLabel.findIndex(filterLabel => filterLabel.id === clicedLabel.id) === -1) {
                let newList = selectedFilterLabel.filter(() => true)
                newList.push(clicedLabel)
                dispatch(changeFilterLabel(newList))
            }
            else {
                removeSelectedFilterLabel(clicedLabel)
            }
        }
    }

    const closableHandler = (label: Label) => routerAtListPage && selectedFilterLabel.findIndex(filterLabel => filterLabel.id === label.id) >= 0

    const removeSelectedFilterLabel = (closedLabel: Label) => {
        let newList = selectedFilterLabel.filter((label) => label.id !== closedLabel.id)
        dispatch(changeFilterLabel(newList))
    }

    useEffect(() => {
        setTagText(getText(selectedLanguage, 'tag'))
        setCategoryText(getText(selectedLanguage, 'category'))
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    useEffect(() => {
        let tagList: Array<Label> = []
        if (props.labelList.length > 0) {
            props.labelList.forEach((label: Label, index) => {
                const splitedLabelName = label.name.split(':')
                const labelType = splitedLabelName[0]
                if (labelType === 'category') {
                    setCategory({ ...label, color: 'cyan' })
                }
                else if (labelType === 'language') {
                    const language = splitedLabelName[1]
                    let htmlLang = ''
                    switch (language.toLowerCase()) {
                        case I18N['zh'].lowerCase:
                            htmlLang = I18N['zh'].key
                            break
                        case I18N['ja'].lowerCase:
                            htmlLang = I18N['ja'].key
                            break
                        default:
                            htmlLang = I18N['en'].key
                    }
                    props.setPostLanguage(htmlLang)
                }
                else {
                    tagList.push(label)
                }
            })
            tagList.sort((a, b) => a.name.localeCompare(b.name))
            setTags(tagList)
        }
        /* eslint-disable-next-line */
    }, [])


    const RenderTag = ({ label }: { label: Label }) => {
        const isHexadecimalColor = /^[A-F0-9]+$/i.test(label.color)
        return (
            <Tag
                style={{
                    borderRadius: '1em',
                    cursor: routerAtListPage ? 'pointer' : 'default',
                    color: isHexadecimalColor ? lightOrDark(label.color) : '#000000',
                    display: 'inline-block' // to avoid the tag display css turn to be none when closed.
                }}
                color={(isHexadecimalColor ? '#' : '') + label.color}
                onClick={() => clickLabelHandler(label)}
                closable={closableHandler(label)}
                onClose={() => { removeSelectedFilterLabel(label) }}
                icon={routerAtListPage && selectedFilterLabel.some(selectedLabel => selectedLabel.id === label.id) ? <FunnelPlotOutlined /> : null}
            >
                <Text strong style={{ color: isHexadecimalColor ? lightOrDark(label.color) : '' }}>
                    {label.name.split(':')[1]}
                </Text>
            </Tag>
        )
    }

    const RenderTooltipWithTag = ({ tag }: { tag: Label }) => {
        return (
            routerAtListPage && mobileAndTabletCheck() ?
                <RenderTag label={tag} />
                :
                <Tooltip
                    title={tag.description}
                    color={config.antdProps.themeColor}
                    trigger={['hover', 'click', 'focus']}
                >
                    <RenderTag label={tag} />&nbsp;
                </Tooltip>
        )
    }

    return (
        <Layout style={{ ...props.layoutStyle }}>
            <div style={{ marginBottom: '1em' }}>
                <Text style={{ marginRight: '0.5em' }}><span lang={selectedLanguage}>{categoryText}</span></Text>
                <RenderTooltipWithTag tag={category} />
            </div>
            {tags.length > 0 && <div style={{ marginBottom: '1em' }}>
                <Text style={{ marginRight: '0.5em' }}><span lang={selectedLanguage}>{tagText}</span></Text>
                {tags.map(label => {
                    return <span key={label.id}>
                        <RenderTooltipWithTag tag={label} />
                    </span>
                })}
            </div>}
        </Layout>
    )
}

const Labels = (props: LabelsCompoProps) => <LabelsCompo {...props}></LabelsCompo>

export default Labels