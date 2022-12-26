import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../../../redux/hooks'
import { Typography, Divider, Space, Checkbox, } from 'antd'
import { changeContentLanguage } from '../../../../../features/contentLanguage/contentLanguageSlice'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, STORAGE_KEY, } from '../../../../../config/constant'
import type { CheckboxOptionType, CheckboxValueType } from 'antd/es/checkbox/Group'
import { LanguageCheckBoxProps } from '../../../../../types/index'

const { Text } = Typography
const CheckboxGroup = Checkbox.Group

const LanguageCheckbox: (props: LanguageCheckBoxProps) => React.ReactElement = (props) => {

    const checkedContentLanguage = useAppSelector((state) => state.contentLanguage.value)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()

    const languageOptions: Array<CheckboxOptionType> = [
        { value: EN_LANGUAGE.key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(EN_LANGUAGE.key), label: selectedLanguage === ZH_LANGUAGE.key ? ZH_LANGUAGE.checkBoxOptionObj['en'] : selectedLanguage === JA_LANGUAGE.key ? JA_LANGUAGE.checkBoxOptionObj['en'] : EN_LANGUAGE.checkBoxOptionObj['en'] },
        { value: JA_LANGUAGE.key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(JA_LANGUAGE.key), label: selectedLanguage === ZH_LANGUAGE.key ? ZH_LANGUAGE.checkBoxOptionObj['ja'] : selectedLanguage === JA_LANGUAGE.key ? JA_LANGUAGE.checkBoxOptionObj['ja'] : EN_LANGUAGE.checkBoxOptionObj['ja'] },
        { value: ZH_LANGUAGE.key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(ZH_LANGUAGE.key), label: selectedLanguage === ZH_LANGUAGE.key ? ZH_LANGUAGE.checkBoxOptionObj['zh'] : selectedLanguage === JA_LANGUAGE.key ? JA_LANGUAGE.checkBoxOptionObj['zh'] : EN_LANGUAGE.checkBoxOptionObj['zh'] },
    ]

    const handleCheckBoxChange = (list: Array<CheckboxValueType>) => {
        if (list.length === 0) { // if nothing checked, do nothing
            return
        }
        if (languageOptions) {
            const checkedLanguageLabelsList = languageOptions.filter(languageLabel => list.includes(languageLabel.value))
            const checkedOptionList = checkedLanguageLabelsList.map(option => option.value)
            const checkedValueList = checkedOptionList.map(checkedOption => checkedOption.toString())
            localStorage.setItem(STORAGE_KEY.contentLanguageList, JSON.stringify(checkedValueList))
            dispatch(changeContentLanguage(checkedValueList))
        }
    }

    return (<React.Fragment>
        {props.reactEl}
        <Divider style={{ margin: '8px 0' }} />
        <Space style={{ padding: '0 8px 4px' }}>
            <Text strong>{
                selectedLanguage === ZH_LANGUAGE.key ?
                    ZH_LANGUAGE.checkBoxHintText
                    :
                    selectedLanguage === JA_LANGUAGE.key ?
                        JA_LANGUAGE.checkBoxHintText :
                        EN_LANGUAGE.checkBoxHintText
            }</Text>
            <CheckboxGroup options={languageOptions} value={checkedContentLanguage} onChange={handleCheckBoxChange} />
        </Space>
    </React.Fragment>)

}

const LanguageCheckBoxCompo = (props: LanguageCheckBoxProps) => <LanguageCheckbox {...props} />
export default LanguageCheckBoxCompo
