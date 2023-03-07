import { I18NObjectKey } from '../types'
import { I18N } from './constant'
import { InfoCircleFilled, ExclamationCircleFilled, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons'

const basicAlertStyle = {
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '5px',
    paddingTop: '0.8em',
    paddingLeft: '1.0em',
    paddingRight: '1.0em',
    minWidth: 'max-content',
    lineHeight: '1em',
    fontSize: '1em',
    display: 'block',
}

const basicIconStyle = {
    fontSize: '1.2em',
    marginRight: '0.4em'
}

const configObj = {
    antdProps: {
        themeColor: '#1DA57A',
        borderColor: '#d0d7de',
        titleBackgroundColor: '#d0d7de',
        paginationTextColor: '#FFFFFF',
        modalBackgroundColor: '#f9f9f9',
        searchResultItemBackgroundColor: '#FFFFFF',
        shadowColor: '#d0d7de',
        highlightTextColor: 'black',
        highlightTextBackgroundColor: 'yellow',
        listItemBackgroundColor: '#FFFFFF',
        postBackgroundColor: '#FFFFFF',
        inactiveTabFontColor: '#d0d7de'
    },
    postProps: {
        postListItemCountPerPage: 5,
        commentCountPerPage: 10,
        previewLine: 3,
    },
    aboutProps: {
        messageBoardIssueId: 10
    },
    eventProps: {
        resizeDebounceDelay: 300,
        scrollDebounceDelay: 100,
        searchDebounceDelay: 800,
    },
    markdownProps: {
        trBackgroundColorDark: '#f6f8fa',
        trBackgroundColorLight: '#ffffff',
        trBorderColor: '#d0d7de',
        hLeftBorderColor: '#1DA57A',
        hBottomBorderColor: '#d0d7de',
    },
    alertProps: {
        success: { style: { ...basicAlertStyle, backgroundColor: '#f6ffed', borderColor: '#b7eb8f', }, icon: CheckCircleFilled, iconStyle: { ...basicIconStyle, color: '#52c41a' } },
        info: { style: { ...basicAlertStyle, backgroundColor: '#e6f4ff', borderColor: '#91caff', }, icon: InfoCircleFilled, iconStyle: { ...basicIconStyle, color: '#1677ff' } },
        warning: { style: { ...basicAlertStyle, backgroundColor: '#fffbe6', borderColor: '#ffe58f', }, icon: ExclamationCircleFilled, iconStyle: { ...basicIconStyle, color: '#faad14' } },
        error: { style: { ...basicAlertStyle, backgroundColor: '#fff2f0', borderColor: '#ffccc7', }, icon: CloseCircleFilled, iconStyle: { ...basicIconStyle, color: '#ff4d4f' } },
    },
    languageProps: Object.keys(I18N).map(language => ({
        'label': I18N[language as I18NObjectKey].label,
        'key': I18N[language as I18NObjectKey].key,
    })),
    searchHistoryCount: 10,
}

export default configObj