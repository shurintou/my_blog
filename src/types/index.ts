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


export interface BlogRequestParam {
    labels?: Array<string>,
    page?: number,
    per_page?: number,
}

export interface BlogInfoRequestParam {
    number: number,
}

export interface BlogsItemRes {
    id: number,
    number: number,
    title: string,
    body: string,
    comments: number,
    reactions: ReactionItem,
    labels: Array<Label>,
    created_at: string,
    updated_at: string,
}

export interface BlogsListItem extends BlogsItemRes {
    created_at_local: string,
    updated_at_local: string,
    created_from_now: string,
    updated_from_now: string,
    index?: number,
    listLength?: number,
}

export interface Label {
    id: number,
    name: string,
    color: string,
    description: string,
}

export interface ReactionItem {
    [+1]: number,
    laugh: number,
    heart: number,
}

export interface MarkdownProps {
    blogText: string | undefined
}

export interface GitalkProps {
    blogId: number
}

export interface DateCompProps {
    dateLocal: string,
    dateFromNow: string,
    text: string,
}