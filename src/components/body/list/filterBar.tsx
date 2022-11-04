import { useState, useEffect, } from 'react'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { getAllLabels } from '../../../api/labels'
import { Layout, Select, Tag, Typography } from 'antd'
import { BlogListSearchBarProps, Label } from '../../../types/index'
import config from '../../../config/config'
import { lightOrDark } from '../../../utils/common'
import { useAppSelector, useAppDispatch } from '../../../redux/hooks'
import { changeFilterLabel } from '../../../features/filterLabel/filterLabelSlice'
import { EN_LANGUAGE, JA_LANGUAGE, ZH_LANGUAGE, STORAGE_KEY } from '../../../config/constant'
const { Text } = Typography

const FilterBar: React.FC<BlogListSearchBarProps> = (props) => {
    const [labels, setLabels] = useState<Array<Label>>([])
    const [renderLabels, setRenderLabels] = useState<Array<Label>>([])
    const [placeHolderText, setPlaceHolderText] = useState<string>()
    const selectedFilterLabel = useAppSelector((state) => state.filterLabel.value)
    const selectedLanguage = useAppSelector((state) => state.language.value)
    const dispatch = useAppDispatch()

    const setSelectedFilterLabel = (newList: Array<Label>) => {
        dispatch(changeFilterLabel(newList))
    }

    const handleChange = (value: Array<number>) => {
        let labelArray: Array<Label> = []
        value.forEach(labelId => {
            const selectedLabel = renderLabels.find(label => label.id === labelId)
            if (selectedLabel) {
                labelArray.push(selectedLabel)
            }
        })
        setSelectedFilterLabel(labelArray)
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
    }

    useEffect(() => {
        let tempRes: Array<Label> = []
        switch (selectedLanguage) {
            case ZH_LANGUAGE.key:
                setLabelWithType('category', ZH_LANGUAGE.tagCategoryObj.category, 1, labels, tempRes)
                setLabelWithType('tag', ZH_LANGUAGE.tagCategoryObj.tag, 2, labels, tempRes)
                setPlaceHolderText(ZH_LANGUAGE.selectLabel)
                break
            case JA_LANGUAGE.key:
                setLabelWithType('category', JA_LANGUAGE.tagCategoryObj.category, 1, labels, tempRes)
                setLabelWithType('tag', JA_LANGUAGE.tagCategoryObj.tag, 2, labels, tempRes)
                setPlaceHolderText(JA_LANGUAGE.selectLabel)
                break
            default:
                setLabelWithType('category', EN_LANGUAGE.tagCategoryObj.category, 1, labels, tempRes)
                setLabelWithType('tag', EN_LANGUAGE.tagCategoryObj.tag, 2, labels, tempRes)
                setPlaceHolderText(EN_LANGUAGE.selectLabel)
        }
        setRenderLabels(tempRes)
    }, [labels, selectedLanguage])

    useEffect(() => {
        const filterLabelsList = sessionStorage.getItem(STORAGE_KEY.filterLabelsList)
        if (filterLabelsList) {
            setLabels(JSON.parse(filterLabelsList))
        }
        else {
            getAllLabels().then((res: Array<Label>) => {
                if (res && res.length > 0) {
                    const newfilterLabelsList = res.filter((label: Label) => !label.name.startsWith('language'))
                    setLabels(newfilterLabelsList)
                    sessionStorage.setItem(STORAGE_KEY.filterLabelsList, JSON.stringify(newfilterLabelsList))
                }
            })
        }
        /* eslint-disable-next-line */
    }, [])

    return (<Layout id="searchBarArea">
        {/* labels.length > 0 is necessary otherwise the tagRender will throw error because labels may be [] or being got when labels.find run. */}
        {renderLabels.length > 0 &&
            <Select
                mode="multiple"
                allowClear
                showArrow
                tagRender={tagRender}
                placeholder={placeHolderText}
                onChange={handleChange}
                onDropdownVisibleChange={handleDropDown}
                value={selectedFilterLabel.map(label => label.id)}
                virtual={false} /* to solve the scroll penetration issue on mobile. */
                showSearch={false}
                style={{
                    width: '100%',
                    borderStyle: props.renderMode && !props.isLoading ? 'solid' : 'null',
                    borderColor: config.antdProps.themeColor,
                    borderRadius: props.renderMode && !props.isLoading ? '6px' : '0px',
                    marginBottom: props.isLoading ? '' : '0.5em'
                }}
            >
                {renderLabels.map(label => (
                    <Select.Option key={label.id} value={label.id} disabled={label!.description.startsWith(typeIdentifiedDescription)}>
                        {!label!.description.startsWith(typeIdentifiedDescription) ? <Tag
                            color={label?.name.startsWith('category') ? 'cyan' : '#' + label!.color}
                            style={{
                                marginRight: 3,
                                color: lightOrDark(label!.color),
                                borderRadius: '1em'
                            }}
                        >
                            <Text strong style={{ color: lightOrDark(label!.color) }}>{label!.name.split(':')[1]}</Text>
                        </Tag>
                            :
                            <Text strong>{label!.name}</Text>
                        }

                    </Select.Option>
                ))}
            </Select>
        }
    </Layout>)
}

const FilterBarCompo = (props: BlogListSearchBarProps) => <FilterBar {...props} />
export default FilterBarCompo