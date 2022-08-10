import React from 'react'

export const ZH_LANGUAGE = {
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

}
export const JA_LANGUAGE = {
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

}
export const EN_LANGUAGE = {
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

}

