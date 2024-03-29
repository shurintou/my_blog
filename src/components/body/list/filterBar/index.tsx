import React, { useState, useEffect, useRef } from 'react'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import { useSearchParams } from "react-router-dom"
import { getAllLabels } from '../../../../api/label'
import { Layout, Select, Tag, Typography, Space } from 'antd'
import { PostListSearchBarProps, Label, I18NObjectKey } from '../../../../types/index'
import config from '../../../../config/config'
import { lightOrDark } from '../../../../utils/common'
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks'
import { changeFilterLabel } from '../../../../features/filterLabel/filterLabelSlice'
import { changeContentLanguage } from '../../../../features/contentLanguage/contentLanguageSlice'
import { changeSearchModalOpen } from '../../../../features/searchModalOpen/searchModalOpenSlice'
import { changeSearchKeyword } from '../../../../features/searchKeyword/searchKeywordSlice'
import { STORAGE_KEY, ROUTER_NAME, SYMBOL, I18N } from '../../../../config/constant'
import { DefaultOptionType } from 'antd/lib/select'
import { mobileAndTabletCheck } from '../../../../utils/userAgent'
import { FunnelPlotOutlined, SearchOutlined } from '@ant-design/icons'
import LanguageCheckBoxCompo from './languageCheckBox'

const { Text } = Typography

const FilterBar = (props: PostListSearchBarProps) => {
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
        if (value.some(labelId => labelId === SEARCH_ID)) { // if searchHintText is clicked, do the search operation.
            dispatch(changeSearchModalOpen(true))
            dispatch(changeSearchKeyword(searchKeywordRef.current))
        }
        else {
            value.forEach(labelId => {
                const selectedLabel = renderLabels.find(label => label.id === labelId)
                if (selectedLabel) {
                    labelArray.push(selectedLabel)
                }
            })
            dispatch(changeFilterLabel(labelArray))
        }
        /* to hide the keyboard when any label is selected, to solve the issue that users cannot see the result of search bar filtering on mobile end.  */
        const selectEl: HTMLElement | null = document.querySelector('#filterBarSelect')
        if (selectEl !== null && mobileAndTabletCheck()) {
            selectEl.blur()
        }
        handleDropDown(false)
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

    const SEARCH_ID = 1
    const CATEGORY_ID = 2
    const TAG_ID = 3
    const FILTER_ID = 4

    useEffect(() => {
        let tempRes: Array<Label> = []
        setLabelWithType('category', I18N[selectedLanguage as I18NObjectKey].tagCategoryObj.category, CATEGORY_ID, labels, tempRes)
        setLabelWithType('tag', I18N[selectedLanguage as I18NObjectKey].tagCategoryObj.tag, TAG_ID, labels, tempRes)
        setPlaceHolderText(I18N[selectedLanguage as I18NObjectKey].selectLabel)
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
        const newList = renderLabels.filter(label => label.id !== SEARCH_ID && label.id !== FILTER_ID)
        if (inputStr.length > 0) {
            const { searchHintText, filterHintText } = I18N[selectedLanguage as I18NObjectKey]
            if (renderLabels.some(label => label.id !== SEARCH_ID && label.id !== FILTER_ID && label.name.indexOf(inputStr) >= 0)) { // if any label that matches inputStr exists, add filterHintText
                newList.unshift({ id: FILTER_ID, name: filterHintText, color: '', description: typeIdentifiedDescription })
            }
            /* if inputStr not null, add searchHintText */
            newList.unshift({ id: SEARCH_ID, name: searchHintText + '[ ' + inputStr + ' ]', color: '', description: '' })
        }
        setRenderLabels(newList)
    }

    const filterOptionHandler = (input: string, option: DefaultOptionType | undefined) => {
        if (renderLabels.length > 0) {
            if (option?.value === SEARCH_ID || option?.value === FILTER_ID) { return true } // always return true if the option is searchHintText or filterHintText.
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

    const RenderLabelText = ({ label }: { label: Label }) => {
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
                        <Text strong style={{ color: config.antdProps.highlightTextColor, backgroundColor: config.antdProps.highlightTextBackgroundColor }}>{renderLabelName.substring(matchingStartIndex, matchingEndIndex)}</Text>
                        <Text strong style={{ color: renderLabelColor }}>{renderLabelName.substring(matchingEndIndex)}</Text>
                    </>
                )
            }
        }
        return (
            <Text strong style={{ color: renderLabelColor }}>{renderLabelName}</Text>
        )
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
                searchValue={searchKeyword}
                open={dropdownOpen} /* to handle the drop down open/close manually to solve the display issue on mobile end. */
                notFoundContent={I18N[selectedLanguage as I18NObjectKey].searchBarEmptyText}
                style={{
                    width: '100%',
                    borderStyle: props.renderMode && !props.isLoading ? 'solid' : 'null',
                    borderColor: config.antdProps.themeColor,
                    borderRadius: props.renderMode && !props.isLoading ? '6px' : '0px',
                    marginBottom: props.isLoading ? '' : '0.5em'
                }}
                listHeight={props.renderMode ? (window.innerHeight / 3) : (window.innerHeight / 3.5)}
                filterOption={(input, option) => filterOptionHandler(input, option)}
                dropdownRender={(menu) => <LanguageCheckBoxCompo reactEl={menu} dropDownHandler={handleDropDown} />}
            >
                {
                    renderLabels.map(label => (
                        <Select.Option key={label.id} value={label.id} disabled={label.description.startsWith(typeIdentifiedDescription)}>
                            {
                                label.description.startsWith(typeIdentifiedDescription) ?
                                    <Text strong>{label.name}</Text>
                                    :
                                    label.id === SEARCH_ID ?
                                        <React.Fragment>
                                            <Space>
                                                <SearchOutlined /><Text strong>{label.name}</Text>
                                            </Space>
                                        </React.Fragment>
                                        :
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