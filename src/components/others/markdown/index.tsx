import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Typography, } from 'antd'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MarkdownProps } from '../../../types/index'
import config from '../../../config/config'
import { doScrolling, curry } from '../../../utils/common'
import markdownStyle from './index.module.css'
const { Link } = Typography

const Markdown: React.FC<MarkdownProps> = (props) => {
    const { blogText } = props
    const anchorStr = '#anchor'
    const hRenderFunc = ({ level, children, }: { [key: string]: any }) => {
        const fontSize = (7 - level) * 0.5 + 0.5
        const reg = new RegExp(anchorStr + '\\d', 'i')
        const match = String(children).match(reg)
        children = String(children).replace(reg, '')
        let hProps: { [key: string]: any } = { style: { fontSize: fontSize + 'em', marginBottom: '0em' }, children: children }
        if (match) {
            hProps['id'] = match[0].split('#')[1]
        }
        return React.createElement('h' + level, hProps)
    }
    const scrollToAnchor = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, anchorId: string | undefined) => {
        e.preventDefault()
        if (anchorId) {
            const anchorEl = document.querySelector(anchorId)
            if (anchorEl) {
                doScrolling(anchorEl, 500)
            }
        }
        return false
    }
    const thTdRenderFunc = (tagName: string, { children }: { [key: string]: any }) => {
        let thTdProps: { [key: string]: any } = { style: { borderStyle: 'solid', borderWidth: '2px', borderColor: config.markdownProps.trBorderColor, padding: '0.4em 0.8em', textAlign: 'center' }, children: children }
        return React.createElement(tagName, thTdProps)
    }
    const curringThTdRenderFunc = curry(thTdRenderFunc)

    return (
        <ReactMarkdown
            children={blogText ? blogText : ''}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            className={markdownStyle.textFontSize}
            includeElementIndex={true}
            components={{
                h1: hRenderFunc,
                h2: hRenderFunc,
                h3: hRenderFunc,
                h4: hRenderFunc,
                h5: hRenderFunc,
                h6: hRenderFunc,
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={tomorrow ? tomorrow : undefined}
                            customStyle={{ borderRadius: '6px' }}
                            language={match[1]}
                            PreTag="div"
                        />
                    ) : (
                        <code
                            style={{
                                padding: '.2em .4em',
                                margin: 0,
                                backgroundColor: 'rgba(175,184,193,0.2)',
                                borderRadius: '6px',
                            }}
                            className={className}
                            {...props}>
                            {children}
                        </code>
                    )
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
                    return href && href.startsWith('#') ?
                        <Link onClick={(e) => scrollToAnchor(e, href)}>{children}</Link>
                        :
                        <Link href={href} target='_blank'>{children}</Link>
                },
                table({ children }) {
                    return <div style={{ overflowX: 'auto' }}><table>{children}</table></div>
                },
                tr({ children, isHeader, index, }) {
                    return <tr style={{
                        borderStyle: 'solid',
                        borderWidth: '2px',
                        borderColor: config.markdownProps.trBorderColor,
                        backgroundColor: (isHeader || (index && index % 2 === 1)) ? undefined : config.markdownProps.trBackgroundColor
                    }}>{children}</tr>
                },
                th: curringThTdRenderFunc('th'),
                td: curringThTdRenderFunc('td'),
            }}
        />
    )
}

const MarkdownModule = (props: MarkdownProps) => <Markdown {...props}></Markdown>

export default MarkdownModule