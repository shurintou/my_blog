import { parseISO } from 'date-fns'
import moment from 'moment'
import 'moment/locale/ja'
import 'moment/locale/en-gb'
import 'moment/locale/zh-cn'
import { SYMBOL, I18N } from '../config/constant'
import { I18NObjectKey, Label } from '../types/index'
import { getLocalHtmlLang } from './userAgent'

export const parseISODate = function (date: string) {
    return parseISO(date)
}

export const parseISODateStr = function (date: string) {
    const parsedDate: Date = parseISO(date)
    return parsedDate.toDateString() + ' ' + parsedDate.toLocaleTimeString()
}


const getLocale = function (lang: string) {
    return I18N[lang as I18NObjectKey].momentTextObj
}

export const getDateFromNow = function (date: Date, lang: string) {
    moment.locale(getLocale(lang)?.locale)
    return moment(moment(date, "YYYYMMDD"), "YYYYMMDD").fromNow()
}


export const getDateFromNowText = function (lang: string, createType: boolean) {
    if (createType) {
        return getLocale(lang)!.createText
    }
    return getLocale(lang)!.updateText
}

export const transferLabelWithSpaceByURLEncode = (str: string) => {
    if (str.indexOf(' ') > 0) {
        let resStrList = str.split(':')
        resStrList[1] = resStrList[1].replace(' ', '%20')
        return '%22' + resStrList[0] + ':' + resStrList[1] + '%22'
    }
    return str
}

export const transferSelectedFilterLabelToQueryString = (labelList: Label[]) => {
    let categoryQueryStr: string = ''
    if (labelList.length > 0) {
        labelList.forEach(category => categoryQueryStr += '+label:' + transferLabelWithSpaceByURLEncode(category.name))
    }
    return categoryQueryStr
}

export const transferSearchParamsStr = (itemList: Array<number | string>) => {
    let searchParamsStr: string = ''
    let i = 0
    if (itemList.length > 0) {
        itemList.forEach(item => {
            searchParamsStr += (i === 0 ? '' : SYMBOL.searchParamsSpliter) + (item)
            i++
        })
    }
    return searchParamsStr
}

export const transferContentLanguageToQueryString = (contentLanguageList: Array<string>) => {
    let contentLanguageQueryStr: string = ''
    let languageQuery: string

    if (contentLanguageList.length > 0) {
        contentLanguageList.forEach(contentLanguage => {
            languageQuery = I18N[contentLanguage as I18NObjectKey].upperCase
            languageQuery = 'language:' + languageQuery + ','
            contentLanguageQueryStr += languageQuery
        })
        contentLanguageQueryStr = 'label:' + contentLanguageQueryStr
    }
    else {
        languageQuery = I18N[getLocalHtmlLang() as I18NObjectKey].upperCase
        contentLanguageQueryStr = 'label:language:' + languageQuery
    }

    return contentLanguageQueryStr
}