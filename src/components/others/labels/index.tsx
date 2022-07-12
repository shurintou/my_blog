import React, { useState, useEffect } from 'react'
import { Layout, Typography, Tag, Tooltip } from 'antd'
import { lightOrDark } from '../../../utils/common'
import { LabelsCompoProps, Label } from '../../../types/index'
import config from '../../../config/config'

const { Paragraph, Text } = Typography

const LabelsCompo: React.FC<LabelsCompoProps> = (props) => {
    const [category, setCategory] = useState<Label>({ id: 0, name: 'undefined', description: '', color: 'cyan' })
    const [tags, setTags] = useState<Array<Label>>([])

    useEffect(() => {
        let tagsList: Array<Label> = []
        if (props.labelList.length > 0) {
            let languageTag: Label = { id: 0, name: '', color: '', description: '' }
            let languageName: string = ''
            props.labelList.forEach((label: Label, index) => {
                const [labelType, labelName] = label.name.split(':')
                if (labelType === 'category') {
                    setCategory({ ...label, color: 'cyan', name: labelName })
                }
                else if (labelType === 'language') {
                    languageTag = label
                    languageName = labelName
                }
                else {
                    tagsList.push({ ...label, name: labelName })
                }
            })
            tagsList.sort((a, b) => a.name.localeCompare(b.name))
            if (languageTag.id !== 0) {
                tagsList.unshift({ ...languageTag, name: languageName })
            }
            setTags(tagsList)
        }
        /* eslint-disable-next-line */
    }, [])

    return (
        <Layout>
            <Paragraph>
                <Text style={{ marginRight: '0.5em' }}>Category: </Text>
                <Tooltip title={category.description} color={config.antdProps.themeColor}>
                    {<Tag style={{ borderRadius: '1em' }} color={category.color}><Text strong>{category.name}</Text></Tag>}
                </Tooltip>
            </Paragraph>
            {tags.length > 0 && <Paragraph>
                <Text style={{ marginRight: '0.5em' }}>Tags: </Text>
                {tags.map(label => {
                    return <span key={label.id}>
                        <Tooltip title={label.description} color={config.antdProps.themeColor}>
                            <Tag style={{ borderRadius: '1em' }} color={'#' + label.color}><Text strong style={{ color: lightOrDark(label.color) }}>{label.name}</Text></Tag>
                            &nbsp;
                        </Tooltip>
                    </span>
                })}
            </Paragraph>}
        </Layout>
    )
}

const Labels = (props: LabelsCompoProps) => <LabelsCompo {...props}></LabelsCompo>

export default Labels