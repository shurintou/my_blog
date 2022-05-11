import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MarkdownProps } from '../../../types/index'
import config from '../../../config/config'

const Markdown: React.FC<MarkdownProps> = (props) => {
    const { blogText } = props

    return (
        <ReactMarkdown
            children={blogText ? blogText : ''}
            remarkPlugins={[remarkGfm, remarkBreaks]}
            components={{
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
                                fontSize: '85%',
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
                        <blockquote {...props} style={{
                            borderLeft: '.25em solid',
                            borderLeftColor: config.antdProps.borderColor,
                            padding: '0 1em'
                        }}>
                            {children}
                        </blockquote>
                    )
                }
            }}
        />
    )
}

const MarkdownModule = (props: MarkdownProps) => <Markdown {...props}></Markdown>

export default MarkdownModule