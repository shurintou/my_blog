import React from 'react'
import { DateCompProps } from '../../../types'
import { Typography, Tooltip } from 'antd'
import config from '../../../config/config'

const { Paragraph, Text } = Typography

const DateComp: React.FC<DateCompProps> = (props) => {
    return (
        <Paragraph>
            <Tooltip title={props.dateLocal} placement="right" color={config.antdProps.themeColor}>
                <Text type="secondary">{props.text + ' ' + props.dateFromNow}</Text>
            </Tooltip>
        </Paragraph>
    )
}

export default DateComp