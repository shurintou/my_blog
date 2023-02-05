import { I18NObjectKey } from '../types'
import { I18N } from './constant'

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
        trBackgroundColor: '#f6f8fa',
        trBorderColor: '#d0d7de',
        hLeftBorderColor: '#1DA57A',
        hBottomBorderColor: '#d0d7de',
    },
    languageProps: Object.keys(I18N).map(language => ({
        'label': I18N[language as I18NObjectKey].label,
        'key': I18N[language as I18NObjectKey].key,
    }))
}

export default configObj