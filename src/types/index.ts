import { ReactElement } from "react"

export interface GitUser {
    id: number,
    login: string, //username,
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


export interface BlogInfoRequestParam {
    number: number,
}

export interface BlogsItemRes {
    id: number,
    number: number,
    title: string,
    body: string,
    comments: number,
    labels: Array<Label>,
    reactions: Reactions,
    created_at: string,
    updated_at: string,
}

export interface Reactions {
    "total_count": number,
    "+1": number,
    "-1": number,
    "laugh": number,
    "hooray": number,
    "confused": number,
    "heart": number,
    "rocket": number,
    "eyes": number
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


export interface MarkdownProps {
    blogText: string | undefined
}

export interface GitalkProps {
    blogId: number,
    shouldRender: boolean,
}

export interface DateCompProps {
    dateLocal: string,
    dateFromNow: string,
    text: string,
}

export interface CommentCompProps {
    text: ReactElement,
    slot: ReactElement,
    title: string,
}

type Dispatch<A> = (value: A) => void

type SetStateAction<S> = S | ((prevState: S) => S)

export interface LikeCompProps<S> {
    number: number,
    likeHandler: Dispatch<SetStateAction<number>>,
}

export interface BlogGetLikeData {
    issue_number: number,
    content: string,
    per_page: number,
}

export interface BlogPostLikeData {
    number: number,
    content: string,
}

export interface DeleteBlogReactionData {
    id: number,
    number: number,
}

export interface BlogLikeReactionByGraphQl {
    node: {
        databaseId: number,
        content: string,
        user: {
            databaseId: number,
            login: string,
        }
    }
}

export interface BlogLikeReactionResByGraphQl {
    data: {
        repository: {
            issue: {
                reactions: {
                    edges: Array<BlogLikeReactionByGraphQl>
                }
            }
        }
    }
}

export interface LabelsCompoProps {
    labelList: Array<Label>,
    setBlogLanguage: Dispatch<SetStateAction<string>>,
}

export interface BlogListFooterProps {
    total: number,
    renderMode: boolean,
}

export interface BlogSearchRequestParam {
    query?: string,
    page: number,
    per_page?: number,
    sort?: string,
    order?: string,
}

export interface BlogSearchResponse {
    total_count: number,
    items: Array<BlogsItemRes>,
}

export interface LanguageState {
    value: string
}

export interface MarkdownChild {
    type?: { name?: string }
}