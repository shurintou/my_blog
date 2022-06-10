import React from 'react'
import { Typography, Tooltip, } from 'antd'
import { CommentCompProps } from '../../../types/index'
import config from '../../../config/config'

const { Text } = Typography

const commentComp: React.FC<CommentCompProps> = (props) => {
    return (
        <span>
            <Tooltip title={props.title} color={config.antdProps.themeColor}>
                <span>
                    {props.slot}
                </span>
            </Tooltip>

            <Text style={{ marginLeft: '1em' }}>
                {props.text}
            </Text>
        </span>
    )
}

export default commentComp