export interface ConfigObj {
    gitProps: GitProps
}

export interface GitProps {
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

export interface GetRepoInfoParam {

}

export interface RepoInfoRes {
    has_issues: boolean,
    open_issues_count: number
}

export interface AntdColPropObj {
    xs: AntdColSubPropObj,
    sm: AntdColSubPropObj,
    md: AntdColSubPropObj,
    lg: AntdColSubPropObj,
    xl: AntdColSubPropObj,
}

export interface AntdColSubPropObj {
    span?: number,
    offset?: number,
}

export interface PendingRequest {
    url: string | undefined,
    method: string | undefined,
    params?: any,
    data?: any,
}
