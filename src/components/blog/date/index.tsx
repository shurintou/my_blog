import React from 'react'
import { DateCompProps } from '../../../types'
import { Typography, Tooltip } from 'antd'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'
import { JA_LANGUAGE } from '../../../config/constant'

const { Paragraph, Text } = Typography

const DateComp: React.FC<DateCompProps> = (props) => {


    const selectedLanguage = useAppSelector((state) => state.language.value)

    return (
        <Paragraph>
            <Tooltip title={props.dateLocal} placement="right" color={config.antdProps.themeColor}>
                <Text type="secondary"><span lang={selectedLanguage}>

                    {
                        selectedLanguage === JA_LANGUAGE.key ?
                            props.dateFromNow + ' ' + props.text
                            :
                            props.text + ' ' + props.dateFromNow
                    }
                </span></Text>
            </Tooltip>
        </Paragraph>
    )
}

export default DateComp