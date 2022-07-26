import conf from '../config/config'

export function getBrowserLanguage() {
    const browserLanguage = navigator.language.toLowerCase()

    const result = conf.languageProps.find(languageItem => browserLanguage.indexOf(languageItem.key) !== -1)
    if (result) return result

    return conf.languageProps[0]
}