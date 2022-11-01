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


const getLocale = function (lang: string) {
    switch (lang) {
        case ZH_LANGUAGE.key:
            return ZH_LANGUAGE.momentTextObj
        case JA_LANGUAGE.key:
            return JA_LANGUAGE.momentTextObj
        default:
            return EN_LANGUAGE.momentTextObj
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

export const transferLabelWithSpaceByURLEncode = (str: string) => {
    if (str.indexOf(' ') > 0) {
        let resStrList = str.split(':')
        resStrList[1] = resStrList[1].replace(' ', '%20')
        return '%22' + resStrList[0] + ':' + resStrList[1] + '%22'
    }
    return str
}