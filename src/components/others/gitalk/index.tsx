import React, { useEffect } from 'react'
import Gitalk from "gitalk"
import 'gitalk/dist/gitalk.css'
import { GitalkProps } from '../../../types/index'
import config from '../../../config/config'
import { useAppSelector } from '../../../redux/hooks'

const GitalkCompo: React.FC<GitalkProps> = (props) => {
    const selectedLanguage = useAppSelector((state) => state.language.value)

    const { blogId } = props

    useEffect(() => {
        function renderGitalk(blogId: number) {
            const gitalkProps = { ...config.gitProps, language: selectedLanguage, number: blogId, perPage: config.blogProps.commentCountPerPage }
            const gitalk = new Gitalk(gitalkProps)
            const gitalkContainerEl = document.querySelector('#gitalk-container')
            if (gitalkContainerEl) { // gitalk didn't offer any api to rerender the component so do it manually.
                let childEls = gitalkContainerEl.childNodes
                childEls.forEach(childEl => {
                    gitalkContainerEl.removeChild(childEl)
                })
            }
            gitalk.render('gitalk-container')
        }
        renderGitalk(blogId)

    }, [blogId, selectedLanguage])

    return (
        <div id="gitalk-container" lang={selectedLanguage}></div>
    )
}

const GitalkModule = (props: GitalkProps) => <GitalkCompo {...props}></GitalkCompo>

export default GitalkModule