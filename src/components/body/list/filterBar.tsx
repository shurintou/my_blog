import { useState, useEffect, useRef } from 'react'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { useSearchParams } from "react-router-dom"
import { getAllLabels } from '../../../api/label'
import { Layout, Select, Tag, Typography, Divider, Space, Checkbox, } from 'antd'
import { PostListSearchBarProps, Label } from '../../../types/index'
import config from '../../../config/config'
import { lightOrDark } from '../../../utils/common'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { changeFilterLabel } from '../../../features/filterLabel/filterLabelSlice'
import { changeContentLanguage } from '../../../features/contentLanguage/contentLanguageSlice'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, STORAGE_KEY, ROUTER_NAME, SYMBOL } from '../../../config/constant'
import { DefaultOptionType } from 'antd/lib/select'
import { mobileAndTabletCheck } from '../../../utils/userAgent'
import { FunnelPlotOutlined } from '@ant-design/icons'
import type { CheckboxOptionType, CheckboxValueType } from 'antd/es/checkbox/Group'

const { Text } = Typography
const CheckboxGroup = Checkbox.Group

const FilterBar: React.FC<PostListSearchBarProps> = (props) => {
    const [searchParams,] = useSearchParams()
    const [labels, setLabels] = useState<Array<Label>>([])
    const [renderLabels, setRenderLabels] = useState<Array<Label>>([])
    const [placeHolderText, setPlaceHolderText] = useState<string>()
    const [searchKeyword, setSearchKeyword] = useState<string>()
    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
    const searchKeywordRef = useRef<string>(searchKeyword ?? '')
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const checkedContentLanguage = useAppSelector((state) => state.contentLanguage.value)
    const dispatch = useAppDispatch()

    useEffect(() => {
        const labelIds = searchParams.get(ROUTER_NAME.props.label)?.split(SYMBOL.searchParamsSpliter)
        const contentLanguageKeys = searchParams.get(ROUTER_NAME.props.language)?.split(SYMBOL.searchParamsSpliter)

        // to solve the router push state twice issue, check the selectedFilterLabel and searchParams, if they have the same labels, not to dispatch changeFilterLabel
        if (
            (labelIds === undefined && selectedFilterLabel.length !== 0)
            ||
            (labelIds && labelIds.length !== selectedFilterLabel.length)
            ||
            (labelIds && labelIds.some(labelId => !selectedFilterLabel.some(selectedLabel => selectedLabel.id === parseInt(labelId))))
            ||
            selectedFilterLabel.some(selectedLabel => !(labelIds && labelIds.some(labelId => selectedLabel.id === parseInt(labelId))))
        ) {
            const labelList = labels.filter(label => (labelIds && labelIds.some(labelId => parseInt(labelId) === label.id)))
            dispatch(changeFilterLabel(labelList))
        }

        if (
            contentLanguageKeys && (
                (contentLanguageKeys.length !== checkedContentLanguage.length)
                ||
                (contentLanguageKeys.some(key => !checkedContentLanguage.some(checkedContentLanguage => checkedContentLanguage === key)))
                ||
                checkedContentLanguage.some(checkedContentLanguage => !(contentLanguageKeys.some(key => checkedContentLanguage === key)))
            )
        ) {
            dispatch(changeContentLanguage(contentLanguageKeys))
        }
        /* eslint-disable-next-line */
    }, [searchParams])

    const handleSelectChange = (value: Array<number>) => {
        let labelArray: Array<Label> = []
        value.forEach(labelId => {
            const selectedLabel = renderLabels.find(label => label.id === labelId)
            if (selectedLabel) {
                labelArray.push(selectedLabel)
            }
        })
        dispatch(changeFilterLabel(labelArray))
        /* to hide the keyboard when any label is selected, to solve the issue that users cannot see the result of search bar filtering on mobile end.  */
        const selectEl: HTMLElement | null = document.querySelector('#filterBarSelect')
        if (selectEl !== null && mobileAndTabletCheck()) {
            selectEl.blur()
        }
        setDropdownOpen(false)
        searchInputHandler('') // to clear the searchKeyword when any labels selected.
    }

    const tagRender = (props: CustomTagProps) => {
        const { value, closable, onClose } = props
        const label = renderLabels.find((label: Label) => label.id === value)
        const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
            event.preventDefault()
            event.stopPropagation()
        }
        return (
            <Tag
                color={label?.name.startsWith('category') ? 'cyan' : '#' + label?.color}
                icon={<FunnelPlotOutlined />}
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{
                    marginRight: 3,
                    color: lightOrDark(label ? label.color : 'FFFFFF'),
                    borderRadius: '1em'
                }}
            >
                <Text strong style={{ color: lightOrDark(label ? label.color : 'FFFFFF') }}>{label?.name.split(':')[1]}</Text>
            </Tag>
        )
    }

    const typeIdentifiedDescription = '#type'
    /* to add blank label of category and tag to the label select list */
    const setLabelWithType = (type: string, typeName: string, typeId: number, sourceLabelList: Array<Label>, targetLabelList: Array<Label>) => {
        targetLabelList.push({ id: typeId, name: typeName, color: '', description: typeIdentifiedDescription })
        const categoryList = sourceLabelList.filter(label => label.name.startsWith(type))
        categoryList.forEach((label: Label) => {
            targetLabelList.push(label)
        })
    }

    const handleDropDown = (flg: boolean) => {
        props.itemClickableHandler(!flg) // to set list item unclickable when the searchBar is opening.
        setDropdownOpen(flg)
    }

    const CATEGORY_ID = 2
    const TAG_ID = 3

    useEffect(() => {
        let tempRes: Array<Label> = []
        switch (selectedLanguage) {
            case ZH_LANGUAGE.key:
                setLabelWithType('category', ZH_LANGUAGE.tagCategoryObj.category, CATEGORY_ID, labels, tempRes)
                setLabelWithType('tag', ZH_LANGUAGE.tagCategoryObj.tag, TAG_ID, labels, tempRes)
                setPlaceHolderText(ZH_LANGUAGE.selectLabel)
                break
            case JA_LANGUAGE.key:
                setLabelWithType('category', JA_LANGUAGE.tagCategoryObj.category, CATEGORY_ID, labels, tempRes)
                setLabelWithType('tag', JA_LANGUAGE.tagCategoryObj.tag, TAG_ID, labels, tempRes)
                setPlaceHolderText(JA_LANGUAGE.selectLabel)
                break
            default:
                setLabelWithType('category', EN_LANGUAGE.tagCategoryObj.category, CATEGORY_ID, labels, tempRes)
                setLabelWithType('tag', EN_LANGUAGE.tagCategoryObj.tag, TAG_ID, labels, tempRes)
                setPlaceHolderText(EN_LANGUAGE.selectLabel)
        }
        setRenderLabels(tempRes)
    }, [labels, selectedLanguage])

    useEffect(() => {
        const filterLabelListStr = sessionStorage.getItem(STORAGE_KEY.filterLabelList)
        if (filterLabelListStr) {
            setLabels(JSON.parse(filterLabelListStr))
        }
        else {
            getAllLabels().then((res: Array<Label>) => {
                if (res && res.length > 0) {
                    const newfilterLabelList = res.filter((label: Label) => !label.name.startsWith('language'))
                    // const newLanguageLabelList = res.filter((label: Label) => label.name.startsWith('language'))
                    setLabels(newfilterLabelList)
                    sessionStorage.setItem(STORAGE_KEY.filterLabelList, JSON.stringify(newfilterLabelList))
                    // sessionStorage.setItem(STORAGE_KEY.languageLabelList, JSON.stringify(newLanguageLabelList))
                }
            })
        }
        /* eslint-disable-next-line */
    }, [])

    const searchInputHandler = (inputStr: string) => {
        searchKeywordRef.current = inputStr
        setSearchKeyword(inputStr)
    }

    const filterOptionHandler = (input: string, option: DefaultOptionType | undefined) => {
        if (renderLabels.length > 0) {
            const matchLabel = renderLabels.find(label => label.id === option?.value ?? '')
            if (matchLabel) {
                const splitMatchLabel = matchLabel.name.split(':')
                if (splitMatchLabel.length === 2) {
                    return splitMatchLabel[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            }
        }
        return false
    }

    const RenderLabelText: React.FC<{ label: Label }> = ({ label }) => {
        const renderLabelName = label.name.split(':')[1]
        const renderLabelColor = lightOrDark(label.color)
        if (!label.description.startsWith(typeIdentifiedDescription) && searchKeywordRef && searchKeywordRef.current.length > 0) {
            const searchKeywordLowercase = searchKeywordRef.current.toLowerCase()
            const matchingStartIndex = renderLabelName.toLowerCase().indexOf(searchKeywordLowercase)
            const matchingEndIndex = matchingStartIndex + searchKeywordLowercase.length
            if (matchingStartIndex >= 0) {
                return (
                    <>
                        {/* to highlight the matching word */}
                        <Text strong style={{ color: renderLabelColor }}>{renderLabelName.substring(0, matchingStartIndex)}</Text>
                        <Text strong style={{ color: 'black', backgroundColor: 'yellow' }}>{renderLabelName.substring(matchingStartIndex, matchingEndIndex)}</Text>
                        <Text strong style={{ color: renderLabelColor }}>{renderLabelName.substring(matchingEndIndex)}</Text>
                    </>
                )
            }
        }
        return (
            <Text strong style={{ color: renderLabelColor }}>{renderLabelName}</Text>
        )
    }

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
            dispatch(changeContentLanguage(checkedOptionList.map(checkedOption => checkedOption.toString())))
        }
    }

    return (<Layout>
        {/* labels.length > 0 is necessary otherwise the tagRender will throw error because labels may be [] or being got when labels.find run. */}
        {renderLabels.length > 0 &&
            <Select
                id='filterBarSelect'
                mode="multiple"
                allowClear
                showArrow
                tagRender={tagRender}
                placeholder={placeHolderText}
                onChange={handleSelectChange}
                onDropdownVisibleChange={handleDropDown}
                value={selectedFilterLabel.map(label => label.id)}
                virtual={false} /* to solve the scroll penetration issue on mobile. */
                showSearch={true}
                onSearch={searchInputHandler}
                open={dropdownOpen} /* to handle the drop down open/close manually to solve the display issue on mobile end. */
                notFoundContent={
                    selectedLanguage === ZH_LANGUAGE.key ?
                        ZH_LANGUAGE.searchBarEmptyText
                        :
                        selectedLanguage === JA_LANGUAGE.key ?
                            JA_LANGUAGE.searchBarEmptyText :
                            EN_LANGUAGE.searchBarEmptyText
                }
                style={{
                    width: '100%',
                    borderStyle: props.renderMode && !props.isLoading ? 'solid' : 'null',
                    borderColor: config.antdProps.themeColor,
                    borderRadius: props.renderMode && !props.isLoading ? '6px' : '0px',
                    marginBottom: props.isLoading ? '' : '0.5em'
                }}
                filterOption={(input, option) => filterOptionHandler(input, option)}
                dropdownRender={(menu) => (
                    <>
                        {menu}
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
                    </>
                )}
            >
                {
                    renderLabels.map(label => (
                        <Select.Option key={label.id} value={label.id} disabled={label.description.startsWith(typeIdentifiedDescription)}>
                            {
                                !label.description.startsWith(typeIdentifiedDescription) ?
                                    <Tag
                                        color={label.name.startsWith('category') ? 'cyan' : '#' + label.color}
                                        style={{
                                            marginRight: 3,
                                            color: lightOrDark(label.color),
                                            borderRadius: '1em',
                                        }}
                                        icon={selectedFilterLabel.some(selectedLabel => selectedLabel.id === label.id) ? <FunnelPlotOutlined /> : null}
                                    >
                                        <RenderLabelText label={label} />
                                    </Tag>
                                    :
                                    <Text strong>{label.name}</Text>
                            }
                        </Select.Option>
                    ))
                }
            </Select>
        }
    </Layout>)
}

const FilterBarCompo = (props: PostListSearchBarProps) => <FilterBar {...props} />
export default FilterBarCompo