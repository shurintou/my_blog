import React from 'react'
import { useAppSelector, useAppDispatch } from '../../../../../redux/hooks'
import { Typography, Divider, Space, Checkbox, } from 'antd'
import { changeContentLanguage } from '../../../../../features/contentLanguage/contentLanguageSlice'
import { STORAGE_KEY, I18N } from '../../../../../config/constant'
import type { CheckboxOptionType, CheckboxValueType } from 'antd/es/checkbox/Group'
import { I18NObjectKey, LanguageCheckBoxProps } from '../../../../../types/index'

const { Text } = Typography
const CheckboxGroup = Checkbox.Group

const LanguageCheckbox: (props: LanguageCheckBoxProps) => React.ReactElement = (props) => {

    const checkedContentLanguage = useAppSelector((state) => state.contentLanguage.value)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()

    const languageOptions: Array<CheckboxOptionType> = [
        { value: I18N['en'].key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(I18N['en'].key), label: I18N[selectedLanguage as I18NObjectKey].checkBoxOptionObj['en'] },
        { value: I18N['ja'].key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(I18N['ja'].key), label: I18N[selectedLanguage as I18NObjectKey].checkBoxOptionObj['ja'] },
        { value: I18N['zh'].key, disabled: checkedContentLanguage.length === 1 && checkedContentLanguage.includes(I18N['zh'].key), label: I18N[selectedLanguage as I18NObjectKey].checkBoxOptionObj['zh'] },
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
            <Text strong>{I18N[selectedLanguage as I18NObjectKey].checkBoxHintText}</Text>
            <CheckboxGroup options={languageOptions} value={checkedContentLanguage} onChange={handleCheckBoxChange} />
        </Space>
    </React.Fragment>)

}

const LanguageCheckBoxCompo = (props: LanguageCheckBoxProps) => <LanguageCheckbox {...props} />
export default LanguageCheckBoxCompo
