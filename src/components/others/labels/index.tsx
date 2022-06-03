import React, { useState, useEffect } from 'react'
import { Layout, Typography, Tag, } from 'antd'
import { lightOrDark } from '../../../utils/common'
import { LabelsCompoProps, Label } from '../../../types/index'

const { Paragraph, Text } = Typography

const LabelsCompo: React.FC<LabelsCompoProps> = (props) => {
    const [category, setCategory] = useState<Label>({ id: 0, name: 'undefined', description: '', color: 'cyan' })
    const [tags, setTags] = useState<Array<Label>>([])

    useEffect(() => {
        let tagsList: Array<Label> = []
        if (props.labelList.length > 0) {
            props.labelList.forEach((label: Label, index) => {
                const [labelType, labelName] = label.name.split(':')
                if (labelType === 'category') {
                    setCategory({ ...label, color: 'cyan', name: labelName })
                }
                else {
                    tagsList.push({ ...label, name: labelName })
                }
            })
            setTags(tagsList)
        }
        /* eslint-disable-next-line */
    }, [])

    return (
        <Layout>
            <Paragraph>
                <Text style={{ marginRight: '0.5em' }}>Category: </Text>
                {<Tag style={{ borderRadius: '1em' }} color={category.color}><Text strong>{category.name}</Text></Tag>}
            </Paragraph>
            {tags.length > 0 && <Paragraph>
                <Text style={{ marginRight: '0.5em' }}>Tags: </Text>
                {tags.map(label => {
                    return <span key={label.id}>
                        <Tag style={{ borderRadius: '1em' }} color={'#' + label.color}><Text strong style={{ color: lightOrDark(label.color) }}>{label.name}</Text></Tag>
                        &nbsp;
                    </span>
                })}
            </Paragraph>}
        </Layout>
    )
}

const Labels = (props: LabelsCompoProps) => <LabelsCompo {...props}></LabelsCompo>

export default Labels