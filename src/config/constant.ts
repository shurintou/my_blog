import React from 'react'

const I18NConfig = {
    'en': {
        key: 'en',
        label: React.createElement('span', { lang: 'en' }, 'English'),
        lowerCase: 'english',
        upperCase: 'English',
        readmoreText: 'Read more',
        menuTextList: ['Home', 'Post', 'About'],
        tagCategoryObj: { tag: 'Tags:', category: 'Category:' },
        momentTextObj: { locale: 'en-gb', createText: 'Created', updateText: 'Updated' },
        likeText: 'Like',
        commentText: 'Comment',
        loginMessage: 'Please login your github account first.',
        loading: 'loading...',
        selectLabel: 'Please select labels you are interested in',
        emptyText: 'No matching post found',
        searchBarEmptyText: 'No matching category or tag found',
        checkBoxHintText: 'post language:',
        checkBoxOptionObj: { en: 'English', ja: 'Japanese', zh: 'Chinese' },
        searchHintText: 'search keyword: ',
        filterHintText: 'or filter posts by categories or tags below',
        searchBarPlaceHolder: 'Please input keyword you want to search',
        searchResult: 'search result',
        noMoreText: 'It is all, nothing more.',
        searching: 'searching...',
        errorMessage: 'Sorry, something went wrong, Please try again later.',
        pagination: (description: string, totalCount: number) => description + ' of total ' + totalCount.toString(),
        searchResultCount: (totalCount: number) => totalCount > 0 ? ', total ' + totalCount + ' records' : '',

    },
    'zh': {
        key: 'zh',
        label: React.createElement('span', { lang: 'zh' }, '简体中文'),
        lowerCase: 'chinese',
        upperCase: 'Chinese',
        readmoreText: '展开',
        menuTextList: ['主页', '文章', '关于'],
        tagCategoryObj: { tag: '标签：', category: '分类：' },
        momentTextObj: { locale: 'zh-cn', createText: '创建于', updateText: '编辑于' },
        likeText: '点赞',
        commentText: '评论',
        loginMessage: '请先登录您的Github账号。',
        loading: '加载中...',
        selectLabel: '请选择感兴趣的分类或标签',
        emptyText: '暂无匹配该条件的文章',
        searchBarEmptyText: '暂无匹配该条件的分类或标签',
        checkBoxHintText: '文章语言(多选):',
        checkBoxOptionObj: { en: '英语', ja: '日语', zh: '中文' },
        searchHintText: '搜索关键词：',
        filterHintText: '或查看以下分类或标签的文章',
        searchBarPlaceHolder: '请输入想搜索的关键词',
        searchResult: '搜索结果',
        noMoreText: '已经到底了',
        searching: '搜索中...',
        errorMessage: '抱歉出错了，请稍后重试。',
        pagination: (description: string, totalCount: number) => '第' + description + '条, 共' + totalCount.toString() + '条',
        searchResultCount: (totalCount: number) => totalCount > 0 ? '，共' + totalCount + '条' : '',

    },
    'ja': {
        key: 'ja',
        label: React.createElement('span', { lang: 'ja' }, '日本語'),
        lowerCase: 'japanese',
        upperCase: 'Japanese',
        readmoreText: '続きを読む',
        menuTextList: ['ホーム', '記事　', 'プロフィール'],
        tagCategoryObj: { tag: 'タグ：', category: 'カテゴリー：' },
        momentTextObj: { locale: 'ja', createText: '作成', updateText: '更新' },
        likeText: 'いいね',
        commentText: 'コメント',
        loginMessage: '先にGithubアカウントにログインしてください。',
        loading: '読込中...',
        selectLabel: 'ご興味のあるラベルを選択してください',
        emptyText: '該当するポストがありません',
        searchBarEmptyText: '該当するカテゴリーやタグがありません',
        checkBoxHintText: '文章の言語（複数選択可）:',
        checkBoxOptionObj: { en: '英語', ja: '日本語', zh: '中国語' },
        searchHintText: 'キーワード検索：',
        filterHintText: 'または下記カテゴリーやタグで絞り込み検索',
        searchBarPlaceHolder: '検索するキーワードを入力してください',
        searchResult: '検索結果',
        noMoreText: 'もう最後だよ',
        searching: '検索中...',
        errorMessage: '申し訳ございません、エラーになりました。しばらくお待ちになってからやり直してください。',
        pagination: (description: string, totalCount: number) => description + '件目, 全' + totalCount.toString() + '件',
        searchResultCount: (totalCount: number) => totalCount > 0 ? '、全' + totalCount + '件' : '',

    },
}

const i18nHandler = {
    get: function (i18n: typeof I18NConfig, prop: keyof typeof I18NConfig) {
        return prop in i18n ? i18n[prop] : i18n['en'] // to return 'en' as a default i18n setting.
    }
}

export const I18N = new Proxy(I18NConfig, i18nHandler)

export const ROUTER_NAME = {
    post: '/post',
    list: '/list',
    home: '/home',
    about: '/about',
    props: {
        page: 'page',
        label: 'label',
        language: 'language',
        id: 'id',
    }
}

export const STORAGE_KEY = {
    filterLabelList: 'FILTER_LABEL_LIST',
    contentLanguageList: 'CONTENT_LANGUAGE_LIST',
    gitAccessToken: 'GT_ACCESS_TOKEN',
    htmlLang: 'HTML_LANG',
    historyBackPath: 'HISTORY_BACK_PATH',
    postId: 'POST_ID_',
}

export const SYMBOL = {
    searchParamsSpliter: '+',
}