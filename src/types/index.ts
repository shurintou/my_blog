import { CSSProperties, ReactElement } from "react"

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


export interface PostInfoRequestParam {
    number: number,
}

export interface PostsItemRes {
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

export interface KeywordSearchItemRes extends PostsItemRes {
    text_matches: Array<TextMatch>
}

export interface TextMatch {
    object_type: string,
    property: string,
    fragment: string,
    matches: Array<Match>
}

export interface Match {
    text: string,
    indices: [number, number]
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

export interface PostListItem extends PostsItemRes {
    created_at_local: string,
    updated_at_local: string,
    created_from_now: string,
    updated_from_now: string,
    index?: number,
    listLength?: number,
    clickable?: boolean,
    layoutStyle?: CSSProperties | undefined,
}

export interface KeywordSearchListItem extends KeywordSearchItemRes {
    created_at_local: string,
    updated_at_local: string,
    created_from_now: string,
    updated_from_now: string,
    index?: number,
    listLength?: number,
    clickable?: boolean,
}

export interface Label {
    id: number,
    name: string,
    color: string,
    description: string,
}


export interface MarkdownProps {
    postText: string | undefined,
    layoutStyle?: CSSProperties | undefined,
}

export interface GitalkProps {
    postId: number,
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
    layoutStyle?: CSSProperties | undefined,
}

type Dispatch<A> = (value: A) => void

type SetStateAction<S> = S | ((prevState: S) => S)

export interface LikeCompProps<S> {
    number: number,
    likeHandler: Dispatch<SetStateAction<number>>,
}

export interface PostGetLikeData {
    issue_number: number,
    content: string,
    per_page: number,
}

export interface PostPostLikeData {
    number: number,
    content: string,
}

export interface DeletePostReactionData {
    id: number,
    number: number,
}

export interface PostLikeReactionByGraphQl {
    node: {
        databaseId: number,
        content: string,
        user: {
            databaseId: number,
            login: string,
        }
    }
}

export interface PostLikeReactionResByGraphQl {
    data: {
        repository: {
            issue: {
                reactions: {
                    edges: Array<PostLikeReactionByGraphQl>
                }
            }
        }
    }
}

export interface LabelsCompoProps {
    labelList: Array<Label>,
    setPostLanguage: Dispatch<SetStateAction<string>>,
    layoutStyle?: CSSProperties | undefined
}

export interface PostListPaginationrProps {
    total: number,
    renderMode: boolean,
}

export interface PostSearchRequestParam {
    query?: string,
    page: number,
    per_page?: number,
    sort?: string,
    order?: string,
    textMatch?: boolean,
}

export interface PostSearchResponse {
    total_count: number,
    items: Array<PostsItemRes>,
}

export interface KeywordSearchResponse {
    total_count: number,
    items: Array<KeywordSearchItemRes>,
}

export interface LanguageState {
    value: string
}

export interface MarkdownChild {
    type?: { name?: string }
}

export interface FilterLabelState {
    value: Array<Label>
}

export interface PostListSearchBarProps {
    isLoading: boolean,
    renderMode: boolean,
    itemClickableHandler: Function,
}

export interface ContentLanguageListState {
    value: Array<string>
}

export interface LanguageCheckBoxProps {
    reactEl: React.ReactElement
}

export interface SearchModalOpenState {
    value: boolean
}

export interface SearchKeywordState {
    value: string
}