import { parseISO } from 'date-fns'
import moment from 'moment'

export const parseISODate = function (date: string) {
    return parseISO(date)
}

export const parseISODateStr = function (date: string) {
    const parsedDate: Date = parseISO(date)
    return parsedDate.toDateString() + ' ' + parsedDate.toLocaleTimeString()
}

export const getDateFromNow = function (date: Date) {
    return moment(moment(date, "YYYYMMDD"), "YYYYMMDD").fromNow()
}