import { PendingRequest } from '../types/index'

export const isSameRequest = function (req1: PendingRequest, req2: PendingRequest) {
    if (req1.url !== req2.url) {
        return false
    }
    if (req1.method !== req2.method) {
        return false
    }
    if (req1.params && req2.params) {
        return isSameObjectSimple(req1.params, req2.params)
    }
    if (req1.data && req2.data) {
        return isSameObjectSimple(req1.data, req2.data)
    }
    return false
}

export const isSameObjectSimple = function (req1: any, req2: any) {
    let str1
    let str2
    if (typeof req1 === 'object') {
        str1 = JSON.stringify(req1)
    }
    else {
        str1 = req1
    }
    if (typeof req2 === 'object') {
        str2 = JSON.stringify(req2)
    }
    else {
        str2 = req2
    }
    return str1 === str2
}

export function lightOrDark(bg2Color: string) {
    return (parseInt(bg2Color.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff'
}

export function debounce(fn: Function, delay?: number) {
    let timer: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.call(this, args)
        }, delay ? delay : 300)
    }
}

/* From: https://jsfiddle.net/s61x7c4e/ */
export function doScrolling(element: Element, duration: number) {

    const startingY: number = window.pageYOffset
    const windowInnerHeight: number = window.innerHeight || document.documentElement.clientHeight
    const elementY: number = window.pageYOffset + element.getBoundingClientRect().top - (windowInnerHeight / 12)

    // If element is close to page's bottom then window will scroll only to some position above the element.
    const targetY: number = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
    const diff: number = targetY - startingY
    // Easing function: easeInOutCubic
    // From: https://gist.github.com/gre/1650294
    const easing = function (t: number) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
    let start: number

    if (!diff) return

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp
        // Elapsed miliseconds since start of scrolling.
        const time: number = timestamp - start
        // Get percent of completion in range [0, 1].
        let percent: number = Math.min(time / duration, 1)
        // Apply the easing.
        // It can cause bad-looking slow frames in browser performance tool, so be careful.
        percent = easing(percent)

        window.scrollTo(0, startingY + diff * percent)

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step)
        }
    })
}