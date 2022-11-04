import { ZH_LANGUAGE, JA_LANGUAGE, EN_LANGUAGE } from './constant'

const configObj = {
    gitProps: {
        clientID: 'username',
        clientSecret: 'password',
        repo: 'shurintou.github.io',
        owner: 'shurintou',
        admin: ['shurintou'],
    },
    antdProps: {
        themeColor: '#1DA57A',
        borderColor: '#d0d7de',
        titleBackgroundColor: '#d0d7de',
        paginationTextColor: '#FFFFFF',
    },
    postProps: {
        postListItemCountPerPage: 5,
        commentCountPerPage: 10,
        previewLine: 5,
    },
    aboutProps: {
        messageBoardIssueId: 10
    },
    eventProps: {
        resizeDebounceDelay: 300,
        scrollDebounceDelay: 100,
    },
    markdownProps: {
        trBackgroundColor: '#f6f8fa',
        trBorderColor: '#d0d7de',
        hLeftBorderColor: '#1DA57A',
        hBottomBorderColor: '#d0d7de',
    },
    languageProps: [
        {
            label: EN_LANGUAGE.label,
            key: EN_LANGUAGE.key,
        },
        {
            label: ZH_LANGUAGE.label,
            key: ZH_LANGUAGE.key,
        },
        {
            label: JA_LANGUAGE.label,
            key: JA_LANGUAGE.key,
        },
    ]
}

export default configObj