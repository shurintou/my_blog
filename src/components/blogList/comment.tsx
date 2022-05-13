import React from 'react'
import { Typography, Tooltip, Space } from 'antd'
import { CommentCompProps } from '../../types/index'
import config from '../../config/config'

const { Text } = Typography

const commentComp: React.FC<CommentCompProps> = (props) => {
    return (
        <Tooltip title={props.title} color={config.antdProps.themeColor}>
            <Space size="small">
                {props.slot}
                <Text>
                    {props.text}
                </Text>
            </Space>
        </Tooltip>
    )
}

export default commentComp