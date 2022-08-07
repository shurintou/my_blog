import { parseISO } from 'date-fns'
import moment from 'moment'
import 'moment/locale/ja'
import 'moment/locale/en-gb'
import 'moment/locale/zh-cn'
import { EN_LANGUAGE, ZH_LANGUAGE, JA_LANGUAGE } from '../config/constant'

export const parseISODate = function (date: string) {
    return parseISO(date)
}

export const parseISODateStr = function (date: string) {
    const parsedDate: Date = parseISO(date)
    return parsedDate.toDateString() + ' ' + parsedDate.toLocaleTimeString()
}


const momentLocalMap = new Map<string, { locale: string, createText: string, updateText: string }>()
momentLocalMap.set(EN_LANGUAGE.key, EN_LANGUAGE.momentTextObj)
momentLocalMap.set(ZH_LANGUAGE.key, ZH_LANGUAGE.momentTextObj)
momentLocalMap.set(JA_LANGUAGE.key, JA_LANGUAGE.momentTextObj)

const getLocale = function (lang: string) {
    switch (lang) {
        case ZH_LANGUAGE.key:
            return momentLocalMap.get(ZH_LANGUAGE.key)
        case JA_LANGUAGE.key:
            return momentLocalMap.get(JA_LANGUAGE.key)
        default:
            return momentLocalMap.get(EN_LANGUAGE.key)
    }
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