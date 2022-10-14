import React, { useState, useEffect } from 'react'
import { Layout, Typography, Tag, Tooltip } from 'antd'
import { lightOrDark } from '../../../utils/common'
import { LabelsCompoProps, Label } from '../../../types/index'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { ZH_LANGUAGE, JA_LANGUAGE, EN_LANGUAGE } from '../../../config/constant'

const { Text } = Typography

const LabelsCompo: React.FC<LabelsCompoProps> = (props) => {
    const [category, setCategory] = useState<Label>({ id: 0, name: 'undefined', description: '', color: 'cyan' })
    const [tags, setTags] = useState<Array<Label>>([])
    const selectedLanguage = useAppSelector((state) => state.language.value)

    const [tagText, setTagText] = useState(getText(selectedLanguage, 'tag'))
    const [categoryText, setCategoryText] = useState(getText(selectedLanguage, 'category'))

    function getText(lang: string, type: string) {
        if (type === 'tag' || type === 'category') {
            switch (lang) {
                case ZH_LANGUAGE.key:
                    return ZH_LANGUAGE.tagCategoryObj[type]
                case JA_LANGUAGE.key:
                    return JA_LANGUAGE.tagCategoryObj[type]
                default:
                    return EN_LANGUAGE.tagCategoryObj[type]
            }
        }
    }

    useEffect(() => {
        setTagText(getText(selectedLanguage, 'tag'))
        setCategoryText(getText(selectedLanguage, 'category'))
        /* eslint-disable-next-line */
    }, [selectedLanguage])

    useEffect(() => {
        let tagsList: Array<Label> = []
        if (props.labelList.length > 0) {
            props.labelList.forEach((label: Label, index) => {
                const [labelType, labelName] = label.name.split(':')
                if (labelType === 'category') {
                    setCategory({ ...label, color: 'cyan', name: labelName })
                }
                else if (labelType === 'language') {
                    let htmlLang = ''
                    switch (labelName.toLowerCase()) {
                        case ZH_LANGUAGE.lowerCase:
                            htmlLang = ZH_LANGUAGE.key
                            break
                        case JA_LANGUAGE.lowerCase:
                            htmlLang = JA_LANGUAGE.key
                            break
                        default:
                            htmlLang = EN_LANGUAGE.key
                    }
                    props.setBlogLanguage(htmlLang)
                }
                else {
                    tagsList.push({ ...label, name: labelName })
                }
            })
            tagsList.sort((a, b) => a.name.localeCompare(b.name))
            setTags(tagsList)
        }
        /* eslint-disable-next-line */
    }, [])

    return (
        <Layout>
            <div style={{ marginBottom: '1em' }}>
                <Text style={{ marginRight: '0.5em' }}><span lang={selectedLanguage}>{categoryText}</span></Text>
                <Tooltip title={category.description} color={config.antdProps.themeColor}>
                    {<Tag style={{ borderRadius: '1em' }} color={category.color}><Text strong>{category.name}</Text></Tag>}
                </Tooltip>
            </div>
            {tags.length > 0 && <div style={{ marginBottom: '1em' }}>
                <Text style={{ marginRight: '0.5em' }}><span lang={selectedLanguage}>{tagText}</span></Text>
                {tags.map(label => {
                    return <span key={label.id}>
                        <Tooltip title={label.description} color={config.antdProps.themeColor}>
                            <Tag style={{ borderRadius: '1em' }} color={'#' + label.color}><Text strong style={{ color: lightOrDark(label.color) }}>{label.name}</Text></Tag>
                            &nbsp;
                        </Tooltip>
                    </span>
                })}
            </div>}
        </Layout>
    )
}

const Labels = (props: LabelsCompoProps) => <LabelsCompo {...props}></LabelsCompo>

export default Labels