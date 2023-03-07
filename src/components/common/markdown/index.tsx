import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Typography, Image, Layout, Space, Tabs } from 'antd'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MarkdownProps, MarkdownChild, CodeBlockType, ConfigObjectKey } from '../../../types/index'
import config from '../../../config/config'
import { I18N } from '../../../config/constant'
import { doScrolling, curry, findCharIndexOfString } from '../../../utils/common'
import markdownStyle from './index.module.css'
import { ROUTER_NAME } from '../../../config/constant'
import "./index.css"
import { SyntaxHighlighterProps } from 'react-syntax-highlighter'
const { Link } = Typography

const Markdown = (props: MarkdownProps) => {
    const { postText } = props
    const { postLang } = props
    const anchorStr = '#anchor'
    const hRenderFunc = ({ level, children, }: { [key: string]: any }) => {
        const fontSize = (7 - level) * 0.15 + 0.8
        const reg = new RegExp(anchorStr + '\\d', 'i')
        const match = String(children).match(reg)
        children = String(children).replace(reg, '')
        let hProps: { [key: string]: any } = { style: { fontSize: fontSize + 'em', marginTop: (0.1 * (5 - level) + 1) + 'em', fontWeight: 700 }, children: children }
        if (match) {
            hProps['id'] = match[0].split('#')[1]
        }
        if (level === 3) {
            let style = hProps['style']
            style['borderLeft'] = config.markdownProps.hLeftBorderColor + ' solid 8px'
            style['paddingLeft'] = '0.5em'
        }
        else if (level < 3) {
            let style = hProps['style']
            style['borderBottom'] = config.markdownProps.hBottomBorderColor + ' solid ' + (level === 1 ? '8px' : '4px')
            style['paddingLeft'] = '0.5em'
        }
        return React.createElement('h' + level, hProps)
    }
    const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string | undefined) => {
        e.preventDefault()
        if (window.location.href.indexOf(ROUTER_NAME.list) >= 0) { // do nothing if the a tag is clicked at the list page.
            return false
        }
        if (href && href.startsWith('#')) {
            const anchorEl = document.querySelector(href)
            if (anchorEl) {
                doScrolling(anchorEl, 500)
            }
        }
        else {
            window.open(href, '_blank')
        }
        return false
    }
    const thTdRenderFunc = (tagName: string, { children }: { [key: string]: any }) => {
        let thTdProps: { [key: string]: any } = { style: { borderStyle: 'solid', borderWidth: '2px', borderColor: config.markdownProps.trBorderColor, padding: '0.4em 0.8em', textAlign: 'center' }, children: children }
        return React.createElement(tagName, thTdProps)
    }
    const curringThTdRenderFunc = curry(thTdRenderFunc)



    const replacePTag = ({ children, }: { [key: string]: any }) => {
        if (children.some((child: MarkdownChild) => child?.type?.name === 'img')) {
            return React.createElement('div', { children: children }) // to fix the warning that "validateDOMnesting(...): <div> cannot appear as a descendant of <p>"
        }
        return <p style={{ fontSize: props.isInAlertBlock ? '0.8em' : '1em', lineHeight: props.isInAlertBlock ? 1 : (postLang === I18N.en.key ? '2em' : '2.5em') }}>{children}</p>
    }

    /* to get the substring of postText by previewLine to imporve the markdown rendering performance */
    const subStringOfPostText = (postText: string) => {
        const lastEnterIndexOfMaxPreviewLine = findCharIndexOfString(postText, '\r\n', config.postProps.previewLine)
        return postText.substring(0, lastEnterIndexOfMaxPreviewLine)
    }

    const isAtListPage = () => window.location.href.indexOf(ROUTER_NAME.list) >= 0
    const TabPane = Tabs.TabPane
    const [tabKey, setTabKey] = useState('0')
    const codeBorderRadius = { borderRadius: '6px' }
    const codeFontSize = { fontSize: '1.2em' }
    const codeFontWeight = { fontWeight: 'bold' }
    return (
        (<div style={{ ...props.layoutStyle, flex: 1 }}>
            <ReactMarkdown
                children={postText ? (isAtListPage() ? subStringOfPostText(postText) : postText) : ''}
                remarkPlugins={[remarkGfm, remarkBreaks]}
                className={markdownStyle.textFontSize}
                includeElementIndex={true}/* This line will cause a Warning like "React does not recognize the `siblingCount` prop on a DOM element...", but it is necessary for getting index so I kept it. */
                components={{
                    h1: hRenderFunc,
                    h2: hRenderFunc,
                    h3: hRenderFunc,
                    h4: hRenderFunc,
                    h5: hRenderFunc,
                    h6: hRenderFunc,
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const codeBlockType = match?.at(1) as CodeBlockType
                        const isAlertType = ['success', 'info', 'warning', 'error'].includes(codeBlockType)
                        const isMultiType = 'multi' === codeBlockType
                        const AlertIcon = config.alertProps[codeBlockType as ConfigObjectKey]?.icon
                        let tabStr: Array<string> = []
                        let maxTabLine = 0
                        let tabList: Array<SyntaxHighlighterProps> = []
                        if (isMultiType) {
                            tabStr = String(children).replace(/\n$/, '').split('```').filter((_, index) => index > 0)
                            tabStr.forEach(codeTab => {
                                const codeTabSplitByLinebreak = codeTab.split('\r\n')
                                while (codeTabSplitByLinebreak[codeTabSplitByLinebreak.length - 1] === "") {
                                    codeTabSplitByLinebreak.pop()
                                }
                                if (codeTabSplitByLinebreak.length > maxTabLine) {
                                    maxTabLine = codeTabSplitByLinebreak.length
                                }
                                tabList.push({
                                    language: codeTabSplitByLinebreak[0].split(' ')[0],
                                    children: [codeTabSplitByLinebreak.filter((_, index) => index > 0).join('\r\n'), codeTabSplitByLinebreak[0].split(' ')[1]],
                                })
                            })
                        }
                        return !inline && match && !isAtListPage() ? (
                            isAlertType ?
                                <Layout style={config.alertProps[codeBlockType as ConfigObjectKey].style}>
                                    <AlertIcon style={config.alertProps[codeBlockType as ConfigObjectKey].iconStyle} />
                                    <Space wrap size={16}>
                                        <MarkdownModule postText={children.toString()} isInAlertBlock={true} postLang={postLang}></MarkdownModule>
                                    </Space>
                                </Layout>
                                :
                                (
                                    isMultiType ?
                                        <Tabs
                                            defaultActiveKey="0"
                                            activeKey={tabKey}
                                            style={{ backgroundColor: 'rgb(45, 45, 45)', ...codeBorderRadius }}
                                            className={'tabStyle'}
                                            type="card"
                                            tabBarGutter={0}
                                            onChange={(key) => setTabKey(key)}
                                            tabBarStyle={{ backgroundColor: 'rgb(80, 80, 80)', margin: 0, ...codeBorderRadius }}
                                        >
                                            {
                                                tabList.map((tab, i) => (
                                                    <TabPane
                                                        key={i}
                                                        tab={<span style={{
                                                            ...codeFontSize,
                                                            ...codeFontWeight,
                                                            color: tabKey === i.toString() ? config.antdProps.themeColor : config.antdProps.inactiveTabFontColor,
                                                        }}
                                                        >
                                                            {tab.children[1]}
                                                        </span>}
                                                    >
                                                        <SyntaxHighlighter
                                                            children={tab.children[0]}
                                                            style={tomorrow ? tomorrow : undefined}
                                                            customStyle={{ ...codeBorderRadius, height: (1.6 * maxTabLine) + 'em', ...codeFontSize, ...codeFontWeight }}
                                                            language={tab.language}
                                                            PreTag="div"
                                                        />
                                                    </TabPane>
                                                ))}
                                        </Tabs>
                                        :
                                        <SyntaxHighlighter
                                            children={String(children).replace(/\n$/, '')}
                                            style={tomorrow ? tomorrow : undefined}
                                            customStyle={{ ...codeBorderRadius, ...codeFontWeight, }}
                                            language={match[1]}
                                            PreTag="div"
                                        />
                                )
                        ) : (
                            children.toString().trim().length > 0 ?
                                <code
                                    style={{
                                        padding: '.2em .4em',
                                        margin: 0,
                                        backgroundColor: 'rgba(175,184,193,0.2)',
                                        ...codeBorderRadius,
                                    }}
                                    className={className}
                                    {...props}>
                                    {children}
                                </code>
                                :
                                <span></span>
                        );
                    },
                    blockquote({ node, className, children, ...props }) {
                        return (
                            <blockquote
                                {...props}
                                /* set the margin of p tag in blockquote 0, to prevent the overflow of borderLeft.  */
                                className={markdownStyle.pTagInsideBlockquote}
                                style={{
                                    borderLeft: '.25em solid',
                                    borderLeftColor: config.antdProps.borderColor,
                                    padding: '0 1em',
                                }}>
                                {children}
                            </blockquote>
                        )
                    },
                    a({ children, href }) {
                        return <Link underline onClick={(e) => scrollToAnchor(e, href)}>{children}</Link>
                    },
                    table({ children }) {
                        return <div style={{ overflowX: 'auto' }}><table>{children}</table></div>
                    },
                    tr({ children, isHeader, index, }) {
                        return <tr
                            className={markdownStyle.tableTr}
                            style={{
                                borderStyle: 'solid',
                                borderWidth: '2px',
                                borderColor: config.markdownProps.trBorderColor,
                                backgroundColor: (isHeader || (index && index % 2 === 1)) ? config.markdownProps.trBackgroundColorDark : config.markdownProps.trBackgroundColorLight
                            }}>{children}</tr>
                    },
                    th: curringThTdRenderFunc('th'),
                    td: curringThTdRenderFunc('td'),
                    img({ src, alt, }) {
                        if (isAtListPage()) {
                            return <span></span> //not render img when at the list page.
                        }
                        return <Image alt={alt} src={src} style={{ maxWidth: '100%', marginBottom: '1em' }} />
                    },
                    p: replacePTag,
                    li({ children }) {
                        return <li style={{ marginBottom: '1em', lineHeight: props.isInAlertBlock ? 1 : '2em' }}>{children}</li>
                    },
                }}
            />
        </div >)
    );
}

const MarkdownModule = (props: MarkdownProps) => <Markdown {...props}></Markdown>

export default MarkdownModule