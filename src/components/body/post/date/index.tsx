import React from 'react'
import { DateCompProps } from '../../../../types'
import { Typography, Tooltip, } from 'antd'
import config from '../../../../config/config'
import { useAppSelector } from '../../../../redux/hooks'
import { I18N } from '../../../../config/constant'

const { Text } = Typography

const DateComp: React.FC<DateCompProps> = (props) => {


    const selectedLanguage = useAppSelector((state) => state.language.value)

    return (
        <div style={{ marginBottom: '1em' }}>
            <Tooltip title={props.dateLocal} placement="right" color={config.antdProps.themeColor}>
                <Text type="secondary"><span lang={selectedLanguage}>
                    {
                        selectedLanguage === I18N['ja'].key ?
                            props.dateFromNow + ' ' + props.text
                            :
                            props.text + ' ' + props.dateFromNow
                    }
                </span></Text>
            </Tooltip>
        </div>
    )
}

export default DateComp