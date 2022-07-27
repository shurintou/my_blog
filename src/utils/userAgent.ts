import conf from '../config/config'

export function getBrowserLanguage() {
    const browserLanguage = navigator.language.toLowerCase()

    const result = conf.languageProps.find(languageItem => browserLanguage.indexOf(languageItem.key) !== -1)
    if (result) return result

    return conf.languageProps[0] //default language 'en'
}

const localStorageHtmlLangKey = 'html_lang'

export function setLocalHtmlLang(lang: string) {
    const lowerCaseLang = lang.toLowerCase()
    document.querySelector('html')?.setAttribute('lang', lowerCaseLang)
    if (languageExistInConfig(lowerCaseLang)) {
        localStorage.setItem(localStorageHtmlLangKey, lowerCaseLang)
    }
    else {
        localStorage.setItem(localStorageHtmlLangKey, getBrowserLanguage().key)
    }
}

export function getLocalHtmlLang() {
    const localHtmlLang = localStorage.getItem(localStorageHtmlLangKey)
    if (localHtmlLang != null && languageExistInConfig(localHtmlLang)) {
        return localHtmlLang
    }
    return getBrowserLanguage().key
}

function languageExistInConfig(lang: string | null) {
    return conf.languageProps.some(language => language.key === lang)
}