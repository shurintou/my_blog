export interface configObj {
    gitProps: gitProps
}

export interface gitProps {
    clientID: string,
    clientSecret: string,
    repo: string,
    owner: string,
    admin: Array<string>
}

export interface AboutDataList {
    Skills: Array<LanguageItem>,
    Languages: Array<LanguageItem>,
    [key: string]: any
}

export interface LanguageItem {
    language: string,
    imgSrc: string,
    link: string,
    [key: string]: any
}

export interface getRepoInfoParam {

}

export interface antdColPropObj {
    xs: antdColSubPropObj,
    sm: antdColSubPropObj,
    md: antdColSubPropObj,
    lg: antdColSubPropObj,
    xl: antdColSubPropObj,
}

export interface antdColSubPropObj {
    span?: number,
    offset?: number,
}